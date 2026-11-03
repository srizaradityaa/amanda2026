# PAKET LANGKAH 5A: TEMPLATE, KUITANSI & SPJ

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 5 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 5 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 75 | TPL-02 | Form Builder (jenis belanja, versi, field) | Admin | P0 | Frontend | FND-02 |
| 76 | TPL-01 | Visual Live Editor template kuitansi | Admin | P1 | Frontend | FND-02 |
| 78 | BNT-02 | Tag sistem Form Dinamis perjalanan dinas | Admin | P1 | Frontend | TPL-02 |
| 82 | TPL-03 | Pratinjau Langsung (tab Visual Live Editor) | Admin | P1 | Frontend | TPL-02, BNT-02 |

## 2. Aturan kunci per fitur (ringkasan)
### TPL-02 — Form Builder (jenis belanja, versi, field)
- **Peran:** Admin
- **Aturan:** Form per jenis belanja; field wajib/opsional, tipe, urutan, tag sistem; maks. SATU blok berulang bernama; setiap perubahan = versi baru; SPJ menyimpan versi saat dibuat.
- **Rujukan:** D01 §9 poin 8–9; D04 §2.2; D02 §5

### TPL-01 — Visual Live Editor template kuitansi
- **Peran:** Admin
- **Aturan:** Tanpa coding + preview cetak; opsi unggah .doc/.docx sebagai alternatif; mengatur template, bukan data transaksi.
- **Rujukan:** D02 §2.3; D01 §15 poin 7

### BNT-02 — Tag sistem Form Dinamis perjalanan dinas
- **Peran:** Admin
- **Aturan:** [SYS_PERSONNEL_ID], [SYS_PERSONNEL_NAME], [SYS_START_DATE], [SYS_END_DATE]; ID/nama harus berpasangan dalam konteks sama (field utama atau satu baris blok); tag tersembunyi bagi pengisi.
- **Rujukan:** D01 §11 poin 2; D03 §10 poin 1; D04 §2.4

### TPL-03 — Pratinjau Langsung (tab Visual Live Editor)
- **Peran:** Admin
- **Aturan:** Tab berdampingan "Konfigurasi Editor" (bukan pop-up, draf tidak hilang); render draf belum tersimpan; simulasi wajib/opsional, blok berulang, tag; mock data terisolasi; hanya memori klien; hanya Admin; tema Treasury.
- **Rujukan:** D01 §9 poin 11; D03 §2.4

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 01 §9

