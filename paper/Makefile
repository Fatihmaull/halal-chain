.PHONY: pdf clean watch

MAIN = main

pdf:
	latexmk -pdf -interaction=nonstopmode $(MAIN).tex

clean:
	latexmk -C
	rm -f $(MAIN).bbl $(MAIN).blg

watch:
	latexmk -pdf -pvc -interaction=nonstopmode $(MAIN).tex

# Fallback if latexmk not installed
manual:
	pdflatex $(MAIN).tex
	bibtex $(MAIN)
	pdflatex $(MAIN).tex
	pdflatex $(MAIN).tex
