# Data Contoh Uji Manual AMANDA (Langkah 3, 4, dan 5A, Tahap A)

Data ini hanya ada di memori (data contoh). Setiap muat ulang halaman, data kembali ke kondisi awal. Tanggal delegasi dan masa akses pengawas dihitung dari hari ini, jadi status "berjalan" dan "sudah lewat" tetap benar saat diuji.

Password semua akun: `amanda123`

## Akun

| Username | Password | Peran | TA yang tersedia |
|---|---|---|---|
| `admin` | amanda123 | Admin Sistem | Semua TA (dasbor Admin) |
| `198501012010011001` | amanda123 | PA/KPA (Hendra Wijaya) | TA 2026 (Aktif Penuh), TA 2025 (Arsip), TA 2027 (Draft) |
| `198203152009012003` | amanda123 | Bendahara (Siti Rahmawati) | TA 2026, TA 2027 |
| `198911112014032007` | amanda123 | Verifikator (Dewi Anggraini) | TA 2026, TA 2027 |
| `198807202012011004` | amanda123 | PPTK Sekretariat (Budi Santoso) | TA 2026, TA 2027 |
| `199002102015042005` | amanda123 | PPTK Seksi Perencanaan (Maya Lestari) | TA 2026 |
| `197505052008011006` | amanda123 | PPTK Seksi Keuangan (Rahmat Hidayat) | TA 2026, TA 2027 |
| `198601252011011008` | amanda123 | PPTK Seksi PBJ (Agus Prasetiyo), status NON-ACTIVE | Login ditolak (masih punya penugasan aktif di TA 2026) |
| `3210014503900001` | amanda123 | Plh. PPTK Seksi Perencanaan (Nina Marlina) | TA 2026, lewat delegasi aktif |
| `rizal.auditor@balangankab.go.id` | amanda123 | Pengawas/Auditor (Inspektorat) | TA 2026, TA 2025 |
| `lestari.auditor@bpkp.go.id` | amanda123 | Pengawas/Auditor (BPKP) | Login ditolak (masa akses sudah berakhir) |

Akun Pengawas masuk memakai alamat email, bukan NIP.

## Data pendukung

- TA 2026: Aktif Penuh (transaksi sudah ada).
- TA 2025: Arsip Read-Only.
- TA 2027: Draft, pagu terisi, checklist lengkap. Penugasan bersifat provisional dan belum ada SK. Belum ada alokasi, sehingga alur Anggaran diuji dari nol di TA ini.
- Personel tanpa akun: Eko Saputra (pernah PPTK Seksi Perencanaan, kini berakhir), Yuni Astuti (dipakai sebagai calon Plh./Plt.), dan personel lain yang belum punya akun.
- Penugasan lama berakhir: Eko Saputra sebagai PPTK Seksi Perencanaan (berakhir 40 hari lalu, SK-004/2026).
- Delegasi berjalan: Nina Marlina sebagai Plh. PPTK Seksi Perencanaan (menggantikan Maya Lestari), 5 hari lalu s.d. 20 hari lagi.
- Delegasi lewat: Yuni Astuti sebagai Plh. Bendahara (berakhir 2 hari lalu). Status masih "Delegasi Aktif" dan akan berakhir otomatis saat aplikasi dimuat.

## Skenario uji Langkah 3

