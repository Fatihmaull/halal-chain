.PHONY: pdf pdf-indo clean watch

MAIN = main
MAIN_INDO = main-indo

pdf:
	latexmk -pdf -interaction=nonstopmode $(MAIN).tex

pdf-indo:
	latexmk -pdf -interaction=nonstopmode $(MAIN_INDO).tex

clean:
	latexmk -C
	rm -f $(MAIN).bbl $(MAIN).blg $(MAIN_INDO).bbl $(MAIN_INDO).blg

watch:
	latexmk -pdf -pvc -interaction=nonstopmode $(MAIN).tex

# Fallback if latexmk not installed
manual:
	pdflatex $(MAIN).tex
	bibtex $(MAIN)
	pdflatex $(MAIN).tex
	pdflatex $(MAIN).tex

manual-indo:
	pdflatex $(MAIN_INDO).tex
	bibtex $(MAIN_INDO)
	pdflatex $(MAIN_INDO).tex
	pdflatex $(MAIN_INDO).tex