## 9. KATALOG LAPORAN
1. **Format:** Setiap laporan tersedia dalam PDF untuk cetak dan arsip, serta Excel untuk diolah lebih lanjut, sesuai hak peran.
2. **Daftar laporan:**
   a. Rekap realisasi per seksi: pagu, realisasi BKU, Realisasi (%) (Realisasi BKU ÷ Pagu), dan status per seksi.
   b. Buku Kas (BKU): nomor BKU (input manual Bendahara, unik per TA), tanggal BKU, nominal, dan kuitansi terkait (kolom ini tidak ditampilkan untuk PA/KPA). BKU AMANDA murni mencatat pembukuan realisasi pengeluaran belanja per kuitansi/SPJ dan tidak mencatat transaksi penerimaan kas, SP2D, atau saldo Uang Persediaan (UP/GU/TU). Sistem membebaskan penanggalan tanpa batasan kronologis antar-tanggal kuitansi, SPJ, dan BKU.
   c. Daftar kuitansi dan SPJ: nomor, tanggal, seksi, status kuitansi (Aktif atau Terkunci), dan status SPJ. Hanya kuitansi dan SPJ yang sudah Dibukukan (BKU tercatat). Laporan ini tidak ditampilkan kepada PA/KPA.
   d. Laporan realisasi per seksi dan subkegiatan: kolom Realisasi (%) (Realisasi BKU ÷ Pagu) per seksi dan per subkegiatan.
   e. Rekap isian SPJ per jenis belanja: per SPJ, isian Form Dinamis dalam format Excel. Isian mengikuti versi form saat SPJ dibuat (Dokumen 04 §2.2). Susunan kolomnya diatur pada poin 6. Pajak tidak termasuk dalam laporan ini. Laporan ini berlaku untuk semua peran yang berhak.
   f. Rekap pajak per jenis pajak: entri pajak pada SPJ yang sudah memiliki BKU, dikelompokkan per jenis pajak. Diatur pada poin 10.
   g. Rincian Kartu Kendali Kegiatan (realisasi per subkegiatan dan rekening belanja): laporan baru yang terpisah dari laporan (d). Tampil dalam PDF dan Excel dengan susunan berikut:
      1) Kepala: logo dan nama instansi, judul "Rincian Kartu Kendali Kegiatan", dan keterangan "per [tanggal akhir periode laporan]".
      2) Blok identitas: kode dan nama subkegiatan, kode dan nama rekening belanja, serta pagu akhir pasangan subkegiatan dan rekening pada TA tersebut (Dokumen 04 §2.2). Unit organisasi, program, kegiatan, dan aktivitas tidak ditampilkan.
      3) Satu blok per pasangan subkegiatan dan rekening belanja yang sudah memiliki realisasi BKU. Pasangan atau rekening tanpa realisasi tidak membentuk blok.
      4) Kolom tabel: No; Tanggal (tanggal BKU); No. Bukti (nomor BKU); Uraian (uraian kuitansi yang dibukukan); Realisasi (nominal bruto BKU); Sisa Anggaran (pagu akhir dikurangi akumulasi realisasi BKU sampai baris tersebut, tanpa komitmen). Kolom LS, UP/GU/TU, dan kolom Form Dinamis tidak ada.
      5) Urutan baris menurut tanggal BKU naik, lalu nomor BKU. Setiap blok diakhiri baris TOTAL yang memuat total realisasi dan sisa anggaran akhir.
      6) Blok disusun ke bawah, satu blok setelah blok lain, tidak berdampingan. Dalam PDF, blok boleh berlanjut ke halaman berikutnya dengan header kolom diulang. Dalam Excel, setiap blok memakai baris judul sendiri dan dipisahkan satu baris kosong dalam satu sheet.
      7) Filter tersedia untuk seksi, subkegiatan, dan periode tanggal BKU. Filter hanya membatasi baris yang tampil dan diunduh; sisa anggaran selalu dihitung dari awal TA, tidak dimulai ulang dari tanggal awal periode filter.
      8) Cakupan per peran mengikuti laporan (a) pada poin 3. Hanya data SPJ Dibukukan yang masuk laporan.
   h. Unduhan lampiran PDF SPJ diatur pada Dokumen 02 §9 dan bukan bagian dari katalog ini.
