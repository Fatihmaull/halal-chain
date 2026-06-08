# HalalChain Ethereum Sepolia evaluation + paper sync pipeline
# Prerequisites: contracts/.env with DEPLOYER_PRIVATE_KEY (see docs/ETH_SEPOLIA_SETUP.md)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path "$root\contracts\.env")) {
    Write-Host "ERROR: contracts/.env not found." -ForegroundColor Red
    Write-Host "See docs/ETH_SEPOLIA_SETUP.md"
    exit 1
}

Set-Location "$root\contracts"
Write-Host "=== Preflight (Ethereum Sepolia) ===" -ForegroundColor Cyan
npm run preflight:eth-sepolia
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "=== Deploy ===" -ForegroundColor Cyan
npm run deploy:eth-sepolia
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "=== Gas evaluation ===" -ForegroundColor Cyan
npm run evaluate:gas:eth-sepolia
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Set-Location "$root\paper"
Write-Host "=== Sync paper ===" -ForegroundColor Cyan
npm run sync:eval
npm run prepare:submission

Write-Host "=== Build PDF ===" -ForegroundColor Cyan
if (Get-Command latexmk -ErrorAction SilentlyContinue) {
    make pdf
} else {
    Write-Host "latexmk not found. Use Overleaf or: cd paper; make pdf"
}

Write-Host "Done. Verify txs on https://sepolia.etherscan.io/" -ForegroundColor Green
