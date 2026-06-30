# Product

## Register

product

## Users

Three distinct user types:
- **Konsumen UMKM** (mass market): scan QR di kemasan produk, verify status halal tanpa wallet, tanpa setup. Mobile-first, sering dalam konteks belanja (lighting campuran, satu tangan).
- **Produsen UMKM**: mendaftarkan batch produk via dashboard, butuh koneksi wallet, bisa di laptop atau HP. Workflow tiga langkah, tidak familier dengan blockchain.
- **Auditor Halal**: profesional bersertifikat, review dokumen IPFS, approve/reject batch. Biasanya di desktop, workflow data-heavy, butuh kejelasan dan akurasi tinggi.

## Product Purpose

HalalChain adalah sistem verifikasi halal berbasis blockchain yang menggantikan sertifikat kertas dengan catatan on-chain yang tidak bisa dipalsukan. Produsen mendaftarkan batch, auditor memverifikasi, konsumen scan QR dan melihat status real-time. Sukses = konsumen percaya pada status halal tanpa perlu memercayai pihak ketiga tunggal.

## Brand Personality

Amanah (trustworthy), Jernih (clear, transparent), Tegas (authoritative without being cold)

Anti-vibes: startup-SaaS biru generik, web3 dark-mode neon, fintech biru-emas klise, dashboard abu-abu membosankan.

References:
- **Stripe** — kejelasan dokumen, whitespace yang disengaja, kepercayaan tanpa ornamen
- **Linear** — presisi produk, motion yang deliberately intentional, tidak ada glitter
- **Apple.com** — hero visual yang kuat, trust melalui restraint bukan dekorasi

Anti-references:
- Dashboard klise SaaS (hero metric template, identical card grids)
- Web3 dark-mode penuh neon dan gradient text
- "Halal green" yang terlalu literal dan murah

## Design Principles

1. **Kepercayaan dibangun dari kejelasan** — setiap status, setiap angka harus terbaca dalam 2 detik. Jangan sembunyikan informasi di balik layer visual.
2. **Motion melayani kepercayaan** — animasi bukan dekorasi. Setiap transisi mengkomunikasikan bahwa sistem sedang bekerja, bukan hanya bergerak.
3. **Mobile-first untuk konsumen, data-dense untuk operator** — verify page dioptimalkan untuk satu tangan, producer/auditor mengakomodasi workflow panjang.
4. **Brand dibawa oleh primary color, bukan background** — surface putih bersih. Emerald/green yang dalam sebagai identity carrier.
5. **Robot guide adalah guide, bukan hiburan** — karakter 3D harus meningkatkan onboarding, bukan mengalihkan perhatian dari tugas utama.

## Accessibility & Inclusion

- WCAG AA minimum, target AAA untuk teks utama
- `prefers-reduced-motion` wajib di semua animasi
- Kontras minimum 4.5:1 untuk body text, 7:1 untuk teks kritis (status halal)
- Bahasa bilingual ID/EN, tidak ada content yang hilang saat switch
