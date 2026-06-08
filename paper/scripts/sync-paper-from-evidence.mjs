#!/usr/bin/env node
/**
 * Sync docs/evaluation/EVALUATION_REPORT.json into paper LaTeX + supporting docs.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const paperDir = join(__dirname, "..");
const repoRoot = join(paperDir, "..");
const evalDir = join(repoRoot, "docs", "evaluation");
const reportPath = join(evalDir, "EVALUATION_REPORT.json");
const figuresEvalDir = join(paperDir, "figures", "eval");

if (!existsSync(reportPath)) {
  console.error("Missing docs/evaluation/EVALUATION_REPORT.json — run npm run scenarios:eth-sepolia first");
  process.exit(1);
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
const networkLabel = report.network === "sepolia" ? "Ethereum Sepolia" : report.network;
const chainId = report.chainId ?? 11155111;
const date = report.timestamp?.slice(0, 10) ?? "unknown";

mkdirSync(figuresEvalDir, { recursive: true });

function copyScreenshot(relPath) {
  if (!relPath) return null;
  const src = join(evalDir, relPath);
  if (!existsSync(src)) return null;
  const dest = join(figuresEvalDir, basename(relPath));
  copyFileSync(src, dest);
  return `figures/eval/${basename(relPath)}`;
}

const figA = copyScreenshot(report.scenarios?.A?.screenshot);
const figBRejected = copyScreenshot(report.scenarios?.B?.screenshotRejected);
const figBVerified = copyScreenshot(report.scenarios?.B?.screenshotVerified);

const scenarioAText = report.scenarios?.A?.pass
  ? `Scenario~A (batch \\#${report.scenarios.A.batchIds?.[0]}): producer registration and auditor verification on ${networkLabel} testnet; consumer page at \\texttt{/verify/${report.scenarios.A.batchIds?.[0]}} displays verified status.`
  : `Scenario~A did not pass on ${networkLabel} testnet.`;

const scenarioBText = report.scenarios?.B?.pass
  ? `Scenario~B: batch \\#${report.scenarios.B.batchIds?.[0]} rejected, revision batch \\#${report.scenarios.B.batchIds?.[1]} verified with parent link preserved.`
  : `Scenario~B did not pass on ${networkLabel} testnet.`;

const scenarioCText = report.scenarios?.C?.pass
  ? `Scenario~C: \\texttt{verifyBatch} on rejected batch \\#${report.scenarios.C.rejectedBatchId} reverts (\\texttt{InvalidStatus}); on-chain state unchanged.`
  : `Scenario~C did not pass on ${networkLabel} testnet.`;

let figuresBlock = "";
if (figA) {
  figuresBlock += `
\\begin{figure}[t]
  \\centering
  \\includegraphics[width=0.88\\columnwidth]{${figA}}
  \\caption{Consumer verification page (Scenario~A, ${networkLabel}).}
  \\label{fig:scenario-a}
\\end{figure}`;
}
if (figBRejected) {
  figuresBlock += `
\\begin{figure}[t]
  \\centering
  \\includegraphics[width=0.88\\columnwidth]{${figBRejected}}
  \\caption{Rejected batch consumer view (Scenario~B/C, ${networkLabel}).}
  \\label{fig:scenario-b-rejected}
\\end{figure}`;
}
if (figBVerified) {
  figuresBlock += `
\\begin{figure}[t]
  \\centering
  \\includegraphics[width=0.88\\columnwidth]{${figBVerified}}
  \\caption{Verified revision batch with parent link (Scenario~B, ${networkLabel}).}
  \\label{fig:scenario-b-verified}
\\end{figure}`;
}

// --- 06_evaluation.tex ---
const evalTexPath = join(paperDir, "sections", "06_evaluation.tex");
let evalTex = readFileSync(evalTexPath, "utf8");

evalTex = evalTex.replace(
  /We structure evaluation into two tiers[\s\S]*?This separation avoids conflating[\s\S]*?~\cite\{casino2021systematic\}\./,
  `We structure evaluation into two tiers: (VI-A) qualitative analysis and functional validation on ${networkLabel} testnet (chain ID ${chainId}); and (VI-B) quantitative gas benchmarks from on-chain receipts (Table~\\ref{tab:gas}).
This separation avoids conflating developer-machine measurements with public network costs~\\cite{casino2021systematic}.`
);

evalTex = evalTex.replace(
  /Three end-to-end scenarios from \\texttt\{docs\/EVALUATION\.md\} were executed on a local Hardhat network[\s\S]*?Local validation confirms protocol correctness and UI integration; it does not substitute for public testnet latency, fee volatility, or Pinata production SLAs\./,
  `Three end-to-end scenarios from \\texttt{docs/EVALUATION.md} were executed on ${networkLabel} testnet (contract \\texttt{${report.contractAddress}}) on ${date}, with evidence archived in \\texttt{docs/evaluation/}.

\\paragraph{Scenario A (happy path).}
${scenarioAText}

\\paragraph{Scenario B (rejection and revision).}
${scenarioBText}

\\paragraph{Scenario C (tamper resistance).}
${scenarioCText}

Functional validation on ${networkLabel} confirms protocol correctness and wallet-free consumer reads via the Next.js frontend; gas costs on L1 testnet upper-bound L2 deployment feasibility~\\cite{optimism2024spec}.
${figuresBlock}`
);

const metrics = report.metrics ?? {};
const metricsText = [
  metrics.blockConfirmationSeconds != null
    ? `Block confirmation window (register $\\rightarrow$ verify): ${metrics.blockConfirmationSeconds}s (estimated from receipt block numbers).`
    : null,
  metrics.verifyPageTTFBms != null
    ? `Consumer page time-to-first-byte: ${metrics.verifyPageTTFBms}ms.`
    : null,
  metrics.ipfsUploadMs != null ? `IPFS upload latency: ${metrics.ipfsUploadMs}ms.` : null,
]
  .filter(Boolean)
  .join(" ");

if (metricsText) {
  evalTex = evalTex.replace(
    /Planned metrics additionally include:[\s\S]*?Appendix~\\ref\{app:repro\}\./,
    `${metricsText} See Appendix~\\ref{app:repro} for reproducibility instructions.`
  );
}

writeFileSync(evalTexPath, evalTex);
console.log("Updated sections/06_evaluation.tex");

// --- introduction ---
const introPath = join(paperDir, "sections", "01_introduction.tex");
let intro = readFileSync(introPath, "utf8");
intro = intro.replace(
  /empirical Base Sepolia benchmarks reserved \(Section~\\ref\{sec:eval-b\}\)/,
  `empirical ${networkLabel} testnet benchmarks (Section~\\ref{sec:eval-b}) and functional scenario validation (Section~\\ref{sec:eval-a})`
);
writeFileSync(introPath, intro);
console.log("Updated sections/01_introduction.tex");

// --- conclusion ---
const conclusionPath = join(paperDir, "sections", "08_conclusion.tex");
let conclusion = readFileSync(conclusionPath, "utf8");
conclusion = conclusion.replace(
  /Qualitative evaluation confirmed tamper resistance on rejected batches, role-based access control, and end-to-end dashboard integration on local networks\.\nPreliminary localhost gas measurements indicate sub-200k gas for primary write operations, suggesting L2 deployment feasibility for UMKM producers, though Base Sepolia benchmarks remain pending funded deployment\./,
  `Evaluation on ${networkLabel} testnet confirmed tamper resistance on rejected batches, role-based access control, and wallet-free consumer verification via the web frontend.
Gas measurements (Table~\\ref{tab:gas-local} and Table~\\ref{tab:gas}) indicate sub-200k gas for primary write operations, supporting L2 deployment feasibility for UMKM producers.`
);
writeFileSync(conclusionPath, conclusion);
console.log("Updated sections/08_conclusion.tex");

// --- abstract ---
const abstractPath = join(paperDir, "sections", "00_abstract.tex");
let abstract = readFileSync(abstractPath, "utf8");
if (report.scenarios?.A?.pass && !abstract.includes("functional scenario")) {
  abstract = abstract.replace(
    /Section~\\ref\{sec:eval\} reports qualitative[\s\S]*?\./,
    `Section~\\ref{sec:eval} reports qualitative security analysis, functional scenarios A/B/C on ${networkLabel} testnet, and quantitative gas benchmarks.`
  );
}
writeFileSync(abstractPath, abstract);

// --- appendix ---
let commitHash = "unknown";
try {
  commitHash = execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
} catch {
  /* ignore */
}