1. **Masuk per peran.** Masuk dengan setiap akun di tabel di atas. Pilih TA dan peran bila diminta.
2. **Penugasan NON-ACTIVE (A-9c).** Masuk sebagai Admin, buka Tahun Anggaran 2026, tab Penugasan. Baris PPTK Seksi PBJ menampilkan peringatan "NON-ACTIVE, penugasan aktif".
3. **Riwayat penugasan (B-9, B-10).** Di tab Penugasan TA 2026, baris Eko Saputra tampil dengan rentang tanggal mulai dan berakhir, berstatus Berakhir. Tombol SK pada baris itu tetap bisa dibuka dan menampilkan SK-004/2026.
4. **Hapus TA Draft (B-6).** Admin membuka TA 2027 lalu hapus. Tombol hapus hanya aktif untuk Draft tanpa transaksi. TA 2027 harus dibuat ulang bila ingin diuji lagi.
5. **Aktivasi TA kedua (B-10a).** Admin mengubah status TA 2027 menjadi Aktif Penuh. Sistem menolak karena TA 2026 sudah Aktif Penuh.
6. **Ubah pagu (B-7).** Di TA 2027 (Draft), pilih Ubah Pagu lalu ubah nilai. Di TA 2026 tombol ini tidak tersedia.
7. **Arsip TA dan buka kembali (B-8, J-66).** Admin mengubah TA 2026 menjadi Arsip, lalu membukanya kembali sebagai read-only dan memeriksa peringatan SPJ yang belum Dibukukan. Untuk TA 2025 (arsip) cek tampilan read-only.
8. **Tetapkan Plh./Plt. (B-10e, B-10f).** Masuk sebagai PPTK Seksi Keuangan atau Admin, buka Tahun Anggaran 2026, tab Delegasi, lalu Tetapkan Delegasi. Pilihan peran: Bendahara, PPTK, PA/KPA. Coba menetapkan Yuni Astuti sebagai Plh. Bendahara (sistem menolak bila personel itu PPTK).
9. **Cabut delegasi dini (B-10g).** Di tab Delegasi, klik ikon cabut pada delegasi Nina Marlina, isi alasan. Status berubah menjadi Dicabut.
10. **Delegasi berakhir otomatis (B-10h).** Muat ulang aplikasi dan masuk. Delegasi Yuni Astuti berubah menjadi Berakhir. Audit "Berakhir otomatis" tercatat sekali; memuat ulang lagi tidak menambah entri. Penjadwal 23:59 WITA sungguhan menunggu backend.
11. **Audit delegasi (B-10j).** Buka menu Audit. Setiap entri delegasi memuat keterangan status "Delegasi Aktif" atau "Dicabut"/"Berakhir" serta ID pejabat definitif dan pengganti.
12. **Login Plh. (B-10i).** Masuk sebagai Nina Marlina (`3210014503900001`). Akun ini hanya punya delegasi, tanpa penugasan tetap.
13. **Bendahara sekaligus PPTK (B-10c).** Di TA 2027, coba menugaskan Bendahara Siti Rahmawati sebagai PPTK: sistem menolak bila personel yang sama sudah Bendahara (Bendahara bukan PPTK).
14. **Pengawas dengan masa akses berakhir (H-47).** Masuk dengan `lestari.auditor@bpkp.go.id`. Sistem menolak dengan pesan masa akses berakhir.
15. **Pengawas aktif.** Masuk dengan `rizal.auditor@balangankab.go.id` dan pilih TA 2026 atau 2025.

## Langkah 4 Bagian 1: Anggaran, SPD & Gatekeeper (data contoh)

Data komitmen dan realisasi (kuitansi `kui-1` sampai `kui-4` dan BKU `bku-1`) adalah **data contoh pengganti transaksi Langkah 5**. Data ini hanya dipakai untuk memperagakan rumus Sisa SPD Bebas dan akan diganti begitu kuitansi dan BKU sungguhan dibuat.

Ledger SPD awal untuk TA 2026 (`ldg-ar-1` sampai `ldg-ar-8`) berisi penerbitan SPD 100% pagu. Entri ini juga data contoh pengganti hasil Sahkan Langkah 4.

Akun untuk Bagian 1:

| Username | Peran | Dipakai untuk |
|---|---|---|
| `198203152009012003` | Bendahara (Siti Rahmawati) | Jendela, alokasi subkegiatan, Sahkan, SPD, versi |
| `198807202012011004` | PPTK Sekretariat (Budi Santoso), TA 2027 | Alokasi rekening seksi Sekretariat |
| `197505052008011006` | PPTK Seksi Keuangan (Rahmat Hidayat), TA 2027 | Alokasi rekening seksi Keuangan |

Langkah dasar: masuk sebagai Bendahara, pilih TA 2027, lalu buka menu **Anggaran**. TA 2027 dipakai karena belum punya alokasi, sehingga alur dari nol bisa diuji. TA 2027 punya dua seksi (Sekretariat dan Seksi Keuangan) dan dua subkegiatan yang total pagunya 12.000.000.000.

Skenario (urutan uji, bukan ID dari paket):

