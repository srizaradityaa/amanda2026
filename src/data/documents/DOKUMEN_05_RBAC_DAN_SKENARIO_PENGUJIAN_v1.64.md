# DOKUMEN 05: MATRIKS HAK AKSES & SKENARIO PENGUJIAN
**Sistem:** AMANDA (Aplikasi Manajemen Data Anggaran)  
**Status:** Terkunci & Disahkan (Single Source of Truth)
**Tahun dokumen:** 2026
**Versi:** 1.64 (2 November 2026)


## 1. Legenda akses
- **Kelola:** membuat/mengubah sesuai batas kewenangan.
- **Operasikan:** menjalankan proses peran terkait.
- **Lihat:** membaca data yang termasuk cakupan peran.
- **Tidak:** dilarang.
- Cakupan role operasional berlaku di TA yang ditugaskan. Otorisasi penting harus ditegakkan pada server/data, bukan hanya menyembunyikan tombol.

## 2. Matriks kewenangan ringkas
| Area / aksi | Admin | Bendahara | PPTK/Seksi | Verifikator | PA/KPA | Pengawas/Auditor* | Publik/Guest |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Master SOTK, Personel, Subkegiatan, Rekening, Jenis Pajak | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Membuat TA, menetapkan pagu induk, struktur & mapping | Kelola | Lihat | Lihat seksi sendiri | Lihat sesuai tugas | Lihat | Tidak | Tidak |
| Akun login (buat akun, reset password, ACTIVE/NON-ACTIVE) | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Mengubah status TA (Aktif Penuh, Masa Transisi, Arsip Read-Only) | Kelola (manual) | Lihat | Lihat | Lihat | Lihat | Tidak | Tidak |
| Membuka kembali TA Arsip dan menghapus TA setelah retensi 12 tahun | Kelola (manual, konfirmasi kode TA) | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Countdown dan banner merah gatekeeper | Lihat | Operasikan (atur jendela) | Lihat | Lihat | Lihat | Tidak | Tidak |
| Mini progress bar topbar | Pagu Induk saja | Lihat | Lihat seksi sendiri | Lihat | Lihat (seluruh instansi) | Tidak | Tidak |
| Laporan PDF/Excel (Dokumen 01 §9) | Tidak | Lihat seluruh seksi | Lihat seksi sendiri | Lihat seluruh seksi | Laporan a, b, d, e, f, dan g (seluruh seksi, data Dibukukan; kolom kuitansi tidak tampil pada b dan f) | Lihat TA yang ditugaskan, baca saja | Tidak |
| Rincian Kartu Kendali Kegiatan per subkegiatan dan rekening, PDF/Excel (Dokumen 01 §9 poin 2g) | Tidak | Lihat seluruh seksi | Lihat seksi sendiri | Lihat seluruh seksi | Lihat seluruh seksi | Lihat TA yang ditugaskan, baca saja | Tidak |
| Rekap isian SPJ per jenis belanja (Excel) | Tidak | Lihat seluruh seksi | Lihat seksi sendiri | Lihat seluruh seksi | Lihat seluruh seksi, termasuk NIP/NIK dan Nomor Rekening tanpa penyamaran | Lihat TA yang ditugaskan, baca saja | Tidak |
| Rekap pajak per jenis pajak (Excel) | Tidak | Lihat seluruh seksi | Lihat seksi sendiri | Lihat seluruh seksi | Lihat seluruh seksi, tanpa kolom kuitansi | Lihat TA yang ditugaskan, baca saja | Tidak |
| Penyusunan Laporan Kustom (Dokumen 01 §9 poin 12) | Tidak | Lihat seluruh seksi | Lihat seksi sendiri | Lihat seluruh seksi | Lihat seluruh seksi, kolom terbatas | Tidak | Tidak |
| Heatmap Sebaran Realisasi Bulanan (Dokumen 01 §12 poin 5) | Tidak | Tidak | Tidak | Tidak | Lihat seluruh seksi sampai subkegiatan | Tidak | Tidak |
| Unduh lampiran PDF SPJ (Dokumen 02 §9) | Tidak | Unduh seluruh seksi | Unduh seksi sendiri | Unduh seluruh seksi | Unduh seluruh seksi | Tidak | Tidak |
| Cetak Hasil Verifikasi SPJ dengan barcode (Dokumen 02 §8) | Tidak | Tidak | Operasikan untuk seksi sendiri, setelah SPJ disetujui | Operasikan untuk seluruh seksi, setelah SPJ disetujui | Tidak | Tidak | Tidak |
| Halaman keaslian SPJ via barcode (Dokumen 02 §8) | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Lihat status keaslian saja |
| Melihat Pagu Induk pada kartu TA | Lihat (pengecualian disetujui) | Lihat | Tidak | Lihat | Lihat | Lihat (laporan) | Tidak |
| Jejak audit (membaca) | Lihat, termasuk entri keuangan (pengecualian disetujui) | Hanya entri aksinya sendiri | Hanya entri seksinya sendiri | Seluruh entri TA, baca saja | Tidak | Lihat TA yang ditugaskan, baca saja | Tidak |
| Menetapkan pejabat dan menyimpan SK | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Penugasan Delegasi Plh./Plt. (tetapkan, cabut dini dengan alasan) | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Mengalokasikan pagu induk ke subkegiatan | Tidak | Operasikan | Tidak | Lihat | Tidak | Tidak | Tidak |
| Mengalokasikan pagu subkegiatan ke rekening | Tidak | Lihat/monitor | Operasikan untuk seksi sendiri | Lihat | Tidak | Tidak | Tidak |
| Mengatur tenggat dan membuka kembali akses alokasi | Tidak | Operasikan | Tidak | Tidak | Tidak | Tidak | Tidak |
| Drill-down anggaran seksi → subkegiatan → rekening | Tidak | Lihat sampai rekening | Lihat seksi sendiri sampai rekening | Lihat sampai rekening | Lihat sampai subkegiatan | Tidak | Tidak |
| Efisiensi SPD | Tidak | Operasikan | Tidak | Tidak | Tidak | Tidak | Tidak |
| Pergeseran anggaran | Tidak | Operasikan | Tidak | Tidak | Tidak | Tidak | Tidak |
| Mengaktifkan APBD-P / pagu induk perubahan | Operasikan | Menindaklanjuti alokasi | Menindaklanjuti alokasi seksi | Lihat | Tidak | Lihat (laporan) | Tidak |
| Membuat kuitansi | Tidak | Tidak | Operasikan untuk seksi sendiri, jika gatekeeper terbuka | Tidak | Tidak | Tidak | Tidak |
| Mengedit atau membatalkan kuitansi Aktif | Tidak | Tidak | Operasikan untuk seksi sendiri, selama belum Terkunci | Tidak | Tidak | Tidak | Tidak |
| Membuat/melengkapi SPJ, termasuk entri blok berulang | Tidak | Tidak | Operasikan untuk transaksi seksinya | Tidak | Tidak | Tidak | Tidak |
| Mengisi pajak pada SPJ (entri jenis pajak dan nominal manual) | Tidak | Tidak | Operasikan untuk transaksi seksinya | Tidak | Tidak | Tidak | Tidak |
| Memverifikasi/mengembalikan SPJ | Tidak | Tidak | Menindaklanjuti revisi | Operasikan | Tidak | Tidak | Tidak |
| Mengisi No. BKU/tanggal BKU, koreksi No. BKU/tanggal, dan pencabutan BKU | Tidak | Operasikan | Tidak | Mengikuti urutan pencabutan berjenjang | Tidak | Tidak | Tidak |
| Template kuitansi, template Hasil Verifikasi SPJ, dan Form Builder (termasuk blok berulang) | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Mode Pratinjau Interaktif Form Dinamis (tab Pratinjau Langsung di Visual Live Editor) | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Format nomor verifikasi Hasil Verifikasi SPJ (per TA) | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Direktori Transaksional SPJ (lihat, koreksi, merge duplikat) | Kelola | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Analitik Burn-Rate & Early Warning Ticker (Dasbor PA/KPA) | Tidak | Tidak | Tidak | Tidak | Lihat | Tidak | Tidak |
| Portal keterbukaan informasi anonim (tanpa login) | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Lihat agregat publik saja |
| Tampilan portal keterbukaan (tema Treasury, kepadatan Pro Mode di layar besar, mode standar di layar kecil, Dokumen 03 §9) | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Lihat sesuai tema portal |
| Akses lintas seksi | Kelola administratif | Monitor operasional | Tidak, kecuali penugasan sah | Sesuai tugas instansi | Lihat seluruh seksi, sampai subkegiatan | Laporan dan Jejak Audit, baca saja | Tidak ada akses lintas data sumber; hanya agregat publik dan status keaslian satu SPJ melalui token |
\* Pengawas/Auditor (opsi B): laporan dan Jejak Audit pada TA yang ditugaskan, baca saja; akun terpisah dari personel (Dokumen 01 §8).
Catatan basis laporan: seluruh laporan hanya memuat data realisasi, yaitu SPJ Dibukukan dengan BKU tercatat. Komitmen kuitansi yang belum dibukukan tidak dilaporkan. Admin tidak mendapat laporan.

