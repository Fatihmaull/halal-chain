# HalalChain Evaluation Plan (Phase 4)

Evaluation scenarios and metrics for the academic paper and demo validation.

## Prerequisites

- Contract deployed on Base Sepolia (or local Hardhat)
- Frontend deployed to Vercel (or `npm run dev` locally)
- Optional: `PINATA_JWT` configured for real IPFS uploads

## Scenario A — Valid batch → Verified → Consumer sees Halal

| Step | Actor | Action | Expected result |
|------|-------|--------|-----------------|
| 1 | Producer | Register batch with IPFS docs | Batch status = Pending, batchId assigned |
| 2 | Auditor | verifyBatch(batchId, auditCid) | Status = Verified on-chain |
| 3 | Consumer | Open `/verify/{batchId}` | Green "Halal Certified" / "Tersertifikasi Halal" |

**Metrics to record:**
- Gas used: `registerBatch` (wei)
- Gas used: `verifyBatch` (wei)
- Time: registration tx confirmed → verify tx confirmed
- Time: consumer page load (readContract latency)

## Scenario B — Rejection → Revision → Verified

| Step | Actor | Action | Expected result |
|------|-------|--------|-----------------|
| 1 | Producer | registerBatch | batchId = 1, Pending |
| 2 | Auditor | rejectBatch(1, reason, auditCid) | batchId = 1, Rejected |
| 3 | Consumer | `/verify/1` | Red "Not Certified" + reject reason visible |
| 4 | Producer | registerRevision(1, newCid) | batchId = 2, parentBatchId = 1 |
| 5 | Auditor | verifyBatch(2, auditCid) | batchId = 2, Verified |
| 6 | Consumer | `/verify/2` | Green status; link to parent batch #1 |

**Metrics:** Same as Scenario A, plus revision flow gas for `registerRevision`.

## Scenario C — Tamper resistance

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Register + reject batch #1 | On-chain record shows Rejected |
| 2 | Attempt to call verifyBatch on rejected batch | Transaction reverts (InvalidStatus) |
| 3 | Re-read getBatch(1) | Status still Rejected; rejectReason unchanged |

**Paper claim:** Demonstrates immutability (*Amanah*) — audit outcomes cannot be retroactively altered.

## Metrics collection template

```
| Operation        | Network      | Gas Used | Gas Price (gwei) | Cost (ETH) | Block Time (s) |
|------------------|--------------|----------|------------------|------------|----------------|
| registerBatch    | Base Sepolia |          |                  |            |                |
| verifyBatch      | Base Sepolia |          |                  |            |                |
| rejectBatch      | Base Sepolia |          |                  |            |                |
| registerRevision | Base Sepolia |          |                  |            |                |
| getBatch (read)  | Base Sepolia | 0        | —                | 0          | RPC latency ms |
| IPFS upload      | Pinata       | —        | —                | —          | upload ms      |
| IPFS retrieve    | Gateway      | —        | —                | —          | fetch ms       |
```

## Vercel deployment

1. Push repo to GitHub
2. Import project in Vercel (root directory: `web`)
3. Set environment variables:
   - `NEXT_PUBLIC_HALALCHAIN_ADDRESS` — deployed contract
   - `NEXT_PUBLIC_DEMO_URL` — Vercel production URL
   - `PINATA_JWT` — server-side only
4. Deploy

## Exit criteria

- [ ] Live demo URL accessible
- [ ] All 3 scenarios pass on testnet
- [ ] Metrics spreadsheet filled
- [ ] 5-minute screen recording of full journey
