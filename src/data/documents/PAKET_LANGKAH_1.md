# PAKET LANGKAH 1: FONDASI UI, AUTENTIKASI & SESI

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 1 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 1 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 1 | FND-01 | Isolasi data Master Global vs Workspace TA (snapshot operasional) | Semua | P0 | Frontend | — |
| 2 | FND-03 | Zona waktu WITA (UTC+8) untuk jendela input, tanggal arsip, dan semua tanggal/jam tampil | Semua | P0 | Frontend | — |
| 3 | FND-04 | Representasi nominal & kode | Semua | P0 | Frontend | — |
| 4 | UIX-01 | Token Tema Treasury & Market Terminal | Semua | P0 | Frontend | — |
| 5 | AUD-01 | Audit Event: pencatatan aktor, entitas, aksi, nilai sebelum/sesudah, alasan | Semua | P0 | Frontend | FND-01 |
| 6 | FND-02 | Penegakan otorisasi di server (RBAC) pada seluruh endpoint & data, termasuk pemanggilan langsung/ubah URL | Semua | P0 | Backend saja (tidak dikerjakan sekarang) | FND-01 |
| 7 | FND-05 | Transaksi atomik lintas ledger (SPD, komitmen, realisasi) & integritas saldo | Semua | P0 | Backend saja (tidak dikerjakan sekarang) | FND-01 |
| 8 | FND-06 | Pembatasan akses baris per TA/seksi pada lapisan data | Semua | P0 | Backend saja (tidak dikerjakan sekarang) | FND-01 |
| 9 | UIX-02 | Halaman login Split-Hero responsif | Semua | P1 | Frontend | UIX-01 |
| 10 | UIX-04 | Pro Mode vs Mode Standar | Semua | P1 | Frontend | UIX-01 |
| 11 | UIX-05 | Aksesibilitas & keterbacaan | Semua | P1 | Frontend | UIX-01 |
| 12 | AUD-02 | Aturan penghapusan jejak | Sistem | P0 | Frontend | AUD-01 |
| 13 | AUT-01 | Login single-field identifier (NIP/NIK/Email Auditor) | Semua | P0 | Frontend | FND-02 |
| 14 | AUT-02 | Alur masuk berjenjang & auto-skip | Semua | P0 | Frontend | AUT-01 |
| 15 | AUT-03 | Sesi tunggal terisolasi (active_ta_id, active_role, active_seksi_id) | Semua | P0 | Frontend | AUT-01 |
| 16 | AUT-06 | Pesan galat login & bantuan | Semua | P1 | Frontend | AUT-01 |
| 17 | AUT-04 | Logout menghancurkan sesi & login ulang menghasilkan jejak baru | Semua | P0 | Frontend | AUT-03, AUD-01 |
| 18 | UIX-03 | Layout dasbor: sidebar + topbar (Pengawas: menu atas) | Semua | P0 | Frontend | UIX-01, AUT-03 |
| 19 | AUT-08 | Auto logout setelah 1 jam tanpa aktivitas (keputusan pemilik N-13) | Semua | P1 | Frontend | AUT-03 |

## 2. Aturan kunci per fitur (ringkasan)
### FND-01 — Isolasi data Master Global vs Workspace TA (snapshot operasional)
- **Peran:** Semua
- **Aturan:** Master global tanpa nominal; tiap TA ruang kerja terisolasi; perubahan master tidak mengubah dokumen/transaksi historis.
- **Rujukan:** D01 §1.1; D03 §1; D04 §2.1–2.2, §6

### FND-03 — Zona waktu WITA (UTC+8) untuk jendela input, tanggal arsip, dan semua tanggal/jam tampil
- **Peran:** Semua
- **Aturan:** Semua jam/tanggal ditampilkan WITA.
- **Rujukan:** D04 §4; D01 §3.1

### FND-04 — Representasi nominal & kode
- **Peran:** Semua
- **Aturan:** Nominal bilangan bulat rupiah tanpa sen (bukan teks); tampil Rupiah pemisah titik tanpa spin button; kode rekening, no. rekening bank, NIP/NIK disimpan sebagai teks.
- **Rujukan:** D04 §4; D03 §1; D01 §7 poin 6
- **Keputusan pemilik yang sudah masuk dokumen:** N-11: nominal bilangan bulat rupiah (tanpa sen); menutup butir "presisi mata uang" di D04 §7.

### UIX-01 — Token Tema Treasury & Market Terminal
- **Peran:** Semua
- **Aturan:** Satu set token warna/huruf/jarak (Inter, JetBrains Mono, angka tabular); latar #0B1120, permukaan #111827, garis #1F2937, aksen amber/teal; tanpa glassmorphism/blur/ticker animasi di login.
- **Rujukan:** D03 §1

### AUD-01 — Audit Event: pencatatan aktor, entitas, aksi, nilai sebelum/sesudah, alasan
- **Peran:** Semua
- **Aturan:** Aktor = ID akun + snapshot nama, NIP/NIK, peran saat aksi; peristiwa tambahan: Sahkan, perubahan alokasi pasca-pengesahan/APBD-P, verifikasi disetujui/dikembalikan, pencatatan BKU; login/logout tidak dicatat; efek otomatis dicatat atas nama pemicu dengan penanda otomatis; snapshot tidak berubah.
- **Rujukan:** D04 §2.2, §6; D01 §6 poin 6
- **Keputusan pemilik yang sudah masuk dokumen:** N-11: peristiwa audit ditambah: Sahkan, perubahan alokasi setelah pengesahan/APBD-P, verifikasi disetujui/dikembalikan, pencatatan BKU. Login/logout tidak dicatat; P-123 dibaca sebagai jejak aksi sesudah login.

### FND-02 — Penegakan otorisasi di server (RBAC) pada seluruh endpoint & data, termasuk pemanggilan langsung/ubah URL
- **Peran:** Semua
- **Aturan:** Menyembunyikan tombol tidak cukup; cakupan peran/TA/seksi divalidasi server; tidak ada role yang dapat melewati kewenangan.
- **Rujukan:** D05 §1, §2, §4; D01 §7 poin 8

### FND-05 — Transaksi atomik lintas ledger (SPD, komitmen, realisasi) & integritas saldo
- **Peran:** Semua
- **Aturan:** Hindari penghitungan ganda nilai yang telah dibukukan; transisi status dan pemeriksaan dilakukan atomik.
- **Rujukan:** D04 §5.2, §7; D03 §10 poin 5
- **Keputusan pemilik yang sudah masuk dokumen:** N-11: satu transaksi database per aksi dengan penguncian baris; sisa SPD bebas diperiksa di dalam transaksi.

### FND-06 — Pembatasan akses baris per TA/seksi pada lapisan data
- **Peran:** Semua
- **Aturan:** Sesi terikat satu TA & satu peran; data di luar cakupan tidak pernah dikirim.
- **Rujukan:** D04 §7, §3; D01 §7 poin 8
- **Keputusan pemilik yang sudah masuk dokumen:** N-11: row-level security berdasarkan TA aktif, peran, dan seksi.

### UIX-02 — Halaman login Split-Hero responsif
- **Peran:** Semua
- **Aturan:** Panel kiri identitas Pemkab Balangan • Kec. Batumandi + logo + AMANDA + etos; panel kanan kartu datar; tombol amber "Masuk ke Sistem"; tombol "Lihat Ringkasan Publik"; satu kolom di layar sempit.
- **Rujukan:** D03 §1