16. **Buka jendela alokasi (ALK-04).** Bendahara, TA 2027, menu Anggaran. Isi tanggal dan jam tutup lalu tekan Atur Jendela. Hasil: status Dibuka dan hitung mundur tampil. Jam tutup yang sudah lewat ditolak dan isian tetap ada. Sebelum jendela dibuka, alokasi tidak bisa disimpan.
17. **Alokasi subkegiatan (ALK-01).** Ubah pagu dua subkegiatan. Hasil: Selisih terhadap Pagu Induk tampil langsung. Total yang belum sama dengan Pagu Induk masih bisa disimpan (dokumen tidak mengatur penolakan di tahap ini), tetapi Selisih tidak 0 dan tampil merah. Pagu negatif atau berisi huruf ditolak dengan pesan dan isian tetap ada.
18. **Alokasi rekening PPTK (ALK-03, ALK-02).** Masuk sebagai PPTK Sekretariat `198807202012011004`. Tambah rekening, isi pagu, lalu Simpan. Hasil: Pagu Seksi tampil dari subkegiatan. Rekening ganda dalam satu subkegiatan atau rekening nonaktif ditolak dengan pesan dan isian tetap ada. Ulangi untuk seksi Keuangan dengan `197505052008011006`.
19. **Pemantau kesiapan dan banner (ALK-05).** Saat seksi belum seimbang, dasbor Bendahara dan banner merah menampilkan seksi yang belum Tuntas. Setelah semua seksi Tuntas, banner hilang.
20. **Sahkan ditolak lalu diterima (ALK-05).** Bendahara menekan Sahkan saat selisih belum 0 atau seksi belum Tuntas: ditolak dengan pesan. Setelah benar, Sahkan menerbitkan SPD 100% pagu dan menambah baris versi.
21. **Versi alokasi (ALK-07).** Setiap Simpan dan Sahkan menambah baris di bagian Versi Alokasi. Baris lama tidak berubah.
22. **SPD dan Sisa SPD Bebas (SPD-01).** Di TA 2026, tabel SPD menampilkan Komitmen (kuitansi Aktif dan Terkunci yang belum BKU) dan Realisasi (BKU Aktif). Sisa SPD Bebas = SPD aktif - komitmen - realisasi. Angkanya dihitung dari data contoh.
23. **Efisiensi ditolak (SPD-02).** Di TA 2026, klik Efisiensi dengan nilai di atas Sisa SPD Bebas. Hasil: ditolak dengan pesan, jendela tetap terbuka, nilai tetap ada. Nilai di bawah sisa diterima dan muncul di Riwayat perubahan SPD. Alasan efisiensi opsional.
24. **Kenaikan SPD (SPD-02).** Klik Naikkan tanpa alasan: ditolak dengan pesan. Kenaikan yang melebihi pagu juga ditolak. Kenaikan yang sah tercatat di Riwayat.
25. **Mini progress per peran (UIX-06).** Topbar menampilkan Pagu, Realisasi, dan Sisa SPD Bebas. Bendahara melihat seluruh instansi, PPTK hanya seksinya. Setelah efisiensi atau kenaikan, angka topbar ikut berubah.
26. **Menu Anggaran hanya untuk Bendahara dan PPTK.** Masuk sebagai Admin atau PA/KPA: menu Anggaran tidak tampil.

## Langkah 4 Bagian 2A: Drill-down anggaran dan Dasbor PPTK

Cara mencoba: masuk sebagai Bendahara `198203152009012003`, pilih TA 2026, lalu buka menu **Rincian Anggaran**. Akun lain yang punya menu ini: PPTK Sekretariat `198807202012011004` (hanya seksinya), Verifikator `198911112014032007`, dan PA/KPA `198501012010011001`. Gunakan TA 2026 karena sudah berisi data.

Hasil yang diharapkan:
- Tingkat pertama adalah daftar seksi. Klik **Buka** untuk melihat subkegiatan, lalu **Buka** lagi untuk rekening belanja. Breadcrumb di atas tabel dapat dipakai untuk kembali.
- PA/KPA berhenti di subkegiatan: tombol Buka tidak tampil pada tingkat subkegiatan.
- PPTK hanya melihat seksinya sendiri.
- Admin dan Pengawas tidak memiliki menu Rincian Anggaran.
- Kartu Pagu Induk tampil di atas daftar untuk Bendahara, Verifikator, dan PA/KPA. Tidak tampil untuk PPTK.

Status (dibangun dan diperiksa lewat kode; belum diuji langsung di antarmuka karena sesi ini tidak memiliki browser):