3. **Cakupan per peran:** Bendahara dan Verifikator melihat seluruh seksi. PPTK hanya melihat seksinya. Pengawas/Auditor melihat seluruh seksi pada TA yang ditugaskan dalam mode baca saja. Admin tidak mendapat laporan apa pun. Akses PA/KPA: laporan (a), (b), (d), (e), (f), dan (g) untuk seluruh seksi, hanya data SPJ Dibukukan. Laporan (c) tidak ditampilkan kepada PA/KPA. Laporan (b) dan (f) tampil tanpa kolom kuitansi untuk PA/KPA. Laporan (f) mengikuti cakupan laporan (e). Laporan (g) mengikuti cakupan laporan (a). Seluruh laporan berbasis realisasi: hanya SPJ berstatus Dibukukan (BKU tercatat) yang masuk laporan. Komitmen kuitansi yang belum dibukukan dan SPJ berstatus Menunggu BKU tidak dilaporkan.
4. **Pengisian form:** Seksi memilih jenis belanja di awal pembuatan SPJ, dan pilihan itu menentukan Form Dinamis yang tampil. Daftar jenis belanja berasal dari Form Dinamis yang dikelola Admin, bukan daftar tetap di aplikasi. Jenis belanja bukan field di dalam form dan tidak diisi ulang. Seluruh field Form Dinamis diisi manual oleh Seksi. Nilai tidak diwarisi dari rekening belanja dan tidak dihitung otomatis. Laporan (e) menampilkan jawaban tersebut seperti tanggapan Google Form di spreadsheet: satu baris per SPJ, satu kolom per field; jika form memiliki blok berulang, satu baris per entri blok (poin 9). Pengelompokan per jenis belanja mengikuti jenis belanja yang dipilih di awal SPJ. Tampilan dan unduhan diatur pada poin 7 dan 8.
5. **Jejak:** Setiap unduhan atau cetakan laporan oleh Pengawas/Auditor tercatat di Jejak Audit (§8 poin 8).
6. **Susunan kolom laporan e (Excel):** Setiap jenis belanja menjadi satu sheet di file Excel. Kolom sheet adalah gabungan field dari semua versi form yang dipakai SPJ di sheet tersebut, diurutkan mengikuti versi terbaru; field yang tidak ada pada versi form SPJ tertentu tampil kosong. Jenis belanja tidak menjadi kolom, karena sudah menjadi nama sheet. Contoh untuk jenis belanja perjalanan dinas luar daerah: Nama, NIP, Uraian, Seksi, Nama Rekening Penerima, Nomor Rekening, Nama Bank, Upload SPJ, Nomor Surat Perintah Tugas, Tanggal Surat Perintah Tugas, Golongan Pangkat, Daerah Tujuan, Tanggal Berangkat, Tanggal Kembali, Lama Hari, Uang Harian Per Hari, Total Uang Harian, Uang Transport, Total Biaya Lainnya, Nama Hotel, Tanggal Check In, Tanggal Check Out, Jumlah Malam, Rate/Malam, Total Biaya Penginapan, Dari, Tujuan, lalu kelompok field Penerbangan 1 (Tanggal Penerbangan, Nama Maskapai, Kode Penerbangan, Nomor Tiket, Kode Booking, Asal Keberangkatan, Tujuan Keberangkatan, Harga Tiket), kelompok field Penerbangan 2 dengan kolom yang sama, Total Biaya Tiket, dan Total Yang Dibayarkan.
   - Field yang namanya berulang diberi penanda urut (Penerbangan 1 dan Penerbangan 2) agar kolom dapat dibedakan.
   - Laporan (e) tidak menambahkan kolom BKU, kode subkegiatan, kode rekening, atau kuitansi setelah kolom form.
   - Visibilitas kolom NIP dan Nomor Rekening: Tidak ada penyamaran (masking). Kolom NIP dan Nomor Rekening ditampilkan penuh dan terbuka di seluruh unduhan laporan Excel bagi semua peran yang berhak mengunduh (Bendahara, PPTK untuk seksinya, Verifikator, PA/KPA, dan Pengawas/Auditor). Ketentuan ini tidak berlaku untuk Laporan Kustom; kolom NIP/NIK dan Nomor Rekening pada Laporan Kustom tetap mengikuti Matriks Kolom poin 12 d.
7. **Tampilan dan unduhan:** Laporan (e) tampil di dalam AMANDA sebagai tabel yang dapat difilter, misalnya per jenis belanja, seksi, TA, dan periode. Unduhan Excel hanya memuat baris dan kolom sesuai filter yang sedang aktif. Kolom Excel mengikuti field Form Dinamis dari jenis belanja yang difilter. Setiap jenis belanja memiliki form dan susunan kolomnya sendiri, sehingga perjalanan dinas luar daerah dan belanja habis pakai tidak berbagi kolom. Jika filter mencakup lebih dari satu jenis belanja, Excel berisi satu sheet per jenis belanja yang terpilih, dengan nama sheet sesuai jenis belanja. Sheet tidak digabung karena field tiap jenis belanja berbeda.
8. **Wajib atau opsional:** Admin menandai setiap field Form Dinamis sebagai wajib atau opsional, seperti pengaturan wajib pada Google Form. Field wajib harus terisi sebelum SPJ dapat diajukan. Field opsional yang dikosongkan tersimpan kosong dan tampil kosong di laporan maupun Excel; pengisian dengan tanda strip atau teks pengganti tidak diperlukan.

