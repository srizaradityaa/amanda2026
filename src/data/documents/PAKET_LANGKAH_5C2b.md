# PAKET LANGKAH 5C2b: TEMPLATE, KUITANSI & SPJ

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 5 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 5 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 94 | REK-03 | Snapshot rekening pada SPJ & retensi direktori | Sistem | P1 | Frontend | REK-02 |
| 95 | REK-05 | Admin kelola Direktori Rekening Bank | Admin | P2 | Frontend | REK-03 |
- **REK-05:** dipindah ke langkah ini dari fase F1 karena ketergantungan.

## 2. Aturan kunci per fitur (ringkasan)
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

#### Dokumen 04 §2.5

### 2.5 Direktori Rekening Bank (Global & Transaksional Mandiri)
- `bank_accounts_directory`: Koleksi referensi rekening bank yang dihimpun secara otomatis dari pengisian SPJ (*auto-capture*) dan dikelola Admin.
  - Atribut konseptual: `id`, `account_name` (nama pemilik/penerima), `bank_name` (nama bank), `account_number` (nomor rekening), `alias` (nama alias/instansi, opsional), `created_at`, `updated_at`.
  - Bersifat global lintas-seksi untuk memudahkan penggunaan ulang (*reusability*) rekening pihak ketiga/rekanan/pegawai.
  - Tidak memiliki indeks unik kaku yang memblokir penambahan variasi penulisan dari form PPTK. Penggabungan dan standardisasi dikontrol oleh Admin melalui fungsi *merge* dan koreksi.
  - Pembatalan transaksi SPJ tidak menghapus baris pada direktori ini.

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

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **O-114** (REK-03): **Snapshot Immutability SPJ Terhadap Perubahan Direktori:** Admin melakukan koreksi ejaan atau penggabungan duplikat rekening di menu Direktori Rekening Bank; data kuitansi/SPJ yang telah disahkan/dibukukan ke BKU terbukti tidak berubah atau rusak.
- **O-115** (REK-03): **Retensi Rekening saat Pembatalan SPJ Draft:** Ketika SPJ Draft yang memuat input rekening baru dibatalkan/dihapus, transaksi SPJ terhapus bersih tanpa jejak, namun data rekening baru tersebut tetap tersimpan di Direktori Rekening Bank.
- **O-116** (REK-05): **Kewenangan Kelola Direktori oleh Admin:** Admin memiliki akses khusus untuk melihat direktori rekening global, melakukan merge data duplikat, dan mengedit ejaan nama/bank; role lain (PPTK/Bendahara/Verifikator) hanya memiliki hak baca/pilih dan auto-capture melalui SPJ.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.