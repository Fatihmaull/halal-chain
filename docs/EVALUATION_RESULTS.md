# HalalChain Evaluation Results

**Policy:** No fabricated numbers. HalalChain-specific metrics require actual transaction receipts.

## Status

| Network | Status | Notes |
|---------|--------|-------|
| Hardhat localhost | Script ready | `npm run evaluate:gas` — dev validation only |
| Base Sepolia | **Complete** | 2026-06-08 — see EVALUATION_RESULTS.json | Requires `DEPLOYER_PRIVATE_KEY` + faucet ETH |

## How to Run

```bash
# Local dev (qualitative validation — NOT for paper Table VI-B)
cd contracts
npm run evaluate:gas

# Base Sepolia (after deploy:base-sepolia)
npm run evaluate:gas:sepolia
```

Results are written to `EVALUATION_RESULTS.json` in this directory.

## Paper Usage

- **Section VI-A:** Reference functional scenarios A/B/C (qualitative)
- **Section VI-B Table:** Fill only from Base Sepolia `EVALUATION_RESULTS.json`
- **Related Work:** Cite L2 gas benchmarks from other papers for cost motivation

## Results

_Results will appear in `EVALUATION_RESULTS.json` after running the evaluation script._

<!-- Example structure:
```json
{
  "network": "baseSepolia",
  "operations": {
    "registerBatch": { "gasUsed": "..." }
  }
}
```
-->

## Blockers for Base Sepolia

Follow the full tutorial: [BASE_SEPOLIA_SETUP.md](./BASE_SEPOLIA_SETUP.md)

1. Set `DEPLOYER_PRIVATE_KEY` in `contracts/.env` (or `npm run init:sepolia-env`)
2. Fund wallet via [Alchemy Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
3. Run `npm run deploy:base-sepolia`
4. Run `npm run evaluate:gas:sepolia`
