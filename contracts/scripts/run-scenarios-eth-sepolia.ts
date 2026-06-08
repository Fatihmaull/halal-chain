import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { network } from "hardhat";
import type { ContractRunner, Signer } from "ethers";

const DEFAULT_CONTRACT = "0xDaCA688e86F438A7cD6B0C9B69606C67CE85Dc92";
const EVAL_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../docs/evaluation");
const LOG_DIR = join(EVAL_DIR, "logs");

type TxRecord = { label: string; txHash: string; blockNumber?: number };

async function main() {
  const net = await network.connect();
  const { ethers } = net;
  const signers = await ethers.getSigners();
  const admin = signers[0];
  if (!admin) throw new Error("No deployer signer. Set DEPLOYER_PRIVATE_KEY in contracts/.env");

  let producer: Signer;
  let auditor: Signer;

  if (process.env.PRODUCER_PRIVATE_KEY && process.env.AUDITOR_PRIVATE_KEY) {
    producer = new ethers.Wallet(process.env.PRODUCER_PRIVATE_KEY, ethers.provider);
    auditor = new ethers.Wallet(process.env.AUDITOR_PRIVATE_KEY, ethers.provider);
  } else if (signers.length >= 3) {
    producer = signers[1];
    auditor = signers[2];
  } else {
    producer = admin;
    auditor = admin;
    console.log("Single-signer mode: using deployer for producer and auditor calls.");
  }

  const contractAddress = process.env.HALALCHAIN_ADDRESS || DEFAULT_CONTRACT;
  const halalChain = await ethers.getContractAt("HalalChain", contractAddress, admin);

  const PRODUCER_ROLE = await halalChain.PRODUCER_ROLE();
  const AUDITOR_ROLE = await halalChain.AUDITOR_ROLE();
  const producerAddr = await producer.getAddress();
  const auditorAddr = await auditor.getAddress();

  if (!(await halalChain.hasRole(PRODUCER_ROLE, producerAddr))) {
    await (await halalChain.grantRole(PRODUCER_ROLE, producerAddr)).wait();
  }
  if (!(await halalChain.hasRole(AUDITOR_ROLE, auditorAddr))) {
    await (await halalChain.grantRole(AUDITOR_ROLE, auditorAddr)).wait();
  }

  const producerContract = halalChain.connect(producer as ContractRunner);
  const auditorContract = halalChain.connect(auditor as ContractRunner);

  const log: string[] = [];
  const txHashes: TxRecord[] = [];

  async function send(
    label: string,
    txPromise: Promise<{ hash: string; wait: () => Promise<{ blockNumber?: number } | null> }>
  ) {
    const tx = await txPromise;
    const receipt = await tx.wait();
    txHashes.push({ label, txHash: tx.hash, blockNumber: receipt?.blockNumber });
    log.push(`${label}: ${tx.hash} (block ${receipt?.blockNumber})`);
    console.log(log[log.length - 1]);
    return receipt;
  }

  mkdirSync(LOG_DIR, { recursive: true });

  const scenarioA_batchId = await halalChain.nextBatchId();

  const regAReceipt = await send(
    "A_registerBatch",
    producerContract.registerBatch("Keripik Singkong", "bafy-scenario-a") as never
  );
  const verAReceipt = await send(
    "A_verifyBatch",
    auditorContract.verifyBatch(scenarioA_batchId, "bafy-audit-a") as never
  );

  const blockConfirmationSeconds =
    regAReceipt?.blockNumber != null && verAReceipt?.blockNumber != null
      ? (verAReceipt.blockNumber - regAReceipt.blockNumber) * 12
      : null;

  const batchA = await halalChain.getBatch(scenarioA_batchId);
  const scenarioA_pass = batchA.status === 2n;

  const scenarioB_batch1 = await halalChain.nextBatchId();
  await send(
    "B_registerBatch",
    producerContract.registerBatch("Sambal UMKM", "bafy-scenario-b1") as never
  );
  await send(
    "B_rejectBatch",
    auditorContract.rejectBatch(scenarioB_batch1, "Bahan tidak jelas", "bafy-audit-reject") as never
  );

  const batchB1 = await halalChain.getBatch(scenarioB_batch1);
  const scenarioB_rejected_pass = batchB1.status === 3n;

  const scenarioB_batch2 = await halalChain.nextBatchId();
  await send(
    "B_registerRevision",
    producerContract.registerRevision(scenarioB_batch1, "bafy-scenario-b2") as never
  );
  await send(
    "B_verifyBatch",
    auditorContract.verifyBatch(scenarioB_batch2, "bafy-audit-b2") as never
  );

  const batchB2 = await halalChain.getBatch(scenarioB_batch2);
  const scenarioB_pass =
    scenarioB_rejected_pass && batchB2.status === 2n && batchB2.parentBatchId === scenarioB_batch1;

  let scenarioC_revertError = "";
  let scenarioC_revertCaptured = false;
  try {
    await auditorContract.verifyBatch(scenarioB_batch1, "bafy-tamper");
    log.push("C_verifyBatch: ERROR — expected revert but tx succeeded");
  } catch (err) {
    scenarioC_revertCaptured = true;
    scenarioC_revertError = err instanceof Error ? err.message : String(err);
    log.push(`C_verifyBatch: reverted as expected (${scenarioC_revertError.slice(0, 120)})`);
    writeFileSync(join(LOG_DIR, "scenario-c-revert.log"), scenarioC_revertError);
  }

  const batchB1After = await halalChain.getBatch(scenarioB_batch1);
  const scenarioC_pass =
    scenarioC_revertCaptured &&
    batchB1After.status === 3n &&
    batchB1After.rejectReason === "Bahan tidak jelas";

  const demoBase = process.env.NEXT_PUBLIC_DEMO_URL || "http://localhost:3000";
  const networkName = (net as { networkName?: string }).networkName ?? "sepolia";

  const report = {
    timestamp: new Date().toISOString(),
    network: networkName,
    chainId: 11155111,
    contractAddress,
    scenarios: {
      A: {
        batchIds: [Number(scenarioA_batchId)],
        txHashes: txHashes.filter((t) => t.label.startsWith("A_")).map((t) => t.txHash),
        verifyUrl: `${demoBase}/verify/${scenarioA_batchId}`,
        screenshot: "screenshots/scenario-a-verified.png",
        pass: scenarioA_pass,
      },
      B: {
        batchIds: [Number(scenarioB_batch1), Number(scenarioB_batch2)],
        txHashes: txHashes.filter((t) => t.label.startsWith("B_")).map((t) => t.txHash),
        verifyUrls: {
          rejected: `${demoBase}/verify/${scenarioB_batch1}`,
          verified: `${demoBase}/verify/${scenarioB_batch2}`,
        },
        parentLinkVerified: batchB2.parentBatchId === scenarioB_batch1,
        screenshotRejected: "screenshots/scenario-b-rejected.png",
        screenshotVerified: "screenshots/scenario-b-revision-verified.png",
        pass: scenarioB_pass,
      },
      C: {
        rejectedBatchId: Number(scenarioB_batch1),
        revertError: scenarioC_revertError,
        error: "InvalidStatus",
        getBatchStillRejected: batchB1After.status === 3n,
        verifyUrl: `${demoBase}/verify/${scenarioB_batch1}`,
        screenshot: "screenshots/scenario-b-rejected.png",
        pass: scenarioC_pass,
      },
    },
    metrics: {
      blockConfirmationSeconds,
      verifyPageTTFBms: null,
      ipfsUploadMs: null,
    },
    unitTests: { passed: null, total: 7, logFile: "logs/npm-test.log" },
    gasEval: "docs/EVALUATION_RESULTS.json",
    transactions: txHashes,
  };

  writeFileSync(join(EVAL_DIR, "EVALUATION_REPORT.json"), JSON.stringify(report, null, 2));
  writeFileSync(join(LOG_DIR, "scenarios-eth-sepolia.log"), log.join("\n"));

  console.log("\nEVALUATION_REPORT.json written");
  console.log("Scenario A:", scenarioA_pass ? "PASS" : "FAIL");
  console.log("Scenario B:", scenarioB_pass ? "PASS" : "FAIL");
  console.log("Scenario C:", scenarioC_pass ? "PASS" : "FAIL");

  if (!scenarioA_pass || !scenarioB_pass || !scenarioC_pass) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
