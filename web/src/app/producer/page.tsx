"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { type Address, isAddress } from "viem";
import {
  useAccount, useConnect, useDisconnect,
  useWriteContract, useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";
import { useI18n } from "@/lib/I18nProvider";
import {
  uploadBatchMetadata, getDemoUrl, statusColors, type BatchMetadata,
} from "@/lib/batchUtils";
import { useAllBatches } from "@/lib/useBatches";
import {
  AppHeader, Field, WalletBar, ErrorBox, TxBox, FileUpload, Reveal,
} from "@/components/ui";
import { RobotGuide, InlineRobotHint } from "@/components/RobotGuide";
import { useTutorial } from "@/components/TutorialEngine";
import type { RobotMessage } from "@/components/RobotGuide";
import type { TutorialStep } from "@/components/TutorialEngine";



function StepBar({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total} aria-label="Progress">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: i + 1 < step
                  ? "#1a7a4a"
                  : i + 1 === step
                  ? "#1a7a4a"
                  : "#e8f0ea",
                color: i + 1 <= step ? "#ffffff" : "#6b8c72",
                scale: i + 1 === step ? 1.1 : 1,
                transition: "background 0.3s, color 0.3s, scale 0.3s",
              }}
            >
              {i + 1 < step ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <polyline points="16 6 9 14 4 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (i + 1)}
            </motion.div>
            <span className="text-[10px] font-medium hidden sm:block" style={{ color: i + 1 <= step ? "#1a7a4a" : "#6b8c72" }}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <motion.div
              className="flex-1 h-0.5 rounded-full mb-4 sm:mb-0"
              style={{
                background: i + 1 < step ? "#1a7a4a" : "#e8f0ea",
                transition: "background 0.4s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProducerPage() {
  const { t } = useI18n();
  const { start: startTutorial, isActive } = useTutorial();

  const STEP_LABELS = [t("stepLabelInfo"), t("stepLabelDocs"), t("stepLabelQr")];

  const PRODUCER_TUTORIAL: TutorialStep[] = [
    {
      target: "[data-tour='wallet-bar']",
      title: t("tourProducerStep1Title"),
      body: t("tourProducerStep1Body"),
      placement: "bottom",
      action: "point",
    },
    {
      target: "[data-tour='step-bar']",
      title: t("tourProducerStep2Title"),
      body: t("tourProducerStep2Body"),
      placement: "bottom",
      action: "nod",
    },
    {
      target: "[data-tour='product-name']",
      title: t("tourProducerStep3Title"),
      body: t("tourProducerStep3Body"),
      placement: "bottom",
      action: "point",
    },
  ];
  const address = getHalalChainAddress();
  const contractAddress: Address | undefined =
    address && isAddress(address) ? (address as Address) : undefined;

  const { address: walletAddress, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { batches, refetch } = useAllBatches();

  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState<BatchMetadata>({
    productName: "", productionDate: "", expiryDate: "", ingredients: "", supplier: "", facility: "",
  });
  const [ipfsCid, setIpfsCid] = useState("");
  const [parentBatchId, setParentBatchId] = useState("");
  const [lastBatchId, setLastBatchId] = useState<bigint | null>(null);
  const [robotMsg, setRobotMsg] = useState<RobotMessage>({ text: t("hintProducerStep1"), action: "point" });

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (!isSuccess) return; void refetch(); }, [isSuccess, refetch]);
  useEffect(() => {
    if (!isSuccess || batches.length === 0) return;
    const latest = batches[batches.length - 1];
    setLastBatchId(latest.id);
    setStep(3);
    setRobotMsg({ text: t("hintProducerStep3"), action: "celebrate" });
  }, [isSuccess, batches]);

  useEffect(() => {
    const hints = [t("hintProducerStep1"), t("hintProducerStep2"), t("hintProducerStep3")];
    setRobotMsg({ text: hints[Math.min(step - 1, 2)], action: step === 3 ? "celebrate" : step === 1 ? "point" : "nod" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const myBatches = batches.filter(
    (b) => walletAddress && b.batch.producer.toLowerCase() === walletAddress.toLowerCase()
  );
  const rejectedBatches = myBatches.filter((b) => b.batch.status === 3);

  async function onRegister() {
    setErr(null);
    if (!contractAddress || !isConnected) return;
    try {
      let cid = ipfsCid;
      if (!cid) { cid = await uploadBatchMetadata(meta); setIpfsCid(cid); }
      const parentId = parentBatchId ? BigInt(parentBatchId) : undefined;
      if (parentId) {
        await writeContractAsync({ abi: halalChainAbi, address: contractAddress, functionName: "registerRevision", args: [parentId, cid] });
      } else {
        await writeContractAsync({ abi: halalChainAbi, address: contractAddress, functionName: "registerBatch", args: [meta.productName, cid] });
      }
      refetch();
    } catch (e) { setErr(String((e as Error).message || e)); }
  }

  const verifyUrl = lastBatchId ? `${getDemoUrl()}/verify/${lastBatchId}` : null;

  const statusLabel = (status: number) =>
    status === 1 ? t("pendingLabel") : status === 2 ? t("verifiedLabel") : status === 3 ? t("rejectedLabel") : t("revokedLabel");

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.977 0.003 152)" }}>
      <AppHeader subtitle={t("producer")} hideNav />

      <main className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-8">
        <Reveal>
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm cursor-pointer transition-colors"
            style={{ color: "oklch(0.480 0.018 152)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.420 0.155 152)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.480 0.018 152)")}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t("backToHome")}
          </Link>
        </Reveal>

        {/* Wallet */}
        <Reveal delay={0.05}>
          <div className="card p-5 mb-4" data-tour="wallet-bar">
            <WalletBar
              isConnected={isConnected}
              walletAddress={walletAddress}
              isConnecting={isConnecting}
              onConnect={() => connect({ connector: injected() })}
              onDisconnect={() => disconnect()}
            />
          </div>
        </Reveal>

        {/* Main form card */}
        <Reveal delay={0.10}>
          <div className="card-elevated p-6 sm:p-8">
            <div className="mb-1">
              <h1 className="text-lg font-semibold" style={{ color: "oklch(0.155 0.012 152)" }}>
                {t("registerBatchHeading")}
              </h1>
              <p className="text-sm mt-1" style={{ color: "oklch(0.480 0.018 152)" }}>
                {t("registerBatchSubtitle")}
              </p>
            </div>

            <div className="mt-6" data-tour="step-bar">
              <StepBar step={step} total={3} labels={STEP_LABELS} />
            </div>

            {/* Robot hint */}
            <AnimatePresence mode="wait">
              <InlineRobotHint
                key={step}
                message={[t("hintProducerStep1"), t("hintProducerStep2"), t("hintProducerStep3")][Math.min(step - 1, 2)]}
                step={step}
                totalSteps={3}
              />
            </AnimatePresence>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-4"
                  >
                    <Field label={t("product")}>
                      <input
                        data-tour="product-name"
                        className="input-field"
                        placeholder="Contoh: Keripik Singkong Pedas"
                        value={meta.productName}
                        onChange={(e) => setMeta({ ...meta, productName: e.target.value })}
                        aria-required="true"
                      />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label={t("productionDate")}>
                        <input type="date" className="input-field" value={meta.productionDate}
                          onChange={(e) => setMeta({ ...meta, productionDate: e.target.value })} />
                      </Field>
                      <Field label={t("expiryDate")}>
                        <input type="date" className="input-field" value={meta.expiryDate}
                          onChange={(e) => setMeta({ ...meta, expiryDate: e.target.value })} />
                      </Field>
                    </div>
                    <Field label={t("ingredients")}>
                      <textarea className="input-field min-h-[80px] py-2.5 resize-none" placeholder="Daftar bahan-bahan..."
                        value={meta.ingredients} onChange={(e) => setMeta({ ...meta, ingredients: e.target.value })} />
                    </Field>
                    <motion.button
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full"
                      disabled={!meta.productName.trim()}
                      onClick={() => setStep(2)}
                    >
                      {t("next")} →
                    </motion.button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-4"
                  >
                    <FileUpload label={t("uploadDocs")} onCid={setIpfsCid} disabled={!isConnected} />
                    <Field label={t("manualCid")}>
                      <input className="input-field font-mono text-xs" placeholder="Qm... atau bafy..."
                        value={ipfsCid} onChange={(e) => setIpfsCid(e.target.value)} />
                    </Field>
                    {rejectedBatches.length > 0 && (
                      <Field label={t("submitRevision")}>
                        <select className="input-field" data-testid="producer-revision-select"
                          value={parentBatchId} onChange={(e) => setParentBatchId(e.target.value)}>
                          <option value="">{t("newBatch")}</option>
                          {rejectedBatches.map((b) => (
                            <option key={String(b.id)} value={String(b.id)}>
                              #{String(b.id)} — {b.batch.productName} (rejected)
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}
                    <div className="flex gap-3">
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        className="btn-secondary" onClick={() => setStep(1)}>
                        ← {t("back")}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary flex-1"
                        data-testid="producer-register"
                        disabled={!isConnected || isPending || isConfirming}
                        onClick={onRegister}
                      >
                        {isPending || isConfirming ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                            {t("submitting")}
                          </span>
                        ) : parentBatchId ? t("submitRevision") : t("registerBatch")}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && verifyUrl && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "oklch(0.420 0.155 152)" }}
                      aria-hidden="true"
                    >
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    <h3 className="text-base font-semibold mb-1" style={{ color: "oklch(0.155 0.012 152)" }}>
                      {t("qrTitle")}
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "oklch(0.480 0.018 152)" }}>{t("qrHint")}</p>
                    <div
                      className="inline-block p-4 rounded-2xl mb-4"
                      style={{ background: "white", border: "2px solid oklch(0.420 0.155 152 / 0.15)" }}
                    >
                      <QRCodeSVG value={verifyUrl} size={180} fgColor="oklch(0.155 0.012 152)" />
                    </div>
                    <div className="mt-2">
                      <Link
                        className="text-sm font-medium hover:underline break-all"
                        style={{ color: "oklch(0.420 0.155 152)" }}
                        href={verifyUrl}
                      >
                        {verifyUrl}
                      </Link>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setStep(1); setIpfsCid(""); setParentBatchId(""); setLastBatchId(null); setMeta({ productName: "", productionDate: "", expiryDate: "", ingredients: "", supplier: "", facility: "" }); }}
                      className="btn-secondary mt-6"
                    >
                      {t("registerNewBatch")}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {txHash && <TxBox hash={txHash} />}
            {err && <ErrorBox message={err} />}
          </div>
        </Reveal>

        {/* Batch history */}
        {myBatches.length > 0 && (
          <Reveal delay={0.15}>
            <div className="card-elevated p-6 mt-4" data-tour="batch-history">
              <h2 className="text-sm font-semibold mb-4" style={{ color: "oklch(0.155 0.012 152)" }}>
                {t("history")}
                <span
                  className="ml-2 px-2 py-0.5 rounded-full text-xs font-normal"
                  style={{ background: "oklch(0.420 0.155 152 / 0.10)", color: "oklch(0.420 0.155 152)" }}
                >
                  {myBatches.length}
                </span>
              </h2>
              <div className="space-y-2">
                {myBatches.map(({ id, batch }, i) => (
                  <motion.div
                    key={String(id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/verify/${id}`}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all cursor-pointer"
                      style={{ border: "1px solid oklch(0.920 0.005 152)", background: "oklch(1.000 0.000 0)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "oklch(0.420 0.155 152 / 0.30)";
                        e.currentTarget.style.background = "oklch(0.977 0.003 152)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "oklch(0.920 0.005 152)";
                        e.currentTarget.style.background = "oklch(1.000 0.000 0)";
                      }}
                    >
                      <span style={{ color: "oklch(0.155 0.012 152)" }}>
                        <span className="font-mono text-xs mr-1" style={{ color: "oklch(0.600 0.018 152)" }}>#{String(id)}</span>
                        {batch.productName}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors(batch.status)}`}>
                        {statusLabel(batch.status)}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </main>

      <RobotGuide
        message={robotMsg}
        position="bottom-right"
        showTutorialButton={true}
        onTutorialStart={() => startTutorial(PRODUCER_TUTORIAL)}
        autoStartKey="producer"
        tourActive={isActive}
      />
    </div>
  );
}
