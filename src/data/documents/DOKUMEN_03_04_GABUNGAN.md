# DOKUMEN 03 DAN 04 (GABUNGAN)

Berkas ini hanya menggabungkan dokumen di bawah secara berurutan, tanpa mengubah isinya.

<!-- ===== AWAL DOKUMEN 03: DOKUMEN_03_WORKFLOW_OPERASIONAL_ROLE_v1.58.md ===== -->

# DOKUMEN 03: WORKFLOW OPERASIONAL PER ROLE
**Sistem:** AMANDA (Aplikasi Manajemen Data Anggaran)  
**Status:** Terkunci & Disahkan (Single Source of Truth)  
**Tahun dokumen:** 2026
**Versi:** 1.58 (2 November 2026)


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

## 2. Admin
### 2.1 Menyiapkan master data
1. Mengelola Master SOTK datar: tambah unit atau buat versi pengganti dengan tanggal efektif; versi lama berakhir H-1 dan diarsipkan read-only.
2. Mendaftarkan personel dan mengelola histori:
   - Identitas Utama: Jika memiliki NIP gunakan NIP; jika tidak memiliki NIP gunakan NIK. Tidak ada batas kaku 18 atau 16 digit, input hanya angka dan wajib unik (kecuali terhadap profil diri sendiri saat edit).
   - Struktur Nama & Gelar: Nama lengkap (wajib), gelar depan (opsional), gelar belakang (opsional).
   - Data Wajib Tambahan: Pangkat/golongan (wajib), Tanggal Mulai Berlaku / TMT (wajib), dan Nomor WhatsApp (wajib, hanya angka dan tanda +).
   - Histori Pangkat & Gelar Berversi: Saat personel baru disimpan, sistem otomatis membuat entri awal histori pangkat dan gelar. Saat edit, jika pangkat/gelar berubah, tersedia opsi "Simpan sebagai perubahan baru" (menutup periode lama dan membuat periode baru berjejak) untuk menjamin akurasi dokumen historis.
   - Ringkasan Statistik & Navigasi: Halaman Manajemen Personel menyajikan kartu statistik (Total Personel, Akun Aktif, Entri Histori) serta navigasi ke Unit Kerja (tautan ke Master SOTK) dan Peta Jabatan (daftar penugasan per TA: PA/KPA, Bendahara, Verifikator, dan PPTK per seksi beserta SK dan delegasi). Penugasan dikelola melalui halaman Peta Jabatan.
3. Mengelola Akun Login (Dialog Kelola Akun):
   - Akses via tombol khusus "Akun" pada tabel personel.
   - Username otomatis dibuat oleh sistem dari NIP (atau dari NIK jika personel tidak memiliki NIP).
   - Jika belum memiliki akun, Admin dapat membuat akun baru dengan password minimal 6 karakter.
   - Jika akun sudah ada, Admin dapat mengatur ulang password dan mengubah status akun menjadi ACTIVE atau NON-ACTIVE.
   - Status akun pada tabel ditampilkan secara tegas: Belum Ada Akun, ACTIVE, atau NON-ACTIVE.
   - Menonaktifkan akun hanya memutus akses login. Penugasan dan riwayat personel tidak berubah; penugasan aktif tetap tercatat sampai diakhiri melalui mutasi.
   - Sebelum menonaktifkan, sistem menampilkan daftar penugasan aktif yang terdampak. Untuk Bendahara atau PPTK, peringatan menyebut bahwa transaksi seksi terkait terhenti sampai ada pengganti aktif. Alasan wajib diisi dan tercatat di Jejak Audit.
   - Admin tidak dapat menonaktifkan akun miliknya sendiri, dan tidak dapat menonaktifkan Admin ACTIVE terakhir.
   - Daftar penugasan menandai "akun NON-ACTIVE, penugasan masih aktif" sebagai peringatan.
3a. Mengelola Akun Pengawas/Auditor secara terpisah dari personel: membuat akun dengan nama, instansi asal, nomor dan tanggal surat tugas (wajib), email, dan tanggal akhir akses; menetapkan password awal; mengatur ulang password; mengubah status ACTIVE atau NON-ACTIVE dengan alasan tercatat. Password tidak diwajibkan diganti saat login pertama (Dokumen 01 §8).
4. Mengelola kamus global Subkegiatan dan Rekening Belanja tanpa menempelkan pagu lintas TA. Tidak ada daftar pasangan subkegiatan dan rekening yang dibatasi. Mengelola Master Jenis Pajak sebagai pilihan pajak pada SPJ.
5. Mengelola template Hasil Verifikasi SPJ, format nomor verifikasi Hasil Verifikasi SPJ per TA, dan template kuitansi universal dan Form Dinamis SPJ, termasuk menandai setiap field sebagai wajib atau opsional (Dokumen 01 §9 poin 8), membuat paling banyak satu blok berulang per form (Dokumen 01 §9 poin 9), serta mengonfigurasi tag sistem perjalanan dinas sesuai Dokumen 01 §11. Sebelum menyimpan, Admin dapat menguji form melalui tab "Pratinjau Langsung" di Visual Live Editor sesuai Dokumen 01 §9 poin 11.
6a. Mengelola Direktori Transaksional SPJ secara terpisah dari Master Personel: melihat daftar identitas yang terkumpul dari SPJ, mengoreksi nama/NIP/NIK, dan menggabungkan entri duplikat sambil menjaga relasi SPJ historis. Perubahan direktori dicatat sesuai Jejak Audit administratif. Direktori tidak membuat profil Master Personel atau akun login.
6. Melihat dashboard dengan countdown dan banner merah (mode baca saja), kartu TA beserta Pagu Induk, serta status TA. Admin tidak melihat alokasi, SPD, kuitansi, SPJ, verifikasi, atau BKU.
7. Membaca Jejak Audit, termasuk entri keuangan, untuk seluruh TA. Admin tidak dapat mengubah atau menghapus entri audit. Entri audit hanya terhapus otomatis bersama kuitansi atau SPJ yang dibatalkan (Dokumen 01 §6 poin 6).
8. Tidak memiliki tampilan drill-down anggaran (Dokumen 01 §7).

### 2.2 Membuat dan menyiapkan Workspace TA
1. Membuat TA, menetapkan Pagu Induk SKPD, dan memulai dengan status Draft.
2. Opsional menyalin hanya seksi aktif dan pemetaan subkegiatan dari TA sebelumnya. Pagu, SK dan mutasi tidak disalin.
3. Menarik seksi dari Master SOTK sebagai snapshot TA dan memetakan subkegiatan. Satu subkegiatan hanya dimiliki satu seksi pada TA yang sama; seksi boleh memiliki banyak subkegiatan.
4. Menetapkan PA/KPA, Bendahara, Verifikator tingkat instansi, dan PPTK untuk setiap seksi aktif. Satu personel sah dan diperbolehkan ditugaskan sebagai PPTK pada lebih dari satu seksi di TA yang sama jika diperlukan (misal karena keterbatasan pejabat). Pengawas/Auditor dapat ditugaskan ke TA tanpa seksi.
5. Mencatat SK; bila dokumen resmi terlambat, penugasan provisional dapat digunakan dan berkas/nomor SK dilengkapi kemudian.
6. Memeriksa konfigurasi sebelum mengaktifkan TA. Draft tanpa transaksi boleh dihapus; TA yang pernah memiliki kuitansi tidak boleh dihapus, meskipun kuitansinya sudah dihapus, kecuali melalui retensi 12 tahun (§2.3).
   - Sistem menolak aktivasi TA kedua selama masih ada satu TA berstatus Aktif Penuh.
   - Admin mengaktifkan TA secara manual. Sistem menampilkan checklist kesiapan (pagu induk, seluruh seksi terpetakan, penugasan PA/KPA, Bendahara, Verifikator, dan PPTK, serta SK atau penugasan provisional) dan hanya mengizinkan pengaktifan jika checklist lengkap. Checklist dihitung otomatis dari data dan tidak dapat dilewati.

