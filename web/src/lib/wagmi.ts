import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia, hardhat, sepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [hardhat, sepolia, baseSepolia],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [baseSepolia.id]: http(),
  },
});

