# PAKET LANGKAH 5C: TEMPLATE, KUITANSI & SPJ

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 5 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 5 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 85 | REK-01 | Split View rekening penerima | PPTK | P1 | Frontend | SPJ-01 |
| 86 | SPJ-06 | Unggah lampiran PDF (client-first, fallback server) | PPTK | P1 | Frontend | SPJ-01 |
| 87 | SPJ-05 | Pengajuan SPJ ke Verifikator | PPTK | P0 | Frontend | SPJ-04, BNT-03, PEN-08 |
| 88 | BNT-03 | Validasi bentrok jadwal saat pengajuan | PPTK, Sistem | P0 | Frontend | BNT-02, SPJ-05 |
| 89 | PJK-01 | Pop-up pajak pada SPJ | PPTK | P1 | Frontend | SPJ-04, MST-06 |
| 90 | REK-02 | Input bebas & auto-capture rekening | PPTK | P1 | Frontend | REK-01 |
| 92 | SPJ-07 | Worker kompresi server & metadata lampiran | Sistem | P1 | Backend saja (tidak dikerjakan sekarang) | SPJ-06 |
| 93 | PJK-02 | Total Pajak, Jumlah dibayarkan & validasi | PPTK, Sistem | P0 | Frontend | PJK-01 |
| 94 | REK-03 | Snapshot rekening pada SPJ & retensi direktori | Sistem | P1 | Frontend | REK-02 |
| 95 | REK-05 | Admin kelola Direktori Rekening Bank | Admin | P2 | Frontend | REK-03 |
- **REK-05:** dipindah ke langkah ini dari fase F1 karena ketergantungan.

## 2. Aturan kunci per fitur (ringkasan)
### REK-01 — Split View rekening penerima
- **Peran:** PPTK
- **Aturan:** Panel kiri direktori + omni-search (nama, alias/instansi, no. rekening) + "Pilih"; panel kanan form SPJ terisi otomatis.
- **Rujukan:** D02 §5; D03 §13; D01 §14 poin 2

### SPJ-06 — Unggah lampiran PDF (client-first, fallback server)
- **Peran:** PPTK
- **Aturan:** Hanya .pdf; > 30 MB ditolak di peramban dengan pesan baku; ≤ 5 MB bypass; > 5–30 MB kompresi lokal (~150 DPI, JPEG ≥ 70%); gagal/OOM/> 15 dtk → server fallback otomatis; status UI "Menyiapkan dokumen..." → "Mengunggah dokumen..."; sukses hanya setelah server konfirmasi.
- **Rujukan:** D03 §12; D01 §13; D02 §5

### SPJ-05 — Pengajuan SPJ ke Verifikator
- **Peran:** PPTK
- **Aturan:** Validasi field wajib & bentrok jadwal; status Terkunci; snapshot penandatangan; tanggal pengajuan menentukan pejabat (Plh./Plt.).
- **Rujukan:** D02 §5; D03 §10 poin 3; D01 §11 poin 4

### BNT-03 — Validasi bentrok jadwal saat pengajuan
- **Peran:** PPTK, Sistem
- **Aturan:** Server, atomik, saat "Ajukan ke Verifikator"; identitas sama + TA sama vs SPJ Terkunci/Menunggu BKU/Dibukukan; rumus inklusif (Mulai Baru ≤ Selesai Lama dan Selesai Baru ≥ Mulai Lama); selesai kosong = mulai; selesai < mulai ditolak; Draft bebas; pesan minimum tanpa nominal.
- **Rujukan:** D01 §11 poin 4–7; D03 §10; D04 §2.4

### PJK-01 — Pop-up pajak pada SPJ
- **Peran:** PPTK
- **Aturan:** Muncul setelah isian SPJ disimpan; banyak entri; jenis dari Master aktif; nominal manual; tanpa perhitungan otomatis tarif.
- **Rujukan:** D02 §5; D03 §4 poin 11; D01 §15 poin 6

### REK-02 — Input bebas & auto-capture rekening
- **Peran:** PPTK
- **Aturan:** Tanpa validasi unik/format kaku; saat SPJ/rincian disimpan, rekening baru masuk direktori.
- **Rujukan:** D03 §13; D01 §14 poin 3; D04 §2.5

### SPJ-07 — Worker kompresi server & metadata lampiran
- **Peran:** Sistem
- **Aturan:** Metadata: original_file_name, original_size_bytes, stored_size_bytes, compression_status (BYPASSED/CLIENT_COMPRESSED/SERVER_FALLBACK_COMPRESSED/FAILED), content_type, storage_object_key; target final ≤ 10 MB; kegagalan tidak boleh sukses palsu; hanya berkas final yang disimpan (nama/ukuran asli = metadata), dihapus bersama TA.
- **Rujukan:** D04 §2.7; D02 §5; D03 §12 poin 5–7
- **Keputusan pemilik yang sudah masuk dokumen:** N-12: hanya berkas hasil kompresi yang disimpan; nama dan ukuran asli dicatat sebagai metadata; dihapus bersama TA saat retensi.

### PJK-02 — Total Pajak, Jumlah dibayarkan & validasi
- **Peran:** PPTK, Sistem
- **Aturan:** Total Pajak = Σ entri; Jumlah dibayarkan = bruto − Total Pajak; Total Pajak > bruto ditolak di server dengan pesan (bruto, total, batas); = bruto diterima; SPJ tanpa pajak diterima; tidak mengubah bruto/komitmen.
- **Rujukan:** D02 §5; D03 §4 poin 11

