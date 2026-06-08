"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n, LangToggle } from "@/lib/I18nProvider";

export function AppHeader({ subtitle }: { subtitle?: string }) {
  const { t } = useI18n();
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link className="font-semibold tracking-tight" href="/">
          {t("appName")}
        </Link>
        <div className="flex items-center gap-4">
          {subtitle && <span className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</span>}
          <nav className="hidden items-center gap-3 text-sm sm:flex">
            <Link className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50" href="/producer">
              {t("producer")}
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50" href="/auditor">
              {t("auditor")}
            </Link>
          </nav>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500">{label}</div>
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
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-semibold">Wallet</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {isConnected ? <span className="font-mono">{walletAddress}</span> : t("notConnected")}
        </div>
      </div>
      <div className="flex gap-2">
        {!isConnected ? (
          <button
            className="h-10 rounded-full bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black"
            disabled={isConnecting}
            data-testid="wallet-connect"
            onClick={onConnect}
          >
            {t("connectWallet")}
          </button>
        ) : (
          <button
            className="h-10 rounded-full border border-black/10 px-4 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            onClick={onDisconnect}
          >
            {t("disconnect")}
          </button>
        )}
      </div>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-100">
      {message}
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