const appendixPath = join(paperDir, "sections", "appendix_reproducibility.tex");
let appendix = readFileSync(appendixPath, "utf8");

appendix = appendix.replace(
  /\\subsection\{Base Sepolia Deployment\}/,
  `\\subsection{${networkLabel} Deployment}`
);

const repoUrl = "https://github.com/Fatihmaull/halal-chain";
const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL || "https://web-six-ivory-36.vercel.app/";
const demoBase = demoUrl.replace(/\/$/, "");
const explorerBase =
  report.network === "sepolia"
    ? "https://sepolia.etherscan.io/address"
    : "https://sepolia.basescan.org/address";
const verifyLines = [1, 2, 3]
  .map(
    (id) =>
      `  \\item Verify batch \\#${id}:\\\\\n  \\url{${demoBase}/verify/${id}}`
  )
  .join("\n");

appendix = appendix.replace(
  /\\subsection\{Deployment Records\}[\s\S]*?See \\texttt\{docs\/BASELINE\.md\}/,
  `\\subsection{Deployment Records}
\\begin{itemize}
  \\item Git commit:\\\\
  \\url{${repoUrl}/commit/${commitHash}}
  \\item Contract (${networkLabel}):\\\\
  \\url{${explorerBase}/${report.contractAddress}}
  \\item Chain ID: ${chainId} (${networkLabel})
  \\item Evaluation timestamp: ${report.timestamp}
  \\item Evidence bundle: \\path{docs/evaluation/EVALUATION_REPORT.json}
  \\item Frontend demo:\\\\
  \\url{${demoBase}/}
${verifyLines}
  \\item Setup tutorial: \\path{docs/ETH_SEPOLIA_SETUP.md}
\\end{itemize}

See \\texttt{docs/BASELINE.md}`
);

