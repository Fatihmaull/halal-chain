# HalalChain — Presentation Outline

Use this outline to generate slides (PowerPoint, Canva, Gamma, Google Slides) from the IEEE paper in `paper/main.tex`.

**Suggested length:** 15–20 minutes + 5 minutes Q&A  
**Audience:** Academic seminar, halal-industry stakeholder briefing, or capstone defense  
**Live demo base URL:** https://web-six-ivory-36.vercel.app/

---

## Slide 1 — Title

**Title:** HalalChain: A Trustless Batch Traceability Protocol on Base L2 Integrating Islamic Ethical Design Requirements with Immutable Audit Trails

**Subtitle:** Open-source prototype with wallet-free consumer verification

**Authors:** Muhammad Fatih Maulana, Rio Ferdana Sudrajat, Muhammad Rahardian Baihaqi, Muhammad Fahriza Pratama, Yazid Zinky Arisona, Muhammad Fauzan Lubada

**Affiliation:** Universitas Islam Negeri Sunan Gunung Djati Bandung

**Visual:** HalalChain logo/wordmark + QR code pointing to `https://web-six-ivory-36.vercel.app/verify/1`

**Speaker note:** Open with a 30-second live demo — scan or open Batch #1 on your phone.

---

## Slide 2 — Hook: Why Halal Trust Is Hard

**Key points:**
- Global halal economy > USD 2 trillion; trust in certification remains fragile
- Paper/PDF certificates can be forged
- Centralized databases can be altered by privileged admins
- Consumers rarely get batch-level proof at point of purchase
- Indonesia's BPJPH/MUI regime increases urgency for UMKM-scale tools

**Visual:** Photo of halal label on product + red callouts (forgery, opacity, no batch link)

**Paper ref:** Section I (Introduction), Abstract

---

## Slide 3 — Problem Statement (3 Structural Weaknesses)

**Key points:**
1. **Copyable certificates** — forged documents look authentic
2. **Centralized tampering risk** — admins can change history in principle
3. **Enterprise blockchain gap** — IBM Food Trust / VeChain need wallet + budget UMKM lack

**Visual:** Simple 3-column diagram: Certificate | Database | Enterprise chain → each with a weakness icon

**Paper ref:** Section I-A

---

## Slide 4 — Research Questions

**Key points:**
- **RQ1:** Can minimal smart contracts deliver immutable halal verification at L2 cost for UMKM?
- **RQ2:** How does on-chain/off-chain (IPFS) split affect cost, immutability, availability?
- **RQ3:** Which Islamic ethical requirements map to testable system properties?

**Visual:** Three numbered boxes; keep text minimal

**Paper ref:** Section I-B

---

## Slide 5 — Our Answer: HalalChain in One Slide

**Key points:**
- Three roles: **Producer**, **Auditor**, **Consumer**
- On-chain: status, CIDs, auditor address, timestamps, reject reasons
- Off-chain: PDFs, lab reports, images on IPFS (Pinata)
- Consumer reads status via QR URL — **no wallet required**
- Deployed prototype: Ethereum Sepolia + Vercel frontend

**Visual:** Reuse architecture figure from `paper/figures/architecture.tex` (export as PNG/SVG)

**Paper ref:** Sections IV–V, Abstract

---

## Slide 6 — Actors and Trust Boundaries

**Key points:**
| Actor | Can do | Cannot do |
|-------|--------|-----------|
| Producer | Register batch, upload IPFS docs | Self-verify halal |
| Auditor | Verify / Reject / Revoke on-chain | Change past decisions |
| Consumer | Read public status via URL | Needs wallet |
| Admin | Grant roles | (Trust bottleneck — discuss later) |

**Visual:** Swimlane or role diagram with arrows to blockchain

**Paper ref:** Section III-B

---

## Slide 7 — Islamic Ethical Design → Engineering Requirements

**Key points:**
| Principle | Requirement | HalalChain mechanism |
|-----------|-------------|----------------------|
| Amanah | Immutable audit record | Rejected batches cannot be re-verified |
| Thoyyib | Verified-only halal display | UI shows halal only if `status = Verified` |
| Adl | Distributed data access | Public chain reads + IPFS gateways |
| Hisba | Auditor accountability | `auditor` address + `auditedAt` on-chain |

**Disclaimer (one line):** Engineering mapping — not a religious ruling (fatwa).

**Visual:** Table with green checkmarks on implementation column

**Paper ref:** Section III-C, Table `tab:ethics`

---

## Slide 8 — System Architecture

**Key points:**
- Producer → IPFS upload → `registerBatch(cid)` on L2
- Auditor → fetch IPFS → `verifyBatch` / `rejectBatch` / `revokeBatch`
- Consumer → `getBatch` via RPC → bilingual verify page
- QR on packaging encodes verify URL

**Visual:** Architecture diagram (Fig. 1 in paper)

