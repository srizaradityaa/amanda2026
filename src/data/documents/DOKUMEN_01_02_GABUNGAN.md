# DOKUMEN 01 DAN 02 (GABUNGAN)

Berkas ini hanya menggabungkan dokumen di bawah secara berurutan, tanpa mengubah isinya.

<!-- ===== AWAL DOKUMEN 01: DOKUMEN_01_ATURAN_BISNIS_DAN_ANGGARAN_v1.53.md ===== -->

# DOKUMEN 01: SPESIFIKASI ATURAN BISNIS & LOGIKA PENGANGGARAN
**Sistem Aplikasi:** AMANDA (Aplikasi Manajemen Data Anggaran)  
**Status:** Terkunci & Disahkan (Single Source of Truth)  
**Tahun Rilis Dokumen:** 2026
**Versi:** 1.53 (2 November 2026)


---

## 1. FONDASI MASTER DATA GLOBAL VS WORKSPACE TAHUN ANGGARAN (TA)

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

### 1.2 Aturan Master SOTK (Flat & Berversi)
1. **Struktur Datar & Identitas Sistemik (Tanpa Kode Manual):**
   - Master SOTK dikelola dalam bentuk daftar seksi secara datar (*flat*) tanpa hierarki bertingkat (*parent-child*).
   - **Peniadaan Kode Unit Eksternal:** Unit kerja tidak memiliki kode rekening anggaran dalam administrasi keuangan daerah (kode hanya berlaku untuk Subkegiatan dan Rekening Belanja). Identitas unit dikelola sepenuhnya melalui ID internal sistem tertutup (*auto-generated ID*). Pengguna/Admin tidak perlu mengisi atau mengelola kode singkatan unit kerja.
2. **Aksi Operasional pada Baris Unit Kerja:**
   - **Aksi Ubah (Edit Data):**
     - Membuka pop-up dengan pilihan mode perubahan:
       a. **Pergantian Nomenklatur SOTK (Reorganisasi/Default):**
          - Ketika terjadi pembaruan/pergantian nama seksi sesuai regulasi baru, unit lama otomatis ditutup pada tanggal **$H-1$** dari TMT unit baru.
          - Unit lama otomatis berganti status menjadi **Diarsipkan (Read-Only)** dan tidak dapat dipilih lagi untuk transaksi masa depan.
          - Entitas nama baru diaktifkan mulai tanggal $TMT$ baru. Seluruh data transaksi, kuitansi, dan SPJ masa lalu tetap utuh mengikat pada nama unit lama demi integritas audit trail.
       b. **Koreksi Redaksional (Typo Ejaan):**
          - Digunakan murni untuk memperbaiki kesalahan ejaan pengetikan nama seksi.
          - Memperbarui teks nama secara langsung tanpa membuat versi baru, tanpa menutup $H-1$, dan tanpa pengarsipan.
   - **Aksi Arsipkan:**
     - Digunakan saat suatu unit kerja dihapus/ditiadakan dari struktur organisasi.
     - Sistem meminta tanggal pengakhiran efektif (default otomatis $H-1$ dari tanggal SK atau tanggal yang ditentukan).
     - Unit langsung berstatus **Diarsipkan (Read-Only)** dan tidak lagi muncul pada pemilihan pembentukan Workspace TA baru.
3. **Penambahan Unit Baru (Tombol Atas):**
   - Tombol "+ Tambah Unit Baru" di bagian atas tabel murni untuk unit baru berdiri sendiri dan hanya meminta: Nama Unit, TMT Mulai, dan Dasar Hukum (tanpa kolom/field Jenis Unit karena SOTK bersifat flat murni).
   - Tombol ini **tidak memuat field/pilihan "Unit pendahulu"**, karena hubungan pergantian unit dari unit lama ditangani sepenuhnya melalui aksi baris "Ubah -> Pergantian Nomenklatur".

### 1.3 Siklus Hidup & Proteksi Tahun Anggaran (TA)
1. **Empat Tahapan Siklus TA:**
   - **Draft / Persiapan:** Penyiapan pagu induk, formasi pejabat, dan pemetaan subkegiatan.
   - **Aktif Penuh:** Masa operasional transaksi, pembuatan kuitansi, SPJ, dan pencairan kas.
   - **Masa Transisi / Tutup Buku:** Penyelesaian verifikasi akhir, pembukuan sisa transaksi, dan rekonsiliasi. Kuitansi dan SPJ baru tidak dapat dibuat pada status ini. Seluruh data kuitansi (nominal, uraian, penerima, dan tanggal) terkunci dan tidak dapat diedit; yang tetap berjalan hanya pembatalan kuitansi Aktif, pengajuan dan verifikasi SPJ, pencatatan BKU, serta pencabutan BKU (rincian di Dokumen 02 §7).
   - **Arsip Read-Only:** Seluruh data terkunci untuk kepentingan audit, pencarian dokumen, dan cetak ulang laporan. Admin dapat membuka kembali TA Arsip secara manual; setiap kali TA diarsipkan kembali, masa retensi 12 tahun dihitung ulang dari tanggal arsip terbaru (poin 6). Pembukaan kembali menjadikan TA berstatus Masa Transisi / Tutup Buku. Admin juga dapat mengembalikan TA Masa Transisi menjadi Aktif Penuh selama tidak ada TA lain berstatus Aktif Penuh (poin 4). Perpindahan mundur selain kedua ini tidak diizinkan.
2. **Proteksi Penghapusan TA:**
   - TA berstatus **Draft** yang belum pernah memiliki transaksi berjalan boleh diedit atau dihapus oleh Admin.
   - Begitu TA pernah memiliki minimal 1 kuitansi, penghapusan TA hanya dapat dilakukan melalui retensi 12 tahun (poin 6). Penanda "sudah ada transaksi" disimpan pada data TA dan tetap berlaku meskipun seluruh kuitansi telah dihapus.
3. **Salin Struktur Terbatas dari TA Sebelumnya:**
   - Saat membuat TA baru, Admin dapat memilih opsi *Salin Struktur*.
   - **Yang Disalin:** Daftar seksi aktif pada akhir TA sebelumnya dan pemetaan subkegiatannya.
   - **Yang Dilarang Disalin:** Nominal pagu anggaran, nomor/tanggal/berkas SK pejabat, dan histori transaksi/mutasi tahun sebelumnya.