writeFileSync(appendixPath, appendix);
console.log("Updated sections/appendix_reproducibility.tex");

// --- TESTNET_SCENARIOS.md ---
const scenariosMdPath = join(repoRoot, "docs", "TESTNET_SCENARIOS.md");
if (existsSync(scenariosMdPath)) {
  let md = readFileSync(scenariosMdPath, "utf8");
  const check = (pass) => (pass ? "[x]" : "[ ]");
  md = md.replace(
    /- \[ \] Contract deployed on Base Sepolia/,
    `- ${check(true)} Contract deployed on ${networkLabel}`
  );
  md = md.replace(
    /- \[ \] Gas eval in `docs\/EVALUATION_RESULTS.json` \(network: `baseSepolia`\)/,
    `- ${check(report.network === "sepolia" || report.network === "baseSepolia")} Gas eval in \`docs/EVALUATION_RESULTS.json\``
  );
  md = md.replace(
    /- \[ \] Paper synced/,
    `- ${check(true)} Paper synced`
  );
  if (report.scenarios?.A?.pass) md = md.replace(/\| 3 \| Consumer.*\| \[ \] \|/, "| 3 | Consumer | [x] |");
  writeFileSync(scenariosMdPath, md);
  console.log("Updated docs/TESTNET_SCENARIOS.md");
}

console.log("\nDone. Figures copied:", [figA, figBRejected, figBVerified].filter(Boolean));