### UIX-04 — Pro Mode vs Mode Standar
- **Peran:** Semua
- **Aturan:** Pro Mode: dasbor & monitoring (PA/KPA, Bendahara, Verifikator), baris ~32 px, angka rata kanan; Mode Standar: input kuitansi/SPJ/Form Dinamis/BKU/laporan harian, jarak 16–24 px, baris ~48 px; otomatis Standar < 768 px; tanpa tombol ganti mode.
- **Rujukan:** D03 §1

### UIX-05 — Aksesibilitas & keterbacaan
- **Peran:** Semua
- **Aturan:** Status wajib ikon/teks (tidak hanya warna); kontras WCAG AA (4,5:1 / 3:1); cincin fokus amber 2 px; reduced-motion; keyboard.
- **Rujukan:** D03 §1, §9 poin 9

### AUD-02 — Aturan penghapusan jejak
- **Peran:** Sistem
- **Aturan:** Pembatalan kuitansi/SPJ Draft menghapus entri audit terkait otomatis; tidak ada tombol hapus manual; penghapusan TA retensi menghapus seluruh entri audit TA.
- **Rujukan:** D01 §6 poin 6; D02 §6 poin 3; D04 §2.2

### AUT-01 — Login single-field identifier (NIP/NIK/Email Auditor)
- **Peran:** Semua
- **Aturan:** Angka → personel internal; format email → Pengawas/Auditor (ikon + label teks); password min 6 karakter; tombol intip sandi; tombol tidak dapat ditekan dua kali.
- **Rujukan:** D03 §1; D04 §3

### AUT-02 — Alur masuk berjenjang & auto-skip
- **Peran:** Semua
- **Aturan:** Admin langsung ke Dasbor Administrasi Global; Auditor langsung (atau pilih TA bila >1); internal: auto-skip bila 1 penugasan/1 jabatan, selain itu daftar TA lalu daftar jabatan; Delegasi Aktif ikut dihitung.
- **Rujukan:** D03 §1; D01 §6 poin 7

### AUT-03 — Sesi tunggal terisolasi (active_ta_id, active_role, active_seksi_id)
- **Peran:** Semua
- **Aturan:** Payload sesi: user_id, actor_type, active_ta_id, active_role, active_seksi_id; tidak ada endpoint/aksi ganti TA/peran; manipulasi parameter ditolak; ganti konteks wajib logout; auto logout setelah 1 jam tanpa aktivitas.
- **Rujukan:** D03 §1; D04 §3
- **Keputusan pemilik yang sudah masuk dokumen:** N-13: sesi auto logout setelah 1 jam tanpa aktivitas.

### AUT-06 — Pesan galat login & bantuan
- **Peran:** Semua
- **Aturan:** Galat sebagai teks+ikon di atas tombol tanpa menyebut NIP atau sandi yang salah; catatan "Hubungi Administrator Sistem" (reset terpusat oleh Admin).
- **Rujukan:** D03 §1

### AUT-04 — Logout menghancurkan sesi & login ulang menghasilkan jejak baru
- **Peran:** Semua
- **Aturan:** Token/sesi dihancurkan menyeluruh tanpa kontaminasi sesi sebelumnya.
- **Rujukan:** D03 §1; D04 §3

### UIX-03 — Layout dasbor: sidebar + topbar (Pengawas: menu atas)
- **Peran:** Semua
- **Aturan:** Topbar: TA aktif, peran aktif (label), mini progress bar, logout; tanpa dropdown ganti TA/peran; Pengawas tanpa sidebar & tanpa progress bar.
- **Rujukan:** D03 §1; D01 §3.3

### AUT-08 — Auto logout setelah 1 jam tanpa aktivitas (keputusan pemilik N-13)
- **Peran:** Semua
- **Aturan:** Sesi berakhir otomatis setelah 1 jam tanpa aktivitas; tidak ada batas maksimum lama login dan tidak ada peringatan sebelum logout.
- **Rujukan:** D03 §1; D04 §3
- **Keputusan pemilik yang sudah masuk dokumen:** N-13: 1 jam tanpa aktivitas → auto logout.

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 01 §1.1

### 1.1 Prinsip Pemisahan Ruang Lingkup Data
1. **Master Data Global (Kamus Lintas Tahun):**
   - Berisi data referensi dasar instansi: Master SOTK, Master Personel (termasuk histori pangkat & gelar berversi), Master Subkegiatan, Master Rekening Belanja, dan Master Jenis Pajak.
   - Master data tidak memuat angka nominal pagu atau transaksi kas.
   - Master Rekening Belanja adalah kamus global yang dapat dipakai di subkegiatan mana pun; tidak ada daftar pasangan subkegiatan-rekening yang dibatasi.
   - Perubahan pada Master Data Global tidak boleh mengubah, merusak, atau membatalkan dokumen historis dan transaksi di Tahun Anggaran masa lalu.
2. **Workspace Tahun Anggaran (Snapshot Operasional Terisolasi):**
   - Setiap Tahun Anggaran (TA) memiliki ruang kerja mandiri yang terisolasi.
   - Ketika TA dibentuk, struktur unit kerja, pemetaan subkegiatan, dan formasi pejabat ditarik sebagai snapshot operasional dari Master Data Global.
   - Seluruh pengelolaan pagu, transaksi kuitansi, SPJ, pembukuan BKU, dan jejak audit terikat pada TA yang bersangkutan (pembatalan kuitansi dan SPJ Draft dijelaskan di §6 poin 6).

#### Dokumen 03 §1

## 1. Prinsip lintas role
- Master data bersifat global; setiap TA memiliki snapshot operasionalnya sendiri.
- **Autentikasi Cerdas & Desain Antarmuka Halaman Login:**
  - **Arsitektur Visual (Treasury & Market Terminal):**
    - Halaman login memakai tema Treasury & Market Terminal: nuansa terminal keuangan yang tenang dan mudah dibaca, bukan layar hitam pekat dengan teks hijau terang.
    - Latar memakai slate/charcoal gelap (`#0B1120`) dengan permukaan panel `#111827` dan garis tepi 1 px `#1F2937`. Halaman login tidak memakai efek kaca (*glassmorphism*), blur, gradasi cahaya, animasi, atau ticker.
    - Garis kisi mikro boleh dipakai sebagai ornamen statis tipis pada panel kiri, dengan kontras teks tetap memenuhi aturan aksesibilitas pada bagian Tema Visual.
  - **Tata Letak Responsif (Split-Hero):**
    - **Panel Kiri (Identitas & Wibawa Instansi):**
      - Header identitas resmi: *"Pemerintah Kabupaten Balangan • Kecamatan Batumandi"*.
      - Logo instansi daerah bersanding dengan jenama **AMANDA** (*Aplikasi Manajemen Data Anggaran*), tampil datar tanpa efek cahaya.
      - Pesan nilai/etos kerja aparatur muda: *"Tertib Administrasi, Akuntabel, dan Transparan dalam Setiap Rupiah."*
      - Halaman bebas dari ticker/banner animasi yang mengganggu fokus.
    - **Panel Kanan (Kartu Login Datar):**
      - Kartu datar dengan garis tepi 1 px dan tanpa blur atau bayangan tebal.
      - *Field Identitas Terpadu (Single-Field Identifier):* Satu kolom berlabel `NIP / NIK / Email Auditor` dengan teks monospace untuk NIP/NIK. Input angka dikenali sebagai personel internal; tanda `@` dikenali sebagai Pengawas/Auditor dan ditandai dengan ikon serta label teks "Akun Pengawas/Auditor", tidak hanya warna.
      - *Field Kata Sandi:* Dilengkapi **tombol intip sandi** (*toggle show/hide password*) responsif (password minimal 6 karakter).
      - *Tombol Aksi Utama:* Tombol *"Masuk ke Sistem"* berwarna amber (`#F59E0B`) dengan teks gelap (`#0B1120`). Saat diproses, tombol menampilkan teks "Memeriksa akun..." dan tidak dapat ditekan dua kali.
      - *Pesan Galat:* Galat login ditampilkan sebagai teks dengan ikon di atas tombol, tanpa menyebut apakah NIP atau kata sandi yang salah.
      - *Catatan Bantuan Admin:* Kotak informasi mikro berlabel tegas *"Lupa password atau akun terkendala? Hubungi Administrator Sistem."* (karena reset password bersifat terpusat oleh Admin).
      - *Tautan Cepat Portal Publik:* Tombol sekunder teal outline (`#2DD4BF`) berlabel jelas *"Lihat Ringkasan Publik"* untuk akses instan ke Portal Keterbukaan Informasi anonim tanpa login.
  - **Responsif Layar Sempit:** Pada layar sempit, panel kiri menjadi header ringkas di atas kartu login. Seluruh elemen tersusun satu kolom dengan field dan tombol selebar layar.