### 2.3 Perubahan selama TA
- Mencatat mutasi SOTK atau pejabat dengan tanggal efektif dan audit trail; penugasan lama berakhir sehari sebelum penugasan pengganti.
- Menetapkan penugasan Delegasi Aktif (Plh./Plt.) dengan tanggal mulai dan tanggal berakhir, serta mencabutnya lebih awal dengan alasan tertulis. Sistem menolak penunjukan jika personel memegang peran yang bertentangan pada TA tersebut (Dokumen 01 §6 poin 8).
- Mengaktifkan fase APBD-P dan menetapkan Pagu Induk perubahan. Pembagian ulang dilakukan melalui alur Bendahara lalu PPTK/Seksi, bukan dengan menghapus histori.
- Menetapkan status TA ke Masa Transisi/Tutup Buku lalu Arsip Read-Only pada akhir siklus. Seluruh perpindahan status dilakukan Admin secara manual; sistem tidak memindahkan status berdasarkan tanggal. Sebelum menetapkan Arsip Read-Only, sistem menampilkan SPJ atau BKU yang belum selesai sebagai peringatan; keputusan tetap di tangan Admin.
- Admin tidak membagi pagu ke subkegiatan/rekening, tidak mengelola efisiensi SPD atau pergeseran, dan tidak membuat kuitansi, SPJ, verifikasi, atau BKU.
- Membuka kembali TA Arsip Read-Only secara manual bila diperlukan; TA menjadi Masa Transisi / Tutup Buku, dan Admin dapat mengembalikannya ke Aktif Penuh selama tidak ada TA lain yang Aktif Penuh. Perpindahan mundur lain tidak diizinkan. Setiap kali TA diarsipkan kembali, masa retensi dihitung ulang dari tanggal arsip terbaru.
- Setelah TA Arsip Read-Only melewati 12 tahun sejak tanggal arsip terakhir (WITA), Admin dapat menghapus TA secara manual. Sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran tanpa nominal, lalu Admin mengetik kode TA untuk konfirmasi. Penghapusan total menghapus seluruh data TA, lampiran, dan jejak audit terkait, tanpa catatan penghapusan. Salinan cadangan platform mengikuti kebijakan platform.

### 2.4 Pratinjau form dinamis (Admin)
1. Admin membuka tab "Pratinjau Langsung" di halaman Visual Live Editor, berdampingan dengan tab "Konfigurasi Editor". Pratinjau tidak dibuka sebagai pop-up, dan Admin berpindah tab tanpa kehilangan draf.
2. Pratinjau merender draf form yang belum disimpan, termasuk field wajib, blok berulang dengan tombol "+ Tambah", dan tag sistem, sesuai tampilan pengisian PPTK.
3. Field wajib yang dikosongkan memunculkan peringatan dan simulasi pengajuan ditolak. Field opsional yang kosong tetap diterima.
4. NIP/NIK pada field bertag dicari secara read-only di Direktori Transaksional SPJ. Jika ditemukan, nama terisi otomatis. Pencarian ini tidak mengubah direktori dan tidak menambah entri Jejak Audit.
5. Cek bentrok jadwal di pratinjau memakai data contoh yang terisolasi dan tidak membaca atau menampilkan SPJ operasional.
6. Isian pratinjau hanya berada di memori browser. Tidak ada data yang disimpan ke server, dan tidak membentuk kuitansi, SPJ, BKU, atau entri Jejak Audit.
7. Pratinjau hanya dapat diakses Admin. Peran lain ditolak oleh server, termasuk saat mengakses alamat secara langsung.
8. Uji batas satu blok berulang dilakukan di Form Builder, bukan di pratinjau. Pratinjau hanya menguji kenyamanan pengisian field bagi PPTK.
(Dokumen 01 §9 poin 11; Dokumen 05 skenario 64a sampai 64g.)

## 3. Bendahara Pengeluaran
1. Membagi Pagu Induk ke subkegiatan sesuai DPA hingga total sama dengan Pagu Induk. Pagu seksi dihitung otomatis.
2. Mengatur jendela waktu input alokasi (WITA) dan memantau countdown serta status penyelesaian seluruh seksi.
3. Menangani pembukaan kembali jendela input bila diperlukan. Selama ada seksi belum seimbang, gatekeeper menahan pembuatan kuitansi dan SPJ baru untuk semua seksi. Pemrosesan SPJ yang sudah ada dan pencatatan BKU tetap berjalan.
4. Mengelola efisiensi dengan menurunkan SPD, maksimal sebesar sisa SPD bebas.
5. Melakukan pergeseran anggaran; Seksi tidak memiliki kewenangan pergeseran. Sumber dibatasi sisa SPD bebas dan setiap perubahan berjejak. Tujuan pergeseran harus pasangan subkegiatan dan rekening yang sudah dialokasikan.
6. Pada APBD-P, mengalokasikan pagu perubahan ke subkegiatan dan mengkoordinasikan penyelesaian alokasi rekening oleh PPTK.
7. Mencatat No. BKU dan tanggal BKU saat pembukuan, satu BKU per kuitansi. No. BKU diinput secara manual oleh Bendahara (bukan auto-number) dan wajib unik per TA. BKU AMANDA murni mencatat realisasi pengeluaran kas belanja per kuitansi/SPJ tanpa mencatat transaksi penerimaan kas (SP2D, UP, GU, TU) maupun saldo kas riil. Sistem membebaskan tanggal BKU tanpa batasan urutan kronologis terhadap tanggal kuitansi atau tanggal SPJ. Mengoreksi No. BKU atau tanggal BKU tanpa pencabutan jika nominal tidak berubah, dengan jejak di Jejak Audit. Mencabut BKU dan mengikuti urutan pencabutan berjenjang (Dokumen 02 §6).
8. Menekan tombol "Sahkan" setelah seluruh seksi berstatus Seimbang. SPD terbit sebesar pagu yang disahkan.
9. Tidak boleh merangkap PPTK/Seksi pada TA yang sama.
10. Melihat tampilan anggaran berjenjang seksi → subkegiatan → rekening belanja, dengan nilai pagu, realisasi, komitmen, sisa SPD bebas, serapan, dan status pada setiap tingkat.
11. Jejak Audit: hanya melihat entri aksinya sendiri.

- Menyusun dan mengunduh laporan kustom untuk seluruh seksi, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12).

