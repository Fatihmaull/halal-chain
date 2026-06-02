import { type Address } from "viem";

export function getHalalChainAddress() {
  const addr = process.env.NEXT_PUBLIC_HALALCHAIN_ADDRESS;
  return (addr || undefined) as Address | undefined;
}

