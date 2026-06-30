"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n, LangToggle } from "@/lib/I18nProvider";

export function AppHeader({ subtitle, hideNav }: { subtitle?: string; hideNav?: boolean }) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link className="font-semibold tracking-tight flex items-center gap-2" href="/">
          <img src="/logo.svg" alt="HalalChain Logo" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          {!hideNav && (
            <nav className="hidden items-center gap-3 text-sm sm:flex">
              <Link className="px-2 py-1 font-medium text-zinc-500 transition-all hover:text-zinc-900 active:scale-95" href="/producer">
                {t("producer")}
              </Link>
              <Link className="px-2 py-1 font-medium text-zinc-500 transition-all hover:text-zinc-900 active:scale-95" href="/auditor">
                {t("auditor")}
              </Link>
            </nav>
          )}
          <LangToggle />
        </div>
      </div>
    </header>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs tracking-wide text-zinc-500">{label}</div>
      {children}
    </div>
  );
}

export function WalletBar({
  isConnected,
  walletAddress,
  isConnecting,
  onConnect,
  onDisconnect,
}: {
  isConnected: boolean;
  walletAddress?: string;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Wallet</div>
          <div className="mt-1 text-sm text-zinc-600">...</div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded-full bg-zinc-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-semibold text-zinc-900">Wallet</div>
        <div className="mt-1 text-sm text-zinc-600">
          {isConnected ? <span className="font-mono">{walletAddress}</span> : t("notConnected")}
        </div>
      </div>
      <div className="flex gap-2">
        {!isConnected ? (
          <button
            className="h-10 rounded-full bg-hc-blue px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
            disabled={isConnecting}
            data-testid="wallet-connect"
            onClick={onConnect}
          >
            {t("connectWallet")}
          </button>
        ) : (
          <button
            className="h-10 rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all active:scale-95"
            onClick={onDisconnect}
          >
            {t("disconnect")}
          </button>
        )}
      </div>
    </div>
  );
}

function friendlyError(raw: string): string {
  const lower = raw.toLowerCase();

  // User rejected in wallet
  if (lower.includes("user rejected") || lower.includes("user denied") || lower.includes("rejected the request")) {
    return "Transaksi dibatalkan. Anda menolak permintaan di wallet.";
  }
  // Insufficient funds
  if (lower.includes("insufficient funds") || lower.includes("exceeds the balance")) {
    return "Saldo tidak cukup untuk membayar biaya gas transaksi ini.";
  }
  // Not connected
  if (lower.includes("not connected") || lower.includes("no provider")) {
    return "Wallet belum terhubung. Silakan hubungkan wallet terlebih dahulu.";
  }
  // Access control / role errors
  if (lower.includes("accesscontrol") || lower.includes("missing role") || lower.includes("auditor_role")) {
    return "Akses ditolak. Wallet Anda tidak memiliki izin untuk melakukan aksi ini.";
  }
  // Already verified / invalid state
  if (lower.includes("already verified") || lower.includes("not pending")) {
    return "Batch ini sudah diproses sebelumnya dan tidak bisa diubah lagi.";
  }
  // Network / RPC errors
  if (lower.includes("network") || lower.includes("rpc") || lower.includes("timeout") || lower.includes("could not connect")) {
    return "Gagal terhubung ke jaringan blockchain. Periksa koneksi internet Anda.";
  }
  // Contract not deployed / address errors
  if (lower.includes("call revert") || lower.includes("execution reverted")) {
    return "Transaksi gagal dijalankan oleh smart contract. Pastikan data yang Anda masukkan sudah benar.";
  }
  // Fallback: show a shortened version
  const short = raw.length > 120 ? raw.substring(0, 120) + "…" : raw;
  return `Terjadi kesalahan: ${short}`;
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      {friendlyError(message)}
    </div>
  );
}

export function TxBox({ hash }: { hash: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 text-sm dark:border-white/10 dark:bg-black">
      Tx hash: <span className="font-mono">{hash}</span>
    </div>
  );
}

export function FileUpload({
  label,
  onCid,
  disabled,
}: {
  label: string;
  onCid: (cid: string) => void;
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/10 px-4 py-6 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
        <span className="font-medium">{label}</span>
        <span className="mt-1 text-xs text-zinc-500">{uploading ? "Uploading…" : "PDF, PNG, JPG (max 5 MB)"}</span>
        <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" disabled={disabled || uploading} onChange={onChange} />
      </label>
      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
    </div>
  );
}
