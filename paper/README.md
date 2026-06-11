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
make pdf           # builds main.pdf (English)
make pdf-indo      # builds main-indo.pdf (Bahasa Indonesia)
make clean         # remove aux files
make watch         # latexmk continuous preview (if installed)
```

Manual build (English):

```bash
pdflatex main
bibtex main
pdflatex main
pdflatex main
```

Manual build (Indonesian):

```bash
pdflatex main-indo
bibtex main-indo
pdflatex main-indo
pdflatex main-indo
```

## Directory Structure

```
paper/
├── main.tex              # Root document (English)
├── main-indo.tex         # Root document (Bahasa Indonesia)
├── sections/             # English sections
├── sections-indo/        # Indonesian sections
├── figures/              # English figures
├── figures-indo/         # Indonesian figures
├── tables/               # English tables
├── tables-indo/          # Indonesian tables
└── references.bib        # BibTeX database (shared)
```
