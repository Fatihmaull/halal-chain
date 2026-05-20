# PROPOSAL KKN TEMATIK
## PROGRAM KULIAH KERJA NYATA TEMATIK
### LEMBAGA PENELITIAN DAN PENGABDIAN KEPADA MASYARAKAT (LP2M)
### UIN SUNAN GUNUNG DJATI BANDUNG
### TAHUN AKADEMIK 2025/2026

---

<div align="center">

# HALALCHAIN:
## IMPLEMENTASI PROTOKOL TRANSPARANSI RANTAI PASOK HALAL BERBASIS BLOCKCHAIN UNTUK KONSUMEN DAN UMKM DI JAWA BARAT

---

**Diajukan Oleh:**
**Kelompok KKN Tematik HalalChain**
**Fakultas Sains dan Teknologi — Program Studi Teknik Informatika**
**UIN Sunan Gunung Djati Bandung**

</div>

---

## LEMBAR PENGESAHAN

| | |
|---|---|
| **Judul Proposal** | HalalChain: Implementasi Protokol Transparansi Rantai Pasok Halal Berbasis Blockchain untuk Konsumen dan UMKM di Jawa Barat |
| **Program** | KKN Tematik LP2M UIN Sunan Gunung Djati Bandung |
| **Lokasi Pelaksanaan** | Kabupaten/Kota di Jawa Barat (Fokus: Bandung Raya & sekitarnya) |
| **Durasi Pelaksanaan** | 8 Minggu (2 Bulan) |
| **Total Anggota** | 6 Orang |
| **Sumber Dana** | Swadaya Mahasiswa + Dana KKN LP2M |

---

### Tim Pelaksana

| No. | Nama | NIM | Peran |
|---|---|---|---|
| 1 | Muhammad Fatih Maulana | — | Ketua Kelompok |
| 2 | [Nama Anggota 2] | — | Lead Developer & Blockchain Engineer |
| 3 | [Nama Anggota 3] | — | Frontend Developer |
| 4 | [Nama Anggota 4] | — | Backend & IPFS Integration |
| 5 | [Nama Anggota 5] | — | UI/UX & Community Liaison |
| 6 | [Nama Anggota 6] | — | Dokumentasi & Akademik |

---

### Persetujuan dan Pengesahan

Proposal ini telah diperiksa, disetujui, dan disahkan oleh pihak-pihak yang bertanggung jawab.

---

**Bandung, __________ 2025**

<br>

| | | |
|---|---|---|
| **Ketua Kelompok KKN** | **Dosen Pembimbing Lapangan (DPL)** | **Kepala LP2M** |
| | | |
| | | |
| | | |
| *(Muhammad Fatih Maulana)* | *(Pak Wisnu, M.Kom.)* | *(Pak Aep, ...)* |
| NIM: ____________ | NIP: ____________ | NIP: ____________ |

---
---

## DAFTAR ISI

```
I.    PENDAHULUAN ............................................................. 1
      1.1  Latar Belakang
      1.2  Urgensi Jaminan Halal di Era Digital
      1.3  Peran Strategis UIN Sunan Gunung Djati Bandung

II.   PERMASALAHAN MASYARAKAT ................................................. 2
      2.1  Identifikasi Masalah Utama
      2.2  Problematika UMKM Halal
      2.3  Kesenjangan Kepercayaan Konsumen Muslim

III.  SOLUSI INOVATIF — HALALCHAIN ............................................ 3
      3.1  Konsep Dasar: Jembatan Digital Kepercayaan
      3.2  Cara Kerja HalalChain (Non-Teknis)
      3.3  Teknologi yang Digunakan dan Relevansinya
      3.4  Prinsip Islami dalam Desain Sistem

IV.   DAMPAK DAN MANFAAT ...................................................... 4
      4.1  Manfaat bagi Konsumen Muslim
      4.2  Manfaat bagi UMKM
      4.3  Manfaat bagi Lembaga Sertifikasi (MUI/BPJPH)
      4.4  Manfaat bagi UIN Sunan Gunung Djati Bandung

V.    RENCANA IMPLEMENTASI DAN STRATEGI GO-TO-MARKET ......................... 5
      5.1  Peta Pemangku Kepentingan
      5.2  Kolaborasi Strategis
      5.3  Target Lokasi dan Komunitas Sasaran
      5.4  Strategi Sosialisasi dan Literasi Digital

VI.   TIMELINE PELAKSANAAN (8 MINGGU) ........................................ 6

VII.  ANGGARAN BIAYA KEGIATAN ................................................ 7

VIII. PENUTUP ................................................................ 8
      8.1  Kesimpulan
      8.2  Kontribusi terhadap Tri Dharma Perguruan Tinggi
      8.3  Pernyataan Komitmen
```

---

## I. PENDAHULUAN

### 1.1 Latar Belakang

Bangsa Indonesia merupakan negara dengan populasi Muslim terbesar di dunia, dengan lebih dari **240 juta jiwa** atau sekitar 87% dari total penduduk yang menganut agama Islam. Dalam kehidupan sehari-hari, keyakinan ini tercermin dalam salah satu kewajiban fundamental seorang Muslim: memastikan bahwa setiap makanan dan produk yang dikonsumsi adalah **halalan thoyyiban** — halal dalam sumber dan prosesnya, serta baik dan bermanfaat bagi jiwa dan raga.

Allah SWT berfirman dalam Al-Qur'an Surah Al-Baqarah ayat 168:

> **"يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا"**
>
> *"Wahai manusia! Makanlah dari (makanan) yang halal dan baik yang terdapat di bumi..."*

Ayat ini bukan sekadar anjuran spiritual, melainkan sebuah **kewajiban syar'i** yang menuntut adanya sistem verifikasi yang dapat dipercaya. Di sinilah letak urgensi yang sesungguhnya: di tengah perkembangan ekonomi digital yang pesat, sistem verifikasi halal yang ada saat ini masih bertumpu pada dokumen fisik yang rentan pemalsuan, database terpusat yang dapat dimanipulasi, dan label QR yang tidak dapat diverifikasi kebenarannya secara mandiri oleh konsumen.

