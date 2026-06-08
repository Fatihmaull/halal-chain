"use client";

import { useCallback, useEffect, useState } from "react";
import { type Address, isAddress } from "viem";
import { usePublicClient } from "wagmi";
import { halalChainAbi } from "@/lib/halalChainAbi";
import { getHalalChainAddress } from "@/lib/contract";
import { targetChainId } from "@/lib/wagmi";
import type { BatchRecord } from "@/lib/batchUtils";

export function useNextBatchId() {
  const address = getHalalChainAddress();
  const client = usePublicClient({ chainId: targetChainId });
  const [nextId, setNextId] = useState<bigint | null>(null);

  const refetch = useCallback(async () => {
    if (!client || !address || !isAddress(address)) return;
    const id = await client.readContract({
      address: address as Address,
      abi: halalChainAbi,
      functionName: "nextBatchId",
    });
    setNextId(id as bigint);
  }, [client, address]);

  useEffect(() => {
    refetch().catch(() => setNextId(null));
  }, [refetch]);

  return { nextId, refetch };
}

export function useBatch(batchId: bigint | undefined) {
  const address = getHalalChainAddress();
  const client = usePublicClient({ chainId: targetChainId });
  const [batch, setBatch] = useState<BatchRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!client || !address || !isAddress(address) || !batchId || batchId <= 0n) return;
    setLoading(true);
    setError(null);
    try {
      const data = await client.readContract({
        address: address as Address,
        abi: halalChainAbi,
        functionName: "getBatch",
        args: [batchId],
      });
      setBatch(data as BatchRecord);
    } catch (e) {
      setError(String((e as Error).message || e));
      setBatch(null);
    } finally {
      setLoading(false);
    }
  }, [client, address, batchId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { batch, loading, error, refetch };
}

export function useAllBatches() {
  const { nextId, refetch: refetchNextId } = useNextBatchId();
  const address = getHalalChainAddress();
  const client = usePublicClient({ chainId: targetChainId });
  const [batches, setBatches] = useState<{ id: bigint; batch: BatchRecord }[]>([]);
  const [loading, setLoading] = useState(false);

  const refetchAll = useCallback(async () => {
    if (!client || !address || !isAddress(address)) {
      setBatches([]);
      return;
    }
    setLoading(true);
    try {
      await refetchNextId();
      const id = (await client.readContract({
        address: address as Address,
        abi: halalChainAbi,
        functionName: "nextBatchId",
      })) as bigint;

      if (id <= 1n) {
        setBatches([]);
        return;
      }

      const results: { id: bigint; batch: BatchRecord }[] = [];
      for (let batchNum = 1n; batchNum < id; batchNum++) {
        try {
          const data = await client.readContract({
            address: address as Address,
            abi: halalChainAbi,
            functionName: "getBatch",
            args: [batchNum],
          });
          results.push({ id: batchNum, batch: data as BatchRecord });
        } catch {
          /* skip invalid */
        }
      }
      setBatches(results);
    } finally {
      setLoading(false);
    }
  }, [client, address, refetchNextId]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return { batches, loading, refetch: refetchAll, pending: batches.filter((b) => b.batch.status === 1) };
}

export function useHasAuditorRole(walletAddress?: Address) {
  const address = getHalalChainAddress();
  const client = usePublicClient({ chainId: targetChainId });
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  useEffect(() => {
    if (!client || !address || !isAddress(address) || !walletAddress) {
      setHasRole(null);
      return;
    }
    client
      .readContract({
        address: address as Address,
        abi: halalChainAbi,
        functionName: "AUDITOR_ROLE",
      })
      .then((role) =>
        client.readContract({
          address: address as Address,
          abi: halalChainAbi,
          functionName: "hasRole",
          args: [role as `0x${string}`, walletAddress],
        })
      )
      .then((result) => setHasRole(Boolean(result)))
      .catch(() => setHasRole(false));
  }, [client, address, walletAddress]);

  return hasRole;
}