4. **Batas Satu TA Aktif Penuh:** Pada satu waktu paling banyak satu TA berstatus Aktif Penuh. Status Draft dan Arsip Read-Only tidak dibatasi jumlahnya. Status Masa Transisi / Tutup Buku tidak dihitung sebagai Aktif Penuh. Sistem menolak aktivasi TA kedua selama masih ada satu TA Aktif Penuh.
5. **Kendali Admin atas Status TA:** Seluruh perpindahan status TA (Draft, Aktif Penuh, Masa Transisi / Tutup Buku, Arsip Read-Only) dilakukan Admin secara manual. Sistem tidak mengubah status TA berdasarkan tanggal atau waktu. Pengaktifan TA hanya diizinkan jika checklist kesiapan lengkap, dan checklist itu ditampilkan kepada Admin sebelum pengaktifan. Checklist dihitung otomatis oleh sistem dari kondisi data, tidak dicentang manual, dan tidak ada pengecualian atau pelewatan oleh Admin.
6. **Retensi dan Penghapusan TA:** Masa retensi TA berstatus Arsip Read-Only adalah 12 tahun sejak tanggal arsip terakhir (WITA). Penghapusan hanya dapat dilakukan Admin secara manual terhadap TA Arsip Read-Only yang telah melewati 12 tahun. Sistem tidak menghapus berdasarkan tanggal. Sebelum konfirmasi, sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran yang akan dihapus, tanpa nominal. Admin mengonfirmasi dengan mengetik kode TA. Penghapusan bersifat total: seluruh data TA, lampiran, dan jejak audit yang terkait dihapus permanen dari database aktif dan penyimpanan berkas, tanpa catatan penghapusan. Salinan cadangan platform tidak dapat dihapus dari aplikasi dan mengikuti kebijakan retensi cadangan platform.

---

## 2. HIERARKI DISTRIBUSI ANGGARAN (PAGU BERJENJANG)

### 2.1 Alur Distribusi dari Atas ke Bawah (*Top-Down Allocation*)
Anggaran didistribusikan melalui 3 tingkatan otoritas berjenjang:
1. **Tingkat 1 (Admin) - Pagu Induk SKPD:**
   - Admin menetapkan total pagu belanja instansi untuk tahun berjalan berdasarkan Dokumen Pelaksanaan Anggaran (DPA).
2. **Tingkat 2 (Bendahara Pengeluaran) - Pagu Subkegiatan:**
   - Bendahara membagikan Pagu Induk langsung ke masing-masing Subkegiatan sesuai rincian DPA.
   - **Aturan Keseimbangan Mutlak:**
     $$\sum \text{Pagu Subkegiatan} = \text{Pagu Induk SKPD}$$
   - Sistem menyediakan indikator selisih alokasi real-time. Status alokasi Bendahara hanya sah jika selisih tepat **Rp 0**.
3. **Penetapan Pagu Seksi (Otomatis):**
   - Admin atau Bendahara **dilarang menginput manual** pagu seksi.
   - Pagu Seksi dihitung otomatis oleh sistem sebagai hasil akumulasi (*sum*) dari seluruh pagu subkegiatan yang dipetakan ke seksi tersebut:
     $$\text{Pagu Seksi} = \sum \text{Pagu Subkegiatan pada Seksi Tersebut}$$
4. **Tingkat 3 (PPTK / Seksi) - Pagu Rekening Belanja:**
   - PPTK/Seksi membagi pagu subkegiatan miliknya ke masing-masing Kode Rekening Belanja.
   - **Aturan Keseimbangan Subkegiatan:**
     $$\sum \text{Pagu Rekening Belanja} = \text{Pagu Subkegiatan Terkait}$$
   - Setiap subkegiatan harus memiliki status alokasi seimbang (**Rp 0**) sebelum dapat digunakan untuk transaksi.
   - Satu rekening belanja dapat dialokasikan di lebih dari satu subkegiatan dalam TA yang sama. Setiap pasangan subkegiatan dan rekening menjadi satu baris alokasi yang memiliki pagu sendiri.
   - Pasangan subkegiatan dan rekening yang sama tidak boleh muncul dua kali dalam satu TA.
   - Kunci internal alokasi berupa ID. Kode gabungan (misal 5.1.02.02.6.2.01.01) hanya untuk tampilan dan pencarian.

---

## 3. JENDELA WAKTU & GERBANG TRANSAKSI BERSAMA (*GATEKEEPER*)

### 3.1 Manajemen Jendela Waktu Alokasi
1. Bendahara Pengeluaran memiliki kewenangan mengatur batas waktu pengisian anggaran (tanggal dan jam penutupan). Seluruh jendela waktu memakai zona waktu WITA (UTC+8).
2. Dashboard seluruh pengguna, kecuali Pengawas/Auditor, menampilkan widget hitung mundur (*countdown*) yang memperlihatkan sisa waktu input alokasi selama jendela input dibuka. Widget hilang setelah seluruh seksi berstatus Seimbang. Admin melihat widget ini dalam mode baca saja dan tidak memiliki kendali atas jendela waktu.
3. Dashboard Bendahara dilengkapi tabel pemantau kesiapan yang menampilkan status masing-masing Seksi:
   - *Belum Input*
   - *Draft Belum Seimbang*
   - *Tuntas (100% Seimbang)*

### 3.2 Prinsip Tanggung Renteng Transaksi (*Global Lock*)
Operasional transaksi kuitansi menerapkan aturan disiplin kolektif:
1. Tombol **"+ Buat Kuitansi"** pada seluruh akun Seksi/PPTK di instansi hanya akan aktif jika **100% Seksi telah menyelesaikan alokasi rekening belanja dengan status Seimbang** DAN Bendahara Pengeluaran telah menekan tombol "Sahkan" (§4.1 poin 3). Kedua syarat wajib terpenuhi.
2. Jika ada **minimal 1 Seksi yang belum selesai atau belum seimbang**, ATAU jika batas waktu habis sementara masih ada seksi yang belum tuntas:
   - Tombol **"+ Buat Kuitansi"** dan **"+ Buat SPJ"** baru dinonaktifkan untuk SEMUA Seksi tanpa pengecualian.
   - Dashboard seluruh pengguna, kecuali Pengawas/Auditor, memunculkan banner pengumuman merah terbuka yang secara transparan mencantumkan daftar nama seksi yang belum menyelesaikan alokasi. Banner hanya memuat nama seksi dan status, tanpa nominal alokasi, tampil juga untuk Admin, dan hilang otomatis setelah seluruh seksi Seimbang.
   - Pembuatan kuitansi dan SPJ baru tertunda hingga Seksi yang bersangkutan menyelesaikan alokasinya. Pemrosesan SPJ yang sudah ada, verifikasi, dan pencatatan BKU tetap berjalan. Bendahara membuka kembali akses jendela input jika waktu sempat kadaluarsa.

---

### 3.3 Topbar dan Mini Progress Bar
Istilah navbar pada seluruh dokumen berarti topbar. Navigasi menu memakai sidebar untuk semua peran kecuali Pengawas/Auditor. Topbar menampilkan label TA aktif dan peran aktif (tanpa dropdown ganti TA atau peran), mini progress bar realisasi terhadap pagu, dan tombol logout. Mini progress bar disertai angka sesuai cakupan peran:

| Peran | Isi mini progress bar topbar |
|---|---|
| Bendahara, PA/KPA, Verifikator | Pagu, realisasi, sisa SPD bebas, dan serapan seluruh instansi |
| PPTK | Pagu, realisasi, dan sisa SPD bebas seksinya saja |
| Admin | Pagu Induk saja |
| Pengawas/Auditor | Tidak ada mini progress bar dan tidak ada sidebar |