| ID | Status | Keterangan |
|---|---|---|
| G-37 | Sebagian | Breadcrumb dan tiga tingkat dibangun. Belum diuji di antarmuka. |
| G-38 | Sebagian | Angka tiap tingkat dijumlahkan dari tingkat di bawahnya di lapisan data. Belum diuji di antarmuka. |
| G-39 | Sebagian | Pembatasan seksi PPTK ada di lapisan data. Permintaan lewat URL belum diuji. |
| G-40 | Sebagian | Lapisan data menolak tingkat rekening untuk PA/KPA; tombol Buka disembunyikan. Belum diuji. |
| G-41 | Sebagian | Admin tidak memiliki menu dan ditolak di lapisan data. Belum diuji lewat URL. |
| G-42 | Sebagian | Drill-down membaca nama, kode, dan angka dari data TA (pemetaan dan alokasi TA), tidak dari Master. Data contoh TA 2025 (Arsip Read-Only) sudah berisi alokasi lengkap: subkegiatan, rekening, SPD = pagu, dan total 13,5 M sama dengan Pagu Induk. Akun uji: PA/KPA Hendra Wijaya `198501012010011001` (satu-satunya penugasan TA 2025 selain Pengawas; Bendahara tidak punya penugasan di TA 2025). Langkah: masuk sebagai PA/KPA, pilih TA 2025, buka Rincian Anggaran, dan pastikan angka tampil. Belum diuji di antarmuka. |
| G-43 | Sebagian | Nominal memakai format Rupiah; kode ditampilkan sebagai teks. Belum diuji. |
| G-43a | Sebagian | Rekening disimpan per pasangan subkegiatan dan rekening, sehingga tampil terpisah. Belum diuji dengan data yang memiliki rekening ganda. |
| B-10d | Sebagian | Dasbor PPTK tidak menampilkan Pagu Induk dan tidak punya menu Rincian yang memuat Pagu Induk. Dasbor Pengawas tidak memuat angka anggaran. Belum diuji di antarmuka. |
| N-108 | Terpenuhi karena belum ada | Tidak ada widget early warning atau burn-rate di aplikasi, sehingga tidak ada yang tampil untuk peran lain. Uji ulang di Langkah 8 saat widget dibuat. |
| DRL-04 | Sebagian | Kartu Pagu Induk tersendiri tampil di dasbor Bendahara, Verifikator, dan PA/KPA. PPTK dan Pengawas tidak melihat kartu ini. Admin memiliki kartu TA dengan Pagu Induk sendiri. Belum diuji di antarmuka. |
| C-15a | Sebagian | Admin melihat banner dan countdown hanya baca, dari data, bila sesinya memiliki TA aktif terpilih. Banner Admin di dasbor dihapus agar tidak ganda dengan banner global di App. Belum diuji di antarmuka. |
| DSB-03 | Sebagian | Dasbor PPTK menampilkan banner dan countdown dinamis, status gatekeeper yang dihitung, ringkasan seksi, kuitansi Aktif, dan SPJ Draft dengan catatan revisi. Belum diuji di antarmuka. |

## Langkah 4 Bagian 2B: APBD-P, Sahkan ulang, dan dasbor Bendahara (data contoh)

Cara mencoba APBD-P: masuk sebagai Admin, buka **Tahun Anggaran**, lalu tekan **Aktifkan APBD-P** pada TA 2026 (Aktif Penuh, sudah disahkan). Isi Pagu Induk perubahan dan tekan Aktifkan. Pengisian yang galat tetap ada di kolom.

Cara mencoba Sahkan ulang: masuk sebagai Bendahara `198203152009012003` untuk TA 2026. Buka **Jendela** dan atur waktu tutup agar PPTK bisa mengisi (jendela tertutup otomatis setelah APBD-P). Sesuaikan pagu lewat panel Alokasi, lalu tekan **Sahkan ulang** setelah semua seksi Seimbang. Pagu rekening di bawah realisasi dan komitmen ditolak dengan pesan galat.

Status (dibangun dan diperiksa lewat kode; belum diuji langsung di antarmuka):