Catatan drill-down: PA/KPA (Dokumen 03 §6) melihat drill-down sampai tingkat subkegiatan; tingkat rekening belanja tidak ditampilkan. Catatan batas peran: Admin hanya mengelola master dan status TA. Pengecualian yang disetujui adalah Pagu Induk pada kartu TA, Jejak Audit termasuk entri keuangan (baca saja), serta countdown dan banner merah. Bendahara Pengeluaran tidak boleh merangkap PPTK/Seksi pada TA yang sama. Delegasi Plh./Plt. (Dokumen 01 §6 poin 7–11) hanya ditetapkan dan dicabut oleh Admin; personel Plh./Plt. tidak dapat memverifikasi SPJ yang ia ajukan atau kelola sendiri.
## 3. Skenario uji penerimaan
Rujukan skenario ditulis dengan format Bagian-Nomor, misalnya B-8 atau G-40, karena nomor skenario dapat berulang antarbagian.

### A. Personel, histori pangkat/gelar, dan akun
1. Personel dengan NIP disimpan menggunakan NIP; personel non-PNS tanpa NIP dapat disimpan hanya menggunakan NIK.
2. NIP dan NIK hanya menerima input angka (tanpa batasan kaku 18 atau 16 digit), dan sistem menolak angka yang telah digunakan personel lain.
3. Saat mengedit personel, angka NIP/NIK milik profil yang sedang diedit tidak dianggap sebagai duplikat.
4. Nama lengkap, pangkat/golongan, TMT, dan nomor WhatsApp (angka dan +) wajib diisi; validasi menolak jika salah satu kosong. Gelar depan dan belakang bersifat opsional.
5. Saat personel baru disimpan, sistem otomatis membuat catatan histori awal pangkat dan gelar.
6. Saat mengedit dan mengubah pangkat/gelar, opsi "Simpan sebagai perubahan baru" menutup histori lama dan membuat entri periode baru tanpa merusak cetak dokumen historis lama.
7. Username akun login dibuat otomatis dari NIP (atau NIK jika NIP tidak ada).
8. Admin dapat membuat akun baru melalui tombol "Akun" dengan password minimal 6 karakter.
9. Admin dapat mengganti password dan mengubah status akun menjadi ACTIVE atau NON-ACTIVE; status Belum Ada Akun, ACTIVE, dan NON-ACTIVE tampil akurat di tabel.
9a. Admin dapat menonaktifkan akun ACTIVE hanya dengan alasan tertulis. Sebelum konfirmasi, sistem menampilkan penugasan aktif yang terdampak, dan penugasan tersebut tidak berubah.
9b. Admin tidak dapat menonaktifkan akun miliknya sendiri atau Admin ACTIVE terakhir; sistem menolak dengan pesan yang jelas.
9c. Daftar penugasan menampilkan peringatan "akun NON-ACTIVE, penugasan masih aktif" untuk penugasan yang akunnya nonaktif.
### B. TA, SOTK dan pejabat
6. TA Draft tanpa transaksi dapat dihapus; TA yang pernah memiliki kuitansi, termasuk yang kuitansinya sudah dihapus, tidak dapat dihapus kecuali melalui retensi 12 tahun (skenario 66–70).
7. Salin struktur hanya mengambil seksi aktif dan mapping akhir TA sebelumnya; tidak mengambil pagu, SK atau mutasi.
8. Perubahan Master SOTK tidak mengubah snapshot dan transaksi TA lama.
8a. Pada Master SOTK, tidak ada input field kode unit manual; identifikasi unit menggunakan ID sistem internal otomatis.
8b. Aksi Ubah dengan mode Pergantian Nomenklatur otomatis menutup unit lama pada H-1 dan mengarsipkannya sebagai Read-Only, sementara transaksi historis tetap mengacu pada nama unit lama.
8c. Aksi Ubah dengan mode Koreksi Redaksional (Typo) memperbarui teks nama secara in-place tanpa mengubah tanggal TMT dan tanpa membuat pengarsipan baru.
8d. Aksi Arsipkan pada baris unit kerja aktif menutup unit kerja dengan tanggal efektif pengakhiran dan mengubah statusnya menjadi Diarsipkan (Read-Only).
9. Unit/pejabat pengganti mulai tanggal D; data lama berakhir D-1 dan transaksi historis tetap menampilkan pejabat/unit yang sesuai tanggal.
10. SK provisional dapat dilengkapi kemudian; SK lama tetap bisa dibuka setelah penugasan berakhir.
10a. Sistem menolak aktivasi TA kedua selama masih ada satu TA berstatus Aktif Penuh.
10b. Sistem tidak mengubah status TA berdasarkan tanggal. Pengaktifan TA dilakukan Admin dan ditolak jika checklist kesiapan belum lengkap. Checklist dihitung otomatis dari kondisi data, tidak dicentang manual, dan tidak dapat dilewati Admin.
10c. Pada status Masa Transisi, sistem menolak pembuatan kuitansi dan SPJ baru, serta seluruh edit data kuitansi (nominal, uraian, penerima, tanggal), termasuk melalui pemanggilan langsung. Pembatalan kuitansi Aktif, pengajuan dan verifikasi SPJ, pencatatan BKU, serta pencabutan BKU tetap berjalan.
10d. PPTK tidak dapat melihat Pagu Induk pada kartu TA. Verifikator dapat melihatnya dalam mode baca saja.
10e. Admin dapat menetapkan penugasan Delegasi Aktif (Plh./Plt.) bagi Bendahara, PPTK, atau PA/KPA dengan tanggal mulai dan tanggal berakhir; tanggal berakhir kosong atau mendahului tanggal mulai ditolak.
10f. Selama rentang delegasi, sistem mengizinkan duplikasi peran sementara pada seksi yang sama dan menonaktifkan hak transaksi pejabat definitif; penugasan definitif tetap tercatat.
10g. Penunjukan Plh./Plt. ditolak jika personel memegang peran yang bertentangan pada TA yang sama (misalnya Bendahara Pengeluaran yang ditunjuk sebagai Plh. PPTK), dengan pesan yang jelas.
10h. Delegasi Aktif berakhir otomatis pada 23:59 WITA tanggal berakhir; hak transaksi pejabat definitif pulih dan hak Plh./Plt. nonaktif tanpa intervensi Admin.
10i. Admin dapat mencabut delegasi lebih awal hanya dengan alasan tertulis; pencabutan tanpa alasan ditolak.
10j. Entri Audit Event delegasi (penetapan, tanggal berlaku, pencabutan dini, dan pengakhiran otomatis) memuat `definitive_officer_id`, `delegate_officer_id`, dan keterangan status Delegasi Aktif.
10k. Personel yang mengajukan atau mengelola SPJ sendiri, baik sebagai pejabat definitif maupun Plh./Plt. PPTK, tidak dapat memverifikasi SPJ tersebut; server menolak aksi ini meskipun dipanggil langsung.

