import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia, hardhat, sepolia } from "wagmi/chains";

/** Chain used for contract reads (verify page works without a connected wallet). */
export const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || sepolia.id);

const sepoliaRpc =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL?.trim() ||
  sepolia.rpcUrls.default.http[0];

export const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia, hardhat],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(sepoliaRpc),
    [baseSepolia.id]: http(),
  },
});