- **Tata Letak Dasbor (Sidebar & Topbar):**
  - Semua peran kecuali Pengawas/Auditor memakai sidebar untuk menu dan topbar tipis untuk konteks (TA aktif, peran aktif sebagai label, mini progress bar, dan logout).
  - Pengawas/Auditor memakai navigasi atas tanpa sidebar dan tanpa mini progress bar.
  - Admin hanya melihat Pagu Induk pada topbar.
  - Larangan dropdown ganti TA atau peran di topbar tetap berlaku.
- **Tema Visual Treasury (Login, Pro Mode, dan Mode Standar):**
  - **Token Bersama:** Seluruh antarmuka memakai satu set token warna, huruf, dan jarak. Nilai awal: latar `#0B1120`; permukaan `#111827`; garis tepi `#1F2937`; teks utama `#E5E7EB`; teks sekunder `#9CA3AF`; aksen utama amber `#F59E0B`; aksen sekunder teal `#2DD4BF`; status baik/naik hijau `#34D399`; kritis merah `#F87171`; peringatan kuning `#FBBF24`; lonjakan oranye `#FB923C`.
  - **Huruf:** Sans-serif (Inter) untuk teks umum dan judul. Monospace (JetBrains Mono) untuk NIP/NIK, kode TA, nomor BKU, nomor bukti, dan kode rekening. Angka nominal memakai angka tabular (lebar digit sama) agar kolom angka sejajar.
  - **Pro Mode (Dashboard Utama dan Monitoring/Analitik):**
    - Diterapkan pada dasbor utama dan modul monitoring atau analitik bagi pengelola keuangan tingkat lanjut, yaitu dasbor PA/KPA (§6 dan §11), dasbor Bendahara, dan dasbor Verifikator.
    - Kepadatan tinggi: ticker ringkasan horizontal di bagian atas (sesuai §6 dan §11), tabel rapat dengan tinggi baris sekitar 32 px, angka rata kanan, dan titik warna untuk zona analitik.
    - Pro Mode tidak mengubah cakupan data. Setiap dasbor hanya menampilkan angka yang diizinkan untuk role tersebut.
  - **Mode Standar (Input Transaksi dan Laporan Harian):**
    - Diterapkan pada halaman input kuitansi, SPJ, Form Dinamis, dan halaman BKU serta laporan harian.
    - Kepadatan lega: jarak antarelemen 16–24 px, ukuran teks dasar 16 px, tinggi baris tabel sekitar 48 px, dan hanya kolom yang diperlukan untuk keputusan.
    - Setiap layar memiliki satu aksi utama yang jelas. Pop-up dan halaman sendiri mengikuti Dokumen 01 §15.
    - Tidak ada tombol ganti mode. Mode standar otomatis dipakai pada layar kecil (di bawah 768 px), sedangkan Pro Mode mengikuti lebar layar yang lebih besar.
  - **Status dan Keterbacaan:** Setiap status (zona hijau, kuning, merah, dan oranye; status Dibukukan atau Terkunci; dan sejenisnya) wajib memakai teks atau ikon, tidak hanya warna. Kontras teks normal minimal 4,5:1 dan teks besar serta ikon minimal 3:1 (WCAG AA). Fokus keyboard memakai cincin amber 2 px yang terlihat. Transisi dibatasi, dan dimatikan jika pengguna memilih pengurangan gerak di perangkatnya.
  - **Batas Data:** Tema tidak mengubah cakupan data. Dasbor Admin tidak menampilkan realisasi atau sisa SPD (§2.1 poin 6 dan Dokumen 01 §6). Portal publik tidak menampilkan nominal rupiah (§9 poin 6). Portal publik mengikuti tema ini sesuai §9 poin 7–9.
- **Alur Masuk Berjenjang & Auto-Skip Pasca-Login:**
  1. **Admin:** Langsung masuk ke Dasbor Administrasi Global (Master & TA) tanpa melalui layar pemilih TA atau jabatan.
  2. **Pengawas/Auditor:** Langsung masuk ke Dasbor Pengawas (Laporan & Audit Trail Baca-Saja) TA yang ditugaskan. Jika surat tugas menugaskan lebih dari satu TA, Auditor memilih TA penugasan terlebih dahulu lalu langsung masuk ke dasbor TA tersebut.
  3. **Personel Internal (Bendahara, PPTK, Verifikator, PA/KPA):**
     - Jika personel hanya memiliki tepat 1 penugasan di 1 TA: sistem otomatis langsung masuk (*auto-skip*) ke dasbor TA dan jabatan tersebut.
     - Jika personel memiliki penugasan di lebih dari 1 TA: sistem menampilkan layar daftar TA penugasan terlebih dahulu, dilanjutkan layar daftar jabatan aktif pada TA yang dipilih (bila memegang lebih dari 1 jabatan di TA tersebut), baru kemudian masuk ke dasbor operasional.
     - Jika personel hanya memiliki penugasan di 1 TA tetapi memegang lebih dari 1 jabatan di TA tersebut: sistem langsung menampilkan layar daftar jabatan aktif lalu masuk ke dasbor operasional.
