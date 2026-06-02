import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia, hardhat } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [hardhat, baseSepolia],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [baseSepolia.id]: http(),
  },
});

