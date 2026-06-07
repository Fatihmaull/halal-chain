"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useI18n } from "@/lib/I18nProvider";
import {
  ipfsGatewayUrl,
  statusColors,
  statusKey,
  statusDescKey,
  basescanUrl,
} from "@/lib/batchUtils";
import { useBatch } from "@/lib/useBatches";
import { getHalalChainAddress } from "@/lib/contract";
import { AppHeader } from "@/components/ui";

export default function VerifyBatchPage({ params }: { params: { batchId: string } }) {
  const { t } = useI18n();
  const chainId = useChainId();
  const contractAddress = getHalalChainAddress();

  const batchId = useMemo(() => {
    try {
      return BigInt(params.batchId);
    } catch {
      return undefined;
    }
  }, [params.batchId]);

  const { batch, loading, error } = useBatch(batchId);

  const status = batch?.status ?? 0;
  const statusLabel = t(statusKey(status));
  const statusDesc = t(statusDescKey(status));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <AppHeader subtitle={t("verifyBatch")} />

      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{t("batchId")}</div>
          <div className="mt-1 text-3xl font-bold tracking-tight">#{params.batchId}</div>

          {!contractAddress && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Set <span className="font-mono">NEXT_PUBLIC_HALALCHAIN_ADDRESS</span> in web/.env.local
            </div>
          )}

          {loading && <div className="mt-6 text-sm text-zinc-600">{t("loading")}</div>}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              {t("notFound")}
            </div>
          )}

          {batch && (
            <>
              <div className={`mt-6 rounded-2xl border p-6 text-center ${statusColors(status)}`}>
                <div className="text-2xl font-bold">{statusLabel}</div>
                <p className="mt-2 text-sm opacity-80">{statusDesc}</p>
              </div>

              <dl className="mt-6 grid gap-3 text-sm">
                <InfoRow label={t("product")} value={batch.productName || "-"} />
                {batch.parentBatchId > 0n && (
                  <div>
                    <dt className="text-xs uppercase text-zinc-500">{t("parentBatch")}</dt>
                    <dd className="mt-1">
                      <Link className="text-emerald-600 underline" href={`/verify/${batch.parentBatchId}`}>
                        #{String(batch.parentBatchId)}
                      </Link>
                    </dd>
                  </div>
                )}
                {batch.ipfsCid && ipfsGatewayUrl(batch.ipfsCid) && (
                  <div>
                    <a
                      className="inline-flex h-10 items-center rounded-full bg-black/5 px-4 text-sm font-medium hover:bg-black/10 dark:bg-white/10"
                      href={ipfsGatewayUrl(batch.ipfsCid)!}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("viewDocuments")}
                    </a>
                  </div>
                )}
                {batch.auditIpfsCid && ipfsGatewayUrl(batch.auditIpfsCid) && (
                  <div>
                    <a
                      className="inline-flex h-10 items-center rounded-full bg-black/5 px-4 text-sm font-medium hover:bg-black/10 dark:bg-white/10"
                      href={ipfsGatewayUrl(batch.auditIpfsCid)!}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("viewAudit")}
                    </a>
                  </div>
                )}
                {batch.rejectReason && <InfoRow label={t("rejectReason")} value={batch.rejectReason} />}
                {contractAddress && basescanUrl(contractAddress, chainId) && (
                  <div>
                    <a
                      className="text-sm text-zinc-500 underline"
                      href={basescanUrl(contractAddress, chainId)!}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("basescan")}
                    </a>
                  </div>
                )}
              </dl>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">Powered by Base · HalalChain</p>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-black">
      <dt className="text-xs uppercase text-zinc-500">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
