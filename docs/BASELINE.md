# HalalChain Phase 0 — Local Baseline

Validated: all 7 contract tests pass (`npm test` in `contracts/`).

## Hardhat default accounts (local node)

When running `npm run node`, Hardhat exposes 20 funded accounts. Use these for local demo:

| Role | Account index | Address (Hardhat default) |
|------|---------------|---------------------------|
| Admin (DEFAULT_ADMIN_ROLE) | #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| Producer (PRODUCER_ROLE) | #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` |
| Auditor (AUDITOR_ROLE) | #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` |

Private key for account #0 (local only — never use on mainnet):
`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## Local run checklist

```bash
# Terminal 1
cd contracts && npm run node

# Terminal 2
cd contracts && npm run deploy:local
# Copy printed HalalChain address

# Terminal 3
cd web
# Set NEXT_PUBLIC_HALALCHAIN_ADDRESS in .env.local
npm install && npm run dev
```

## End-to-end flow

1. Import account #1 into MetaMask → connect on `/producer` → register batch
2. Import account #2 → connect on `/auditor` → verify or reject
3. Open `/verify/1` (no wallet) → read status

## MetaMask local network

- Network name: Hardhat Local
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency: ETH

## Exit criteria (met)

- [x] Green test suite (7/7)
- [x] Role-based access (PRODUCER_ROLE, AUDITOR_ROLE)
- [x] Revision flow after rejection
- [x] Documented wallet addresses
