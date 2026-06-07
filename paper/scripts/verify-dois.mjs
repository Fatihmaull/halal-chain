#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bib = fs.readFileSync(path.join(__dirname, "../references.bib"), "utf8");

function parseEntries(text) {
  const entries = [];
  const chunks = text.split(/\n(?=@)/);
  for (const chunk of chunks) {
    const m = chunk.match(/^@\w+\{([^,]+),/);
    if (!m) continue;
    const key = m[1];
    const doiM = chunk.match(/doi\s*=\s*\{([^}]+)\}/);
    entries.push({ key, doi: doiM?.[1] ?? null, chunk });
  }
  return entries;
}

const entries = parseEntries(bib).filter((e) => e.doi);
console.log(`Checking ${entries.length} DOI entries...\n`);

const results = [];
for (const { key, doi } of entries) {
  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: { "User-Agent": "HalalChain-DOI-Verifier/1.0" },
    });
    if (!res.ok) {
      results.push({ key, doi, status: "FAIL", http: res.status });
      continue;
    }
    const data = await res.json();
    results.push({
      key,
      doi,
      status: "OK",
      title: data.message?.title?.[0],
      year: data.message?.published?.["date-parts"]?.[0]?.[0],
      authors: data.message?.author?.slice(0, 2).map((a) => `${a.family}`).join(", "),
    });
  } catch (e) {
    results.push({ key, doi, status: "ERROR", error: String(e) });
  }
}

for (const r of results) {
  const line =
    r.status === "OK"
      ? `OK   ${r.key} | ${r.year} | ${r.authors} | ${r.title?.slice(0, 70)}`
      : `FAIL ${r.key} | ${r.doi} | ${r.status}`;
  console.log(line);
}

const ok = results.filter((r) => r.status === "OK");
fs.writeFileSync(path.join(__dirname, "../DOI_VERIFICATION_REPORT.json"), JSON.stringify(results, null, 2));
console.log(`\n${ok.length}/${results.length} passed`);