## 4. PPTK / Seksi
1. Melihat seksi dan subkegiatan yang ditetapkan untuknya pada TA.
2. Setelah alokasi Bendahara tersedia, membagi pagu subkegiatan ke rekening belanja hingga total rekening sama persis dengan pagu subkegiatan. Satu rekening belanja dapat dialokasikan di lebih dari satu subkegiatan milik seksinya; setiap pasangan dialokasikan terpisah dan pasangan yang sama tidak boleh ganda.
3. Menyelesaikan alokasi sesuai tenggat. Jika satu seksi belum seimbang, pembuatan kuitansi ditahan untuk semua seksi.
4. Setelah gatekeeper terbuka, membuat kuitansi dengan memilih subkegiatan dan rekening, mengisi nominal bruto, uraian, penerima dan tanggal kuitansi.
5. Kuitansi mengikat saldo SPD sebagai komitmen. SPJ merupakan alur terpisah setelah kuitansi, sesuai aturan SPJ yang disepakati. Kuitansi Aktif dapat diedit atau dibatalkan sampai SPJ Draft dibuat pada status TA Aktif Penuh; pada Masa Transisi kuitansi Aktif hanya dapat dibatalkan, tidak diedit. Sejak SPJ Draft dibuat, kuitansi Terkunci. SPJ Draft dapat dilepas atau dibatalkan, dan kuitansinya kembali Aktif.
6. Seksi tidak boleh melakukan pergeseran anggaran.
7. Tidak melihat Pagu Induk instansi. Jejak Audit yang terlihat hanya entri milik seksinya sendiri.
8. Melihat drill-down anggaran hanya untuk seksinya: seksi → subkegiatan → rekening belanja.
9. Mengunduh laporan seksinya dalam PDF atau Excel (Dokumen 01 §9).
10. Mengisi Form Dinamis SPJ sesuai jenis belanja yang dipilih di awal SPJ. Jika form memiliki blok berulang, PPTK menambah entri sesuai jumlah item atau orang yang dicakup SPJ (Dokumen 01 §9 poin 9).

11. Mengisi pajak pada SPJ setelah isian SPJ disimpan: memilih jenis pajak dari Master Jenis Pajak, mengisi nominal secara manual, dan dapat menambah beberapa entri. Sistem tidak menghitung pajak secara otomatis dari tarif atau master. Satu-satunya perhitungan otomatis terkait pajak adalah Total Pajak, yaitu jumlah seluruh entri pajak, dan Jumlah yang dibayarkan, yaitu nilai bruto dikurangi Total Pajak. Sistem menolak penyimpanan jika Total Pajak melebihi nilai bruto kuitansi dan menampilkan pesan validasi yang menjelaskan batas tersebut (Dokumen 02 §5).
12. Mengunduh lampiran PDF SPJ seksinya (Dokumen 02 §9).
13. Mencetak Hasil Verifikasi SPJ dengan barcode untuk SPJ seksinya setelah SPJ disetujui Verifikator (Dokumen 02 §8).
14. Selama menjadi Plh./Plt. PPTK, menjalankan kewenangan PPTK untuk seksinya. Tidak memverifikasi SPJ yang ia ajukan atau kelola sendiri (Dokumen 01 §6 poin 9).

- Menyusun dan mengunduh laporan kustom untuk seksinya sendiri, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12).

## 5. Verifikator
1. Memeriksa SPJ yang diajukan Seksi.
2. Menyetujui untuk diteruskan ke proses pembukuan atau mengembalikan ke Seksi sebagai Draft dengan catatan revisi wajib.
3. Pengembalian membuka kunci SPJ menjadi Draft, tetapi tidak melepaskan kuitansi atau komitmen SPD.
4. Mengikuti urutan pencabutan berjenjang ketika BKU dicabut dan transaksi harus dikembalikan.
5. Melihat Pagu Induk pada kartu TA dan seluruh Jejak Audit TA, dalam mode baca saja.
6. Melihat drill-down anggaran seluruh seksi sampai rekening belanja, dalam mode baca saja.
7. Mengunduh laporan seluruh seksi dalam mode baca saja (Dokumen 01 §9).
8. Mengunduh lampiran PDF SPJ seluruh seksi (Dokumen 02 §9).
9. Mencetak Hasil Verifikasi SPJ dengan barcode dan nomor verifikasi untuk SPJ seluruh seksi setelah SPJ disetujui (Dokumen 02 §8).
10. Tidak memverifikasi SPJ yang ia ajukan atau kelola sendiri, baik sebagai pejabat definitif maupun Plh./Plt. PPTK (Dokumen 01 §6 poin 9).

- Menyusun dan mengunduh laporan kustom untuk seluruh seksi, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12). Kolom kuitansi, NIP/NIK, Nomor Rekening, dan kolom rekening belanja tersedia, dan NIP/NIK serta Nomor Rekening ditampilkan penuh tanpa penyamaran (Dokumen 01 §9 poin 12d dan Dokumen 05 skenario 158).

## 6. PA / KPA (Pengguna Anggaran / Kuasa Pengguna Anggaran)
1. **Peran Resmi Dokumen:** Menjadi otoritas penanggung jawab anggaran instansi yang identitasnya (nama, NIP, pangkat, jabatan) tampil otomatis pada blok tanda tangan resmi kuitansi universal (kiri atas) sesuai snapshot penugasan SK pada TA berjalan.
2. **Kewenangan Akun (Monitoring Eksekutif & Early Warning System):**
   - Mengakses Dashboard Eksekutif lintas seksi secara real-time dengan dukungan analitik cerdas *burn-rate vs time-elapsed*.
   - Memantau total Pagu Induk, progres realisasi kas BKU, sisa SPD bebas, dan serapan anggaran per seksi/subkegiatan.
   - **Widget Ringkasan Eksekutif (Early Warning Ticker):** Memantau kartu ringkasan instan di bagian atas dasbor ("X Seksi Zona Normal, Y Seksi Perlu Perhatian/Kuning/Merah, Z Seksi Terdeteksi Lonjakan/Oranye").
   - **Indikator Visual Titik Warna (Color Dot) & Tooltip:** Pada tabel drill-down per seksi, memantau ikon titik warna (🟢 Hijau, 🟡 Kuning, 🔴 Merah, 🟠 Oranye) beserta tooltip rincian deviasi burn-rate terhadap waktu berjalan. Seksi berstatus Kritis otomatis diprioritaskan di baris teratas.
   - Bersifat *read-only & advisory* (tidak membebani input transaksi atau approval berjenjang, dan tidak memblokir operasional; pengesahan transaksi tetap melalui tanda tangan fisik pada lembar kuitansi).
   - Melihat drill-down anggaran seluruh seksi sampai subkegiatan, mode baca saja; tingkat rekening belanja tidak ditampilkan.
   - Membuka arsip TA masa lalu dengan metrik analitik yang terkunci (Time Elapsed beku 100%, status historis aman dari anomali).
   - Melihat bar navbar instansi (Dokumen 01 §3.3). Laporan yang dapat dilihat: a, b, d, e, f, dan g untuk seluruh seksi, hanya data SPJ Dibukukan; kolom kuitansi tidak tampil pada b dan f (Dokumen 01 §9 poin 3). Laporan c tidak ditampilkan. Pada laporan e (Excel), NIP/NIK dan Nomor Rekening tampil penuh tanpa penyamaran (Dokumen 01 §9 poin 6). PA/KPA juga dapat mengunduh lampiran PDF SPJ seluruh seksi (Dokumen 02 §9).