### C. Pagu dan gatekeeper
11. Total alokasi subkegiatan di bawah pagu induk yang belum seimbang tidak dinyatakan siap.
12. Pagu seksi selalu hasil penjumlahan otomatis subkegiatan yang dipetakan, bukan input manual.
13. Total rekening belanja harus tepat sama dengan pagu subkegiatan terkait.
13a. Satu rekening belanja boleh dipakai di subkegiatan mana pun dalam TA yang sama; setiap pasangan subkegiatan dan rekening memiliki pagu dan alokasi sendiri.
13b. Sistem menolak pasangan subkegiatan dan rekening yang sama untuk kedua kalinya dalam satu TA.
14. Satu subkegiatan tidak dapat dipetakan ke dua seksi dalam TA yang sama.
15. Jika satu seksi belum seimbang atau belum selesai, tombol buat kuitansi nonaktif bagi semua seksi dan dashboard mengidentifikasi seksi yang belum selesai.
15b. Saat gatekeeper tertutup, pengajuan SPJ yang sudah ada, verifikasi, dan pencatatan BKU tetap berjalan.
15a. Dashboard Admin menampilkan countdown dan banner merah dalam mode baca saja, tanpa tombol pengaturan jendela waktu.
16. Saat tenggat habis dengan alokasi belum lengkap, status tetap terblokir; hanya Bendahara dapat membuka kembali periode input sesuai aturan.
17. Setelah seluruh seksi selesai seimbang dan gatekeeper dibuka, transaksi dapat dimulai.
17a. Jendela waktu input dan tanggal arsip memakai zona waktu WITA (UTC+8).
17b. Tombol "+ Buat Kuitansi" aktif hanya bila seluruh seksi Seimbang dan Bendahara telah menekan "Sahkan". Bila salah satu belum terpenuhi, tombol nonaktif untuk semua seksi dan pembuatan kuitansi ditolak di server, termasuk melalui pemanggilan langsung.

### D. SPD, efisiensi, dan pergeseran
18. SPD terbit sebesar pagu hanya setelah Bendahara menekan tombol "Sahkan" dan seluruh seksi berstatus Seimbang. Tanpa pengesahan, tidak ada SPD yang terbit.
19. Kuitansi aktif mengurangi SPD bebas sebagai komitmen; BKU mengurangi/menandai realisasi kas.
20. Efisiensi yang melampaui sisa SPD bebas ditolak; nilai kuitansi aktif dan realisasi terlindungi.
21. PPTK/Seksi tidak dapat mengakses atau menjalankan pergeseran.
22. Bendahara dapat menggeser hanya dari saldo SPD bebas sumber; total pagu induk tetap.
22a. Pergeseran ke pasangan subkegiatan dan rekening yang belum dialokasikan pada TA yang sama ditolak, termasuk melalui pemanggilan langsung.
23. Setiap efisiensi/pergeseran tercatat dengan aktor, waktu, sumber, tujuan/nilai dan referensi.
23a. Setiap entri audit mencatat ID akun pelaku dan snapshot nama, NIP/NIK, serta peran saat aksi. Efek otomatis sistem tercatat atas nama pemicunya dengan penanda otomatis.
23b. Penugasan yang membuat satu personel menjadi Bendahara sekaligus PPTK/Seksi pada TA yang sama ditolak sistem.
23c. PPTK hanya dapat melihat entri Jejak Audit milik seksinya sendiri. Verifikator dapat melihat seluruh entri TA dalam mode baca saja.
23d. Bendahara hanya melihat entri Jejak Audit aksinya sendiri. Permintaan langsung ke entri aktor lain, termasuk melalui URL, ditolak di server.
23e. Pergeseran memindahkan SPD bersama pagu: SPD turun pada rekening sumber dan naik pada rekening tujuan sebesar nilai yang sama.
23f. Efisiensi hanya menurunkan SPD; pagu rekening dan penyebut Serapan, Realisasi (%), dan Burn-Rate tidak berubah.
23g. SPD yang diturunkan melalui efisiensi dapat dinaikkan kembali oleh Bendahara dengan alasan tertulis dan tercatat di Jejak Audit. Kenaikan melebihi pagu rekening ditolak.
23h. Sahkan, perubahan alokasi setelah pengesahan atau APBD-P, verifikasi SPJ disetujui atau dikembalikan, dan pencatatan BKU tercatat di Jejak Audit. Login dan logout tidak tercatat.

### E. APBD-P dan histori
24. Perubahan pagu tidak menimpa pagu murni; laporan menampilkan pagu murni, perubahan/pergeseran dan pagu akhir.
25. Pagu baru di bawah realisasi BKU ditambah komitmen kuitansi aktif ditolak.
26. Transaksi lama tetap menunjuk snapshot anggaran yang berlaku saat transaksi diterbitkan.
26a. Setelah APBD-P diaktifkan, kuitansi dan SPJ baru tertahan untuk semua seksi sampai seluruh seksi Seimbang pada pagu perubahan dan Bendahara menekan "Sahkan" lagi. SPD menyesuaikan pagu perubahan; penurunan SPD di bawah Realisasi BKU ditambah Komitmen Kuitansi Aktif ditolak.

### F. Kuitansi, SPJ, verifikasi dan BKU
27. Kuitansi tidak memuat baris Kegiatan, rekening bank penerima, daftar pelaksana, atau kotak verifikasi.
27a. Baris kanan atas kuitansi menampilkan kode subkegiatan dan kode rekening belanja dalam satu baris. Nama rekening belanja tidak ditampilkan.
27b. Badan kuitansi menampilkan `Sub Keg. : {Nama Subkegiatan}`, bukan kode subkegiatan; nama rekening belanja tetap tidak ditampilkan.
28. Kuitansi tidak menampilkan No. BKU maupun tanggal BKU; tanggal kuitansi tetap dipakai pada blok penerima.
28a. Sistem menolak No. BKU yang sudah dipakai di TA yang sama.
28b. Sistem menolak input BKU kedua untuk kuitansi yang sudah memiliki BKU.
28c. No. BKU menerima input teks/angka manual dari Bendahara, dan sistem tidak memvalidasi urutan kronologis tanggal (misal Tanggal BKU mendahului atau menyusul Tanggal Kuitansi/SPJ tetap berhasil disimpan).
28d. Modul BKU hanya mencatat realisasi belanja kuitansi dan tidak memuat formulir/alur penerimaan SP2D, saldo awal, atau pencatatan saldo kas riil.
29. Kuitansi universal menampilkan uraian dan subkegiatan serta empat blok tanda tangan sesuai spesifikasi.
30. Satu kuitansi hanya berpasangan dengan satu SPJ; satu SPJ tidak dapat dipakai pada dua kuitansi.
30a. Kuitansi terkunci sejak SPJ Draft dibuat dan tetap Terkunci selama SPJ masih terkait; nominal dan data kuitansi tidak dapat diubah, kecuali SPJ dilepas atau dihapus terlebih dahulu.
30b. SPJ yang sudah dikirim ke Verifikator berstatus Terkunci. Pengembalian oleh Verifikator membuka kunci SPJ menjadi Draft, tetapi kuitansi terkait tetap Terkunci.
30c. SPJ Draft, termasuk yang dikembalikan Verifikator, dapat dilepas atau dibatalkan oleh Seksi; kuitansi terkait kembali Aktif tanpa jejak.
31. Pengembalian SPJ oleh Verifikator memerlukan catatan dan membuat status Draft, tetapi komitmen SPD tetap terkunci.
32. Nominal kuitansi adalah bruto; rincian pajak berada pada SPJ.
33. Pencabutan BKU hanya berjalan melalui urutan pencabutan berjenjang; nomor BKU yang telah dicabut berstatus bebas kembali dan dapat dicatat pada transaksi kuitansi/SPJ lain di TA yang sama; SPD pulih setelah kuitansi dibatalkan sesuai alur.
33a. Pembatalan kuitansi Aktif atau SPJ Draft benar-benar menghapus data kuitansi dan seluruh entri Jejak Audit terkait (termasuk riwayat BKU/pencabutan BKU jika pernah dicatat) secara otomatis dan bersih tanpa jejak. Sistem tidak menyediakan penomoran kuitansi.
33b. Koreksi No. BKU atau tanggal BKU tanpa pencabutan hanya dapat dilakukan jika nominal tidak berubah, dan tercatat di Jejak Audit dengan nilai lama dan nilai baru.
33c. Pencabutan BKU tercatat di Jejak Audit tanpa alasan tertulis.
33d. Nama dan NIP pejabat pada kuitansi dan Hasil Verifikasi SPJ diambil dari penugasan yang berlaku saat kuitansi disimpan atau SPJ diajukan ke Verifikator. SPJ yang diajukan sebelum delegasi lalu diverifikasi saat delegasi berjalan tetap atas nama pejabat definitif.
33e. Cetak ulang dokumen setelah delegasi Plh./Plt. berakhir memakai snapshot penandatangan asli dan tidak berubah.
34. Preview dan cetak kuitansi menggunakan data transaksi, TA, dan pejabat yang benar; area cetak terbatas pada format F4 bagi dua.
35. Berkas PDF sampai dengan 5 MB melewati kompresi, sedangkan berkas di atas 5 MB hingga 30 MB memicu kompresi otomatis di peramban.
36. Berkas asal di atas 30 MB ditolak sebelum kompresi dengan pesan batas ukuran yang jelas.
37. Jika kompresi klien berhasil, berkas yang dikirim adalah hasil optimasi dan ukuran final dicatat; target hasil maksimal 10 MB.
38. Jika kompresi klien gagal, kehabisan memori, atau melewati 15 detik, sistem menjalankan server fallback secara otomatis tanpa meminta PPTK memilih ulang berkas.
39. Jika kompresi server juga gagal, upload tidak boleh ditandai berhasil dan pengguna menerima pesan tindak lanjut yang jelas.
40. Metadata berkas menyimpan nama asli, ukuran asal, ukuran final, dan status optimasi (`BYPASSED`, `CLIENT_COMPRESSED`, `SERVER_FALLBACK_COMPRESSED`, atau `FAILED`).
41. Uji visual memastikan teks nominal, tanda tangan, dan stempel tetap terbaca setelah kompresi dengan berkas dari ukuran kecil hingga mendekati batas 30 MB.
42. Kompresi PDF tidak mengubah jawaban Form Dinamis maupun data/ekspor Excel.
43. Status UI bergerak dari “Menyiapkan dokumen...” ke “Mengunggah dokumen...” untuk proses kompresi klien, dan upload berhasil hanya setelah server mengonfirmasi penyimpanan final.

