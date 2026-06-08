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
├── main.tex          # Root document
├── sections/         # One file per section
├── figures/          # TikZ and PDF figures
├── tables/           # LaTeX table fragments
└── references.bib    # BibTeX database
```
