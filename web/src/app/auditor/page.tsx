"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { type Address, isAddress } from "viem";
import {
  useAccount, useConnect, useDisconnect,
  useWriteContract, useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";
import { useI18n } from "@/lib/I18nProvider";
import { ipfsGatewayUrl, statusColors } from "@/lib/batchUtils";
import { useAllBatches, useHasAuditorRole } from "@/lib/useBatches";
import {
  AppHeader, Field, WalletBar, ErrorBox, TxBox, FileUpload, Reveal,
} from "@/components/ui";
import { RobotGuide } from "@/components/RobotGuide";
import { useTutorial } from "@/components/TutorialEngine";
import type { RobotMessage } from "@/components/RobotGuide";
import type { TutorialStep } from "@/components/TutorialEngine";



type Action = "verify" | "reject" | "revoke";

function ActionButton({
  label, action, disabled, onClick, color,
}: { label: string; action: Action; disabled: boolean; onClick: () => void; color: string }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className="h-11 rounded-full text-sm font-medium text-white cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: color, boxShadow: disabled ? "none" : `0 3px 14px ${color}50` }}
      disabled={disabled}
      onClick={onClick}
      data-testid={`auditor-${action}`}
    >
      {label}
    </motion.button>
  );
}

function ConfirmModal({
  action, batchId, onConfirm, onCancel, isPending,
}: { action: Action; batchId: string; onConfirm: () => void; onCancel: () => void; isPending: boolean }) {
  const { t } = useI18n();
  const colorMap: Record<Action, string> = {
    verify: "oklch(0.420 0.155 152)",
    reject: "oklch(0.480 0.190 25)",
    revoke: "oklch(0.400 0.010 152)",
  };
  const labelMap: Record<Action, string> = {
    verify: t("verify"),
    reject: t("reject"),
    revoke: t("revoke"),
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: "var(--z-modal-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: "oklch(0.155 0.012 152 / 0.6)", backdropFilter: "blur(8px)" }}
        onClick={onCancel}
      />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: "white", boxShadow: "0 24px 60px oklch(0.155 0.012 152 / 0.25)", zIndex: "var(--z-modal)" }}
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: `${colorMap[action]}18` }}
        >
          {action === "verify" ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" stroke={colorMap[action]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke={colorMap[action]} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <h3 className="text-base font-semibold text-center mb-1" style={{ color: "oklch(0.155 0.012 152)" }}>
          {t("confirmText")} {labelMap[action]}?
        </h3>
        <p className="text-sm text-center mb-6" style={{ color: "oklch(0.480 0.018 152)" }}>
          {t("confirmActionMsg").replace("{action}", labelMap[action]).replace("{id}", batchId)}
        </p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={onCancel}>{t("cancelText")}</button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-11 rounded-full text-sm font-medium text-white cursor-pointer"
            style={{ background: colorMap[action] }}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {t("submitting")}
              </span>
            ) : t("confirmText")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AuditorPage() {
  const { t } = useI18n();
  const { start: startTutorial, isActive } = useTutorial();

  const AUDITOR_TUTORIAL: TutorialStep[] = [
    {
      target: "[data-tour='auditor-wallet']",
      title: t("tourAuditorStep1Title"),
      body: t("tourAuditorStep1Body"),
      placement: "bottom",
      action: "point",
    },
    {
      target: "[data-tour='pending-queue']",
      title: t("tourAuditorStep2Title"),
      body: t("tourAuditorStep2Body"),
      placement: "bottom",
      action: "nod",
    },
    {
      target: "[data-tour='action-buttons']",
      title: t("tourAuditorStep3Title"),
      body: t("tourAuditorStep3Body"),
      placement: "top",
      action: "point",
    },
  ];
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
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);
  const [robotMsg, setRobotMsg] = useState<RobotMessage>({
    text: t("robotAuditor"),
    action: "nod",
  });

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });
  const [err, setErr] = useState<string | null>(null);

  const selected = pending.find((b) => String(b.id) === selectedId) ?? pending[0];

  async function execute(action: Action) {
    setErr(null);
    if (!contractAddress) return;
    try {
      if (action === "verify") {
        await writeContractAsync({
          abi: halalChainAbi, address: contractAddress,
          functionName: "verifyBatch", args: [selected!.id, auditCid || "bafy-audit"],
        });
        setRobotMsg({ text: t("robotAuditorVerified"), action: "celebrate" });
      } else if (action === "reject") {
        await writeContractAsync({
          abi: halalChainAbi, address: contractAddress,
          functionName: "rejectBatch", args: [selected!.id, reason, auditCid || "bafy-audit-reject"],
        });
        setRobotMsg({ text: t("robotAuditorRejected"), action: "nod" });
      } else {
        const batchId = BigInt(revokeId || selected?.id || 0);
        if (batchId <= 0n) return;
        await writeContractAsync({
          abi: halalChainAbi, address: contractAddress,
          functionName: "revokeBatch", args: [batchId, reason],
        });
        setRobotMsg({ text: t("robotAuditorRevoked"), action: "nod" });
      }
      setConfirmAction(null);
      refetch();
    } catch (e) { setErr(String((e as Error).message || e)); }
  }

  const canAct = isConnected && !isPending && !isConfirming && hasAuditorRole !== false;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.977 0.003 152)" }}>
      <AppHeader subtitle={t("auditor")} hideNav />

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
          <div className="card p-5 mb-4" data-tour="auditor-wallet">
            <WalletBar
              isConnected={isConnected} walletAddress={walletAddress}
              isConnecting={isConnecting}
              onConnect={() => connect({ connector: injected() })}
              onDisconnect={() => disconnect()}
            />
            {isConnected && hasAuditorRole === false && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-start gap-2.5 rounded-xl p-3 text-sm"
                style={{ background: "oklch(0.970 0.060 75 / 0.3)", border: "1px solid oklch(0.820 0.100 75)" }}
              >
                <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="9" stroke="oklch(0.580 0.150 75)" strokeWidth="1.5"/>
                  <path d="M10 6v4M10 13h.01" stroke="oklch(0.580 0.150 75)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p style={{ color: "oklch(0.380 0.100 75)" }}>{t("noAuditorRole")}</p>
              </motion.div>
            )}
          </div>
        </Reveal>

        {/* Pending queue */}
        <Reveal delay={0.10}>
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4" data-tour="pending-queue">
              <h2 className="text-sm font-semibold" style={{ color: "oklch(0.155 0.012 152)" }}>
                {t("pendingQueue")}
                {pending.length > 0 && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: "oklch(0.720 0.140 75 / 0.15)", color: "oklch(0.480 0.140 75)" }}
                  >
                    {pending.length}
                  </span>
                )}
              </h2>
              {loading && (
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.480 0.018 152)" }}>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Loading…
                </div>
              )}
            </div>

            {pending.length === 0 && !loading ? (
              <div
                className="rounded-xl py-8 text-center"
                style={{ background: "oklch(0.977 0.003 152)", border: "1px dashed oklch(0.860 0.020 152)" }}
              >
                <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="oklch(0.600 0.018 152)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-sm" style={{ color: "oklch(0.600 0.018 152)" }}>{t("noPending")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pending.map(({ id, batch }, i) => (
                  <motion.button
                    key={String(id)}
                    type="button"
                    data-testid={`auditor-pending-${id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all cursor-pointer"
                    style={{
                      border: String(id) === String(selected?.id)
                        ? "1.5px solid oklch(0.420 0.155 152)"
                        : "1px solid oklch(0.920 0.005 152)",
                      background: String(id) === String(selected?.id)
                        ? "oklch(0.420 0.155 152 / 0.06)"
                        : "oklch(1.000 0.000 0)",
                    }}
                    onClick={() => {
                      setSelectedId(String(id));
                      setRobotMsg({
                        text: t("robotAuditorSelected")
                          .replace("{id}", String(id))
                          .replace("{name}", batch.productName),
                        action: "point",
                      });
                    }}
                    aria-pressed={String(id) === String(selected?.id)}
                  >
                    <span style={{ color: "oklch(0.155 0.012 152)" }}>
                      <span className="font-mono text-xs mr-1.5" style={{ color: "oklch(0.600 0.018 152)" }}>#{String(id)}</span>
                      {batch.productName}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors(1)}`}>
                      {t("pendingLabel")}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Selected batch detail */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-6 pt-6 grid gap-4"
                    style={{ borderTop: "1px solid oklch(0.920 0.005 152)" }}
                  >
                    <div
                      className="rounded-xl p-4 grid gap-2"
                      style={{ background: "oklch(0.977 0.003 152)" }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: "oklch(0.480 0.018 152)" }}>{t("batchId")}</span>
                        <span className="font-mono font-semibold" style={{ color: "oklch(0.155 0.012 152)" }}>#{String(selected.id)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: "oklch(0.480 0.018 152)" }}>{t("product")}</span>
                        <span className="font-semibold" style={{ color: "oklch(0.155 0.012 152)" }}>{selected.batch.productName}</span>
                      </div>
                      {selected.batch.ipfsCid && ipfsGatewayUrl(selected.batch.ipfsCid) && (
                        <a
                          className="inline-flex items-center gap-1.5 text-xs font-medium mt-1 transition-colors"
                          style={{ color: "oklch(0.420 0.155 152)" }}
                          href={ipfsGatewayUrl(selected.batch.ipfsCid)!}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path d="M11 3h6v6M10 10l6-6M6 14H3V3h8v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {t("viewDocuments")}
                        </a>
                      )}
                      {selected.batch.parentBatchId > 0n && (
                        <Link className="text-xs" style={{ color: "oklch(0.480 0.018 152)" }} href={`/verify/${selected.batch.parentBatchId}`}>
                          {t("parentBatch")} #{String(selected.batch.parentBatchId)}
                        </Link>
                      )}
                    </div>

                    <FileUpload label={t("uploadAudit")} onCid={setAuditCid} disabled={!isConnected} />
                    <Field label={t("manualCid")}>
                      <input className="input-field font-mono text-xs" placeholder="Qm... atau bafy..."
                        value={auditCid} onChange={(e) => setAuditCid(e.target.value)} />
                    </Field>
                    <Field label={t("rejectReason")}>
                      <input className="input-field" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" data-tour="action-buttons">
                      <ActionButton
                        label={t("verify")} action="verify" disabled={!canAct}
                        color="oklch(0.420 0.155 152)"
                        onClick={() => { setConfirmAction("verify"); setRobotMsg({ text: t("robotAuditorConfirmVerify"), action: "nod" }); }}
                      />
                      <ActionButton
                        label={t("reject")} action="reject" disabled={!canAct}
                        color="oklch(0.480 0.190 25)"
                        onClick={() => { setConfirmAction("reject"); setRobotMsg({ text: t("robotAuditorConfirmReject"), action: "point" }); }}
                      />
                      <ActionButton
                        label={t("revoke")} action="revoke" disabled={!canAct}
                        color="oklch(0.400 0.010 152)"
                        onClick={() => setConfirmAction("revoke")}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Revoke section */}
            {verified.length > 0 && (
              <div className="mt-6 pt-6" style={{ borderTop: "1px solid oklch(0.920 0.005 152)" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "oklch(0.480 0.018 152)" }}>{t("revokeVerified")}</p>
                <select
                  className="input-field"
                  value={revokeId}
                  onChange={(e) => setRevokeId(e.target.value)}
                  aria-label={t("revokeVerified")}
                >
                  <option value="">{t("selectBatch")}</option>
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
        </Reveal>
      </main>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmAction && (
          <ConfirmModal
            action={confirmAction}
            batchId={selected ? String(selected.id) : ""}
            onConfirm={() => execute(confirmAction)}
            onCancel={() => setConfirmAction(null)}
            isPending={isPending || isConfirming}
          />
        )}
      </AnimatePresence>

      <RobotGuide
        message={robotMsg}
        position="bottom-right"
        showTutorialButton={true}
        onTutorialStart={() => startTutorial(AUDITOR_TUTORIAL)}
        autoStartKey="auditor"
        tourActive={isActive}
      />
    </div>
  );
}