- **Isolasi Konteks Sesi & Larangan Alih Konteks Tanpa Logout:** Sesi operasional terisolasi ketat pada tepat satu TA (`active_ta_id`) dan satu Peran (`active_role`) yang aktif. Sistem dilarang menyediakan mekanisme alih TA (*switch TA*) atau alih peran (*switch role*) secara langsung di dalam aplikasi (misalnya melalui dropdown navbar). Untuk berpindah Tahun Anggaran atau berganti jabatan/peran, pengguna **wajib melakukan Logout** (menghancurkan sesi aktif) dan melakukan login ulang.
- **Pembatasan Percobaan Login & Batas Tidak Aktif:** Setelah 10 kali gagal login berturut-turut, akun terkunci dan pemulihannya dilakukan melalui reset password oleh Admin. Batas ini tidak berlaku untuk akun Admin, yang tidak dikunci karena percobaan gagal. Bila Admin lupa password, reset dilakukan melalui backend, bukan melalui aplikasi. Sesi berakhir otomatis (auto logout) setelah 1 jam tanpa aktivitas. Tidak ada batas maksimum lama login dan tidak ada peringatan sebelum logout.
- Penugasan, transaksi, dan perubahan anggaran terikat pada TA dan masa berlaku masing-masing.
- **Delegasi Plh./Plt.:** Delegasi sementara mengikuti Dokumen 01 §6 poin 7–11. Penugasan Delegasi Aktif ikut dihitung dalam alur masuk berjenjang, dan selama delegasi aktif hak transaksi pejabat definitif nonaktif.
- Perubahan tidak menghapus sejarah. Dokumen lama tetap dapat ditelusuri dan diakses sesuai hak.
- Mini progress bar di topbar mengikuti Dokumen 01 §3.3; laporan PDF dan Excel mengikuti Dokumen 01 §9 dan hanya memuat data Dibukukan. Rincian Kartu Kendali Kegiatan per subkegiatan dan rekening belanja (Dokumen 01 §9 poin 2g) mengikuti cakupan laporan a. Unduhan Excel rekap isian SPJ berisi satu sheet per jenis belanja (Dokumen 01 §9 poin 6–7). Pajak tidak termasuk rekap isian SPJ; rekap pajak per jenis pajak (Dokumen 01 §9 poin 10, hanya SPJ yang sudah memiliki BKU) dapat dilihat Bendahara, PPTK untuk seksinya, Verifikator, PA/KPA, dan Pengawas.
- Input nominal memakai format Rupiah dengan pemisah ribuan titik; kode dan nomor rekening adalah teks.
- Pencarian dan filter hanya pada daftar yang ditetapkan, dan hanya dalam cakupan data peran pengguna. Aksi singkat dan konfirmasi memakai pop-up; isian panjang memakai halaman sendiri (Dokumen 01 §15).
- Rekening belanja adalah kamus global yang dapat dipakai di subkegiatan mana pun; pasangan subkegiatan dan rekening membedakan baris alokasi (Dokumen 04 §2.2).
- Setiap aksi tercatat atas nama personel yang login, bukan akun generik (lihat Dokumen 04 §6).
- Batas peran Admin dan pemisahan tugas mengikuti Dokumen 01 §6: Bendahara tidak boleh merangkap PPTK pada TA yang sama, dan hanya satu TA yang boleh berstatus Aktif Penuh pada satu waktu.

#### Dokumen 04 §2.1

### 2.1 Master global
| Entitas | Data utama | Prinsip |
|---|---|---|
| Master SOTK | ID (internal), nama unit, tanggal mulai (TMT), tanggal akhir (TMT Selesai), dasar hukum, pengganti_dari_id, status_versi (Aktif / Diarsipkan) | Flat murni; tanpa input kode manual; tanpa pengelompokan jenis unit; aksi Ubah (nomenklatur berversi H-1 vs typo ejaan) & aksi Arsipkan |
| Master Personel | ID, gelar depan, nama, gelar belakang, NIP, NIK, profil/pangkat sesuai kebutuhan | Lintas tahun; NIP fleksibel; NIK wajib bila NIP tidak ada |
| Akun Login | ID akun, personel terkait, username/email, status akun | Opsional 0..1 per personel; akun tidak menggantikan profil; NON-ACTIVE hanya memutus login, bukan penugasan |
| Akun Pengawas/Auditor | ID akun, nama lengkap, instansi asal, nomor dan tanggal surat tugas, email, tanggal akhir akses, status | Terpisah dari personel; tidak memiliki NIP/NIK wajib, pangkat, atau histori; password dikelola Admin |
| Master Subkegiatan | ID, kode, nama, rincian, status | Kamus global, tidak melekat permanen ke seksi |
| Master Rekening Belanja | ID, kode rekening, nama, rincian, status | Kode disimpan sebagai teks agar nol awal/tanda baca terjaga; kamus global, dapat dipakai di subkegiatan mana pun tanpa pembatasan daftar |
| Master Jenis Pajak | ID, kode (opsional), nama jenis pajak, status | Kamus global untuk pilihan pajak pada SPJ; nominal pajak diisi manual dan tidak dihitung dari master |

#### Dokumen 04 §4

## 4. Representasi angka dan kode
- Nominal disimpan sebagai bilangan bulat rupiah (tanpa sen), bukan sebagai teks berformat. Tipe database final ditentukan saat implementasi.
- Tampilan/edit nominal menggunakan pemisah ribuan titik, tanpa spin button, dan nilai kosong benar-benar kosong.
- Kode rekening belanja, nomor rekening bank, NIP/NIK, dan kode lain yang dapat berawalan nol disimpan sebagai teks. Jangan menjalankan format Rupiah pada kode.

Zona waktu sistem: WITA (UTC+8) untuk jendela input, tanggal arsip, dan seluruh tanggal/jam yang ditampilkan kepada pengguna.

Istilah nomor BKU: "No. BKU" adalah satu-satunya istilah untuk nomor pembukuan kas. Tidak ada istilah lain yang berbeda untuk nomor yang sama.

#### Dokumen 01 §3.1

### 3.1 Manajemen Jendela Waktu Alokasi
1. Bendahara Pengeluaran memiliki kewenangan mengatur batas waktu pengisian anggaran (tanggal dan jam penutupan). Seluruh jendela waktu memakai zona waktu WITA (UTC+8).
2. Dashboard seluruh pengguna, kecuali Pengawas/Auditor, menampilkan widget hitung mundur (*countdown*) yang memperlihatkan sisa waktu input alokasi selama jendela input dibuka. Widget hilang setelah seluruh seksi berstatus Seimbang. Admin melihat widget ini dalam mode baca saja dan tidak memiliki kendali atas jendela waktu.
3. Dashboard Bendahara dilengkapi tabel pemantau kesiapan yang menampilkan status masing-masing Seksi:
   - *Belum Input*
   - *Draft Belum Seimbang*
   - *Tuntas (100% Seimbang)*

#### Dokumen 01 §7

## 7. TAMPILAN ANGGARAN BERJENJANG (DRILL-DOWN)
1. **Jenjang tampilan:** Seluruh tampilan angka anggaran wajib berjenjang: **Seksi → Subkegiatan → Rekening Belanja**. Pengguna memulai dari daftar seksi, membuka seksi untuk melihat subkegiatannya, lalu membuka subkegiatan untuk melihat rekening belanjanya. Breadcrumb selalu menampilkan posisi dan dapat digunakan untuk kembali ke tingkat sebelumnya.
2. **Kolom di setiap tingkat:** Pagu; Realisasi BKU; Komitmen Kuitansi Aktif; Sisa SPD Bebas (rumus §4.2); Serapan dalam persen, yaitu (Realisasi BKU + Komitmen Kuitansi Aktif) ÷ Pagu; dan Status (Seimbang atau Belum Seimbang).
3. **Konsistensi berjenjang:** Nilai setiap tingkat adalah hasil penjumlahan tingkat di bawahnya. Total seksi sama dengan jumlah subkegiatan pada seksi tersebut, dan total subkegiatan sama dengan jumlah rekening belanjanya.
4. **Ringkasan Pagu Induk:** Bagi peran yang berhak melihat Pagu Induk, tingkat teratas berupa kartu total Pagu Induk TA dan total seluruh seksi di atas daftar seksi.
5. **Cakupan per peran:**
   a. Bendahara Pengeluaran: seluruh seksi sampai rekening belanja, mode baca dan pemantauan.
   b. Verifikator: seluruh seksi sampai rekening belanja, mode baca saja.
   c. PA/KPA: seluruh seksi sampai subkegiatan, mode baca saja; tingkat rekening belanja tidak ditampilkan.
   d. PPTK/Seksi: hanya seksinya sendiri sampai rekening belanja; Pagu Induk dan seksi lain tidak tampil.
   e. Pengawas/Auditor: tidak memiliki drill-down; hanya laporan dan Jejak Audit (§8).
   f. Admin: tidak memiliki tampilan drill-down anggaran.