**Paper ref:** Section IV-A

---

## Slide 9 — On-Chain vs Off-Chain Data Split

**Key points:**
**On-chain (small, immutable):** status, addresses, CIDs, reject reason, parent link  
**Off-chain (large, IPFS):** PDFs, images, lab reports, audit attachments

**Why:** Ethereum storage is expensive; CIDs anchor content without storing blobs on-chain.

**Visual:** Two-column table (from `tab:datasplit`)

**Paper ref:** Section IV-A

---

## Slide 10 — Batch Lifecycle (Finite State Machine)

**Key points:**
States: `Unknown` → `Pending` → `Verified` | `Rejected` | `Revoked`  
Critical rule: **Rejected → Verified on same ID is forbidden** (reverts)  
Revision: new `batchId` with `parentBatchId` pointing to rejected parent

**Visual:** State machine diagram with red X on Rejected→Verified edge

**Paper ref:** Section IV-B, Table `tab:fsm`

---

## Slide 11 — Smart Contract Highlights

**Key points:**
- Solidity ^0.8.20, OpenZeppelin `AccessControl`
- Roles: `PRODUCER_ROLE`, `AUDITOR_ROLE`, `DEFAULT_ADMIN_ROLE`
- Core functions: `registerBatch`, `verifyBatch`, `rejectBatch`, `registerRevision`, `revokeBatch`, `getBatch`
- 7 unit tests on Hardhat

**Visual:** Code snippet (5–8 lines) of `rejectBatch` guard or status enum

**Paper ref:** Section V-A

---

## Slide 12 — Web Implementation

**Key points:**
- Next.js 16 + Wagmi 3 + Viem
- Routes: `/producer`, `/auditor`, `/verify/[batchId]`
- IPFS upload: `POST /api/ipfs/upload` (Pinata JWT server-side)
- Bilingual UI (EN/ID), `data-testid` hooks for evaluation
- Deployed on Vercel

**Visual:** Screenshot collage — home page, producer form, auditor queue, verify page

**Paper ref:** Section V-B–D

**Demo moment:** Show https://web-six-ivory-36.vercel.app/

---

## Slide 13 — Live Demo Walkthrough (2–3 min)

**Run live or use screenshots:**

| Step | URL | Expected UI |
|------|-----|-------------|
| Verified batch | https://web-six-ivory-36.vercel.app/verify/1 | Tersertifikasi Halal |
| Rejected batch | https://web-six-ivory-36.vercel.app/verify/2 | Tidak Tersertifikasi |
| Verified revision | https://web-six-ivory-36.vercel.app/verify/3 | Tersertifikasi Halal + parent link to #2 |

**On-chain proof:** https://sepolia.etherscan.io/address/0xDaCA688e86F438A7cD6B0C9B69606C67CE85Dc92

**Speaker note:** Emphasize consumer needs no MetaMask; data comes from Sepolia RPC read.

**Paper ref:** Section VI-A, Appendix

---

## Slide 14 — Evaluation: Security Properties

**Key points:**
| Property | How validated |
|----------|---------------|
| Immutability of rejection | `verifyBatch` on Rejected reverts |
| Revision traceability | `parentBatchId` preserved |
| Role separation | Non-producer cannot register |
| Revocation integrity | Only Verified → Revoked |

**Visual:** Table from `tab:security`

**Paper ref:** Section VI-A

---

## Slide 15 — Evaluation: Functional Scenarios (Sepolia)

**Key points:**
- **Scenario A:** Batch #1 registered + verified → consumer page shows verified
- **Scenario B:** Batch #2 rejected; batch #3 revision verified with parent link
- **Scenario C:** `verifyBatch` on #2 reverts (`InvalidStatus`) — tamper resistance
- Evidence: `docs/evaluation/EVALUATION_REPORT.json`

**Visual:** Timeline of 3 scenarios with tx hash icons (optional)

**Paper ref:** Section VI-A

---

## Slide 16 — Gas and Cost Results

**Key points (Ethereum Sepolia, 2026-06-08):**
| Operation | Gas | Cost (ETH) |
|-----------|-----|------------|
| registerBatch | 155,506 | 0.00078367 |
| verifyBatch | 79,214 | 0.00034832 |
| rejectBatch | 103,533 | 0.00055169 |
| registerRevision | 181,835 | 0.00096602 |
| getBatch (read) | 0 | 0 |

**Takeaway:** Sub-200k gas writes → L2 deployment feasible for UMKM; consumer reads are free.

**Visual:** Bar chart of gas per operation

**Paper ref:** Section VI-B, Table `tab:gas`

---

## Slide 17 — Contributions (Recap)

**Key points:**
1. HalalChain protocol — 3-role RBAC + revision FSM
2. Architecture tradeoff study — on-chain anchors vs IPFS evidence
3. Ethical design mapping — Maqasid → testable properties
4. Open implementation — tests, scenarios, reproducible pipeline, live demo

