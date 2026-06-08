# HalalChain Evaluation Subagent

Run autonomous testnet evaluation, collect paper evidence, and refine the IEEE paper.

## When to use

- User asks to run evaluation scenarios A/B/C
- User wants paper evidence (screenshots, logs, gas data)
- User says "run evaluation subagent" or "autonomous testing"

## Architecture (hybrid)

1. **On-chain**: `contracts/scripts/run-scenarios-eth-sepolia.ts` executes txs (no MetaMask UI)
2. **Browser MCP**: screenshot wallet-free `/verify/{id}` pages
3. **Paper sync**: `paper/scripts/sync-paper-from-evidence.mjs` updates LaTeX

## Prerequisites

- `contracts/.env` with `DEPLOYER_PRIVATE_KEY`, optional `PRODUCER_PRIVATE_KEY` / `AUDITOR_PRIVATE_KEY`
- `HALALCHAIN_ADDRESS=0xDaCA688e86F438A7cD6B0C9B69606C67CE85Dc92`
- `web/.env.local` with `NEXT_PUBLIC_HALALCHAIN_ADDRESS` (same contract)
- Ethereum Sepolia ETH on deployer
- `cd web && npm run dev` running on http://localhost:3000

## Runbook

### Step 1 — Unit tests

```bash
cd contracts
npm test 2>&1 | tee ../docs/evaluation/logs/npm-test.log
```

Update `EVALUATION_REPORT.json` unitTests.passed from output (expect 8 tests after Scenario C test).

### Step 2 — On-chain scenarios

```bash
cd contracts
npm run scenarios:eth-sepolia
```

Writes `docs/evaluation/EVALUATION_REPORT.json` and `docs/evaluation/logs/scenarios-eth-sepolia.log`.

### Step 3 — Browser evidence (cursor-ide-browser MCP)

Read batch IDs from `EVALUATION_REPORT.json`:

| Screenshot file | URL |
|-----------------|-----|
| `scenario-a-verified.png` | `/verify/{scenarioA.batchId}` |
| `scenario-b-rejected.png` | `/verify/{scenarioB.batchIds[0]}` |
| `scenario-b-revision-verified.png` | `/verify/{scenarioB.batchIds[1]}` |
| `landing-consumer.png` | `/` |

For each URL:

1. `browser_navigate` → `http://localhost:3000/verify/{id}`
2. Wait for `[data-testid=verify-status]` text (poll up to 60s after on-chain txs)
3. `browser_take_screenshot` → save to `docs/evaluation/screenshots/{name}.png`
4. Assert:
   - Verified: contains `Tersertifikasi Halal` or `Halal Certified`
   - Rejected: contains `Tidak Tersertifikasi` + `[data-testid=verify-reject-reason]`
   - Revision: `[data-testid=verify-parent-link]` present

### Step 4 — Page load timing (optional)

Measure TTFB for verify URL via `browser_network_requests` or:

```bash
curl -o /dev/null -s -w "%{time_starttransfer}" http://localhost:3000/verify/{id}
```

Store ms in `EVALUATION_REPORT.json` → `metrics.verifyPageTTFBms`.

### Step 5 — Sync paper

```bash
cd paper
npm run sync:evidence
```

### Step 6 — Build PDF

```bash
cd paper && make pdf
```

Or upload `paper/` to Overleaf.

## One-command pipeline

```powershell
powershell -File scripts/run-evaluation-agent.ps1
```

Then run browser screenshot steps (Step 3) if not automated.

## Limitations

- Cannot automate MetaMask popups — producer/auditor txs are script-driven
- Default UI locale is Indonesian
- Scenario C step 2 (revert) is proven on-chain, not via auditor UI

## Output checklist

- [ ] `docs/evaluation/EVALUATION_REPORT.json` all scenarios pass
- [ ] Screenshots in `docs/evaluation/screenshots/`
- [ ] `docs/evaluation/logs/npm-test.log`
- [ ] Paper sections 06, 01, 08, appendix updated
- [ ] Figures in `paper/figures/eval/`
