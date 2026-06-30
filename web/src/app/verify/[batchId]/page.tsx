"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { targetChainId } from "@/lib/wagmi";
import { useI18n } from "@/lib/I18nProvider";
import { ipfsGatewayUrl, statusKey, statusDescKey, basescanUrl } from "@/lib/batchUtils";
import { useBatch } from "@/lib/useBatches";
import { getHalalChainAddress } from "@/lib/contract";
import { AppHeader, Reveal } from "@/components/ui";
import { RobotGuide } from "@/components/RobotGuide";
import { useTutorial } from "@/components/TutorialEngine";
import type { RobotMessage } from "@/components/RobotGuide";
import type { TutorialStep } from "@/components/TutorialEngine";

/* ─── Status config ──────────────────────────── */
type StatusConfig = {
  bg: string; border: string; text: string;
  icon: React.ReactNode; glow: string;
  robotMsg: string; robotAction: "celebrate" | "nod" | "wave" | "point";
};

function getStatusConfig(status: number): StatusConfig {
  switch (status) {
    case 2: return {
      bg: "oklch(0.420 0.155 152 / 0.06)",
      border: "oklch(0.420 0.155 152 / 0.30)",
      text: "oklch(0.300 0.140 152)",
      glow: "0 0 40px oklch(0.420 0.155 152 / 0.20)",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="oklch(0.420 0.155 152)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      robotMsg: "Produk ini HALAL dan sudah diverifikasi auditor berwenang. Aman untuk dibeli!",
      robotAction: "celebrate",
    };
    case 1: return {
      bg: "oklch(0.720 0.140 75 / 0.08)",
      border: "oklch(0.720 0.140 75 / 0.35)",
      text: "oklch(0.400 0.120 75)",
      glow: "0 0 30px oklch(0.720 0.140 75 / 0.15)",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="oklch(0.680 0.150 75)" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="oklch(0.680 0.150 75)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      robotMsg: "Batch ini sedang menunggu review auditor. Cek lagi dalam beberapa saat.",
      robotAction: "nod",
    };
    case 3: return {
      bg: "oklch(0.970 0.015 25)",
      border: "oklch(0.900 0.060 25 / 0.60)",
      text: "oklch(0.360 0.130 25)",
      glow: "none",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="oklch(0.480 0.190 25)" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      robotMsg: "Batch ini ditolak auditor. Produsen perlu memperbaiki dan mengajukan ulang dokumen.",
      robotAction: "point",
    };
    case 4: return {
      bg: "oklch(0.960 0.006 152)",
      border: "oklch(0.860 0.020 152)",
      text: "oklch(0.400 0.018 152)",
      glow: "none",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18.364 5.636L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="oklch(0.500 0.018 152)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      robotMsg: "Sertifikasi batch ini telah dicabut. Hubungi produsen untuk info lebih lanjut.",
      robotAction: "nod",
    };
    default: return {
      bg: "oklch(0.977 0.003 152)",
      border: "oklch(0.920 0.005 152)",
      text: "oklch(0.480 0.018 152)",
      glow: "none",
      icon: null,
      robotMsg: "Batch tidak ditemukan. Pastikan QR Code yang di-scan dari produk yang benar.",
      robotAction: "point",
    };
  }
}

