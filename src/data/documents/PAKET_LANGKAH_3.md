# PAKET LANGKAH 3: TAHUN ANGGARAN & PENUGASAN

**Sumber kebenaran mutlak:** Dokumen 01 v1.52, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.37, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 3 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 3 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 37 | TA-01 | Siklus status TA manual | Admin | P0 | Frontend | FND-01, AUD-01 |
| 38 | TA-02 | Buat TA & Pagu Induk; hapus TA Draft | Admin | P0 | Frontend | TA-01 |
| 39 | TA-06 | Izin aksi per status TA (enforcement) | Semua | P0 | Frontend | TA-01, FND-02 |
| 40 | TA-07 | Buka kembali TA Arsip | Admin | P2 | Frontend | TA-01 |
| 41 | TA-04 | Snapshot seksi & pemetaan subkegiatan TA | Admin | P0 | Frontend | TA-02, MST-01, MST-05 |
| 42 | AKN-05 | Penugasan Pengawas per TA | Admin | P1 | Frontend | AKN-04, TA-02 |
| 43 | TA-03 | Salin Struktur terbatas dari TA sebelumnya | Admin | P2 | Frontend | TA-02 |
| 44 | PEN-01 | Penugasan PA/KPA, Bendahara, Verifikator, PPTK | Admin | P0 | Frontend | TA-04, MST-02 |
| 45 | PEN-04 | Pemisahan tugas Bendahara ≠ PPTK | Admin | P0 | Frontend | PEN-01 |
| 46 | TA-05 | Checklist kesiapan & aktivasi TA | Admin | P0 | Frontend | TA-04, PEN-01 |
| 47 | PEN-02 | Register SK & penugasan provisional | Admin | P1 | Frontend | PEN-01 |
| 48 | PEN-03 | Mutasi SOTK/pejabat dengan tanggal efektif | Admin | P1 | Frontend | PEN-01, AUD-01 |
| 49 | AKN-03 | Peringatan "akun NON-ACTIVE, penugasan masih aktif" | Admin | P2 | Frontend | AKN-02, PEN-01 |
| 50 | PEN-05 | Delegasi Plh./Plt.: penetapan | Admin | P1 | Frontend | PEN-01, PEN-04 |
| 51 | PEN-06 | Delegasi Plh./Plt.: pengakhiran | Admin, Sistem | P1 | Frontend | PEN-05, FND-03 |
| 52 | PEN-07 | Audit Event delegasi | Admin | P1 | Frontend | PEN-05, AUD-01 |
| 53 | PEN-08 | Snapshot penandatangan dokumen | Semua penandatangan | P1 | Frontend | PEN-05 |

## 2. Aturan kunci per fitur (ringkasan)
### TA-01 — Siklus status TA manual
- **Peran:** Admin
- **Aturan:** Draft → Aktif Penuh → Masa Transisi/Tutup Buku → Arsip Read-Only; semua perpindahan manual; tidak otomatis berdasar tanggal; peringatan SPJ/BKU belum selesai sebelum Arsip.
- **Rujukan:** D01 §1.3 poin 1, 5; D03 §2.3

### TA-02 — Buat TA & Pagu Induk; hapus TA Draft
- **Peran:** Admin
- **Aturan:** Mulai Draft; Draft tanpa transaksi boleh diedit/dihapus; TA yang pernah punya kuitansi tak dapat dihapus (penanda permanen pada data TA).
- **Rujukan:** D01 §1.3 poin 2; D03 §2.2 poin 1, 6; D04 §2.2, §6

### TA-06 — Izin aksi per status TA (enforcement)
- **Peran:** Semua
- **Aturan:** Tabel D02 §7: Aktif Penuh / Masa Transisi / Arsip; Masa Transisi menolak kuitansi & SPJ baru dan seluruh edit kuitansi (juga via pemanggilan langsung), pembatalan/ajuan/verifikasi/BKU/pencabutan tetap jalan.
- **Rujukan:** D02 §7; D01 §1.3 poin 1