---

## 4. ATURAN PENYEDIAAN DANA (SPD) & EFISIENSI ANGGARAN

### 4.1 Otomasi Penerbitan SPD
1. Sistem menerapkan prinsip otomasi penyediaan dana: **SPD Terbit = 100% Pagu**.
2. Begitu alokasi rekening belanja dinyatakan seimbang dan disahkan, nilai SPD awal langsung tersedia secara otomatis untuk seluruh rekening belanja tanpa memerlukan pengajuan berkala/triwulanan manual.
3. **Pemicu Pengesahan:** SPD terbit hanya setelah Bendahara Pengeluaran menekan tombol "Sahkan" dan seluruh seksi berstatus Seimbang. Tanpa pengesahan, tidak ada SPD yang terbit dan kuitansi belum dapat dibuat.


### 4.2 Efisiensi Anggaran oleh Bendahara
1. **Wewenang Tunggal:** Menu efisiensi anggaran adalah hak prerogatif eksklusif Bendahara Pengeluaran (Admin dan Seksi tidak memiliki akses pemotongan SPD).
2. **Mekanisme Efisiensi:** Efisiensi dilakukan dengan cara menurunkan nilai SPD pada rekening belanja yang bersangkutan.
3. **Proteksi Sisa SPD Bebas:**
   - Bendahara hanya dapat menurunkan nilai SPD maksimal sebesar **Sisa SPD Bebas**.
   $$\text{Sisa SPD Bebas} = \text{SPD Aktif} - \text{Realisasi Kas BKU} - \text{Komitmen Kuitansi Aktif}$$
   - Sistem menolak penurunan SPD jika nominal yang dipotong melanggar batas Sisa SPD Bebas, sehingga kuitansi yang telah terbit atau uang yang telah cair di BKU tidak akan pernah defisit/minus.
4. **Pagu Tetap, SPD Turun:** Efisiensi hanya menurunkan SPD. Pagu rekening dan penyebut persentase (Serapan, Realisasi %, Burn-Rate) tidak berubah.
5. **Menaikkan Kembali SPD:** Bendahara dapat menaikkan kembali SPD yang telah diturunkan melalui efisiensi, paling tinggi sampai batas pagu rekening, dengan alasan tertulis dan tercatat di Jejak Audit.

---

## 5. PERGESERAN ANGGARAN & APBD PERUBAHAN (APBD-P)

### 5.1 Pergeseran Anggaran (Satu Pintu Bendahara)
1. **Aksesibilitas:** Fitur pergeseran anggaran dikelola satu pintu oleh Bendahara Pengeluaran. Role Seksi/PPTK dilarang melakukan pergeseran saldo antar-rekening secara mandiri.
2. **Integritas Pagu Total:** Pergeseran anggaran hanya memindahkan alokasi antar-rekening belanja dalam subkegiatan atau antar-subkegiatan tanpa mengubah total Pagu Induk SKPD.
3. **Validasi Sumber Pergeseran:** Saldo yang dipindahkan dari rekening sumber dibatasi maksimal sebesar **Sisa SPD Bebas** rekening sumber tersebut.
4. **SPD Ikut Berpindah:** Pergeseran memindahkan SPD bersama pagu: SPD turun pada rekening sumber dan naik pada rekening tujuan sebesar nilai yang sama.
5. **Audit Trail:** Setiap pergeseran mencatat berita acara digital: waktu mutasi, aktor pemindah, nomor referensi pergeseran, rekening sumber (−), dan rekening tujuan (+). Nomor referensi pergeseran dibuat otomatis oleh sistem dengan format `Pergeseran/{nomor urut 3 digit}/{tahun TA}`, misalnya `Pergeseran/001/2026`. Nomor urut dimulai dari 001 pada setiap TA, bertambah satu untuk setiap pergeseran, tidak dapat diinput atau diubah manual, dan tidak dipakai ulang.
6. **Validasi Tujuan Pergeseran:** Rekening tujuan harus berupa pasangan subkegiatan dan rekening yang sudah dialokasikan pada TA yang sama. Pergeseran ke pasangan yang belum dialokasikan ditolak.

### 5.2 APBD Perubahan (APBD-P) & Pelestarian Histori
1. **Aktivasi APBD-P oleh Admin:**
   - Admin mengaktifkan status APBD Perubahan pada Workspace TA dan memasukkan total Pagu Induk APBD-P baru.
2. **Pembukaan Kembali Jendela Alokasi:**
   - Bendahara dan PPTK/Seksi menyesuaikan kembali pagu subkegiatan dan pagu rekening belanja sesuai dokumen DPA Perubahan.
3. **Proteksi Realisasi Berjalan:**
   - Pada APBD-P, pagu rekening belanja yang baru **dilarang keras diturunkan di bawah total realisasi berjalan**:
     $$\text{Pagu Rekening Baru} \ge (\text{Realisasi Kas BKU} + \text{Komitmen Kuitansi Aktif})$$
4. **Pelestarian Histori Berkolom:**
   - Penyesuaian APBD-P tidak menimpa data lama. Laporan dan visualisasi anggaran menyajikan format komparatif berkolom:
     *Kolom 1: Pagu Murni (DPA)*  
     *Kolom 2: Pergeseran / Perubahan (+/−)*  
     *Kolom 3: Pagu Setelah Perubahan (DPA-P)*  
   - Transaksi yang terbit sebelum APBD-P tetap mengikat pada snapshot anggaran murni.
5. **Sahkan Ulang dan SPD Perubahan:** Selama alokasi perubahan belum seimbang pada seluruh seksi, gatekeeper menahan pembuatan kuitansi dan SPJ baru (§3.2). Setelah seluruh seksi Seimbang pada pagu perubahan, Bendahara menekan "Sahkan" lagi. SPD menyesuaikan pagu perubahan; penurunan SPD tidak boleh di bawah (Realisasi Kas BKU + Komitmen Kuitansi Aktif) (poin 3). Kuitansi baru dapat dibuat setelah Sahkan ulang.

---

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

## 8. AKUN PENGAWAS/AUDITOR
1. **Bukan personel:** Akun Pengawas/Auditor tidak tercatat di Master Personel, tidak memiliki histori pangkat atau gelar, dan tidak wajib memiliki NIP/NIK, pangkat, TMT, atau nomor WhatsApp.
2. **Data wajib:** Nama lengkap, instansi asal, nomor surat tugas (wajib), tanggal surat tugas, email login, dan tanggal akhir akses.
3. **Pembuatan dan password:** Admin membuat akun dan menetapkan password awal (minimal 6 karakter). Password dikelola Admin seperti akun lain, termasuk reset oleh Admin. Pengguna tidak diwajibkan mengganti password saat login pertama.
4. **Penugasan:** Admin menugaskan Pengawas ke TA tertentu. Penugasan tanpa seksi dan mencakup seluruh seksi pada TA yang ditugaskan.
5. **Masa berlaku:** Login ditolak setelah tanggal akhir akses. Admin dapat mengubah tanggal akhir akses dengan alasan yang tercatat.
6. **Status:** Admin dapat menonaktifkan akun dengan alasan tertulis yang tercatat di Jejak Audit. Status NON-ACTIVE memutus login tanpa menghapus data atau riwayat.
7. **Cakupan akses:** Laporan dan Jejak Audit pada TA yang ditugaskan (seluruh seksi), mode baca saja. Tanpa drill-down anggaran, master, akun, penugasan, dan tombol proses.
8. **Audit:** Aksi Pengawas, termasuk mengunduh atau mencetak laporan, dan aksi Admin terhadap akun Pengawas dicatat dengan snapshot nama, instansi asal, nomor surat tugas, dan peran Pengawas.