### REK-03 — Snapshot rekening pada SPJ & retensi direktori
- **Peran:** Sistem
- **Aturan:** Data rekening disalin immutable pada SPJ; edit/merge Admin tidak mengubah SPJ Terkunci/Menunggu BKU/Dibukukan; SPJ Draft dibatalkan → rekening tetap di direktori; tidak memengaruhi BKU/SPD.
- **Rujukan:** D04 §2.5, §6.6; D02 §5; D01 §14 poin 1, 4–5

### REK-05 — Admin kelola Direktori Rekening Bank
- **Peran:** Admin
- **Aturan:** Lihat seluruh rekening global, merge duplikat, koreksi ejaan; role lain hanya baca/pilih + auto-capture; hanya memengaruhi pencarian ke depan.
- **Rujukan:** D03 §13 poin 3; D01 §14 poin 6; D04 §2.5

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 02 §5

## 5. Relasi SPJ dan verifikasi
- Satu kuitansi berpasangan dengan satu SPJ (1:1); kuitansi dapat dibuat terlebih dahulu.
- Seksi memilih jenis belanja di awal pembuatan SPJ, dan pilihan itu menentukan Form Dinamis yang tampil. Form disusun Admin per jenis belanja. Isian form manual; jangan mengasumsikan auto-kalkulasi yang belum disepakati.
- SPJ memuat rincian teknis belanja (Form Dinamis), pajak, serta unggahan bukti SPJ.
- Pajak diisi manual oleh Seksi sebagai bagian SPJ. Setelah isian SPJ disimpan, sistem menampilkan pop-up pajak. Seksi dapat menambah beberapa entri pajak; setiap entri memilih jenis pajak dari Master Jenis Pajak dan mengisi nominalnya secara manual. Sistem tidak menghitung pajak secara otomatis dari tarif atau master. Satu-satunya perhitungan otomatis terkait pajak adalah Total Pajak, yaitu jumlah seluruh entri pajak, dan Jumlah yang dibayarkan, yaitu nilai bruto dikurangi Total Pajak. Admin mengelola Master Jenis Pajak. Entri pajak tidak mengubah nominal bruto kuitansi. Sistem menolak penyimpanan entri pajak jika Total Pajak melebihi nilai bruto kuitansi terkait; Total Pajak yang sama dengan bruto tetap diterima, sehingga Jumlah yang dibayarkan bernilai nol. Pesan validasi menampilkan nilai bruto, Total Pajak, dan batas bahwa Total Pajak tidak boleh lebih dari nilai bruto kuitansi; entri yang ditolak tidak tersimpan. Penolakan ini hanya berlaku untuk pajak dan tidak berlaku untuk Form Dinamis. SPJ tanpa pajak diperbolehkan. Pajak tidak masuk Excel rekap isian SPJ; pajak dilaporkan pada rekap pajak per jenis pajak, hanya untuk SPJ yang sudah memiliki BKU (Dokumen 01 §9 poin 10).
- Isian Form Dinamis merupakan rincian administratif yang diisi oleh Seksi/PPTK untuk keperluan pertanggungjawaban. Pengisian ini bersifat pencatatan informasional murni dan tidak menambah maupun mengurangi anggaran. Sistem tidak melakukan validasi perhitungan matematis atau kecocokan antara total rincian pada Form Dinamis dengan nominal bruto kuitansi.
- Isian Form Dinamis disimpan sebagai jawaban SPJ sesuai versi form saat SPJ dibuat, dan dapat direkap per jenis belanja (Dokumen 01 §9). Unduhan Excel rekap tersebut berisi satu sheet per jenis belanja, dengan kolom berupa gabungan field dari versi form yang dipakai SPJ di sheet tersebut (Dokumen 01 §9 poin 6). Form dapat memiliki paling banyak satu blok berulang (Dokumen 01 §9 poin 9). Entri blok disimpan sebagai daftar pada SPJ, dan setiap entri menjadi satu baris di Excel.
- **Standar Format & Batas Berkas Unggahan (Terkunci):**
  - **Format Wajib:** Hanya menerima format `.pdf` (`application/pdf`). Berkas gambar mentah dan format dokumen lain ditolak.
  - **Hard Ceiling Berkas Asal:** Maksimum **30 MB** per berkas PDF sebelum optimasi. Berkas di atas batas ini ditolak sebelum kompresi.
  - **Client-First Threshold:** Berkas berukuran `<= 5 MB` diunggah tanpa kompresi. Berkas `> 5 MB` hingga 30 MB otomatis dikompresi lokal di peramban terlebih dahulu.
  - **Target Hasil:** Ukuran berkas final ditargetkan `<= 10 MB` (ideal `<= 5 MB`) dengan keterbacaan dokumen keuangan tetap terjaga.
  - **Server Fallback:** Jika kompresi peramban gagal, kehabisan memori, atau melewati toleransi proses 15 detik, sistem otomatis mengalihkan optimasi ke worker kompresi server. Kegagalan lokal tidak langsung menggagalkan unggahan.
  - **Integritas & Metadata:** Kompresi hanya mengubah representasi fisik berkas PDF, tidak mengubah Form Dinamis, data Excel, atau data transaksi terstruktur. Sistem mencatat nama dan ukuran berkas asli sebagai metadata, beserta ukuran akhir. Yang disimpan hanya berkas final hasil kompresi; berkas asli tidak disimpan. Berkas final dihapus bersama TA saat retensi 12 tahun.
  - **Keterbacaan:** Target kompresi sekitar 150 DPI dan kualitas JPEG gambar minimal 70% sebagai pedoman teknis; teks nominal, tanda tangan, dan stempel harus tetap terbaca jelas.
  - **Uji Pra-Rilis:** Pengujian menggunakan PDF berukuran kecil, menengah, dan mendekati batas 30 MB pada perangkat kelas rendah; berkas hasil harus lolos pemeriksaan visual dan dapat diunduh kembali.