| ID | Status | Keterangan |
|---|---|---|
| TA-09 | Sebagian | Admin mengaktifkan APBD-P lewat modal, memasukkan Pagu Induk perubahan, dan jendela tutup. Lapisan data menolak bila TA belum Aktif Penuh atau alokasi belum disahkan. |
| SPD-04 | Sebagian | Panel Penyesuaian APBD-P di halaman Bendahara menampilkan pagu murni, pagu saat ini, dan realisasi + komitmen per rekening. Penyesuaian pagu tetap lewat panel alokasi yang sudah ada. |
| ALK-06 | Sebagian | Tombol Sahkan berubah menjadi Sahkan ulang bila APBD-P aktif. Galat ditampilkan dan isian tidak dikosongkan. |
| DSB-02 | Sebagian | Dasbor Bendahara memuat ringkasan pagu alokasi, realisasi BKU, sisa SPD bebas, serapan, dan countdown jendela dalam satu baris ticker. Kepadatan Pro Mode (baris 32 px, ticker) diterapkan pada dasbor Bendahara, PA/KPA, dan Verifikator untuk layar 768 px ke atas. Di bawah 768 px tampil mode standar (baris 48 px). Tidak ada tombol ganti mode. Cakupan data tidak berubah. Belum diuji di browser. |
| UIX-09 | Sebagian | Banner dan countdown tampil untuk semua peran kecuali Pengawas (dari App). Countdown hilang bila semua seksi Seimbang. |
| SPD-03 | Sebagian | Pergeseran berjalan di lapisan data dan diuji dengan skrip: penolakan peran, bilangan bulat, sumber sama tujuan, dan sisa SPD; nomor `Pergeseran/001/2026` lalu `002`; total pagu subkegiatan tetap. Pada pergeseran antar-subkegiatan, pagu subkegiatan sumber turun dan tujuan naik sebesar nilai yang sama, sesuai instruksi pengguna (dokumen tidak mengatur hal ini). Panel Geser Anggaran dipasang di halaman Bendahara; belum diuji di browser. |
| D-18 | Sebagian | SPD terbit hanya saat Sahkan. Belum diuji di antarmuka. |
| D-21 | Sebagian | Hanya Bendahara yang melihat panel pergeseran. Belum diuji di antarmuka. |
| D-22 | Sebagian | Nilai dibatasi sisa SPD bebas sumber, ditolak di lapisan data. Belum diuji di antarmuka. |
| D-22a | Sebagian | Tujuan harus pasangan subkegiatan-rekening yang sudah dialokasikan pada TA yang sama, ditolak di lapisan data. Belum diuji di antarmuka. |
| D-23 | Sebagian | Nomor referensi `Pergeseran/NNN/tahun` dibuat otomatis per TA dan dicatat di ledger. Belum diuji di antarmuka. |
| D-23e | Sebagian | Jejak audit mencatat aktor, nomor referensi, rekening sumber (-), rekening tujuan (+), dan nilai. Belum diuji di antarmuka. |
| E-24 | Sebagian | Data contoh TA 2026 memuat versi pagu murni (13 baris) dan tidak tertimpa APBD-P (diuji dengan skrip). Panel APBD-P menampilkan pagu murni, pagu saat ini, dan realisasi + komitmen. Kolom perubahan/pergeseran dan pagu akhir berjenjang belum ada di panel. Belum diuji di browser. |
| E-25 | Sebagian | Diuji dengan skrip: pagu rekening di bawah realisasi + komitmen (Rp 5.000.000) ditolak saat simpan. Belum diuji di browser. |
| E-26 | Belum | Kuitansi belum menyimpan snapshot versi anggaran saat terbit, sehingga transaksi lama belum dapat menunjuk versi murni. Tidak diuji. |
| E-26a | Sebagian | Diuji dengan skrip: Sahkan ulang ditolak saat selisih Rp 1.000.000.000, lalu berhasil setelah subkegiatan dan rekening seimbang. Versi perubahan tercatat. Penahanan kuitansi bergantung pada C-17b yang belum dipasang. |
| C-15 | Sebagian | Kuitansi dan SPJ baru tertahan lewat banner. Tombol Buat Kuitansi belum dinonaktifkan. |
| C-15a | Sebagian | Lihat bagian Bagian 2A. |
| C-15b | Belum | Belum diverifikasi. |
| C-17 | Belum | Pembukaan transaksi setelah gerbang belum diverifikasi. |
| C-17b | Belum | Tombol Buat Kuitansi belum dipasang (dikerjakan pada tahap berikutnya). |
| H-52 | Sebagian | Banner dan countdown disembunyikan untuk Pengawas. Belum diuji di antarmuka. |
| H-53 | Sebagian | Mini progress bar di topbar sudah sesuai per peran dalam kode: Bendahara, PA/KPA, Verifikator seluruh instansi; PPTK seksinya; Admin Pagu Induk saja; Pengawas tanpa bar. Belum diuji di antarmuka. |
| C-12 | Sebagian | Kolom Pagu Seksi di Pemantau Kesiapan dihitung otomatis dari subkegiatan, bukan isian. Belum diuji di antarmuka. |
| C-13 | Sebagian | Alokasi rekening PPTK lewat fungsi validasi di lapisan data. Total rekening terhadap pagu subkegiatan baru ditegakkan saat Sahkan (gerbang). Penolakan saat simpan rekening belum ada; dokumen tidak mengaturnya dengan jelas. Perlu konfirmasi. |
| D-d | Sebagian | Banner Admin kini tampil pada TA Aktif Penuh walau sesi belum memilih TA. Tanpa tombol pengaturan jendela. Belum diuji di antarmuka. |

Catatan: DRL-03 dan G-42 (TA 2025) belum diuji di antarmuka, sehingga status tetap Sebagian.