### TA-07 — Buka kembali TA Arsip
- **Peran:** Admin
- **Aturan:** Manual; Arsip dibuka kembali menjadi Masa Transisi (boleh kembali Aktif Penuh bila tidak ada TA lain Aktif Penuh; mundur lain ditolak); retensi 12 tahun dihitung ulang dari tanggal arsip terbaru.
- **Rujukan:** D01 §1.3 poin 1, 6; D03 §2.3
- **Keputusan pemilik yang sudah masuk dokumen:**  Diputuskan (1 Nov 2026): Arsip dibuka kembali menjadi Masa Transisi; Masa Transisi boleh kembali Aktif Penuh bila tidak ada TA lain yang Aktif Penuh; perpindahan mundur lain tidak diizinkan.

### TA-04 — Snapshot seksi & pemetaan subkegiatan TA
- **Peran:** Admin
- **Aturan:** Seksi ditarik dari Master SOTK sebagai snapshot; satu subkegiatan hanya satu seksi per TA; seksi boleh banyak subkegiatan.
- **Rujukan:** D01 §1.1 poin 2; D03 §2.2 poin 3; D04 §2.2
- **Keputusan pemilik yang sudah masuk dokumen:** N-11: snapshot kode dan nama subkegiatan/rekening ikut disalin ke TA.

### AKN-05 — Penugasan Pengawas per TA
- **Peran:** Admin
- **Aturan:** Tanpa seksi; cakupan seluruh seksi pada TA yang ditugaskan; berakhir pada tanggal akhir akses.
- **Rujukan:** D01 §8 poin 4; D04 §2.2
- **Keputusan pemilik yang sudah masuk dokumen:** N-04: akses Pengawas hanya pada TA yang ditugaskan ("seluruh TA" = seluruh seksi pada TA yang ditugaskan).

### TA-03 — Salin Struktur terbatas dari TA sebelumnya
- **Peran:** Admin
- **Aturan:** Hanya seksi aktif akhir TA & pemetaan subkegiatan; pagu, SK, mutasi tidak disalin.
- **Rujukan:** D01 §1.3 poin 3; D03 §2.2 poin 2

### PEN-01 — Penugasan PA/KPA, Bendahara, Verifikator, PPTK
- **Peran:** Admin
- **Aturan:** Verifikator tingkat instansi; PPTK per seksi (satu personel boleh PPTK di >1 seksi pada TA sama); Pengawas tanpa seksi; riwayat penugasan tersimpan.
- **Rujukan:** D03 §2.2 poin 4; D04 §2.2
- **Keputusan pemilik yang sudah masuk dokumen:** N-10: penugasan dikelola melalui halaman Peta Jabatan.

### PEN-04 — Pemisahan tugas Bendahara ≠ PPTK
- **Peran:** Admin
- **Aturan:** Satu personel tidak boleh Bendahara sekaligus PPTK/Seksi pada TA sama, termasuk Plh./Plt.; ditolak di server.
- **Rujukan:** D01 §6 poin 1; D03 §1

### TA-05 — Checklist kesiapan & aktivasi TA
- **Peran:** Admin
- **Aturan:** Checklist: pagu induk, seluruh seksi terpetakan, PA/KPA, Bendahara, Verifikator, PPTK, SK/penugasan provisional; aktivasi hanya bila lengkap; tolak TA Aktif Penuh kedua.
- **Rujukan:** D01 §1.3 poin 4–5; D03 §2.2 poin 6

### PEN-02 — Register SK & penugasan provisional
- **Peran:** Admin
- **Aturan:** Nomor/tanggal/berkas SK; provisional dilengkapi kemudian; SK lama tetap dapat dibuka setelah penugasan berakhir.
- **Rujukan:** D03 §2.2 poin 5; D04 §2.2

### PEN-03 — Mutasi SOTK/pejabat dengan tanggal efektif
- **Peran:** Admin
- **Aturan:** Penugasan lama berakhir H-1 dari penugasan pengganti (tidak berlaku untuk delegasi); transaksi historis menunjuk pejabat/unit sesuai tanggal.
- **Rujukan:** D03 §2.3; D04 §6

### AKN-03 — Peringatan "akun NON-ACTIVE, penugasan masih aktif"
- **Peran:** Admin
- **Aturan:** Ditampilkan pada daftar penugasan.
- **Rujukan:** D03 §2.1 poin 3