- **Status SPJ:** SPJ berstatus **Terkunci** sejak dikirim ke Verifikator dan tidak dapat diedit selama Terkunci. Setelah disetujui Verifikator, SPJ berstatus Menunggu BKU hingga Bendahara mencatat BKU; sesudah itu SPJ berstatus Dibukukan. SPJ Menunggu BKU dan Dibukukan tetap Terkunci, dan kuitansi terkait tetap Terkunci.
- **Penandatangan SPJ saat Plh./Plt.:** Tanggal pengajuan SPJ ke Verifikator menentukan pejabat penanggung jawab pada dokumen SPJ dan Hasil Verifikasi SPJ. SPJ yang diajukan sebelum delegasi dimulai tetap atas nama pejabat definitif, meskipun diverifikasi saat delegasi Plh./Plt. berjalan, karena penguncian terjadi sejak pengiriman.
- Verifikator dapat mengembalikan SPJ kepada Seksi sebagai Draft dengan catatan revisi wajib. Pengembalian membuka kunci SPJ, tetapi tidak melepas komitmen kuitansi dari SPD. Kuitansi tetap Terkunci selama SPJ masih terkait.
- SPJ berstatus Draft, yaitu yang belum dikirim atau dikembalikan Verifikator, boleh dilepas atau dibatalkan oleh Seksi. Kuitansi terkait kembali Aktif tanpa jejak. SPJ yang sudah dikirim berstatus Terkunci dan hanya dapat dilepas setelah dikembalikan Verifikator menjadi Draft. Jika BKU sudah dicatat, tindakan mengikuti pencabutan berjenjang §6.2.


- **Pengisian Rincian Rekening Bank Penerima (Split View Workspace):**
  - Pada formulir rincian penerima SPJ, antarmuka ditampilkan dalam mode layar terbagi (*Split View*):
    - **Panel Sisi Kiri (Direktori Rekening Bank):** Menyediakan daftar rekening yang telah terdaftar dengan kotak pencarian terpadu (*omni-search*). Pencarian dapat dilakukan secara fleksibel melalui Nama Penerima, Alias/Instansi, atau Nomor Rekening. Menekan tombol *"Pilih / Gunakan"* langsung mengisi rincian ke form sisi kanan secara otomatis.
    - **Panel Sisi Kanan (Form Rincian SPJ):** Tempat PPTK melengkapi data penerima pembayaran. Jika data belum tersedia di direktori kiri, PPTK mengetik manual data baru tanpa validasi angka/format unik yang membatasi.
  - **Auto-Capture Rekening Baru:** Saat rincian atau draf SPJ disimpan, data rekening baru otomatis tersimpan ke Direktori Rekening Bank sistem untuk pemakaian berulang di masa mendatang.
  - **Snapshot Permanen pada SPJ:** Data rekening yang dipilih/diinput pada SPJ disalin sebagai snapshot permanen dokumen transaksi. Pembersihan data atau penggabungan duplikat oleh Admin di direktori tidak mengubah data SPJ yang sudah berstatus Terkunci, Menunggu BKU, atau Dibukukan.
  - **Dampak Pembatalan SPJ Draft:** Pembatalan SPJ Draft menghapus dokumen SPJ secara bersih, namun data rekening baru yang sempat ter-capture ke Direktori Rekening Bank tetap tersimpan di direktori.

#### Dokumen 03 §13

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

#### Dokumen 01 §14

## 14. DIREKTORI REKENING BANK & TAMPILAN KERJA TERBAGI (SPLIT VIEW)
1. **Tujuan & Ruang Lingkup:**
   - Mempercepat pengisian identitas rekening bank penerima pembayaran (penerima honor, belanja barang/jasa, narasumber, rekanan, atau pihak luar) oleh Seksi/PPTK pada lembar kerja SPJ tanpa membebani input berulang atau validasi angka yang rumit.
   - Mengelola pustaka rekening bank secara transaksional mandiri (*on-the-fly* & *auto-capture*) dengan pengawasan terpusat oleh Admin.
   - Rekening bank murni berfungsi sebagai kelengkapan administratif bukti transfer/rincian pengeluaran SPJ. Fitur ini tidak mengubah logika pembukuan kas BKU, tidak memengaruhi Sisa SPD Bebas, dan tidak mencatat arus penerimaan kas/SP2D.

2. **Antarmuka Layar Terbagi (Split View Workspace):**
   - Halaman kerja pengisian rincian penerima/transfer SPJ dibagi menjadi 2 (dua) panel berdampingan:
     - **Panel Kiri — Direktori Rekening (Pustaka Referensi Cepat):** Menampilkan daftar rekening yang telah terdaftar di sistem. Dilengkapi kotak pencarian instan multifungsi yang fleksibel mencari berdasarkan **Nama Penerima**, **Alias/Instansi**, maupun **Nomor Rekening**. Pengguna cukup menekan tombol *"Gunakan / Pilih"* pada baris hasil pencarian untuk otomatis mengisi form di panel kanan.
     - **Panel Kanan — Form Rincian SPJ (Lembar Kerja Utama):** Form input tempat PPTK mengelola rincian penerima pembayaran. Jika data rekening belum tersedia di panel kiri (hasil pencarian nihil), PPTK langsung mengetik data baru (Nama Penerima, Nama Bank, Nomor Rekening, dan Alias opsional) secara bebas tanpa batasan/validasi format angka yang kaku.
   - Tidak ada aturan unik yang memblokir proses pengetikan di frontend PPTK.

