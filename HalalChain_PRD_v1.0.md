# HalalChain: Decentralized Traceability Protocol for Halal Integrity Assurance
## Product Requirements Document (PRD) — v1.0
**Classification:** Internal Working Document
**Blockchain Network:** Base Sepolia Testnet (OP Stack)
**Document Status:** DRAFT

---

> *"O you who have believed, eat from the good things which We have provided for you and be grateful to Allah if it is [indeed] Him that you worship."*
> — **Al-Baqarah: 172**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview & Problem Statement](#2-project-overview--problem-statement)
3. [User Personas & User Journeys](#3-user-personas--user-journeys)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Technical Architecture](#6-technical-architecture)
7. [Smart Contract Specification](#7-smart-contract-specification)
8. [UI/UX Requirements](#8-uiux-requirements)
9. [Development Roadmap](#9-development-roadmap)
11. [Risk Register](#11-risk-register)
12. [Appendix A: Glossary](#appendix-a-glossary)

---

## 1. Executive Summary

### 1.1 Mission Statement

**HalalChain** is a trustless, decentralized supply chain traceability protocol engineered on the **Base Network** (an Ethereum Layer 2 powered by Optimism's OP Stack). Its mission is to eradicate data manipulation, fraudulent halal certifications, and opacity in the global halal supply chain by anchoring immutable product batch records on a public, censorship-resistant blockchain.

HalalChain serves as a technological embodiment of two foundational Islamic principles:

- **Amanah (أَمَانَة) — Trustworthiness:** Every record written to the blockchain is permanent and tamper-proof. Producers cannot retroactively alter batch data. Auditors cannot falsify verification outcomes. The protocol is the trustee.
- **Thoyyib (طَيِّب) — Pure & Good:** The system ensures that only certified, genuinely halal products reach the consumer — not through a paper certificate that can be forged, but through a cryptographic proof anchored on a global ledger.

### 1.2 The Integration of Islamic Values with Base L2 Technology

The halal industry globally is valued at over **$2.3 trillion USD** (DinarStandard, 2023), yet it is plagued by certificate fraud, opaque supply chains, and centralized databases that can be altered by corrupt intermediaries. This represents a direct violation of *Amanah*.

Base Network addresses this problem with:

| Islamic Principle | HalalChain Implementation | Base Network Enabler |
|---|---|---|
| **Amanah** (Trustworthiness) | Immutable on-chain batch records | OP Stack fraud proof mechanism |
| **Thoyyib** (Purity/Goodness) | Verified halal status queryable by anyone | Public, permissionless RPC |
| **Adl** (Justice) | No single authority controls the data | Decentralized validator set |
| **Shura** (Consultation) | Multi-signature auditor verification | Solidity RBAC + multi-sig pattern |

### 1.3 Why Base Network?

Base is an Ethereum L2 incubated and maintained by **Coinbase** — the world's most regulated and widely adopted cryptocurrency exchange with over **110 million verified users**. This institutional backing provides HalalChain with:

1. **Security Inheritance:** Ethereum mainnet security via optimistic rollup fraud proofs.
2. **Near-Zero Cost:** Gas fees on Base Sepolia are negligible, enabling zero-budget development.
3. **Mass Adoption Pathway:** Coinbase's global reach means future integration with consumer wallets (Coinbase Wallet, Smart Wallet) is seamless.
4. **EVM Equivalence:** Full Solidity compatibility — no new toolchain required.

---

## 2. Project Overview & Problem Statement

### 2.1 Problem Statement

The halal certification ecosystem in Indonesia (MUI) and globally suffers from several critical failure modes:

**P1 — Certificate Forgery:** Physical halal certificates are easily replicated. A 2022 BPJPH audit found that **~18% of sampled SME products** carried certificates that could not be independently verified.

**P2 — Supply Chain Contamination:** Even with a valid certificate at origin, cross-contamination can occur at any subsequent supply chain node (transport, storage, processing). There is no existing system that records and verifies *each node* of the chain.

**P3 — Centralized Single Points of Failure:** Existing digital traceability databases (e.g., proprietary ERP systems) are controlled by a single entity. A database administrator can alter, delete, or suppress records — a direct violation of *Amanah*.

**P4 — Consumer Information Gap:** End consumers have no reliable, instant mechanism to verify the halal status of a product in their hands. QR codes on packaging typically link to static marketing pages, not verifiable data.

### 2.2 Proposed Solution: HalalChain Protocol

HalalChain solves each problem through a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    CONSUMER LAYER                        │
│         QR Code → Mobile DApp → On-Chain Query          │
├─────────────────────────────────────────────────────────┤
│                   VERIFICATION LAYER                     │
│     Auditor Dashboard → Multi-Sig → Status Update       │
├─────────────────────────────────────────────────────────┤
│                  REGISTRATION LAYER                      │
│   Producer Dashboard → IPFS Upload → On-Chain Anchor    │
├─────────────────────────────────────────────────────────┤
│                BLOCKCHAIN LAYER (BASE)                   │
│         Smart Contracts + Event Logs + RBAC              │
├─────────────────────────────────────────────────────────┤
│               STORAGE LAYER (IPFS/Pinata)                │
│        Documents, Images, Lab Reports (Off-Chain)        │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Project Scope

**In Scope (v1.0):**
- Producer batch registration with IPFS document anchoring
- Auditor role assignment and batch verification workflow
- Consumer QR-code-based instant verification
- Event log transparency dashboard
- Base Sepolia testnet deployment

**Out of Scope (Future v2.0):**
- Cross-chain bridge to mainnet
- IoT sensor integration (temperature, GPS)
- Mobile native app (React Native)
- DAO governance for auditor election
- Token economics / incentive layer

---

## 3. User Personas & User Journeys

### 3.1 Persona 1: Pak Hasan — The Producer

| Attribute | Detail |
|---|---|
| **Name** | Pak Hasan Wijaya |
| **Role** | Owner, CV Berkah Halal Food (SME) |
| **Age** | 42 |
| **Tech Literacy** | Moderate (uses WhatsApp, basic web browsing) |
| **Wallet** | Coinbase Wallet (guided setup by HalalChain onboarding) |
| **Pain Points** | Customers doubt his halal certificate; certificate renewal is bureaucratic; no proof of ingredient sourcing |
| **Goal** | Register a new batch of chicken rendang with supporting documents; receive a QR code to print on packaging |

#### User Journey 1A: New Batch Registration

```
[START] Pak Hasan opens Producer Dashboard
    │
    ▼
[STEP 1] Connect Wallet (Coinbase Wallet / MetaMask on Base Sepolia)
    │       → WalletConnect modal appears
    │       → User approves connection
    │
    ▼
[STEP 2] Fill Batch Registration Form
    │       Fields: Product Name, Batch ID (auto-generated), 
    │               Production Date, Expiry Date, Ingredients List,
    │               Supplier Information, Production Facility
    │
    ▼
[STEP 3] Upload Supporting Documents
    │       → Lab test results (PDF)
    │       → Ingredient certificates (PDF/JPG)
    │       → Facility photos (JPG)
    │       [Documents uploaded to Pinata IPFS → CID returned]
    │
    ▼
[STEP 4] Review & Submit
    │       → System displays IPFS CID, estimated gas fee (~$0.001)
    │       → Producer clicks "Register on Chain"
    │
    ▼
[STEP 5] MetaMask/Coinbase Wallet Signature Prompt
    │       → Transaction signed & broadcast to Base Sepolia
    │       → Tx hash displayed; status: "Pending"
    │
    ▼
[STEP 6] Transaction Confirmed (Base ~2 second finality)
    │       → BatchRegistered event emitted on-chain
    │       → Status: PENDING_VERIFICATION
    │
    ▼
[STEP 7] QR Code Generated (pre-verification)
    │       → Links to Consumer Verification Page with batchID
    │       → Producer can download/print QR
    │
[END] Pak Hasan shares batchID with MUI Auditor for verification
```

---

### 3.2 Persona 2: Ustadz Dr. Fariz — The MUI Auditor

| Attribute | Detail |
|---|---|
| **Name** | Ustadz Dr. Fariz Mahmoud |
| **Role** | Senior Halal Auditor, MUI Certified |
| **Age** | 55 |
| **Tech Literacy** | Low-Moderate (uses email, basic web) |
| **Wallet** | MetaMask (assigned by system admin, pre-funded) |
| **Pain Points** | Paper-based audit trails are cumbersome; concerns about being pressured to certify suspicious products; no accountability for previous certifications |
| **Goal** | Review batch documents, conduct physical inspection, then issue or reject halal status on-chain |

#### User Journey 2A: Batch Verification Workflow

```
[START] Auditor receives notification (email/WhatsApp) with batchID
    │
    ▼
[STEP 1] Connect Wallet on Auditor Dashboard
    │       → System verifies wallet address has AUDITOR_ROLE
    │       → If unauthorized: "Access Denied" message
    │
    ▼
[STEP 2] View Pending Batches Queue
    │       → Sorted by submission date
    │       → Each entry shows: Producer address, Product Name, 
    │                            Submission date, IPFS link
    │
    ▼
[STEP 3] Review IPFS Documents
    │       → Click "View Documents" → IPFS gateway renders files
    │       → Auditor downloads lab reports, reviews ingredients
    │
    ▼
[STEP 4] Physical Inspection (Off-chain)
    │       → Auditor visits facility
    │       → Prepares inspection report (uploaded to IPFS separately)
    │
    ▼
[STEP 5] Issue Verdict On-Chain
    │       → Choose: [✓ CERTIFY HALAL] or [✗ REJECT]
    │       → Input: Inspection Report CID, Notes, Expiry Date of Cert
    │       → Sign transaction with Auditor wallet
    │
    ▼
[STEP 6] Multi-Auditor Confirmation (Optional — 2-of-3 for high-value batches)
    │       → BatchVerification event emitted
    │       → Second auditor can co-sign via verifyBatch() call
    │
    ▼
[STEP 7] Status Updated On-Chain
    │       → ProductBatch.status → HALAL or REJECTED
    │       → Timestamp recorded; auditor address permanently logged
    │
[END] Consumer can now see CERTIFIED HALAL on verification page
```

---

### 3.3 Persona 3: Siti — The Consumer

| Attribute | Detail |
|---|---|
| **Name** | Siti Rahmawati |
| **Role** | Millennial Muslim Consumer |
| **Age** | 28 |
| **Tech Literacy** | High (daily smartphone user, uses e-commerce) |
| **Wallet** | None required |
| **Pain Points** | Cannot verify if QR code on packaging is legitimate; seen news reports about fake halal certificates; wants assurance for family |
| **Goal** | Scan QR on chicken rendang packaging and instantly see verified halal status |

#### User Journey 3A: Consumer Product Verification

```
[START] Siti sees QR code on product packaging in supermarket
    │
    ▼
[STEP 1] Scan QR Code with smartphone camera
    │       → Redirected to: halalchain.app/verify/[batchID]
    │       → No wallet, no account, no app download required
    │
    ▼
[STEP 2] Verification Page Loads (Mobile-First Design)
    │       → System queries Base Sepolia via public RPC
    │       → Retrieves ProductBatch struct data
    │
    ▼
[STEP 3A] If Status = HALAL:
    │       → Large green checkmark ✓
    │       → "HALAL CERTIFIED" banner (in Arabic + Indonesian)
    │       → Product Name, Batch ID, Certification Date
    │       → Auditor's wallet address (verifiable on Basescan)
    │       → "View Documents" → IPFS gateway
    │       → "Verify on Basescan" → external link
    │
[STEP 3B] If Status = PENDING:
    │       → Yellow clock icon ⏳
    │       → "Awaiting Auditor Verification"
    │       → Registered date, Producer address shown
    │
[STEP 3C] If Status = REJECTED:
    │       → Red warning ✗
    │       → "NOT HALAL CERTIFIED"
    │       → Rejection reason (from IPFS notes)
    │
    ▼
[STEP 4] Siti shares verification link via WhatsApp with family
    │
[END] Siti purchases product with full confidence
```

---

## 4. Functional Requirements

### 4.1 FR-01: Web3 Authentication

| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | The system SHALL support wallet connection via WalletConnect v2 protocol | HIGH |
| FR-01.2 | The system SHALL support MetaMask browser extension | HIGH |
| FR-01.3 | The system SHALL support Coinbase Wallet (Smart Wallet) | HIGH |
| FR-01.4 | The system SHALL detect and prompt network switching to Base Sepolia (Chain ID: 84532) | HIGH |
| FR-01.5 | The system SHALL display connected wallet address (truncated: 0x1234...5678) | MEDIUM |
| FR-01.6 | The system SHALL support wallet disconnection and session clearing | MEDIUM |
| FR-01.7 | The system SHALL persist wallet session across page refreshes (localStorage) | LOW |

**Implementation Note:** Use `wagmi` + `viem` hooks for chain management. Base Sepolia RPC: `https://sepolia.base.org`

```javascript
// Next.js config: wagmi chain configuration
import { baseSepolia } from 'wagmi/chains';

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),          // MetaMask
    coinbaseWallet({ appName: 'HalalChain' }),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});
```

### 4.2 FR-02: On-Chain Batch Registration with IPFS CID Anchoring

| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | The system SHALL allow authenticated producers to submit a new ProductBatch | HIGH |
| FR-02.2 | The system SHALL upload all attached documents to Pinata IPFS before on-chain submission | HIGH |
| FR-02.3 | The system SHALL anchor the IPFS CID (Content Identifier) within the on-chain ProductBatch struct | HIGH |
| FR-02.4 | The system SHALL auto-generate a unique batchID using `keccak256(producerAddress + timestamp + nonce)` | HIGH |
| FR-02.5 | The system SHALL emit a `BatchRegistered` event upon successful registration | HIGH |
| FR-02.6 | The system SHALL prevent a producer from registering if they are not in the PRODUCER_ROLE | HIGH |
| FR-02.7 | The system SHALL display estimated gas cost before transaction submission | MEDIUM |
| FR-02.8 | The system SHALL generate a downloadable QR code containing the verification URL after registration | MEDIUM |

### 4.3 FR-03: Role-Based Access Control (RBAC)

| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | The system SHALL implement OpenZeppelin `AccessControl` for role management | HIGH |
| FR-03.2 | The system SHALL define three roles: `DEFAULT_ADMIN_ROLE`, `AUDITOR_ROLE`, `PRODUCER_ROLE` | HIGH |
| FR-03.3 | Only `DEFAULT_ADMIN_ROLE` SHALL be able to grant/revoke `AUDITOR_ROLE` | HIGH |
| FR-03.4 | Only `DEFAULT_ADMIN_ROLE` SHALL be able to grant/revoke `PRODUCER_ROLE` | HIGH |
| FR-03.5 | Only addresses with `AUDITOR_ROLE` SHALL be able to call `verifyBatch()` | HIGH |
| FR-03.6 | Only addresses with `PRODUCER_ROLE` SHALL be able to call `registerBatch()` | HIGH |
| FR-03.7 | The system SHALL emit `RoleGranted` and `RoleRevoked` events (inherited from OZ AccessControl) | HIGH |
| FR-03.8 | The Admin dashboard SHALL display a role management interface for the deployer | MEDIUM |

### 4.4 FR-04: Real-Time Status Querying & Event Logging

| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | The system SHALL provide a public `getBatch(bytes32 batchID)` view function requiring no wallet | HIGH |
| FR-04.2 | The system SHALL index `BatchRegistered`, `BatchVerified`, and `BatchRejected` events for off-chain querying | HIGH |
| FR-04.3 | The Consumer Verification Page SHALL query batch status via public RPC (no wallet required) | HIGH |
| FR-04.4 | The system SHALL display a live event feed on the transparency dashboard using `ethers.js` event listeners | MEDIUM |
| FR-04.5 | The system SHALL provide a `getAllBatchesByProducer(address)` paginated view function | MEDIUM |
| FR-04.6 | The system SHALL display transaction hash with a direct link to Basescan for every on-chain action | MEDIUM |

---

## 5. Non-Functional Requirements

### 5.1 NFR-01: Performance & Latency

| ID | Requirement | Target |
|---|---|---|
| NFR-01.1 | Transaction finality on Base Sepolia | < 2 seconds (OP Stack block time) |
| NFR-01.2 | Consumer verification page initial load | < 3 seconds on 4G mobile |
| NFR-01.3 | IPFS document upload via Pinata | < 10 seconds for files < 10MB |
| NFR-01.4 | On-chain read query (getBatch) response time | < 500ms |
| NFR-01.5 | QR code generation after batch registration | < 1 second |

### 5.2 NFR-02: Security

| ID | Requirement |
|---|---|
| NFR-02.1 | Smart contracts SHALL use Solidity `^0.8.20` to benefit from built-in overflow protection |
| NFR-02.2 | All state-changing functions SHALL follow the Checks-Effects-Interactions (CEI) pattern |
| NFR-02.3 | The contract SHALL use `ReentrancyGuard` from OpenZeppelin for critical functions |
| NFR-02.4 | Private keys SHALL never be stored in frontend code or environment variables committed to Git |
| NFR-02.5 | IPFS CIDs SHALL be verified client-side before on-chain submission |
| NFR-02.6 | The contract SHALL be verified and published on Basescan for public auditability |

### 5.3 NFR-03: Gas Efficiency

| ID | Requirement | Technique |
|---|---|---|
| NFR-03.1 | Use `bytes32` instead of `string` for batchID | Saves ~20,000 gas per SSTORE |
| NFR-03.2 | Pack struct fields to fit within 32-byte slots | Saves storage slots |
| NFR-03.3 | Use `events` for data that needs to be queried off-chain | Avoids expensive SSTORE |
| NFR-03.4 | Use `mapping` instead of arrays for batch lookups | O(1) vs O(n) complexity |
| NFR-03.5 | Mark read-only functions as `view` or `pure` | Prevents unnecessary gas usage |

### 5.4 NFR-04: Data Persistence (IPFS)

| ID | Requirement |
|---|---|
| NFR-04.1 | All documents SHALL be pinned on Pinata with a minimum of 1 pin to ensure persistence |
| NFR-04.2 | IPFS CIDs SHALL be stored as `string` on-chain (CIDv1 format) |
| NFR-04.3 | The system SHALL use Pinata's free tier (1 GB storage) for early prototype phase |
| NFR-04.4 | Documents SHALL be accessible via public IPFS gateway: `https://gateway.pinata.cloud/ipfs/{CID}` |

### 5.5 NFR-05: Accessibility & Usability

| ID | Requirement |
|---|---|
| NFR-05.1 | Consumer verification page SHALL function without any wallet or Web3 knowledge |
| NFR-05.2 | All UI text SHALL be available in Bahasa Indonesia and English |
| NFR-05.3 | The system SHALL display human-readable error messages for all failed transactions |
| NFR-05.4 | The system SHALL be responsive for mobile screens (min-width: 320px) |

---

## 6. Technical Architecture

### 6.1 End-to-End Data Flow

```
                        ┌─────────────┐
                        │  PRODUCER   │
                        │  Dashboard  │
                        └──────┬──────┘
                               │ 1. Fill Form + Upload Docs
                               ▼
                    ┌──────────────────────┐
                    │   PINATA IPFS API    │
                    │  (Free Tier — 1GB)   │
                    └──────────┬───────────┘
                               │ 2. Returns CID (e.g., "Qm...")
                               ▼
                    ┌──────────────────────┐
                    │   NEXT.JS FRONTEND   │
                    │  (Viem + Wagmi)      │
                    │                      │
                    │  registerBatch(      │
                    │    batchID,          │
                    │    productName,      │
                    │    ipfsCID,          │
                    │    timestamps        │
                    │  )                   │
                    └──────────┬───────────┘
                               │ 3. Sign & Send Tx
                               ▼
             ┌─────────────────────────────────────┐
             │         BASE SEPOLIA TESTNET         │
             │         (Chain ID: 84532)            │
             │                                      │
             │  ┌─────────────────────────────┐    │
             │  │   HalalChain.sol             │    │
             │  │   ─────────────────────      │    │
             │  │   registerBatch()            │    │
             │  │   verifyBatch()              │    │
             │  │   getBatch()                 │    │
             │  │   grantRole() / revokeRole() │    │
             │  └─────────────────────────────┘    │
             │                                      │
             │  [BatchRegistered Event Emitted]     │
             └──────────┬──────────────────────────┘
                        │ 4. Event/State Confirmed
                        │
         ┌──────────────┴────────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌──────────────────────┐
│ AUDITOR         │             │ CONSUMER             │
│ Dashboard       │             │ Verification Page    │
│                 │             │                      │
│ - View Pending  │             │ - No wallet needed   │
│ - Review IPFS   │             │ - QR → batchID       │
│ - verifyBatch() │             │ - Read-only query    │
└─────────────────┘             └──────────────────────┘
```

### 6.2 System Component Breakdown

| Component | Technology | Hosting | Cost |
|---|---|---|---|
| Smart Contract | Solidity ^0.8.20 | Base Sepolia | $0 (testnet) |
| Frontend | Next.js 14 (App Router) | Vercel Free Tier | $0 |
| Wallet Integration | Wagmi v2 + Viem | Client-side | $0 |
| Document Storage | IPFS via Pinata SDK | Pinata Free (1GB) | $0 |
| Contract Interaction | Ethers.js v6 / Viem | Client-side | $0 |
| Version Control | GitHub | GitHub Free | $0 |
| Contract Explorer | Basescan | Basescan | $0 |
| **TOTAL** | | | **$0** |

### 6.3 Smart Contract Interaction Map

```
HalalChain.sol
│
├── AccessControl (OpenZeppelin)
│   ├── DEFAULT_ADMIN_ROLE → Deployer wallet
│   ├── AUDITOR_ROLE → MUI-assigned auditor wallets
│   └── PRODUCER_ROLE → Registered producer wallets
│
├── Mappings
│   ├── batches: bytes32 → ProductBatch
│   └── producerBatches: address → bytes32[]
│
├── Write Functions (Gas-bearing)
│   ├── registerBatch() — PRODUCER_ROLE only
│   ├── verifyBatch() — AUDITOR_ROLE only
│   └── rejectBatch() — AUDITOR_ROLE only
│
└── Read Functions (Free, no gas)
    ├── getBatch(bytes32) → ProductBatch
    ├── getBatchStatus(bytes32) → BatchStatus
    └── getBatchesByProducer(address) → bytes32[]
```

---

## 7. Smart Contract Specification

### 7.1 Core Data Structures

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title HalalChain
 * @author HalalChain contributors
 * @notice Decentralized halal supply chain traceability protocol on Base Network
 * @dev Implements RBAC via OpenZeppelin AccessControl with IPFS document anchoring
 */
contract HalalChain is AccessControl, ReentrancyGuard, Pausable {

    // ═══════════════════════════════════════════
    //                  ROLES
    // ═══════════════════════════════════════════

    bytes32 public constant AUDITOR_ROLE  = keccak256("AUDITOR_ROLE");
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");

    // ═══════════════════════════════════════════
    //                  ENUMS
    // ═══════════════════════════════════════════

    /**
     * @dev Represents the lifecycle state of a halal product batch
     * - PENDING:   Batch registered, awaiting auditor review
     * - HALAL:     Batch verified and certified halal by authorized auditor
     * - REJECTED:  Batch failed halal audit; not certified
     * - REVOKED:   Previously certified batch has had certification revoked
     */
    enum BatchStatus {
        PENDING,   // 0
        HALAL,     // 1
        REJECTED,  // 2
        REVOKED    // 3
    }

    // ═══════════════════════════════════════════
    //                  STRUCTS
    // ═══════════════════════════════════════════

    /**
     * @dev Core data structure representing a halal product batch
     * @notice Slot-packed for gas efficiency:
     *         Slot 1: producerAddress (20 bytes) + status (1 byte) = 21 bytes
     *         Slot 2: auditorAddress (20 bytes)
     *         Slot 3: registrationTimestamp (32 bytes)
     *         Slot 4: verificationTimestamp (32 bytes)
     *         Slot 5: expiryTimestamp (32 bytes)
     *         Slot 6+: strings (dynamic — stored separately by EVM)
     */
    struct ProductBatch {
        // Identification
        bytes32 batchID;              // Unique identifier: keccak256(producer + timestamp + nonce)
        
        // Parties
        address producerAddress;      // Wallet address of the registered producer
        address auditorAddress;       // Wallet address of the certifying auditor (0x0 if pending)
        
        // Product Information
        string  productName;          // Human-readable product name (e.g., "Rendang Ayam Pak Hasan")
        string  productCategory;      // Category (e.g., "Processed Meat", "Beverages")
        
        // IPFS Anchors
        string  ipfsDocumentCID;      // CID of zipped document bundle (lab reports, certs)
        string  ipfsInspectionCID;    // CID of auditor's inspection report (set during verification)
        
        // Timestamps (Unix epoch)
        uint48  registrationTimestamp;   // When producer registered the batch
        uint48  verificationTimestamp;   // When auditor issued verdict (0 if pending)
        uint48  certificationExpiry;     // Halal cert expiry date (set by auditor)
        
        // Status
        BatchStatus status;           // Current lifecycle state
        
        // Metadata
        string  rejectionReason;      // Populated if status == REJECTED or REVOKED
        uint16  batchNonce;           // Incremental nonce per producer for batchID generation
    }

    // ═══════════════════════════════════════════
    //                 MAPPINGS
    // ═══════════════════════════════════════════

    /// @notice Primary lookup: batchID → ProductBatch
    mapping(bytes32 => ProductBatch) private batches;

    /// @notice Producer history: producerAddress → array of batchIDs
    mapping(address => bytes32[]) private producerBatches;

    /// @notice Producer nonce tracker for unique batchID generation
    mapping(address => uint16) private producerNonce;

    /// @notice Track total registered batches for analytics
    uint256 public totalBatchesRegistered;
    uint256 public totalBatchesCertified;

    // ═══════════════════════════════════════════
    //                  EVENTS
    // ═══════════════════════════════════════════

    /**
     * @dev Emitted when a producer registers a new product batch
     * @param batchID       Unique batch identifier
     * @param producer      Address of the registering producer
     * @param productName   Name of the product
     * @param ipfsCID       IPFS CID of supporting documents
     * @param timestamp     Block timestamp of registration
     */
    event BatchRegistered(
        bytes32 indexed batchID,
        address indexed producer,
        string  productName,
        string  ipfsCID,
        uint256 timestamp
    );

    /**
     * @dev Emitted when an authorized auditor certifies a batch as halal
     */
    event BatchVerified(
        bytes32 indexed batchID,
        address indexed auditor,
        string  inspectionCID,
        uint48  expiryDate,
        uint256 timestamp
    );

    /**
     * @dev Emitted when an authorized auditor rejects a batch
     */
    event BatchRejected(
        bytes32 indexed batchID,
        address indexed auditor,
        string  reason,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a halal certification is revoked
     */
    event BatchRevoked(
        bytes32 indexed batchID,
        address indexed auditor,
        string  reason,
        uint256 timestamp
    );

    // ═══════════════════════════════════════════
    //               CUSTOM ERRORS
    // ═══════════════════════════════════════════
    // Gas-efficient compared to require() with string messages

    error BatchAlreadyExists(bytes32 batchID);
    error BatchNotFound(bytes32 batchID);
    error BatchNotPending(bytes32 batchID, BatchStatus currentStatus);
    error BatchNotCertified(bytes32 batchID);
    error InvalidIPFSCID();
    error InvalidProductName();
    error CertificationExpired(bytes32 batchID, uint48 expiryDate);

    // ═══════════════════════════════════════════
    //              CONSTRUCTOR
    // ═══════════════════════════════════════════

    /**
     * @dev Deploys HalalChain and grants DEFAULT_ADMIN_ROLE to deployer
     * @notice Deployer should be a multi-sig wallet in production
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ═══════════════════════════════════════════
    //            WRITE FUNCTIONS
    // ═══════════════════════════════════════════

    /**
     * @notice Register a new halal product batch
     * @dev Only callable by addresses with PRODUCER_ROLE
     * @param _productName      Name of the product
     * @param _productCategory  Product category string
     * @param _ipfsCID          IPFS CID of uploaded documents (must be non-empty)
     * @param _certExpiry       Desired certification expiry (Unix timestamp, can be 0 for default)
     * @return batchID          The generated unique batch identifier
     */
    function registerBatch(
        string calldata _productName,
        string calldata _productCategory,
        string calldata _ipfsCID,
        uint48 _certExpiry
    )
        external
        whenNotPaused
        onlyRole(PRODUCER_ROLE)
        nonReentrant
        returns (bytes32 batchID)
    {
        // ── CHECKS ──────────────────────────────
        if (bytes(_productName).length == 0) revert InvalidProductName();
        if (bytes(_ipfsCID).length == 0)     revert InvalidIPFSCID();

        // Generate deterministic batchID
        uint16 nonce = producerNonce[msg.sender]++;
        batchID = keccak256(
            abi.encodePacked(msg.sender, block.timestamp, nonce)
        );

        if (batches[batchID].registrationTimestamp != 0) {
            revert BatchAlreadyExists(batchID);
        }

        // ── EFFECTS ──────────────────────────────
        batches[batchID] = ProductBatch({
            batchID:                 batchID,
            producerAddress:         msg.sender,
            auditorAddress:          address(0),
            productName:             _productName,
            productCategory:         _productCategory,
            ipfsDocumentCID:         _ipfsCID,
            ipfsInspectionCID:       "",
            registrationTimestamp:   uint48(block.timestamp),
            verificationTimestamp:   0,
            certificationExpiry:     _certExpiry,
            status:                  BatchStatus.PENDING,
            rejectionReason:         "",
            batchNonce:              nonce
        });

        producerBatches[msg.sender].push(batchID);
        totalBatchesRegistered++;

        // ── INTERACTIONS (Events) ────────────────
        emit BatchRegistered(
            batchID,
            msg.sender,
            _productName,
            _ipfsCID,
            block.timestamp
        );

        return batchID;
    }

    /**
     * @notice Certify a batch as HALAL
     * @dev Only callable by addresses with AUDITOR_ROLE
     * @param _batchID          The batch to certify
     * @param _inspectionCID    IPFS CID of auditor's inspection report
     * @param _expiryDate       Certification expiry (Unix timestamp)
     */
    function verifyBatch(
        bytes32 _batchID,
        string calldata _inspectionCID,
        uint48 _expiryDate
    )
        external
        whenNotPaused
        onlyRole(AUDITOR_ROLE)
        nonReentrant
    {
        // ── CHECKS ──────────────────────────────
        ProductBatch storage batch = batches[_batchID];

        if (batch.registrationTimestamp == 0)   revert BatchNotFound(_batchID);
        if (batch.status != BatchStatus.PENDING) revert BatchNotPending(_batchID, batch.status);
        if (bytes(_inspectionCID).length == 0)   revert InvalidIPFSCID();

        // ── EFFECTS ──────────────────────────────
        batch.status                  = BatchStatus.HALAL;
        batch.auditorAddress          = msg.sender;
        batch.ipfsInspectionCID       = _inspectionCID;
        batch.verificationTimestamp   = uint48(block.timestamp);
        batch.certificationExpiry     = _expiryDate;
        totalBatchesCertified++;

        // ── INTERACTIONS (Events) ────────────────
        emit BatchVerified(
            _batchID,
            msg.sender,
            _inspectionCID,
            _expiryDate,
            block.timestamp
        );
    }

    /**
     * @notice Reject a batch (not halal compliant)
     * @dev Only callable by addresses with AUDITOR_ROLE
     */
    function rejectBatch(
        bytes32 _batchID,
        string calldata _reason,
        string calldata _inspectionCID
    )
        external
        whenNotPaused
        onlyRole(AUDITOR_ROLE)
        nonReentrant
    {
        ProductBatch storage batch = batches[_batchID];

        if (batch.registrationTimestamp == 0)    revert BatchNotFound(_batchID);
        if (batch.status != BatchStatus.PENDING)  revert BatchNotPending(_batchID, batch.status);

        batch.status                = BatchStatus.REJECTED;
        batch.auditorAddress        = msg.sender;
        batch.ipfsInspectionCID     = _inspectionCID;
        batch.verificationTimestamp = uint48(block.timestamp);
        batch.rejectionReason       = _reason;

        emit BatchRejected(_batchID, msg.sender, _reason, block.timestamp);
    }

    /**
     * @notice Revoke a previously granted halal certification
     * @dev Only callable by AUDITOR_ROLE; used when post-certification issues arise
     */
    function revokeCertification(
        bytes32 _batchID,
        string calldata _reason
    )
        external
        whenNotPaused
        onlyRole(AUDITOR_ROLE)
        nonReentrant
    {
        ProductBatch storage batch = batches[_batchID];

        if (batch.registrationTimestamp == 0)  revert BatchNotFound(_batchID);
        if (batch.status != BatchStatus.HALAL) revert BatchNotCertified(_batchID);

        batch.status            = BatchStatus.REVOKED;
        batch.rejectionReason   = _reason;

        emit BatchRevoked(_batchID, msg.sender, _reason, block.timestamp);
    }

    // ═══════════════════════════════════════════
    //             READ FUNCTIONS (FREE)
    // ═══════════════════════════════════════════

    /**
     * @notice Retrieve full ProductBatch data by batchID
     * @dev Public function — no wallet required; used by consumer verification page
     */
    function getBatch(bytes32 _batchID)
        external
        view
        returns (ProductBatch memory)
    {
        if (batches[_batchID].registrationTimestamp == 0) revert BatchNotFound(_batchID);
        return batches[_batchID];
    }

    /**
     * @notice Get current status of a batch
     */
    function getBatchStatus(bytes32 _batchID)
        external
        view
        returns (BatchStatus)
    {
        return batches[_batchID].status;
    }

    /**
     * @notice Get all batchIDs registered by a specific producer
     */
    function getBatchesByProducer(address _producer)
        external
        view
        returns (bytes32[] memory)
    {
        return producerBatches[_producer];
    }

    /**
     * @notice Check if a certification is currently valid (not expired)
     */
    function isCertificationValid(bytes32 _batchID)
        external
        view
        returns (bool)
    {
        ProductBatch memory batch = batches[_batchID];
        return (
            batch.status == BatchStatus.HALAL &&
            (batch.certificationExpiry == 0 ||
             batch.certificationExpiry > uint48(block.timestamp))
        );
    }

    // ═══════════════════════════════════════════
    //            ADMIN FUNCTIONS
    // ═══════════════════════════════════════════

    /// @notice Pause all state-changing operations (emergency use)
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpause operations
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
```

### 7.2 Deployment Configuration (Hardhat)

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true, // Enables improved stack-too-deep error handling
    },
  },
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};
```

### 7.3 Deployment Script

```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying HalalChain to Base Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Balance:", ethers.formatEther(
    await ethers.provider.getBalance(deployer.address)
  ), "ETH");

  // Deploy
  const HalalChain = await ethers.getContractFactory("HalalChain");
  const halalChain = await HalalChain.deploy();
  await halalChain.waitForDeployment();

  const contractAddress = await halalChain.getAddress();
  console.log("HalalChain deployed to:", contractAddress);

  // Grant initial roles (replace with actual addresses)
  const AUDITOR_ROLE  = ethers.keccak256(ethers.toUtf8Bytes("AUDITOR_ROLE"));
  const PRODUCER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PRODUCER_ROLE"));

  await halalChain.grantRole(AUDITOR_ROLE,  process.env.AUDITOR_WALLET);
  await halalChain.grantRole(PRODUCER_ROLE, process.env.PRODUCER_WALLET);
  console.log("Roles granted successfully.");

  // Verify on Basescan
  console.log("Verifying contract on Basescan...");
  await harden.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
```

### 7.4 IPFS Upload Service (Pinata)

```typescript
// lib/pinata.ts
import PinataSDK from "@pinata/sdk";

const pinata = new PinataSDK({
  pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT!,
});

export interface BatchDocuments {
  labReport: File;
  ingredientCerts: File[];
  facilityPhotos: File[];
}

/**
 * Upload batch documents to IPFS via Pinata
 * Returns the IPFS CID to be anchored on-chain
 */
export async function uploadBatchDocuments(
  batchID: string,
  documents: BatchDocuments
): Promise<string> {
  const formData = new FormData();
  
  // Append all files with organized naming
  formData.append("file", documents.labReport, `lab-report.pdf`);
  documents.ingredientCerts.forEach((file, i) =>
    formData.append("file", file, `ingredient-cert-${i}.pdf`)
  );
  documents.facilityPhotos.forEach((file, i) =>
    formData.append("file", file, `facility-photo-${i}.jpg`)
  );

  const metadata = JSON.stringify({
    name: `HalalChain-Batch-${batchID}`,
    keyvalues: {
      batchID,
      uploadedAt: new Date().toISOString(),
      protocol: "HalalChain-v1",
    },
  });
  formData.append("pinataMetadata", metadata);

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}` },
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(`Pinata upload failed: ${data.error}`);
  
  return data.IpfsHash; // CID to store on-chain
}
```

---

## 8. UI/UX Requirements

### 8.1 Design System

**Color Palette:**

| Token | Hex | Usage |
|---|---|---|
| `halal-green` | `#1A7A4A` | Primary CTA, certified status |
| `halal-gold` | `#C8A84B` | Accents, Islamic geometric motifs |
| `pending-amber` | `#D97706` | Pending status indicators |
| `reject-red` | `#DC2626` | Rejection/warning states |
| `surface-light` | `#F9FAFB` | Page backgrounds |
| `text-primary` | `#111827` | Body text |

**Typography:**
- Headings: `Noto Serif` (supports Arabic script for Islamic text elements)
- Body: `Inter` (optimized for screen readability)
- Monospace (addresses, tx hashes): `JetBrains Mono`

**Iconography:** Phosphor Icons library (open source, consistent stroke weight)

### 8.2 Dashboard 1: Producer Dashboard

**Route:** `/dashboard/producer`

**Layout Sections:**

```
┌─────────────────────────────────────────────────┐
│  🔗 HalalChain     [0x1234...5678] [Disconnect]  │  ← Header + Wallet
├─────────────────────────────────────────────────┤
│                                                  │
│  ╔══════════════════╗  ╔════════════════════╗   │
│  ║  Total Batches   ║  ║  Certified Batches ║   │  ← Stats Cards
│  ║      12          ║  ║       8            ║   │
│  ╚══════════════════╝  ╚════════════════════╝   │
│                                                  │
│  [ + Register New Batch ]  ← Primary CTA Button │
│                                                  │
├─────────────────────────────────────────────────┤
│  MY BATCHES                        [Filter ▼]   │
│  ─────────────────────────────────────────────  │
│  │ Rendang Ayam   │ 0xBATCH1  │ ✅ HALAL    │  │  ← Batch Table
│  │ Sambal Udang   │ 0xBATCH2  │ ⏳ PENDING  │  │
│  │ Krupuk Ikan    │ 0xBATCH3  │ ❌ REJECTED │  │
│  ─────────────────────────────────────────────  │
└─────────────────────────────────────────────────┘
```

**Register New Batch Modal/Form (Multi-step):**

- **Step 1 — Product Info:** Product Name, Category, Production Date, Expiry Date, Ingredients (rich text)
- **Step 2 — Documents:** Drag-and-drop upload zone; supports PDF, JPG, PNG; max 10MB total
- **Step 3 — Review & Submit:** Summary of all data + IPFS upload progress bar → "Confirm & Register"
- **Step 4 — Success:** Transaction hash, BatchID, downloadable QR code

### 8.3 Dashboard 2: Auditor Dashboard

**Route:** `/dashboard/auditor`
**Access Control:** Frontend checks `hasRole(AUDITOR_ROLE, connectedAddress)` — redirects if unauthorized

**Layout Sections:**

```
┌─────────────────────────────────────────────────┐
│  🔗 HalalChain (Auditor)    [0xAUDIT...] [⚙️]   │
├─────────────────────────────────────────────────┤
│  PENDING REVIEW QUEUE        (3 items)           │
│  ─────────────────────────────────────────────  │
│  [!] Rendang Ayam – Pak Hasan – 2 days ago       │
│      View Documents | [ ✓ CERTIFY ] [ ✗ REJECT ] │
│  ─────────────────────────────────────────────  │
│  [!] Mie Halal – PT Berkah – 5 days ago          │
│      View Documents | [ ✓ CERTIFY ] [ ✗ REJECT ] │
├─────────────────────────────────────────────────┤
│  COMPLETED VERIFICATIONS                         │
│  ─────────────────────────────────────────────  │
│  ✅ Sate Ayam – Certified – 12 Jan 2026          │
│  ❌ Bakso Sapi – Rejected – "Non-halal gelatin"  │
│  🔴 Kue Basah – REVOKED – "Supply chain change"  │
└─────────────────────────────────────────────────┘
```

**Certification Modal:**
- IPFS Document Viewer (embedded PDF.js viewer)
- Inspection Report upload field
- Expiry date picker
- Confirmation: "Sign this on-chain? This action is PERMANENT and irreversible."

### 8.4 Dashboard 3: Consumer Verification Page (Mobile-First)

**Route:** `/verify/[batchID]`
**Wallet:** NOT REQUIRED

**Mobile Layout (375px width design target):**

```
┌─────────────────────┐
│    🕌 HalalChain    │  ← Small header
├─────────────────────┤
│                     │
│  ┌───────────────┐  │
│  │               │  │
│  │  ✅  HALAL    │  │  ← Large status card
│  │  CERTIFIED    │  │     Green background
│  │               │  │
│  └───────────────┘  │
│                     │
│  🍗 Rendang Ayam    │  ← Product name
│  Pak Hasan Wijaya   │  ← Producer
│  Batch: 0x1a2b...   │  ← batchID (truncated)
│                     │
│  📅 Certified: 15 Jan 2026  │
│  ⏰ Expires:   15 Jan 2027  │
│                     │
│  🔍 Auditor:        │
│  0xFARIZ...1234     │  ← Clickable → Basescan
│                     │
│  [📄 View Documents]│  ← Opens IPFS in new tab
│  [🔗 Basescan Tx]   │  ← On-chain proof
│                     │
│  ─────────────────  │
│  Powered by Base    │
│  🔵 Ethereum L2     │  ← Trust signal
└─────────────────────┘
```

**Status Display States:**

| State | Background | Icon | Message (EN/ID) |
|---|---|---|---|
| HALAL | `#DCFCE7` (green tint) | ✅ Large checkmark | "Halal Certified / Tersertifikasi Halal" |
| PENDING | `#FEF3C7` (amber tint) | ⏳ Spinning clock | "Awaiting Verification / Menunggu Verifikasi" |
| REJECTED | `#FEE2E2` (red tint) | ❌ Cross | "Not Certified / Tidak Tersertifikasi" |
| REVOKED | `#F3F4F6` (grey) | 🔴 Warning | "Certification Revoked / Sertifikasi Dicabut" |
| NOT FOUND | `#F9FAFB` | ❓ Question | "Batch Not Found / Batch Tidak Ditemukan" |

---

## 9. Development Roadmap

### Phase Overview

| Phase | Weeks | Focus | Deliverable |
|---|---|---|---|
| **Phase 1** | 1–2 | Foundation & Setup | Dev environment, smart contract skeleton |
| **Phase 2** | 3–4 | Core Development | Complete smart contract + IPFS integration |
| **Phase 3** | 5–6 | Frontend & Integration | All 3 dashboards functional |
| **Phase 4** | 7–8 | Testing & Hardening | Testnet deployment, monitoring, documentation |

---

### Week 1: Environment Setup & Architecture

**Lead:** Lead Dev + Tech Lead

| Task | Owner | Output |
|---|---|---|
| Set up GitHub repo (monorepo: `/contracts`, `/frontend`) | Lead Dev | GitHub repo |
| Configure Hardhat + OpenZeppelin dependencies | Lead Dev | `hardhat.config.js` |
| Set up Next.js 14 app with Wagmi + Viem | Frontend Dev | Next.js boilerplate |
| Obtain Base Sepolia faucet ETH (Alchemy + Coinbase faucets) | Lead Dev | Funded test wallets |
| Create Pinata account, generate JWT API key | Backend Dev | `.env` configured |
| Draft system architecture diagram | Tech Lead | Architecture doc |
| Design system color palette and component library setup | UI/UX Dev | Figma file |

> ⚠️ **REMINDER FOR LEAD DEV:** Segera ambil faucet di:
> - **Alchemy Faucet:** https://www.alchemy.com/faucets/base-sepolia
> - **Coinbase Faucet:** https://portal.cdp.coinbase.com/products/faucet
> - Kalian perlu minimal 0.1 ETH Sepolia di setiap wallet (deployer, auditor, producer) untuk testing.

---

### Week 2: Smart Contract Development

**Lead:** Lead Dev

| Task | Owner | Output |
|---|---|---|
| Implement `ProductBatch` struct and enums | Lead Dev | `HalalChain.sol` skeleton |
| Implement `registerBatch()` with CEI pattern | Lead Dev | Tested function |
| Implement `verifyBatch()` and `rejectBatch()` | Lead Dev | Tested functions |
| Implement OpenZeppelin RBAC (`AccessControl`) | Lead Dev | Role system working |
| Write Hardhat unit tests (coverage > 90%) | Lead Dev + QA | `test/HalalChain.test.js` |
| Local deployment and testing on Hardhat Network | Lead Dev | Green test suite |

---

### Week 3: Testnet Deployment & IPFS Integration

**Lead:** Lead Dev + Backend Dev

| Task | Owner | Output |
|---|---|---|
| Deploy `HalalChain.sol` to Base Sepolia | Lead Dev | Contract address |
| Verify contract on Basescan | Lead Dev | Public source code |
| Build Pinata upload service (`lib/pinata.ts`) | Backend Dev | Working upload |
| Test full flow: Upload to IPFS → anchor CID on-chain | Both | Integration working |
| Document contract ABI for frontend integration | Lead Dev | `abi/HalalChain.json` |
| Grant AUDITOR_ROLE and PRODUCER_ROLE to test wallets | Lead Dev | Roles assigned |

---

### Week 4: Producer Dashboard Development

**Lead:** Frontend Dev

| Task | Owner | Output |
|---|---|---|
| Wallet connection component (MetaMask + Coinbase Wallet) | Frontend Dev | WalletConnect modal |
| Multi-step batch registration form | Frontend Dev | Form with validation |
| IPFS upload progress UI | Frontend Dev | Upload component |
| `registerBatch()` contract call via Viem | Frontend Dev | Tx submission working |
| QR code generation component (`qrcode.react`) | Frontend Dev | QR download feature |
| Batch history table with status badges | Frontend Dev | Data table |
| Error handling for failed transactions | Frontend Dev | Error toasts |

---

### Week 5: Auditor Dashboard Development

**Lead:** Frontend Dev + Lead Dev

| Task | Owner | Output |
|---|---|---|
| RBAC role check on page mount (redirect if unauthorized) | Frontend Dev | Access control |
| Pending batches queue with IPFS document viewer | Frontend Dev | Document review UI |
| `verifyBatch()` and `rejectBatch()` contract calls | Lead Dev | Tx functions |
| Certification confirmation modal | Frontend Dev | Confirmation dialog |
| Event listener for real-time updates | Lead Dev | Live event feed |
| Completed verifications history table | Frontend Dev | History view |

---

### Week 6: Consumer Verification Page + QA

**Lead:** Frontend Dev + QA

| Task | Owner | Output |
|---|---|---|
| Mobile-first consumer verification page | Frontend Dev | `/verify/[batchID]` |
| Public RPC query (no wallet needed) | Lead Dev | Read-only query |
| Status display states (all 5 states) | Frontend Dev | Status UI complete |
| Bilingual support (EN/ID) via `next-intl` | Frontend Dev | Language switcher |
| Full integration test (Producer → Auditor → Consumer) | QA | Test report |
| Cross-browser testing (Chrome, Firefox, Safari) | QA | Browser compat report |
| Mobile testing (iOS Safari, Android Chrome) | QA | Mobile test report |

---

### Week 8: Final Demo Preparation & Submission

| Task | Owner | Output |
|---|---|---|
| Record 5-minute demo video (full user journey) | Team Lead + UI Dev | Demo video |
| Prepare competition presentation slides (15 slides) | UI/UX Dev | PowerPoint |
| Final end-to-end testing on Base Sepolia | Lead Dev + QA | Passing test suite |
| Deploy to Vercel (production-like demo URL) | Lead Dev | Live demo URL |
| README.md with setup instructions | Lead Dev | Documentation |
| Release v1 prototype | Team Lead | Release notes |

---

### Milestone Summary

```
Week 1  ████░░░░ Setup & Architecture
Week 2  ████████ Smart Contract Complete ← MILESTONE 1: Contract Done
Week 3  ████████ Testnet Deployed        ← MILESTONE 2: On-chain Live
Week 4  ████████ Producer Dashboard
Week 5  ████████ Auditor Dashboard       ← MILESTONE 3: Full App
Week 6  ████████ Consumer Page + QA      ← MILESTONE 4: QA Complete
Week 7  ████████ Research Paper
Week 8  ████████ Release & Hardening
```

---

## 11. Risk Register

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | Smart contract bug leads to locked data | Medium | High | OpenZeppelin audited libraries + unit tests |
| R-02 | Pinata free tier storage exhausted | Low | Medium | Limit file size per batch; demo uses minimal files |
| R-03 | Base Sepolia RPC downtime | Low | High | Fallback to Alchemy RPC endpoint |
| R-04 | Team member unavailability | Medium | Medium | Cross-training; document all code thoroughly |
| R-05 | IPFS files become inaccessible | Low | Medium | All files pinned; backup to secondary Pinata account |
| R-06 | Gas estimation fails on frontend | Low | Low | Hardcode gas limit fallback for demo |
| R-07 | Release deadline missed | Medium | Medium | Keep scope tight; ship in increments |

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **Base Network** | Ethereum Layer 2 blockchain developed by Coinbase using the OP Stack |
| **OP Stack** | Open-source development stack for building Ethereum L2s (by Optimism) |
| **Optimistic Rollup** | L2 scaling technique that assumes transactions are valid unless proven otherwise |
| **IPFS** | InterPlanetary File System — distributed file storage protocol |
| **CID** | Content Identifier — unique hash that identifies a file on IPFS |
| **Pinata** | Centralized pinning service for IPFS files (free tier: 1GB) |
| **RBAC** | Role-Based Access Control — restricts system access based on assigned roles |
| **CEI Pattern** | Checks-Effects-Interactions — Solidity security pattern to prevent reentrancy |
| **Wagmi** | React hooks library for Ethereum wallet interactions |
| **Viem** | TypeScript-first Ethereum library (modern alternative to ethers.js) |
| **Basescan** | Block explorer for Base Network (similar to Etherscan) |
| **Amanah** | Islamic principle of trustworthiness and fulfilling obligations |
| **Thoyyib** | Islamic concept of purity and goodness (especially in food) |
| **Maqasid Al-Shariah** | The higher objectives of Islamic law |

---

*Network: Base Sepolia Testnet (Chain ID: 84532)*