### G. Tampilan anggaran drill-down
37. Tampilan anggaran berjenjang seksi → subkegiatan → rekening belanja, dengan breadcrumb yang dapat kembali ke tingkat sebelumnya.
38. Setiap tingkat menampilkan Pagu, Realisasi BKU, Komitmen Kuitansi Aktif, Sisa SPD Bebas, Serapan (%), dan Status Seimbang atau Belum Seimbang; nilai tingkat induk sama dengan jumlah tingkat di bawahnya.
39. PPTK hanya dapat membuka seksinya sendiri. Kartu Pagu Induk tidak tampil, dan permintaan data seksi lain melalui URL ditolak di server.
40. PA/KPA tidak dapat membuka tingkat rekening belanja. Permintaan langsung ke data rekening ditolak di server.
41. Admin tidak dapat membuka halaman drill-down anggaran maupun memanggil datanya melalui URL atau pemanggilan langsung.
42. TA berstatus Arsip Read-Only menampilkan drill-down dari snapshot. Perubahan Master SOTK atau Master Subkegiatan setelahnya tidak mengubah angka yang tampil.
43. Nominal tampil dalam Rupiah dengan pemisah ribuan titik; kode subkegiatan dan kode rekening belanja tampil sebagai teks dan tidak diformat sebagai angka.
43a. Rekening belanja yang sama pada dua subkegiatan tampil sebagai dua baris terpisah di bawah masing-masing subkegiatan, tidak digabung.

### H. Akun dan akses Pengawas/Auditor
44. Akun Pengawas dibuat Admin dengan nama lengkap, instansi asal, nomor dan tanggal surat tugas, email, dan tanggal akhir akses. Nomor surat tugas wajib diisi.
45. Akun Pengawas tidak tampil di Master Personel dan tidak mensyaratkan NIP/NIK, pangkat, TMT, atau nomor WhatsApp.
46. Password awal ditetapkan Admin (minimal 6 karakter). Pengguna tidak diminta mengganti password saat login pertama, dan Admin dapat mereset password.
47. Penugasan Pengawas dibuat per TA tanpa seksi dan mencakup seluruh seksi pada TA yang ditugaskan. Pengawas tidak dapat membuka TA yang tidak ditugaskan, termasuk melalui URL langsung.
48. Login ditolak setelah tanggal akhir akses. Perubahan tanggal akhir oleh Admin tercatat di Jejak Audit.
49. Penonaktifan akun Pengawas memerlukan alasan tertulis yang tercatat di Jejak Audit; data dan penugasan historis tetap tersimpan.
50. Pengawas hanya dapat membuka laporan dan Jejak Audit. Drill-down anggaran, master, akun, dan tombol proses ditolak di server meskipun URL diakses langsung.
51. Aksi Pengawas mengunduh atau mencetak laporan tercatat dengan snapshot nama, instansi asal, nomor surat tugas, dan peran Pengawas.
52. Pengawas tidak melihat countdown, banner merah, maupun bar navbar.
53. Bar navbar sesuai peran: Bendahara, PA/KPA, dan Verifikator melihat angka seluruh instansi; PPTK hanya seksinya; Admin hanya Pagu Induk; Pengawas tanpa bar.
54. Laporan rekap isian SPJ per jenis belanja dapat diunduh dalam Excel dengan satu sheet per jenis belanja, kolom berupa gabungan field dari versi form yang dipakai SPJ di sheet tersebut, field yang tidak ada pada versi SPJ tertentu tampil kosong (Dokumen 01 §9 poin 6). Kolom NIP dan Nomor Rekening ditampilkan penuh dan terbuka tanpa penyamaran (masking) bagi semua peran yang berhak mengunduh, termasuk PA/KPA. PPTK hanya memperoleh data seksinya; Admin ditolak.
55. Field Form Dinamis bertanda wajib tidak dapat diajukan dalam keadaan kosong. Field opsional yang kosong tampil kosong di laporan dan Excel, tanpa tanda strip. Sistem tidak menolak pengajuan SPJ berdasarkan selisih nilai rincian Form Dinamis terhadap nominal bruto kuitansi (pencatatan rincian bersifat informasional murni).
56. Filter jenis belanja pada laporan rekap isian SPJ menghasilkan unduhan Excel yang hanya memuat baris dan kolom hasil filter aktif. Jika filter memuat lebih dari satu jenis belanja, setiap jenis belanja menjadi sheet tersendiri yang hanya memuat kolom dan baris jenis belanja tersebut.
57. Seksi memilih jenis belanja di awal pembuatan SPJ, dan Form Dinamis yang tampil sesuai pilihan itu. Jenis belanja tidak muncul sebagai field di dalam form.

### I. Form Dinamis dan blok berulang
58. Admin dapat menambahkan paling banyak satu blok berulang per form dan memberi nama blok. Percobaan menambah blok kedua ditolak.
59. Field di luar blok berulang diisi sekali per SPJ; field di dalam blok diisi per entri.
60. Seksi/PPTK dapat menambah entri baru pada blok berulang melalui tombol "+ Tambah". Form dengan blok berulang minimal memiliki satu entri.
61. Field wajib di dalam blok wajib diisi pada setiap entri; SPJ dengan field wajib kosong tidak dapat diajukan.
62. Form tanpa blok berulang menghasilkan satu baris per SPJ di laporan dan Excel.
63. Form dengan blok berulang menghasilkan satu baris per entri; nilai field di luar blok diulang pada setiap baris SPJ tersebut.
64. Perubahan form setelah SPJ dibuat tidak mengubah struktur blok pada SPJ tersebut.
64a. Admin membuka tab "Pratinjau Langsung" dari Visual Live Editor. Pratinjau tampil di halaman yang sama tanpa pop-up, dan Admin dapat berpindah ke tab "Konfigurasi Editor" tanpa kehilangan draf.
64b. Field wajib yang dikosongkan di pratinjau memunculkan peringatan dan simulasi pengajuan ditolak. Field opsional yang kosong tetap diterima.
64c. Di pratinjau, tombol "+ Tambah" menambah entri blok berulang, dan setiap entri memiliki field yang sama dengan entri pertama.
64d. NIP/NIK yang terdaftar di Direktori Transaksional SPJ mengisi nama pasangan otomatis. NIP/NIK yang tidak terdaftar membiarkan nama diisi manual. Pembacaan ini tidak mengubah direktori dan tidak menambah Jejak Audit.
64e. Cek bentrok jadwal di pratinjau memakai data contoh. Uji ini tidak membaca SPJ asli dan tidak menampilkan status atau tanggal SPJ operasional kepada Admin, termasuk melalui pemanggilan langsung.
64f. Setelah pratinjau ditutup atau halaman dimuat ulang tanpa menyimpan, tidak ada data pratinjau yang tersimpan di server, dan tidak terbentuk kuitansi, SPJ, BKU, atau entri Jejak Audit.
64g. Bendahara, PPTK, Verifikator, PA/KPA, Pengawas/Auditor, dan Publik ditolak di server saat membuka Visual Live Editor, tab pratinjau, atau melalui pemanggilan langsung.