**Visual:** Four icon blocks

**Paper ref:** Section I-D

---

## Slide 18 — Limitations and Trust Assumptions

**Key points:**
- Admin key compromise → role assignment risk
- Auditor diligence — system records *who* approved, not automated halal classification
- IPFS pinning must stay active (dangling CID risk)
- L2 sequencer liveness dependency
- Prototype ≠ BPJPH/SIHALAL integration; testnet scope

**Visual:** Warning triangle with 5 bullet points

**Paper ref:** Section VII-A

---

## Slide 19 — Centralized vs HalalChain

**Key points:**
| | Centralized DB | HalalChain |
|--|----------------|------------|
| Setup | Easy | Wallet + gas + IPFS |
| Tamper evidence | Weak | Strong (append-only) |
| Third-party verify | Trust operator API | Permissionless reads |
| Privacy | Flexible | Status is public |

**Takeaway:** Trade transparency for operational complexity; subsidies may be needed for UMKM.

**Paper ref:** Section VII-B

---

## Slide 20 — Policy Implications & Future Work

**Key points:**
- Reference architecture for BPJPH bodies, cooperatives, university KKN pilots
- Export markets want digital traceability beyond physical labels
- Future: multi-sig auditor governance, Base L2 mainnet, SIHALAL API integration, paymaster onboarding

**Visual:** Indonesia map + export arrow (optional)

**Paper ref:** Sections VII-C, VIII

---

## Slide 21 — Conclusion

**Key points:**
- HalalChain = immutable audit trail + wallet-free consumer verification
- Not a substitute for BPJPH/MUI halal determination
- Open source: https://github.com/Fatihmaull/halal-chain
- Live demo: https://web-six-ivory-36.vercel.app/

**Visual:** QR code (demo URL) + GitHub logo

**Paper ref:** Section VIII, Data Availability Statement

---

## Slide 22 — Q&A

**Prepared answers:**

1. **Is this halal certified?** No — it is an audit *trail* tool; religious determination stays with accredited auditors.
2. **Why Sepolia not Base Sepolia?** Faucet access during evaluation; gas figures upper-bound L2 costs.
3. **What if IPFS file disappears?** On-chain CID remains but document unavailable — pinning SLA matters.
4. **Can a rejected batch be approved later?** Only via new revision batch ID, not by editing the rejected record.
5. **UMKM without crypto?** Institutional sponsors, paymasters, or meta-transactions in future work.

**Visual:** "Questions?" + demo QR code

---

## Appendix A — Suggested Slide Deck Structure (22 slides)

| Block | Slides | Minutes |
|-------|--------|---------|
| Opening + problem | 1–4 | 3–4 |
| Solution + design | 5–10 | 4–5 |
| Implementation + demo | 11–13 | 4–5 |
| Evaluation | 14–16 | 3–4 |
| Discussion + close | 17–21 | 3–4 |
| Q&A | 22 | 5 |

---

## Appendix B — Assets to Prepare

| Asset | Source |
|-------|--------|
| Architecture diagram | `paper/figures/architecture.tex` → export PNG |
| Verify screenshots | Live demo `/verify/1`, `/verify/2`, `/verify/3` |
| Gas table chart | `docs/EVALUATION_RESULTS.json` |
| Etherscan screenshot | Sepolia contract page |
| QR codes | Generate from demo URLs |
| Team photo / UIN logo | Department branding |

---

## Appendix C — Prompt for AI Slide Generators

Copy-paste into Gamma, Canva AI, or similar:

> Create a 20-slide academic presentation for "HalalChain: A Trustless Batch Traceability Protocol on Base L2." Audience: university seminar and halal industry stakeholders. Include: Indonesia halal trust problem, three research questions, three-role architecture (Producer/Auditor/Consumer), IPFS + blockchain split, batch state machine with immutable rejection, Islamic ethics mapping (Amanah, Thoyyib, Adl, Hisba), Next.js demo on https://web-six-ivory-36.vercel.app/, Sepolia gas results (registerBatch 155506 gas, verifyBatch 79214 gas), limitations, and future work. Use clean green/white Islamic-friendly palette. Include one live-demo slide with URLs for verify/1, verify/2, verify/3. Authors from UIN Sunan Gunung Djati Bandung.

---

## Appendix D — Paper Section → Slide Map

| Paper section | Slides |
|---------------|--------|
| Abstract | 1, 5, 21 |
| I Introduction | 2–4 |
| II Related Work | (optional backup slide) |
| III Preliminaries | 6–7 |
| IV System Design | 8–10 |
| V Implementation | 11–12 |
| VI Evaluation | 13–16 |
| VII Discussion | 18–19 |
| VIII Conclusion | 20–21 |
| Appendix Reproducibility | 13, 21 |