9. **Blok berulang pada Form Dinamis:**
   a. Admin dapat menambahkan paling banyak **satu blok berulang** per form. Admin memberi nama blok, misalnya "Pelaku", lalu memasukkan field ke dalam blok tersebut. Field di luar blok diisi sekali per SPJ.
   b. Form tanpa blok berulang menghasilkan satu baris per SPJ.
   c. Pada SPJ, Seksi/PPTK mengisi entri pertama blok berulang, lalu menekan "+ Tambah" untuk menambah entri berikutnya. Form dengan blok berulang minimal memiliki satu entri.
   d. Field wajib di dalam blok wajib diisi pada setiap entri. Field opsional yang kosong tetap kosong.
   e. Di laporan dan Excel, setiap entri blok menjadi satu baris. Nilai field di luar blok diulang pada setiap baris SPJ tersebut.
   f. Field biasa yang namanya berulang, seperti Penerbangan 1 dan Penerbangan 2 pada contoh perjalanan dinas di poin 6, bukan blok berulang. Keduanya adalah field tunggal yang dipasang Admin di dalam form.
   g. Struktur blok mengikuti versi form saat SPJ dibuat (Dokumen 04 §2.2).

10. **Rekap pajak per jenis pajak (laporan f):**
   a. Laporan hanya memuat entri pajak pada SPJ yang sudah memiliki BKU (terealisasi), satu baris per entri pajak. SPJ yang belum dibukukan tidak muncul di laporan.
   b. Kolom: Jenis Pajak, Nominal Pajak, Seksi, Jenis Belanja, Kode Subkegiatan, Kode Rekening Belanja, No. BKU, dan Tanggal Kuitansi (kolom Tanggal Kuitansi tidak ditampilkan untuk PA/KPA).
   c. Tampilan di AMANDA dikelompokkan per jenis pajak. Unduhan Excel berisi satu sheet per jenis pajak, sama seperti aturan sheet per jenis belanja (poin 7).
   d. Laporan dapat difilter menurut jenis pajak, seksi, TA, dan periode. Unduhan Excel hanya memuat baris sesuai filter aktif.
   e. Excel tidak memuat subtotal atau total otomatis.
   f. Pajak tidak masuk laporan rekap isian SPJ (laporan e). Nominal pajak tidak mengubah nominal bruto kuitansi.

11. **Mode Pratinjau Interaktif Form Dinamis (Admin):**
   a. Pratinjau dibuka sebagai tab "Pratinjau Langsung" di dalam halaman Visual Live Editor, berdampingan dengan tab "Konfigurasi Editor". Admin dapat beralih seketika antara kedua tab tanpa kehilangan draf. Pratinjau tidak dibuka sebagai pop-up (§15 poin 7 dan Dokumen 05 poin 148).
   b. Pratinjau menguji draf form yang belum disimpan. Tampilannya mengikuti tampilan pengisian PPTK, termasuk field wajib, blok berulang dengan tombol "+ Tambah", dan tag sistem.
   c. Auto-fill NIP/NIK pada tag `[SYS_PERSONNEL_ID]` dan `[SYS_PERSONNEL_NAME]` membaca Direktori Transaksional SPJ secara read-only. Pembacaan ini tidak mengubah direktori dan tidak menambah entri Jejak Audit. Jika NIP/NIK tidak ditemukan, nama diisi manual sesuai §11 poin 2.
   d. Cek bentrok jadwal di pratinjau disimulasikan sepenuhnya dengan data contoh (mock data) yang terisolasi. Pratinjau tidak menjalankan validasi bentrok terhadap SPJ asli dan tidak menampilkan status atau tanggal SPJ operasional kepada Admin.
   e. Seluruh isian dalam pratinjau, termasuk ketikan, entri blok berulang, dan hasil simulasi, hanya berada di memori sisi klien sebagai draf editor. Tidak ada data pratinjau yang disimpan ke server, sehingga tidak diperlukan pembersihan berkala. Pratinjau tidak menghasilkan kuitansi, SPJ, BKU, maupun entri Jejak Audit.
   f. Uji batas maksimal satu blok berulang tetap dilakukan di logika Form Builder (Dokumen 05 poin 58), bukan di pratinjau. Pratinjau berfokus pada kenyamanan pengisian dan responsivitas field bagi PPTK.
   g. Pratinjau hanya dapat diakses Admin. Peran lain tidak memiliki akses ke Visual Live Editor maupun tab pratinjau ini.
   h. Tampilan pratinjau mengikuti Tema Visual Treasury & Market Terminal (§1 Dokumen 03): latar slate/charcoal #0B1120, permukaan #111827, garis tepi #1F2937, tidak memakai layar hitam pekat, dan memenuhi kontras WCAG AA.

