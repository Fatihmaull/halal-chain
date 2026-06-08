import { writeFileSync } from "node:fs";
import { network } from "hardhat";
import type { ContractRunner, Signer } from "ethers";

type OpResult = {
  gasUsed: string;
  effectiveGasPriceGwei: string;
  costEth: string;
  txHash: string;
  network: string;
};

/**
 * Measure gas for HalalChain operations.
 * Usage:
 *   npx hardhat run scripts/evaluate-gas.ts --network localhost
 *   npx hardhat run scripts/evaluate-gas.ts --network baseSepolia
 *
 * Base Sepolia: set DEPLOYER_PRIVATE_KEY in contracts/.env.
 * Optional: PRODUCER_PRIVATE_KEY, AUDITOR_PRIVATE_KEY for role-separated calls.
 * If only one signer is available, all roles are granted to the deployer (gas benchmarking only).
 *
 * Results written to docs/EVALUATION_RESULTS.json
 */
async function main() {
  const net = await network.connect();
  const { ethers } = net;
  const signers = await ethers.getSigners();
  const admin = signers[0];
  if (!admin) {
    throw new Error("No deployer signer. Set DEPLOYER_PRIVATE_KEY in contracts/.env");
  }

  const networkName = (net as { networkName?: string }).networkName ?? "unknown";

  let producer: Signer;
  let auditor: Signer;

  if (signers.length >= 3) {
    producer = signers[1];
    auditor = signers[2];
  } else if (process.env.PRODUCER_PRIVATE_KEY && process.env.AUDITOR_PRIVATE_KEY) {
    producer = new ethers.Wallet(process.env.PRODUCER_PRIVATE_KEY, ethers.provider);
    auditor = new ethers.Wallet(process.env.AUDITOR_PRIVATE_KEY, ethers.provider);
    console.log("Using PRODUCER_PRIVATE_KEY / AUDITOR_PRIVATE_KEY from env");
  } else {
    console.log(
      "Single-signer mode: granting PRODUCER_ROLE and AUDITOR_ROLE to deployer for gas benchmarking."
    );
    producer = admin;
    auditor = admin;
  }

  const producerAddress = await producer.getAddress();
  const auditorAddress = await auditor.getAddress();
  console.log("Admin:", await admin.getAddress());
  console.log("Producer:", producerAddress);
  console.log("Auditor:", auditorAddress);

  let halalChain;
  if (process.env.HALALCHAIN_ADDRESS) {
    halalChain = await ethers.getContractAt("HalalChain", process.env.HALALCHAIN_ADDRESS, admin);
    console.log("Using existing contract:", process.env.HALALCHAIN_ADDRESS);
  } else {
    const HalalChain = await ethers.getContractFactory("HalalChain", admin);
    halalChain = await HalalChain.deploy();
    await halalChain.waitForDeployment();
    console.log("Deployed fresh contract:", await halalChain.getAddress());
  }

  const PRODUCER_ROLE = await halalChain.PRODUCER_ROLE();
  const AUDITOR_ROLE = await halalChain.AUDITOR_ROLE();

  if (!(await halalChain.hasRole(PRODUCER_ROLE, producerAddress))) {
    await (await halalChain.grantRole(PRODUCER_ROLE, producerAddress)).wait();
  }
  if (!(await halalChain.hasRole(AUDITOR_ROLE, auditorAddress))) {
    await (await halalChain.grantRole(AUDITOR_ROLE, auditorAddress)).wait();
  }

  const results: Record<string, OpResult> = {};

  async function measure(
    label: string,
    txPromise: Promise<{
      hash: string;
      wait: () => Promise<{
        gasUsed: bigint;
        effectiveGasPrice?: bigint;
        gasPrice?: bigint;
      } | null>;
    }>
  ) {
    const tx = await txPromise;
    const receipt = await tx.wait();
    const gasUsed = receipt?.gasUsed ?? 0n;
    const gasPrice = receipt?.effectiveGasPrice ?? receipt?.gasPrice ?? 0n;
    const costWei = gasUsed * gasPrice;
    const costEth = ethers.formatEther(costWei);
    const effectiveGasPriceGwei = ethers.formatUnits(gasPrice, "gwei");

    results[label] = {
      gasUsed: gasUsed.toString(),
      effectiveGasPriceGwei,
      costEth,
      txHash: tx.hash,
      network: networkName,
    };

    const explorer =
      networkName === "sepolia"
        ? `https://sepolia.etherscan.io/tx/${tx.hash}`
        : networkName === "baseSepolia"
          ? `https://sepolia.basescan.org/tx/${tx.hash}`
          : tx.hash;
    console.log(`${label}: gas=${gasUsed} cost=${costEth} ETH — ${explorer}`);
  }

  const producerContract = halalChain.connect(producer as ContractRunner);
  const auditorContract = halalChain.connect(auditor as ContractRunner);

  await measure("registerBatch", producerContract.registerBatch("Eval Product", "bafy-eval") as never);
  await measure("verifyBatch", auditorContract.verifyBatch(1n, "bafy-audit") as never);

  await measure("registerBatch_2", producerContract.registerBatch("Reject Me", "bafy-r1") as never);
  await measure(
    "rejectBatch",
    auditorContract.rejectBatch(2n, "Test reject", "bafy-audit-r") as never
  );
  await measure("registerRevision", producerContract.registerRevision(2n, "bafy-r2") as never);

  const out = {
    timestamp: new Date().toISOString(),
    network: networkName,
    chainId:
      networkName === "sepolia" ? 11155111 : networkName === "baseSepolia" ? 84532 : undefined,
    contractAddress: await halalChain.getAddress(),
    note:
      networkName === "localhost"
        ? "LOCAL DEV ONLY — do not publish as testnet results. Re-run with --network sepolia or baseSepolia after deploy."
        : networkName === "sepolia"
          ? "Ethereum Sepolia results — verify on Etherscan before adding to paper."
          : "Base Sepolia results — verify on Basescan before adding to paper.",
    operations: results,
  };

  console.log(JSON.stringify(out, null, 2));
  writeFileSync(new URL("../../docs/EVALUATION_RESULTS.json", import.meta.url), JSON.stringify(out, null, 2));
  console.log("\nWritten to docs/EVALUATION_RESULTS.json");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