---

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

## 10. PORTAL KETERBUKAAN INFORMASI PUBLIK (TANPA LOGIN)

1. **Akses dan cakupan:** AMANDA menyediakan halaman publik baca-saja yang dapat dibuka tanpa login. Pengunjung dapat memilih TA yang tersedia; TA Aktif menjadi pilihan awal, sedangkan TA terdahulu/arsip dapat dipilih sebagai histori.
2. **Batas data yang ditampilkan:** Portal keterbukaan hanya menampilkan persentase dan cacah berkas SPJ. Halaman keaslian SPJ (poin 10) dikecualikan dan hanya menampilkan status keaslian satu SPJ. Tidak menampilkan nominal rupiah dalam bentuk apa pun, termasuk pagu, realisasi rupiah, sisa, nilai kuitansi, atau nilai per seksi. Halaman juga tidak menampilkan data sumber transaksi, data penerima, rincian kuitansi/SPJ, lampiran, NIP/NIK, nomor rekening, akun, jejak audit, atau informasi pribadi lainnya.
3. **Realisasi agregat:** Persentase realisasi instansi dihitung di sisi server sebagai total nilai BKU (realisasi pengeluaran belanja yang sudah dibukukan) dibagi total pagu TA, dikali 100%. Persentase seksi dihitung dengan rumus yang sama pada cakupan seksi. Komitmen kuitansi yang belum dibukukan bukan realisasi untuk indikator publik ini. Jika denominator tidak tersedia atau nol, tampilkan indikator sebagai “Belum tersedia” dan bukan nilai tak terhingga/hasil yang menyesatkan. Angka rupiah mentah tidak dikirim ke browser.
4. **Progres SPJ:** Tampilkan total cacah SPJ beserta cacah dan proporsi untuk kategori: Selesai/Dibukukan BKU; Dalam Verifikasi; Perlu Perbaikan; dan Draf/Persiapan PPTK. Satu SPJ hanya dihitung pada satu kategori pada satu waktu. Status/kategori yang dipakai harus mengikuti workflow Dokumen 02 dan Dokumen 03; sistem perlu membedakan draf persiapan dari draf yang dikembalikan untuk perbaikan melalui status atau penanda alur, bukan menebak dari isi dokumen.
5. **Peringkat seksi:** Tampilkan seluruh seksi TA yang memenuhi cakupan data, diurutkan dari persentase realisasi tertinggi ke terendah. Tampilkan nama seksi dan persentase saja, tanpa pagu/realisasi nominal. Seksi tanpa denominator yang dapat dihitung ditampilkan sebagai “Belum tersedia” dan tidak diberi persentase buatan.
6. **Visualisasi dan layar penuh:** Halaman dapat menyajikan grafik donat/pie untuk distribusi status SPJ, gauge atau indikator busur untuk realisasi keseluruhan, bar progres horizontal untuk realisasi instansi/seksi, serta ticker ringkasan yang hanya memuat TA, persentase, cacah SPJ, dan nama seksi. Visualisasi bersifat informatif dan seluruh angka di dalam tooltip/label harus mengikuti batas data publik pada poin 2. Tersedia kontrol fullscreen dan tata letak responsif untuk layar besar/kiosk. Pintasan papan ketik boleh disediakan; F11 tetap mengikuti kendali browser/perangkat dan tidak dijamin dapat dikendalikan aplikasi.
7. **Pembaruan data:** Data agregat diperbarui berkala secara halus setiap 15–30 menit tanpa memuat ulang seluruh halaman. Waktu pembaruan terakhir dapat ditampilkan.
8. **Pemisahan akses dan keamanan:** Pengunjung publik pada portal keterbukaan adalah akses anonim baca-saja khusus agregat; halaman keaslian SPJ (poin 10) hanya membaca status satu SPJ melalui token. Server hanya mengembalikan field agregat yang diperlukan (persentase, cacah, label TA/seksi, kategori status, dan waktu pembaruan); tidak mengirimkan baris sumber/nominal mentah atau data pribadi. Batasan ini wajib ditegakkan pada layanan/server, bukan hanya dengan menyembunyikan elemen antarmuka. Pengujian kebocoran meliputi response jaringan dan akses langsung ke endpoint.
9. **Tampilan dan keterbacaan:** Portal publik mengikuti Tema Visual Treasury pada Dokumen 03 §1 dan §9 poin 7–9. Tampilan memakai kepadatan Pro Mode di layar besar dan mode standar di layar kecil. Setiap status atau zona wajib memakai ikon dan teks, tidak hanya warna, serta memenuhi kontras WCAG AA. Aturan ini tidak mengubah batas data pada poin 2 dan 8.


---
10. **Halaman terpisah:** Halaman keaslian SPJ (Dokumen 02 §8) adalah halaman publik terpisah dari portal ini. Halaman itu hanya memeriksa keaslian satu SPJ melalui token pada barcode, dengan batas tampilan mengikuti Dokumen 02 §8 poin 4 (status, nama TA, nama seksi, dan tanggal verifikasi). Portal ini tidak menampilkan data keaslian SPJ, dan halaman keaslian tidak menampilkan persentase, cacah, atau grafik.

## 11. PENCEGAHAN BENTROK JADWAL PERJALANAN DINAS