65. PA/KPA dapat melihat laporan a, b, d, e, f, dan g untuk seluruh seksi, hanya data SPJ Dibukukan; kolom kuitansi tidak tampil pada b dan f. Laporan c ditolak di server, termasuk melalui URL langsung.

### J. Retensi dan penghapusan TA
66. TA Arsip Read-Only dapat dibuka kembali oleh Admin secara manual dan menjadi Masa Transisi. TA Masa Transisi dapat dikembalikan menjadi Aktif Penuh hanya bila tidak ada TA lain yang Aktif Penuh; perpindahan mundur lain ditolak di server; saat diarsipkan kembali, masa retensi dihitung ulang dari tanggal arsip terbaru.
67. Tombol hapus TA hanya aktif untuk TA Arsip Read-Only yang telah melewati 12 tahun sejak tanggal arsip terakhir. TA Aktif Penuh, TA Masa Transisi, Draft yang pernah memiliki kuitansi, dan Arsip yang belum 12 tahun ditolak di server. Sistem tidak menghapus otomatis berdasarkan tanggal.
68. Sebelum konfirmasi, sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran yang akan dihapus, tanpa nominal. Penghapusan berjalan hanya jika kode TA yang diketik sama persis.
69. Setelah penghapusan TA, seluruh data TA (kuitansi, SPJ, BKU, lampiran, isian form, alokasi, penugasan, snapshot, dan entri audit terkait) tidak dapat ditemukan di database aktif maupun penyimpanan berkas, dan tidak ada catatan penghapusan.
70. Penghapusan TA ditolak di server untuk seluruh peran selain Admin, termasuk melalui URL atau pemanggilan langsung.

### L. Portal keterbukaan publik dan fullscreen
78. Halaman publik dapat dibuka tanpa autentikasi dan hanya menampilkan TA aktif sebagai default serta TA historis yang tersedia melalui pemilih TA.
79. Persentase realisasi total/seksi dihitung dari BKU yang dibukukan dibagi pagu pada cakupan TA yang sama. Komitmen yang belum dibukukan tidak dihitung. Untuk denominator nol/tidak tersedia, UI menampilkan “Belum tersedia”, bukan persentase buatan.
80. Pada portal keterbukaan, pengunjung publik hanya menerima agregat aman (halaman keaslian SPJ dikecualikan sesuai skenario 132–134): persentase realisasi, cacah SPJ total/per status, nama TA/seksi, urutan seksi, dan waktu pembaruan. Tidak ada nominal rupiah, rincian kuitansi/SPJ, baris transaksi, lampiran, data penerima/personel, NIP/NIK, nomor rekening, akun, ataupun jejak audit pada respons jaringan. Uji dilakukan pada response API dan request langsung, bukan hanya tampilan.
81. Kategori SPJ publik (Selesai/Dibukukan BKU, Dalam Verifikasi, Perlu Perbaikan, Draf/Persiapan PPTK) saling eksklusif dan total cacah kategori sama dengan total SPJ dalam cakupan filter. Draf persiapan harus dapat dibedakan dari SPJ yang dikembalikan untuk perbaikan.
82. Daftar seksi diurutkan berdasarkan persentase realisasi tertinggi ke terendah; tidak ada nominal yang ditampilkan. Seksi tanpa denominator valid ditandai “Belum tersedia”.
83. Grafik donut/pie, gauge, bar horizontal, dan ticker hanya menggunakan agregat yang diizinkan, termasuk pada hover/tooltip, accessibility labels, dan state chart. Tidak ada nominal rupiah pada metadata chart.
84. Kontrol fullscreen mengaktifkan/menutup mode fullscreen bila didukung browser/perangkat; halaman responsif untuk layar besar. Pintasan F yang didukung tidak mengganggu input teks. F11 boleh mengikuti perilaku browser, tetapi tidak menjadi syarat kelulusan kontrol aplikasi.
85. Data di-refresh secara halus pada interval 15–30 menit dan menampilkan waktu pembaruan; refresh tidak membuka akses ke data mentah.
86. Semua endpoint/data transaksi privat tetap menolak guest/anonim meskipun dipanggil langsung. Endpoint agregat tidak dapat digunakan untuk mengekstrak nilai nominal melalui response yang tidak diizinkan.

### K. Pajak SPJ
71. Pajak SPJ diisi manual oleh Seksi. Sistem tidak menghitung pajak secara otomatis dari tarif atau master. Satu-satunya perhitungan otomatis terkait pajak adalah Total Pajak, yaitu jumlah seluruh entri pajak, dan Jumlah yang dibayarkan, yaitu nilai bruto dikurangi Total Pajak, dan tidak mengubah nominal kuitansi berdasarkan pajak.
72. Setelah isian SPJ disimpan, sistem menampilkan pop-up pajak. Seksi dapat menambah beberapa entri pajak; setiap entri memilih jenis pajak dan mengisi nominalnya.
73. Pilihan jenis pajak hanya berisi Master Jenis Pajak berstatus aktif. Admin mengelola master tersebut; peran lain ditolak di server.
74. Entri pajak tersimpan pada SPJ dan tidak mengubah nominal bruto kuitansi maupun komitmen SPD. SPJ tanpa pajak diterima.
74a. Entri pajak yang membuat Total Pajak melebihi nilai bruto kuitansi ditolak saat disimpan. Pesan validasi menampilkan nilai bruto, Total Pajak, dan batas bahwa Total Pajak tidak boleh lebih dari nilai bruto kuitansi; entri tidak tersimpan dan Total Pajak tidak berubah. Penolakan dilakukan di server, termasuk pada permintaan langsung tanpa melalui formulir.
74b. Entri pajak dengan Total Pajak sama dengan atau kurang dari nilai bruto diterima, dan Jumlah yang dibayarkan dihitung sebagai nilai bruto dikurangi Total Pajak sesuai 131e.
75. Rekap isian SPJ per jenis belanja (skenario 54–56) tidak memuat kolom pajak.
76. Rekap pajak per jenis pajak dapat diunduh dalam Excel dengan satu sheet per jenis pajak. Setiap baris adalah satu entri pajak dari SPJ yang sudah memiliki BKU, dan unduhan hanya memuat baris sesuai filter aktif (jenis pajak, seksi, TA, dan periode). Excel tidak memuat subtotal otomatis.
77. Rekap pajak per jenis pajak hanya dapat dilihat Bendahara dan Verifikator (seluruh seksi), PPTK (seksinya sendiri), Pengawas (TA yang ditugaskan, baca saja), dan PA/KPA (seluruh seksi, tanpa kolom Tanggal Kuitansi, hanya SPJ Dibukukan). Admin ditolak di server, termasuk melalui URL langsung.

