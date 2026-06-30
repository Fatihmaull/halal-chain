"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useI18n, LangToggle } from "@/lib/I18nProvider";

/* ─── Motion variants ────────────────────────── */
export const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Reveal on scroll ───────────────────────── */
export function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── AppHeader ──────────────────────────────── */
export function AppHeader({ subtitle, hideNav }: { subtitle?: string; hideNav?: boolean }) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change / scroll
  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navLinks = [
    { href: "/producer", label: t("producer") },
    { href: "/auditor", label: t("auditor") },
  ];

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-[200]"
      style={{
        background: scrolled ? "rgba(255,255,255,0.93)" : "rgb(255,255,255)",
        backdropFilter: scrolled ? "blur(16px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid oklch(0.920 0.005 152)" : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
        boxShadow: scrolled ? "0 1px 24px rgba(26,122,74,0.06)" : "none",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0" aria-label="HalalChain home">
          <motion.div whileHover={{ rotate: 5, scale: 1.08 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <img src="/logo.svg" alt="" className="h-7 sm:h-8 w-auto" aria-hidden="true" />
          </motion.div>
          {subtitle && (
            <span
              className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full truncate max-w-[120px]"
              style={{ background: "rgba(26,122,74,0.10)", color: "#1a7a4a" }}
            >
              {subtitle}
            </span>
          )}
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop nav */}
          {!hideNav && (
            <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer"
                  style={{ color: "oklch(0.480 0.018 152)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#1a7a4a";
                    (e.currentTarget as HTMLElement).style.background = "rgba(26,122,74,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "oklch(0.480 0.018 152)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}

          <LangToggle />

          {/* Mobile hamburger — only shown when nav is not hidden */}
          {!hideNav && (
            <button
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors"
              style={{ background: mobileMenuOpen ? "rgba(26,122,74,0.10)" : "transparent" }}
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path d="M3 3l12 12M15 3L3 15" stroke="#1a7a4a" strokeWidth="1.75" strokeLinecap="round"/>
                ) : (
                  <>
                    <line x1="2" y1="5" x2="16" y2="5" stroke="#1a7a4a" strokeWidth="1.75" strokeLinecap="round"/>
                    <line x1="2" y1="9" x2="16" y2="9" stroke="#1a7a4a" strokeWidth="1.75" strokeLinecap="round"/>
                    <line x1="2" y1="13" x2="16" y2="13" stroke="#1a7a4a" strokeWidth="1.75" strokeLinecap="round"/>
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && !hideNav && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="sm:hidden overflow-hidden border-t"
            style={{ borderColor: "oklch(0.920 0.005 152)" }}
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                  style={{ color: "#1a4a2e" }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,122,74,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "#1a7a4a" }}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─── Field ──────────────────────────────────── */
export function Field({ label, children, hint }: {
  label: string; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wide" style={{ color: "oklch(0.480 0.018 152)" }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-xs" style={{ color: "oklch(0.600 0.018 152)" }}>{hint}</p>}
    </div>
  );
}

/* ─── WalletBar ──────────────────────────────── */
export function WalletBar({
  isConnected, walletAddress, isConnecting, onConnect, onDisconnect,
}: {
  isConnected: boolean; walletAddress?: string; isConnecting: boolean;
  onConnect: () => void; onDisconnect: () => void;
}) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 rounded-xl p-3 shimmer-bg animate-shimmer" style={{ height: 60 }} />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl p-3.5"
      style={{
        background: isConnected
          ? "oklch(0.420 0.155 152 / 0.06)"
          : "oklch(0.960 0.006 152)",
        border: `1px solid ${isConnected ? "oklch(0.420 0.155 152 / 0.2)" : "oklch(0.920 0.005 152)"}`,
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="relative w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: isConnected ? "oklch(0.520 0.200 152)" : "oklch(0.700 0.020 152)" }}
        >
          {isConnected && (
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ background: "oklch(0.520 0.200 152)" }}
            />
          )}
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: "oklch(0.155 0.012 152)" }}>Wallet</div>
          <div className="text-xs mt-0.5" style={{ color: "oklch(0.480 0.018 152)" }}>
            {isConnected
              ? <span className="font-mono">{walletAddress?.slice(0, 6)}…{walletAddress?.slice(-4)}</span>
              : t("notConnected")}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {!isConnected ? (
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary h-9 px-4 text-xs cursor-pointer"
            disabled={isConnecting}
            data-testid="wallet-connect"
            onClick={onConnect}
            aria-label={t("connectWallet")}
          >
            {isConnecting ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {t("connectWallet")}
              </span>
            ) : t("connectWallet")}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary h-9 px-4 text-xs cursor-pointer"
            onClick={onDisconnect}
          >
            {t("disconnect")}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Error & Tx boxes ───────────────────────── */
function friendlyError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("user rejected") || lower.includes("user denied") || lower.includes("rejected the request"))
    return "Transaksi dibatalkan. Anda menolak permintaan di wallet.";
  if (lower.includes("insufficient funds") || lower.includes("exceeds the balance"))
    return "Saldo tidak cukup untuk membayar biaya gas transaksi ini.";
  if (lower.includes("not connected") || lower.includes("no provider"))
    return "Wallet belum terhubung. Silakan hubungkan wallet terlebih dahulu.";
  if (lower.includes("accesscontrol") || lower.includes("missing role") || lower.includes("auditor_role"))
    return "Akses ditolak. Wallet Anda tidak memiliki izin untuk melakukan aksi ini.";
  if (lower.includes("already verified") || lower.includes("not pending"))
    return "Batch ini sudah diproses sebelumnya dan tidak bisa diubah lagi.";
  if (lower.includes("network") || lower.includes("rpc") || lower.includes("timeout") || lower.includes("could not connect"))
    return "Gagal terhubung ke jaringan blockchain. Periksa koneksi internet Anda.";
  if (lower.includes("call revert") || lower.includes("execution reverted"))
    return "Transaksi gagal dijalankan oleh smart contract. Pastikan data yang Anda masukkan sudah benar.";
  const short = raw.length > 120 ? raw.substring(0, 120) + "…" : raw;
  return `Terjadi kesalahan: ${short}`;
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      role="alert"
      className="mt-4 flex items-start gap-3 rounded-xl p-4"
      style={{
        background: "oklch(0.970 0.015 25)",
        border: "1px solid oklch(0.900 0.060 25)",
      }}
    >
      <svg className="mt-0.5 shrink-0 w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="9" stroke="oklch(0.480 0.190 25)" strokeWidth="1.5"/>
        <path d="M10 6v4M10 13h.01" stroke="oklch(0.480 0.190 25)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <p className="text-sm" style={{ color: "oklch(0.300 0.100 25)" }}>
        {friendlyError(message)}
      </p>
    </motion.div>
  );
}

export function TxBox({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const short = hash.slice(0, 10) + "…" + hash.slice(-8);
  const copy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3"
      style={{ background: "oklch(0.960 0.006 152)", border: "1px solid oklch(0.420 0.155 152 / 0.20)" }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <svg className="shrink-0 w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" stroke="oklch(0.420 0.155 152)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs font-mono truncate" style={{ color: "oklch(0.420 0.155 152)" }}>{short}</span>
      </div>
      <button
        onClick={copy}
        className="shrink-0 text-xs px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
        style={{
          background: copied ? "oklch(0.420 0.155 152)" : "oklch(0.420 0.155 152 / 0.12)",
          color: copied ? "white" : "oklch(0.420 0.155 152)",
        }}
        aria-label="Copy transaction hash"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </motion.div>
  );
}

/* ─── FileUpload ─────────────────────────────── */
export function FileUpload({
  label, onCid, disabled,
}: { label: string; onCid: (cid: string) => void; disabled?: boolean; }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const { uploadToIpfs } = await import("@/lib/batchUtils");
      const cid = await uploadToIpfs(file);
      onCid(cid);
    } catch (ex) {
      setErr(String((ex as Error).message || ex));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl px-4 py-6 text-sm transition-all duration-200"
        style={{
          border: `2px dashed ${dragOver ? "oklch(0.420 0.155 152)" : "oklch(0.860 0.020 152)"}`,
          background: dragOver ? "oklch(0.420 0.155 152 / 0.05)" : "oklch(0.977 0.003 152)",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        <svg className="w-6 h-6 mb-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="oklch(0.480 0.018 152)" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="17 8 12 3 7 8" stroke="oklch(0.420 0.155 152)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke="oklch(0.420 0.155 152)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="font-medium text-sm" style={{ color: "oklch(0.155 0.012 152)" }}>{label}</span>
        <span className="mt-1 text-xs" style={{ color: "oklch(0.480 0.018 152)" }}>
          {uploading ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Uploading…
            </span>
          ) : "PDF, PNG, JPG (maks 5 MB) · Drag & drop atau klik"}
        </span>
        <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" disabled={disabled || uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </label>
      {err && <p className="mt-2 text-xs" style={{ color: "oklch(0.480 0.190 25)" }}>{err}</p>}
    </div>
  );
}