1. **Cakupan tujuan:** Untuk Form Dinamis perjalanan dinas, AMANDA mencegah satu identitas NIP/NIK tercatat pada dua SPJ berbeda dalam TA yang sama apabila rentang tanggal tugasnya beririsan. Validasi mencakup peserta/pegawai pada field utama maupun pada setiap entri Blok Berulang. Direktori identitas transaksi ini terpisah dari Master Personel instansi dan dapat memuat pegawai organik, honorer, narasumber, atau pihak luar.
2. **Tag sistem Form Dinamis:** Admin mengonfigurasi tag tersembunyi pada field yang sesuai: `[SYS_PERSONNEL_ID]` untuk field NIP/NIK, `[SYS_PERSONNEL_NAME]` untuk pasangan field nama, `[SYS_START_DATE]` untuk tanggal mulai tugas, dan `[SYS_END_DATE]` untuk tanggal selesai tugas. Tag ID dan nama harus dipasangkan pada konteks yang sama (field utama atau baris blok berulang yang sama). Field tanggal dapat berlaku pada tingkat dokumen atau blok sesuai cakupan perjalanan; sistem memakai rentang efektif yang sama untuk identitas terkait. Tag tidak ditampilkan sebagai teks kepada pengisi.
3. **Direktori Transaksional SPJ dan auto-fill:** Saat PPTK memasukkan NIP/NIK, sistem mencari identitas pada Direktori Transaksional SPJ. Jika ditemukan, nama pasangan diisi otomatis; jika belum ditemukan, PPTK mengisi nama. Ketika SPJ disimpan atau diajukan, pasangan NIP/NIK dan nama yang valid dicatat/digunakan ulang di direktori. Direktori tidak menggantikan Master Personel, tidak membuat akun atau penugasan, dan tidak menetapkan kategori pegawai.
4. **Titik validasi dan kebebasan Draft:** SPJ Draft dapat disimpan, dicetak, dan dilengkapi tanpa pemblokiran bentrok jadwal. Validasi bentrok dijalankan di server ketika PPTK menekan **“Ajukan ke Verifikator”**. Jika bentrok ditemukan, pengajuan ditolak dan SPJ tetap Draft; tidak masuk antrean Verifikator atau menjadi Terkunci. Validasi harus dilakukan secara atomik bersama perubahan status agar dua pengajuan serentak tidak sama-sama lolos.
5. **Rentang tanggal efektif:** Rentang bersifat inklusif. Dua SPJ berbeda bentrok jika identitas yang sama dan `Mulai Baru ≤ Selesai Lama` serta `Selesai Baru ≥ Mulai Lama`. Jika `[SYS_END_DATE]` kosong atau sama dengan `[SYS_START_DATE]`, tanggal selesai efektif dianggap sama dengan tanggal mulai. Rentang yang tidak valid (tanggal selesai sebelum tanggal mulai setelah penerapan default) ditolak sebagai kesalahan input.
6. **Status pembanding:** Pemeriksaan hanya membandingkan dengan SPJ lain pada TA yang sama yang berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft, termasuk SPJ yang dikembalikan untuk perbaikan, tidak menjadi penghalang. SPJ yang dibatalkan/dihapus dan BKU yang dicabut sehingga SPJ kembali ke status non-komitmen tidak lagi menahan jadwal. SPJ yang sedang diajukan sendiri dikecualikan dari pembanding saat proses validasi ulang.
7. **Peringatan bentrok:** Jika bentrok ditemukan, server mengembalikan informasi minimum yang diperlukan kepada PPTK untuk memperbaiki data: identitas terkait, rentang tanggal bentrok, dan referensi SPJ/seksi/subkegiatan pembanding yang diizinkan. Tidak menampilkan rincian isi SPJ atau nominal transaksi lain.
8. **Tata kelola Admin:** Admin memiliki panel untuk mencari dan melihat Direktori Transaksional SPJ, memperbaiki ejaan nama atau digit NIP/NIK, dan menggabungkan entri duplikat. Koreksi dan penggabungan memengaruhi referensi identitas untuk validasi berikutnya dan wajib menjaga relasi historis SPJ. Pengelolaan direktori dicatat sesuai aturan Jejak Audit administratif. Penghapusan atau pembatalan SPJ tidak menghapus entri direktori; identitas tetap tersedia untuk auto-fill berikutnya.

## 12. ANALITIK BURN-RATE & SISTEM PERINGATAN DINI DASBOR PA/KPA

Untuk memperkuat peran supervisi Pengguna Anggaran / Kuasa Pengguna Anggaran (PA/KPA) dari sekadar pembacaan tabel drill-down pasif menjadi pengawasan aktif berbasis data cerdas, AMANDA menyediakan modul analitik kecepatan penyerapan anggaran (*budget burn-rate*) dan peringatan dini (*early warning system*) yang berjalan di sisi backend.

1. **Prinsip Dasar & Non-Blokir (Advisory Flag):**
   - Analitik ini bersifat murni penelaahan eksekutif (*read-only intelligence & advisory flag*).
   - Seluruh badge, notifikasi, dan zona analitik tidak pernah memblokir proses kuitansi, pengajuan SPJ, verifikasi, maupun pembukuan BKU yang sah oleh tim operasional.
   - Analitik bertujuan mendeteksi risiko penumpukan anggaran di akhir tahun (*under-absorption*), keterlambatan pelaksanaan kegiatan seksi, serta lonjakan belanja mendadak yang memerlukan perhatian supervisi.

2. **Dua Parameter Utama Perhitungan (Zona Waktu WITA / UTC+8):**
   - **Time Elapsed (% Waktu Berjalan):**
     $$\text{Time Elapsed (\%)} = \frac{\text{Jumlah Hari yang Terlewati sejak 1 Januari}}{\text{Total Hari dalam Tahun Anggaran (365 atau 366 hari kabisat)}} \times 100\%$$
     - **Status TA Aktif Penuh:** Nilai dihitung dinamis setiap hari berdasarkan tanggal kalender sistem (WITA).
     - **Status TA Masa Transisi & Arsip Read-Only:** Nilai `Time Elapsed` otomatis dikunci (*frozen*) tetap di angka **100%**. Status zona dibekukan pada posisi akhir penutupan buku tahun anggaran tersebut sehingga data historis arsip tidak menghasilkan anomali.
   - **Budget Burn-Rate (% Realisasi BKU terhadap Pagu Sah Terakhir Seksi):**
     $$\text{Budget Burn-Rate (\%)} = \frac{\text{Akumulasi Realisasi Belanja BKU Seksi yang Telah Dibukukan}}{\text{Pagu Sah Terakhir Seksi}} \times 100\%$$
     - **Realisasi Belanja Sah:** Dihitung murni dari total nilai kuitansi/SPJ yang telah memiliki No. BKU dan berstatus Dibukukan. Komitmen kuitansi aktif atau SPJ dalam proses tidak dihitung sebagai realisasi. Istilah "Burn-Rate" hanya dipakai pada analitik ini dan tidak sama dengan "Serapan" (§7 poin 2) maupun "Realisasi (%)" pada laporan (§9 poin 2a).
     - **Pagu Sah Terakhir (Denominator Dinamis):** Sebelum penetapan APBD-P disahkan, menggunakan Pagu Induk/Murni Seksi. Setelah APBD-P disahkan, otomatis beralih menggunakan Pagu Perubahan Seksi (DPA-P).

