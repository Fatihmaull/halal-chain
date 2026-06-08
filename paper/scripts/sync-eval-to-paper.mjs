#!/usr/bin/env node
/**
 * Sync docs/EVALUATION_RESULTS.json (sepolia or baseSepolia) into paper LaTeX sections.
 * Usage: node scripts/sync-eval-to-paper.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const paperDir = join(__dirname, "..");
const repoRoot = join(paperDir, "..");
const evalPath = join(repoRoot, "docs", "EVALUATION_RESULTS.json");

const raw = readFileSync(evalPath, "utf8");
const data = JSON.parse(raw);

const NETWORK_META = {
  sepolia: {
    label: "Ethereum Sepolia",
    chainId: 11155111,
    explorer: "Etherscan",
    explorerBase: "https://sepolia.etherscan.io/address",
    evalCmd: "evaluate:gas:eth-sepolia",
    l2Note:
      "Although HalalChain targets Base L2 for production, Ethereum Sepolia provides a publicly accessible EVM testnet for verifiable gas measurement.",
  },
  baseSepolia: {
    label: "Base Sepolia",
    chainId: 84532,
    explorer: "Basescan",
    explorerBase: "https://sepolia.basescan.org/address",
    evalCmd: "evaluate:gas:sepolia",
    l2Note: "These costs are suitable for UMKM-scale batch certification on an L2 rollup.",
  },
};

const meta = NETWORK_META[data.network];
if (!meta) {
  console.error(
    `EVALUATION_RESULTS.json network is "${data.network}". Expected "sepolia" or "baseSepolia".\n` +
      "Run: cd contracts && npm run evaluate:gas:eth-sepolia"
  );
  process.exit(1);
}

const ops = data.operations;
const fmtGas = (n) => Number(n).toLocaleString("en-US");
const fmtEth = (s) => {
  const v = Number(s);
  if (v === 0) return "0";
  if (v < 0.000001) return v.toExponential(2);
  return v.toFixed(8).replace(/\.?0+$/, "");
};

const rows = [
  ["registerBatch", ops.registerBatch],
  ["verifyBatch", ops.verifyBatch],
  ["rejectBatch", ops.rejectBatch],
  ["registerRevision", ops.registerRevision],
];

// --- Update 06_evaluation.tex ---
const evalTexPath = join(paperDir, "sections", "06_evaluation.tex");
let evalTex = readFileSync(evalTexPath, "utf8");

const tableBody = rows
  .map(
    ([name, op]) =>
      `    \\texttt{${name}} & ${fmtGas(op.gasUsed)} & ${fmtEth(op.costEth)} \\\\`
  )
  .join("\n");

evalTex = evalTex.replace(
  /\\subsection\{Quantitative Testnet Benchmarks\}[\s\S]*?\\end\{table\}/,
  `\\subsection{Quantitative Testnet Benchmarks}
\\label{sec:eval-b}

Table~\\ref{tab:gas} reports gas usage and transaction costs measured on ${meta.label} (chain ID ${meta.chainId}) on ${data.timestamp.slice(0, 10)}.
Contract address: \\texttt{${data.contractAddress}}.
All values were captured from on-chain receipts via \\texttt{npm run ${meta.evalCmd}} and cross-checked on ${meta.explorer}.

\\begin{table}[t]
  \\caption{Gas and cost metrics on ${meta.label} (${data.timestamp.slice(0, 10)}).}
  \\label{tab:gas}
  \\centering
  \\footnotesize
  \\begin{tabularx}{\\columnwidth}{@{}Xrr@{}}
    \\toprule
    \\textbf{Operation} & \\textbf{Gas Used} & \\textbf{Cost (ETH)} \\\\
    \\midrule
${tableBody}
    \\texttt{getBatch} (RPC read) & 0 & 0 \\\\
    \\bottomrule
  \\end{tabularx}
\\end{table}`
);

evalTex = evalTex.replace(
  /Planned metrics additionally include:[\s\S]*?Appendix~\\ref\{app:repro\}\./,
  `Registering a batch consumed ${fmtGas(ops.registerBatch.gasUsed)} gas (${fmtEth(ops.registerBatch.costEth)} ETH); verification consumed ${fmtGas(ops.verifyBatch.gasUsed)} gas (${fmtEth(ops.verifyBatch.costEth)} ETH).
${meta.l2Note}
See Appendix~\\ref{app:repro} for reproducibility instructions.`
);

writeFileSync(evalTexPath, evalTex);
console.log("Updated sections/06_evaluation.tex");

// --- Update abstract ---
const abstractPath = join(paperDir, "sections", "00_abstract.tex");
let abstract = readFileSync(abstractPath, "utf8");

abstract = abstract.replace(
  /Section~\\ref\{sec:eval\} reports qualitative[\s\S]*?\(Section~\\ref\{sec:eval-b\}\)\./,
  `Section~\\ref{sec:eval} reports qualitative security analysis and functional scenario testing; on ${meta.label} testnet, \\texttt{registerBatch} used ${fmtGas(ops.registerBatch.gasUsed)} gas (${fmtEth(ops.registerBatch.costEth)} ETH) and \\texttt{verifyBatch} used ${fmtGas(ops.verifyBatch.gasUsed)} gas (${fmtEth(ops.verifyBatch.costEth)} ETH).`
);

writeFileSync(abstractPath, abstract);
console.log("Updated sections/00_abstract.tex");

// --- Update appendix ---
let commitHash = "unknown";
try {
  commitHash = execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
} catch {
  /* ignore */
}

const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL || "TBD after Vercel deploy";
const appendixPath = join(paperDir, "sections", "appendix_reproducibility.tex");
let appendix = readFileSync(appendixPath, "utf8");

appendix = appendix.replace(
  /\\subsection\{Record Placeholders\}[\s\S]*?See \\texttt\{docs\/BASELINE\.md\}/,
  `\\subsection{Deployment Records}
\\begin{itemize}
  \\item Git commit:\\\\
  \\url{https://github.com/Fatihmaull/halal-chain/commit/${commitHash}}
  \\item Contract (${meta.label}):\\\\
  \\url{${meta.explorerBase}/${data.contractAddress}}
  \\item Chain ID: ${meta.chainId} (${meta.label})
  \\item Evaluation timestamp: ${data.timestamp}
  \\item Frontend demo:\\\\
  ${demoUrl.startsWith("http") ? `\\url{${demoUrl.replace(/\\/$/, "")}/}` : demoUrl}
  \\item Raw metrics: \\path{docs/EVALUATION_RESULTS.json}
\\end{itemize}

See \\texttt{docs/BASELINE.md}`
);

writeFileSync(appendixPath, appendix);
console.log("Updated sections/appendix_reproducibility.tex");

// --- Update EVALUATION_RESULTS.md status ---
const resultsMdPath = join(repoRoot, "docs", "EVALUATION_RESULTS.md");
let resultsMd = readFileSync(resultsMdPath, "utf8");
resultsMd = resultsMd.replace(
  /\| Base Sepolia \| \*\*Pending\*\*[\s\S]*?\|/,
  `| Base Sepolia | **Complete** | ${data.timestamp.slice(0, 10)} — see EVALUATION_RESULTS.json |`
);
resultsMd = resultsMd.replace(
  /_Results will appear in `EVALUATION_RESULTS\.json`[\s\S]*?```\n-->/,
  `_Last sync: ${data.timestamp}. Paper sections updated via \`npm run sync:eval\`._`
);
writeFileSync(resultsMdPath, resultsMd);
console.log("Updated docs/EVALUATION_RESULTS.md");

console.log("\nDone. Run: cd paper && make pdf");