3. **Mekanisme Simpan Otomatis (Auto-Capture & Caching):**
   - Saat SPJ disimpan atau rincian penerima disimpan oleh PPTK, sistem di latar belakang secara otomatis menangkap (*auto-capture*) pasangan data rekening baru tersebut dan menambahkannya ke Direktori Rekening Bank.
   - Pada pengisian SPJ berikutnya, data tersebut langsung muncul dan dapat dicari di Panel Kiri.

4. **Kekebalan Data Historis (Snapshot Immutability):**
   - Data rekening yang dipilih atau diinput pada suatu SPJ disalin sebagai *snapshot data transaksional* permanen pada SPJ tersebut.
   - Perubahan, perapian ejaan, atau penggabungan entri rekening di direktori oleh Admin di masa depan tidak akan mengubah isi kuitansi/SPJ yang telah disetujui, terverifikasi, atau dibukukan ke BKU.

5. **Dampak Pembatalan SPJ Draft:**
   - Sesuai prinsip penghapusan SPJ Draft tanpa jejak, pembatalan SPJ Draft menghapus dokumen transaksi SPJ secara bersih.
   - Namun, entri rekening baru yang sempat ter-capture ke Direktori Rekening Bank tetap dipertahankan agar dapat digunakan kembali oleh PPTK tanpa mengetik ulang.

6. **Pengawasan & Pemeliharaan Terpusat oleh Admin:**
   - Admin memiliki menu kelola Direktori Rekening Bank untuk:
     - Memantau daftar rekening yang ter-capture secara global lintas-seksi.
     - Merapikan salah ketik (*typo*) nama bank atau nama penerima.
     - Menggabungkan (*merge*) entri duplikat yang memiliki variasi nama berbeda untuk satu rekening yang sama.
   - Aksi Admin pada direktori hanya memengaruhi opsi pencarian di masa depan, tanpa merusak snapshot transaksi historis.

---

#### Dokumen 03 §12

## 12. ALUR UNGGAH LAMPIRAN SPJ: KOMPRESI PDF CLIENT-FIRST

1. PPTK memilih lampiran PDF dari perangkat lokal melalui form SPJ.
2. Peramban memeriksa tipe dan ukuran berkas sebelum upload: berkas di atas 30 MB ditolak langsung dengan pesan batas ukuran; berkas berukuran sampai dengan 5 MB dikirim langsung tanpa kompresi.
3. Untuk berkas di atas 5 MB hingga 30 MB, peramban menampilkan status "Menyiapkan dokumen..." dan mencoba mengompresi PDF secara lokal.
4. Jika proses lokal berhasil, sistem melanjutkan dengan status "Mengunggah dokumen..." dan mengirim hasil kompresi.
5. Jika proses lokal gagal, tidak tersedia, kehabisan memori, atau melewati batas waktu 15 detik, upload beralih otomatis ke jalur server fallback (kompresi sisi server). PPTK tidak perlu mengulang pilihan file karena kendala teknis kompresi lokal.
6. Setelah proses selesai, UI menampilkan status berhasil dan nama berkas asli. Sistem mencatat ukuran sebelum dan sesudah optimasi; Form Dinamis dan data Excel tidak berubah.
7. Jika worker server juga gagal mengoptimalkan atau memvalidasi berkas, sistem menyampaikan pesan yang dapat ditindaklanjuti dan tidak menandai upload sebagai berhasil.

#### Dokumen 01 §13

## 13. STANDAR PENGUNGGAHAN BERKAS SPJ: KOMPRESI PDF CLIENT-FIRST & FALLBACK SERVER

Untuk mengatasi kendala keterbatasan bandwidth jaringan internet instansi daerah dan ukuran berkas pindaian (*scan*) printer kantor yang sering kali sangat besar, sistem AMANDA menerapkan mekanisme pengunggahan dokumen lampiran SPJ berbasis *Drop and Done*:

1. **Format Tunggal & Batas Ukuran Unggah:**
   - Format berkas lampiran SPJ wajib berekstensi `.pdf` (`application/pdf`). Format gambar mentah (`.jpg`, `.png`, dll.) ditolak secara otomatis.
   - **Batas Maksimal Asal (Hard Ceiling):** Ukuran berkas mentah dari perangkat lokal dibatasi maksimal **30 MB**. Berkas di atas 30 MB ditolak seketika di peramban dengan pesan: *"Ukuran file melebihi batas maksimal 30 MB. Harap sesuaikan setelan scanner Anda."*
   - **Batas Aman Target Penyimpanan:** Berkas final yang disimpan di server ditargetkan berada di bawah atau sama dengan **10 MB** (rekomendasi optimal $\le 5$ MB).

2. **Mekanisme Kompresi Klien (*Client-First Pre-Processing*):**
   - **Ambang Batas Pemicu (Threshold 5 MB):**
     - Berkas PDF asli dengan ukuran $\le 5$ MB diunggah secara langsung (*bypass*) tanpa melalui proses kompresi guna menghemat daya komputasi perangkat lokal pengguna.
     - Berkas PDF asli dengan ukuran $> 5$ MB (hingga batas 30 MB) secara otomatis memicu skrip kompresi lokal di peramban pengguna (*browser canvas/wasm optimization*) sebelum paket data dikirim melalui jaringan internet.
   - **Pengalaman Pengguna (Drop and Done):** Proses kompresi di peramban berlangsung transparan di latar belakang (*invisible background processing*) dengan indikator status minimal: *"Menyiapkan dokumen..."* $
