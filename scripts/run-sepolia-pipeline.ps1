# HalalChain Base Sepolia evaluation + paper sync pipeline
# Prerequisites: contracts/.env with DEPLOYER_PRIVATE_KEY (see docs/BASE_SEPOLIA_SETUP.md)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path "$root\contracts\.env")) {
    Write-Host "ERROR: contracts/.env not found." -ForegroundColor Red
    Write-Host "Copy contracts/.env.example to contracts/.env and set DEPLOYER_PRIVATE_KEY."
    Write-Host "Tutorial: docs/BASE_SEPOLIA_SETUP.md"
    exit 1
}

Set-Location "$root\contracts"
Write-Host "=== Preflight ===" -ForegroundColor Cyan
npm run preflight:sepolia
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "=== Deploy ===" -ForegroundColor Cyan
npm run deploy:base-sepolia
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "=== Gas evaluation ===" -ForegroundColor Cyan
npm run evaluate:gas:sepolia
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Set-Location "$root\paper"
Write-Host "=== Sync paper ===" -ForegroundColor Cyan
npm run sync:eval
npm run prepare:submission

Write-Host "=== Build PDF ===" -ForegroundColor Cyan
if (Get-Command latexmk -ErrorAction SilentlyContinue) {
    make pdf
} else {
    Write-Host "latexmk not found. Install MiKTeX or TeX Live, then run: cd paper; make pdf"
}

Write-Host "Done. Verify txs on https://sepolia.basescan.org/" -ForegroundColor Green
