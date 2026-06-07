import { writeFileSync } from "node:fs";
import { network } from "hardhat";

/**
 * Measure gas for HalalChain operations.
 * Usage:
 *   npx hardhat run scripts/evaluate-gas.ts --network localhost
 *   npx hardhat run scripts/evaluate-gas.ts --network baseSepolia
 *
 * Results written to docs/EVALUATION_RESULTS.json
 * Copy verified Base Sepolia numbers into paper Table (Section VI-B).
 */
async function main() {
  const net = await network.connect();
  const { ethers } = net;
  const signers = await ethers.getSigners();
  const [admin, producer, auditor] = signers;

  const HalalChain = await ethers.getContractFactory("HalalChain", admin);
  const halalChain = await HalalChain.deploy();
  await halalChain.waitForDeployment();

  const PRODUCER_ROLE = await halalChain.PRODUCER_ROLE();
  const AUDITOR_ROLE = await halalChain.AUDITOR_ROLE();
  await (await halalChain.grantRole(PRODUCER_ROLE, producer.address)).wait();
  await (await halalChain.grantRole(AUDITOR_ROLE, auditor.address)).wait();

  const results: Record<string, { gasUsed: string; network: string }> = {};
  const networkName = (net as { networkName?: string }).networkName ?? "unknown";

  async function measure(label: string, txPromise: Promise<{ wait: () => Promise<{ gasUsed: bigint } | null> }>) {
    const tx = await txPromise;
    const receipt = await tx.wait();
    results[label] = { gasUsed: receipt?.gasUsed?.toString() ?? "0", network: networkName };
  }

  await measure("registerBatch", halalChain.connect(producer).registerBatch("Eval Product", "bafy-eval") as never);
  await measure("verifyBatch", halalChain.connect(auditor).verifyBatch(1n, "bafy-audit") as never);

  await measure("registerBatch_2", halalChain.connect(producer).registerBatch("Reject Me", "bafy-r1") as never);
  await measure("rejectBatch", halalChain.connect(auditor).rejectBatch(2n, "Test reject", "bafy-audit-r") as never);
  await measure("registerRevision", halalChain.connect(producer).registerRevision(2n, "bafy-r2") as never);

  const out = {
    timestamp: new Date().toISOString(),
    network: networkName,
    note:
      networkName === "localhost"
        ? "LOCAL DEV ONLY — do not publish as Base Sepolia results. Re-run with --network baseSepolia after deploy."
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
