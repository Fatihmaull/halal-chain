# Ethereum Sepolia Setup Tutorial

Deploy HalalChain on **Ethereum Sepolia** testnet (chain ID `11155111`) when you already have Sepolia ETH.

> The paper's production target remains **Base L2**; Ethereum Sepolia is used for publicly verifiable testnet evaluation when Base Sepolia faucets are unavailable.

## Step 1 — Configure `contracts/.env`

```powershell
cd contracts
copy .env.example .env
```

```env
DEPLOYER_PRIVATE_KEY=0x<your_private_key>
PRODUCER_ADDRESS=0x<producer_address>
AUDITOR_ADDRESS=0x<auditor_address>
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

## Step 2 — Add Ethereum Sepolia in MetaMask

| Field | Value |
|-------|-------|
| Network name | Sepolia |
| RPC URL | `https://ethereum-sepolia-rpc.publicnode.com` |
| Chain ID | `11155111` |
| Symbol | ETH |

## Step 3 — Preflight check

```powershell
npm install
npm run preflight:eth-sepolia
```

## Step 4 — Deploy and evaluate

From repo root:

```powershell
powershell -File scripts/run-eth-sepolia-pipeline.ps1
```

Or manually:

```powershell
cd contracts
npm run deploy:eth-sepolia
npm run evaluate:gas:eth-sepolia
```

Verify on [sepolia.etherscan.io](https://sepolia.etherscan.io/).

## Step 5 — Web frontend

```powershell
cd web
copy .env.example .env.local
```

Set `NEXT_PUBLIC_HALALCHAIN_ADDRESS=<deployed_contract>` and run `npm run dev`.

Connect MetaMask on **Ethereum Sepolia** for `/producer` and `/auditor`.
