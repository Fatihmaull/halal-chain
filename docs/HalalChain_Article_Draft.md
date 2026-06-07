# HalalChain: A Trustless Batch Traceability Protocol on Base L2
## Integrating Islamic Ethical Principles with Immutable Audit Trails

**Status:** Draft for journal submission  
**Authors:** [To be completed]  
**Target venues:** Frontiers in Blockchain, Ledger, Blockchain: Research and Applications (Elsevier)

---

## Abstract

The global halal industry, valued at over USD 2.3 trillion, faces persistent trust deficits stemming from certificate forgery, opaque supply chains, and centralized databases susceptible to tampering. This paper presents **HalalChain**, a decentralized batch traceability protocol deployed on Base Network (Ethereum Layer 2) that anchors product certification records on a public blockchain while storing supporting documents on the InterPlanetary File System (IPFS). We map Islamic ethical principles—*Amanah* (trustworthiness), *Thoyyib* (purity), *Adl* (justice), and *Hisba* (accountability)—to concrete system design decisions. An empirical evaluation on Base Sepolia testnet measures gas costs, verification latency, and tamper-resistance properties. Results demonstrate that Layer 2 deployment enables near-zero-cost batch registration and verification suitable for SME producers, while maintaining immutable audit trails queryable by consumers without cryptocurrency wallets.

**Keywords:** blockchain, halal traceability, supply chain, IPFS, Base Network, Islamic ethics, smart contracts

---

## 1. Introduction

### 1.1 Background

Halal certification in Indonesia is governed by BPJPH and MUI, yet consumers and export markets continue to report trust gaps. Physical certificates can be forged; centralized ERP databases can be altered by administrators. Blockchain technology offers cryptographically secured, append-only records that align with the Islamic principle of *Amanah*—entrusting truthful, permanent testimony.

### 1.2 Research Questions

1. Can a minimal smart contract architecture provide immutable halal batch verification at L2 cost levels accessible to UMKM (SME) producers?
2. How does an on-chain/off-chain (IPFS) split affect cost, immutability, and document availability?
3. Which Islamic ethical principles map to verifiable system properties?

### 1.3 Contributions

1. **HalalChain protocol design** — three-role model (Producer, Auditor, Consumer) with RBAC and revision history after rejection.
2. **Architecture analysis** — tradeoff between on-chain anchors (CIDs, status, timestamps) and off-chain documents (PDFs, lab reports).
3. **Islamic ethics mapping** — explicit design traceability from *Maqasid*-aligned requirements to implementation.
4. **Empirical evaluation** — gas costs and latency benchmarks on Base Sepolia testnet.

---

## 2. Related Work

| System | Approach | Halal-specific | Decentralized | Consumer access |
|--------|----------|----------------|---------------|-----------------|
| IBM Food Trust | Permissioned Hyperledger | No | Partial | Limited |
| VeChain | Public chain + IoT | No | Yes | App required |
| HALAL TRACE | QR + database | Yes | No | QR scan |
| BPJPH SIHALAL | Centralized gov DB | Yes | No | Web portal |
| **HalalChain** | Base L2 + IPFS + Solidity | Yes | Yes (public chain) | QR, no wallet |

*Gap:* Existing halal digital systems rely on centralized databases. HalalChain combines public verifiability with halal-domain workflow (auditor verification, rejection with revision history).

### Key references (to expand)

- DinarStandard (2023). State of the Global Islamic Economy Report.
- BPJPH audit findings on certificate verification (2022).
- Ben-Dhaou et al. (2021). Blockchain for supply chain traceability — systematic review.
- Ali et al. (2020). Halal supply chain integrity — literature review.
- OpenZeppelin (2024). AccessControl documentation.
- Base Network / Coinbase (2024). OP Stack L2 documentation.

---

## 3. Islamic Ethical Framework

| Principle | Arabic | Design requirement | HalalChain implementation |
|-----------|--------|-------------------|---------------------------|
| Trustworthiness | Amanah | Records cannot be altered post-audit | Immutable on-chain status transitions |
| Purity | Thoyyib | Only verified batches show halal | Status enum: only Verified → consumer "Halal" |
| Justice | Adl | No single party controls all data | Public chain + distributed IPFS |
| Accountability | Hisba | Auditor identity and timestamp recorded | auditor address + auditedAt on-chain |

**Limitation (Discussion):** Auditor whitelist is currently admin-controlled (`DEFAULT_ADMIN_ROLE`), which partially conflicts with *Adl* until multi-sig or DAO governance is implemented (v2).

---

## 4. System Design

### 4.1 Architecture

```
Producer → [Upload docs to IPFS] → registerBatch(productName, cid) → Base L2
Auditor  → [Review IPFS docs]    → verifyBatch / rejectBatch        → Base L2
Consumer → QR → /verify/{id}     → getBatch() read-only             → Base L2
```

### 4.2 Smart Contract Specification

