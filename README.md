# HalalChain

**Open, verifiable halal batch traceability** powered by smart contracts + IPFS.

---

## Ringkasan

HalalChain menjawab ketidakpercayaan terhadap sertifikasi halal dengan sistem di mana:

- **Produsen** mendaftarkan batch produk dan mengunggah dokumen pendukung ke IPFS
- **Auditor** memverifikasi (atau menolak) dan mencatat hasil audit secara permanen di blockchain
- **Konsumen** memindai QR Code dan melihat status batch secara read-only — tanpa wallet, tanpa aplikasi khusus

Infrastruktur direncanakan di **Base Network** (Ethereum L2), dengan penyimpanan dokumen di **IPFS via Pinata**.

---

## Arsitektur (Rencana v1.0)

```
Konsumen          →  QR Code  →  Halaman verifikasi (read-only, tanpa wallet)
Auditor           →  Dashboard  →  verifyBatch() / rejectBatch()
Produsen UMKM     →  Dashboard  →  registerBatch() + upload IPFS
                         ↓
              Base Sepolia (smart contract HalalChain.sol)
                         ↓
              IPFS / Pinata (dokumen & laporan audit)
```

**Stack yang direncanakan** (lihat PRD):

| Lapisan | Teknologi |
|---|---|
| Blockchain | Solidity ^0.8.20, OpenZeppelin, Base Sepolia |
| Frontend | Next.js 14, Wagmi v2, Viem |
| Storage | IPFS via Pinata |
| Deploy | Hardhat, Vercel (frontend) |

---

## Prinsip Islami dalam Desain

| Prinsip | Implementasi |
|---|---|
| **Amanah** | Catatan on-chain tidak dapat diubah setelah ditulis |
| **Adl** | Tidak ada otoritas tunggal yang mengontrol data |
| **Thoyyib** | Hanya batch terverifikasi auditor yang berstatus halal |
| **Hisba** | Identitas auditor dan cap waktu tercatat permanen |

---

## Prototype (kode) – Contracts + Web

Folder baru yang ditambahkan:

- `contracts/`: Hardhat 3 + Solidity (smart contract `HalalChain.sol`)
- `web/`: Next.js (App Router) + Tailwind + Wagmi (dashboard + halaman verifikasi)

### Jalankan lokal (Hardhat + Next.js)

**1) Smart contract**

```bash
cd contracts
npm install
npm run build
npm test
```

Start node lokal + deploy:

```bash
cd contracts
npm run node
```

Di terminal lain:

```bash
cd contracts
npm run deploy:local
```

Copy address kontrak yang tercetak (mis. `0x...`).

**2) Web (Next.js)**

```bash
cd web
npm install
copy .env.example .env.local
```

Edit `web/.env.local` lalu isi:

- `NEXT_PUBLIC_HALALCHAIN_ADDRESS=<address hasil deploy>`

Jalankan:

```bash
cd web
npm run dev
```

Halaman:

- `/verify/1` (konsumen, read-only)
- `/producer` (register batch)
- `/auditor` (verify/reject batch)