### M. Direktori Transaksional SPJ dan pencegahan bentrok jadwal
87. Admin dapat membuka panel Direktori Transaksional SPJ yang terpisah dari Master Personel; identitas dari pegawai organik, honorer, narasumber, dan pihak luar dapat disimpan tanpa membuat profil personel atau akun login.
88. Admin dapat mengoreksi ejaan nama/digit NIP-NIK dan menggabungkan entri duplikat; perubahan tercatat di Audit Event dan referensi SPJ historis tetap terjaga. Penggabungan membuat validasi berikutnya memakai identitas yang telah digabung.
89. Form Dinamis perjalanan dinas menerima tag tersembunyi `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, `[SYS_END_DATE]`; konfigurasi menolak pasangan ID/nama yang tidak berada dalam konteks yang sama. Tag dapat digunakan pada field utama atau dalam satu baris blok berulang.
90. Ketika NIP/NIK yang dikenal diketik, nama pasangannya terisi otomatis di field/baris yang benar. Untuk identitas baru, PPTK mengisi nama; saat SPJ disimpan atau diajukan, pasangan identitas masuk Direktori Transaksional SPJ. Penghapusan SPJ tidak menghapus entri direktori.
91. SPJ Draft yang memiliki tanggal/identitas beririsan tetap dapat disimpan, diedit, dicetak, dan dilengkapi. Tidak ada strict blocking pada aksi simpan Draft.
92. Saat mengajukan SPJ, server mendeteksi bentrok identitas yang sama di TA yang sama terhadap SPJ berstatus Terkunci, Menunggu BKU, atau Dibukukan; Draft dan SPJ yang dikembalikan untuk perbaikan diabaikan. Pengajuan yang bentrok ditolak, SPJ tetap Draft, dan tidak muncul di antrean Verifikator.
93. Uji rentang inklusif: tumpang tindih sebagian, rentang yang sepenuhnya berada dalam rentang lain, dan tanggal mulai/selesai yang sama ditolak; rentang yang berurutan dengan tanggal tanpa irisan mengikuti rumus inklusif dan hasil yang benar.
94. Jika `[SYS_END_DATE]` kosong atau sama dengan `[SYS_START_DATE]`, tanggal selesai efektif dianggap tanggal mulai dan konflik pada satu hari terdeteksi. Tanggal selesai sebelum tanggal mulai ditolak sebagai input tidak valid.
95. Uji multi-peserta pada blok berulang memastikan semua identitas dicek satu per satu, tidak tertukar antarbaris; konflik satu peserta saja menolak seluruh pengajuan SPJ tersebut.
96. Setelah SPJ pembanding dibatalkan/dihapus atau statusnya kembali menjadi non-komitmen, tanggalnya tidak lagi memblokir; entri identitas tetap tersedia untuk auto-fill. Pengajuan yang sedang diuji tidak dibandingkan dengan dirinya sendiri.
97. Dua pengajuan serentak dengan identitas dan jadwal yang sama tidak dapat sama-sama lolos; validasi bentrok dan transisi status dilakukan secara atomik di server.
98. Peringatan bentrok hanya memuat identitas, rentang tanggal konflik, dan referensi SPJ/seksi/subkegiatan secukupnya; tidak membocorkan rincian isi atau nominal transaksi pembanding.

### N. Analitik Burn-Rate dan Early Warning Dasbor PA/KPA
99. **Perhitungan Time Elapsed Dinamis:** Pada TA Aktif Penuh, sistem menghitung persentase hari berjalan sejak 1 Januari berbasis waktu WITA secara akurat terhadap total 365/366 hari kalender.
100. **Pembekuan Time Elapsed pada Arsip dan Masa Transisi:** Pada TA berstatus Masa Transisi atau Arsip Read-Only, persentase `Time Elapsed` bernilai konstan 100%, dan status zona analitik tetap terkunci pada posisi akhir buku tanpa terpengaruh tanggal tahun berjalan.
101. **Basis Realisasi BKU Sah:** Sistem menghitung Burn-Rate seksi murni dari kuitansi/SPJ yang telah memiliki `no_bku` dan berstatus `Dibukukan`. Kuitansi aktif atau SPJ draf/terkunci tidak dihitung ke dalam realisasi.
102. **Denominator Dinamis APBD-P:** Sebelum pengesahan APBD-P, Burn-Rate dihitung terhadap Pagu Induk Seksi. Setelah APBD-P disahkan, denominator otomatis berganti menggunakan Pagu Perubahan Seksi (DPA-P).
103. **Deteksi Zona Hijau (Normal):** Seksi yang tidak memenuhi kondisi Zona Kuning, Merah, maupun Oranye diklasifikasikan ke dalam Zona Hijau dengan indikator titik warna hijau.
104. **Deteksi Zona Kuning (Serapan Lambat):** Pada kondisi time-elapsed $> 75\%$ namun Burn-Rate seksi $< 50\%$, sistem memunculkan badge "Serapan Lambat" (titik kuning) pada seksi terkait.
105. **Deteksi Zona Merah (Kritis):** Pada kondisi time-elapsed $> 90\%$ namun Burn-Rate seksi $< 60\%$, sistem memunculkan label "Kritis" (titik merah) dan mengangkat seksi ke baris teratas dasbor.
106. **Deteksi Zona Oranye (Lonjakan Belanja Mendadak):** Jika dalam 14 hari kalender terakhir (hari ini dan 13 hari sebelumnya, WITA) terjadi kenaikan realisasi pembukuan BKU $\ge 40\%$ dari pagu sah terakhir seksi, berdasarkan Tanggal BKU, sistem memunculkan label penelaahan "Lonjakan Tidak Wajar" (titik oranye). Kenaikan tepat 40% memicu Zona Oranye; kenaikan di bawah 40% tidak.
106a. **Satu Zona per Seksi:** Bila beberapa kondisi zona terpenuhi sekaligus, seksi ditampilkan pada satu zona sesuai prioritas Merah > Oranye > Kuning > Hijau. Jumlah seluruh zona pada ticker ringkasan sama dengan jumlah seksi.
107. **Sifat Advisory Tanpa Blokir:** Keberadaan badge peringatan Zona Kuning, Merah, maupun Oranye terbukti tidak memblokir simpan kuitansi, pengajuan SPJ, verifikasi, atau pencatatan BKU oleh pengguna operasional.
108. **Isolasi RBAC Dasbor Analitik:** Widget early warning ticker dan indikator analitik burn-rate hanya dapat diakses oleh akun PA/KPA. Modul tersebut terbukti tidak muncul, dan permintaan langsung ditolak di server, pada tampilan Admin, Bendahara, PPTK, Verifikator, Pengawas/Auditor, maupun Portal Keterbukaan Publik.

### O. Direktori Rekening Bank dan Tata Letak Split View
109. **Tampilan Split View pada Form SPJ:** Saat PPTK membuka lembar kerja pengisian rincian penerima SPJ, antarmuka terbagi menjadi Panel Kiri (Pustaka Direktori Rekening) dan Panel Kanan (Form Rincian SPJ).
110. **Pencarian Fleksibel di Panel Kiri:** Pengguna dapat melakukan pencarian instan di Panel Kiri menggunakan kata kunci berupa Nama Penerima, Alias/Instansi, maupun Nomor Rekening.
111. **Auto-Fill ke Form Panel Kanan:** Memilih salah satu entri hasil pencarian di Panel Kiri otomatis mengisi seluruh kolom rekening penerima (nama, bank, nomor rekening) di Panel Kanan.
112. **Input Bebas Rekening Baru Tanpa Blokir Kaku:** Jika data tidak ditemukan di panel kiri, PPTK dapat langsung mengetik data baru di form panel kanan tanpa penolakan validasi format/angka kaku.
113. **Auto-Capture Rekening Baru ke Direktori:** Saat SPJ disimpan atau rincian penerima disimpan, rekening baru yang diketik otomatis ditambahkan ke Direktori Rekening Bank sistem untuk transaksi berikutnya.
114. **Snapshot Immutability SPJ Terhadap Perubahan Direktori:** Admin melakukan koreksi ejaan atau penggabungan duplikat rekening di menu Direktori Rekening Bank; data kuitansi/SPJ yang telah disahkan/dibukukan ke BKU terbukti tidak berubah atau rusak.
115. **Retensi Rekening saat Pembatalan SPJ Draft:** Ketika SPJ Draft yang memuat input rekening baru dibatalkan/dihapus, transaksi SPJ terhapus bersih tanpa jejak, namun data rekening baru tersebut tetap tersimpan di Direktori Rekening Bank.
116. **Kewenangan Kelola Direktori oleh Admin:** Admin memiliki akses khusus untuk melihat direktori rekening global, melakukan merge data duplikat, dan mengedit ejaan nama/bank; role lain (PPTK/Bendahara/Verifikator) hanya memiliki hak baca/pilih dan auto-capture melalui SPJ.

### P. Autentikasi, Seleksi Konteks Berjenjang, dan Isolasi Sesi
117. **Input Identitas Terpadu (Single-Field Identifier):** Sistem memvalidasi kredensial login melalui satu field gabungan; input angka dipetakan ke NIP/NIK personel internal, sedangkan input berformat email dipetakan ke akun Pengawas/Auditor.
118. **Akses Langsung Admin:** Pengguna dengan role Admin berhasil login dan langsung diarahkan ke Dasbor Administrasi Global tanpa melalui layar seleksi TA atau jabatan.
119. **Akses Langsung Auditor:** Akun Pengawas/Auditor dengan penugasan pada tepat satu TA langsung diarahkan ke Dasbor Pengawas TA tersebut (mode baca laporan & jejak audit). Jika ditugaskan pada lebih dari satu TA, sistem menyajikan layar seleksi TA penugasan terlebih dahulu lalu langsung membuka dasbor TA terpilih.
120. **Auto-Skip Personel Tunggal:** Personel internal yang hanya memiliki tepat 1 penugasan TA dan 1 jabatan langsung diarahkan ke dasbor operasional TA dan jabatannya tanpa jeda layar seleksi.
121. **Seleksi Berjenjang Personel Multi-Penugasan:** Personel dengan penugasan di beberapa TA berhasil disajikan daftar TA penugasan; setelah memilih TA, sistem menyajikan daftar jabatan aktif pada TA tersebut sebelum membuka dasbor operasional.
122. **Pencegahan Alih Konteks Tanpa Logout:** Sistem tidak menyediakan dropdown atau aksi ganti TA maupun ganti peran di dalam navbar/antarmuka aktif. Percobaan manipulasi parameter `ta_id` atau `role` pada request aktif ditolak server; pengguna wajib melakukan logout dan login ulang untuk berpindah TA atau jabatan.
123. **Terminasi Sesi & Integritas Audit Trail:** Saat pengguna logout, token/sesi dihancurkan menyeluruh; login ulang dengan peran/TA lain menghasilkan jejak audit baru pada aksi-aksi sesudah login yang mencatat snapshot peran dan TA yang baru secara akurat tanpa kontaminasi sesi sebelumnya. Login dan logout itu sendiri tidak dicatat sebagai peristiwa audit.
123a. **Pembatasan Percobaan Login:** Setelah 10 kali gagal login berturut-turut pada akun selain Admin, akun terkunci. Login berikutnya ditolak meskipun password benar, dengan pesan galat yang tetap generik. Reset password oleh Admin memulihkan akun.
123b. **Admin Tidak Dikunci:** Akun Admin tidak terkunci meskipun gagal login lebih dari 10 kali berturut-turut.
123c. **Auto Logout:** Sesi berakhir otomatis setelah 1 jam tanpa aktivitas. Permintaan berikutnya ditolak dan pengguna wajib login ulang. Tidak ada batas maksimum lama login dan tidak ada peringatan sebelum logout.
123d. **Reset Password Admin:** Aplikasi tidak menyediakan reset password untuk akun Admin; reset dilakukan melalui backend.

### Q. Laporan realisasi, lampiran, dan keaslian
124. Admin tidak melihat menu laporan dan ditolak di server saat URL laporan dipanggil langsung.
125. PA/KPA hanya melihat data SPJ yang sudah Dibukukan (BKU tercatat). Kolom kuitansi tidak muncul pada laporan b dan f untuk PA/KPA.
126. Laporan rekap realisasi per seksi tidak menampilkan komitmen kuitansi aktif maupun sisa SPD bebas.
127. Pencabutan BKU menghapus transaksi tersebut dari seluruh laporan pada pengunduhan berikutnya.
128. PPTK hanya dapat mengunduh lampiran SPJ seksinya; lampiran seksi lain ditolak di server.
129. Bendahara, Verifikator, dan PA/KPA dapat mengunduh lampiran SPJ seluruh seksi; Admin, Pengawas/Auditor, dan Publik ditolak, termasuk melalui URL langsung.
130. Cetak Hasil Verifikasi hanya tersedia untuk SPJ berstatus Menunggu BKU atau Dibukukan; SPJ Draft dan Terkunci ditolak.
131. PDF Hasil Verifikasi memuat barcode dan nomor verifikasi yang tercetak sebagai teks. Token tidak tercetak sebagai teks, dan nomor verifikasi tidak sama dengan token. Template dapat diubah melalui Visual Live Editor tanpa mengubah data sistem.
131a. Saat SPJ disetujui kembali setelah dikembalikan, nomor verifikasi dan token baru dibuat; nomor dan token lama menampilkan Tidak berlaku. Pencetakan ulang selama token belum berganti memuat nomor verifikasi dan barcode yang sama.
131b. Verifikator dapat mencetak Hasil Verifikasi untuk SPJ seluruh seksi; PPTK hanya untuk seksinya. Pencetakan oleh Admin, Bendahara, PA/KPA, Pengawas/Auditor, atau Publik ditolak di server, termasuk melalui URL langsung.
131c. Admin dapat mengubah tata letak, label, teks statis, logo, dan gambar stempel Hasil Verifikasi SPJ melalui Visual Live Editor dengan preview cetak. Cetakan hanya memuat data sesuai Dokumen 02 §8 poin 2; data sistem tidak dapat diubah dari editor, dan Jumlah yang dibayarkan dan Total Pajak tercetak sebagai hasil perhitungan sistem sesuai 131e.
131d. Nomor verifikasi dibuat otomatis saat SPJ disetujui, berurutan dalam TA, dan tidak dipakai ulang. Admin mengatur format nomor per TA; nomor yang sudah tercetak tidak berubah ketika format diganti. Peran selain Admin tidak dapat mengubah format, termasuk melalui URL langsung.
131e. Total Pajak dihitung sistem sebagai jumlah seluruh entri pajak SPJ, dan Jumlah yang dibayarkan sebagai nilai bruto dikurangi Total Pajak. Tidak ada perhitungan otomatis lain pada lembar verifikasi.
132. Halaman keaslian tanpa login hanya menampilkan status, nama TA, nama seksi, dan tanggal verifikasi. Respons server tidak memuat nominal, nama penerima, NIP/NIK, rekening, lampiran, atau jejak audit.
133. Setelah SPJ dikembalikan menjadi Draft, cetakan lama menampilkan Tidak berlaku pada halaman keaslian. Pencabutan BKU saja tidak mengubah status: selama SPJ belum dikembalikan dan kuitansi belum dibatalkan, cetakan lama tetap menampilkan Berlaku dan SPJ dapat diteruskan ke input BKU ulang.
134. Token keaslian yang tidak dikenal atau sudah tidak berlaku menghasilkan respons seragam tanpa membocorkan data.
135. Pengawas/Auditor tidak melihat sidebar dan mini progress bar; layout Pengawas tetap menu atas tanpa bar.
136. Rincian Kartu Kendali Kegiatan memuat satu blok per pasangan subkegiatan dan rekening belanja yang sudah memiliki realisasi BKU. Setiap blok memuat pagu akhir pasangan, baris BKU dengan realisasi dan sisa anggaran berjalan (pagu akhir dikurangi akumulasi realisasi BKU, tanpa komitmen), serta baris TOTAL.
137. Rekening belanja atau pasangan subkegiatan tanpa realisasi BKU tidak membentuk blok dan tidak tampil di Rincian Kartu Kendali Kegiatan.
138. Blok kartu kendali tampil ke bawah, satu blok setelah blok lain, pada PDF dan Excel, bukan dalam kolom samping. Pada PDF, header kolom diulang di halaman lanjutan.
139. Rincian Kartu Kendali Kegiatan dapat dilihat sesuai cakupan laporan a. Admin dan Publik ditolak, termasuk melalui URL langsung.
140. Laporan rekap isian SPJ (e) berisi isian Form Dinamis per SPJ dalam Excel; kolom BKU, kode subkegiatan, kode rekening, dan nominal bruto kuitansi tidak muncul.
141. Rincian Kartu Kendali Kegiatan tidak memuat kolom LS, UP/GU/TU, unit organisasi, program, kegiatan, atau aktivitas. Filter periode tanggal BKU membatasi baris yang tampil, sedangkan sisa anggaran tetap dihitung dari awal TA.

### R. Pencarian, filter, dan pop-up
142. Daftar Kuitansi, SPJ, BKU, Jejak Audit, Subkegiatan, Rekening Belanja, Personel, Akun, Akun Pengawas/Auditor, Direktori Rekening Bank, dan Direktori Transaksional SPJ menampilkan kotak pencarian dan filter (Dokumen 01 §15 poin 1).
143. Master SOTK dan Jenis Pajak tidak menampilkan kotak pencarian; daftar ditampilkan penuh (Dokumen 01 §15 poin 2).
144. Pencarian mencocokkan kode, nama, nomor BKU, atau uraian sesuai daftar. Hasil berubah saat pengguna mengetik dan pencarian tidak mengubah data.
145. Filter Kuitansi dan SPJ menyediakan status, seksi, periode, dan jenis belanja; filter BKU menyediakan seksi, periode, dan status. Kombinasi filter menghasilkan irisan, dan tombol reset mengembalikan daftar penuh dalam cakupan.
146. Pencarian dan filter hanya mengembalikan data dalam cakupan peran. PPTK tidak menemukan kuitansi seksi lain melalui pencarian; kata kunci yang mengarah ke data di luar cakupan tidak menghasilkan baris, termasuk melalui pemanggilan langsung.
147. Aksi singkat (tambah atau ubah unit kerja, tambah entri pajak, nonaktifkan akun dengan alasan, reset password) terbuka dalam pop-up dengan paling banyak sekitar empat field dan tidak berpindah halaman.
148. Form dengan lebih dari sekitar empat field, atau yang tidak muat tanpa scroll, tidak boleh memakai pop-up. Buat kuitansi, buat atau lengkapi SPJ, Form Dinamis, dan Visual Live Editor tetap di halaman sendiri.
149. Setiap konfirmasi aksi yang tidak dapat dibatalkan, termasuk pencabutan BKU, memakai pop-up konfirmasi. Menutup pop-up tanpa konfirmasi tidak mengubah data.
150. Aksi yang dilakukan melalui pop-up tercatat di Jejak Audit sesuai aturan jejak untuk aksi tersebut, dengan aktor personel yang login.


### S. Tema visual portal publik dan keterbacaan
151. Portal publik memakai token Tema Treasury yang sama dengan login dan Pro Mode, yaitu latar, permukaan, garis tepi, huruf sans-serif, dan monospace untuk angka. Uji dilakukan dengan memeriksa nilai token pada CSS dan tampilan di kedua mode.
152. Pada layar besar dan fullscreen, portal menampilkan kepadatan Pro Mode berupa ticker, donut, gauge, dan bar peringkat dengan huruf yang lebih besar. Pada layar di bawah 768 px, tata letak beralih ke mode standar satu kolom tanpa kehilangan elemen data.
153. Setiap status atau zona pada portal memakai ikon dan teks, tidak hanya warna. Kontras teks normal minimal 4,5:1 dan teks besar serta ikon minimal 3:1, diuji dengan alat pemeriksa kontras.
154. Seluruh isi portal dapat dijangkau dengan keyboard. Fokus terlihat sebagai cincin amber 2 px, dan transisi tidak berjalan bila pengguna memilih pengurangan gerak.

### T. Penyusunan Laporan Kustom
155. Menu Penyusunan Laporan Kustom tampil untuk Bendahara, PPTK, PA/KPA, dan Verifikator, dan berupa halaman sendiri, bukan pop-up. Admin, Pengawas/Auditor, dan Publik ditolak di server, termasuk melalui URL langsung.
156. PPTK hanya dapat memilih cakupan seksinya sendiri. Permintaan dengan seksi lain ditolak di server.
157. PA/KPA tidak dapat memilih kolom Uraian Kuitansi, Nama Penerima, NIP/NIK, Nomor Rekening, Kode Rekening Belanja, atau Nama Rekening Belanja. Pratinjau atau unduhan yang memuat salah satu kolom tersebut ditolak seluruhnya di server, termasuk melalui pemanggilan langsung.
158. Bendahara dan Verifikator dapat memilih seluruh kolom pada matriks, termasuk NIP/NIK dan Nomor Rekening, yang ditampilkan penuh tanpa penyamaran.
159. Kolom Status SPJ tidak tersedia pada antarmuka dan ditolak server jika dikirim.
160. Pratinjau dan unduhan hanya memuat SPJ Dibukukan dengan BKU tercatat. Kuitansi Aktif, kuitansi Terkunci, SPJ Draft, dan SPJ Menunggu BKU tidak muncul.
161. Pratinjau menampilkan paling banyak 10 baris pertama. Unduhan Excel dan PDF memuat baris dan kolom yang sama dengan filter aktif.
162. Pencabutan BKU menghapus transaksi tersebut dari hasil pratinjau dan unduhan berikutnya.
163. Unduhan laporan kustom oleh Bendahara, PPTK, PA/KPA, atau Verifikator tidak menghasilkan entri Jejak Audit.


### U. Heatmap Sebaran Realisasi Bulanan
164. Heatmap Sebaran Realisasi Bulanan tampil hanya untuk PA/KPA. Admin, Bendahara, PPTK, Verifikator, Pengawas/Auditor, dan Publik ditolak di server, termasuk melalui URL langsung dan pemanggilan data.
165. Baris matriks PA/KPA berhenti di tingkat subkegiatan. Server tidak mengirim baris rekening belanja untuk PA/KPA, termasuk melalui pemanggilan langsung.
166. Setiap sel bulan memuat nominal Realisasi BKU bulan tersebut dan persentasenya, sehingga informasi tetap terbaca tanpa warna.
167. Persentase diberi label "Porsi Realisasi Bulanan terhadap Pagu Sah Terakhir" dengan pembagi pagu subkegiatan. Persentase tidak menyertakan komitmen kuitansi aktif dan tidak disebut Serapan.
168. Total realisasi bulanan pada setiap baris subkegiatan sama dengan total realisasi BKU subkegiatan tersebut, dan total seksi sama dengan jumlah subkegiatannya, tanpa selisih.
169. Realisasi bulan ditentukan oleh Tanggal BKU. Jika BKU ditanggalkan mundur ke bulan sebelumnya, sel bulan tersebut dan totalnya berubah pada pemuatan berikutnya.
170. Kuitansi Aktif, kuitansi Terkunci, SPJ Draft, dan SPJ Menunggu BKU tidak masuk perhitungan.
171. Pada TA Masa Transisi atau Arsip Read-Only, matriks menampilkan snapshot pagu TA tersebut dan angkanya tidak berubah setelah perubahan master.
172. Matriks tampil sebagai halaman sendiri, bukan pop-up.


## 4. Kriteria kelulusan minimum
- Semua tes kritis validasi server dan antarmuka lulus.
- Tidak ada role yang dapat melewati kewenangan lewat pemanggilan langsung atau perubahan URL.
- Perubahan anggaran, koreksi BKU, dan pencabutan BKU menghasilkan jejak audit yang dapat ditelusuri. Pembatalan kuitansi atau SPJ Draft, dan penghapusan TA hasil retensi, tidak meninggalkan jejak.
- Data historis tetap konsisten setelah perubahan master, pejabat, pagu, atau template.
- Uji cetak dan ekspor dilakukan pada data uji; kelulusan visual tidak menggantikan validasi perhitungan dan akses.
- Admin tidak melihat alokasi, SPD, kuitansi, SPJ, verifikasi, atau BKU. Satu-satunya angka keuangan yang terlihat oleh Admin adalah Pagu Induk pada kartu TA dan entri Jejak Audit.
- Pengunjung publik pada portal hanya menerima agregat keterbukaan yang diizinkan, dan pada halaman keaslian hanya status satu SPJ (skenario 132); tidak ada nominal rupiah atau data pribadi/transaksi mentah dalam respons server.
