# PAKET LANGKAH 2: MASTER DATA & AKUN

**Sumber kebenaran mutlak:** Dokumen 01 v1.52, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.37, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 2 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 2 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 20 | AKN-04 | Akun Pengawas/Auditor terpisah dari personel | Admin | P1 | Frontend | AUD-01 |
| 21 | AUD-03 | Hak baca Jejak Audit per peran | Admin, Bendahara, PPTK, Verifikator, Pengawas | P1 | Frontend | AUD-01 |
| 22 | AUD-04 | Audit aksi Pengawas/Auditor | Pengawas | P1 | Frontend | AUD-01 |
| 23 | BNT-01 | Direktori Transaksional SPJ: panel kelola | Admin | P1 | Frontend | AUD-01 |
| 24 | DSB-01 | Dasbor Administrasi Global | Admin | P1 | Frontend | AUT-02 |
| 25 | MST-01 | Master SOTK flat berversi | Admin | P1 | Frontend | FND-01, AUD-01 |
| 26 | MST-02 | Master Personel: identitas & atribut wajib | Admin | P1 | Frontend | FND-01 |
| 27 | MST-05 | Master Subkegiatan & Master Rekening Belanja | Admin | P1 | Frontend | FND-04 |
| 28 | MST-06 | Master Jenis Pajak | Admin | P1 | Frontend | FND-02 |
| 29 | UIX-07 | Pencarian & filter pada daftar yang ditetapkan | Semua | P1 | Frontend | FND-02 |
| 30 | UIX-08 | Aturan pop-up vs halaman sendiri | Semua | P1 | Frontend | UIX-03 |
| 31 | AKN-01 | Dialog Kelola Akun personel | Admin | P0 | Frontend | MST-02 |
| 32 | MST-03 | Histori pangkat & gelar berversi | Admin | P1 | Frontend | MST-02 |
| 33 | MST-04 | Halaman Manajemen Personel | Admin | P2 | Frontend | MST-02 |
| 34 | AKN-02 | Penonaktifan akun | Admin | P1 | Frontend | AKN-01, AUD-01 |
| 35 | AUT-05 | Penolakan login akun NON-ACTIVE / Pengawas lewat tanggal akhir akses | Semua | P1 | Frontend | AKN-01, AKN-04 |
| 36 | AUT-07 | Pembatasan percobaan login (keputusan pemilik N-13) | Semua kecuali Admin | P1 | Frontend | AUT-01, AKN-01 |
- **AUT-07:** dipindah ke langkah ini dari fase F0 karena ketergantungan.

## 2. Aturan kunci per fitur (ringkasan)
### AKN-04 — Akun Pengawas/Auditor terpisah dari personel
- **Peran:** Admin
- **Aturan:** Data wajib: nama, instansi asal, nomor & tanggal surat tugas, email, tanggal akhir akses; password awal oleh Admin (tidak wajib ganti); reset; NON-ACTIVE beralasan; ubah tanggal akhir akses beralasan; bukan Master Personel.
- **Rujukan:** D01 §8; D03 §2.1 poin 3a; D04 §2.1, §3

### AUD-03 — Hak baca Jejak Audit per peran
- **Peran:** Admin, Bendahara, PPTK, Verifikator, Pengawas
- **Aturan:** Admin semua TA termasuk entri keuangan (baca saja); PPTK hanya entri seksinya; Bendahara hanya entri aksinya sendiri; Verifikator seluruh TA baca saja; Pengawas TA yang ditugaskan baca saja; PA/KPA tidak. Daftar punya pencarian & filter.
- **Rujukan:** D05 §2 baris Jejak audit; D01 §6 poin 3, 5, 6; D01 §15
- **Keputusan pemilik yang sudah masuk dokumen:** N-05: Bendahara hanya melihat entri Jejak Audit aksinya sendiri.

### AUD-04 — Audit aksi Pengawas/Auditor
- **Peran:** Pengawas
- **Aturan:** Unduh/cetak laporan dan aksi Admin terhadap akun Pengawas dicatat dengan snapshot nama, instansi asal, nomor surat tugas, peran Pengawas.
- **Rujukan:** D01 §8 poin 8, §9 poin 5; D04 §6

### BNT-01 — Direktori Transaksional SPJ: panel kelola
- **Peran:** Admin
- **Aturan:** Lihat, koreksi nama/NIP-NIK, merge duplikat; terpisah dari Master Personel; relasi SPJ historis terjaga; dicatat audit administratif.
- **Rujukan:** D03 §2.1 poin 6a; D04 §2.4; D01 §11 poin 8

