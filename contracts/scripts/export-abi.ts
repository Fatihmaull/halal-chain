import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactPath = path.join(__dirname, "../artifacts/contracts/HalalChain.sol/HalalChain.json");
const outPath = path.join(__dirname, "../../web/src/lib/halalChainAbi.ts");

const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const abi = artifact.abi;

const content = `// Auto-generated from contracts/artifacts — run: npm run export-abi
export const halalChainAbi = ${JSON.stringify(abi, null, 2)} as const;
`;

fs.writeFileSync(outPath, content);
console.log("Exported ABI to", outPath);
