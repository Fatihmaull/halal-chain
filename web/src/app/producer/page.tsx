"use client";

import Link from "next/link";
import { useState } from "react";
import { type Address, isAddress } from "viem";
import { useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";

export default function ProducerPage() {
  const address = getHalalChainAddress();
  const { address: walletAddress, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const [productName, setProductName] = useState("Keripik");
  const [ipfsCid, setIpfsCid] = useState("bafy-docs");

  const { writeContractAsync, isPending } = useWriteContract();
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const contractAddress: Address | undefined =
    address && isAddress(address) ? (address as Address) : undefined;

  async function onRegister() {
    setErr(null);
    setLastTx(null);
    if (!contractAddress) {
      setErr("NEXT_PUBLIC_HALALCHAIN_ADDRESS belum diset / invalid.");
      return;
    }
    try {
      const hash = await writeContractAsync({
        abi: halalChainAbi,
        address: contractAddress,
        functionName: "registerBatch",
        args: [productName, ipfsCid],
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
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Producer dashboard</div>
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
            <Field label="Product name">
              <input
                className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-white/10 dark:bg-black dark:focus:ring-white/10"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Field>
            <Field label="Docs CID (IPFS)">
              <input
                className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-white/10 dark:bg-black dark:focus:ring-white/10"
                value={ipfsCid}
                onChange={(e) => setIpfsCid(e.target.value)}
              />
            </Field>

            <button
              className="mt-2 h-11 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              disabled={!isConnected || isPending}
              onClick={onRegister}
            >
              {isPending ? "Submitting…" : "Register batch"}
            </button>

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