3. **Klasifikasi 4 Zona Warna & Ambang Batas:**
   - 🟢 **Zona Hijau (Normal / Seimbang):**
     - Kondisi: Seksi yang tidak memenuhi kondisi Zona Kuning, Merah, maupun Oranye. Selisih antara % Burn-Rate dan % Time Elapsed tidak menjadi syarat tersendiri.
     - Tindakan: Kondisi aman, tidak ada tindakan khusus.
   - 🟡 **Zona Kuning (Under-Absorption / Penyerapan Lambat):**
     - Kondisi: Linimasa waktu TA telah berjalan signifikan (Time Elapsed $> 75\%$), namun Burn-Rate seksi tertinggal jauh ($< 50\%$).
     - Tindakan: Sistem menampilkan badge "Serapan Lambat" agar PA/KPA dapat melakukan evaluasi dan menegur kendala teknis penyerapan sebelum penutupan buku.
   - 🔴 **Zona Merah (Critical Under-Absorption / Risiko Gagal Eksekusi):**
     - Kondisi: Linimasa waktu TA hampir berakhir (Time Elapsed $> 90\%$), namun Burn-Rate seksi mandek di angka sangat rendah ($< 60\%$).
     - Tindakan: Sistem menampilkan label "Kritis" dan memprioritaskan seksi tersebut ke urutan paling atas dasbor supervisi.
   - 🟠 **Zona Oranye (Abnormal Spike / Lonjakan Belanja Mendadak):**
     - Kondisi: Terjadi percepatan belanja ekstrem dalam durasi singkat, yaitu kenaikan realisasi BKU sebesar $\ge 40\%$ dari pagu sah terakhir seksi dalam 14 hari kalender terakhir (hari ini dan 13 hari sebelumnya, WITA).
     - Dasar Perhitungan: Dihitung dari total realisasi BKU Dibukukan yang **Tanggal BKU**-nya berada dalam jendela 14 hari kalender terakhir tersebut, dibagi Pagu Sah Terakhir seksi.
     - Tindakan: Sistem menampilkan label penelaahan "Lonjakan Tidak Wajar" sebagai sinyal supervisi PA/KPA untuk memeriksa keabsahan dan dokumen pendukung transaksi periode tersebut.
   - **Aturan Penetapan Zona:** Setiap seksi menempati tepat satu zona pada satu waktu. Bila lebih dari satu kondisi terpenuhi, berlaku prioritas Merah > Oranye > Kuning > Hijau. Ticker ringkasan menghitung satu zona per seksi, sehingga jumlah seluruh zona sama dengan jumlah seksi.

4. **Kerahasiaan & Batasan Akses (RBAC):**
   - Modul analitik, early warning ticker, dan badge zona warna ini eksklusif hanya untuk peran **PA/KPA**, termasuk Heatmap Sebaran Realisasi Bulanan (poin 5). Pengawas/Auditor tidak memiliki akses ke modul analitik.
   - **Dilarang keras** ditampilkan pada Portal Keterbukaan Publik (portal publik hanya menampilkan agregat umum non-nominal tanpa metrik anomali internal).
   - Tampilan kerja harian Bendahara Pengeluaran dan PPTK/Seksi tidak menampilkan widget ini guna menjaga fokus operasional.
5. **Heatmap Sebaran Realisasi Bulanan (Sub-Activity Budget Utilization Heatmap):**
   a. Modul ini berupa matriks analitik berjenjang, bukan grafik bebas. Baris mengikuti jenjang Seksi → Subkegiatan. PA/KPA melihat seluruh seksi sampai subkegiatan dan tidak melihat tingkat rekening belanja (§7 poin 5c).
   b. Modul ini hanya untuk PA/KPA. Admin, Bendahara Pengeluaran, PPTK/Seksi, Verifikator, Pengawas/Auditor, dan Publik tidak memiliki akses. Pengawas/Auditor tetap memakai Katalog Laporan dan Jejak Audit sesuai §8.
   c. Setiap sel bulan memuat nominal realisasi BKU pada bulan tersebut beserta persentasenya. Warna hanya menjadi penanda visual tambahan, dan informasi tetap dapat dibaca tanpa warna (§1 Dokumen 03).
   d. Persentase diberi label "Porsi Realisasi Bulanan terhadap Pagu Sah Terakhir". Pembaginya adalah pagu subkegiatan. Persentase ini tidak menyertakan komitmen kuitansi aktif dan tidak disebut Serapan, sehingga berbeda dengan rumus Serapan pada §7 poin 2.
   e. Realisasi dihitung dari SPJ Dibukukan dengan BKU tercatat, dan bulan ditentukan oleh Tanggal BKU (poin 3). Tanggal BKU yang ditanggalkan mundur mengubah sel bulan tersebut dan total terkait pada pemuatan berikutnya.
   f. Rekonsiliasi berjenjang: total realisasi bulanan pada setiap baris subkegiatan harus sama dengan total realisasi BKU subkegiatan tersebut, dan total seksi harus sama dengan jumlah subkegiatannya. Tidak boleh ada selisih (§7 poin 3).
   g. Pada TA Masa Transisi atau Arsip Read-Only, matriks menampilkan snapshot pagu TA tersebut (§7 poin 7).
   h. Matriks ditampilkan sebagai halaman sendiri, bukan pop-up (§15 poin 7).
   i. Modul ini bersifat advisory dan tidak memengaruhi atau memblokir kuitansi, SPJ, verifikasi, maupun gatekeeper (poin 1).

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

## 15. PENCARIAN, FILTER, DAN POP-UP (ATURAN UMUM ANTARMUKA)

1. **Daftar yang memakai pencarian dan filter:** Kuitansi, SPJ, BKU, Jejak Audit, Subkegiatan, Rekening Belanja, Personel, Akun, Akun Pengawas/Auditor, Direktori Rekening Bank, dan Direktori Transaksional SPJ. Daftar ini tumbuh seiring data TA dan master.
2. **Daftar tanpa pencarian:** Master SOTK dan Jenis Pajak. Datanya kecil dan jarang berubah sehingga cukup ditampilkan penuh.
3. **Pencarian:** satu kotak yang menyaring hasil langsung saat diketik. Pencarian mencocokkan kode, nama, nomor BKU, dan uraian sesuai daftar. Pencarian hanya bersifat membaca dan tidak mengubah data.
4. **Filter per daftar:** hanya field yang dipakai untuk memilah. Kuitansi dan SPJ: status, seksi, periode, dan jenis belanja. BKU: seksi, periode, dan status. Subkegiatan dan Rekening Belanja: status. Personel dan Akun: status akun dan peran. Filter dapat dikombinasikan dan dihapus sekaligus dengan satu tombol reset.
5. **Batas cakupan data:** pencarian dan filter hanya bekerja dalam cakupan data peran pengguna, sesuai Dokumen 05. Hasil di luar cakupan tidak pernah ditampilkan, termasuk melalui pencarian langsung.
6. **Pop-up untuk aksi singkat:** aksi yang muat tanpa scroll dalam sekitar empat field, dan semua konfirmasi yang tidak dapat dibatalkan, dibuka dalam pop-up. Contoh: tambah atau ubah unit kerja, tambah entri pajak, nonaktifkan akun dengan alasan, reset password, dan pencabutan BKU dengan konfirmasi.
7. **Halaman sendiri untuk isian panjang:** buat kuitansi, buat atau lengkapi SPJ, Form Dinamis, Visual Live Editor, dasbor, dan seluruh laporan. Aturan praktisnya: jika form muat di layar tanpa scroll, gunakan pop-up; jika tidak, gunakan halaman.
8. **Jejak audit tidak berubah:** aksi yang dilakukan melalui pop-up tetap dicatat sesuai aturan jejak audit yang berlaku untuk aksi tersebut, tanpa jalur tercatat yang berbeda.

