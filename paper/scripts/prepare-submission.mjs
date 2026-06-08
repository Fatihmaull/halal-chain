#!/usr/bin/env node
/**
 * Fill submission metadata (commit hash, checklist) without requiring Sepolia deploy.
 * Usage: node scripts/prepare-submission.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const paperDir = join(__dirname, "..");
const repoRoot = join(paperDir, "..");

let commitHash = "update before submission";
try {
  commitHash = execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
} catch {
  /* ignore */
}

const evalPath = join(repoRoot, "docs", "EVALUATION_RESULTS.json");
let contractAddress = "TBD after deployment";
let evalTimestamp = "";
let demoUrl = process.env.NEXT_PUBLIC_DEMO_URL || "TBD after Vercel deploy";

const NETWORK_LABELS = { sepolia: "Ethereum Sepolia", baseSepolia: "Base Sepolia" };
const NETWORK_CHAIN_IDS = { sepolia: 11155111, baseSepolia: 84532 };
let networkLabel = "testnet";
let chainId = "pending";
let setupDoc = "docs/ETH\\_SEPOLIA\\_SETUP.md";

if (existsSync(evalPath)) {
  const data = JSON.parse(readFileSync(evalPath, "utf8"));
  if ((data.network === "sepolia" || data.network === "baseSepolia") && data.contractAddress) {
    contractAddress = data.contractAddress;
    evalTimestamp = data.timestamp;
    networkLabel = NETWORK_LABELS[data.network] ?? data.network;
    chainId = NETWORK_CHAIN_IDS[data.network] ?? data.chainId ?? "unknown";
    setupDoc =
      data.network === "sepolia" ? "docs/ETH\\_SEPOLIA\\_SETUP.md" : "docs/BASE\\_SEPOLIA\\_SETUP.md";
  }
}

const appendixPath = join(paperDir, "sections", "appendix_reproducibility.tex");
let appendix = readFileSync(appendixPath, "utf8");

const recordsBlock = `\\subsection{Deployment Records}
\\begin{itemize}
  \\item Git commit hash: \\texttt{${commitHash}}
  \\item Contract address (${networkLabel}): \\texttt{${contractAddress}}
  \\item Chain ID: ${chainId} (${networkLabel})
  \\item Evaluation timestamp: ${evalTimestamp || "pending — run evaluate:gas:eth-sepolia"}
  \\item Frontend demo URL: ${demoUrl.startsWith("http") ? `\\url{${demoUrl}}` : demoUrl}
  \\item Setup tutorial: \\texttt{${setupDoc}}
  \\item Raw metrics: \\texttt{docs/EVALUATION\\_RESULTS.json}
\\end{itemize}

See \\texttt{docs/BASELINE.md}`;

if (appendix.includes("\\subsection{Record Placeholders}")) {
  appendix = appendix.replace(
    /\\subsection\{Record Placeholders\}[\s\S]*?See \\texttt\{docs\/BASELINE\.md\}/,
    recordsBlock
  );
} else if (appendix.includes("\\subsection{Deployment Records}")) {
  appendix = appendix.replace(
    /\\subsection\{Deployment Records\}[\s\S]*?See \\texttt\{docs\/BASELINE\.md\}/,
    recordsBlock
  );
}

writeFileSync(appendixPath, appendix);
console.log("Updated appendix with commit:", commitHash);
console.log("Contract address:", contractAddress);