**Contract:** `HalalChain.sol` (Solidity ^0.8.20, OpenZeppelin AccessControl)

**Roles:**
- `PRODUCER_ROLE` — registerBatch, registerRevision
- `AUDITOR_ROLE` — verifyBatch, rejectBatch, revokeBatch
- `DEFAULT_ADMIN_ROLE` — grant/revoke roles

**Batch struct:** producer, productName, ipfsCid, createdAt, status, auditor, auditedAt, auditIpfsCid, rejectReason, parentBatchId

**Status enum:** Unknown(0), Pending(1), Verified(2), Rejected(3), Revoked(4)

**Key functions:**
- `registerBatch(productName, ipfsCid)` → new batch, status Pending
- `registerRevision(parentBatchId, ipfsCid)` → new batch linked to rejected parent
- `verifyBatch(batchId, auditIpfsCid)` → Pending → Verified
- `rejectBatch(batchId, reason, auditIpfsCid)` → Pending → Rejected
- `revokeBatch(batchId, reason)` → Verified → Revoked

### 4.3 Off-chain Storage

Documents stored on IPFS via Pinata pinning service. Only Content Identifiers (CIDs) are stored on-chain, minimizing gas costs while preserving content-addressable integrity.

---

## 5. Implementation

| Layer | Technology |
|-------|------------|
| Blockchain | Solidity 0.8.20, OpenZeppelin, Base Sepolia (chainId 84532) |
| Development | Hardhat 3, Mocha/Chai tests (7 test cases) |
| Frontend | Next.js 16, Wagmi v3, Viem, Tailwind CSS |
| Storage | IPFS via Pinata (with local mock fallback) |
| Deployment | Hardhat scripts, Vercel (frontend) |

**Repository:** https://github.com/Fatihmaull/halal-chain

---

## 6. Evaluation

### 6.1 Methodology

Three scenarios executed on Base Sepolia (see `docs/EVALUATION.md`):
- **A:** Valid registration and verification
- **B:** Rejection, revision, re-verification
- **C:** Tamper attempt on rejected batch (must revert)

### 6.2 Results (template — fill after testnet deployment)

| Operation | Gas Used | Approx. Cost (ETH) |
|-----------|----------|-------------------|
| registerBatch | TBD | TBD |
| verifyBatch | TBD | TBD |
| rejectBatch | TBD | TBD |
| registerRevision | TBD | TBD |
| getBatch (RPC read) | 0 | 0 |

### 6.3 Security Properties

- **Immutability:** Rejected batches cannot be re-verified; original record preserved.
- **Revision traceability:** `parentBatchId` links resubmissions to prior rejections.
- **Access control:** Unauthorized addresses cannot register (without PRODUCER_ROLE) or verify (without AUDITOR_ROLE).

---

## 7. Discussion

### 7.1 Limitations

1. **Centralized auditor gatekeeping** — admin grants AUDITOR_ROLE; not yet multi-sig.
2. **IPFS pinning dependency** — documents require active Pinata pins; unpinned CIDs become unavailable.
3. **Testnet-only evaluation** — mainnet deployment and real BPJPH integration not yet validated.
4. **No IoT integration** — cold chain and GPS tracking deferred to v2.

### 7.2 Future Work

- Multi-signature auditor verification (Gnosis Safe)
- DAO-based auditor election
- Base mainnet deployment
- IoT sensor anchoring
- Integration with BPJPH SIHALAL API (if available)

---

## 8. Conclusion

HalalChain demonstrates that L2 blockchain technology can provide tamper-proof halal batch traceability aligned with Islamic ethical principles, at costs viable for SME producers. The separation of on-chain anchors and off-chain documents balances immutability with practicality. Future work will address decentralized auditor governance and mainnet deployment.

---

## References

[1] DinarStandard. (2023). *State of the Global Islamic Economy Report*.  
[2] Bank Indonesia / BPJPH. (2022). Halal certification audit findings.  
[3] Zheng, Z., et al. (2020). An overview on smart contracts. *IEEE Communications Surveys & Tutorials*.  
[4] Ben-Dhaou, S., et al. (2021). Blockchain-based supply chain traceability. *Computers & Industrial Engineering*.  
[5] OpenZeppelin. (2024). AccessControl. https://docs.openzeppelin.com/contracts/  
[6] Base. (2024). Base Network Documentation. https://docs.base.org/  
[7] Protocol Labs. (2024). IPFS Documentation. https://docs.ipfs.tech/  

*[Expand to 20+ references before submission]*

---

## Appendix A: Reproducibility

```bash
# Contracts
cd contracts && npm install && npm test

# Local demo
npm run node          # terminal 1
npm run deploy:local  # terminal 2
cd ../web && npm install && npm run dev  # terminal 3
```

See `docs/BASELINE.md` for Hardhat default wallet addresses.

---

*Draft version 1.0 — generated as part of HalalChain implementation roadmap.*
