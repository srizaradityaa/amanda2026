# PAKET LANGKAH 5C3: TEMPLATE, KUITANSI & SPJ

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 5 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 5 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 86 | SPJ-06 | Unggah lampiran PDF (client-first, fallback server) | PPTK | P1 | Frontend | SPJ-01 |
| 87 | SPJ-05 | Pengajuan SPJ ke Verifikator | PPTK | P0 | Frontend | SPJ-04, BNT-03, PEN-08 |
| 88 | BNT-03 | Validasi bentrok jadwal saat pengajuan | PPTK, Sistem | P0 | Frontend | BNT-02, SPJ-05 |

## 2. Aturan kunci per fitur (ringkasan)
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

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

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

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **F-33d** (SPJ-05): Nama dan NIP pejabat pada kuitansi dan Hasil Verifikasi SPJ diambil dari penugasan yang berlaku saat kuitansi disimpan atau SPJ diajukan ke Verifikator. SPJ yang diajukan sebelum delegasi lalu diverifikasi saat delegasi berjalan tetap atas nama pejabat definitif.
- **F-35** (SPJ-06): Berkas PDF sampai dengan 5 MB melewati kompresi, sedangkan berkas di atas 5 MB hingga 30 MB memicu kompresi otomatis di peramban.
- **F-36** (SPJ-06): Berkas asal di atas 30 MB ditolak sebelum kompresi dengan pesan batas ukuran yang jelas.
- **F-37** (SPJ-06): Jika kompresi klien berhasil, berkas yang dikirim adalah hasil optimasi dan ukuran final dicatat; target hasil maksimal 10 MB.
- **F-38** (SPJ-06): Jika kompresi klien gagal, kehabisan memori, atau melewati 15 detik, sistem menjalankan server fallback secara otomatis tanpa meminta PPTK memilih ulang berkas.
- **F-41** (SPJ-06): Uji visual memastikan teks nominal, tanda tangan, dan stempel tetap terbaca setelah kompresi dengan berkas dari ukuran kecil hingga mendekati batas 30 MB.
- **F-42** (SPJ-06): Kompresi PDF tidak mengubah jawaban Form Dinamis maupun data/ekspor Excel.
- **F-43** (SPJ-06): Status UI bergerak dari “Menyiapkan dokumen...” ke “Mengunggah dokumen...” untuk proses kompresi klien, dan upload berhasil hanya setelah server mengonfirmasi penyimpanan final.
- **M-91** (BNT-03): SPJ Draft yang memiliki tanggal/identitas beririsan tetap dapat disimpan, diedit, dicetak, dan dilengkapi. Tidak ada strict blocking pada aksi simpan Draft.
- **M-92** (SPJ-05, BNT-03): Saat mengajukan SPJ, server mendeteksi bentrok identitas yang sama di TA yang sama terhadap SPJ berstatus Terkunci, Menunggu BKU, atau Dibukukan; Draft dan SPJ yang dikembalikan untuk perbaikan diabaikan. Pengajuan yang bentrok ditolak, SPJ tetap Draft, dan tidak muncul di antrean Verifikator.
- **M-93** (BNT-03): Uji rentang inklusif: tumpang tindih sebagian, rentang yang sepenuhnya berada dalam rentang lain, dan tanggal mulai/selesai yang sama ditolak; rentang yang berurutan dengan tanggal tanpa irisan mengikuti rumus inklusif dan hasil yang benar.
- **M-94** (BNT-03): Jika `[SYS_END_DATE]` kosong atau sama dengan `[SYS_START_DATE]`, tanggal selesai efektif dianggap tanggal mulai dan konflik pada satu hari terdeteksi. Tanggal selesai sebelum tanggal mulai ditolak sebagai input tidak valid.
- **M-95** (BNT-03): Uji multi-peserta pada blok berulang memastikan semua identitas dicek satu per satu, tidak tertukar antarbaris; konflik satu peserta saja menolak seluruh pengajuan SPJ tersebut.
- **M-96** (BNT-03): Setelah SPJ pembanding dibatalkan/dihapus atau statusnya kembali menjadi non-komitmen, tanggalnya tidak lagi memblokir; entri identitas tetap tersedia untuk auto-fill. Pengajuan yang sedang diuji tidak dibandingkan dengan dirinya sendiri.
- **M-97** (BNT-03): Dua pengajuan serentak dengan identitas dan jadwal yang sama tidak dapat sama-sama lolos; validasi bentrok dan transisi status dilakukan secara atomik di server.
- **M-98** (BNT-03): Peringatan bentrok hanya memuat identitas, rentang tanggal konflik, dan referensi SPJ/seksi/subkegiatan secukupnya; tidak membocorkan rincian isi atau nominal transaksi pembanding.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.