### DSB-01 — Dasbor Administrasi Global
- **Peran:** Admin
- **Aturan:** Kartu TA + Pagu Induk, status TA, countdown & banner (baca saja); tidak menampilkan alokasi, SPD, kuitansi, SPJ, verifikasi, BKU, realisasi/sisa SPD.
- **Rujukan:** D03 §1, §2.1 poin 6; D01 §6 poin 2–3

### MST-01 — Master SOTK flat berversi
- **Peran:** Admin
- **Aturan:** Tambah unit (Nama, TMT, Dasar Hukum; tanpa kode/jenis/pendahulu); Ubah–Pergantian Nomenklatur (unit lama tutup H-1, Diarsipkan RO); Ubah–Koreksi Typo (in-place); Arsipkan (tanggal efektif).
- **Rujukan:** D01 §1.2; D03 §2.1 poin 1; D04 §2.1

### MST-02 — Master Personel: identitas & atribut wajib
- **Peran:** Admin
- **Aturan:** NIP/NIK angka (tanpa batas digit), unik (kecuali profil sendiri saat edit); nama lengkap, pangkat/golongan, TMT, WhatsApp (angka & +) wajib; gelar opsional.
- **Rujukan:** D03 §2.1 poin 2; D04 §3

### MST-05 — Master Subkegiatan & Master Rekening Belanja
- **Peran:** Admin
- **Aturan:** Kamus global tanpa pagu; kode sebagai teks; rekening dapat dipakai di subkegiatan mana pun; status aktif; daftar dengan pencarian & filter status.
- **Rujukan:** D01 §1.1; D03 §2.1 poin 4; D04 §2.1
- **Keputusan pemilik yang sudah masuk dokumen:** N-11: kode dan nama subkegiatan/rekening disalin sebagai snapshot ke data TA.

### MST-06 — Master Jenis Pajak
- **Peran:** Admin
- **Aturan:** Kode opsional, nama, status; hanya jenis aktif muncul pada SPJ; peran lain ditolak server; daftar tanpa pencarian.
- **Rujukan:** D04 §2.1; D03 §2.1 poin 4; D01 §15 poin 2

### UIX-07 — Pencarian & filter pada daftar yang ditetapkan
- **Peran:** Semua
- **Aturan:** Pencarian satu kotak real-time (kode, nama, No. BKU, uraian); filter per daftar + reset; hanya dalam cakupan peran; SOTK & Jenis Pajak tanpa pencarian.
- **Rujukan:** D01 §15 poin 1–5

### UIX-08 — Aturan pop-up vs halaman sendiri
- **Peran:** Semua
- **Aturan:** Aksi singkat (≤ ~4 field) & konfirmasi tak-dapat-dibatalkan = pop-up; kuitansi, SPJ, Form Dinamis, Visual Live Editor, dasbor, laporan = halaman sendiri; aksi pop-up tetap tercatat audit.
- **Rujukan:** D01 §15 poin 6–8

### AKN-01 — Dialog Kelola Akun personel
- **Peran:** Admin
- **Aturan:** Username otomatis dari NIP/NIK; buat akun (password min 6); reset password; status Belum Ada Akun/ACTIVE/NON-ACTIVE di tabel.
- **Rujukan:** D03 §2.1 poin 3; D04 §3

### MST-03 — Histori pangkat & gelar berversi
- **Peran:** Admin
- **Aturan:** Entri awal otomatis; opsi "Simpan sebagai perubahan baru" menutup periode lama; cetak historis tidak rusak.
- **Rujukan:** D03 §2.1 poin 2; D04 §3

### MST-04 — Halaman Manajemen Personel
- **Peran:** Admin
- **Aturan:** Kartu statistik (Total Personel, Akun Aktif, Entri Histori) + navigasi ke Unit Kerja (tautan ke Master SOTK) dan Peta Jabatan (penugasan per TA: PA/KPA, Bendahara, Verifikator, PPTK per seksi, SK, delegasi).
- **Rujukan:** D03 §2.1 poin 2
- **Keputusan pemilik yang sudah masuk dokumen:** N-10: hapus "Organisasi"; "Unit Kerja" = tautan ke Master SOTK; "Peta Jabatan" = daftar penugasan per TA (PA/KPA, Bendahara, Verifikator, PPTK per seksi, SK, delegasi).