/* ─── Info row ───────────────────────────────── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-3.5"
      style={{ background: "oklch(0.977 0.003 152)", border: "1px solid oklch(0.920 0.005 152)" }}>
      <dt className="text-[10px] font-semibold uppercase tracking-widest mb-1"
        style={{ color: "oklch(0.600 0.018 152)" }}>
        {label}
      </dt>
      <dd className="text-sm font-medium" style={{ color: "oklch(0.155 0.012 152)" }}>{value}</dd>
    </div>
  );
}

/* ─── Page ───────────────────────────────────── */
export default function VerifyBatchPage() {
  const params = useParams<{ batchId: string }>();
  const batchIdParam = params.batchId;
  const { t } = useI18n();
  const { start: startTutorial, isActive } = useTutorial();

  const VERIFY_TUTORIAL: TutorialStep[] = [
    {
      target: "[data-tour='verify-status']",
      title: t("tourVerifyStep1Title"),
      body: t("tourVerifyStep1Body"),
      placement: "bottom",
      action: "point",
    },
    {
      target: "[data-tour='verify-docs']",
      title: t("tourVerifyStep2Title"),
      body: t("tourVerifyStep2Body"),
      placement: "top",
      action: "nod",
    },
  ];
  const chainId = targetChainId;
  const contractAddress = getHalalChainAddress();

  const batchId = useMemo(() => {
    try { return BigInt(batchIdParam); } catch { return undefined; }
  }, [batchIdParam]);

  const { batch, loading, error } = useBatch(batchId);
  const status = batch?.status ?? 0;
  const statusLabel = t(statusKey(status));
  const statusDesc = t(statusDescKey(status));
  const cfg = getStatusConfig(batch ? status : 0);

  const robotMsg: RobotMessage = {
    text: loading
      ? t("robotVerifyLoading")
      : error
      ? t("robotVerifyNotFound")
      : status === 2
      ? t("robotVerifyVerified")
      : status === 1
      ? t("robotVerifyPending")
      : status === 3
      ? t("robotVerifyRejected")
      : status === 4
      ? t("robotVerifyRevoked")
      : t("robotVerifyNotFound"),
    action: loading ? "wave" : cfg.robotAction,
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.977 0.003 152)" }}>
      <AppHeader subtitle={t("verifyBatch")} />

      <main className="mx-auto w-full max-w-md px-4 sm:px-6 py-10" aria-labelledby="verify-heading">
        <Reveal>
          <div className="card-elevated overflow-hidden">
            {/* Header strip */}
            <div className="px-6 py-5" style={{ background: "oklch(0.420 0.155 152)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-0.5">
                    {t("batchId")}
                  </p>
                  <h1 id="verify-heading" className="text-2xl font-semibold text-white"
                    style={{ letterSpacing: "-0.02em" }}>
                    #{batchIdParam}
                  </h1>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)" }} aria-hidden="true">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.75" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.75" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.75" rx="1"/>
                    <path d="M14 14h.01M14 18h3M18 14v3M17 17h1v1" stroke="currentColor"
                      strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Contract warning */}
              {!contractAddress && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mb-4 flex items-start gap-2.5 rounded-xl p-3 text-sm"
                  style={{ background: "oklch(0.970 0.060 75 / 0.25)", border: "1px solid oklch(0.820 0.100 75 / 0.5)" }}>
                  <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" stroke="oklch(0.580 0.150 75)" strokeWidth="1.5"/>
                    <path d="M10 6v4M10 13h.01" stroke="oklch(0.580 0.150 75)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p style={{ color: "oklch(0.380 0.100 75)" }}>
                    Set <code className="font-mono text-xs bg-white/50 px-1 rounded">NEXT_PUBLIC_HALALCHAIN_ADDRESS</code> di web/.env.local
                  </p>
                </motion.div>
              )}

              {/* Loading skeleton */}
              {loading && (
                <div className="space-y-3" aria-live="polite" aria-label={t("loading")}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-xl shimmer-bg animate-shimmer" />
                  ))}
                  <p className="text-sm text-center mt-4" style={{ color: "oklch(0.480 0.018 152)" }}>
                    {t("loading")}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center" role="alert">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "oklch(0.970 0.015 25)" }} aria-hidden="true">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="oklch(0.480 0.190 25)" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "oklch(0.300 0.100 25)" }}>{t("notFound")}</p>
                </motion.div>
              )}

              {/* Batch data */}
              {batch && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  {/* Status card */}
                  <motion.div
                    data-testid="verify-status"
                    data-tour="verify-status"
                    className="rounded-2xl p-5 text-center mb-5"
                    style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, boxShadow: cfg.glow }}
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 22 }}
                  >
                    <div className="relative inline-flex mb-3" aria-hidden="true">
                      {status === 2 && (
                        <div className="absolute inset-0 rounded-full animate-pulse-ring"
                          style={{ background: "oklch(0.420 0.155 152 / 0.3)" }} />
                      )}
                      {cfg.icon}
                    </div>
                    <h2 className="text-xl font-semibold" style={{ color: cfg.text, letterSpacing: "-0.02em" }}>
                      {statusLabel}
                    </h2>
                    <p className="mt-1.5 text-sm opacity-80" style={{ color: cfg.text }}>{statusDesc}</p>
                  </motion.div>

                  {/* Details */}
                  <dl className="grid gap-2.5">
                    <InfoRow label={t("product")} value={batch.productName || "—"} />
                    {batch.parentBatchId > 0n && (
                      <div className="rounded-xl p-3.5"
                        style={{ background: "oklch(0.977 0.003 152)", border: "1px solid oklch(0.920 0.005 152)" }}>
                        <dt className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                          style={{ color: "oklch(0.600 0.018 152)" }}>
                          {t("parentBatch")}
                        </dt>
                        <dd>
                          <Link className="text-sm font-medium"
                            style={{ color: "oklch(0.420 0.155 152)" }}
                            href={`/verify/${batch.parentBatchId}`}
                            data-testid="verify-parent-link">
                            #{String(batch.parentBatchId)} →
                          </Link>
                        </dd>
                      </div>
                    )}
                    {batch.rejectReason && (
                      <div data-testid="verify-reject-reason">
                        <InfoRow label={t("rejectReason")} value={batch.rejectReason} />
                      </div>
                    )}
                  </dl>

                  {/* Action links */}
                  <div className="mt-4 flex flex-wrap gap-2" data-tour="verify-docs">
                    {batch.ipfsCid && ipfsGatewayUrl(batch.ipfsCid) && (
                      <a className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium cursor-pointer transition-all"
                        style={{ background: "oklch(0.420 0.155 152 / 0.10)", color: "oklch(0.420 0.155 152)", border: "1px solid oklch(0.420 0.155 152 / 0.20)" }}
                        href={ipfsGatewayUrl(batch.ipfsCid)!} target="_blank" rel="noreferrer">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M11 3h6v6M10 10l6-6M6 14H3V3h8v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {t("viewDocuments")}
                      </a>
                    )}
                    {batch.auditIpfsCid && ipfsGatewayUrl(batch.auditIpfsCid) && (
                      <a className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium cursor-pointer transition-all"
                        style={{ background: "oklch(0.960 0.006 152)", color: "oklch(0.480 0.018 152)", border: "1px solid oklch(0.920 0.005 152)" }}
                        href={ipfsGatewayUrl(batch.auditIpfsCid)!} target="_blank" rel="noreferrer">
                        {t("viewAudit")}
                      </a>
                    )}
                    {contractAddress && basescanUrl(contractAddress, chainId) && (
                      <a className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs cursor-pointer"
                        style={{ color: "oklch(0.600 0.018 152)" }}
                        href={basescanUrl(contractAddress, chainId)!} target="_blank" rel="noreferrer">
                        {t("basescan")}
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-5 text-center text-xs" style={{ color: "oklch(0.600 0.018 152)" }}>
            Powered by Base · HalalChain · IPFS
          </p>
        </Reveal>
      </main>

      <RobotGuide
        message={robotMsg}
        position="bottom-right"
        showTutorialButton={!!batch}
        onTutorialStart={() => startTutorial(VERIFY_TUTORIAL)}
        autoStartKey={batch ? `verify-${String(batch.status)}` : undefined}
        tourActive={isActive}
      />
    </div>
  );
}
