"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type Address, isAddress } from "viem";
import { useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";

export default function AuditorPage() {
  const address = getHalalChainAddress();
  const contractAddress: Address | undefined =
    address && isAddress(address) ? (address as Address) : undefined;

  const { address: walletAddress, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const [batchId, setBatchId] = useState("1");
  const [auditCid, setAuditCid] = useState("bafy-audit");
  const [reason, setReason] = useState("Bahan tidak jelas");

  const batchIdBig = useMemo(() => {
    try {
      return BigInt(batchId);
    } catch {
      return undefined;
    }
  }, [batchId]);

  const { writeContractAsync, isPending } = useWriteContract();
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function call(fn: "verifyBatch" | "rejectBatch") {
    setErr(null);
    setLastTx(null);
    if (!contractAddress) return setErr("NEXT_PUBLIC_HALALCHAIN_ADDRESS belum diset / invalid.");
    if (!batchIdBig || batchIdBig <= 0n) return setErr("Batch ID invalid.");
    try {
      const hash =
        fn === "verifyBatch"
          ? await writeContractAsync({
              abi: halalChainAbi,
              address: contractAddress,
              functionName: "verifyBatch",
              args: [batchIdBig, auditCid],
            })
          : await writeContractAsync({
              abi: halalChainAbi,
              address: contractAddress,
              functionName: "rejectBatch",
              args: [batchIdBig, reason, auditCid],
            });
      setLastTx(hash);
    } catch (e) {
      setErr(String((e as Error).message || e));
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link className="font-semibold tracking-tight" href="/">
            HalalChain
          </Link>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Auditor dashboard</div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold">Wallet</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {isConnected ? (
                  <span className="font-mono">{walletAddress}</span>
                ) : (
                  "Belum connect"
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!isConnected ? (
                <button
                  className="h-10 rounded-full bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  disabled={isConnecting}
                  onClick={() => connect({ connector: injected() })}
                >
                  Connect MetaMask
                </button>
              ) : (
                <button
                  className="h-10 rounded-full border border-black/10 px-4 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <Field label="Batch ID">
              <input
                className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-white/10 dark:bg-black dark:focus:ring-white/10"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              />
            </Field>
            <Field label="Audit CID (IPFS)">
              <input
                className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-white/10 dark:bg-black dark:focus:ring-white/10"
                value={auditCid}
                onChange={(e) => setAuditCid(e.target.value)}
              />
            </Field>
            <Field label="Reject reason (optional)">
              <input
                className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-white/10 dark:bg-black dark:focus:ring-white/10"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Field>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <button
                className="h-11 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                disabled={!isConnected || isPending}
                onClick={() => call("verifyBatch")}
              >
                {isPending ? "Submitting…" : "Verify"}
              </button>
              <button
                className="h-11 rounded-full bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
                disabled={!isConnected || isPending}
                onClick={() => call("rejectBatch")}
              >
                {isPending ? "Submitting…" : "Reject"}
              </button>
            </div>

            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-100">
                {err}
              </div>
            )}

            {lastTx && (
              <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 text-sm dark:border-white/10 dark:bg-black">
                Tx hash: <span className="font-mono">{lastTx}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">{label}</div>
      {children}
    </div>
  );
}

