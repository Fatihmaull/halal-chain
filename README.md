# HalalChain

**Open, verifiable halal batch traceability** powered by smart contracts + IPFS.

---

## Ringkasan

HalalChain menjawab ketidakpercayaan terhadap sertifikasi halal dengan sistem di mana:

- **Produsen** mendaftarkan batch produk dan mengunggah dokumen pendukung ke IPFS
- **Auditor** memverifikasi (atau menolak) dan mencatat hasil audit secara permanen di blockchain
- **Konsumen** memindai QR Code dan melihat status batch secara read-only — tanpa wallet, tanpa aplikasi khusus

Infrastruktur di **Base Network** (Ethereum L2), dengan penyimpanan dokumen di **IPFS via Pinata**.

---

## Arsitektur

```
Konsumen          →  QR Code  →  Halaman verifikasi (read-only, tanpa wallet)
Auditor           →  Dashboard  →  verifyBatch() / rejectBatch() / revokeBatch()
Produsen UMKM     →  Dashboard  →  registerBatch() + upload IPFS + QR
                         ↓
              Base Sepolia / Hardhat local (HalalChain.sol + OpenZeppelin RBAC)
                         ↓
              IPFS / Pinata (dokumen & laporan audit)
```

| Lapisan | Teknologi |
|---|---|
| Blockchain | Solidity ^0.8.20, OpenZeppelin AccessControl, Base Sepolia |
| Frontend | Next.js 16, Wagmi v3, Viem, Tailwind |
| Storage | IPFS via Pinata (mock CID fallback tanpa JWT) |
| Deploy | Hardhat, Vercel (frontend) |

---

## Fitur v1

- OpenZeppelin RBAC (`PRODUCER_ROLE`, `AUDITOR_ROLE`, `DEFAULT_ADMIN_ROLE`)
- Batch revision setelah rejection (`registerRevision` + `parentBatchId`)
- IPFS upload via API route (`POST /api/ipfs/upload`)
- QR code generation untuk kemasan produk
- Halaman verifikasi bilingual (EN/ID) dengan 5 status
- Auditor pending queue + revoke verified batches

---

## Struktur repo

```
contracts/          Hardhat 3 + HalalChain.sol + tests
web/                Next.js app (producer, auditor, verify)
docs/               BASELINE.md, EVALUATION.md
HalalChain_PRD_v1.0.md
```

---

## Jalankan lokal

**1) Smart contract**

```bash
cd contracts
npm install
npm test
npm run node          # terminal 1
npm run deploy:local  # terminal 2 — copy contract address
```

**2) Web**

```bash
cd web
npm install
copy .env.example .env.local
# Set NEXT_PUBLIC_HALALCHAIN_ADDRESS=<address dari deploy>
npm run dev
```

Halaman: `/verify/1` · `/producer` · `/auditor`

Lihat [`docs/BASELINE.md`](docs/BASELINE.md) untuk alamat wallet Hardhat default.

---

## Deploy Testnet

**Ethereum Sepolia** (if you already have Sepolia ETH): [docs/ETH_SEPOLIA_SETUP.md](docs/ETH_SEPOLIA_SETUP.md)

```bash
cd contracts
copy .env.example .env
npm run preflight:eth-sepolia
npm run deploy:eth-sepolia
npm run evaluate:gas:eth-sepolia
```

One-command pipeline: `powershell -File scripts/run-eth-sepolia-pipeline.ps1`

**Base Sepolia** (L2 paper target): [docs/BASE_SEPOLIA_SETUP.md](docs/BASE_SEPOLIA_SETUP.md) — `npm run deploy:base-sepolia`

---

## Dokumentasi

| Dokumen | Isi |
|---------|-----|
| [`docs/BASELINE.md`](docs/BASELINE.md) | Setup lokal + wallet addresses |
| [`docs/EVALUATION.md`](docs/EVALUATION.md) | Skenario evaluasi + metrik untuk paper |
| [`docs/EVALUATION_RESULTS.md`](docs/EVALUATION_RESULTS.md) | Hasil evaluasi gas (localhost dev; Sepolia pending) |
| [`paper/`](paper/) | IEEEtran LaTeX paper — build with `make pdf` |

---

## Prinsip Islami dalam Desain

| Prinsip | Implementasi |
|---|---|
| **Amanah** | Catatan on-chain tidak dapat diubah setelah ditulis |
| **Adl** | Tidak ada otoritas tunggal yang mengontrol data (public chain) |
| **Thoyyib** | Hanya batch terverifikasi auditor yang berstatus halal |
| **Hisba** | Identitas auditor dan cap waktu tercatat permanen |