6. **Format tampilan:** Nominal memakai Rupiah dengan pemisah ribuan titik sesuai Dokumen 04 §4. Kode subkegiatan dan kode rekening belanja tampil sebagai teks, disertai nama pada setiap tingkat.
7. **Snapshot TA:** Pada TA berstatus Masa Transisi atau Arsip Read-Only, drill-down menampilkan snapshot anggaran TA tersebut. Perubahan Master SOTK atau Master Subkegiatan setelah itu tidak mengubah angka yang tampil.
8. **Penegakan di server:** Nilai hanya dihitung dan dikirim untuk tingkat yang boleh dilihat peran. Penyembunyian di antarmuka tidak cukup.
9. **Rekening sama pada banyak subkegiatan:** baris rekening tampil terpisah di bawah masing-masing subkegiatan dan tidak digabung menjadi satu baris, sehingga setiap angka tetap dapat ditelusuri ke subkegiatan asalnya.

---

#### Dokumen 04 §2.2

### 2.2 Snapshot/operasional TA
| Entitas | Data utama | Prinsip |
|---|---|---|
| Tahun Anggaran | Tahun, pagu induk, status siklus, mode APBD-P, tanggal arsip terakhir | Workspace terisolasi; penghapusan setelah memiliki transaksi hanya melalui retensi 12 tahun sejak tanggal arsip terakhir; paling banyak satu berstatus Aktif Penuh pada satu waktu |
| Seksi TA | Referensi versi SOTK, nama snapshot, periode/status | Perubahan master global tidak mengubah snapshot TA |
| Pemetaan Subkegiatan TA | TA, seksi TA, subkegiatan | Satu subkegiatan hanya untuk satu seksi per TA; satu seksi dapat banyak subkegiatan |
| Penugasan TA | Peran, personel, seksi opsional, TMT, akhir, provisional | Menyimpan riwayat; PA/KPA, Bendahara, Verifikator instansi, PPTK per seksi; satu personel sah memegang peran PPTK di lebih dari satu seksi pada TA yang sama |
| Penugasan Delegasi (Plh./Plt.) | TA, personel pengganti, peran yang digantikan (Bendahara, PPTK, atau PA/KPA), seksi jika PPTK, tanggal mulai, tanggal berakhir, status (Delegasi Aktif, Berakhir, atau Dicabut), alasan pencabutan dini, ID pejabat definitif | Entitas terpisah dari Penugasan TA definitif dan tidak mengakhiri atau memindahkannya; rentang tanggal inklusif; berakhir otomatis 23:59 WITA pada tanggal berakhir; pencabutan dini wajib beralasan; selama Delegasi Aktif hak transaksi definitif nonaktif; penunjukan ditolak bila personel memegang peran yang bertentangan (Dokumen 01 §6 poin 8) |
| Penugasan Pengawas TA | TA, akun Pengawas, tanggal mulai, tanggal akhir | Tanpa seksi; cakupan seluruh seksi pada TA yang ditugaskan; berakhir pada tanggal akhir akses |
| Register SK | Penugasan, nomor/tanggal SK, berkas, status provisional | SK lama tetap dapat dibuka setelah penugasan berakhir |
| Versi Alokasi Anggaran | TA, fase (murni/perubahan/pergeseran), tanggal efektif, aktor | Append-only/berhistori secara konseptual; perubahan tidak menimpa jejak lama |
| Alokasi Subkegiatan | TA, subkegiatan, pagu | Dikelola Bendahara sesuai DPA |
| Alokasi Rekening | TA, subkegiatan, rekening, pagu | Dikelola PPTK/Seksi; total sama dengan pagu subkegiatan; perubahan pagu per fase dicatat di Versi Alokasi Anggaran; pasangan subkegiatan + rekening membedakan baris alokasi, unik per TA, subkegiatan, dan rekening; kunci internal berupa ID, kode gabungan (misal 5.1.02.02.6.2.01.01) hanya untuk tampilan dan pencarian |
| Ledger SPD | TA, rekening/alokasi, nilai SPD, perubahan, referensi (pergeseran memakai nomor otomatis `Pergeseran/{nomor urut 3 digit}/{tahun TA}`, Dokumen 01 §5.1 poin 5) | SPD otomatis 100% pagu yang disahkan; efisiensi/pergeseran berjejak |
| Kuitansi | TA, seksi, subkegiatan, rekening, penerima, bruto, uraian, tanggal kuitansi, status (Aktif atau Terkunci) | Satu kuitansi Aktif atau Terkunci mengikat komitmen SPD; kuitansi Terkunci sejak SPJ Draft dibuat dan tidak dapat diubah selama SPJ masih terkait; pada Masa Transisi seluruh data kuitansi Aktif tidak dapat diedit dan hanya pembatalan yang diizinkan; tidak ada status Dibatalkan, kuitansi yang dibatalkan langsung dihapus |
| Form Dinamis | Jenis belanja, versi, field (tipe, urutan, wajib/opsional, system tag), blok berulang (maksimal satu per form, berisi field) | Dibuat Admin per jenis belanja; setiap perubahan membentuk versi baru; SPJ menyimpan versi yang berlaku saat dibuat. Untuk perjalanan dinas mendukung tag `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, `[SYS_END_DATE]`; tag ID/nama berpasangan dalam konteks field/baris yang sama |
| SPJ | Kuitansi, jenis belanja (pilihan awal Seksi, menentukan form), versi form, jawaban (field tunggal dan entri blok berulang), daftar pajak (jenis pajak dari master dan nominal manual, banyak entri), lampiran PDF beserta nama asli, ukuran asal, ukuran final, dan status optimasi, status (Draft, Terkunci, Menunggu BKU, Dibukukan) | Relasi 1:1 dengan kuitansi; form snapshot saat dibuat; Total Pajak tidak boleh melebihi bruto kuitansi terkait (penyimpanan entri pajak ditolak); isian rincian bersifat informasional murni tanpa validasi matematis terhadap nominal bruto kuitansi; SPJ Terkunci sejak dikirim ke Verifikator; kuitansi terkait ikut Terkunci sejak SPJ Draft dibuat |
| Token Verifikasi SPJ | SPJ, token acak untuk barcode, nomor verifikasi (teks cetak, dibuat otomatis, urut dan tidak dipakai ulang per TA, tidak sama dengan token), waktu verifikasi, status (Berlaku atau Tidak berlaku) | Dibuat saat Verifikator menyetujui SPJ, bersama token dan nomor verifikasi; menjadi Tidak berlaku saat SPJ dikembalikan menjadi Draft (pencabutan BKU saja tidak mengubah status); token dan nomor verifikasi baru dibuat saat verifikasi ulang; halaman keaslian publik tidak menampilkan nominal atau identitas |
| Format Nomor Verifikasi | Per TA: awalan, pemisah, pola tahun, jumlah digit urut | Diatur Admin; perubahan format tidak mengubah nomor yang sudah tercetak |
| Direktori Transaksional SPJ | Kunci identitas NIP/NIK yang dimasukkan, nama pasangan, referensi sumber/pembaruan seperlunya | Terpisah dari Master Personel; mencakup pegawai organik, honorer, narasumber, dan pihak luar tanpa kategori wajib; dipakai untuk lookup dan auto-fill; tetap dipertahankan saat SPJ dibatalkan/dihapus; Admin dapat mengoreksi dan merge duplikat dengan menjaga referensi SPJ historis |
| Rentang Penugasan SPJ | TA, SPJ, identitas NIP/NIK, tanggal mulai efektif, tanggal selesai efektif | Diperoleh dari field bertag pada Form Dinamis/snapshot jawaban; bukan komitmen terpisah. Validasi overlap hanya pada pengajuan ke Verifikator, dalam TA yang sama, terhadap status SPJ Terkunci/Menunggu BKU/Dibukukan |
| BKU | Kuitansi/SPJ terkait, nomor BKU (input manual), tanggal BKU, status | Menandai realisasi pengeluaran kas belanja (tidak mencatat penerimaan kas/SP2D); satu BKU per kuitansi; nomor diinput manual oleh Bendahara & unik per TA; penanggalan bebas tanpa batasan kronologis; koreksi No. BKU/tanggal tanpa pembatalan jika nominal tidak berubah; nomor BKU yang dicabut bebas digunakan kembali; pencabutan BKU |
| Audit Event | Waktu, aktor (ID akun, snapshot nama, NIP/NIK, peran saat aksi), entitas, aksi, nilai sebelum/sesudah, alasan | Merekam perubahan signifikan, pencabutan dan koreksi BKU, serta perubahan status akun. Peristiwa yang juga dicatat: pengesahan ("Sahkan"), perubahan alokasi setelah pengesahan atau APBD-P, verifikasi SPJ disetujui atau dikembalikan, dan pencatatan BKU. Login dan logout tidak dicatat. Pembatalan kuitansi atau SPJ Draft tidak dicatat; entri yang terkait kuitansi atau SPJ tersebut ikut terhapus otomatis oleh sistem dan tidak dapat dihapus manual. Penghapusan TA setelah retensi tidak dicatat, dan seluruh entri audit TA tersebut ikut terhapus. Aktor selalu personel nyata; Admin dapat membaca seluruh entri termasuk nominal. Pada aksi Delegasi Plh./Plt., entri memuat `definitive_officer_id` (ID pejabat definitif), `delegate_officer_id` (ID pejabat penerima delegasi), dan keterangan status Delegasi Aktif. Penetapan, tanggal berlaku, pencabutan dini, dan pengakhiran otomatis wajib tercatat; pengakhiran otomatis diberi penanda otomatis. |

#### Dokumen 01 §6

## 6. PEMISAHAN TUGAS & BATAS PERAN ADMIN
1. **Bendahara Tidak Merangkap PPTK:** Satu personel tidak boleh menjadi Bendahara Pengeluaran sekaligus PPTK/Seksi pada TA yang sama, termasuk saat ditunjuk sebagai Plh./Plt. Sistem menolak penugasan yang melanggar aturan ini.
2. **Lingkup Admin:** Admin mengelola data master dan status TA, termasuk membuka kembali TA Arsip dan menghapus TA sesuai retensi (poin 6 §1.3), serta menetapkan dan mencabut Delegasi Plh./Plt. (poin 7 dan 10). Admin tidak melihat alokasi, SPD, kuitansi, SPJ, verifikasi, BKU, atau angka realisasi/sisa SPD di dashboard.
3. **Pengecualian Admin yang Disetujui:** (a) Pagu Induk tampil pada kartu TA; (b) Jejak Audit menampilkan seluruh entri, termasuk entri keuangan dan nilai sebelum/sesudah, dalam mode baca saja; (c) countdown dan banner merah tampil pada dashboard Admin.
4. **Pengawas/Auditor:** Mengakses laporan dan Jejak Audit pada TA yang ditugaskan dalam mode baca saja (lihat §8). Tidak mengubah pagu, penugasan, kuitansi, SPJ, atau BKU, dan tidak memiliki akses master, akun, atau proses transaksi.
5. **Akses PPTK dan Verifikator:** PPTK tidak melihat Pagu Induk dan hanya melihat Jejak Audit milik seksinya. Bendahara Pengeluaran hanya melihat entri Jejak Audit aksinya sendiri. Verifikator melihat Pagu Induk pada kartu TA dan seluruh Jejak Audit TA, dalam mode baca saja.
6. **Jejak Audit Ringkas:** Jejak Audit mencatat aksi administratif (akun, master, status TA, penugasan, dan aksi Pengawas) serta koreksi dan pencabutan BKU. Jejak Audit juga mencatat pengesahan ("Sahkan"), perubahan alokasi setelah pengesahan atau APBD-P, verifikasi SPJ disetujui atau dikembalikan, dan pencatatan BKU. Login dan logout tidak dicatat. Pembatalan kuitansi atau SPJ Draft tidak meninggalkan jejak. Entri audit yang terkait kuitansi atau SPJ tersebut, termasuk koreksi dan pencabutan BKU, ikut terhapus otomatis oleh sistem bersama data kuitansi atau SPJ. Tidak ada tombol hapus manual untuk entri audit.
7. **Delegasi Wewenang Sementara (Plh./Plt.):** Admin dapat menambahkan penugasan sekunder berstatus Delegasi Aktif (Plh./Plt.) bagi Bendahara Pengeluaran, PPTK/Seksi, atau PA/KPA yang berhalangan sementara. Setiap delegasi wajib memiliki tanggal mulai dan tanggal berakhir yang tegas. Selama rentang tersebut sistem mengizinkan duplikasi peran sementara pada seksi yang sama dan secara otomatis menonaktifkan hak transaksi pejabat definitif. Penugasan definitif tetap tercatat dan tidak dihapus. Delegasi tidak memakai mekanisme mutasi. Nama pejabat Plh./Plt. tampil dengan keterangan atribut jabatan di bawahnya, misalnya "Plh. PPTK Seksi X".
8. **Validasi Perangkapan Delegasi:** Sistem menolak penunjukan Plh./Plt. jika personel yang ditunjuk sedang memegang peran yang bertentangan pada TA tersebut, sesuai poin 1. Aturan ini ditegakkan di server.
9. **Larangan Verifikasi Mandiri:** Tidak ada personel yang boleh memverifikasi SPJ yang ia ajukan atau kelola sendiri, baik saat berstatus pejabat definitif maupun sebagai Plh./Plt. PPTK. Sistem menolak aksi verifikasi mandiri ini di server.
10. **Pengakhiran Delegasi:** Delegasi Aktif berakhir otomatis oleh sistem pada pukul 23:59 WITA pada tanggal berakhir (end_date). Admin dapat mencabut delegasi lebih awal apabila pejabat definitif kembali lebih cepat dari jadwal. Pencabutan dini wajib disertai alasan tertulis dan tercatat di Jejak Audit.
11. **Snapshot Penandatangan Dokumen:** Nama dan NIP pejabat yang tampil pada kuitansi, lembar Hasil Verifikasi SPJ, dan dokumen cetak lainnya diambil dari penugasan aktif yang berlaku pada waktu dokumen dibuat. Untuk kuitansi, waktu tersebut adalah saat kuitansi disimpan di sistem, bukan Tanggal Kuitansi yang dapat diisi mundur. Untuk SPJ dan Hasil Verifikasi SPJ, waktu tersebut adalah saat SPJ diajukan ke Verifikator dan berstatus Terkunci. Cetak ulang selalu merujuk snapshot asli dan tidak berubah setelah delegasi berakhir. Dokumen yang dibuat sebelum tanggal mulai delegasi tetap atas nama pejabat definitif.

---

#### Dokumen 02 §6

## 6. BKU, koreksi, dan pencabutan berjenjang
BKU menandai penyelesaian pembukuan oleh Bendahara dan mengubah komitmen menjadi realisasi kas.

1. **Koreksi tanpa pencabutan:** Bendahara dapat mengoreksi No. BKU atau tanggal BKU tanpa mencabut BKU, selama nominal tidak berubah. Sistem mengecek keunikan No. BKU. Setiap koreksi tercatat di Jejak Audit dengan nilai lama dan nilai baru.
2. **Pencabutan berjenjang:** Untuk mencabut BKU yang salah, urutan yang terkunci adalah:
   1. Bendahara mencabut BKU; pencabutan tercatat di Jejak Audit.
   2. Verifikator mengembalikan SPJ menjadi Draft dengan catatan.
   3. Seksi melepas SPJ dari kuitansi.
   4. Seksi membatalkan kuitansi.
   5. Sistem memulihkan komitmen/saldo SPD terkait.
3. **Pembatalan tanpa jejak mutlak:** Pembatalan kuitansi atau SPJ Draft benar-benar dihapus tuntas dari sistem tanpa meninggalkan jejak. Seluruh entri Jejak Audit yang terkait kuitansi atau SPJ tersebut, termasuk riwayat pencatatan, koreksi, dan pencabutan BKU, ikut terhapus bersih secara otomatis oleh sistem bersama data kuitansi atau SPJ. Tidak ada rekaman pembatalan yang tersisa di audit trail.

#### Dokumen 04 §3

## 3. Identitas personel, histori pangkat/gelar, dan akun login
- **Identitas Angka Fleksibel:** Jika memiliki NIP gunakan NIP; jika tidak memiliki NIP gunakan NIK. Input hanya menerima karakter angka, tanpa batasan kaku persis 18 atau 16 digit. Nilai angka wajib unik di direktori personel (validasi keunikan mengecualikan profil yang sedang diedit).
- **Atribut Wajib:** Nama lengkap, pangkat/golongan, Tanggal Mulai Berlaku (TMT), dan Nomor WhatsApp (hanya angka dan tanda +).
- **Atribut Opsional:** Gelar depan dan gelar belakang.
- **Histori Pangkat & Gelar Berversi:**
  - Setiap personel memiliki relasi ke tabel/log histori pangkat & gelar.
  - Saat pendaftaran baru, sistem otomatis mencatat entri histori awal.
  - Saat edit profil, jika terjadi perubahan pangkat atau gelar, sistem menyediakan opsi *"Simpan sebagai perubahan baru"*. Jika dipilih, periode sebelumnya ditutup dan catatan periode baru dibuat dengan TMT baru.
- **Akun Login Terpisah & Username Otomatis:**
  - Akun dikelola melalui dialog kelola akun terpisah.
  - Username dibangkitkan otomatis dari NIP personel (atau NIK jika NIP kosong).
  - Password minimal 6 karakter.
  - Status akun bertipe enum tegas: `Belum Ada Akun`, `ACTIVE`, `NON-ACTIVE`.
  - Menonaktifkan akun menjadi `NON-ACTIVE` tidak menghapus data personel maupun riwayat penugasan historisnya.
  - Menonaktifkan akun wajib disertai alasan yang tercatat di Audit Event. Admin tidak dapat menonaktifkan akun miliknya sendiri atau Admin ACTIVE terakhir.
  - Sebelum menonaktifkan, sistem menampilkan penugasan aktif yang terdampak. Penugasan tidak berubah otomatis.

- **Akun Pengawas/Auditor (terpisah dari personel):** Dibuat Admin dengan nama, instansi asal, nomor dan tanggal surat tugas (wajib), email, dan tanggal akhir akses. Password awal ditetapkan Admin (minimal 6 karakter) dan dikelola Admin seperti akun lain; pengguna tidak diwajibkan mengganti password saat login pertama. Akun tidak masuk Master Personel dan tidak memiliki histori pangkat atau gelar.
- **Spesifikasi Sesi Autentikasi & Isolasi Konteks (Single-Context Session):**
  - Autentikasi mendukung *single-field identifier* untuk NIP/NIK (personel) dan Email (auditor).
  - Objek payload sesi aktif mengikat secara atomik: `user_id`, `actor_type` (`internal` atau `auditor`), `active_ta_id`, `active_role`, dan `active_seksi_id` (khusus PPTK).
  - Akun selain Admin berstatus terkunci setelah 10 kali gagal login berturut-turut; hanya reset password oleh Admin yang memulihkannya. Akun Admin tidak dikunci, dan reset password Admin dilakukan melalui backend. Sesi berakhir otomatis setelah 1 jam tanpa aktivitas.
  - Sesi bersifat tunggal dan statis selama masa login. Tidak ada endpoint atau mekanisme mutasi `active_ta_id` atau `active_role` dalam sesi berjalan. Setiap perubahan TA atau peran mewajibkan terminasi token/sesi (*hard logout*) dan pembentukan sesi baru via login ulang.

#### Dokumen 01 §3.3

### 3.3 Topbar dan Mini Progress Bar
Istilah navbar pada seluruh dokumen berarti topbar. Navigasi menu memakai sidebar untuk semua peran kecuali Pengawas/Auditor. Topbar menampilkan label TA aktif dan peran aktif (tanpa dropdown ganti TA atau peran), mini progress bar realisasi terhadap pagu, dan tombol logout. Mini progress bar disertai angka sesuai cakupan peran:

| Peran | Isi mini progress bar topbar |
|---|---|
| Bendahara, PA/KPA, Verifikator | Pagu, realisasi, sisa SPD bebas, dan serapan seluruh instansi |
| PPTK | Pagu, realisasi, dan sisa SPD bebas seksinya saja |
| Admin | Pagu Induk saja |
| Pengawas/Auditor | Tidak ada mini progress bar dan tidak ada sidebar |

---

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **B-8** (FND-01): Perubahan Master SOTK tidak mengubah snapshot dan transaksi TA lama.
- **C-17a** (FND-03): Jendela waktu input dan tanggal arsip memakai zona waktu WITA (UTC+8).
- **D-19** (FND-05): Kuitansi aktif mengurangi SPD bebas sebagai komitmen; BKU mengurangi/menandai realisasi kas.
- **D-23** (AUD-01): Setiap efisiensi/pergeseran tercatat dengan aktor, waktu, sumber, tujuan/nilai dan referensi.
- **D-23a** (AUD-01): Setiap entri audit mencatat ID akun pelaku dan snapshot nama, NIP/NIK, serta peran saat aksi. Efek otomatis sistem tercatat atas nama pemicunya dengan penanda otomatis.
- **D-23h** (AUD-01): Sahkan, perubahan alokasi setelah pengesahan atau APBD-P, verifikasi SPJ disetujui atau dikembalikan, dan pencatatan BKU tercatat di Jejak Audit. Login dan logout tidak tercatat.
- **E-26** (FND-01): Transaksi lama tetap menunjuk snapshot anggaran yang berlaku saat transaksi diterbitkan.
- **F-33a** (AUD-02): Pembatalan kuitansi Aktif atau SPJ Draft benar-benar menghapus data kuitansi dan seluruh entri Jejak Audit terkait (termasuk riwayat BKU/pencabutan BKU jika pernah dicatat) secara otomatis dan bersih tanpa jejak. Sistem tidak menyediakan penomoran kuitansi.
- **G-39** (FND-02, FND-06): PPTK hanya dapat membuka seksinya sendiri. Kartu Pagu Induk tidak tampil, dan permintaan data seksi lain melalui URL ditolak di server.
- **G-40** (FND-02): PA/KPA tidak dapat membuka tingkat rekening belanja. Permintaan langsung ke data rekening ditolak di server.
- **G-41** (FND-02): Admin tidak dapat membuka halaman drill-down anggaran maupun memanggil datanya melalui URL atau pemanggilan langsung.
- **G-42** (FND-01): TA berstatus Arsip Read-Only menampilkan drill-down dari snapshot. Perubahan Master SOTK atau Master Subkegiatan setelahnya tidak mengubah angka yang tampil.
- **G-43** (FND-04): Nominal tampil dalam Rupiah dengan pemisah ribuan titik; kode subkegiatan dan kode rekening belanja tampil sebagai teks dan tidak diformat sebagai angka.
- **H-50** (FND-02): Pengawas hanya dapat membuka laporan dan Jejak Audit. Drill-down anggaran, master, akun, dan tombol proses ditolak di server meskipun URL diakses langsung.
- **H-52** (UIX-03): Pengawas tidak melihat countdown, banner merah, maupun bar navbar.
- **H-53** (UIX-03): Bar navbar sesuai peran: Bendahara, PA/KPA, dan Verifikator melihat angka seluruh instansi; PPTK hanya seksinya; Admin hanya Pagu Induk; Pengawas tanpa bar.
- **I-64g** (FND-02): Bendahara, PPTK, Verifikator, PA/KPA, Pengawas/Auditor, dan Publik ditolak di server saat membuka Visual Live Editor, tab pratinjau, atau melalui pemanggilan langsung.
- **J-69** (AUD-02): Setelah penghapusan TA, seluruh data TA (kuitansi, SPJ, BKU, lampiran, isian form, alokasi, penugasan, snapshot, dan entri audit terkait) tidak dapat ditemukan di database aktif maupun penyimpanan berkas, dan tidak ada catatan penghapusan.
- **J-70** (FND-02): Penghapusan TA ditolak di server untuk seluruh peran selain Admin, termasuk melalui URL atau pemanggilan langsung.
- **M-97** (FND-05): Dua pengajuan serentak dengan identitas dan jadwal yang sama tidak dapat sama-sama lolos; validasi bentrok dan transisi status dilakukan secara atomik di server.
- **P-117** (AUT-01): **Input Identitas Terpadu (Single-Field Identifier):** Sistem memvalidasi kredensial login melalui satu field gabungan; input angka dipetakan ke NIP/NIK personel internal, sedangkan input berformat email dipetakan ke akun Pengawas/Auditor.
- **P-118** (AUT-02): **Akses Langsung Admin:** Pengguna dengan role Admin berhasil login dan langsung diarahkan ke Dasbor Administrasi Global tanpa melalui layar seleksi TA atau jabatan.
- **P-119** (AUT-02): **Akses Langsung Auditor:** Akun Pengawas/Auditor dengan penugasan pada tepat satu TA langsung diarahkan ke Dasbor Pengawas TA tersebut (mode baca laporan & jejak audit). Jika ditugaskan pada lebih dari satu TA, sistem menyajikan layar seleksi TA penugasan terlebih dahulu lalu langsung membuka dasbor TA terpilih.
- **P-120** (AUT-02): **Auto-Skip Personel Tunggal:** Personel internal yang hanya memiliki tepat 1 penugasan TA dan 1 jabatan langsung diarahkan ke dasbor operasional TA dan jabatannya tanpa jeda layar seleksi.
- **P-121** (AUT-02): **Seleksi Berjenjang Personel Multi-Penugasan:** Personel dengan penugasan di beberapa TA berhasil disajikan daftar TA penugasan; setelah memilih TA, sistem menyajikan daftar jabatan aktif pada TA tersebut sebelum membuka dasbor operasional.
- **P-122** (AUT-03, UIX-03): **Pencegahan Alih Konteks Tanpa Logout:** Sistem tidak menyediakan dropdown atau aksi ganti TA maupun ganti peran di dalam navbar/antarmuka aktif. Percobaan manipulasi parameter `ta_id` atau `role` pada request aktif ditolak server; pengguna wajib melakukan logout dan login ulang untuk berpindah TA atau jabatan.
- **P-123** (AUD-01, AUT-04): **Terminasi Sesi & Integritas Audit Trail:** Saat pengguna logout, token/sesi dihancurkan menyeluruh; login ulang dengan peran/TA lain menghasilkan jejak audit baru pada aksi-aksi sesudah login yang mencatat snapshot peran dan TA yang baru secara akurat tanpa kontaminasi sesi sebelumnya. Login dan logout itu sendiri tidak dicatat sebagai peristiwa audit.
- **P-123c** (AUT-03, AUT-08): **Auto Logout:** Sesi berakhir otomatis setelah 1 jam tanpa aktivitas. Permintaan berikutnya ditolak dan pengguna wajib login ulang. Tidak ada batas maksimum lama login dan tidak ada peringatan sebelum logout.
- **Q-124** (FND-02): Admin tidak melihat menu laporan dan ditolak di server saat URL laporan dipanggil langsung.
- **Q-129** (FND-02): Bendahara, Verifikator, dan PA/KPA dapat mengunduh lampiran SPJ seluruh seksi; Admin, Pengawas/Auditor, dan Publik ditolak, termasuk melalui URL langsung.
- **Q-131b** (FND-02): Verifikator dapat mencetak Hasil Verifikasi untuk SPJ seluruh seksi; PPTK hanya untuk seksinya. Pencetakan oleh Admin, Bendahara, PA/KPA, Pengawas/Auditor, atau Publik ditolak di server, termasuk melalui URL langsung.
- **Q-135** (UIX-03): Pengawas/Auditor tidak melihat sidebar dan mini progress bar; layout Pengawas tetap menu atas tanpa bar.
- **R-146** (FND-02, FND-06): Pencarian dan filter hanya mengembalikan data dalam cakupan peran. PPTK tidak menemukan kuitansi seksi lain melalui pencarian; kata kunci yang mengarah ke data di luar cakupan tidak menghasilkan baris, termasuk melalui pemanggilan langsung.
- **S-151** (UIX-01): Portal publik memakai token Tema Treasury yang sama dengan login dan Pro Mode, yaitu latar, permukaan, garis tepi, huruf sans-serif, dan monospace untuk angka. Uji dilakukan dengan memeriksa nilai token pada CSS dan tampilan di kedua mode.
- **S-152** (UIX-04): Pada layar besar dan fullscreen, portal menampilkan kepadatan Pro Mode berupa ticker, donut, gauge, dan bar peringkat dengan huruf yang lebih besar. Pada layar di bawah 768 px, tata letak beralih ke mode standar satu kolom tanpa kehilangan elemen data.
- **S-153** (UIX-05): Setiap status atau zona pada portal memakai ikon dan teks, tidak hanya warna. Kontras teks normal minimal 4,5:1 dan teks besar serta ikon minimal 3:1, diuji dengan alat pemeriksa kontras.
- **S-154** (UIX-05): Seluruh isi portal dapat dijangkau dengan keyboard. Fokus terlihat sebagai cincin amber 2 px, dan transisi tidak berjalan bila pengguna memilih pengurangan gerak.
- **T-155** (FND-02): Menu Penyusunan Laporan Kustom tampil untuk Bendahara, PPTK, PA/KPA, dan Verifikator, dan berupa halaman sendiri, bukan pop-up. Admin, Pengawas/Auditor, dan Publik ditolak di server, termasuk melalui URL langsung.
- **T-156** (FND-02): PPTK hanya dapat memilih cakupan seksinya sendiri. Permintaan dengan seksi lain ditolak di server.
- **T-157** (FND-02): PA/KPA tidak dapat memilih kolom Uraian Kuitansi, Nama Penerima, NIP/NIK, Nomor Rekening, Kode Rekening Belanja, atau Nama Rekening Belanja. Pratinjau atau unduhan yang memuat salah satu kolom tersebut ditolak seluruhnya di server, termasuk melalui pemanggilan langsung.
- **U-164** (FND-02): Heatmap Sebaran Realisasi Bulanan tampil hanya untuk PA/KPA. Admin, Bendahara, PPTK, Verifikator, Pengawas/Auditor, dan Publik ditolak di server, termasuk melalui URL langsung dan pemanggilan data.
- **U-165** (FND-02): Baris matriks PA/KPA berhenti di tingkat subkegiatan. Server tidak mengirim baris rekening belanja untuk PA/KPA, termasuk melalui pemanggilan langsung.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.