### PEN-05 — Delegasi Plh./Plt.: penetapan
- **Peran:** Admin
- **Aturan:** Untuk Bendahara/PPTK/PA-KPA; tanggal mulai & berakhir wajib (kosong/mendahului ditolak); duplikasi peran sementara pada seksi sama; hak transaksi definitif nonaktif; penugasan definitif tetap; tolak peran bertentangan.
- **Rujukan:** D01 §6 poin 7–8; D03 §2.3; D04 §2.2

### PEN-06 — Delegasi Plh./Plt.: pengakhiran
- **Peran:** Admin, Sistem
- **Aturan:** Berakhir otomatis 23:59 WITA pada tanggal berakhir (hak definitif pulih); pencabutan dini wajib alasan tertulis & tercatat audit.
- **Rujukan:** D01 §6 poin 10; D04 §2.2

### PEN-07 — Audit Event delegasi
- **Peran:** Admin
- **Aturan:** Entri memuat definitive_officer_id, delegate_officer_id, keterangan Delegasi Aktif; penetapan, tanggal berlaku, pencabutan dini, pengakhiran otomatis (penanda otomatis).
- **Rujukan:** D04 §2.2

### PEN-08 — Snapshot penandatangan dokumen
- **Peran:** Semua penandatangan
- **Aturan:** Kuitansi: saat disimpan; SPJ & Hasil Verifikasi: saat diajukan ke Verifikator; keterangan "Plh./Plt." di bawah nama; cetak ulang tak berubah setelah delegasi berakhir.
- **Rujukan:** D01 §6 poin 11; D02 §2.1, §5, §8 poin 7; D04 §6

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 01 §1.3

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

#### Dokumen 03 §2.3

### 2.3 Perubahan selama TA
- Mencatat mutasi SOTK atau pejabat dengan tanggal efektif dan audit trail; penugasan lama berakhir sehari sebelum penugasan pengganti.
- Menetapkan penugasan Delegasi Aktif (Plh./Plt.) dengan tanggal mulai dan tanggal berakhir, serta mencabutnya lebih awal dengan alasan tertulis. Sistem menolak penunjukan jika personel memegang peran yang bertentangan pada TA tersebut (Dokumen 01 §6 poin 8).
- Mengaktifkan fase APBD-P dan menetapkan Pagu Induk perubahan. Pembagian ulang dilakukan melalui alur Bendahara lalu PPTK/Seksi, bukan dengan menghapus histori.
- Menetapkan status TA ke Masa Transisi/Tutup Buku lalu Arsip Read-Only pada akhir siklus. Seluruh perpindahan status dilakukan Admin secara manual; sistem tidak memindahkan status berdasarkan tanggal. Sebelum menetapkan Arsip Read-Only, sistem menampilkan SPJ atau BKU yang belum selesai sebagai peringatan; keputusan tetap di tangan Admin.
- Admin tidak membagi pagu ke subkegiatan/rekening, tidak mengelola efisiensi SPD atau pergeseran, dan tidak membuat kuitansi, SPJ, verifikasi, atau BKU.
- Membuka kembali TA Arsip Read-Only secara manual bila diperlukan; TA menjadi Masa Transisi / Tutup Buku, dan Admin dapat mengembalikannya ke Aktif Penuh selama tidak ada TA lain yang Aktif Penuh. Perpindahan mundur lain tidak diizinkan. Setiap kali TA diarsipkan kembali, masa retensi dihitung ulang dari tanggal arsip terbaru.
- Setelah TA Arsip Read-Only melewati 12 tahun sejak tanggal arsip terakhir (WITA), Admin dapat menghapus TA secara manual. Sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran tanpa nominal, lalu Admin mengetik kode TA untuk konfirmasi. Penghapusan total menghapus seluruh data TA, lampiran, dan jejak audit terkait, tanpa catatan penghapusan. Salinan cadangan platform mengikuti kebijakan platform.

#### Dokumen 03 §2.2

