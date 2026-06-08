# HalalChain autonomous evaluation agent (hybrid pipeline)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

New-Item -ItemType Directory -Force -Path "$root\docs\evaluation\logs" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\docs\evaluation\screenshots" | Out-Null

Write-Host "=== Unit tests ===" -ForegroundColor Cyan
Set-Location "$root\contracts"
npm test 2>&1 | Tee-Object -FilePath "$root\docs\evaluation\logs\npm-test.log"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "=== On-chain scenarios (Ethereum Sepolia) ===" -ForegroundColor Cyan
npm run scenarios:eth-sepolia
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "=== Verify dev server ===" -ForegroundColor Cyan
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "Web dev server OK (status $($resp.StatusCode))"
} catch {
    Write-Host "WARNING: web dev server not running. Start: cd web; npm run dev" -ForegroundColor Yellow
    Write-Host "Browser screenshots must be captured before paper sync for figures."
}

Write-Host "=== TTFB sample (verify page) ===" -ForegroundColor Cyan
$reportPath = "$root\docs\evaluation\EVALUATION_REPORT.json"
if (Test-Path $reportPath) {
    $report = Get-Content $reportPath | ConvertFrom-Json
    $url = $report.scenarios.A.verifyUrl
    if ($url) {
        try {
            $sw = [System.Diagnostics.Stopwatch]::StartNew()
            Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 | Out-Null
            $sw.Stop()
            $ms = [int]$sw.ElapsedMilliseconds
            Write-Host "TTFB ~${ms}ms for $url"
            $report.metrics.verifyPageTTFBms = $ms
            if ($report.unitTests.passed -eq $null) {
                $testLog = Get-Content "$root\docs\evaluation\logs\npm-test.log" -Raw
                if ($testLog -match "(\d+) passing") { $report.unitTests.passed = [int]$Matches[1] }
            }
            $report | ConvertTo-Json -Depth 10 | Set-Content $reportPath
        } catch {
            Write-Host "TTFB check failed: $_" -ForegroundColor Yellow
        }
    }
}

Write-Host "=== Sync paper from evidence ===" -ForegroundColor Cyan
Set-Location "$root\paper"
npm run sync:evidence
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "=== Done ===" -ForegroundColor Green
Write-Host "Next: capture screenshots via browser MCP (see .cursor/skills/halalchain-evaluation/SKILL.md)"
Write-Host "Then re-run: cd paper; npm run sync:evidence"
