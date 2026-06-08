# IEEE Access Submission Checklist

Use before submitting. Pick **one** venue — see [VENUE_CHECKLIST.md](./VENUE_CHECKLIST.md).

## Pre-submission (technical)

- [ ] `contracts/.env` configured per [docs/BASE_SEPOLIA_SETUP.md](../docs/BASE_SEPOLIA_SETUP.md)
- [ ] `npm run deploy:base-sepolia` — contract on Basescan
- [ ] `npm run evaluate:gas:sepolia` — `docs/EVALUATION_RESULTS.json` network = `baseSepolia`
- [ ] `npm run sync:eval` — Section VI-B table filled (no TBD)
- [ ] Scenarios A/B/C on testnet — [docs/TESTNET_SCENARIOS.md](../docs/TESTNET_SCENARIOS.md)
- [ ] `make pdf` — `main.pdf` builds without errors (requires MiKTeX/TeX Live with `latexmk` on PATH; or use [Overleaf](https://www.overleaf.com) with `paper/` folder)

## Manuscript quality

- [ ] Abstract 150–250 words, no citations
- [ ] All figures/tables referenced in text
- [ ] Acronyms defined at first use
- [ ] DOIs verified — [DOI_VERIFICATION_REPORT.md](./DOI_VERIFICATION_REPORT.md)
- [ ] Plagiarism scan (Turnitin / iThenticate)
- [ ] Co-author grammar review

## Submission pack

- [ ] `main.pdf`
- [ ] [COVER_LETTER.md](./COVER_LETTER.md) (export to PDF)
- [ ] ORCID for all six authors
- [ ] CRediT statement (in `main.tex`)
- [ ] Data availability statement (GitHub link in `main.tex`)
- [ ] Conflict of interest statement
- [ ] APC budget confirmed (~USD 1,995 — check current IEEE Access rate)
- [ ] Cover letter novelty bullets customized

## After acceptance

- [x] Update appendix with final Vercel demo URL (`https://web-six-ivory-36.vercel.app/`)
- [ ] Tag GitHub release matching submission commit hash
