"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { type Address, isAddress } from "viem";
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";
import { useI18n } from "@/lib/I18nProvider";
import { uploadBatchMetadata, getDemoUrl, statusColors, type BatchMetadata } from "@/lib/batchUtils";
import { useAllBatches } from "@/lib/useBatches";
import { AppHeader, Field, WalletBar, ErrorBox, TxBox, FileUpload } from "@/components/ui";

export default function ProducerPage() {
  const { t } = useI18n();
  const address = getHalalChainAddress();
  const contractAddress: Address | undefined =
    address && isAddress(address) ? (address as Address) : undefined;

  const { address: walletAddress, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { batches, refetch } = useAllBatches();

  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState<BatchMetadata>({
    productName: "Keripik Singkong",
    productionDate: "",
    expiryDate: "",
    ingredients: "",
    supplier: "",
    facility: "",
  });
  const [ipfsCid, setIpfsCid] = useState("");
  const [parentBatchId, setParentBatchId] = useState("");
  const [lastBatchId, setLastBatchId] = useState<bigint | null>(null);

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuccess) return;
    void refetch();
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (!isSuccess || batches.length === 0) return;
    const latest = batches[batches.length - 1];
    setLastBatchId(latest.id);
    setStep(3);
  }, [isSuccess, batches]);

  const myBatches = batches.filter(
    (b) => walletAddress && b.batch.producer.toLowerCase() === walletAddress.toLowerCase()
  );
  const rejectedBatches = myBatches.filter((b) => b.batch.status === 3);

  async function onRegister() {
    setErr(null);
    if (!contractAddress || !isConnected) return;

    try {
      let cid = ipfsCid;
      if (!cid) {
        cid = await uploadBatchMetadata(meta);
        setIpfsCid(cid);
      }

      const parentId = parentBatchId ? BigInt(parentBatchId) : undefined;

      if (parentId) {
        await writeContractAsync({
          abi: halalChainAbi,
          address: contractAddress,
          functionName: "registerRevision",
          args: [parentId, cid],
        });
      } else {
        await writeContractAsync({
          abi: halalChainAbi,
          address: contractAddress,
          functionName: "registerBatch",
          args: [meta.productName, cid],
        });
      }
      refetch();
    } catch (e) {
      setErr(String((e as Error).message || e));
    }
  }

  const verifyUrl = lastBatchId ? `${getDemoUrl()}/verify/${lastBatchId}` : null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <AppHeader subtitle={t("producer")} />

      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
          <WalletBar
            isConnected={isConnected}
            walletAddress={walletAddress}
            isConnecting={isConnecting}
            onConnect={() => connect({ connector: injected() })}
            onDisconnect={() => disconnect()}
          />

          <div className="mt-8">
            <div className="mb-6 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full ${step >= s ? "bg-zinc-950 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="grid gap-4">
                <Field label={t("product")}>
                  <input
                    className="input-field"
                    value={meta.productName}
                    onChange={(e) => setMeta({ ...meta, productName: e.target.value })}
                  />
                </Field>
                <Field label="Production date">
                  <input
                    type="date"
                    className="input-field"
                    value={meta.productionDate}
                    onChange={(e) => setMeta({ ...meta, productionDate: e.target.value })}
                  />
                </Field>
                <Field label="Expiry date">
                  <input
                    type="date"
                    className="input-field"
                    value={meta.expiryDate}
                    onChange={(e) => setMeta({ ...meta, expiryDate: e.target.value })}
                  />
                </Field>
                <Field label="Ingredients">
                  <textarea
                    className="input-field min-h-20"
                    value={meta.ingredients}
                    onChange={(e) => setMeta({ ...meta, ingredients: e.target.value })}
                  />
                </Field>
                <button className="btn-primary" onClick={() => setStep(2)}>
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <FileUpload label={t("uploadDocs")} onCid={setIpfsCid} disabled={!isConnected} />
                <Field label={t("manualCid")}>
                  <input className="input-field font-mono" value={ipfsCid} onChange={(e) => setIpfsCid(e.target.value)} />
                </Field>
                {rejectedBatches.length > 0 && (
                  <Field label={t("submitRevision")}>
                    <select
                      className="input-field"
                      data-testid="producer-revision-select"
                      value={parentBatchId}
                      onChange={(e) => setParentBatchId(e.target.value)}
                    >
                      <option value="">— New batch —</option>
                      {rejectedBatches.map((b) => (
                        <option key={String(b.id)} value={String(b.id)}>
                          #{String(b.id)} — {b.batch.productName} (rejected)
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    className="btn-primary flex-1"
                    data-testid="producer-register"
                    disabled={!isConnected || isPending || isConfirming}
                    onClick={onRegister}
                  >
                    {isPending || isConfirming ? "Submitting…" : parentBatchId ? t("submitRevision") : t("registerBatch")}
                  </button>
                </div>
              </div>
            )}

            {txHash && <TxBox hash={txHash} />}
            {err && <ErrorBox message={err} />}

            {verifyUrl && (
              <div className="mt-8 rounded-xl border border-black/10 p-6 text-center dark:border-white/10">
                <div className="text-sm font-semibold">{t("qrTitle")}</div>
                <div className="mt-4 flex justify-center">
                  <QRCodeSVG value={verifyUrl} size={160} />
                </div>
                <p className="mt-3 text-xs text-zinc-500">{t("qrHint")}</p>
                <Link className="mt-2 inline-block text-sm text-emerald-600" href={verifyUrl}>
                  {verifyUrl}
                </Link>
              </div>
            )}
          </div>
        </div>

        {myBatches.length > 0 && (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold">{t("history")}</h2>
            <div className="mt-4 space-y-2">
              {myBatches.map(({ id, batch }) => (
                <Link
                  key={String(id)}
                  href={`/verify/${id}`}
                  className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <span>
                    #{String(id)} — {batch.productName}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors(batch.status)}`}>
                    {batch.status === 1 ? "Pending" : batch.status === 2 ? "Verified" : batch.status === 3 ? "Rejected" : "Revoked"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