<!-- ===== AKHIR DOKUMEN 01 ===== -->

---

<!-- ===== AWAL DOKUMEN 02: DOKUMEN_02_STANDAR_KUITANSI_DAN_SPJ_v1.33.md ===== -->

# DOKUMEN 02: STANDAR KUITANSI, SPJ, VERIFIKASI & BKU
**Sistem:** AMANDA (Aplikasi Manajemen Data Anggaran)  
**Status:** Terkunci & Disahkan (Single Source of Truth)  
**Tahun dokumen:** 2026
**Versi:** 1.33 (2 November 2026)


## 1. Prinsip pemisahan dokumen
Kuitansi dan SPJ adalah dokumen/proses yang berbeda. Kuitansi dibuat lebih dahulu sebagai bukti pembayaran bruto dan komitmen terhadap SPD. SPJ menyusul, terikat tepat satu kuitansi, dan memuat rincian jenis belanja, pajak, serta bukti pendukung. Dokumen ini mengatur seluruh alur transaksi yang telah dibahas dan disahkan secara final.

## 2. Kuitansi universal
### 2.1 Tata letak dan isi
- Satu template universal digunakan untuk seluruh jenis belanja; bukan template berbeda per jenis belanja.
- Format cetak mengikuti contoh yang diberikan: kertas F4 dibagi dua.
- Header memuat kotak Tahun Anggaran di kiri atas, logo/nama instansi, serta tabel kanan atas dengan satu baris berisi `{Kode Subkegiatan}` dan `{Kode Rekening Belanja}`.
- `{Kode Subkegiatan}` dan `{Kode Rekening Belanja}` diambil dari kode master data. Pada baris kanan atas hanya kodenya yang ditampilkan. No. BKU dan tanggal BKU tidak tampil di kuitansi; keduanya hanya dicatat di Buku Kas.
- **Peniadaan Nomor Kuitansi:** Sistem tidak menggunakan penomoran kuitansi (baik otomatis maupun manual). Kuitansi diidentifikasi secara internal oleh sistem melalui relasi transaksi, kode subkegiatan, kode rekening, uraian, dan tanggal. Satu-satunya nomor pembukuan resmi yang dicatat adalah Nomor BKU oleh Bendahara.
- Badan kuitansi menampilkan nilai bruto, terbilang, `UNTUK PEMBAYARAN {uraian}`, lalu `Sub Keg. : {Nama Subkegiatan}`.
- Empat blok tanda tangan disusun 2x2: PA/KPA, Bendahara Pengeluaran, PPTK, dan Penerima.
- Nama dan NIP pada blok PA/KPA, Bendahara Pengeluaran, dan PPTK diambil dari snapshot penugasan sesuai Dokumen 01 §6 poin 11. Jika penandatangan adalah pejabat Plh./Plt., keterangan atribut jabatan tampil di bawah nama, misalnya "Plh. PPTK Seksi X".
- Bagian Penerima memuat `[Tempat], [Tanggal Kuitansi]`; tempat adalah teks konfigurasi, tanggal adalah tanggal kuitansi.

### 2.2 Elemen yang tidak boleh tampil
- Nomor Kuitansi (tidak ada penomoran kuitansi dalam bentuk apa pun).
- `Kegiatan : {Nama Kegiatan}`.
- `Rekening bank penerima: ________`.
- Daftar pelaksana/nama personel.
- Kotak verifikasi pemeriksaan.
- Nama rekening belanja. Pada baris kanan atas hanya kode subkegiatan dan kode rekening belanja yang ditampilkan; nama subkegiatan hanya muncul pada baris `Sub Keg.` di badan kuitansi.

Pajak dan rincian teknis jenis belanja tidak dicantumkan pada kuitansi; keduanya berada pada SPJ. Kuitansi mencatat nilai bruto.

### 2.3 Editor template
Admin mengelola tata letak dan teks melalui Visual Live Editor tanpa coding, dengan preview cetak. Opsi unggah template `.doc`/`.docx` merupakan alternatif. Editor mengatur template, bukan menggantikan data transaksi; data seperti TA, uraian, nominal, subkegiatan, pejabat dan tanggal diisi dari transaksi/Workspace TA sesuai sumbernya. Editor juga mengatur template Hasil Verifikasi SPJ (§8).

## 3. Data yang diisi Seksi/PPTK saat membuat kuitansi
1. Subkegiatan yang tersedia untuk seksinya pada TA tersebut.
2. Rekening belanja di bawah subkegiatan itu.
3. Nominal bruto.
4. Uraian pembayaran.
5. Nama penerima dan identitas yang diperlukan.
6. Tanggal kuitansi.

Data TA, instansi, kode/nama subkegiatan dan rekening, nilai terbilang, serta identitas pejabat yang sesuai penugasan aktif pada waktu pembuatan dokumen (Dokumen 01 §6 poin 11) diambil atau dihitung dari data terkait. No. BKU dan tanggal BKU dicatat pada pembukuan Bendahara di Buku Kas, tidak di kuitansi.

## 4. Alur kuitansi dan dampak saldo
1. Gatekeeper anggaran mengizinkan atau menahan pembuatan kuitansi dan SPJ baru sesuai status kesiapan alokasi seluruh seksi dan pengesahan ("Sahkan") Bendahara (Dokumen 01 §3.2). Gatekeeper tidak menahan pemrosesan SPJ yang sudah ada, verifikasi, maupun pencatatan BKU.
2. Seksi/PPTK membuat dan menyimpan kuitansi dengan nilai bruto. Kuitansi berstatus **Aktif**.
3. Kuitansi Aktif mengunci/mengurangi saldo SPD yang tersedia sebagai komitmen. Saldo yang sudah terikat tidak dapat dipakai membuat kuitansi lain.
4. Status kuitansi:
   - **Aktif:** belum dikaitkan SPJ, yaitu belum ada SPJ Draft. Boleh diedit dan dibatalkan pada status TA Aktif Penuh; pada Masa Transisi hanya boleh dibatalkan (§7). Pembatalan kuitansi melepas komitmen SPD.
   - **Terkunci:** sudah dikaitkan SPJ, yaitu sejak SPJ Draft dibuat dan selama SPJ masih terkait. Tidak dapat diedit atau dibatalkan. Untuk mengubahnya, SPJ harus dilepas atau dibatalkan dari kuitansi terlebih dahulu. Pelepasan SPJ Draft mengembalikan kuitansi menjadi Aktif.
   - Tidak ada status Dibatalkan. Kuitansi yang dibatalkan langsung dihapus dan tidak meninggalkan jejak (§6.3).