Industri halal global diproyeksikan mencapai nilai **USD 3,2 triliun pada tahun 2027** (DinarStandard Global Islamic Economy Report, 2023), dengan Indonesia sebagai salah satu pasar terbesar. Namun ironisnya, di tengah potensi ekonomi yang luar biasa ini, kepercayaan konsumen terhadap integritas sertifikasi halal justru mengalami erosi yang signifikan. Survei Badan Penyelenggara Jaminan Produk Halal (BPJPH) tahun 2022 mencatat bahwa masih terdapat **ribuan produk beredar tanpa sertifikasi halal yang valid**, sementara temuan LPPOM MUI mengindikasikan adanya praktik pemalsuan dokumen sertifikasi di sejumlah daerah.

Dalam konteks inilah, mahasiswa Prodi Teknik Informatika UIN Sunan Gunung Djati Bandung hadir bukan sekadar sebagai pelajar teknologi, tetapi sebagai **khairu ummah** — generasi terbaik yang mengintegrasikan kecerdasan intelektual dengan tanggung jawab keumatan. Melalui program KKN Tematik ini, kami mempersembahkan **HalalChain**: sebuah inovasi teknologi digital yang dirancang untuk memulihkan kepercayaan (*Amanah*) dalam ekosistem halal Indonesia.

### 1.2 Urgensi Jaminan Halal di Era Digital

Era Industri 4.0 telah mengubah cara masyarakat berinteraksi dengan produk dan layanan secara fundamental. Konsumen masa kini tidak lagi puas dengan sekadar melihat label halal pada kemasan — mereka ingin **memverifikasi sendiri**, **saat itu juga**, dan **tanpa perlu mempercayai siapapun secara membabi buta**. Fenomena ini dikenal sebagai *trustless verification* atau verifikasi tanpa ketergantungan pada otoritas tunggal.

Namun, sistem yang ada saat ini belum mampu memenuhi kebutuhan ini. Beberapa permasalahan kritikal yang telah teridentifikasi antara lain:

Pertama, **database sertifikasi halal yang terpusat** rentan terhadap manipulasi data oleh oknum yang tidak bertanggung jawab. Ketika data disimpan di satu server yang dikontrol oleh satu pihak, integritas data sepenuhnya bergantung pada kejujuran pihak tersebut — sebuah ketergantungan yang bertentangan dengan prinsip *Amanah* dalam Islam.

Kedua, **sertifikat halal fisik** dengan mudah dipalsukan menggunakan teknologi percetakan modern, sehingga logo halal yang tercetak pada kemasan tidak lagi menjadi jaminan yang andal bagi konsumen yang kritis.

Ketiga, **rantai pasok yang panjang dan kompleks** — mulai dari petani/peternak, pengolah, distributor, hingga pengecer — menciptakan banyak titik lemah di mana kontaminasi atau pengaburan informasi dapat terjadi, bahkan setelah sertifikasi awal diperoleh.

### 1.3 Peran Strategis UIN Sunan Gunung Djati Bandung

Sebagai universitas Islam negeri dengan visi *"Wahyu Memandu Ilmu"*, UIN Sunan Gunung Djati Bandung memiliki posisi yang unik dan strategis: institusi ini tidak hanya mencetak ilmuwan, tetapi juga membentuk insan yang mampu mengintegrasikan ilmu pengetahuan modern dengan nilai-nilai keislaman.

Proyek HalalChain merupakan wujud konkret dari visi tersebut. Inilah **pertama kalinya** mahasiswa Prodi Teknik Informatika UIN Sunan Gunung Djati Bandung mengembangkan sebuah protokol teknologi digital berbasis *blockchain* yang secara khusus dirancang untuk menjawab persoalan keumatan yang nyata. Ini bukan sekadar tugas kuliah — ini adalah **kontribusi nyata generasi muda Muslim untuk kemajuan ekosistem halal Indonesia**, sekaligus bukti bahwa mahasiswa UIN mampu bersaing dan berinovasi di level internasional.

---

## II. PERMASALAHAN MASYARAKAT

### 2.1 Identifikasi Masalah Utama

Berdasarkan observasi lapangan dan studi literatur yang telah dilakukan oleh tim, terdapat tiga akar permasalahan utama dalam ekosistem sertifikasi halal di Indonesia yang saling berkaitan:

```
┌─────────────────────────────────────────────────────────┐
│              AKAR PERMASALAHAN EKOSISTEM HALAL           │
│                                                          │
│  MASALAH 1          MASALAH 2           MASALAH 3        │
│  ──────────         ──────────          ──────────        │
│  Ketiadaan          Kerentanan          Kesenjangan       │
│  Transparansi  →    Pemalsuan     →     Kepercayaan       │
│  Rantai Pasok       Dokumen             Konsumen          │
│                                                          │
│                    ▼ DAMPAK ▼                            │
│                                                          │
│       Melemahnya integritas Halalan Thoyyiban             │
│       dalam kehidupan umat Muslim Indonesia              │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Problematika UMKM Halal di Jawa Barat

Usaha Mikro, Kecil, dan Menengah (UMKM) merupakan tulang punggung ekonomi Indonesia, menyumbang lebih dari **60% Produk Domestik Bruto** nasional. Di Jawa Barat khususnya, terdapat lebih dari **1,6 juta unit UMKM** yang bergerak di sektor pangan dan produk konsumsi (Dinas Koperasi dan UMKM Jawa Barat, 2023). Namun, UMKM menghadapi sejumlah hambatan struktural yang serius dalam proses sertifikasi halal:

**a. Hambatan Administratif dan Birokrasi**

Proses sertifikasi halal melalui BPJPH membutuhkan rangkaian dokumen yang kompleks, mulai dari daftar bahan baku, alur produksi, hingga hasil uji laboratorium. Bagi pelaku UMKM yang memiliki keterbatasan sumber daya manusia administratif, proses ini seringkali terasa seperti gunung yang terlalu tinggi untuk didaki. Akibatnya, banyak produk UMKM halal yang berkualitas tidak mendapatkan sertifikasi resmi semata-mata karena hambatan prosedural.

**b. Ketidakmampuan Membuktikan Integritas Produk Secara Mandiri**

Bahkan setelah mendapatkan sertifikat, UMKM tidak memiliki mekanisme yang efektif untuk membuktikan kepada konsumen bahwa sertifikat tersebut otentik dan masih berlaku. Sertifikat fisik yang dipajang di toko mudah dipalsukan. QR Code pada kemasan sering kali hanya mengarah ke halaman web statis yang tidak dapat diverifikasi kebenarannya. Ketidakmampuan ini menciptakan **kesenjangan kepercayaan** yang merugikan UMKM jujur dan justru menguntungkan pihak-pihak yang tidak berintegritas.

**c. Minimnya Infrastruktur Digital untuk Audit Halal**

Audit halal pasca-sertifikasi yang dilakukan oleh MUI atau BPJPH masih sangat bergantung pada kunjungan fisik dan dokumen kertas. Tidak ada sistem digital terpadu yang memungkinkan auditor untuk mencatat, menyimpan, dan membagikan hasil audit mereka secara transparan dan permanen. Hal ini menciptakan celah di mana data dapat diubah, disembunyikan, atau hilang.

**d. Keterbatasan Akses ke Pasar Global**

Pasar halal global semakin meminta *supply chain transparency* — keterbukaan mengenai asal-usul bahan baku hingga proses produksi — sebagai syarat masuk. Standar internasional seperti Gulf Cooperation Council (GCC) Halal Standard dan Codex Alimentarius semakin mensyaratkan *traceability* yang terdigitalisasi. UMKM Indonesia, termasuk di Jawa Barat, belum memiliki infrastruktur untuk memenuhi standar ini.

### 2.3 Kesenjangan Kepercayaan Konsumen Muslim

Di sisi konsumen, permasalahan yang muncul tidak kalah seriusnya. Generasi Muslim milenial dan Gen-Z yang tumbuh dalam ekosistem digital memiliki ekspektasi yang berbeda dari generasi sebelumnya. Mereka tidak cukup puas dengan kepercayaan berbasis otoritas (*trust by authority*) — mereka menginginkan kepercayaan berbasis bukti yang dapat diverifikasi sendiri (*trust by verification*).

Fenomena ini diperkuat oleh sejumlah kasus yang sempat mengemuka di media sosial, di mana produk berlabel halal ternyata mengandung bahan yang diragukan kehalalannya. Kasus-kasus ini, walaupun jumlahnya relatif kecil dibandingkan total produk tersertifikasi, menimbulkan **efek ketidakpercayaan yang jauh lebih besar** dan menyebar secara masif melalui media sosial. Akibatnya, bahkan produk halal yang benar-benar telah melalui proses sertifikasi yang ketat pun ikut terseret dalam arus kecurigaan publik.

Dengan demikian, permasalahan yang hendak diselesaikan oleh HalalChain dapat dirumuskan dalam satu kalimat: **Bagaimana kita dapat membangun sistem yang memungkinkan siapa saja — tanpa harus mempercayai satu pihak tertentu — untuk memverifikasi keaslian dan integritas sertifikasi halal sebuah produk, kapan saja dan di mana saja?**

---

## III. SOLUSI INOVATIF — HALALCHAIN

### 3.1 Konsep Dasar: Jembatan Digital Kepercayaan

**HalalChain** adalah sebuah **protokol transparansi rantai pasok halal yang terdesentralisasi** — sistem pencatatan digital yang dirancang sedemikian rupa sehingga **tidak ada satu pihak pun yang dapat mengubah atau menghapus catatan yang telah dibuat**. Bayangkan sebuah buku besar (*ledger*) yang salinannya tersebar di ribuan komputer di seluruh dunia secara bersamaan: untuk memalsukan satu catatan, seseorang harus memalsukan salinan di semua komputer tersebut secara serentak — sebuah kemustahilan praktis.

Inilah esensi dari teknologi yang kami gunakan, yang dalam dunia teknologi dikenal sebagai *blockchain*. Namun bagi kepentingan proposal ini dan masyarakat yang kami layani, pemahaman yang perlu ditanamkan adalah **manfaatnya**, bukan kerumitan teknisnya: HalalChain adalah **"notaris digital yang tidak bisa disuap"** untuk sertifikasi halal.

### 3.2 Cara Kerja HalalChain (Non-Teknis)

Untuk memudahkan pemahaman, berikut adalah ilustrasi alur kerja HalalChain dalam bahasa yang sederhana:

**Langkah 1 — Produsen Mendaftarkan Produk:**

Seorang pemilik UMKM, misalnya Pak Hasan yang memproduksi rendang ayam halal di Bandung, mendaftarkan batch produksinya ke dalam sistem HalalChain melalui sebuah aplikasi web yang mudah digunakan. Ia mengunggah dokumen-dokumen pendukung seperti daftar bahan baku, hasil uji laboratorium, dan foto fasilitas produksi. Sistem menyimpan dokumen-dokumen ini di dalam **gudang digital yang tidak dapat dimanipulasi** (IPFS), dan mencatat *sidik jari digital* dari dokumen-dokumen tersebut ke dalam **buku besar global yang permanen** (Base Network blockchain).

**Langkah 2 — Auditor MUI Melakukan Verifikasi:**

Auditor halal yang telah ditetapkan oleh MUI/BPJPH dapat mengakses dokumen-dokumen tersebut, melakukan kunjungan lapangan, dan kemudian **mencatat hasil keputusannya** — apakah produk tersebut dinyatakan halal atau ditolak — langsung ke dalam sistem. Catatan ini bersifat **permanen dan tidak dapat diubah**, serta mencantumkan identitas auditor yang bertanggung jawab. Dengan demikian, akuntabilitas auditor terjamin secara sistemik.

**Langkah 3 — Konsumen Memverifikasi secara Mandiri:**

Konsumen yang membeli produk Pak Hasan di supermarket cukup **memindai QR Code** pada kemasan menggunakan kamera ponselnya. Dalam hitungan detik, layar ponselnya akan menampilkan informasi lengkap: nama produk, nama auditor yang mensertifikasi, tanggal sertifikasi, tanggal kedaluwarsa sertifikat, dan tautan ke dokumen-dokumen pendukung. **Tidak diperlukan akun, tidak diperlukan unduhan aplikasi khusus, dan tidak diperlukan pengetahuan teknologi** — cukup pindai dan lihat.

```
[PRODUSEN]                   [AUDITOR MUI]                [KONSUMEN]
    │                              │                           │
    │ 1. Daftarkan batch           │                           │
    │    + upload dokumen          │                           │
    │ ─────────────────────────►  │                           │
    │                              │ 2. Tinjau & verifikasi    │
    │                              │    (online/lapangan)      │
    │                              │                           │
    │                              │ 3. Catat hasil ke sistem  │
    │                              │    (permanen & terenkripsi│
    │                              │                           │
    │                              │              4. Pindai QR │
    │                              │    ◄──────────────────────│
    │                              │                           │
    │          ══════════════════════════════════════════      │
    │          SISTEM HALALCHAIN (Catatan Digital Permanen)    │
    │          5. Tampilkan status halal terverifikasi ────────►
```

### 3.3 Teknologi yang Digunakan dan Relevansinya

Untuk mewujudkan sistem di atas, HalalChain memanfaatkan dua infrastruktur teknologi yang saling melengkapi:

**a. Base Network — Fondasi Catatan Permanen yang Aman**

Base Network adalah sebuah jaringan pencatatan digital (*blockchain*) yang dikembangkan oleh **Coinbase**, perusahaan pertukaran aset kripto terbesar di Amerika Serikat yang telah terdaftar di bursa saham NASDAQ dan diawasi oleh regulator keuangan Amerika Serikat (SEC). Memilih Base Network berarti memilih infrastruktur yang **didukung oleh institusi keuangan global yang terpercaya dan terregulasi** — bukan sekadar proyek teknologi yang belum teruji.

Relevansi khusus Base Network untuk HalalChain:
- **Biaya operasional yang sangat rendah** (hampir gratis untuk fase pengembangan), menjadikannya solusi yang realistis bagi UMKM berskala kecil sekalipun.
- **Keamanan warisan dari jaringan Ethereum**, blockchain publik terbesar dan paling teruji di dunia, yang menjamin bahwa setiap catatan yang tersimpan tidak dapat dimanipulasi.
- **Skalabilitas untuk adopsi massal**, memungkinkan sistem ini untuk melayani jutaan produk seiring pertumbuhan ekosistem halal Indonesia.

**b. IPFS via Pinata — Gudang Dokumen Digital yang Tak Dapat Dimanipulasi**

IPFS (*InterPlanetary File System*) adalah sistem penyimpanan dokumen digital yang bekerja dengan cara yang fundamental berbeda dari sistem penyimpanan tradisional. Dalam sistem tradisional, sebuah dokumen diidentifikasi berdasarkan **lokasi** penyimpanannya (misalnya: "dokumen ini ada di server A"). Dengan IPFS, sebuah dokumen diidentifikasi berdasarkan **isinya sendiri** — sebuah *sidik jari digital* unik yang secara matematis terkait langsung dengan konten dokumen tersebut.

Implikasinya: **jika isi dokumen diubah satu huruf pun, sidik jari digitalnya akan berubah total**. Ketika sidik jari ini disimpan dalam sistem blockchain HalalChain, maka upaya pemalsuan dokumen akan langsung terdeteksi secara otomatis oleh sistem. Ini adalah mekanisme *Amanah* yang dikodekan langsung ke dalam arsitektur teknologi.

### 3.4 Prinsip Islami dalam Desain Sistem

Satu aspek yang membedakan HalalChain dari sekadar proyek teknologi biasa adalah bahwa **nilai-nilai Islam tidak hanya menjadi motivasi, tetapi secara harfiah tertanam dalam desain sistem**:

| Prinsip Islam | Implementasi dalam HalalChain |
|---|---|
| **Amanah** (Kepercayaan) | Catatan yang sekali ditulis tidak dapat diubah atau dihapus oleh siapapun |
| **Adl** (Keadilan) | Tidak ada satu pihak pun yang memiliki kontrol penuh atas sistem |
| **Ihsan** (Keunggulan) | Auditor mencantumkan identitasnya secara permanen, mendorong standar audit terbaik |
| **Thoyyib** (Kebaikan) | Hanya produk yang telah melalui verifikasi ketat yang mendapatkan status halal terverifikasi |
| **Hisba** (Akuntabilitas) | Setiap tindakan dalam sistem tercatat dengan cap waktu dan identitas pelaku yang permanen |
| **Syura** (Musyawarah) | Verifikasi membutuhkan konfirmasi dari beberapa auditor yang terotorisasi |

---

## IV. DAMPAK DAN MANFAAT

### 4.1 Manfaat bagi Konsumen Muslim

**a. Ketenangan Batin (*Tuma'ninah*) dalam Konsumsi Produk Halal**

Manfaat terdalam yang ditawarkan HalalChain bukanlah sebuah fitur teknologi, melainkan sebuah kondisi spiritual: **ketenangan batin**. Ketika seorang ibu Muslim dapat memindai kemasan makanan anaknya dan melihat dengan mata kepalanya sendiri bahwa produk tersebut telah diverifikasi oleh auditor halal yang teridentifikasi, dengan catatan yang tercatat secara permanen dan tidak dapat dimanipulasi, maka ia tidak hanya mendapatkan informasi — ia mendapatkan **kebebasan dari keraguan** (*syubhat*).

**b. Peningkatan Literasi Digital Berbasis Nilai Keislaman**

Program KKN ini tidak hanya akan meluncurkan sebuah aplikasi, tetapi juga akan menyelenggarakan **serangkaian workshop literasi digital** bagi masyarakat. Melalui pendekatan yang mengaitkan teknologi dengan nilai-nilai keislaman, kami akan membantu masyarakat memahami cara memanfaatkan teknologi digital tidak hanya untuk kepentingan ekonomi, tetapi juga untuk kepentingan ibadah sehari-hari.

**c. Pemberdayaan sebagai Konsumen yang Berdaulat**

HalalChain menggeser paradigma konsumsi dari *percaya pada otoritas* menjadi *verifikasi secara mandiri*. Ini adalah pemberdayaan nyata: konsumen tidak lagi perlu menggantungkan keputusannya semata-mata pada kepercayaan buta terhadap label atau institusi, tetapi dapat memverifikasi sendiri dengan mudah dan cepat.

### 4.2 Manfaat bagi UMKM

**a. Diferensiasi dan Keunggulan Kompetitif**

UMKM yang bergabung dengan ekosistem HalalChain secara otomatis membedakan diri dari kompetitor. Produk mereka memiliki **bukti digital yang transparan dan tidak dapat dipalsukan** — sebuah nilai jual yang semakin dicari oleh konsumen Muslim yang melek digital. Di tengah persaingan yang semakin ketat, integritas yang terverifikasi secara teknologi menjadi aset bisnis yang sangat berharga.

**b. Kemudahan Proses Audit Digital**

Dengan HalalChain, UMKM dapat mendokumentasikan seluruh proses produksi mereka secara digital dalam satu platform yang terintegrasi. Ketika auditor melakukan kunjungan, semua dokumen yang diperlukan sudah tersedia dan terorganisir secara digital. Proses audit yang biasanya memakan waktu berhari-hari dapat dipersingkat secara signifikan.

**c. Akses ke Pasar Ekspor Halal Global**

Transparansi rantai pasok (*supply chain transparency*) adalah syarat yang semakin ketat untuk memasuki pasar halal internasional, khususnya di kawasan Timur Tengah, Eropa, dan Asia Pasifik. Dengan memiliki rekam jejak digital yang terverifikasi melalui HalalChain, UMKM Jawa Barat membuka pintu menuju pasar ekspor yang selama ini tidak dapat mereka akses karena keterbatasan dokumentasi.

**d. Perlindungan dari Pemalsuan dan Persaingan Tidak Sehat**

Ketika sertifikasi halal tercatat secara permanen dan publik, pemalsuan sertifikat menjadi jauh lebih sulit untuk disembunyikan. UMKM yang jujur terlindungi dari persaingan tidak sehat oleh pihak-pihak yang menggunakan sertifikat palsu.

### 4.3 Manfaat bagi Lembaga Sertifikasi (MUI/BPJPH)

**a. Digitalisasi Proses Audit dan Dokumentasi**

HalalChain menyediakan infrastruktur digital yang memungkinkan auditor MUI/BPJPH untuk mencatat dan menyimpan hasil audit mereka secara digital, menggantikan proses berbasis kertas yang rentan terhadap kehilangan dan manipulasi.

**b. Peningkatan Kredibilitas dan Kepercayaan Publik**

Ketika proses verifikasi menjadi transparan dan dapat diaudit publik, kepercayaan masyarakat terhadap lembaga sertifikasi halal akan meningkat. Ini pada gilirannya memperkuat posisi MUI dan BPJPH sebagai pilar integritas ekonomi halal nasional.

**c. Data untuk Perencanaan Kebijakan**

Sistem HalalChain menghasilkan data analitik yang berharga: berapa banyak produk yang terdaftar, berapa yang tersertifikasi, distribusi geografis UMKM halal, dan tren sertifikasi dari waktu ke waktu. Data ini dapat menjadi basis yang kuat untuk perencanaan kebijakan halal nasional.

### 4.4 Manfaat bagi UIN Sunan Gunung Djati Bandung

Proyek HalalChain merupakan *showcase* yang kuat untuk membuktikan kompetensi dan relevansi UIN Sunan Gunung Djati Bandung di era teknologi digital. Beberapa manfaat spesifik bagi institusi:

- **Rekognisi nasional dan internasional** sebagai perguruan tinggi Islam yang mampu mengintegrasikan teknologi mutakhir dengan nilai-nilai keislaman untuk menjawab persoalan nyata umat.
- **Kontribusi pada ekosistem riset halal nasional** melalui paper akademik yang akan disubmit ke konferensi internasional (IICYMS 2026).
- **Jejaring kemitraan baru** dengan BPJPH, LPPOM MUI, dan komunitas UMKM Jawa Barat yang dapat dikembangkan menjadi kolaborasi riset dan pengabdian jangka panjang.
- **Inspirasi bagi mahasiswa lintas angkatan** bahwa ilmu teknologi yang mereka pelajari dapat dan harus dimanfaatkan untuk kemaslahatan umat.

---

## V. RENCANA IMPLEMENTASI DAN STRATEGI GO-TO-MARKET

### 5.1 Peta Pemangku Kepentingan (*Stakeholder Map*)

```
                    ┌──────────────────────────────────┐
                    │          HALALCHAIN TEAM         │
                    │    (Mahasiswa KKN UIN Bandung)   │
                    └──────────────┬───────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │  LEMBAGA FORMAL  │  │  TARGET KOMUNITAS│  │  INFRASTRUKTUR   │
   │                  │  │                  │  │  TEKNIS          │
   │ • BPJPH Pusat    │  │ • UMKM Pangan    │  │ • Base Network   │
   │ • LPPOM MUI      │  │   Jawa Barat     │  │ • IPFS/Pinata    │
   │ • Dinas UMKM     │  │ • Koperasi Halal │  │ • Vercel         │
   │   Jabar          │  │ • Komunitas      │  │ • GitHub         │
   │ • LP2M UIN       │  │   Muslim Digital │  │                  │
   └──────────────────┘  └──────────────────┘  └──────────────────┘
```

### 5.2 Kolaborasi Strategis

**a. Badan Penyelenggara Jaminan Produk Halal (BPJPH)**

BPJPH adalah lembaga pemerintah di bawah Kementerian Agama yang bertanggung jawab atas penyelenggaraan jaminan produk halal di Indonesia. Keterlibatan BPJPH dalam pilot project HalalChain sangat strategis karena:

- BPJPH memiliki kewenangan resmi untuk mensahkan proses sertifikasi halal
- Data BPJPH dapat menjadi sumber verifikasi silang untuk catatan di HalalChain
- Dukungan BPJPH akan memberikan legitimasi formal yang diperlukan untuk adopsi skala besar

*Rencana Aksi:* Tim KKN akan mengajukan surat permohonan audiensi resmi ke kantor BPJPH Jawa Barat pada minggu pertama pelaksanaan KKN, dengan agenda presentasi teknis HalalChain dan eksplorasi peluang kemitraan pilot project.

**b. LPPOM MUI (Lembaga Pengkajian Pangan, Obat-obatan, dan Kosmetik MUI)**

LPPOM MUI adalah lembaga yang paling berpengalaman dalam proses sertifikasi halal di Indonesia. Keterlibatan LPPOM MUI diperlukan terutama untuk:

- Menunjuk auditor halal bersertifikat yang akan diberikan akses ke sistem HalalChain sebagai *Auditor Role*
- Memberikan validasi akademis dan keagamaan terhadap metodologi verifikasi yang diterapkan
- Menjembatani HalalChain dengan ekosistem sertifikasi yang telah mapan

*Rencana Aksi:* Tim akan berkoordinasi dengan MUI Kota Bandung untuk mendapatkan endorsement dan identifikasi auditor halal yang berminat menjadi partisipan pilot project.

**c. Dinas Koperasi dan UMKM Provinsi Jawa Barat**

Dinas Koperasi dan UMKM Provinsi Jawa Barat memiliki akses langsung ke database dan jaringan UMKM yang tersebar di seluruh Jawa Barat. Kemitraan ini penting untuk:

- Identifikasi dan rekrutmen UMKM pilot project yang representatif
- Legitimasi program pelatihan yang akan diselenggarakan
- Jalur komunikasi yang terstruktur untuk sosialisasi HalalChain ke basis UMKM yang lebih luas

**d. Koperasi dan Asosiasi UMKM Lokal**

Pada tingkat operasional, tim KKN akan bermitra langsung dengan koperasi-koperasi UMKM di Bandung Raya, dengan fokus pada:

- **Pasar Tradisional Berbasis UMKM** (seperti Pasar Kosambi, Pasar Cicadas, dan kawasan UMKM Gedebage)
- **Komunitas Pengusaha Muslim** di lingkungan masjid-masjid besar Bandung
- **Alumni Inkubator Bisnis** UIN Sunan Gunung Djati Bandung

### 5.3 Target Lokasi dan Komunitas Sasaran

Untuk fase pilot project selama 8 minggu KKN, tim menetapkan kriteria seleksi komunitas sasaran sebagai berikut:

| Kriteria | Keterangan |
|---|---|
| Wilayah | Bandung Raya dan sekitarnya (prioritas Kota Bandung) |
| Jenis Usaha | UMKM pangan olahan berskala rumahan hingga menengah |
| Status Sertifikasi | Memiliki sertifikasi halal MUI/BPJPH, atau dalam proses |
| Kesiapan Digital | Memiliki smartphone dan akun WhatsApp (tidak harus melek teknologi) |
| Skala Pilot | 5–10 UMKM sebagai peserta pilot project selama masa KKN |

### 5.4 Strategi Sosialisasi dan Literasi Digital

Adopsi teknologi oleh masyarakat awam membutuhkan pendekatan yang lebih dari sekadar peluncuran aplikasi. Tim KKN HalalChain merancang strategi sosialisasi berlapis:

**a. Workshop "Halal Digital Literacy" di Masjid-Masjid**

Memanfaatkan momentum shalat Jumat atau majelis ta'lim untuk menyelenggarakan workshop singkat (30–45 menit) dengan pendekatan yang relevan secara keagamaan: "Bagaimana teknologi membantu kita memenuhi kewajiban mengonsumsi halalan thoyyiban?"

**b. Pelatihan Langsung untuk UMKM Peserta Pilot**

Sesi pelatihan tatap muka bagi pemilik UMKM yang menjadi peserta pilot, mencakup: cara mendaftarkan produk, cara mengunggah dokumen, dan cara mendistribusikan QR Code kepada pelanggan.

**c. Pembuatan Konten Edukatif**

Produksi konten video pendek (format Reels/TikTok) yang menjelaskan HalalChain dalam bahasa yang mudah dipahami masyarakat umum, untuk disebarkan melalui kanal media sosial komunitas sasaran.

**d. Demo Publik di CFD (Car Free Day) Bandung**

Penyelenggaraan booth demo interaktif di area CFD Dago atau Sudirman Bandung, di mana masyarakat dapat langsung mencoba memindai QR Code dan melihat informasi halal produk secara real-time.

---

## VI. TIMELINE PELAKSANAAN (8 MINGGU)

### Fase 1 — Fondasi & Pemetaan (Minggu 1–2)

| Minggu | Kegiatan | Penanggungjawab | Output |
|---|---|---|---|
| 1 | Survei dan pemetaan komunitas UMKM sasaran di Bandung Raya | Seluruh Tim | Laporan pemetaan, daftar 10 UMKM kandidat |
| 1 | Audiensi dengan Dinas Koperasi UMKM Kota Bandung | Ketua Kelompok + 1 anggota | MoU/Surat Dukungan |
| 1 | Audiensi dengan MUI Kota Bandung (identifikasi auditor pilot) | Ketua Kelompok | Komitmen partisipasi auditor |
| 1 | Finalisasi infrastruktur teknis (deploy kontrak ke Base Sepolia) | Lead Developer | Kontrak live di blockchain |
| 2 | Seleksi final 5 UMKM peserta pilot project | Seluruh Tim | Daftar peserta final + MoU |
| 2 | Workshop orientasi untuk UMKM peserta pilot | Seluruh Tim | 5 UMKM siap onboarding |
| 2 | Finalisasi desain UI/UX ketiga dashboard | UI/UX Developer | Prototype Figma final |

### Fase 2 — Pengembangan & Integrasi (Minggu 3–4)

| Minggu | Kegiatan | Penanggungjawab | Output |
|---|---|---|---|
| 3 | Pengembangan Producer Dashboard (lengkap) | Frontend + Backend Dev | Dashboard Produsen live |
| 3 | Integrasi IPFS untuk upload dokumen | Backend Developer | Upload dokumen berfungsi |
| 3 | Registrasi on-chain pertama (uji coba dengan data UMKM nyata) | Lead Developer | Transaksi pertama di blockchain |
| 4 | Pengembangan Auditor Dashboard | Frontend Developer | Dashboard Auditor live |
| 4 | Pelatihan teknis auditor MUI yang ditunjuk | Lead Developer | Auditor mampu menggunakan sistem |
| 4 | Proses verifikasi halal pertama secara on-chain | Auditor MUI + Lead Dev | Batch pertama tersertifikasi di chain |

### Fase 3 — Pilot Launch & Sosialisasi (Minggu 5–6)

| Minggu | Kegiatan | Penanggungjawab | Output |
|---|---|---|---|
| 5 | Onboarding seluruh 5 UMKM peserta pilot | Seluruh Tim | 5 UMKM aktif di sistem |
| 5 | Peluncuran Consumer Verification Page (publik) | Frontend Developer | Halaman verifikasi konsumen live |
| 5 | Distribusi QR Code kepada UMKM peserta | Seluruh Tim | QR terpasang di kemasan produk |
| 6 | Workshop "Halal Digital Literacy" di 2 masjid | Ketua + UI/UX Dev | 100+ peserta workshop |
| 6 | Demo publik di Car Free Day Bandung | Seluruh Tim | 200+ masyarakat terpapar langsung |
| 6 | Pengumpulan data feedback dari konsumen dan UMKM | QA/Akademik | Kuesioner terisi dari 50+ responden |

### Fase 4 — Evaluasi & Dokumentasi (Minggu 7–8)

| Minggu | Kegiatan | Penanggungjawab | Output |
|---|---|---|---|
| 7 | Analisis data feedback dan dampak pilot project | Ketua + Akademik | Laporan evaluasi kuantitatif |
| 7 | Penulisan laporan akhir KKN | Akademik + Seluruh Tim | Draf laporan akhir |
| 7 | Penyusunan makalah ilmiah untuk IICYMS 2026 | Ketua + Akademik | Draf paper |
| 8 | Presentasi hasil pilot kepada LP2M dan DPL | Seluruh Tim | Presentasi laporan akhir |
| 8 | Serah terima sistem dan dokumentasi kepada mitra | Lead Developer | Dokumentasi teknis lengkap |
| 8 | Finalisasi dan pengiriman makalah IICYMS 2026 | Ketua | Submission confirmed |

### Visualisasi Gantt Chart

```
KEGIATAN                    MG1  MG2  MG3  MG4  MG5  MG6  MG7  MG8
────────────────────────────────────────────────────────────────────
Pemetaan Komunitas          ████ ████
Audiensi Mitra Strategis    ████ ████
Pengembangan Teknis              ████ ████ ████
Pilot Onboarding UMKM                        ████ ████
Sosialisasi & Workshop                            ████ ████
Pengumpulan Data Feedback                         ████ ████
Evaluasi & Analisis                                    ████ ████
Penulisan Laporan Akhir                                     ████ ████
Paper IICYMS 2026                                      ████ ████
```

**Milestone Kritis:**

- 🏁 **Milestone 1** (Akhir Minggu 2): 5 UMKM pilot terdaftar, kontrak live di blockchain
- 🏁 **Milestone 2** (Akhir Minggu 4): Verifikasi halal pertama tercatat on-chain
- 🏁 **Milestone 3** (Akhir Minggu 6): 200+ masyarakat terpapar, QR terpasang di 5 produk nyata
- 🏁 **Milestone 4** (Akhir Minggu 8): Laporan akhir, paper, dan serah terima sistem selesai

---

## VII. ANGGARAN BIAYA KEGIATAN

> **Catatan Penting:** Infrastruktur teknologi HalalChain dirancang dengan prinsip **zero-cost development** — seluruh komponen teknis menggunakan layanan gratis (Base Sepolia Testnet, Pinata Free Tier, Vercel Free Tier). Anggaran di bawah ini mencakup biaya operasional program KKN, bukan biaya infrastruktur teknologi.

| No. | Komponen Kegiatan | Volume | Satuan Harga | Total |
|---|---|---|---|---|
| **A** | **Biaya Perjalanan & Koordinasi** | | | |
| 1 | Transportasi survei lapangan (6 orang × 4 kali) | 24 trip | Rp 50.000 | Rp 1.200.000 |
| 2 | Transportasi audiensi mitra strategis | 6 kali | Rp 100.000 | Rp 600.000 |
| **B** | **Biaya Workshop & Sosialisasi** | | | |
| 3 | Sewa ruang workshop (2 masjid) | 2 kali | Rp 300.000 | Rp 600.000 |
| 4 | Konsumsi peserta workshop (150 pax × 2 acara) | 300 pax | Rp 20.000 | Rp 6.000.000 |
| 5 | Cetak banner/backdrop kegiatan | 4 buah | Rp 200.000 | Rp 800.000 |
| 6 | Cetak leaflet/flyer sosialisasi | 500 lembar | Rp 1.500 | Rp 750.000 |
| **C** | **Biaya Materi & Dokumentasi** | | | |
| 7 | Cetak modul pelatihan UMKM | 20 eksemplar | Rp 25.000 | Rp 500.000 |
| 8 | Cetak stiker QR Code untuk kemasan UMKM | 200 lembar | Rp 5.000 | Rp 1.000.000 |
| 9 | Dokumentasi foto dan video profesional | 1 paket | Rp 1.500.000 | Rp 1.500.000 |
| **D** | **Biaya Administrasi** | | | |
| 10 | Penggandaan laporan akhir | 5 eksemplar | Rp 50.000 | Rp 250.000 |
| 11 | ATK dan perlengkapan kantor | 1 paket | Rp 300.000 | Rp 300.000 |
| 12 | Biaya komunikasi (pulsa/internet tim) | 6 orang × 2 bln | Rp 100.000 | Rp 1.200.000 |
| **E** | **Biaya Tidak Terduga (10%)** | | | Rp 1.470.000 |
| | **TOTAL ANGGARAN** | | | **Rp 16.170.000** |

| Sumber Dana | Persentase | Jumlah |
|---|---|---|
| Dana KKN LP2M UIN | 60% | Rp 9.702.000 |
| Swadaya Mahasiswa | 40% | Rp 6.468.000 |
| **Total** | **100%** | **Rp 16.170.000** |

---

## VIII. PENUTUP

### 8.1 Kesimpulan

HalalChain bukan sekadar sebuah proyek teknologi — ia adalah sebuah **gerakan pemulihan kepercayaan** dalam ekosistem halal Indonesia, yang digerakkan oleh mahasiswa Muslim yang memilih untuk menggunakan ilmu dan keahlian mereka demi kemaslahatan umat.

Dengan memanfaatkan keunggulan teknologi *blockchain* yang didukung oleh Base Network dan infrastruktur penyimpanan dokumen permanen melalui IPFS, HalalChain menawarkan solusi yang:

- **Terjangkau:** Biaya infrastruktur mendekati nol, menjadikannya realistis untuk adopsi skala luas
- **Mudah Digunakan:** Konsumen hanya perlu memindai QR Code; tidak diperlukan keahlian teknologi apapun
- **Aman dan Terpercaya:** Catatan bersifat permanen dan tidak dapat dimanipulasi oleh siapapun
- **Islami:** Seluruh desain sistem mencerminkan nilai-nilai *Amanah*, *Adl*, *Ihsan*, dan *Thoyyib*

### 8.2 Kontribusi terhadap Tri Dharma Perguruan Tinggi

Proyek KKN Tematik HalalChain secara simultan mewujudkan ketiga pilar **Tri Dharma Perguruan Tinggi** sebagai berikut:

**1. Pendidikan (Tarbiyah)**

Melalui proyek ini, seluruh anggota tim mendapatkan pengalaman belajar *hands-on* dalam pengembangan teknologi *blockchain*, manajemen proyek, pengabdian masyarakat, dan penulisan ilmiah — kompetensi-kompetensi yang tidak dapat sepenuhnya diperoleh di dalam ruang kelas. Lebih dari itu, tim belajar bahwa ilmu yang terbaik adalah ilmu yang **memberi manfaat bagi orang banyak** (*ilmun yuntafa' bihi*).

**2. Penelitian (Bahtsul Masail al-Ilmiyyah)**

Proposal ini merupakan cikal bakal dari sebuah karya ilmiah yang akan disubmit ke **IICYMS 2026** (International Islamic Conference for Young Muslim Scientists) dalam kategori *Science in Islam*. Penelitian ini mengisi celah literatur yang signifikan: belum banyak kajian akademis yang menghubungkan teknologi *blockchain* Layer 2 secara spesifik dengan sistem jaminan produk halal dalam konteks ekosistem Indonesia.

**3. Pengabdian kepada Masyarakat (Khidmatul Ummah)**

Inilah yang menjadi ruh dari seluruh proyek ini. Dengan hadir langsung di tengah komunitas UMKM dan masyarakat Muslim Jawa Barat, tim KKN HalalChain menjalankan **khidmah nyata**: membangun sistem yang meringankan kekhawatiran konsumen, memberdayakan pelaku usaha jujur, dan memperkuat integritas ekosistem halal yang menjadi kebutuhan fundamental seluruh umat Muslim.

### 8.3 Pernyataan Komitmen

Kami, tim KKN Tematik HalalChain dari Prodi Teknik Informatika UIN Sunan Gunung Djati Bandung, dengan penuh kesadaran dan tanggung jawab menyatakan komitmen kami untuk melaksanakan program ini dengan sepenuh hati, menjunjung tinggi integritas akademik, dan menjadikan kemaslahatan umat sebagai kompas utama dalam setiap langkah pelaksanaannya.

Kami percaya bahwa **mahasiswa Muslim yang cerdas tidak hanya bertugas menguasai teknologi, tetapi juga bertanggung jawab mengarahkan teknologi tersebut untuk kebaikan umat manusia dan kemuliaan agama Islam**. Proyek HalalChain adalah wujud nyata dari keyakinan tersebut.

Akhirul kalam, semoga Allah SWT meridhoi setiap langkah dan niat baik yang tertuang dalam proposal ini, dan menjadikannya amal jariyah yang terus mengalir manfaatnya — bagi konsumen yang memperoleh ketenangan, bagi UMKM yang mendapatkan kepercayaan, bagi lembaga sertifikasi yang terus berupaya menjaga amanah, dan bagi UIN Sunan Gunung Djati Bandung sebagai institusi yang senantiasa *wahyu memandu ilmu*.

> *"وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ"*
>
> *"Dan katakanlah, 'Bekerjalah kamu! Maka Allah, Rasul-Nya, dan orang-orang beriman akan melihat pekerjaanmu itu...'"*
> — **At-Tawbah: 105**

---

**Bandung, _________________ 2025**

**Hormat kami,**
**Kelompok KKN Tematik HalalChain**
**Prodi Teknik Informatika — Fakultas Sains dan Teknologi**
**UIN Sunan Gunung Djati Bandung**

---
---

## LAMPIRAN

### Lampiran A: Profil Singkat Tim

| Nama | Bidang Keahlian | Kontribusi Utama dalam HalalChain |
|---|---|---|
| Muhammad Fatih Maulana | Manajemen Proyek & Akademik | Koordinasi keseluruhan, penulisan paper, presentasi |
| [Anggota 2] | Blockchain & Smart Contract | Pengembangan kontrak Solidity, deployment Base Sepolia |
| [Anggota 3] | Frontend Development | Pengembangan antarmuka ketiga dashboard (Next.js) |
| [Anggota 4] | Backend & Cloud Integration | Integrasi IPFS Pinata, konfigurasi server |
| [Anggota 5] | UI/UX & Komunikasi Komunitas | Desain antarmuka, koordinasi lapangan, dokumentasi |
| [Anggota 6] | QA & Penulisan Akademik | Pengujian sistem, penulisan laporan, penyusunan referensi |

### Lampiran B: Referensi dan Landasan Pustaka

1. Al-Qur'an Al-Karim, Surah Al-Baqarah: 168, 172; Surah An-Nahl: 90; Surah At-Tawbah: 105
2. DinarStandard. (2023). *Global Islamic Economy Report 2022/23*. Dubai: DIEDC.
3. Badan Penyelenggara Jaminan Produk Halal (BPJPH). (2022). *Laporan Tahunan Jaminan Produk Halal 2022*. Jakarta: Kementerian Agama RI.
4. Dinas Koperasi dan UMKM Provinsi Jawa Barat. (2023). *Data UMKM Jawa Barat 2023*. Bandung.
5. Buterin, V. (2014). *A next-generation smart contract and decentralized application platform*. Ethereum White Paper.
6. Base Network Documentation. (2024). *Base: Building the Onchain Economy*. Coinbase Inc. https://docs.base.org
7. Benet, J. (2014). *IPFS — Content Addressed, Versioned, P2P File System*. Protocol Labs.
8. Wood, G. (2014). *Ethereum: A Secure Decentralised Generalised Transaction Ledger*. Ethereum Yellow Paper.
9. Tieman, M., & Ghazali, M. C. (2014). Principles in Halal Purchasing. *Journal of Islamic Marketing*, 5(3), 281–293.
10. Nurdiani, N., et al. (2021). Blockchain-based Halal Food Traceability: A Systematic Review. *International Journal of Advanced Computer Science and Applications*, 12(8).
11. OpenZeppelin. (2024). *OpenZeppelin Contracts Documentation*. https://docs.openzeppelin.com

### Lampiran C: Glosarium Istilah Teknis

| Istilah | Definisi Sederhana |
|---|---|
| **Blockchain** | Teknologi buku besar digital yang tersebar di banyak komputer, sehingga tidak dapat dimanipulasi oleh satu pihak manapun |
| **Base Network** | Jaringan blockchain yang dikembangkan oleh Coinbase; aman, cepat, dan berbiaya rendah |
| **IPFS** | Sistem penyimpanan file digital yang mengidentifikasi file berdasarkan isinya, bukan lokasinya — perubahan isi sekecil apapun akan terdeteksi |
| **Smart Contract** | Program komputer yang berjalan otomatis di blockchain; tidak dapat diubah setelah di-deploy |
| **QR Code** | Kode batang dua dimensi yang dapat dipindai ponsel untuk mengakses informasi digital |
| **Sertifikasi On-Chain** | Proses pencatatan hasil sertifikasi halal secara langsung ke dalam blockchain, sehingga hasilnya bersifat publik dan permanen |
| **Trustless Verification** | Sistem verifikasi yang tidak memerlukan kepercayaan pada satu otoritas tunggal; siapapun dapat memverifikasi sendiri |

---

*Dokumen ini disusun oleh Tim KKN Tematik HalalChain*
*Prodi Teknik Informatika, Fakultas Sains dan Teknologi*
*UIN Sunan Gunung Djati Bandung — 2025*
*Untuk keperluan pengajuan ke LP2M UIN Sunan Gunung Djati Bandung*
