"use client";

import Link from "next/link";
import { useMemo } from "react";
import { isAddress } from "viem";
import { useReadContract } from "wagmi";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";

function statusLabel(status?: number) {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Verified";
    case 3:
      return "Rejected";
    default:
      return "Unknown";
  }
}

export default function VerifyBatchPage({ params }: { params: { batchId: string } }) {
  const batchId = useMemo(() => {
    try {
      return BigInt(params.batchId);
    } catch {
      return undefined;
    }
  }, [params.batchId]);

  const address = getHalalChainAddress();
  const canQuery = Boolean(address && isAddress(address) && batchId && batchId > 0n);

  const { data, isLoading, error } = useReadContract({
    abi: halalChainAbi,
    address: address!,
    functionName: "getBatch",
    args: canQuery ? [batchId!] : undefined,
    query: { enabled: canQuery },
  });

  const batch = data as
    | {
        producer: `0x${string}`;
        productName: string;
        ipfsCid: string;
        createdAt: bigint;
        status: number;
        auditor: `0x${string}`;
        auditedAt: bigint;
        auditIpfsCid: string;
        rejectReason: string;
      }
    | undefined;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link className="font-semibold tracking-tight" href="/">
            HalalChain
          </Link>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Verifikasi batch</div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Batch ID</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">#{params.batchId}</div>

          {!address && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
              Set dulu environment variable <span className="font-mono">NEXT_PUBLIC_HALALCHAIN_ADDRESS</span> di{" "}
              <span className="font-mono">web</span> biar halaman ini bisa baca data kontrak.
            </div>
          )}

          {isLoading && <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">Loading data on-chain…</div>}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-100">
              {String(error.message || error)}
            </div>
          )}

          {batch && (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Status" value={statusLabel(batch.status)} />
              <Field label="Product" value={batch.productName || "-"} />
              <Field label="Producer" value={batch.producer} mono />
              <Field label="Docs CID" value={batch.ipfsCid || "-"} mono />
              <Field label="Auditor" value={batch.auditor} mono />
              <Field label="Audit CID" value={batch.auditIpfsCid || "-"} mono />
              <div className="sm:col-span-2">
                <Field label="Reject reason" value={batch.rejectReason || "-"} />
              </div>
            </dl>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-black">
      <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">{label}</dt>
      <dd className={`mt-1 text-sm ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

