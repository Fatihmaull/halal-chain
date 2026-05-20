# HalalChain

**Protokol transparansi rantai pasok halal berbasis blockchain** untuk konsumen dan UMKM di Jawa Barat.

Proyek ini dikembangkan oleh **Kelompok KKN Tematik HalalChain**, Program Studi Teknik Informatika, Fakultas Sains dan Teknologi, **UIN Sunan Gunung Djati Bandung** — dalam rangka pengabdian masyarakat, riset (IICYMS 2026), dan implementasi teknologi yang mengangkat prinsip *Amanah* dalam ekosistem halal Indonesia.

---

## Ringkasan

HalalChain menjawab ketidakpercayaan terhadap sertifikasi halal dengan sistem di mana:

- **Produsen (UMKM)** mendaftarkan batch produk dan mengunggah dokumen pendukung ke IPFS
- **Auditor (MUI/BPJPH)** memverifikasi dan mencatat hasil sertifikasi secara permanen di blockchain
- **Konsumen** memindai QR Code pada kemasan dan melihat status halal terverifikasi — tanpa wallet, tanpa aplikasi khusus

Infrastruktur direncanakan di **Base Network** (Ethereum L2), dengan penyimpanan dokumen di **IPFS via Pinata**.

---

## Isi Repository

| File / Folder | Deskripsi |
|---|---|
| [`Proposal_KKN_Tematik_HalalChain_UIN_Bandung.md`](Proposal_KKN_Tematik_HalalChain_UIN_Bandung.md) | Proposal KKN Tematik (sumber Markdown) |
| [`Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf`](Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf) | PDF proposal siap diajukan ke LP2M (~26 halaman) |
| [`HalalChain_PRD_v1.0.md`](HalalChain_PRD_v1.0.md) | Product Requirements Document v1.0 (spesifikasi teknis & roadmap 8 minggu) |
| [`pdf-build/`](pdf-build/) | Pipeline untuk generate ulang PDF proposal dari Markdown |

---

## Generate PDF Proposal

PDF proposal dapat di-regenerate kapan saja setelah mengedit file Markdown.

**Prasyarat:** Node.js 18+, Google Chrome atau Microsoft Edge, koneksi internet (Google Fonts).

```bash
cd pdf-build
npm install
node build.mjs
```

Output: `Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf` di root repository.

Detail kustomisasi (cover, warna, header/footer): lihat [`pdf-build/README.md`](pdf-build/README.md).

---

## Arsitektur (Rencana v1.0)

```
Konsumen          →  QR Code  →  Halaman verifikasi (read-only, tanpa wallet)
Auditor MUI       →  Dashboard  →  verifyBatch() / rejectBatch()
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

Implementasi aplikasi dan smart contract akan ditambahkan pada fase pengembangan KKN (minggu 1–8).

---

## Prinsip Islami dalam Desain

| Prinsip | Implementasi |
|---|---|
| **Amanah** | Catatan on-chain tidak dapat diubah setelah ditulis |
| **Adl** | Tidak ada otoritas tunggal yang mengontrol data |
| **Thoyyib** | Hanya batch terverifikasi auditor yang berstatus halal |
| **Hisba** | Identitas auditor dan cap waktu tercatat permanen |

---

## Tim

| Peran | Nama |
|---|---|
| Ketua Kelompok | Muhammad Fatih Maulana |
| Lead Developer & Blockchain | *(anggota 2)* |
| Frontend Developer | *(anggota 3)* |
| Backend & IPFS | *(anggota 4)* |
| UI/UX & Komunitas | *(anggota 5)* |
| Dokumentasi & Akademik | *(anggota 6)* |

**Dosen Pembimbing Lapangan:** Pak Wisnu, M.Kom.

---

## Lisensi & Status

Repository ini berisi dokumen akademik dan tooling internal tim KKN. Status pengembangan aplikasi: **fase dokumentasi & proposal** — kode smart contract dan frontend mengikuti roadmap di [`HalalChain_PRD_v1.0.md`](HalalChain_PRD_v1.0.md).

---

<p align="center">
  <em>Wahyu Memandu Ilmu — UIN Sunan Gunung Djati Bandung</em><br>
  <strong>HalalChain · 2026</strong>
</p>
