"use client";

import { useState } from "react";
import Link from "next/link";
import { type Address, isAddress } from "viem";
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";
import { useI18n } from "@/lib/I18nProvider";
import { ipfsGatewayUrl, statusColors } from "@/lib/batchUtils";
import { useAllBatches, useHasAuditorRole } from "@/lib/useBatches";
import { AppHeader, Field, WalletBar, ErrorBox, TxBox, FileUpload } from "@/components/ui";

export default function AuditorPage() {
  const { t } = useI18n();
  const address = getHalalChainAddress();
  const contractAddress: Address | undefined =
    address && isAddress(address) ? (address as Address) : undefined;

  const { address: walletAddress, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const hasAuditorRole = useHasAuditorRole(walletAddress as Address | undefined);
  const { batches, loading, refetch, pending } = useAllBatches();
  const verified = batches.filter((b) => b.batch.status === 2);

  const [selectedId, setSelectedId] = useState<string>("");
  const [revokeId, setRevokeId] = useState<string>("");
  const [auditCid, setAuditCid] = useState("");
  const [reason, setReason] = useState("Bahan tidak jelas");
  const [confirmAction, setConfirmAction] = useState<"verify" | "reject" | "revoke" | null>(null);

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });
  const [err, setErr] = useState<string | null>(null);

  const selected = pending.find((b) => String(b.id) === selectedId) ?? pending[0];

  async function execute(action: "verify" | "reject" | "revoke") {
    setErr(null);
    if (!contractAddress || !selected) return;
    const batchId = selected.id;

    try {
      if (action === "verify") {
        await writeContractAsync({
          abi: halalChainAbi,
          address: contractAddress,
          functionName: "verifyBatch",
          args: [batchId, auditCid || "bafy-audit"],
        });
      } else if (action === "reject") {
        await writeContractAsync({
          abi: halalChainAbi,
          address: contractAddress,
          functionName: "rejectBatch",
          args: [batchId, reason, auditCid || "bafy-audit-reject"],
        });
      } else {
        const batchId = BigInt(revokeId || selected?.id || 0);
        if (batchId <= 0n) return;
        await writeContractAsync({
          abi: halalChainAbi,
          address: contractAddress,
          functionName: "revokeBatch",
          args: [batchId, reason],
        });
      }
      setConfirmAction(null);
      refetch();
    } catch (e) {
      setErr(String((e as Error).message || e));
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <AppHeader subtitle={t("auditor")} />

      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
          <WalletBar
            isConnected={isConnected}
            walletAddress={walletAddress}
            isConnecting={isConnecting}
            onConnect={() => connect({ connector: injected() })}
            onDisconnect={() => disconnect()}
          />

          {isConnected && hasAuditorRole === false && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Wallet tidak memiliki AUDITOR_ROLE. Hubungi admin kontrak.
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-sm font-semibold">{t("pendingQueue")}</h2>
            {pending.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500">{t("noPending")}</p>
            ) : (
              <div className="mt-4 space-y-2">
                {pending.map(({ id, batch }) => (
                  <button
                    key={String(id)}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                      String(id) === String(selected?.id)
                        ? "border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900"
                        : "border-black/10 hover:bg-black/5 dark:border-white/10"
                    }`}
                    onClick={() => setSelectedId(String(id))}
                  >
                    <span>
                      #{String(id)} — {batch.productName}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors(1)}`}>Pending</span>
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <div className="mt-8 grid gap-4 border-t border-black/10 pt-8 dark:border-white/10">
                <div className="text-sm">
                  <span className="text-zinc-500">{t("batchId")}: </span>#{String(selected.id)}
                </div>
                <div className="text-sm">
                  <span className="text-zinc-500">{t("product")}: </span>
                  {selected.batch.productName}
                </div>
                {selected.batch.ipfsCid && ipfsGatewayUrl(selected.batch.ipfsCid) && (
                  <a
                    className="text-sm text-emerald-600 underline"
                    href={ipfsGatewayUrl(selected.batch.ipfsCid)!}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("viewDocuments")}
                  </a>
                )}
                {selected.batch.parentBatchId > 0n && (
                  <Link className="text-sm text-zinc-600 underline" href={`/verify/${selected.batch.parentBatchId}`}>
                    {t("parentBatch")} #{String(selected.batch.parentBatchId)}
                  </Link>
                )}

                <FileUpload label={t("uploadAudit")} onCid={setAuditCid} disabled={!isConnected} />
                <Field label={t("manualCid")}>
                  <input className="input-field font-mono" value={auditCid} onChange={(e) => setAuditCid(e.target.value)} />
                </Field>
                <Field label={t("rejectReason")}>
                  <input className="input-field" value={reason} onChange={(e) => setReason(e.target.value)} />
                </Field>

                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    className="h-11 rounded-full bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                    disabled={!isConnected || isPending || isConfirming || hasAuditorRole === false}
                    onClick={() => setConfirmAction("verify")}
                  >
                    {t("verify")}
                  </button>
                  <button
                    className="h-11 rounded-full bg-red-600 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
                    disabled={!isConnected || isPending || isConfirming || hasAuditorRole === false}
                    onClick={() => setConfirmAction("reject")}
                  >
                    {t("reject")}
                  </button>
                  <button
                    className="h-11 rounded-full bg-zinc-600 text-sm font-medium text-white hover:bg-zinc-500 disabled:opacity-50"
                    disabled={!isConnected || isPending || isConfirming || hasAuditorRole === false}
                    onClick={() => setConfirmAction("revoke")}
                  >
                    {t("revoke")}
                  </button>
                </div>
              </div>
            )}

            {confirmAction && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-zinc-950">
                  <p className="text-sm">Confirm {confirmAction} batch #{selected ? String(selected.id) : ""}?</p>
                  <div className="mt-4 flex gap-2">
                    <button className="btn-secondary flex-1" onClick={() => setConfirmAction(null)}>
                      Cancel
                    </button>
                    <button
                      className="btn-primary flex-1"
                      disabled={isPending || isConfirming}
                      onClick={() => execute(confirmAction)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {verified.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs uppercase text-zinc-500">Revoke verified batch</h3>
                <select
                  className="input-field mt-2"
                  value={revokeId}
                  onChange={(e) => setRevokeId(e.target.value)}
                >
                  <option value="">— Select —</option>
                  {verified.map(({ id, batch }) => (
                    <option key={String(id)} value={String(id)}>
                      #{String(id)} — {batch.productName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {txHash && <TxBox hash={txHash} />}
            {err && <ErrorBox message={err} />}
          </div>
        </div>
      </main>
    </div>
  );
}