12. **Penyusunan Laporan Kustom (On-the-Fly Report Builder):**
   a. Menu "Penyusunan Laporan Kustom" tersedia di panel laporan untuk Bendahara, PPTK, PA/KPA, dan Verifikator. Admin dan Pengawas/Auditor tidak memiliki akses. Pengawas/Auditor tetap memakai Katalog Laporan baku secara baca saja (poin 2 dan 3).
   b. Parameter laporan: Tahun Anggaran mengikuti Workspace TA aktif; cakupan seksi mengikuti peran (PPTK hanya seksinya; Bendahara, PA/KPA, dan Verifikator seluruh seksi); rentang tanggal BKU.
   c. Data bersumber hanya dari SPJ Dibukukan dengan BKU tercatat. Kuitansi Aktif, kuitansi Terkunci, SPJ Draft, dan SPJ Menunggu BKU tidak ikut. Kolom Status SPJ tidak tersedia, karena statusnya selalu Dibukukan.
   d. Pilihan kolom diatur melalui Matriks Kolom yang Diizinkan per Peran berikut. Kolom yang tidak diizinkan tidak ditampilkan pada antarmuka peran tersebut.

| Kolom | Bendahara | PPTK (seksi sendiri) | Verifikator | PA/KPA |
|---|---|---|---|---|
| Tanggal BKU, No. BKU | Ya | Ya | Ya | Ya |
| Kode dan Nama Subkegiatan | Ya | Ya | Ya | Ya |
| Kode dan Nama Rekening Belanja | Ya | Ya | Ya | Tidak |
| Uraian Kuitansi | Ya | Ya | Ya | Tidak |
| Nama Penerima | Ya | Ya | Ya | Tidak |
| Nilai Bruto | Ya | Ya | Ya | Ya |
| Total Pajak | Ya | Ya | Ya | Ya |
| Jumlah Dibayarkan | Ya | Ya | Ya | Ya |
| NIP/NIK dan Nomor Rekening | Ya | Ya | Ya | Tidak |

   e. Server memvalidasi daftar kolom pada setiap pratinjau dan unduhan. Jika daftar memuat kolom yang tidak diizinkan untuk peran tersebut, server menolak seluruh permintaan, termasuk permintaan melalui pemanggilan langsung.
   f. Pratinjau menampilkan paling banyak 10 baris pertama dengan kolom yang dipilih. Unduhan tersedia dalam format Excel (.xlsx) atau PDF (.pdf), dengan baris dan kolom sesuai filter aktif.
   g. Kolom NIP/NIK dan Nomor Rekening ditampilkan penuh tanpa penyamaran (masking) bagi peran yang berhak, sesuai poin 6.
   h. Unduhan laporan kustom oleh Bendahara, PPTK, PA/KPA, atau Verifikator tidak menghasilkan entri Jejak Audit, sesuai aturan poin 5.
   i. Halaman penyusunan laporan kustom berupa halaman sendiri, bukan pop-up (§15 poin 7).


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

