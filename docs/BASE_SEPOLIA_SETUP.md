# Base Sepolia Setup Tutorial

Step-by-step guide to deploy HalalChain on Base Sepolia and collect paper evaluation data.

## Prerequisites

- Node.js 20+
- MetaMask browser extension
- Git clone of [halal-chain](https://github.com/Fatihmaull/halal-chain)

## Step 1 — Create three MetaMask accounts

| Role | Purpose |
|------|---------|
| **Deployer** | Pays gas for contract deploy and `grantRole` |
| **Producer** | Calls `registerBatch` / `registerRevision` |
| **Auditor** | Calls `verifyBatch` / `rejectBatch` |

1. Open MetaMask → create or switch to **Account 1** (deployer).
2. Create **Account 2** (producer) and **Account 3** (auditor) via the account menu.
3. Copy each address (click account name → copy).

Producer and auditor accounts do **not** need test ETH for role grants (deployer pays). They **do** need ETH if you run the web UI scenarios with separate wallets.

## Step 2 — Fund the deployer

1. Copy the deployer address from MetaMask.
2. Visit [Alchemy Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia).
3. Request test ETH (repeat if needed; ~0.02–0.05 ETH is enough for deploy + gas eval).

## Step 3 — Configure `contracts/.env`

```powershell
cd contracts
copy .env.example .env
# Or auto-generate new wallets (you must fund the deployer address printed):
# npm run init:sepolia-env
```

**Tip:** Alchemy faucet may require your wallet to have mainnet activity. If a fresh auto-generated wallet is ineligible, use your existing MetaMask deployer private key in `.env` instead.

Edit `contracts/.env` (never commit this file):

```env
DEPLOYER_PRIVATE_KEY=0x<deployer_private_key>
PRODUCER_ADDRESS=0x<producer_address>
AUDITOR_ADDRESS=0x<auditor_address>
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

Export private key in MetaMask: Account → ⋮ → Account details → Show private key.

Optional for role-separated automated gas eval:

```env
PRODUCER_PRIVATE_KEY=0x...
AUDITOR_PRIVATE_KEY=0x...
```

## Step 4 — Install and test locally

```powershell
cd contracts
npm install
npm test
```

All 7 tests should pass.

## Step 5 — Deploy to Base Sepolia

```powershell
npm run deploy:base-sepolia
```

Save the printed contract address, e.g. `HalalChain deployed to: 0x...`

Verify on [Basescan Sepolia](https://sepolia.basescan.org/).

## Step 6 — Run gas evaluation

```powershell
npm run evaluate:gas:sepolia
```

Results are written to `docs/EVALUATION_RESULTS.json`. Cross-check each `txHash` on Basescan.

Sync results into the paper:

```powershell
cd ..\paper
npm run sync:eval
```

## Step 7 — Configure web frontend for testnet scenarios

```powershell
cd web
copy .env.example .env.local
```

Set in `web/.env.local`:

```env
NEXT_PUBLIC_HALALCHAIN_ADDRESS=0x<deployed_contract>
NEXT_PUBLIC_DEMO_URL=http://localhost:3000
```

Add **Base Sepolia** to MetaMask if needed:

| Field | Value |
|-------|-------|
| Network name | Base Sepolia |
| RPC URL | `https://sepolia.base.org` |
| Chain ID | `84532` |
| Currency | ETH |

```powershell
npm install
npm run dev
```

Run scenarios A/B/C from [EVALUATION.md](./EVALUATION.md) on `/producer`, `/auditor`, `/verify/{id}`.

## Step 8 — Deploy frontend to Vercel (optional)

1. Import the `web/` folder in [Vercel](https://vercel.com).
2. Set environment variables:
   - `NEXT_PUBLIC_HALALCHAIN_ADDRESS`
   - `NEXT_PUBLIC_DEMO_URL` (your Vercel production URL)
   - `PINATA_JWT` (server-side, optional)
3. Deploy and save the production URL for the paper appendix.

## One-command pipeline (after `.env` is set)

From repo root:

```powershell
cd contracts
npm run deploy:base-sepolia
npm run evaluate:gas:sepolia
cd ..\paper
npm run sync:eval
make pdf
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `No deployer account` | Create `contracts/.env` with `DEPLOYER_PRIVATE_KEY` |
| `insufficient funds` | Fund deployer via faucet |
| `nonce too low` | Wait for pending txs or reset MetaMask account in settings |
| Producer/auditor tx fails | Import their private keys into MetaMask and fund with faucet ETH |