Catatan Langkah 4 Bagian 2B (lanjutan): TA 2026 memiliki versi pagu murni (13 baris: 5 pagu subkegiatan dan 8 rekening). Pengujian sesi ini dilakukan lewat pemeriksaan kode, typecheck, dan build. Belum ada pengujian di browser, sehingga tidak ada status Terbukti lewat UI.

## Perbaikan uji manual (5 perbaikan)

27. **Ganti Pejabat (PEN-03, B-9).** Masuk sebagai Admin, buka Tahun Anggaran 2026, tab Penugasan. Pada baris penugasan aktif (Bendahara, PPTK, PA/KPA, Verifikator) yang belum berakhir, klik ikon UserPlus "Ganti Pejabat". Pilih personel pengganti dan tanggal efektif. Hasil: penugasan lama berakhir H-1 dari tanggal efektif, penugasan baru dibuat, riwayat lama tetap tampil berstatus Berakhir, dan jejak Audit mencatat pergantian. Tombol ini tidak tampil pada TA Arsip Read-Only. Bendahara tidak boleh diganti oleh personel yang sudah PPTK (D-23b).
28. **Isian Rupiah dengan titik pemisah ribuan.** Semua kolom nominal (alokasi subkegiatan, alokasi rekening PPTK, efisiensi, kenaikan, pergeseran, Pagu Induk saat Buat TA, Ubah Pagu, dan pagu perubahan APBD-P) kini menampilkan titik pemisah ribuan saat diketik (mis. 1.250.000.000). Nilai yang disimpan tetap bilangan bulat tanpa titik. Hanya angka diterima; menempel nilai bertitik dibersihkan otomatis.
29. **Umpan balik Simpan "Tersimpan".** Setiap penyimpanan yang berhasil menampilkan notifikasi "Tersimpan" singkat yang hilang sendiri di pojok kanan bawah. Berlaku pada simpan alokasi subkegiatan, simpan alokasi rekening PPTK, atur jendela, Sahkan, efisiensi, kenaikan, pergeseran, Aktifkan APBD-P, Ubah Pagu, dan Buat TA. Aksi yang galat tidak memunculkan notifikasi. Galat tetap ditampilkan seperti biasa dan isian tidak dikosongkan.
30. **Saring pilihan rekening PPTK.** Saat menambah rekening di alokasi PPTK, rekening yang sudah dipakai di subkegiatan yang sama tidak tampil di daftar pilihan. Rekening nonaktif juga tidak tampil. Baris draf lain di subkegiatan yang sama ikut dihitung, sehingga rekening yang belum tersimpan pun tidak muncul ganda. Penolakan pasangan ganda (C-13b) tetap ditegakkan di lapisan data.
31. **Mini progress bar: Pagu dari seluruh alokasi rekening.** Pagu di topbar kini dihitung dari seluruh alokasi rekening (tidak hanya yang sudah disahkan), sehingga angka Pagu tidak 0 setelah PPTK mengisi pagu namun sebelum Bendahara menekan Sahkan. Realisasi dan Sisa SPD Bebas tetap dihitung hanya dari rekening yang sudah disahkan (memiliki SPD). Cakupan per peran tidak berubah.

## Langkah 5A: Template, Kuitansi & SPJ (Tahap A, frontend dengan data contoh)

Cara mencoba: masuk sebagai Admin (`admin` / `amanda123`). Menu di panel Admin: **Form Dinamis** dan **Template Kuitansi**.

Data contoh Form Dinamis sudah tersedia:
- **Belanja Perjalanan Dinas** (v1): 8 field utama (Uraian, Seksi, Nomor SPT, Tanggal SPT, Daerah Tujuan, Tanggal Berangkat `[SYS_START_DATE]`, Tanggal Kembali `[SYS_END_DATE]`, Uang Harian) + blok berulang "Pelaku" dengan 3 field (NIP/NIK `[SYS_PERSONNEL_ID]`, Nama `[SYS_PERSONNEL_NAME]`, Golongan Pangkat).
- **Belanja Barang Habis Pakai** (v1): 2 field (Uraian, Jumlah Item), tanpa blok berulang.
- **Belanja Jasa Konsultan** (v1): 4 field (Uraian, Nama Konsultan, NIP/NIK Konsultan `[SYS_PERSONNEL_ID]`, Nama Kontak `[SYS_PERSONNEL_NAME]`), tanpa blok berulang.

Direktori Transaksional SPJ (untuk auto-fill pratinjau):
- NIP `198807202012011004` → Budi Santoso, S.T.
- NIP `3210014503900001` → Nina Marlina
- NIP `6701234590123456` → Ahmad Narasumber, S.E.