#### Dokumen 02 §2.3

### 2.3 Editor template
Admin mengelola tata letak dan teks melalui Visual Live Editor tanpa coding, dengan preview cetak. Opsi unggah template `.doc`/`.docx` merupakan alternatif. Editor mengatur template, bukan menggantikan data transaksi; data seperti TA, uraian, nominal, subkegiatan, pejabat dan tanggal diisi dari transaksi/Workspace TA sesuai sumbernya. Editor juga mengatur template Hasil Verifikasi SPJ (§8).

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

#### Dokumen 03 §10

## 10. Alur Validasi Bentrok Jadwal Perjalanan Dinas
1. Admin menandai field Form Dinamis perjalanan dengan `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, dan `[SYS_END_DATE]`. Pasangan ID/nama berada pada konteks yang sama; field tanggal dapat ditempatkan di tingkat dokumen atau blok sesuai cakupannya.
2. PPTK memasukkan NIP/NIK pada field bertag. Jika identitas tersedia di Direktori Transaksional SPJ, sistem mengisi nama pasangan otomatis; jika belum, PPTK mengisi nama. Untuk setiap peserta dalam Blok Berulang, lookup dan pasangan nama dilakukan pada baris yang sama.
3. PPTK dapat menyimpan, mencetak, dan melanjutkan SPJ sebagai Draft tanpa validasi bentrok yang memblokir. Ketika menekan “Ajukan ke Verifikator”, server menguji jadwal seluruh identitas pada SPJ terhadap SPJ lain di TA yang sama berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft dan SPJ yang dikembalikan untuk perbaikan diabaikan.
4. Rentang tanggal inklusif diuji dengan rumus overlap yang ditetapkan pada Dokumen 01 §11. Jika tanggal selesai kosong/sama dengan tanggal mulai, sistem memakai tanggal mulai sebagai tanggal selesai.
5. Jika bentrok, pengajuan ditolak dan SPJ tetap Draft; PPTK menerima identitas, tanggal bentrok, dan referensi pembanding secukupnya untuk koreksi, tanpa rincian SPJ atau nominal lain. Jika tidak bentrok, SPJ diajukan dan statusnya berubah sesuai workflow. Pemeriksaan server dan transisi status dilakukan atomik.
6. Saat SPJ dihapus/dibatalkan atau kembali menjadi status non-komitmen melalui alur yang berlaku, jadwalnya tidak lagi menghalangi pengajuan lain. Entri identitas pada Direktori Transaksional SPJ tetap disimpan untuk auto-fill berikutnya.
7. Verifikator hanya menerima SPJ yang berhasil melewati pemeriksaan saat diajukan. Admin mengelola koreksi dan penggabungan identitas melalui panel direktori; perubahan tidak menghapus relasi transaksi historis.

#### Dokumen 04 §2.4

### 2.4 Direktori Transaksional SPJ dan validasi jadwal
- Direktori Transaksional SPJ menyimpan pasangan NIP/NIK dan nama yang berasal dari pengisian Form Dinamis perjalanan dinas. Data ini bukan Master Personel, tidak membentuk akun, dan digunakan untuk lookup/auto-fill nama. Identitas dapat berasal dari pegawai organik, honorer, narasumber, atau pihak luar.
- Tag sistem tersembunyi: `[SYS_PERSONNEL_ID]` (NIP/NIK), `[SYS_PERSONNEL_NAME]` (nama pasangan), `[SYS_START_DATE]` dan `[SYS_END_DATE]`. Tag ID/nama harus berpasangan pada field utama yang sama atau pada satu entri blok berulang yang sama. Rentang tanggal pada tingkat dokumen dapat dipakai bersama untuk semua orang di blok; cakupannya ditentukan konfigurasi form.
- Jika NIP/NIK ditemukan, nama pasangan diisi otomatis; jika belum ada, nama diinput PPTK. Identitas dicatat/diperbarui di direktori saat SPJ disimpan atau diajukan. Penghapusan SPJ tidak menghapus profil direktori.
- Pemeriksaan jadwal dijalankan server-side hanya saat pengajuan ke Verifikator. Menyimpan Draft tidak diblokir. Dua rentang inklusif bentrok bila `Mulai Baru ≤ Selesai Lama` dan `Selesai Baru ≥ Mulai Lama`. Jika tanggal selesai kosong/sama dengan tanggal mulai, tanggal selesai efektif sama dengan tanggal mulai; tanggal selesai sebelum tanggal mulai ditolak.
- Cakupan bentrok: identitas sama, TA sama, SPJ pembanding berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft/yang dikembalikan untuk perbaikan tidak dihitung. SPJ yang dibatalkan/dihapus atau kembali ke status non-komitmen tidak lagi menahan jadwal. Pengajuan dan penetapan status dilakukan atomik untuk mencegah pengajuan serentak lolos bersamaan.
- Admin boleh mengoreksi dan menggabungkan entri direktori duplikat. Merge harus memperbarui referensi identitas validasi tanpa menghapus/mengubah isi historis SPJ yang telah tersimpan; perubahan administratif dicatat dalam Audit Event.

#### Dokumen 03 §2.4

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

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **H-55** (TPL-02): Field Form Dinamis bertanda wajib tidak dapat diajukan dalam keadaan kosong. Field opsional yang kosong tampil kosong di laporan dan Excel, tanpa tanda strip. Sistem tidak menolak pengajuan SPJ berdasarkan selisih nilai rincian Form Dinamis terhadap nominal bruto kuitansi (pencatatan rincian bersifat informasional murni).
- **I-58** (TPL-02): Admin dapat menambahkan paling banyak satu blok berulang per form dan memberi nama blok. Percobaan menambah blok kedua ditolak.
- **I-64** (TPL-02): Perubahan form setelah SPJ dibuat tidak mengubah struktur blok pada SPJ tersebut.
- **I-64a** (TPL-03): Admin membuka tab "Pratinjau Langsung" dari Visual Live Editor. Pratinjau tampil di halaman yang sama tanpa pop-up, dan Admin dapat berpindah ke tab "Konfigurasi Editor" tanpa kehilangan draf.
- **I-64b** (TPL-03): Field wajib yang dikosongkan di pratinjau memunculkan peringatan dan simulasi pengajuan ditolak. Field opsional yang kosong tetap diterima.
- **I-64c** (TPL-03): Di pratinjau, tombol "+ Tambah" menambah entri blok berulang, dan setiap entri memiliki field yang sama dengan entri pertama.
- **I-64d** (TPL-03): NIP/NIK yang terdaftar di Direktori Transaksional SPJ mengisi nama pasangan otomatis. NIP/NIK yang tidak terdaftar membiarkan nama diisi manual. Pembacaan ini tidak mengubah direktori dan tidak menambah Jejak Audit.
- **I-64e** (TPL-03): Cek bentrok jadwal di pratinjau memakai data contoh. Uji ini tidak membaca SPJ asli dan tidak menampilkan status atau tanggal SPJ operasional kepada Admin, termasuk melalui pemanggilan langsung.
- **I-64f** (TPL-03): Setelah pratinjau ditutup atau halaman dimuat ulang tanpa menyimpan, tidak ada data pratinjau yang tersimpan di server, dan tidak terbentuk kuitansi, SPJ, BKU, atau entri Jejak Audit.
- **I-64g** (TPL-03): Bendahara, PPTK, Verifikator, PA/KPA, Pengawas/Auditor, dan Publik ditolak di server saat membuka Visual Live Editor, tab pratinjau, atau melalui pemanggilan langsung.
- **M-89** (BNT-02): Form Dinamis perjalanan dinas menerima tag tersembunyi `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, `[SYS_END_DATE]`; konfigurasi menolak pasangan ID/nama yang tidak berada dalam konteks yang sama. Tag dapat digunakan pada field utama atau dalam satu baris blok berulang.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.