# Testnet Scenario Checklist (A/B/C)

Execute on Base Sepolia after [BASE_SEPOLIA_SETUP.md](./BASE_SEPOLIA_SETUP.md) Steps 1–7.

Mark each item when verified on testnet (not localhost).

## Setup

- [x] Contract deployed on Ethereum Sepolia (`npm run deploy:base-sepolia`)
- [ ] `NEXT_PUBLIC_HALALCHAIN_ADDRESS` set in `web/.env.local`
- [ ] MetaMask on Base Sepolia (chain ID 84532)
- [ ] Producer account imported and funded
- [ ] Auditor account imported and funded

## Scenario A — Happy path

| Step | Actor | Action | Pass? |
|------|-------|--------|-------|
| 1 | Producer | Register batch with IPFS docs on `/producer` | [ ] |
| 2 | Auditor | `verifyBatch` on `/auditor` | [ ] |
| 3 | Consumer | [x] |

Record: registration → verification block time: _____ s

## Scenario B — Rejection and revision

| Step | Actor | Action | Pass? |
|------|-------|--------|-------|
| 1 | Producer | Register batch #1 | [ ] |
| 2 | Auditor | Reject batch #1 with reason | [ ] |
| 3 | Consumer | `/verify/1` shows Rejected + reason | [ ] |
| 4 | Producer | `registerRevision` → batch #2 | [ ] |
| 5 | Auditor | Verify batch #2 | [ ] |
| 6 | Consumer | `/verify/2` Verified + parent link | [ ] |

## Scenario C — Tamper resistance

| Step | Action | Pass? |
|------|--------|-------|
| 1 | Batch #1 is Rejected on-chain | [ ] |
| 2 | `verifyBatch(1)` reverts (InvalidStatus) | [ ] |
| 3 | `getBatch(1)` still Rejected with same reason | [ ] |

## Exit criteria (paper demo)

- [ ] All three scenarios pass on testnet
- [x] Gas eval in `docs/EVALUATION_RESULTS.json`
- [x] Paper synced (`cd paper && npm run sync:eval`)
- [ ] Optional: Vercel demo URL for appendix
- [ ] Optional: 5-minute screen recording