### AKN-02 — Penonaktifan akun
- **Peran:** Admin
- **Aturan:** Alasan wajib (tercatat audit); tampil daftar penugasan terdampak + peringatan Bendahara/PPTK; penugasan tidak berubah; tidak boleh menonaktifkan akun sendiri atau Admin ACTIVE terakhir.
- **Rujukan:** D03 §2.1 poin 3; D04 §3

### AUT-05 — Penolakan login akun NON-ACTIVE / Pengawas lewat tanggal akhir akses
- **Peran:** Semua
- **Aturan:** NON-ACTIVE memutus login tanpa menghapus data; login Pengawas ditolak setelah tanggal akhir akses.
- **Rujukan:** D01 §8 poin 5–6; D03 §2.1 poin 3, 7

### AUT-07 — Pembatasan percobaan login (keputusan pemilik N-13)
- **Peran:** Semua kecuali Admin
- **Aturan:** Berlaku untuk semua peran KECUALI Admin: setelah 10 kali gagal berturut-turut akun terkunci; pemulihan dengan reset sandi oleh Admin; akun Admin tidak dikunci; pesan galat tetap generik.
- **Rujukan:** D03 §1; D04 §3
- **Keputusan pemilik yang sudah masuk dokumen:** N-13: 10 kali gagal berturut-turut → akun terkunci; reset sandi oleh Admin. Tidak berlaku untuk akun Admin (tidak dikunci). Diputuskan (1 Nov 2026): reset password akun Admin yang lupa dilakukan melalui backend, bukan lewat aplikasi.

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 01 §8

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

#### Dokumen 03 §2.1

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

#### Dokumen 04 §6

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

#### Dokumen 04 §2.4

### 2.4 Direktori Transaksional SPJ dan validasi jadwal
- Direktori Transaksional SPJ menyimpan pasangan NIP/NIK dan nama yang berasal dari pengisian Form Dinamis perjalanan dinas. Data ini bukan Master Personel, tidak membentuk akun, dan digunakan untuk lookup/auto-fill nama. Identitas dapat berasal dari pegawai organik, honorer, narasumber, atau pihak luar.
- Tag sistem tersembunyi: `[SYS_PERSONNEL_ID]` (NIP/NIK), `[SYS_PERSONNEL_NAME]` (nama pasangan), `[SYS_START_DATE]` dan `[SYS_END_DATE]`. Tag ID/nama harus berpasangan pada field utama yang sama atau pada satu entri blok berulang yang sama. Rentang tanggal pada tingkat dokumen dapat dipakai bersama untuk semua orang di blok; cakupannya ditentukan konfigurasi form.
- Jika NIP/NIK ditemukan, nama pasangan diisi otomatis; jika belum ada, nama diinput PPTK. Identitas dicatat/diperbarui di direktori saat SPJ disimpan atau diajukan. Penghapusan SPJ tidak menghapus profil direktori.
- Pemeriksaan jadwal dijalankan server-side hanya saat pengajuan ke Verifikator. Menyimpan Draft tidak diblokir. Dua rentang inklusif bentrok bila `Mulai Baru ≤ Selesai Lama` dan `Selesai Baru ≥ Mulai Lama`. Jika tanggal selesai kosong/sama dengan tanggal mulai, tanggal selesai efektif sama dengan tanggal mulai; tanggal selesai sebelum tanggal mulai ditolak.
- Cakupan bentrok: identitas sama, TA sama, SPJ pembanding berstatus Terkunci, Menunggu BKU, atau Dibukukan. Draft/yang dikembalikan untuk perbaikan tidak dihitung. SPJ yang dibatalkan/dihapus atau kembali ke status non-komitmen tidak lagi menahan jadwal. Pengajuan dan penetapan status dilakukan atomik untuk mencegah pengajuan serentak lolos bersamaan.
- Admin boleh mengoreksi dan menggabungkan entri direktori duplikat. Merge harus memperbarui referensi identitas validasi tanpa menghapus/mengubah isi historis SPJ yang telah tersimpan; perubahan administratif dicatat dalam Audit Event.

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