Mock data bentrok (terisolasi, hanya di pratinjau, I-64e):
- NIP `198807202012011004` terjadwal 2026-11-10 s.d. 2026-11-12
- NIP `3210014503900001` terjadwal 2026-11-15 s.d. 2026-11-15

Skenario uji:

32. **Daftar form (TPL-02).** Admin membuka menu **Form Dinamis**. Tiga jenis belanja tampil di panel kiri: Belanja Perjalanan Dinas, Belanja Barang Habis Pakai, Belanja Jasa Konsultan. Klik salah satu untuk melihat field di tabel. Kolom menampilkan label, tipe, wajib/opsional, dan tag sistem.
33. **Buat form baru (TPL-02).** Isi "Jenis belanja baru" (mis. "Belanja Honoratorium") di panel kiri, klik tombol +. Tambah field dengan tombol "Field" di kanan atas: isi label, pilih tipe, centang wajib/opsional, pilih tag sistem bila perlu. Klik "Simpan Versi Baru". Toast "Tersimpan" muncul. Form baru tampil di daftar kiri.
34. **Edit form = versi baru (TPL-02, I-64).** Buka form yang sudah ada, ubah/tambah/hapus field, lalu "Simpan Versi Baru". Versi bertambah (mis. v1 → v2). Form lama tetap ada di data; `repo.formTerbaru()` mengembalikan versi terbaru.
35. **Maksimal satu blok berulang (I-58).** Saat mengedit form, klik "Blok Berulang" untuk menambah blok. Tombol hilang setelah blok dibuat — tidak bisa menambah blok kedua. Beri nama blok dan tambah field ke dalamnya. Hapus blok dengan tombol "Hapus blok" untuk membuat ulang.
36. **Tag sistem berpasangan (BNT-02, M-89).** Saat menambah field, pilih tag sistem dari dropdown. Pasang `[SYS_PERSONNEL_ID]` tanpa `[SYS_PERSONNEL_NAME]` di konteks yang sama (field utama atau blok), lalu simpan: sistem menolak dengan pesan "harus dipasangkan". Tag dapat dipasang di field utama atau di field dalam blok berulang. `[SYS_START_DATE]` dan `[SYS_END_DATE]` dapat berdiri sendiri.
37. **Template kuitansi (TPL-01).** Admin membuka menu **Template Kuitansi**. Panel kiri "Konfigurasi Editor" menampilkan isian nama instansi, judul dokumen, dan tempat penerima. Preview cetak tampil di panel kanan dengan contoh data. Klik "Simpan Template" → toast "Tersimpan".
38. **Unggah .doc/.docx (TPL-01).** Di panel kiri Template Kuitansi, bagian "Alternatif: unggah template .doc/.docx", klik "Pilih file .doc / .docx". Pilih file .doc atau .docx: nama file tampil dengan ikon dokumen. Coba unggah file .pdf atau .txt: ditolak dengan pesan format tidak didukung. Hapus berkas dengan ikon X. Simpan template untuk menyimpan nama berkas.
39. **Pratinjau Langsung (TPL-03, I-64a).** Buka menu **Form Dinamis**, pilih form "Belanja Perjalanan Dinas", lalu klik tab "Pratinjau Langsung" di kanan atas. Pratinjau tampil di halaman yang sama (bukan pop-up). Beralih ke tab "Konfigurasi Editor" dan kembali: draf isian tetap ada (state React tidak direset).
40. **Field wajib di pratinjau (I-64b).** Di tab Pratinjau Langsung, kosongkan field wajib (ditandai *), lalu tekan "Simulasi Ajukan". Sistem menampilkan peringatan "Wajib diisi: ..." dan simulasi ditolak. Isi field opsional dikosongkan tetap diterima.
41. **Tombol "+ Tambah" blok berulang (I-64c).** Di pratinjau form "Belanja Perjalanan Dinas" (yang punya blok "Pelaku"), tekan "+ Tambah". Entri baru muncul dengan field yang sama (NIP/NIK, Nama, Golongan Pangkat). Hapus entri (kecuali entri terakhir) dengan ikon tempat sampah di pojok kanan setiap entri.
42. **Auto-fill NIP/NIK (I-64d).** Di pratinjau blok "Pelaku", masukkan NIP `198807202012011004` pada field NIP/NIK. Nama "Budi Santoso, S.T." terisi otomatis di field Nama. Masukkan NIP yang tidak terdaftar (mis. `9999999999999999`): nama tetap kosong, diisi manual. Tidak ada entri Jejak Audit yang ditambahkan (periksa menu Jejak Audit sebelum dan sesudah).
43. **Cek bentrok mock (I-64e).** Di pratinjau "Belanja Perjalanan Dinas", isi Tanggal Berangkat `2026-11-10` dan Tanggal Kembali `2026-11-12` di field utama. Tambah dua entri blok: entri 1 dengan NIP `198807202012011004`, entri 2 dengan NIP yang sama. Tekan "Simulasi Ajukan". Sistem menampilkan bentrok: "Bentrok jadwal: NIP/NIK 198807202012011004 pada 2026-11-10–2026-11-12". Mock data terisolasi — tidak membaca SPJ asli.
44. **Pratinjau hanya memori (I-64f).** Setelah pratinjau, muat ulang halaman. Semua isian pratinjau hilang. Tidak ada kuitansi, SPJ, BKU, atau entri Jejak Audit yang tersimpan (periksa menu Jejak Audit dan data contoh tidak berubah).
45. **Akses hanya Admin (I-64g).** Menu "Form Dinamis" dan "Template Kuitansi" hanya tampil untuk Admin. Masuk sebagai Bendahara, PPTK, Verifikator, PA/KPA, atau Pengawas: menu tidak tampil di navigasi.