- Menyusun dan mengunduh laporan kustom untuk seluruh seksi, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12).

- Melihat Heatmap Sebaran Realisasi Bulanan untuk seluruh seksi sampai tingkat subkegiatan, dalam mode baca saja (Dokumen 01 §12 poin 5). Tingkat rekening belanja tidak ditampilkan.

## 7. Pengawas / Auditor
- Mengakses laporan dan Jejak Audit pada TA yang ditugaskan (seluruh seksi) dalam mode baca saja (Dokumen 01 §8).
- Tidak memiliki akses ke analitik Burn-Rate & Early Warning Ticker (Dokumen 01 §12 poin 4).
- Tidak melihat countdown, banner merah, atau mini progress bar topbar. Tidak memiliki sidebar. Tidak dapat mengunduh lampiran SPJ.
- Tidak mengubah pagu, penugasan, kuitansi, SPJ, atau BKU, dan tidak memiliki akses master, akun, atau drill-down anggaran.
- Akun dibuat Admin dan terpisah dari Master Personel. Login ditolak setelah tanggal akhir akses.
- Aksi mengunduh atau mencetak laporan tercatat di Jejak Audit.

- Tidak memiliki akses ke Penyusunan Laporan Kustom. Pengawas/Auditor tetap memakai Katalog Laporan baku secara baca saja (Dokumen 01 §9).
- Tidak memiliki akses ke Heatmap Sebaran Realisasi Bulanan (Dokumen 01 §12 poin 5).

## 8. Urutan siklus operasional TA
1. Admin menyiapkan master dan Workspace TA.
2. Admin menetapkan pagu induk, struktur, pemetaan, pejabat dan status TA.
3. Bendahara mengalokasikan pagu ke subkegiatan.
4. PPTK/Seksi mengalokasikan pagu ke rekening belanja.
5. Gatekeeper memastikan semua seksi selesai dan seimbang.
6. Bendahara menekan "Sahkan" setelah seluruh seksi Seimbang; SPD terbit sebesar pagu yang disahkan dan transaksi kuitansi dibuka.
7. Kuitansi, SPJ, verifikasi dan BKU berjalan sesuai pemisahan proses.
8. Efisiensi/pergeseran/APBD-P dikelola pihak berwenang dengan histori. Pada APBD-P, Bendahara menekan "Sahkan" lagi setelah seluruh seksi Seimbang pada pagu perubahan (Dokumen 01 §5.2 poin 5).
9. TA ditutup dan diarsipkan read-only. Setelah 12 tahun sejak arsip terakhir, Admin dapat menghapus TA secara total (§2.3).


## 9. Pengunjung Publik (Anonim)
1. Pengunjung membuka halaman keterbukaan informasi tanpa login dan secara default melihat TA Aktif; TA terdahulu/arsip yang tersedia dapat dipilih.
2. Pengunjung membaca persentase realisasi berdasarkan BKU yang telah dibukukan, grafik distribusi status SPJ dalam bentuk cacah dan proporsi, serta peringkat seksi berdasarkan persentase realisasi.
3. Halaman dapat menampilkan donut/pie status SPJ, gauge atau busur realisasi, bar progres horizontal dan ticker ringkasan. Ticker, label, tooltip, dan tampilan fullscreen hanya menampilkan informasi yang telah diizinkan untuk publik.
4. Pengunjung dapat mengaktifkan fullscreen melalui kontrol halaman; tata letak menyesuaikan layar besar. Pintasan seperti F dapat didukung. F11 merupakan kendali browser/perangkat dan tidak dijamin oleh aplikasi.
5. Data agregat diperbarui di latar belakang setiap 15–30 menit. Pengunjung tetap anonim dan tidak memperoleh akses ke menu internal.
6. Tidak tersedia akses publik ke nominal rupiah, data sumber transaksi, kuitansi, lampiran, identitas penerima/personel, NIP/NIK, nomor rekening, akun, maupun jejak audit. Server hanya menyediakan agregat aman sebagaimana Dokumen 01 §10 dan Dokumen 04 §2.3, kecuali halaman keaslian SPJ pada poin 10 yang hanya memuat status, nama TA, nama seksi, dan tanggal verifikasi satu SPJ.
7. Tampilan portal publik memakai tema Treasury & Market Terminal (§1, Tema Visual Treasury) dengan token warna dan huruf yang sama dengan login dan Pro Mode: latar `#0B1120`, permukaan `#111827`, garis tepi `#1F2937`, huruf sans-serif untuk teks umum, dan angka monospace bertabel angka sejajar untuk persentase dan cacah. Amber dipakai untuk bar realisasi utama; teal untuk aksen sekunder dan tautan.
8. Di layar besar dan mode fullscreen, portal memakai kepadatan Pro Mode: ticker ringkasan di bagian atas, lalu donut status SPJ, gauge realisasi, dan bar peringkat seksi sesuai poin 2 dan 3. Huruf dibuat lebih besar agar terbaca dari jarak jauh. Di layar kecil, portal beralih ke mode standar satu kolom dengan kartu bertumpuk.
9. Setiap zona atau status pada portal publik wajib memakai ikon dan teks, tidak hanya warna, dan memenuhi kontras WCAG AA sebagaimana aturan Keterbacaan pada §1. Portal tidak menampilkan nominal rupiah, nomor, nama personel, atau lampiran sesuai poin 6, dan hanya menampilkan persentase, cacah, proporsi, serta peringkat seksi.
10. **Halaman terpisah:** Halaman keaslian SPJ (Dokumen 02 §8) adalah halaman publik terpisah dari portal ini. Halaman itu hanya memeriksa keaslian satu SPJ melalui token pada barcode, dengan batas tampilan mengikuti Dokumen 02 §8 poin 4. Portal ini tidak menampilkan data keaslian SPJ, dan halaman keaslian tidak menampilkan persentase, cacah, atau grafik.