ightarrow$ *"Mengunggah dokumen..."*.

3. **Integritas & Keterbacaan Dokumen Keuangan:**
   - Algoritma kompresi berfokus mereduksi resolusi gambar/halaman pindaian yang berlebihan (target resolusi layar $pprox 150$ DPI dengan kualitas kompresi JPEG gambar $\ge 70\%$).
   - Keterbacaan angka nominal kuitansi, stempel basah dinas, dan guratan tanda tangan pejabat/penerima dijamin tetap tajam dan sah secara audit.
   - Proses kompresi fisik PDF ini terisolasi sepenuhnya dari data teks struktural formulir (Form Dinamis, rincian biaya, maupun ekspor laporan Excel).

4. **Mekanisme Cadangan Otomatis (*Server Fallback*):**
   - Jika peramban PPTK mengalami kegagalan proses lokal (misal keterbatasan RAM/memori perangkat komputer lama atau *timeout* peramban > 15 detik), sistem secara mulus dan otomatis mengalihkan proses ke kompresi cadangan di sisi server (*server-side background compression*).
   - Pengguna tidak disajikan pesan galat teknis memori, melainkan sistem memastikan berkas tetap terunggah dan dioptimalkan di server hingga ukuran aman $\le 10$ MB.

#### Dokumen 03 §10