### 2.2 Membuat dan menyiapkan Workspace TA
1. Membuat TA, menetapkan Pagu Induk SKPD, dan memulai dengan status Draft.
2. Opsional menyalin hanya seksi aktif dan pemetaan subkegiatan dari TA sebelumnya. Pagu, SK dan mutasi tidak disalin.
3. Menarik seksi dari Master SOTK sebagai snapshot TA dan memetakan subkegiatan. Satu subkegiatan hanya dimiliki satu seksi pada TA yang sama; seksi boleh memiliki banyak subkegiatan.
4. Menetapkan PA/KPA, Bendahara, Verifikator tingkat instansi, dan PPTK untuk setiap seksi aktif. Satu personel sah dan diperbolehkan ditugaskan sebagai PPTK pada lebih dari satu seksi di TA yang sama jika diperlukan (misal karena keterbatasan pejabat). Pengawas/Auditor dapat ditugaskan ke TA tanpa seksi.
5. Mencatat SK; bila dokumen resmi terlambat, penugasan provisional dapat digunakan dan berkas/nomor SK dilengkapi kemudian.
6. Memeriksa konfigurasi sebelum mengaktifkan TA. Draft tanpa transaksi boleh dihapus; TA yang pernah memiliki kuitansi tidak boleh dihapus, meskipun kuitansinya sudah dihapus, kecuali melalui retensi 12 tahun (§2.3).
   - Sistem menolak aktivasi TA kedua selama masih ada satu TA berstatus Aktif Penuh.
   - Admin mengaktifkan TA secara manual. Sistem menampilkan checklist kesiapan (pagu induk, seluruh seksi terpetakan, penugasan PA/KPA, Bendahara, Verifikator, dan PPTK, serta SK atau penugasan provisional) dan hanya mengizinkan pengaktifan jika checklist lengkap. Checklist dihitung otomatis dari data dan tidak dapat dilewati.

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
| Ledger SPD | TA, rekening/alokasi, nilai SPD, perubahan, referensi | SPD otomatis 100% pagu yang disahkan; efisiensi/pergeseran berjejak |
| Kuitansi | TA, seksi, subkegiatan, rekening, penerima, bruto, uraian, tanggal kuitansi, status (Aktif atau Terkunci) | Satu kuitansi Aktif atau Terkunci mengikat komitmen SPD; kuitansi Terkunci sejak SPJ Draft dibuat dan tidak dapat diubah selama SPJ masih terkait; pada Masa Transisi seluruh data kuitansi Aktif tidak dapat diedit dan hanya pembatalan yang diizinkan; tidak ada status Dibatalkan, kuitansi yang dibatalkan langsung dihapus |
| Form Dinamis | Jenis belanja, versi, field (tipe, urutan, wajib/opsional, system tag), blok berulang (maksimal satu per form, berisi field) | Dibuat Admin per jenis belanja; setiap perubahan membentuk versi baru; SPJ menyimpan versi yang berlaku saat dibuat. Untuk perjalanan dinas mendukung tag `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, `[SYS_END_DATE]`; tag ID/nama berpasangan dalam konteks field/baris yang sama |
| SPJ | Kuitansi, jenis belanja (pilihan awal Seksi, menentukan form), versi form, jawaban (field tunggal dan entri blok berulang), daftar pajak (jenis pajak dari master dan nominal manual, banyak entri), lampiran PDF beserta nama asli, ukuran asal, ukuran final, dan status optimasi, status (Draft, Terkunci, Menunggu BKU, Dibukukan) | Relasi 1:1 dengan kuitansi; form snapshot saat dibuat; Total Pajak tidak boleh melebihi bruto kuitansi terkait (penyimpanan entri pajak ditolak); isian rincian bersifat informasional murni tanpa validasi matematis terhadap nominal bruto kuitansi; SPJ Terkunci sejak dikirim ke Verifikator; kuitansi terkait ikut Terkunci sejak SPJ Draft dibuat |
| Token Verifikasi SPJ | SPJ, token acak untuk barcode, nomor verifikasi (teks cetak, dibuat otomatis, urut dan tidak dipakai ulang per TA, tidak sama dengan token), waktu verifikasi, status (Berlaku atau Tidak berlaku) | Dibuat saat Verifikator menyetujui SPJ, bersama token dan nomor verifikasi; menjadi Tidak berlaku saat SPJ dikembalikan menjadi Draft (pencabutan BKU saja tidak mengubah status); token dan nomor verifikasi baru dibuat saat verifikasi ulang; halaman keaslian publik tidak menampilkan nominal atau identitas |
| Format Nomor Verifikasi | Per TA: awalan, pemisah, pola tahun, jumlah digit urut | Diatur Admin; perubahan format tidak mengubah nomor yang sudah tercetak |
| Direktori Transaksional SPJ | Kunci identitas NIP/NIK yang dimasukkan, nama pasangan, referensi sumber/pembaruan seperlunya | Terpisah dari Master Personel; mencakup pegawai organik, honorer, narasumber, dan pihak luar tanpa kategori wajib; dipakai untuk lookup dan auto-fill; tetap dipertahankan saat SPJ dibatalkan/dihapus; Admin dapat mengoreksi dan merge duplikat dengan menjaga referensi SPJ historis |
| Rentang Penugasan SPJ | TA, SPJ, identitas NIP/NIK, tanggal mulai efektif, tanggal selesai efektif | Diperoleh dari field bertag pada Form Dinamis/snapshot jawaban; bukan komitmen terpisah. Validasi overlap hanya pada pengajuan ke Verifikator, dalam TA yang sama, terhadap status SPJ Terkunci/Menunggu BKU/Dibukukan |
| BKU | Kuitansi/SPJ terkait, nomor BKU (input manual), tanggal BKU, status | Menandai realisasi pengeluaran kas belanja (tidak mencatat penerimaan kas/SP2D); satu BKU per kuitansi; nomor diinput manual oleh Bendahara & unik per TA; penanggalan bebas tanpa batasan kronologis; koreksi No. BKU/tanggal tanpa pembatalan jika nominal tidak berubah; nomor BKU yang dicabut bebas digunakan kembali; pencabutan BKU |
| Audit Event | Waktu, aktor (ID akun, snapshot nama, NIP/NIK, peran saat aksi), entitas, aksi, nilai sebelum/sesudah, alasan | Merekam perubahan signifikan, pencabutan dan koreksi BKU, serta perubahan status akun. Peristiwa yang juga dicatat: pengesahan ("Sahkan"), perubahan alokasi setelah pengesahan atau APBD-P, verifikasi SPJ disetujui atau dikembalikan, dan pencatatan BKU. Login dan logout tidak dicatat. Pembatalan kuitansi atau SPJ Draft tidak dicatat; entri yang terkait kuitansi atau SPJ tersebut ikut terhapus otomatis oleh sistem dan tidak dapat dihapus manual. Penghapusan TA setelah retensi tidak dicatat, dan seluruh entri audit TA tersebut ikut terhapus. Aktor selalu personel nyata; Admin dapat membaca seluruh entri termasuk nominal. Pada aksi Delegasi Plh./Plt., entri memuat `definitive_officer_id` (ID pejabat definitif), `delegate_officer_id` (ID pejabat penerima delegasi), dan keterangan status Delegasi Aktif. Penetapan, tanggal berlaku, pencabutan dini, dan pengakhiran otomatis wajib tercatat; pengakhiran otomatis diberi penanda otomatis. |

#### Dokumen 02 §7

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

#### Dokumen 02 §2.1

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

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **A-9c** (AKN-03): Daftar penugasan menampilkan peringatan "akun NON-ACTIVE, penugasan masih aktif" untuk penugasan yang akunnya nonaktif.
- **B-6** (TA-02): TA Draft tanpa transaksi dapat dihapus; TA yang pernah memiliki kuitansi, termasuk yang kuitansinya sudah dihapus, tidak dapat dihapus kecuali melalui retensi 12 tahun (skenario 66–70).
- **B-7** (TA-03): Salin struktur hanya mengambil seksi aktif dan mapping akhir TA sebelumnya; tidak mengambil pagu, SK atau mutasi.
- **B-8** (TA-04): Perubahan Master SOTK tidak mengubah snapshot dan transaksi TA lama.
- **B-9** (PEN-01, PEN-03): Unit/pejabat pengganti mulai tanggal D; data lama berakhir D-1 dan transaksi historis tetap menampilkan pejabat/unit yang sesuai tanggal.
- **B-10** (PEN-02): SK provisional dapat dilengkapi kemudian; SK lama tetap bisa dibuka setelah penugasan berakhir.
- **B-10a** (TA-05): Sistem menolak aktivasi TA kedua selama masih ada satu TA berstatus Aktif Penuh.
- **B-10b** (TA-01, TA-05): Sistem tidak mengubah status TA berdasarkan tanggal. Pengaktifan TA dilakukan Admin dan ditolak jika checklist kesiapan belum lengkap. Checklist dihitung otomatis dari kondisi data, tidak dicentang manual, dan tidak dapat dilewati Admin.
- **B-10c** (TA-06): Pada status Masa Transisi, sistem menolak pembuatan kuitansi dan SPJ baru, serta seluruh edit data kuitansi (nominal, uraian, penerima, tanggal), termasuk melalui pemanggilan langsung. Pembatalan kuitansi Aktif, pengajuan dan verifikasi SPJ, pencatatan BKU, serta pencabutan BKU tetap berjalan.
- **B-10e** (PEN-05): Admin dapat menetapkan penugasan Delegasi Aktif (Plh./Plt.) bagi Bendahara, PPTK, atau PA/KPA dengan tanggal mulai dan tanggal berakhir; tanggal berakhir kosong atau mendahului tanggal mulai ditolak.
- **B-10f** (PEN-05): Selama rentang delegasi, sistem mengizinkan duplikasi peran sementara pada seksi yang sama dan menonaktifkan hak transaksi pejabat definitif; penugasan definitif tetap tercatat.
- **B-10g** (PEN-04, PEN-05): Penunjukan Plh./Plt. ditolak jika personel memegang peran yang bertentangan pada TA yang sama (misalnya Bendahara Pengeluaran yang ditunjuk sebagai Plh. PPTK), dengan pesan yang jelas.
- **B-10h** (PEN-06): Delegasi Aktif berakhir otomatis pada 23:59 WITA tanggal berakhir; hak transaksi pejabat definitif pulih dan hak Plh./Plt. nonaktif tanpa intervensi Admin.
- **B-10i** (PEN-06): Admin dapat mencabut delegasi lebih awal hanya dengan alasan tertulis; pencabutan tanpa alasan ditolak.
- **B-10j** (PEN-07): Entri Audit Event delegasi (penetapan, tanggal berlaku, pencabutan dini, dan pengakhiran otomatis) memuat `definitive_officer_id`, `delegate_officer_id`, dan keterangan status Delegasi Aktif.
- **C-14** (TA-04): Satu subkegiatan tidak dapat dipetakan ke dua seksi dalam TA yang sama.
- **D-23b** (PEN-04): Penugasan yang membuat satu personel menjadi Bendahara sekaligus PPTK/Seksi pada TA yang sama ditolak sistem.
- **F-33d** (PEN-08): Nama dan NIP pejabat pada kuitansi dan Hasil Verifikasi SPJ diambil dari penugasan yang berlaku saat kuitansi disimpan atau SPJ diajukan ke Verifikator. SPJ yang diajukan sebelum delegasi lalu diverifikasi saat delegasi berjalan tetap atas nama pejabat definitif.
- **F-33e** (PEN-08): Cetak ulang dokumen setelah delegasi Plh./Plt. berakhir memakai snapshot penandatangan asli dan tidak berubah.
- **H-47** (AKN-05): Penugasan Pengawas dibuat per TA tanpa seksi dan mencakup seluruh seksi pada TA yang ditugaskan. Pengawas tidak dapat membuka TA yang tidak ditugaskan, termasuk melalui URL langsung.
- **J-66** (TA-07): TA Arsip Read-Only dapat dibuka kembali oleh Admin secara manual dan menjadi Masa Transisi. TA Masa Transisi dapat dikembalikan menjadi Aktif Penuh hanya bila tidak ada TA lain yang Aktif Penuh; perpindahan mundur lain ditolak di server; saat diarsipkan kembali, masa retensi dihitung ulang dari tanggal arsip terbaru.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.