#### Dokumen 01 §1.2

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

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **A-1** (MST-02): Personel dengan NIP disimpan menggunakan NIP; personel non-PNS tanpa NIP dapat disimpan hanya menggunakan NIK.
- **A-2** (MST-02): NIP dan NIK hanya menerima input angka (tanpa batasan kaku 18 atau 16 digit), dan sistem menolak angka yang telah digunakan personel lain.
- **A-3** (MST-02): Saat mengedit personel, angka NIP/NIK milik profil yang sedang diedit tidak dianggap sebagai duplikat.
- **A-4** (MST-02): Nama lengkap, pangkat/golongan, TMT, dan nomor WhatsApp (angka dan +) wajib diisi; validasi menolak jika salah satu kosong. Gelar depan dan belakang bersifat opsional.
- **A-5** (MST-03): Saat personel baru disimpan, sistem otomatis membuat catatan histori awal pangkat dan gelar.
- **A-6** (MST-03): Saat mengedit dan mengubah pangkat/gelar, opsi "Simpan sebagai perubahan baru" menutup histori lama dan membuat entri periode baru tanpa merusak cetak dokumen historis lama.
- **A-7** (AKN-01): Username akun login dibuat otomatis dari NIP (atau NIK jika NIP tidak ada).
- **A-8** (AKN-01): Admin dapat membuat akun baru melalui tombol "Akun" dengan password minimal 6 karakter.
- **A-9** (AKN-01): Admin dapat mengganti password dan mengubah status akun menjadi ACTIVE atau NON-ACTIVE; status Belum Ada Akun, ACTIVE, dan NON-ACTIVE tampil akurat di tabel.
- **A-9a** (AKN-02): Admin dapat menonaktifkan akun ACTIVE hanya dengan alasan tertulis. Sebelum konfirmasi, sistem menampilkan penugasan aktif yang terdampak, dan penugasan tersebut tidak berubah.
- **A-9b** (AKN-02): Admin tidak dapat menonaktifkan akun miliknya sendiri atau Admin ACTIVE terakhir; sistem menolak dengan pesan yang jelas.
- **B-8** (MST-01): Perubahan Master SOTK tidak mengubah snapshot dan transaksi TA lama.
- **B-8a** (MST-01): Pada Master SOTK, tidak ada input field kode unit manual; identifikasi unit menggunakan ID sistem internal otomatis.
- **B-8b** (MST-01): Aksi Ubah dengan mode Pergantian Nomenklatur otomatis menutup unit lama pada H-1 dan mengarsipkannya sebagai Read-Only, sementara transaksi historis tetap mengacu pada nama unit lama.
- **B-8c** (MST-01): Aksi Ubah dengan mode Koreksi Redaksional (Typo) memperbarui teks nama secara in-place tanpa mengubah tanggal TMT dan tanpa membuat pengarsipan baru.
- **B-8d** (MST-01): Aksi Arsipkan pada baris unit kerja aktif menutup unit kerja dengan tanggal efektif pengakhiran dan mengubah statusnya menjadi Diarsipkan (Read-Only).
- **B-9** (MST-01): Unit/pejabat pengganti mulai tanggal D; data lama berakhir D-1 dan transaksi historis tetap menampilkan pejabat/unit yang sesuai tanggal.
- **B-10d** (AUD-03, DSB-01): PPTK tidak dapat melihat Pagu Induk pada kartu TA. Verifikator dapat melihatnya dalam mode baca saja.
- **C-13a** (MST-05): Satu rekening belanja boleh dipakai di subkegiatan mana pun dalam TA yang sama; setiap pasangan subkegiatan dan rekening memiliki pagu dan alokasi sendiri.
- **C-15a** (DSB-01): Dashboard Admin menampilkan countdown dan banner merah dalam mode baca saja, tanpa tombol pengaturan jendela waktu.
- **D-23c** (AUD-03): PPTK hanya dapat melihat entri Jejak Audit milik seksinya sendiri. Verifikator dapat melihat seluruh entri TA dalam mode baca saja.
- **D-23d** (AUD-03): Bendahara hanya melihat entri Jejak Audit aksinya sendiri. Permintaan langsung ke entri aktor lain, termasuk melalui URL, ditolak di server.
- **H-44** (AKN-04): Akun Pengawas dibuat Admin dengan nama lengkap, instansi asal, nomor dan tanggal surat tugas, email, dan tanggal akhir akses. Nomor surat tugas wajib diisi.
- **H-45** (AKN-04): Akun Pengawas tidak tampil di Master Personel dan tidak mensyaratkan NIP/NIK, pangkat, TMT, atau nomor WhatsApp.
- **H-46** (AKN-04): Password awal ditetapkan Admin (minimal 6 karakter). Pengguna tidak diminta mengganti password saat login pertama, dan Admin dapat mereset password.
- **H-48** (AUT-05, AKN-04): Login ditolak setelah tanggal akhir akses. Perubahan tanggal akhir oleh Admin tercatat di Jejak Audit.
- **H-49** (AUT-05, AKN-04): Penonaktifan akun Pengawas memerlukan alasan tertulis yang tercatat di Jejak Audit; data dan penugasan historis tetap tersimpan.
- **H-51** (AUD-04): Aksi Pengawas mengunduh atau mencetak laporan tercatat dengan snapshot nama, instansi asal, nomor surat tugas, dan peran Pengawas.
- **K-73** (MST-06): Pilihan jenis pajak hanya berisi Master Jenis Pajak berstatus aktif. Admin mengelola master tersebut; peran lain ditolak di server.
- **M-87** (BNT-01): Admin dapat membuka panel Direktori Transaksional SPJ yang terpisah dari Master Personel; identitas dari pegawai organik, honorer, narasumber, dan pihak luar dapat disimpan tanpa membuat profil personel atau akun login.
- **M-88** (BNT-01): Admin dapat mengoreksi ejaan nama/digit NIP-NIK dan menggabungkan entri duplikat; perubahan tercatat di Audit Event dan referensi SPJ historis tetap terjaga. Penggabungan membuat validasi berikutnya memakai identitas yang telah digabung.
- **P-123a** (AUT-07): **Pembatasan Percobaan Login:** Setelah 10 kali gagal login berturut-turut pada akun selain Admin, akun terkunci. Login berikutnya ditolak meskipun password benar, dengan pesan galat yang tetap generik. Reset password oleh Admin memulihkan akun.
- **P-123b** (AUT-07): **Admin Tidak Dikunci:** Akun Admin tidak terkunci meskipun gagal login lebih dari 10 kali berturut-turut.
- **P-123d** (AUT-07): **Reset Password Admin:** Aplikasi tidak menyediakan reset password untuk akun Admin; reset dilakukan melalui backend.
- **R-142** (UIX-07): Daftar Kuitansi, SPJ, BKU, Jejak Audit, Subkegiatan, Rekening Belanja, Personel, Akun, Akun Pengawas/Auditor, Direktori Rekening Bank, dan Direktori Transaksional SPJ menampilkan kotak pencarian dan filter (Dokumen 01 §15 poin 1).
- **R-143** (UIX-07, MST-06): Master SOTK dan Jenis Pajak tidak menampilkan kotak pencarian; daftar ditampilkan penuh (Dokumen 01 §15 poin 2).
- **R-144** (UIX-07): Pencarian mencocokkan kode, nama, nomor BKU, atau uraian sesuai daftar. Hasil berubah saat pengguna mengetik dan pencarian tidak mengubah data.
- **R-145** (UIX-07): Filter Kuitansi dan SPJ menyediakan status, seksi, periode, dan jenis belanja; filter BKU menyediakan seksi, periode, dan status. Kombinasi filter menghasilkan irisan, dan tombol reset mengembalikan daftar penuh dalam cakupan.
- **R-146** (UIX-07): Pencarian dan filter hanya mengembalikan data dalam cakupan peran. PPTK tidak menemukan kuitansi seksi lain melalui pencarian; kata kunci yang mengarah ke data di luar cakupan tidak menghasilkan baris, termasuk melalui pemanggilan langsung.
- **R-147** (UIX-08): Aksi singkat (tambah atau ubah unit kerja, tambah entri pajak, nonaktifkan akun dengan alasan, reset password) terbuka dalam pop-up dengan paling banyak sekitar empat field dan tidak berpindah halaman.
- **R-148** (UIX-08): Form dengan lebih dari sekitar empat field, atau yang tidak muat tanpa scroll, tidak boleh memakai pop-up. Buat kuitansi, buat atau lengkapi SPJ, Form Dinamis, dan Visual Live Editor tetap di halaman sendiri.
- **R-149** (UIX-08): Setiap konfirmasi aksi yang tidak dapat dibatalkan, termasuk pencabutan BKU, memakai pop-up konfirmasi. Menutup pop-up tanpa konfirmasi tidak mengubah data.
- **R-150** (UIX-08): Aksi yang dilakukan melalui pop-up tercatat di Jejak Audit sesuai aturan jejak untuk aksi tersebut, dengan aktor personel yang login.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.