5. Kuitansi dapat dicetak.
6. **Sifat dan Input BKU:**
   - **Input Manual & Keunikan:** No. BKU diinput secara manual oleh Bendahara (bukan auto-number sistem) untuk menyesuaikan penomoran buku kas fisik/manual instansi. No. BKU wajib unik per TA; sistem menolak No. BKU yang sedang aktif dipakai di TA yang sama.
   - **Cakupan Murni Pengeluaran Belanja:** BKU AMANDA murni merupakan buku pembukuan realisasi pengeluaran belanja per kuitansi/SPJ. Sistem tidak mencatat transaksi penerimaan kas, SP2D (UP/GU/TU/LS), maupun saldo kas tunai/bank.
   - **Fleksibilitas Penanggalan (Bebas Batasan Kronologis):** Sistem membebaskan penanggalan transaksi tanpa validasi urutan kronologis antara Tanggal Kuitansi, tanggal pengajuan SPJ, dan Tanggal BKU, guna mengakomodasi pencatatan faktual lapangan maupun input susulan (backdate).
   - **Ketentuan Nomor Dicabut & Satu BKU per Kuitansi:** Jika suatu BKU dicabut melalui alur pencabutan berjenjang (§6.2), nomor BKU tersebut berstatus bebas kembali dan sah digunakan untuk transaksi kuitansi/SPJ lain di TA yang sama. Satu kuitansi hanya boleh memiliki satu BKU; sistem menolak input BKU kedua.
7. Saat BKU dicatat, komitmen kuitansi berubah menjadi realisasi. Sisa SPD Bebas tidak berubah karena nilainya hanya berpindah dari komitmen ke realisasi.

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

## 7. Izin aksi per status TA
| Aksi | Aktif Penuh | Masa Transisi | Arsip Read-Only |
|---|---|---|---|
| Membuat kuitansi baru | Boleh, jika gatekeeper terbuka | Tidak | Tidak |
| Membuat SPJ baru | Boleh, jika gatekeeper terbuka | Tidak | Tidak |
| Mengedit data kuitansi Aktif (nominal, uraian, penerima, tanggal) | Boleh | Tidak | Tidak |
| Membatalkan kuitansi Aktif | Boleh | Boleh | Tidak |
| Mengunggah dan mengajukan SPJ yang sudah ada | Boleh | Boleh | Tidak |
| Memverifikasi atau mengembalikan SPJ | Boleh | Boleh | Tidak |
| Mencatat BKU, dan mengoreksi No. BKU atau tanggal BKU | Boleh | Boleh | Tidak |
| Mencabut BKU | Boleh | Boleh | Tidak |
| Pengawas/Auditor | Baca saja | Baca saja | Baca saja |

Kuitansi Terkunci tidak dapat diubah pada status apa pun, kecuali SPJ-nya dilepas atau dihapus terlebih dahulu.

## 8. Cetak hasil verifikasi SPJ dan verifikasi keaslian (barcode)
1. Setelah SPJ disetujui Verifikator (berstatus Menunggu BKU atau Dibukukan), PPTK pada seksi SPJ tersebut, dan Verifikator untuk seluruh seksi, dapat mencetak "Hasil Verifikasi SPJ" dalam format PDF.
2. Cetakan memakai template terpisah yang diatur Admin melalui Visual Live Editor seperti template kuitansi (§2.3). Data berikut diisi dari sistem, bukan dari editor: TA, seksi, identitas SPJ, nomor verifikasi, tanggal verifikasi, nama dan NIP Verifikator, sub kegiatan, kode rekening belanja, uraian, nilai bruto, nama penerima, bank dan nomor rekening penerima, serta setiap entri pajak beserta nominal yang diisi manual. Jumlah yang dibayarkan dan Total Pajak dihitung sistem sesuai §5 dan dicetak. Admin dapat mengubah tata letak, label, teks statis, logo, dan gambar stempel, tetapi tidak dapat mengubah data sistem dari editor.
3. Setiap cetakan memuat dua pengenal yang terpisah. (a) Barcode (QR) berisi tautan verifikasi keaslian dengan token acak yang dibuat sistem saat SPJ disetujui. Token tidak dicetak sebagai teks, bukan nomor urut, dan tidak memuat nomor kuitansi. (b) Nomor verifikasi tercetak sebagai teks di samping barcode. Sistem membuat nomor secara otomatis bersamaan dengan token, dengan urutan yang terus bertambah dalam TA dan tidak pernah dipakai ulang. Nomor tidak sama dengan token, serta tidak memuat nomor kuitansi, nominal, atau nama. Admin mengatur format nomor per TA (awalan, pemisah, pola tahun, dan jumlah digit urut). Nomor yang sudah tercetak tidak berubah ketika format diganti. Nomor verifikasi tidak dipakai sebagai pengganti token pada tautan.
4. Halaman verifikasi keaslian dapat dibuka tanpa login. Halaman hanya menampilkan status keaslian (Berlaku atau Tidak berlaku), nama TA, nama seksi, dan tanggal verifikasi. Halaman tidak menampilkan nominal, nama penerima, NIP/NIK, nomor rekening, lampiran, rincian kuitansi/SPJ, atau jejak audit. Ketentuan ini berlaku pada respons server, bukan hanya pada tampilan.
5. Status keaslian mengikuti status SPJ. Jika Verifikator mengembalikan SPJ menjadi Draft, halaman menampilkan Tidak berlaku untuk cetakan sebelumnya. Pencabutan BKU saja tidak mengubah status keaslian: selama SPJ belum dikembalikan menjadi Draft, belum dilepas dari kuitansi, dan kuitansinya belum dibatalkan, SPJ tetap sah (Berlaku) karena masih dapat diteruskan ke pencatatan BKU, misalnya untuk memperbaiki No. BKU yang salah. Setelah SPJ kembali disetujui, token dan nomor verifikasi baru dibuat, dan token serta nomor lama tidak berlaku.
6. Pencetakan ulang diperbolehkan selama SPJ berstatus Menunggu BKU atau Dibukukan. Cetakan untuk SPJ berstatus Draft atau Terkunci ditolak. Selama token belum berganti, cetakan ulang memuat nomor verifikasi dan barcode yang sama.
7. Nama dan NIP pejabat pada Hasil Verifikasi SPJ diambil dari snapshot penugasan sesuai Dokumen 01 §6 poin 11. Cetak ulang selalu memakai snapshot tersebut dan tidak berubah setelah delegasi Plh./Plt. berakhir.

## 9. Unduh lampiran PDF SPJ
1. Lampiran PDF SPJ dapat diunduh oleh: Bendahara, Verifikator, dan PA/KPA untuk seluruh seksi; PPTK untuk seksinya sendiri.
2. Admin, Pengawas/Auditor, dan Publik tidak dapat mengunduh lampiran, termasuk melalui URL langsung.
3. Berkas yang diunduh adalah berkas final yang tersimpan pada SPJ. Berkas asli tidak disimpan sistem; hanya nama dan ukuran aslinya yang tercatat sebagai metadata.

<!-- ===== AKHIR DOKUMEN 02 ===== -->

---
