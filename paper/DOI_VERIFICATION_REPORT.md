# DOI Verification Report

**Date:** 2025-06-07  
**Script:** `node scripts/verify-dois.mjs`

## Summary

| Metric | Count |
|--------|-------|
| Total bibliography entries | 28 |
| Entries with DOI | 20 |
| DOI HTTP resolution | **20/20 passed** |
| Entries without DOI (arXiv, USENIX, web docs) | 8 |

All DOI-bearing entries in `references.bib` resolve correctly via CrossRef/doi.org and match expected titles/topics.

## Halal-specific references (5 entries)

| Key | DOI | Status |
|-----|-----|--------|
| `sidarto2021halal` | 10.3389/fbloc.2021.612898 | Verified |
| `alourani2025halal` | 10.63332/joph.v5i2.437 | Verified |
| `marianingsih2024halal` | 10.53515/lt.v7i2.165 | Verified |
| `rejeb2018halal` | 10.14513/actatechjaur.v11.n4.467 | Verified |
| `rashid2018halal` | 10.18488/journal.1.2018.88.569.579 | Verified |

## Fixes applied (from prior audit)

Removed fabricated or wrong-DOI entries (`bendhaou2021blockchain`, `tieman2019halal`, `soon2017halal`, `nawir2021blockchain`, etc.) and replaced with CrossRef-verified halal and supply-chain papers. Corrected DOIs for `caro2018blockchain` and `underwood2016blockchain`.

## Non-DOI entries (expected)

- `benet2014ipfs` — arXiv:1407.3561
- `kalodner2018arbitrum` — USENIX Security 2018
- `optimism2024spec`, `base2024docs`, `openzeppelin2024access`, `gnosis2024safe` — web documentation
- `dinarstandard2023state`, `bpjph2022regulation` — industry/regulatory sources

Re-run verification after any bibliography change:

```bash
cd paper && node scripts/verify-dois.mjs
```
