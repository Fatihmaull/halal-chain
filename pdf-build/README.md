# Build PDF Proposal KKN HalalChain

Pipeline yang merender [`Proposal_KKN_Tematik_HalalChain_UIN_Bandung.md`](../Proposal_KKN_Tematik_HalalChain_UIN_Bandung.md) menjadi PDF berkualitas submission LP2M UIN Sunan Gunung Djati Bandung.

## Output

File akhir: [`../Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf`](../Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf)

- Format: A4 portrait, 26 halaman, ~1 MB
- Cover page custom (kop UIN + ornamen geometric Islamic + judul + info box)
- Daftar Isi otomatis dengan nomor halaman + dotted leaders
- Header tiap halaman: `PROPOSAL KKN TEMATIK · HALALCHAIN` (kiri) + `UIN Sunan Gunung Djati Bandung` (kanan)
- Footer tiap halaman: `HalalChain · UIN SGD Bandung` (kiri) + `Halaman X dari Y` (kanan)
- Page breaks otomatis sebelum setiap bab (I–VIII + Lampiran)
- Teks Arab ayat Al-Quran ter-render dengan font Amiri/Noto Naskh Arabic RTL

## Prasyarat

- **Node.js** versi 18+ (tested di v22)
- **Google Chrome** atau **Microsoft Edge** terinstall di lokasi standar Windows
  (`C:\Program Files\Google\Chrome\Application\chrome.exe` atau
  `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`)
- Koneksi internet (untuk download Google Fonts saat render pertama)

## Cara Regenerate PDF

```bash
cd pdf-build
npm install      # cukup sekali
node build.mjs   # render PDF; output: ../Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf
```

Build memakan waktu ~5–10 detik. PDF langsung muncul di root folder workspace.

## Struktur File

```
pdf-build/
├── build.mjs           Script utama (Puppeteer + markdown-it pipeline)
├── snapshot.mjs        Tool inspeksi visual (opsional, generate PNG ke snapshots/)
├── template.html       Wrapper HTML: cover page + slot TOC + slot content
├── styles.css          Stylesheet akademik (halal-green/gold + Inter/Crimson/Amiri)
├── package.json        Dependency manifest
├── README.md           File ini
├── snapshots/          (Auto-generated) PNG inspection points dari pipeline
└── debug.rendered.html (Opsional) Dump HTML lengkap, di-generate ketika DUMP_HTML=1
```

## Kustomisasi

### Mengubah Konten Proposal

Edit langsung [`../Proposal_KKN_Tematik_HalalChain_UIN_Bandung.md`](../Proposal_KKN_Tematik_HalalChain_UIN_Bandung.md), kemudian jalankan `node build.mjs`.

Pipeline secara otomatis:

1. Strip blok cover lama (sebelum `## LEMBAR PENGESAHAN`) — tidak di-render karena sudah ada cover custom
2. Strip blok `## DAFTAR ISI` lama — tidak di-render karena TOC auto-generated
3. Render isi mulai dari `## LEMBAR PENGESAHAN` sampai akhir dokumen

### Mengubah Warna / Typography

Edit [`styles.css`](./styles.css) — semua token warna ada di `:root`:

```css
--halal-green: #1A7A4A;
--halal-gold:  #C8A84B;
--ink:         #111827;
```

Font import ada di [`template.html`](./template.html) `<head>` (Google Fonts CDN).

### Mengubah Cover Page

Edit `<section class="cover-page">` di [`template.html`](./template.html). Slot logo SVG (ornamen geometric Islamic) bisa diganti dengan logo UIN asli — tinggal ganti `<svg>...</svg>` dengan `<img src="assets/uin-logo.png">` dan letakkan file logo di `pdf-build/assets/uin-logo.png`.

### Mengubah Header / Footer

Edit konstanta `HEADER_TEMPLATE` dan `FOOTER_TEMPLATE` di [`build.mjs`](./build.mjs). Gunakan CSS inline (Puppeteer tidak mendukung stylesheet eksternal di template ini). Variabel khusus yang bisa dipakai: `<span class="pageNumber"></span>`, `<span class="totalPages"></span>`, `<span class="date"></span>`, `<span class="title"></span>`.

## Debugging

### Inspeksi visual cepat

```bash
node snapshot.mjs
```

Generate PNG ke `snapshots/` untuk cek visual elemen kunci:

- `01-cover.png` — cover page
- `02-toc.png` — daftar isi
- `03-lembar.png` — lembar pengesahan
- `04-table.png` — tabel pertama
- `05-ascii.png` — diagram ASCII pertama
- `06-arabic.png` — blockquote dengan teks Arab
- `07-stakeholder.png` — stakeholder map ASCII
- `08-gantt.png` — Gantt chart visualisasi
- `09-anggaran.png` — tabel anggaran lengkap

### Dump HTML perantara

```bash
$env:DUMP_HTML="1"; node build.mjs   # PowerShell
DUMP_HTML=1 node build.mjs            # Bash
```

Akan menulis `debug.rendered.html` (HTML lengkap setelah inject TOC + content) untuk diperiksa di browser atau text editor.

### Browser tidak ditemukan

Jika error `Tidak menemukan Chrome atau Edge`, edit array `chromeCandidates` di [`build.mjs`](./build.mjs) dengan path browser yang ada di mesin Anda.

## Catatan Teknis

- Pipeline pakai `puppeteer-core` (bukan `puppeteer`) untuk skip download Chromium 170 MB — kita pakai Chrome/Edge yang sudah terinstall di sistem.
- Page numbering di TOC dihitung secara terprogram berdasarkan posisi DOM heading + simulasi page break (CSS `break-before: page` di setiap H2). Untuk perubahan struktur dokumen yang besar, page numbering mungkin perlu sedikit toleransi ±1.
- Margin halaman: top 20mm, bottom 16mm, kiri 30mm, kanan 25mm (mendekati standar proposal akademik Indonesia).
- File yang aman di-commit ke git: `build.mjs`, `snapshot.mjs`, `template.html`, `styles.css`, `package.json`, `package-lock.json`, `README.md`. File yang sebaiknya di-gitignore: `node_modules/`, `snapshots/`, `debug.rendered.html`.

---

*Dibuat untuk Kelompok KKN Tematik HalalChain — UIN Sunan Gunung Djati Bandung*