## 10. Alur Validasi Bentrok Jadwal Perjalanan Dinas
1. Admin menandai field Form Dinamis perjalanan dengan `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, dan `[SYS_END_DATE]`. Pasangan ID/nama berada pada konteks yang sama; field tanggal dapat ditempatkan di tingkat dokumen atau blok sesuai cakupannya.
2. PPTK memasukkan NIP/NIK pada field bertag. Jika identitas tersedia di Direktori Transaksional SPJ, sistem mengisi nama pasangan otomatis; jika belum, PPTK mengisi nama. Untuk setiap peserta dalam Blok Berulang, lookup dan pasangan nama dilakukan pada baris yang sama.
3. PPTK dapat menyimpan, mencetak, dan melanjutkan SPJ sebagai Draft tanpa validasi bentrok yang memblokir. Ketika menekan “Ajukan ke Verifikator”, server menguji jadwal seluruh identitas pada SPJ terhadap SPJ lain di TA yang sama berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft dan SPJ yang dikembalikan untuk perbaikan diabaikan.
4. Rentang tanggal inklusif diuji dengan rumus overlap yang ditetapkan pada Dokumen 01 §11. Jika tanggal selesai kosong/sama dengan tanggal mulai, sistem memakai tanggal mulai sebagai tanggal selesai.
5. Jika bentrok, pengajuan ditolak dan SPJ tetap Draft; PPTK menerima identitas, tanggal bentrok, dan referensi pembanding secukupnya untuk koreksi, tanpa rincian SPJ atau nominal lain. Jika tidak bentrok, SPJ diajukan dan statusnya berubah sesuai workflow. Pemeriksaan server dan transisi status dilakukan atomik.
6. Saat SPJ dihapus/dibatalkan atau kembali menjadi status non-komitmen melalui alur yang berlaku, jadwalnya tidak lagi menghalangi pengajuan lain. Entri identitas pada Direktori Transaksional SPJ tetap disimpan untuk auto-fill berikutnya.
7. Verifikator hanya menerima SPJ yang berhasil melewati pemeriksaan saat diajukan. Admin mengelola koreksi dan penggabungan identitas melalui panel direktori; perubahan tidak menghapus relasi transaksi historis.

## 11. ALUR ANALITIK BURN-RATE & EARLY WARNING DASBOR PA/KPA

1. **Perhitungan Harian Otomatis (WITA):**
   - Server menghitung persentase `Time Elapsed` terhadap jumlah hari kalender TA (365/366 hari).
   - Server menghitung persentase `Budget Burn-Rate` per seksi dari total realisasi BKU yang telah dibukukan dibagi Pagu Sah Terakhir (Pagu Induk sebelum APBD-P, atau Pagu Perubahan setelah APBD-P disahkan).
   - Server mengevaluasi riwayat pembukuan BKU 14 hari terakhir per seksi untuk mendeteksi lonjakan belanja $\ge 40\%$.

2. **Penguncian pada Masa Transisi dan Arsip:**
   - Saat TA berstatus Masa Transisi atau Arsip Read-Only, `Time Elapsed` otomatis bernilai tetap 100% dan klasifikasi zona analitik dibekukan berdasarkan posisi akhir tutup buku.

3. **Penyajian pada Dasbor Eksekutif PA/KPA:**
   - Ticker ringkasan di bagian atas dasbor menampilkan rekap seksi per zona warna.
   - Tabel drill-down per seksi menyematkan indikator visual titik warna dan tooltip persentase analitik.
   - Seksi Zona Merah (Kritis) diangkat ke urutan teratas daftar untuk mempermudah supervisi.

## 12. ALUR UNGGAH LAMPIRAN SPJ: KOMPRESI PDF CLIENT-FIRST

1. PPTK memilih lampiran PDF dari perangkat lokal melalui form SPJ.
2. Peramban memeriksa tipe dan ukuran berkas sebelum upload: berkas di atas 30 MB ditolak langsung dengan pesan batas ukuran; berkas berukuran sampai dengan 5 MB dikirim langsung tanpa kompresi.
3. Untuk berkas di atas 5 MB hingga 30 MB, peramban menampilkan status "Menyiapkan dokumen..." dan mencoba mengompresi PDF secara lokal.
4. Jika proses lokal berhasil, sistem melanjutkan dengan status "Mengunggah dokumen..." dan mengirim hasil kompresi.
5. Jika proses lokal gagal, tidak tersedia, kehabisan memori, atau melewati batas waktu 15 detik, upload beralih otomatis ke jalur server fallback (kompresi sisi server). PPTK tidak perlu mengulang pilihan file karena kendala teknis kompresi lokal.
6. Setelah proses selesai, UI menampilkan status berhasil dan nama berkas asli. Sistem mencatat ukuran sebelum dan sesudah optimasi; Form Dinamis dan data Excel tidak berubah.
7. Jika worker server juga gagal mengoptimalkan atau memvalidasi berkas, sistem menyampaikan pesan yang dapat ditindaklanjuti dan tidak menandai upload sebagai berhasil.

## 13. ALUR DIREKTORI REKENING BANK & LAYAR TERBAGI (SPLIT VIEW)
1. **Latar Belakang:** Mengurangi beban pengetikan berulang data rekening penerima pembayaran bagi PPTK dan menghindari hambatan akibat validasi kaku nomor rekening.
2. **Alur Kerja PPTK pada Halaman SPJ (Split View):**
   - **Langkah 1 (Buka Lembar Kerja):** PPTK membuka formulir SPJ / rincian penerima pembayaran. Sistem menampilkan tata letak Split View (Layar Terbagi): Panel Sisi Kiri sebagai Direktori Rekening dan Panel Sisi Kanan sebagai Form SPJ.
   - **Langkah 2 (Pencarian Fleksibel):** PPTK mengetik kata kunci pencarian pada kotak pencarian di Panel Kiri. Pencarian dapat berupa sebagian nama orang, instansi/alias, atau deretan nomor rekening.
   - **Langkah 3A (Data Ditemukan):** PPTK menekan tombol *"Pilih"* pada hasil pencarian di panel kiri. Seluruh field rekening penerima di form panel kanan langsung terisi secara instan.
   - **Langkah 3B (Data Baru / Tidak Ditemukan):** PPTK langsung mengisi nama penerima, nama bank, nomor rekening, dan alias (opsional) secara manual pada form panel kanan. Tidak ada validasi unik atau format ketat yang memblokir.
   - **Langkah 4 (Auto-Capture saat Simpan):** Saat SPJ atau draf disimpan, sistem menyimpan data ke form SPJ sebagai snapshot independen dan secara otomatis menyalin entri rekening baru tersebut ke Direktori Rekening Bank sistem.
3. **Alur Pemeliharaan oleh Admin:**
   - Admin membuka menu *"Direktori Rekening Bank"*.
   - Admin dapat melihat seluruh daftar rekening yang dihimpun dari aktivitas pembuatan SPJ lintas-seksi.
   - Admin dapat melakukan standardisasi ejaan nama bank, koreksi salah ketik, atau penggabungan (*merge*) duplikasi jika ada beberapa variasi penulisan untuk satu nomor rekening yang sama.
   - Seluruh tindakan Admin hanya memengaruhi referensi pencarian baru ke depan; data SPJ yang telah disahkan/dibukukan ke BKU tetap mempertahankan snapshot aslinya.
4. **Penanganan Pembatalan SPJ Draft:**
   - Jika SPJ Draft dihapus/dibatalkan, dokumen SPJ terhapus secara bersih tanpa jejak audit. Entri rekening baru yang terlanjur tercatat di direktori tetap tersimpan di database direktori sehingga tetap dapat dipakai kembali pada transaksi berikutnya.



## 14. ISI DASBOR PER PERAN
Seluruh dasbor mengikuti batas data pada §1 dan Dokumen 01 §6–§8. Isi dasbor Admin mengikuti §2.1 poin 6; dasbor PA/KPA mengikuti §6 dan §11.

1. **Bendahara Pengeluaran:** tabel kesiapan seksi sesuai Dokumen 01 §3.1 poin 3 (Belum Input, Draft Belum Seimbang, atau Tuntas); countdown dan banner jendela alokasi; ringkasan pagu, realisasi, Sisa SPD Bebas, dan serapan; tombol "Sahkan" yang aktif hanya bila seluruh seksi Seimbang; dan daftar SPJ berstatus Menunggu BKU.
2. **PPTK/Seksi:** countdown dan banner; ringkasan seksinya sendiri; daftar kuitansi Aktif; daftar SPJ Draft; dan daftar SPJ yang dikembalikan beserta catatan revisi.
3. **Verifikator:** antrean SPJ berstatus Terkunci; jumlah SPJ yang dikembalikan dan disetujui; dan kartu Pagu Induk (baca saja).
4. **Pengawas/Auditor:** TA yang ditugaskan, nomor surat tugas, tanggal akhir akses, serta tautan ke laporan dan Jejak Audit. Tanpa analitik, countdown, banner, maupun mini progress bar.

<!-- ===== AKHIR DOKUMEN 03 ===== -->

---

<!-- ===== AWAL DOKUMEN 04: DOKUMEN_04_KAMUS_DATA_DAN_SKEMA_v1.38.md ===== -->

# DOKUMEN 04: KAMUS DATA & BLUEPRINT RELASI ENTITAS
**Sistem:** AMANDA (Aplikasi Manajemen Data Anggaran)  
**Status:** Blueprint Konseptual Disahkan (Aturan Logika Terkunci, Skema Fisik Keputusan Teknis)  
**Tahun dokumen:** 2026
**Versi:** 1.38 (2 November 2026)


## 1. Tujuan dan batas
Dokumen ini menjelaskan entitas dan aturan integritas berdasarkan keputusan bisnis yang telah dikunci. Istilah yang dipakai di seluruh dokumen dijelaskan di §9. Nama tabel, tipe database, indeks, dan migrasi fisik masih merupakan keputusan teknis saat implementasi; jangan menganggap dokumen ini sebagai SQL final.

## 2. Domain data global dan data per TA
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

### 2.3 Proyeksi agregat publik (tanpa akses data sumber)
| Proyeksi konseptual | Data yang boleh disajikan | Aturan |
|---|---|---|
| Statistik Keterbukaan Publik per TA | ID/tahun TA, total cacah SPJ, cacah per kategori status, persentase per kategori, persentase realisasi BKU terhadap pagu, waktu pembaruan | Hasil agregasi dihitung di server. Tidak ada nominal pagu/realisasi/sisa atau baris transaksi dalam payload publik. TA Aktif menjadi default; TA historis hanya untuk workspace yang tersedia. |
| Peringkat Realisasi per Seksi | ID seksi TA, nama snapshot seksi, persentase realisasi BKU terhadap pagu seksi, urutan peringkat | Hanya nama seksi dan persentase yang keluar ke pengunjung. Seksi dengan denominator nol/tidak tersedia tidak diberi persentase buatan dan ditandai belum tersedia. |
| Status Keaslian SPJ (halaman keaslian, Dokumen 02 §8) | Status Berlaku atau Tidak berlaku, nama TA, nama seksi, dan tanggal verifikasi; hanya untuk satu token yang diperiksa | Pengecualian terbatas dari portal agregat. Tidak ada persentase, cacah, nominal, identitas, lampiran, atau jejak audit. Token tidak dikenal atau tidak berlaku menghasilkan respons seragam. Tidak ada daftar atau pencarian token. |

- Rumus persentase realisasi publik: total BKU dibukukan ÷ pagu yang berlaku pada TA/cakupan yang sama × 100%. Komitmen kuitansi belum dibukukan tidak dihitung sebagai realisasi. Kalkulasi dilakukan di server; nominal mentah tidak dipulangkan ke klien.
- Kategori cacah SPJ: Selesai/Dibukukan BKU, Dalam Verifikasi, Perlu Perbaikan, dan Draf/Persiapan PPTK. Kategori saling eksklusif dan satu SPJ hanya masuk satu kategori. Karena status Draft dapat berasal dari persiapan atau pengembalian, pembeda workflow perlu direpresentasikan eksplisit sebagai status/penanda agar agregat akurat.
- Grafik pie/donut, gauge/busur, progres horizontal, ticker, dan fullscreen hanya memakai agregat yang diizinkan. Tooltip maupun metadata chart tidak boleh menyertakan nominal atau detail sumber. Pembaruan agregat dilakukan setiap 15–30 menit.
- Skema fisik, nama tabel, materialized view, endpoint, dan strategi cache merupakan keputusan teknis implementasi; proyeksi di atas adalah batas kontrak data, bukan SQL final.
- Akses anonim hanya boleh membaca proyeksi ini, ditambah baris status keaslian SPJ di atas yang hanya dapat dibuka melalui token pada barcode. Endpoint publik tidak boleh menyediakan akses ke tabel transaksi, file lampiran, identitas, atau audit.

### 2.4 Direktori Transaksional SPJ dan validasi jadwal
- Direktori Transaksional SPJ menyimpan pasangan NIP/NIK dan nama yang berasal dari pengisian Form Dinamis perjalanan dinas. Data ini bukan Master Personel, tidak membentuk akun, dan digunakan untuk lookup/auto-fill nama. Identitas dapat berasal dari pegawai organik, honorer, narasumber, atau pihak luar.
- Tag sistem tersembunyi: `[SYS_PERSONNEL_ID]` (NIP/NIK), `[SYS_PERSONNEL_NAME]` (nama pasangan), `[SYS_START_DATE]` dan `[SYS_END_DATE]`. Tag ID/nama harus berpasangan pada field utama yang sama atau pada satu entri blok berulang yang sama. Rentang tanggal pada tingkat dokumen dapat dipakai bersama untuk semua orang di blok; cakupannya ditentukan konfigurasi form.
- Jika NIP/NIK ditemukan, nama pasangan diisi otomatis; jika belum ada, nama diinput PPTK. Identitas dicatat/diperbarui di direktori saat SPJ disimpan atau diajukan. Penghapusan SPJ tidak menghapus profil direktori.
- Pemeriksaan jadwal dijalankan server-side hanya saat pengajuan ke Verifikator. Menyimpan Draft tidak diblokir. Dua rentang inklusif bentrok bila `Mulai Baru ≤ Selesai Lama` dan `Selesai Baru ≥ Mulai Lama`. Jika tanggal selesai kosong/sama dengan tanggal mulai, tanggal selesai efektif sama dengan tanggal mulai; tanggal selesai sebelum tanggal mulai ditolak.
- Cakupan bentrok: identitas sama, TA sama, SPJ pembanding berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft/yang dikembalikan untuk perbaikan tidak dihitung. SPJ yang dibatalkan/dihapus atau kembali ke status non-komitmen tidak lagi menahan jadwal. Pengajuan dan penetapan status dilakukan atomik untuk mencegah pengajuan serentak lolos bersamaan.
- Admin boleh mengoreksi dan menggabungkan entri direktori duplikat. Merge harus memperbarui referensi identitas validasi tanpa menghapus/mengubah isi historis SPJ yang telah tersimpan; perubahan administratif dicatat dalam Audit Event.


### 2.5 Direktori Rekening Bank (Global & Transaksional Mandiri)
- `bank_accounts_directory`: Koleksi referensi rekening bank yang dihimpun secara otomatis dari pengisian SPJ (*auto-capture*) dan dikelola Admin.
  - Atribut konseptual: `id`, `account_name` (nama pemilik/penerima), `bank_name` (nama bank), `account_number` (nomor rekening), `alias` (nama alias/instansi, opsional), `created_at`, `updated_at`.
  - Bersifat global lintas-seksi untuk memudahkan penggunaan ulang (*reusability*) rekening pihak ketiga/rekanan/pegawai.
  - Tidak memiliki indeks unik kaku yang memblokir penambahan variasi penulisan dari form PPTK. Penggabungan dan standardisasi dikontrol oleh Admin melalui fungsi *merge* dan koreksi.
  - Pembatalan transaksi SPJ tidak menghapus baris pada direktori ini.

### 2.6 Proyeksi Analitik Burn-Rate & Early Warning Dasbor PA/KPA

Untuk mendukung kebutuhan analitik eksekutif PA/KPA tanpa membebani performa database transaksional, sistem menyediakan entitas agregasi atau *computed projection* harian di tingkat backend:

1. **Atribut Analitik per Seksi:**
   - `id_seksi`: Referensi ke seksi pada TA aktif.
   - `pagu_sah_terakhir`: Pagu Induk Seksi (sebelum APBD-P) atau Pagu Perubahan DPA-P (setelah APBD-P disahkan).
   - `realisasi_bku_terbukukan`: Total nominal kuitansi/SPJ yang telah memiliki `no_bku` dan berstatus `Dibukukan`.
   - `budget_burn_rate_pct`: `(realisasi_bku_terbukukan / pagu_sah_terakhir) * 100%`.
   - `time_elapsed_pct`: Persentase hari terlewati sejak 1 Januari dalam TA bersangkutan. Pada status TA Masa Transisi atau Arsip Read-Only, bernilai statis `100%`.
   - `bku_spike_14d_pct`: Akumulasi kenaikan realisasi BKU dalam jendela 14 hari kalender terakhir (berdasarkan `tanggal_bku`).
   - `zona_analitik`: Enum (`HIJAU`, `KUNING`, `MERAH`, `ORANYE`) berdasarkan ambang batas matematis yang ditetapkan di Dokumen 01 §12.
   - `is_frozen`: Boolean penanda apakah metrik analitik dalam status terkunci/beku (true untuk Masa Transisi dan Arsip).

2. **Aturan Eksekusi Query & Caching:**
   - Evaluasi harian dihitung secara terjadwal atau saat pembukaan dasbor dengan mekanisme caching (TTL 15-30 menit) dalam zona waktu WITA.
   - Perhitungan lonjakan abnormal (Zona Oranye) mengevaluasi agregasi `tanggal_bku` dalam rentang 14 hari terakhir terhadap pagu sah terakhir seksi.
   - Seluruh payload endpoint analitik PA/KPA terisolasi di rute khusus internal PA/KPA, tidak pernah dipaparkan ke publik.

### 2.7 Metadata dan pipeline lampiran PDF SPJ

Entitas lampiran PDF menyimpan metadata yang memisahkan identitas berkas asli dari representasi hasil optimasi:

| Atribut | Keterangan |
|---|---|
| `original_file_name` | Nama berkas dari perangkat PPTK, dipertahankan untuk tampilan dan audit |
| `original_size_bytes` | Ukuran berkas sebelum proses kompresi |
| `stored_size_bytes` | Ukuran berkas final setelah optimasi, atau ukuran asal jika bypass |
| `compression_status` | `BYPASSED`, `CLIENT_COMPRESSED`, `SERVER_FALLBACK_COMPRESSED`, atau `FAILED` |
| `content_type` | Harus `application/pdf`; tipe lain ditolak |
| `storage_object_key` | Lokasi aman berkas final yang diotorisasi sesuai peran dan TA |

Aturan pipeline: berkas asal di atas 30 MB ditolak; berkas sampai dengan 5 MB melewati kompresi; berkas di atas 5 MB sampai 30 MB mencoba kompresi klien, lalu beralih ke worker server jika gagal atau timeout 15 detik. Hasil final ditargetkan paling besar 10 MB. Kegagalan server tidak boleh membuat status upload sukses palsu. Hanya berkas final hasil kompresi yang disimpan; nama dan ukuran berkas asli dicatat sebagai metadata. Berkas final dihapus bersama TA saat retensi 12 tahun. Kompresi hanya memproses representasi PDF dan tidak pernah mengubah jawaban Form Dinamis atau ekspor Excel.


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

## 4. Representasi angka dan kode
- Nominal disimpan sebagai bilangan bulat rupiah (tanpa sen), bukan sebagai teks berformat. Tipe database final ditentukan saat implementasi.
- Tampilan/edit nominal menggunakan pemisah ribuan titik, tanpa spin button, dan nilai kosong benar-benar kosong.
- Kode rekening belanja, nomor rekening bank, NIP/NIK, dan kode lain yang dapat berawalan nol disimpan sebagai teks. Jangan menjalankan format Rupiah pada kode.

Zona waktu sistem: WITA (UTC+8) untuk jendela input, tanggal arsip, dan seluruh tanggal/jam yang ditampilkan kepada pengguna.

Istilah nomor BKU: "No. BKU" adalah satu-satunya istilah untuk nomor pembukuan kas. Tidak ada istilah lain yang berbeda untuk nomor yang sama.

## 5. Konsistensi alokasi dan saldo
### 5.1 Keseimbangan pagu
- Jumlah pagu subkegiatan sama dengan pagu induk pada fase anggaran yang harus diseimbangkan.
- Pagu seksi adalah agregasi otomatis subkegiatan yang dipetakan ke seksi itu.
- Jumlah pagu rekening pada suatu subkegiatan sama dengan pagu subkegiatan.
- Gatekeeper memerlukan kesiapan semua seksi sebelum tombol buat kuitansi aktif secara global.

### 5.2 SPD dan saldo bebas
Konsep saldo bebas pada suatu alokasi rekening:

`Sisa SPD Bebas = SPD aktif - Komitmen Kuitansi Aktif - Realisasi BKU`

Efisiensi dan sumber pergeseran tidak boleh mengambil lebih dari saldo bebas. Efisiensi hanya menurunkan SPD; pagu rekening tetap, dan SPD dapat dinaikkan kembali sampai batas pagu rekening dengan alasan dan Audit Event. Pergeseran memindahkan SPD bersama pagu (turun di sumber, naik di tujuan). Pastikan implementasi menghindari penghitungan ganda atas nilai yang telah dibukukan sesuai model ledger yang dipilih.

### 5.3 Pagu perubahan
- Pagu murni, perubahan/pergeseran, dan pagu akhir harus dapat ditelusuri terpisah.
- Pagu baru tidak boleh lebih kecil dari realisasi kas BKU ditambah komitmen kuitansi aktif.
- Transaksi historis menunjuk versi anggaran/penugasan/form yang berlaku saat transaksi dibuat.

## 6. Dokumen, snapshot, dan histori
- Perubahan Master SOTK tidak memindahkan transaksi lama.
- Penugasan pejabat memiliki tanggal efektif; pejabat lama berakhir H-1 tanggal mulai pengganti. Penugasan Delegasi Plh./Plt. tidak memakai aturan H-1 ini karena tidak menggantikan penugasan definitif.
- Snapshot identitas pejabat, versi form SPJ, versi anggaran, dan data kuitansi perlu tersedia untuk cetak/peninjauan historis.
- Penghapusan TA hanya diperbolehkan jika TA belum pernah memiliki kuitansi, atau melalui retensi 12 tahun setelah TA Arsip Read-Only (D01 §1.3 poin 6); penanda "sudah ada transaksi" disimpan pada data TA dan tetap berlaku meskipun seluruh kuitansi telah dibatalkan.
- Pembatalan kuitansi Aktif diperbolehkan sesuai Dokumen 02 §4 dan §7 dan tidak meninggalkan jejak. Entri Audit Event yang terkait kuitansi atau SPJ tersebut ikut terhapus otomatis.
- Pencabutan BKU memakai urutan pencabutan berjenjang (Dokumen 02 §6) dan dicatat di Audit Event. Koreksi No. BKU atau tanggal BKU dicatat dengan nilai lama dan nilai baru.
- **Identitas Aktor Audit:** Setiap Audit Event menyimpan ID akun pelaku, snapshot nama lengkap, NIP/NIK, dan peran/jabatan pada saat aksi. Snapshot tidak berubah walau data personel kemudian diubah. Efek otomatis sistem (misalnya penutupan unit pada H-1) dicatat atas nama pengguna pemicunya dengan penanda otomatis.

- **Aktor Pengawas/Auditor:** Snapshot berisi nama lengkap, instansi asal, nomor surat tugas, dan peran Pengawas, sebagai pengganti NIP/NIK.

- Rekap pajak per jenis pajak membaca entri pajak pada SPJ yang sudah memiliki BKU (Dokumen 01 §9 poin 10). Entri pajak tidak mengubah nominal bruto kuitansi maupun komitmen SPD, dan tidak masuk rekap isian SPJ per jenis belanja.
- **Snapshot Penandatangan Dokumen:** Nama dan NIP pejabat pada dokumen cetak disimpan sebagai snapshot saat dokumen dibuat (kuitansi saat disimpan; SPJ dan Hasil Verifikasi SPJ saat diajukan ke Verifikator), termasuk keterangan Plh./Plt. bila berlaku. Cetak ulang tidak mengubah snapshot, dan snapshot tidak dihitung ulang setelah delegasi berakhir.


### 6.1 Snapshot Data Rekening Bank pada SPJ
- Ketika rincian SPJ disimpan, data penerima (`recipient_name`, `bank_name`, `account_number`, `alias`) disimpan sebagai bagian dari dokumen/payload SPJ (`spj_recipients` / snapshot transaksi).
- Snapshot ini bersifat *immutable* (tidak terpengaruh) terhadap operasi pembaruan (*update*), koreksi nama, atau penggabungan (*merge*) yang dilakukan Admin di tabel `bank_accounts_directory`.

## 7. Catatan untuk rancangan teknis lanjutan
Keputusan teknis yang ditetapkan untuk rancangan lanjutan:
- **Transaksi atomik:** setiap aksi yang memengaruhi saldo (kuitansi, pembatalan, BKU, efisiensi, pergeseran, pengesahan) berjalan dalam satu transaksi database dengan penguncian baris. Sisa SPD Bebas diperiksa di dalam transaksi yang sama.
- **Nominal:** bilangan bulat rupiah tanpa sen (§4).
- **Lampiran:** berkas final dan data lampiran berelasi ke TA dan dihapus berantai bersama TA saat retensi.
- **Audit:** peristiwa audit mengikuti §2.2 dan Dokumen 01 §6 poin 6.
- **Pembatasan akses baris (row-level security):** berdasarkan TA aktif, peran, dan seksi.
- **Snapshot kode:** kode dan nama subkegiatan serta rekening belanja disalin ke data TA, sehingga perubahan kode pada master antar tahun tidak mengubah TA lama.
- Laporan rekap isian SPJ per jenis belanja membaca jawaban SPJ per versi form. Pengelompokan mengikuti jenis belanja yang dipilih di awal SPJ, dan Excel berisi satu sheet per jenis belanja (Dokumen 01 §9 poin 4, 6–7). Pajak tidak termasuk rekap ini. Satu SPJ menjadi satu baris, atau satu baris per entri blok berulang (Dokumen 01 §9 poin 9).

## 8. Batasan penghapusan cadangan (konsep lanjutan)
- Penghapusan TA dilakukan total di database aktif dan penyimpanan berkas. Penghapusan dari salinan cadangan platform belum dapat dijamin dari aplikasi.
- Konsep "hapus total termasuk cadangan" dicatat sebagai kebutuhan lanjutan. Hanya dapat diterapkan jika platform menyediakan mekanisme penghapusan data tertentu dari cadangan atau masa simpan cadangan yang sesuai.
- Sampai ada kepastian tersebut, berlaku kebijakan retensi cadangan platform, dengan masa simpan cadangan ditetapkan sependek yang diizinkan platform.

## 9. Glosarium istilah
Istilah berikut dipakai dengan arti yang sama di seluruh dokumen.
- **Komitmen Kuitansi Aktif:** nilai kuitansi berstatus Aktif atau Terkunci yang mengurangi SPD dan belum menjadi realisasi.
- **Serapan:** (Realisasi + Komitmen Kuitansi Aktif) ÷ Pagu. Dipakai pada drill-down dan mini progress bar.
- **Realisasi (%):** Realisasi BKU ÷ Pagu. Dipakai pada laporan (Dokumen 01 §9 poin 2a dan 2d).
- **Burn-Rate:** Realisasi BKU ÷ Pagu Sah Terakhir. Dipakai pada analitik PA/KPA (Dokumen 01 §12).
- **Realisasi:** nilai yang sudah dibukukan sebagai BKU.
- **Sisa SPD Bebas:** SPD aktif dikurangi Komitmen Kuitansi Aktif dan Realisasi.
- **Pembatalan:** menghapus kuitansi Aktif atau SPJ Draft tanpa jejak.
- **Pelepasan:** melepas SPJ Draft dari kuitansi. Kuitansi kembali Aktif tanpa jejak.
- **Pencabutan:** membatalkan BKU yang sudah dicatat. Tercatat di Jejak Audit.
- **Penghapusan TA:** penghapusan total seluruh data TA setelah masa retensi 12 tahun. Tidak meninggalkan catatan.
- **Status kuitansi:** Aktif atau Terkunci.
- **Status SPJ:** Draft, Terkunci, Menunggu BKU, atau Dibukukan.
- **Agregat publik:** proyeksi server-side yang hanya memuat persentase, cacah, nama TA/seksi, kategori status, dan waktu pembaruan yang disetujui untuk portal keterbukaan tanpa login.
- **No. BKU:** satu-satunya istilah untuk nomor pembukuan kas. Diinput secara manual oleh Bendahara (teks/angka bebas, divalidasi keunikan per TA). BKU AMANDA murni mencatat realisasi pengeluaran belanja per kuitansi, tanpa pencatatan penerimaan kas atau SP2D. Hubungan tanggal kuitansi, SPJ, dan BKU bersifat bebas tanpa batasan kronologis.

<!-- ===== AKHIR DOKUMEN 04 ===== -->

---
