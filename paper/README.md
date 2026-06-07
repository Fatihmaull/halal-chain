# HalalChain Paper — IEEEtran Journal Build

## Prerequisites

Install a LaTeX distribution with **IEEEtran** class:

- **Windows:** [MiKTeX](https://miktex.org/) or TeX Live
- **macOS:** MacTeX (`brew install --cask mactex`)
- **Overleaf:** Upload `paper/` folder; select **IEEE Journal Template**

Do **not** commit `IEEEtran.cls` — it ships with TeX Live / Overleaf.

## Build

```bash
cd paper
make pdf      # builds main.pdf
make clean    # remove aux files
make watch    # latexmk continuous preview (if installed)
```

Manual build:

```bash
pdflatex main
bibtex main
pdflatex main
pdflatex main
```

## Directory Structure

```
paper/
├── main.tex                 # Root document
├── sections/                # One file per section
├── figures/                 # TikZ and PDF figures
├── tables/                  # LaTeX table fragments
├── references.bib           # BibTeX database (31 entries)
├── references_tracker.csv   # DOI verification audit trail
└── VENUE_CHECKLIST.md       # Pick ONE submission target
```

## Writing Workflow (Phases 1–6)

### Phase 1 — References (Week 1)
- [ ] Verify all DOIs in `references_tracker.csv` (column `verified`)
- [ ] Target: 25+ refs, 60%+ peer-reviewed journals
- [ ] Add new refs to both `.bib` and `.csv`

### Phase 2 — IEEE Compliance (Week 1–2)
- [ ] Abstract: 150–250 words, no citations
- [ ] Index Terms: 5–8 keywords
- [ ] All figures/tables referenced in text
- [ ] Acronyms defined at first use

### Phase 3 — Drafting Order
1. Implementation (Section V) — from code
2. System Design (Section IV)
3. Preliminaries (Section III)
4. Related Work (Section II)
5. Evaluation VI-A (qualitative) then VI-B (after testnet)
6. Introduction — **write last**
7. Discussion + Conclusion

### Phase 4 — Evaluation
- **VI-A (now):** Scenarios A/B/C on Hardhat — qualitative only
- **VI-B (blocked):** Run `npm run evaluate:gas` on Base Sepolia
- **Never fabricate** HalalChain gas numbers
- L2 costs from **other papers** only in Related Work

### Phase 5 — Internal Review
- [ ] Plagiarism scan (Turnitin / iThenticate)
- [ ] Reference count ≥ 20 peer-reviewed
- [ ] Co-author review
- [ ] Grammar and consistency check
- [ ] AI-assisted writing disclosure (if journal requires)

### Phase 6 — Submission Pack
- [ ] ORCID for all authors
- [ ] CRediT author contributions (in main.tex)
- [ ] Conflict of interest statement
- [ ] Data availability statement (GitHub link)
- [ ] Cover letter with novelty bullets
- [ ] Pick ONE venue from `VENUE_CHECKLIST.md`
- [ ] `latexmk -pdf` with no overfull hbox warnings

## Submission Checklist (IEEE Access)

- [ ] Manuscript PDF from `main.pdf`
- [ ] Cover letter
- [ ] Supplementary material (optional): GitHub repo link
- [ ] APC budget confirmed (IEEE Access is open access)
- [ ] Ethics statement (only if human subjects / KKN interviews)

## Reproducibility

After Base Sepolia deploy, update Appendix:
- Contract address
- Git commit hash
- Evaluation results in `docs/EVALUATION_RESULTS.md`
