import { network } from "hardhat";

const FAUCET_HINTS: Record<string, string> = {
  sepolia: "https://sepoliafaucet.com/ or https://faucet.quicknode.com/ethereum/sepolia",
  baseSepolia: "https://www.alchemy.com/faucets/base-sepolia",
};

async function main() {
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    console.error("Missing DEPLOYER_PRIVATE_KEY in contracts/.env");
    console.error("See docs/ETH_SEPOLIA_SETUP.md");
    process.exitCode = 1;
    return;
  }

  const net = await network.connect();
  const { ethers } = net;
  const networkName = (net as { networkName?: string }).networkName ?? "unknown";
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    console.error("Could not load deployer signer from DEPLOYER_PRIVATE_KEY");
    process.exitCode = 1;
    return;
  }

  const address = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(address);
  const eth = ethers.formatEther(balance);

  console.log("Network:", networkName);
  console.log("Deployer:", address);
  console.log("Balance:", eth, "ETH");

  if (balance === 0n) {
    console.error(`Deployer has 0 ETH. Fund via ${FAUCET_HINTS[networkName] ?? "a testnet faucet"}`);
    process.exitCode = 1;
    return;
  }

  const deployCmd = networkName === "sepolia" ? "deploy:eth-sepolia" : "deploy:base-sepolia";
  console.log(`Preflight OK — ready for npm run ${deployCmd}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