### Status Langkah 5A (dibangun dan diperiksa lewat kode; belum diuji di browser)

| ID | Status | Keterangan |
|---|---|---|
| TPL-02 | Terbukti di kode | `FormBuilderPage.tsx`: daftar jenis belanja, tambah field (modal), urutan (naik/turun), wajib/opsional, tipe, tag sistem, blok berulang (maks 1), simpan versi baru. `repo.simpanVersiForm`: validasi tag (`validasiTagSistem`), minimum 1 field, nama blok wajib. |
| TPL-01 | Terbukti di kode | `TemplateKuitansiPage.tsx`: konfigurasi editor (nama instansi, judul, tempat), preview cetak F4, unggah .doc/.docx (validasi ekstensi + MIME), hapus berkas, simpan. `repo.simpanTemplateKuitansi`: validasi nama instansi + judul. |
| BNT-02 | Terbukti di kode | `formDinamis.ts` `validasiTagSistem`: cek duplikat tag per konteks, cek pasangan ID/nama. `repo.simpanVersiForm` memanggil validasi sebelum menyimpan. Tag dapat di field utama atau blok. |
| TPL-03 | Terbukti di kode | `FormPreviewTab.tsx`: tab berdampingan "Konfigurasi Editor" / "Pratinjau Langsung" di `FormBuilderPage`, field wajib/opsional, blok berulang "+ Tambah", hapus entri, auto-fill NIP/NIK dari `repo.direktoriTransaksional()`, mock bentrok (`MOCK_SPJ_BENTROK`), simulasi ajukan, hanya memori (useState). |

### Skenario Dokumen 05 bagian 4

| Skenario | Status | Keterangan |
|---|---|---|
| H-55 | Terbukti di kode | Field wajib ditolak kosong di `simulasiAjukan`. Tidak ada validasi matematis terhadap bruto. |
| I-58 | Terbukti di kode | Tombol "Blok Berulang" hilang setelah blok dibuat; tidak bisa tambah blok kedua. |
| I-64 | Terbukti di kode | `simpanVersiForm` membuat versi baru; form lama tetap di `data.formDinamis`. |
| I-64a | Terbukti di kode | Tab di `FormBuilderPage` state `tab`; beralih tidak reset `draft`. |
| I-64b | Terbukti di kode | `simulasiAjukan` mengumpulkan field wajib kosong; tampilkan peringatan. |
| I-64c | Terbukti di kode | Tombol "+ Tambah" menambah entri; ikon tempat sampah hapus entri (kecuali terakhir). |
| I-64d | Terbukti di kode | `set()` mencari `repo.direktoriTransaksional()` saat tag `[SYS_PERSONNEL_ID]`; tidak menambah audit. |
| I-64e | Terbukti di kode | `MOCK_SPJ_BENTROK` terisolasi; `rentangOverlap` cek inklusif. Tidak membaca `data.spj`. |
| I-64f | Terbukti di kode | Semua state `useState` di `FormPreviewTab`; tidak ada persistensi. |
| I-64g | Terbukti di kode | `buildNav` di `App.tsx`: menu Form Dinamis & Template Kuitansi hanya di `role === 'admin'`. |
| M-89 | Terbukti di kode | `validasiTagSistem` menolak ID tanpa nama (atau sebaliknya) dalam konteks yang sama. |