## 10. Alur Validasi Bentrok Jadwal Perjalanan Dinas
1. Admin menandai field Form Dinamis perjalanan dengan `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, dan `[SYS_END_DATE]`. Pasangan ID/nama berada pada konteks yang sama; field tanggal dapat ditempatkan di tingkat dokumen atau blok sesuai cakupannya.
2. PPTK memasukkan NIP/NIK pada field bertag. Jika identitas tersedia di Direktori Transaksional SPJ, sistem mengisi nama pasangan otomatis; jika belum, PPTK mengisi nama. Untuk setiap peserta dalam Blok Berulang, lookup dan pasangan nama dilakukan pada baris yang sama.
3. PPTK dapat menyimpan, mencetak, dan melanjutkan SPJ sebagai Draft tanpa validasi bentrok yang memblokir. Ketika menekan “Ajukan ke Verifikator”, server menguji jadwal seluruh identitas pada SPJ terhadap SPJ lain di TA yang sama berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft dan SPJ yang dikembalikan untuk perbaikan diabaikan.
4. Rentang tanggal inklusif diuji dengan rumus overlap yang ditetapkan pada Dokumen 01 §11. Jika tanggal selesai kosong/sama dengan tanggal mulai, sistem memakai tanggal mulai sebagai tanggal selesai.
5. Jika bentrok, pengajuan ditolak dan SPJ tetap Draft; PPTK menerima identitas, tanggal bentrok, dan referensi pembanding secukupnya untuk koreksi, tanpa rincian SPJ atau nominal lain. Jika tidak bentrok, SPJ diajukan dan statusnya berubah sesuai workflow. Pemeriksaan server dan transisi status dilakukan atomik.
6. Saat SPJ dihapus/dibatalkan atau kembali menjadi status non-komitmen melalui alur yang berlaku, jadwalnya tidak lagi menghalangi pengajuan lain. Entri identitas pada Direktori Transaksional SPJ tetap disimpan untuk auto-fill berikutnya.
7. Verifikator hanya menerima SPJ yang berhasil melewati pemeriksaan saat diajukan. Admin mengelola koreksi dan penggabungan identitas melalui panel direktori; perubahan tidak menghapus relasi transaksi historis.

#### Dokumen 01 §11

## 11. PENCEGAHAN BENTROK JADWAL PERJALANAN DINAS

1. **Cakupan tujuan:** Untuk Form Dinamis perjalanan dinas, AMANDA mencegah satu identitas NIP/NIK tercatat pada dua SPJ berbeda dalam TA yang sama apabila rentang tanggal tugasnya beririsan. Validasi mencakup peserta/pegawai pada field utama maupun pada setiap entri Blok Berulang. Direktori identitas transaksi ini terpisah dari Master Personel instansi dan dapat memuat pegawai organik, honorer, narasumber, atau pihak luar.
2. **Tag sistem Form Dinamis:** Admin mengonfigurasi tag tersembunyi pada field yang sesuai: `[SYS_PERSONNEL_ID]` untuk field NIP/NIK, `[SYS_PERSONNEL_NAME]` untuk pasangan field nama, `[SYS_START_DATE]` untuk tanggal mulai tugas, dan `[SYS_END_DATE]` untuk tanggal selesai tugas. Tag ID dan nama harus dipasangkan pada konteks yang sama (field utama atau baris blok berulang yang sama). Field tanggal dapat berlaku pada tingkat dokumen atau blok sesuai cakupan perjalanan; sistem memakai rentang efektif yang sama untuk identitas terkait. Tag tidak ditampilkan sebagai teks kepada pengisi.
3. **Direktori Transaksional SPJ dan auto-fill:** Saat PPTK memasukkan NIP/NIK, sistem mencari identitas pada Direktori Transaksional SPJ. Jika ditemukan, nama pasangan diisi otomatis; jika belum ditemukan, PPTK mengisi nama. Ketika SPJ disimpan atau diajukan, pasangan NIP/NIK dan nama yang valid dicatat/digunakan ulang di direktori. Direktori tidak menggantikan Master Personel, tidak membuat akun atau penugasan, dan tidak menetapkan kategori pegawai.
4. **Titik validasi dan kebebasan Draft:** SPJ Draft dapat disimpan, dicetak, dan dilengkapi tanpa pemblokiran bentrok jadwal. Validasi bentrok dijalankan di server ketika PPTK menekan **“Ajukan ke Verifikator”**. Jika bentrok ditemukan, pengajuan ditolak dan SPJ tetap Draft; tidak masuk antrean Verifikator atau menjadi Terkunci. Validasi harus dilakukan secara atomik bersama perubahan status agar dua pengajuan serentak tidak sama-sama lolos.
5. **Rentang tanggal efektif:** Rentang bersifat inklusif. Dua SPJ berbeda bentrok jika identitas yang sama dan `Mulai Baru ≤ Selesai Lama` serta `Selesai Baru ≥ Mulai Lama`. Jika `[SYS_END_DATE]` kosong atau sama dengan `[SYS_START_DATE]`, tanggal selesai efektif dianggap sama dengan tanggal mulai. Rentang yang tidak valid (tanggal selesai sebelum tanggal mulai setelah penerapan default) ditolak sebagai kesalahan input.
6. **Status pembanding:** Pemeriksaan hanya membandingkan dengan SPJ lain pada TA yang sama yang berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft, termasuk SPJ yang dikembalikan untuk perbaikan, tidak menjadi penghalang. SPJ yang dibatalkan/dihapus dan BKU yang dicabut sehingga SPJ kembali ke status non-komitmen tidak lagi menahan jadwal. SPJ yang sedang diajukan sendiri dikecualikan dari pembanding saat proses validasi ulang.
7. **Peringatan bentrok:** Jika bentrok ditemukan, server mengembalikan informasi minimum yang diperlukan kepada PPTK untuk memperbaiki data: identitas terkait, rentang tanggal bentrok, dan referensi SPJ/seksi/subkegiatan pembanding yang diizinkan. Tidak menampilkan rincian isi SPJ atau nominal transaksi lain.
8. **Tata kelola Admin:** Admin memiliki panel untuk mencari dan melihat Direktori Transaksional SPJ, memperbaiki ejaan nama atau digit NIP/NIK, dan menggabungkan entri duplikat. Koreksi dan penggabungan memengaruhi referensi identitas untuk validasi berikutnya dan wajib menjaga relasi historis SPJ. Pengelolaan direktori dicatat sesuai aturan Jejak Audit administratif. Penghapusan atau pembatalan SPJ tidak menghapus entri direktori; identitas tetap tersedia untuk auto-fill berikutnya.

#### Dokumen 04 §2.4

### 2.4 Direktori Transaksional SPJ dan validasi jadwal
- Direktori Transaksional SPJ menyimpan pasangan NIP/NIK dan nama yang berasal dari pengisian Form Dinamis perjalanan dinas. Data ini bukan Master Personel, tidak membentuk akun, dan digunakan untuk lookup/auto-fill nama. Identitas dapat berasal dari pegawai organik, honorer, narasumber, atau pihak luar.
- Tag sistem tersembunyi: `[SYS_PERSONNEL_ID]` (NIP/NIK), `[SYS_PERSONNEL_NAME]` (nama pasangan), `[SYS_START_DATE]` dan `[SYS_END_DATE]`. Tag ID/nama harus berpasangan pada field utama yang sama atau pada satu entri blok berulang yang sama. Rentang tanggal pada tingkat dokumen dapat dipakai bersama untuk semua orang di blok; cakupannya ditentukan konfigurasi form.
- Jika NIP/NIK ditemukan, nama pasangan diisi otomatis; jika belum ada, nama diinput PPTK. Identitas dicatat/diperbarui di direktori saat SPJ disimpan atau diajukan. Penghapusan SPJ tidak menghapus profil direktori.
- Pemeriksaan jadwal dijalankan server-side hanya saat pengajuan ke Verifikator. Menyimpan Draft tidak diblokir. Dua rentang inklusif bentrok bila `Mulai Baru ≤ Selesai Lama` dan `Selesai Baru ≥ Mulai Lama`. Jika tanggal selesai kosong/sama dengan tanggal mulai, tanggal selesai efektif sama dengan tanggal mulai; tanggal selesai sebelum tanggal mulai ditolak.
- Cakupan bentrok: identitas sama, TA sama, SPJ pembanding berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft/yang dikembalikan untuk perbaikan tidak dihitung. SPJ yang dibatalkan/dihapus atau kembali ke status non-komitmen tidak lagi menahan jadwal. Pengajuan dan penetapan status dilakukan atomik untuk mencegah pengajuan serentak lolos bersamaan.
- Admin boleh mengoreksi dan menggabungkan entri direktori duplikat. Merge harus memperbarui referensi identitas validasi tanpa menghapus/mengubah isi historis SPJ yang telah tersimpan; perubahan administratif dicatat dalam Audit Event.

#### Dokumen 03 §4

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

#### Dokumen 01 §15

## 15. PENCARIAN, FILTER, DAN POP-UP (ATURAN UMUM ANTARMUKA)

1. **Daftar yang memakai pencarian dan filter:** Kuitansi, SPJ, BKU, Jejak Audit, Subkegiatan, Rekening Belanja, Personel, Akun, Akun Pengawas/Auditor, Direktori Rekening Bank, dan Direktori Transaksional SPJ. Daftar ini tumbuh seiring data TA dan master.
2. **Daftar tanpa pencarian:** Master SOTK dan Jenis Pajak. Datanya kecil dan jarang berubah sehingga cukup ditampilkan penuh.
3. **Pencarian:** satu kotak yang menyaring hasil langsung saat diketik. Pencarian mencocokkan kode, nama, nomor BKU, dan uraian sesuai daftar. Pencarian hanya bersifat membaca dan tidak mengubah data.
4. **Filter per daftar:** hanya field yang dipakai untuk memilah. Kuitansi dan SPJ: status, seksi, periode, dan jenis belanja. BKU: seksi, periode, dan status. Subkegiatan dan Rekening Belanja: status. Personel dan Akun: status akun dan peran. Filter dapat dikombinasikan dan dihapus sekaligus dengan satu tombol reset.
5. **Batas cakupan data:** pencarian dan filter hanya bekerja dalam cakupan data peran pengguna, sesuai Dokumen 05. Hasil di luar cakupan tidak pernah ditampilkan, termasuk melalui pencarian langsung.
6. **Pop-up untuk aksi singkat:** aksi yang muat tanpa scroll dalam sekitar empat field, dan semua konfirmasi yang tidak dapat dibatalkan, dibuka dalam pop-up. Contoh: tambah atau ubah unit kerja, tambah entri pajak, nonaktifkan akun dengan alasan, reset password, dan pencabutan BKU dengan konfirmasi.
7. **Halaman sendiri untuk isian panjang:** buat kuitansi, buat atau lengkapi SPJ, Form Dinamis, Visual Live Editor, dasbor, dan seluruh laporan. Aturan praktisnya: jika form muat di layar tanpa scroll, gunakan pop-up; jika tidak, gunakan halaman.
8. **Jejak audit tidak berubah:** aksi yang dilakukan melalui pop-up tetap dicatat sesuai aturan jejak audit yang berlaku untuk aksi tersebut, tanpa jalur tercatat yang berbeda.

#### Dokumen 04 §2.5

### 2.5 Direktori Rekening Bank (Global & Transaksional Mandiri)
- `bank_accounts_directory`: Koleksi referensi rekening bank yang dihimpun secara otomatis dari pengisian SPJ (*auto-capture*) dan dikelola Admin.
  - Atribut konseptual: `id`, `account_name` (nama pemilik/penerima), `bank_name` (nama bank), `account_number` (nomor rekening), `alias` (nama alias/instansi, opsional), `created_at`, `updated_at`.
  - Bersifat global lintas-seksi untuk memudahkan penggunaan ulang (*reusability*) rekening pihak ketiga/rekanan/pegawai.
  - Tidak memiliki indeks unik kaku yang memblokir penambahan variasi penulisan dari form PPTK. Penggabungan dan standardisasi dikontrol oleh Admin melalui fungsi *merge* dan koreksi.
  - Pembatalan transaksi SPJ tidak menghapus baris pada direktori ini.

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **F-33d** (SPJ-05): Nama dan NIP pejabat pada kuitansi dan Hasil Verifikasi SPJ diambil dari penugasan yang berlaku saat kuitansi disimpan atau SPJ diajukan ke Verifikator. SPJ yang diajukan sebelum delegasi lalu diverifikasi saat delegasi berjalan tetap atas nama pejabat definitif.
- **F-35** (SPJ-06): Berkas PDF sampai dengan 5 MB melewati kompresi, sedangkan berkas di atas 5 MB hingga 30 MB memicu kompresi otomatis di peramban.
- **F-36** (SPJ-06): Berkas asal di atas 30 MB ditolak sebelum kompresi dengan pesan batas ukuran yang jelas.
- **F-37** (SPJ-06): Jika kompresi klien berhasil, berkas yang dikirim adalah hasil optimasi dan ukuran final dicatat; target hasil maksimal 10 MB.
- **F-38** (SPJ-06, SPJ-07): Jika kompresi klien gagal, kehabisan memori, atau melewati 15 detik, sistem menjalankan server fallback secara otomatis tanpa meminta PPTK memilih ulang berkas.
- **F-39** (SPJ-07): Jika kompresi server juga gagal, upload tidak boleh ditandai berhasil dan pengguna menerima pesan tindak lanjut yang jelas.
- **F-40** (SPJ-07): Metadata berkas menyimpan nama asli, ukuran asal, ukuran final, dan status optimasi (`BYPASSED`, `CLIENT_COMPRESSED`, `SERVER_FALLBACK_COMPRESSED`, atau `FAILED`).
- **F-41** (SPJ-06): Uji visual memastikan teks nominal, tanda tangan, dan stempel tetap terbaca setelah kompresi dengan berkas dari ukuran kecil hingga mendekati batas 30 MB.
- **F-42** (SPJ-06): Kompresi PDF tidak mengubah jawaban Form Dinamis maupun data/ekspor Excel.
- **F-43** (SPJ-06): Status UI bergerak dari “Menyiapkan dokumen...” ke “Mengunggah dokumen...” untuk proses kompresi klien, dan upload berhasil hanya setelah server mengonfirmasi penyimpanan final.
- **K-71** (PJK-01, PJK-02): Pajak SPJ diisi manual oleh Seksi. Sistem tidak menghitung pajak secara otomatis dari tarif atau master. Satu-satunya perhitungan otomatis terkait pajak adalah Total Pajak, yaitu jumlah seluruh entri pajak, dan Jumlah yang dibayarkan, yaitu nilai bruto dikurangi Total Pajak, dan tidak mengubah nominal kuitansi berdasarkan pajak.
- **K-72** (PJK-01): Setelah isian SPJ disimpan, sistem menampilkan pop-up pajak. Seksi dapat menambah beberapa entri pajak; setiap entri memilih jenis pajak dan mengisi nominalnya.
- **K-73** (PJK-01): Pilihan jenis pajak hanya berisi Master Jenis Pajak berstatus aktif. Admin mengelola master tersebut; peran lain ditolak di server.
- **K-74** (PJK-02): Entri pajak tersimpan pada SPJ dan tidak mengubah nominal bruto kuitansi maupun komitmen SPD. SPJ tanpa pajak diterima.
- **K-74a** (PJK-02): Entri pajak yang membuat Total Pajak melebihi nilai bruto kuitansi ditolak saat disimpan. Pesan validasi menampilkan nilai bruto, Total Pajak, dan batas bahwa Total Pajak tidak boleh lebih dari nilai bruto kuitansi; entri tidak tersimpan dan Total Pajak tidak berubah. Penolakan dilakukan di server, termasuk pada permintaan langsung tanpa melalui formulir.
- **K-74b** (PJK-02): Entri pajak dengan Total Pajak sama dengan atau kurang dari nilai bruto diterima, dan Jumlah yang dibayarkan dihitung sebagai nilai bruto dikurangi Total Pajak sesuai 131e.
- **M-91** (BNT-03): SPJ Draft yang memiliki tanggal/identitas beririsan tetap dapat disimpan, diedit, dicetak, dan dilengkapi. Tidak ada strict blocking pada aksi simpan Draft.
- **M-92** (SPJ-05, BNT-03): Saat mengajukan SPJ, server mendeteksi bentrok identitas yang sama di TA yang sama terhadap SPJ berstatus Terkunci, Menunggu BKU, atau Dibukukan; Draft dan SPJ yang dikembalikan untuk perbaikan diabaikan. Pengajuan yang bentrok ditolak, SPJ tetap Draft, dan tidak muncul di antrean Verifikator.
- **M-93** (BNT-03): Uji rentang inklusif: tumpang tindih sebagian, rentang yang sepenuhnya berada dalam rentang lain, dan tanggal mulai/selesai yang sama ditolak; rentang yang berurutan dengan tanggal tanpa irisan mengikuti rumus inklusif dan hasil yang benar.
- **M-94** (BNT-03): Jika `[SYS_END_DATE]` kosong atau sama dengan `[SYS_START_DATE]`, tanggal selesai efektif dianggap tanggal mulai dan konflik pada satu hari terdeteksi. Tanggal selesai sebelum tanggal mulai ditolak sebagai input tidak valid.
- **M-95** (BNT-03): Uji multi-peserta pada blok berulang memastikan semua identitas dicek satu per satu, tidak tertukar antarbaris; konflik satu peserta saja menolak seluruh pengajuan SPJ tersebut.
- **M-96** (BNT-03): Setelah SPJ pembanding dibatalkan/dihapus atau statusnya kembali menjadi non-komitmen, tanggalnya tidak lagi memblokir; entri identitas tetap tersedia untuk auto-fill. Pengajuan yang sedang diuji tidak dibandingkan dengan dirinya sendiri.
- **M-97** (BNT-03): Dua pengajuan serentak dengan identitas dan jadwal yang sama tidak dapat sama-sama lolos; validasi bentrok dan transisi status dilakukan secara atomik di server.
- **M-98** (BNT-03): Peringatan bentrok hanya memuat identitas, rentang tanggal konflik, dan referensi SPJ/seksi/subkegiatan secukupnya; tidak membocorkan rincian isi atau nominal transaksi pembanding.
- **O-109** (REK-01): **Tampilan Split View pada Form SPJ:** Saat PPTK membuka lembar kerja pengisian rincian penerima SPJ, antarmuka terbagi menjadi Panel Kiri (Pustaka Direktori Rekening) dan Panel Kanan (Form Rincian SPJ).
- **O-110** (REK-01): **Pencarian Fleksibel di Panel Kiri:** Pengguna dapat melakukan pencarian instan di Panel Kiri menggunakan kata kunci berupa Nama Penerima, Alias/Instansi, maupun Nomor Rekening.
- **O-111** (REK-01): **Auto-Fill ke Form Panel Kanan:** Memilih salah satu entri hasil pencarian di Panel Kiri otomatis mengisi seluruh kolom rekening penerima (nama, bank, nomor rekening) di Panel Kanan.
- **O-112** (REK-02): **Input Bebas Rekening Baru Tanpa Blokir Kaku:** Jika data tidak ditemukan di panel kiri, PPTK dapat langsung mengetik data baru di form panel kanan tanpa penolakan validasi format/angka kaku.
- **O-113** (REK-02): **Auto-Capture Rekening Baru ke Direktori:** Saat SPJ disimpan atau rincian penerima disimpan, rekening baru yang diketik otomatis ditambahkan ke Direktori Rekening Bank sistem untuk transaksi berikutnya.
- **O-114** (REK-03): **Snapshot Immutability SPJ Terhadap Perubahan Direktori:** Admin melakukan koreksi ejaan atau penggabungan duplikat rekening di menu Direktori Rekening Bank; data kuitansi/SPJ yang telah disahkan/dibukukan ke BKU terbukti tidak berubah atau rusak.
- **O-115** (REK-03): **Retensi Rekening saat Pembatalan SPJ Draft:** Ketika SPJ Draft yang memuat input rekening baru dibatalkan/dihapus, transaksi SPJ terhapus bersih tanpa jejak, namun data rekening baru tersebut tetap tersimpan di Direktori Rekening Bank.
- **O-116** (REK-05): **Kewenangan Kelola Direktori oleh Admin:** Admin memiliki akses khusus untuk melihat direktori rekening global, melakukan merge data duplikat, dan mengedit ejaan nama/bank; role lain (PPTK/Bendahara/Verifikator) hanya memiliki hak baca/pilih dan auto-capture melalui SPJ.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.