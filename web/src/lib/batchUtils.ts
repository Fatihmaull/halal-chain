export function ipfsGatewayUrl(cid: string) {
  if (!cid) return null;
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs";
  return `${gateway}/${cid}`;
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadToIpfs(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/ipfs/upload", { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }
  const { cid } = await res.json();
  return cid as string;
}

export type BatchMetadata = {
  productName: string;
  productionDate?: string;
  expiryDate?: string;
  ingredients?: string;
  supplier?: string;
  facility?: string;
};

export async function uploadBatchMetadata(meta: BatchMetadata): Promise<string> {
  const blob = new Blob([JSON.stringify(meta, null, 2)], { type: "application/json" });
  const file = new File([blob], "batch-metadata.json", { type: "application/json" });
  return uploadToIpfs(file);
}

export type BatchRecord = {
  producer: `0x${string}`;
  productName: string;
  ipfsCid: string;
  createdAt: bigint;
  status: number;
  auditor: `0x${string}`;
  auditedAt: bigint;
  auditIpfsCid: string;
  rejectReason: string;
  parentBatchId: bigint;
};

export function statusKey(status: number): "statusVerified" | "statusPending" | "statusRejected" | "statusRevoked" | "statusUnknown" {
  switch (status) {
    case 1:
      return "statusPending";
    case 2:
      return "statusVerified";
    case 3:
      return "statusRejected";
    case 4:
      return "statusRevoked";
    default:
      return "statusUnknown";
  }
}

export function statusDescKey(status: number): "statusVerifiedDesc" | "statusPendingDesc" | "statusRejectedDesc" | "statusRevokedDesc" | "statusUnknown" {
  switch (status) {
    case 1:
      return "statusPendingDesc";
    case 2:
      return "statusVerifiedDesc";
    case 3:
      return "statusRejectedDesc";
    case 4:
      return "statusRevokedDesc";
    default:
      return "statusUnknown";
  }
}

export function statusColors(status: number) {
  switch (status) {
    case 2:
      return "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100";
    case 1:
      return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100";
    case 3:
      return "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-100";
    case 4:
      return "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }
}

export function getDemoUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_DEMO_URL || "http://localhost:3000";
}

export function blockExplorerAddressUrl(address: string, chainId?: number) {
  if (chainId === 11155111) return `https://sepolia.etherscan.io/address/${address}`;
  if (chainId === 84532) return `https://sepolia.basescan.org/address/${address}`;
  return null;
}

/** @deprecated use blockExplorerAddressUrl */
export function basescanUrl(address: string, chainId?: number) {
  return blockExplorerAddressUrl(address, chainId);
}
