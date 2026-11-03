# SUSUNAN PENGEMBANGAN AMANDA: FRONTEND DAN BACKEND BERTAHAP

**Sumber kebenaran mutlak:** Dokumen 01 Aturan Bisnis & Anggaran v1.53, Dokumen 02 Standar Kuitansi & SPJ v1.33, Dokumen 03 Workflow Operasional v1.58, Dokumen 04 Kamus Data & Skema v1.38, Dokumen 05 RBAC & Skenario Pengujian v1.64.  
**Pendamping:** `AMANDA_Matriks_Pengembangan_Bertahap.xlsx` (131 fitur, 251 skenario uji, seluruhnya terhubung).  
**Tanggal:** 2 November 2026

## 1. Prinsip penyusunan
- **Tidak ada aturan bisnis yang dirancang ulang.** Setiap butir hanya merujuk fitur dan aturan yang sudah tertulis di dokumen. Teks aturan lengkap ada di kolom "Aturan Kunci" pada matriks.
- **Skala prioritas:** P0 = fondasi, keamanan, atau pemblokir; P1 = inti operasional; P2 = pendukung dan analitik. Urutan dalam satu langkah mengikuti ketergantungan antar-aturan dokumen, lalu prioritas. Prioritas dan urutan adalah usulan kerja, bukan isi dokumen.
- **Alur bertahap** (saran yang Anda setujui), lihat bagian 2.

## 2. Alur kerja tiga tahap
| Tahap | Pekerjaan | Mulai setelah |
|---|---|---|
| A | **Frontend Langkah 1–4.** Antarmuka dan alur Langkah 1–4 dengan data contoh. Akses data dikumpulkan di satu lapisan yang bentuknya mengikuti Dokumen 04, agar mudah diganti dengan backend. | — |
| B | **Backend Langkah 1–4, bersamaan dengan Frontend Langkah 5–9.** Backend untuk autentikasi dan sesi, Jejak Audit, master data, siklus TA, penugasan, alokasi, Sahkan dan SPD (FND-02, FND-05, FND-06 dan penegakan server lain pada Langkah 1–4). Frontend Langkah 5–9 berjalan paralel. | Tahap A selesai |
| C | **Backend Langkah 5–9, menyusul frontend masing-masing.** Backend untuk template, kuitansi, SPJ, verifikasi, BKU, laporan, analitik, portal publik, dan retensi (termasuk PUB-06 dan SPJ-07). | Frontend langkah terkait selesai |

**Sebuah langkah dinyatakan selesai bila frontend dan backend-nya sama-sama lulus skenario D05 langkah tersebut (kolom "Skenario selesai"). Kriteria kelulusan minimum D05 §4 berlaku untuk keseluruhan.**

## 3. Hasil analisis dokumen: pegangan yang tidak boleh berubah
| No | Aturan inti | Sumber |
|---|---|---|
| 1 | Master global dan Workspace TA terpisah; TA menyimpan snapshot seksi, pemetaan, kode dan nama subkegiatan/rekening, formasi pejabat. | D01 §1.1; D04 §6, §7 |
| 2 | Pagu berjenjang: Admin menetapkan Pagu Induk, Bendahara membagi ke subkegiatan (selisih tepat Rp 0), PPTK membagi ke rekening belanja. Pagu seksi otomatis, tidak boleh diinput. | D01 §2.1 |
| 3 | Gatekeeper tanggung renteng: "+ Buat Kuitansi" dan "+ Buat SPJ" aktif hanya bila semua seksi Seimbang dan Bendahara telah "Sahkan"; pemrosesan SPJ yang ada, verifikasi, dan BKU tetap berjalan. | D01 §3.2, §4.1; D02 §4; D05 C-17b |
| 4 | SPD terbit 100% pagu saat "Sahkan"; Sisa SPD Bebas = SPD aktif − Komitmen Kuitansi Aktif − Realisasi BKU; efisiensi hanya menurunkan SPD dan boleh dinaikkan kembali sampai pagu; pergeseran memindahkan SPD bersama pagu; APBD-P memakai Sahkan ulang. | D01 §4, §5; D05 D, E |
| 5 | Kuitansi (Aktif atau Terkunci) dan SPJ (Draft, Terkunci, Menunggu BKU, Dibukukan) adalah dua proses berbeda, relasi 1:1; pembatalan kuitansi atau SPJ Draft tanpa jejak sama sekali. | D02 §1, §4–§6 |
| 6 | BKU: No. BKU manual dan unik per TA, penanggalan bebas, murni pengeluaran; koreksi tanpa pencabutan; pencabutan berjenjang; pencabutan BKU saja tidak membatalkan keaslian. | D02 §4, §6, §8; D05 F-33, Q-133 |
| 7 | Form Dinamis per jenis belanja dikelola Admin, versi berubah setiap perubahan, paling banyak satu blok berulang; tag `[SYS_*]` untuk bentrok jadwal, divalidasi saat "Ajukan ke Verifikator". | D01 §9, §11; D04 §2.2, §2.4 |
| 8 | Larangan verifikasi mandiri; Bendahara tidak merangkap PPTK; delegasi Plh./Plt. dengan snapshot penandatangan. | D01 §6 |
| 9 | RBAC ketat dan server-side: Admin tanpa angka keuangan selain Pagu Induk dan Jejak Audit; PA/KPA drill-down sampai subkegiatan; Pengawas hanya laporan dan Jejak Audit pada TA yang ditugaskan; analitik khusus PA/KPA. | D01 §6–§8, §12; D05 §2 |
| 10 | Portal publik hanya persentase dan cacah, tanpa nominal; halaman keaslian hanya status, nama TA, nama seksi, tanggal verifikasi. | D01 §10; D02 §8 |
| 11 | Istilah dibedakan: Serapan = (Realisasi + Komitmen) ÷ Pagu; Realisasi (%) = Realisasi BKU ÷ Pagu (laporan); Burn-Rate = Realisasi BKU ÷ Pagu Sah Terakhir (analitik). | D04 §9 |
| 12 | Siklus TA manual: Draft, Aktif Penuh, Masa Transisi, Arsip Read-Only; satu Aktif Penuh; Arsip dibuka kembali menjadi Masa Transisi; retensi 12 tahun; checklist kesiapan dihitung otomatis tanpa pengecualian. | D01 §1.3; D03 §2.2–§2.3 |
| 13 | Login satu kolom; 10 kali gagal mengunci akun kecuali Admin; reset password Admin melalui backend; auto logout 1 jam tanpa aktivitas; sesi terikat satu TA dan satu peran. | D03 §1; D04 §3 |
| 14 | Nominal bilangan bulat rupiah tanpa sen; WITA untuk semua tanggal dan jam; kode disimpan sebagai teks. | D04 §4 |
| 15 | Tema Treasury & Market Terminal, Pro Mode dan Mode Standar, kontras WCAG AA, status wajib teks atau ikon; aturan pop-up dan halaman sendiri. | D03 §1; D01 §15 |

## 4. Ringkasan langkah
| Langkah | Nama | Fitur | P0 | P1 | P2 | Frontend | Backend |
|---|---|---|---|---|---|---|---|
| 1 | Fondasi UI, Autentikasi & Sesi | 19 | 14 | 5 | 0 | Tahap A | Tahap B |
| 2 | Master Data & Akun | 17 | 1 | 15 | 1 | Tahap A | Tahap B |
| 3 | Tahun Anggaran & Penugasan | 17 | 7 | 7 | 3 | Tahap A | Tahap B |
| 4 | Anggaran, SPD & Gatekeeper | 20 | 9 | 11 | 0 | Tahap A | Tahap B |
| 5 | Template, Kuitansi & SPJ | 22 | 9 | 12 | 1 | Tahap B | Tahap C |
| 6 | Verifikasi & BKU | 12 | 6 | 6 | 0 | Tahap B | Tahap C |
| 7 | Pelaporan | 8 | 1 | 7 | 0 | Tahap B | Tahap C |
| 8 | Analitik PA/KPA, Portal Publik & Pengawas | 15 | 1 | 8 | 6 | Tahap B | Tahap C |
| 9 | Retensi & Penutup | 1 | 0 | 0 | 1 | Tahap B | Tahap C |
| | **Total** | **131** | **48** | **71** | **12** | | |

## 5. Langkah pengembangan
### Langkah 1: Fondasi UI, Autentikasi & Sesi
**Tujuan:** Tema & layout, login satu field, alur masuk berjenjang, sesi tunggal, Jejak Audit dasar, utilitas WITA dan nominal.  
**Prasyarat:** —  
**Frontend:** Tahap A. **Backend:** Tahap B.  
**Selesai bila skenario D05 lulus (frontend dan backend):** P:117–123, 123a–123d; S:151 (token tema)

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 1 | FND-01 | Isolasi data Master Global vs Workspace TA (snapshot operasional) | Semua | P0 | Ya | Ya | — | D01 §1.1; D03 §1; D04 §2.1–2.2, §6 | — |
| 2 | FND-03 | Zona waktu WITA (UTC+8) untuk jendela input, tanggal arsip, dan semua tanggal/jam tampil | Semua | P0 | Ya | — | — | D04 §4; D01 §3.1 | — |
| 3 | FND-04 | Representasi nominal & kode | Semua | P0 | Ya | — | — | D04 §4; D03 §1; D01 §7 poin 6 | — |
| 4 | UIX-01 | Token Tema Treasury & Market Terminal | Semua | P0 | Ya | — | — | D03 §1 | — |
| 5 | AUD-01 | Audit Event: pencatatan aktor, entitas, aksi, nilai sebelum/sesudah, alasan | Semua | P0 | Ya | Ya | — | D04 §2.2, §6; D01 §6 poin 6 | FND-01 |
| 6 | FND-02 | Penegakan otorisasi di server (RBAC) pada seluruh endpoint & data, termasuk pemanggilan langsung/ubah URL | Semua | P0 | — | Ya | Ya | D05 §1, §2, §4; D01 §7 poin 8 | FND-01 |
| 7 | FND-05 | Transaksi atomik lintas ledger (SPD, komitmen, realisasi) & integritas saldo | Semua | P0 | — | Ya | Ya | D04 §5.2, §7; D03 §10 poin 5 | FND-01 |
| 8 | FND-06 | Pembatasan akses baris per TA/seksi pada lapisan data | Semua | P0 | — | Ya | Ya | D04 §7, §3; D01 §7 poin 8 | FND-01 |
| 9 | UIX-02 | Halaman login Split-Hero responsif | Semua | P1 | Ya | — | — | D03 §1 | UIX-01 |
| 10 | UIX-04 | Pro Mode vs Mode Standar | Semua | P1 | Ya | — | — | D03 §1 | UIX-01 |
| 11 | UIX-05 | Aksesibilitas & keterbacaan | Semua | P1 | Ya | — | — | D03 §1, §9 poin 9 | UIX-01 |
| 12 | AUD-02 | Aturan penghapusan jejak | Sistem | P0 | Ya | Ya | — | D01 §6 poin 6; D02 §6 poin 3; D04 §2.2 | AUD-01 |
| 13 | AUT-01 | Login single-field identifier (NIP/NIK/Email Auditor) | Semua | P0 | Ya | Ya | — | D03 §1; D04 §3 | FND-02 |
| 14 | AUT-02 | Alur masuk berjenjang & auto-skip | Semua | P0 | Ya | Ya | — | D03 §1; D01 §6 poin 7 | AUT-01 |
| 15 | AUT-03 | Sesi tunggal terisolasi (active_ta_id, active_role, active_seksi_id) | Semua | P0 | Ya | Ya | — | D03 §1; D04 §3 | AUT-01 |
| 16 | AUT-06 | Pesan galat login & bantuan | Semua | P1 | Ya | — | — | D03 §1 | AUT-01 |
| 17 | AUT-04 | Logout menghancurkan sesi & login ulang menghasilkan jejak baru | Semua | P0 | Ya | Ya | — | D03 §1; D04 §3 | AUT-03, AUD-01 |
| 18 | UIX-03 | Layout dasbor: sidebar + topbar (Pengawas: menu atas) | Semua | P0 | Ya | — | — | D03 §1; D01 §3.3 | UIX-01, AUT-03 |
| 19 | AUT-08 | Auto logout setelah 1 jam tanpa aktivitas (keputusan pemilik N-13) | Semua | P1 | Ya | Ya | — | D03 §1; D04 §3 | AUT-03 |

### Langkah 2: Master Data & Akun
**Tujuan:** Master SOTK, Personel, Subkegiatan, Rekening, Jenis Pajak; akun login dan akun Pengawas; Direktori Transaksional (panel Admin); pencarian dan filter; Jejak Audit baca.  
**Prasyarat:** Langkah 1  
**Frontend:** Tahap A. **Backend:** Tahap B.  
**Selesai bila skenario D05 lulus (frontend dan backend):** A, H:44–49, M:87–88, R

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 20 | AKN-04 | Akun Pengawas/Auditor terpisah dari personel | Admin | P1 | Ya | Ya | — | D01 §8; D03 §2.1 poin 3a; D04 §2.1, §3 | AUD-01 |
| 21 | AUD-03 | Hak baca Jejak Audit per peran | Admin, Bendahara, PPTK, Verifikator, Pengawas | P1 | Ya | Ya | — | D05 §2 baris Jejak audit; D01 §6 poin 3, 5, 6; D01 §15 | AUD-01 |
| 22 | AUD-04 | Audit aksi Pengawas/Auditor | Pengawas | P1 | Ya | Ya | — | D01 §8 poin 8, §9 poin 5; D04 §6 | AUD-01 |
| 23 | BNT-01 | Direktori Transaksional SPJ: panel kelola | Admin | P1 | Ya | Ya | — | D03 §2.1 poin 6a; D04 §2.4; D01 §11 poin 8 | AUD-01 |
| 24 | DSB-01 | Dasbor Administrasi Global | Admin | P1 | Ya | Ya | — | D03 §1, §2.1 poin 6; D01 §6 poin 2–3 | AUT-02 |
| 25 | MST-01 | Master SOTK flat berversi | Admin | P1 | Ya | Ya | — | D01 §1.2; D03 §2.1 poin 1; D04 §2.1 | FND-01, AUD-01 |
| 26 | MST-02 | Master Personel: identitas & atribut wajib | Admin | P1 | Ya | Ya | — | D03 §2.1 poin 2; D04 §3 | FND-01 |
| 27 | MST-05 | Master Subkegiatan & Master Rekening Belanja | Admin | P1 | Ya | Ya | — | D01 §1.1; D03 §2.1 poin 4; D04 §2.1 | FND-04 |
| 28 | MST-06 | Master Jenis Pajak | Admin | P1 | Ya | Ya | Ya | D04 §2.1; D03 §2.1 poin 4; D01 §15 poin 2 | FND-02 |
| 29 | UIX-07 | Pencarian & filter pada daftar yang ditetapkan | Semua | P1 | Ya | Ya | — | D01 §15 poin 1–5 | FND-02 |
| 30 | UIX-08 | Aturan pop-up vs halaman sendiri | Semua | P1 | Ya | — | — | D01 §15 poin 6–8 | UIX-03 |
| 31 | AKN-01 | Dialog Kelola Akun personel | Admin | P0 | Ya | Ya | — | D03 §2.1 poin 3; D04 §3 | MST-02 |
| 32 | MST-03 | Histori pangkat & gelar berversi | Admin | P1 | Ya | Ya | — | D03 §2.1 poin 2; D04 §3 | MST-02 |
| 33 | MST-04 | Halaman Manajemen Personel | Admin | P2 | Ya | Ya | — | D03 §2.1 poin 2 | MST-02 |
| 34 | AKN-02 | Penonaktifan akun | Admin | P1 | Ya | Ya | — | D03 §2.1 poin 3; D04 §3 | AKN-01, AUD-01 |
| 35 | AUT-05 | Penolakan login akun NON-ACTIVE / Pengawas lewat tanggal akhir akses | Semua | P1 | Ya | Ya | — | D01 §8 poin 5–6; D03 §2.1 poin 3, 7 | AKN-01, AKN-04 |
| 36 | AUT-07 | Pembatasan percobaan login (keputusan pemilik N-13) | Semua kecuali Admin | P1 | Ya | Ya | — | D03 §1; D04 §3 | AUT-01, AKN-01 |

**Catatan urutan:**
- **AUT-07:** dipindah dari fase F0 ke langkah ini karena ketergantungan.

### Langkah 3: Tahun Anggaran & Penugasan
**Tujuan:** Siklus TA, snapshot seksi dan pemetaan, checklist aktivasi, penugasan (Peta Jabatan), SK, delegasi Plh./Plt., snapshot penandatangan.  
**Prasyarat:** Langkah 2  
**Frontend:** Tahap A. **Backend:** Tahap B.  
**Selesai bila skenario D05 lulus (frontend dan backend):** B, J:66, A:9c, H:47

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 37 | TA-01 | Siklus status TA manual | Admin | P0 | Ya | Ya | — | D01 §1.3 poin 1, 5; D03 §2.3 | FND-01, AUD-01 |
| 38 | TA-02 | Buat TA & Pagu Induk; hapus TA Draft | Admin | P0 | Ya | Ya | — | D01 §1.3 poin 2; D03 §2.2 poin 1, 6; D04 §2.2, §6 | TA-01 |
| 39 | TA-06 | Izin aksi per status TA (enforcement) | Semua | P0 | Ya | Ya | — | D02 §7; D01 §1.3 poin 1 | TA-01, FND-02 |
| 40 | TA-07 | Buka kembali TA Arsip | Admin | P2 | Ya | Ya | — | D01 §1.3 poin 1, 6; D03 §2.3 | TA-01 |
| 41 | TA-04 | Snapshot seksi & pemetaan subkegiatan TA | Admin | P0 | Ya | Ya | — | D01 §1.1 poin 2; D03 §2.2 poin 3; D04 §2.2 | TA-02, MST-01, MST-05 |
| 42 | AKN-05 | Penugasan Pengawas per TA | Admin | P1 | Ya | Ya | — | D01 §8 poin 4; D04 §2.2 | AKN-04, TA-02 |
| 43 | TA-03 | Salin Struktur terbatas dari TA sebelumnya | Admin | P2 | Ya | Ya | — | D01 §1.3 poin 3; D03 §2.2 poin 2 | TA-02 |
| 44 | PEN-01 | Penugasan PA/KPA, Bendahara, Verifikator, PPTK | Admin | P0 | Ya | Ya | — | D03 §2.2 poin 4; D04 §2.2 | TA-04, MST-02 |
| 45 | PEN-04 | Pemisahan tugas Bendahara ≠ PPTK | Admin | P0 | Ya | Ya | Ya | D01 §6 poin 1; D03 §1 | PEN-01 |
| 46 | TA-05 | Checklist kesiapan & aktivasi TA | Admin | P0 | Ya | Ya | — | D01 §1.3 poin 4–5; D03 §2.2 poin 6 | TA-04, PEN-01 |
| 47 | PEN-02 | Register SK & penugasan provisional | Admin | P1 | Ya | Ya | — | D03 §2.2 poin 5; D04 §2.2 | PEN-01 |
| 48 | PEN-03 | Mutasi SOTK/pejabat dengan tanggal efektif | Admin | P1 | Ya | Ya | — | D03 §2.3; D04 §6 | PEN-01, AUD-01 |
| 49 | AKN-03 | Peringatan "akun NON-ACTIVE, penugasan masih aktif" | Admin | P2 | Ya | Ya | — | D03 §2.1 poin 3 | AKN-02, PEN-01 |
| 50 | PEN-05 | Delegasi Plh./Plt.: penetapan | Admin | P1 | Ya | Ya | — | D01 §6 poin 7–8; D03 §2.3; D04 §2.2 | PEN-01, PEN-04 |
| 51 | PEN-06 | Delegasi Plh./Plt.: pengakhiran | Admin, Sistem | P1 | Ya | Ya | — | D01 §6 poin 10; D04 §2.2 | PEN-05, FND-03 |
| 52 | PEN-07 | Audit Event delegasi | Admin | P1 | Ya | Ya | — | D04 §2.2 | PEN-05, AUD-01 |
| 53 | PEN-08 | Snapshot penandatangan dokumen | Semua penandatangan | P1 | Ya | Ya | — | D01 §6 poin 11; D02 §2.1, §5, §8 poin 7; D04 §6 | PEN-05 |

### Langkah 4: Anggaran, SPD & Gatekeeper
**Tujuan:** Alokasi berjenjang, jendela waktu, gatekeeper, Sahkan dan SPD, efisiensi, pergeseran, APBD-P, drill-down, topbar, dasbor Bendahara dan PPTK.  
**Prasyarat:** Langkah 3  
**Frontend:** Tahap A. **Backend:** Tahap B.  
**Selesai bila skenario D05 lulus (frontend dan backend):** C, D, E, G

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 54 | ALK-01 | Alokasi Pagu Induk ke Subkegiatan | Bendahara | P0 | Ya | Ya | — | D01 §2.1 poin 2; D03 §3 poin 1 | TA-05 |
| 55 | SPD-01 | Ledger SPD & Sisa SPD Bebas | Sistem | P0 | Ya | Ya | — | D01 §4.2; D04 §5.2, §9; D02 §4 poin 3, 7 | FND-05 |
| 56 | ALK-02 | Pagu Seksi otomatis | Sistem | P0 | Ya | Ya | — | D01 §2.1 poin 3 | ALK-01 |
| 57 | ALK-03 | Alokasi rekening belanja per subkegiatan | PPTK | P0 | Ya | Ya | — | D01 §2.1 poin 4; D03 §4 poin 2; D04 §2.2 | ALK-01, MST-05 |
| 58 | ALK-07 | Versi Alokasi Anggaran append-only | Sistem | P0 | Ya | Ya | — | D04 §2.2, §5.3 | ALK-01 |
| 59 | SPD-02 | Efisiensi anggaran (turunkan SPD) | Bendahara | P1 | Ya | Ya | — | D01 §4.2; D03 §3 poin 4 | SPD-01, AUD-01 |
| 60 | UIX-06 | Topbar mini progress bar per peran | Semua kecuali Pengawas | P1 | Ya | Ya | — | D01 §3.3; D05 §2 | UIX-03, SPD-01 |
| 61 | ALK-04 | Jendela waktu alokasi & pemantauan kesiapan | Bendahara | P0 | Ya | Ya | — | D01 §3.1; D03 §3 poin 2–3 | ALK-03, FND-03 |
| 62 | ALK-05 | Gatekeeper global (tanggung renteng) | PPTK, Bendahara | P0 | Ya | Ya | — | D01 §3.2; D02 §4 poin 1 | ALK-03 |
| 63 | DRL-01 | Drill-down anggaran Seksi → Subkegiatan → Rekening | Bendahara, Verifikator, PA/KPA, PPTK | P1 | Ya | Ya | — | D01 §7 poin 1–3, 6, 9 | ALK-03, SPD-01 |
| 64 | DSB-03 | Dasbor PPTK | PPTK | P1 | Ya | Ya | — | D03 §1, §14; D01 §3.3, §12 poin 4 | ALK-03 |
| 65 | SPD-03 | Pergeseran anggaran | Bendahara | P1 | Ya | Ya | — | D01 §5.1; D03 §3 poin 5 | SPD-01, ALK-07 |
| 66 | TA-09 | Aktivasi APBD-P & Pagu Induk perubahan | Admin | P1 | Ya | Ya | — | D01 §5.2 poin 1–2; D03 §2.3 | TA-01, ALK-07 |
| 67 | ALK-06 | Tombol "Sahkan" & penerbitan SPD | Bendahara | P0 | Ya | Ya | — | D01 §4.1; D03 §3 poin 8 | ALK-05, SPD-01 |
| 68 | DRL-02 | Cakupan drill-down per peran (server) | Semua | P0 | Ya | Ya | Ya | D01 §7 poin 5, 8; D03 §3 poin 10, §4 poin 8, §6 | DRL-01, FND-02 |
| 69 | DRL-03 | Drill-down snapshot pada Masa Transisi/Arsip | Semua | P1 | Ya | Ya | — | D01 §7 poin 7 | DRL-01, FND-01 |
| 70 | DRL-04 | Kartu Pagu Induk TA | Admin, Bendahara, Verifikator, PA/KPA | P1 | Ya | Ya | — | D01 §6 poin 3, 5; §7 poin 4; D05 §2 | DRL-01 |
| 71 | DSB-02 | Dasbor Bendahara (Pro Mode) | Bendahara | P1 | Ya | Ya | — | D01 §3.1 poin 3; D03 §1, §14 | ALK-04 |
| 72 | SPD-04 | APBD-P: alokasi ulang & proteksi realisasi | Bendahara, PPTK | P1 | Ya | Ya | — | D01 §5.2 poin 2–4; D03 §3 poin 6; D04 §5.3 | TA-09, ALK-07 |
| 73 | UIX-09 | Widget countdown & banner merah gatekeeper | Semua kecuali Pengawas | P1 | Ya | Ya | — | D01 §3.1–3.2 | ALK-04, ALK-05 |

**Catatan urutan:**
- **UIX-06:** dipindah dari fase F2 ke langkah ini karena ketergantungan.

### Langkah 5: Template, Kuitansi & SPJ
**Tujuan:** Visual Live Editor, Form Builder dan Pratinjau, kuitansi, SPJ, Form Dinamis, pajak, Split View rekening, bentrok jadwal, lampiran PDF.  
**Prasyarat:** Langkah 4  
**Frontend:** Tahap B. **Backend:** Tahap C.  
**Selesai bila skenario D05 lulus (frontend dan backend):** F:27–43, I, K:71–74b, M, O; F:41 (uji visual kompresi)

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 74 | KUI-01 | Buat/ubah kuitansi (halaman sendiri) | PPTK | P0 | Ya | Ya | — | D02 §3, §4 poin 1–2; D03 §4 poin 4 | ALK-05, ALK-06, TA-06 |
| 75 | TPL-02 | Form Builder (jenis belanja, versi, field) | Admin | P0 | Ya | Ya | — | D01 §9 poin 8–9; D04 §2.2; D02 §5 | FND-02 |
| 76 | TPL-01 | Visual Live Editor template kuitansi | Admin | P1 | Ya | Ya | — | D02 §2.3; D01 §15 poin 7 | FND-02 |
| 77 | KUI-02 | Status kuitansi Aktif/Terkunci & komitmen SPD | PPTK | P0 | Ya | Ya | — | D02 §4 poin 3–4, §7; D03 §4 poin 5; D04 §2.2 | KUI-01, SPD-01, AUD-02 |
| 78 | BNT-02 | Tag sistem Form Dinamis perjalanan dinas | Admin | P1 | Ya | Ya | — | D01 §11 poin 2; D03 §10 poin 1; D04 §2.4 | TPL-02 |
| 79 | KUI-03 | Cetak kuitansi universal F4 dibagi dua | PPTK | P1 | Ya | Ya | — | D02 §2.1–2.2 | TPL-01, PEN-08 |
| 80 | SPJ-01 | Buat SPJ 1:1 & pilih jenis belanja | PPTK | P0 | Ya | Ya | — | D02 §5; D01 §9 poin 4 | KUI-02, TPL-02 |
| 81 | BNT-04 | Auto-fill nama dari Direktori Transaksional | PPTK | P1 | Ya | Ya | — | D01 §11 poin 3; D03 §10 poin 2, 6 | BNT-01, BNT-02 |
| 82 | TPL-03 | Pratinjau Langsung (tab Visual Live Editor) | Admin | P1 | Ya | Ya | — | D01 §9 poin 11; D03 §2.4 | TPL-02, BNT-02 |
| 83 | SPJ-02 | Status SPJ & penguncian | PPTK, Verifikator | P0 | Ya | Ya | — | D02 §5; D04 §2.2 | SPJ-01 |
| 84 | SPJ-04 | Isi Form Dinamis SPJ | PPTK | P0 | Ya | Ya | — | D01 §9 poin 4, 8, 9; D02 §5; D03 §4 poin 10 | TPL-02, SPJ-01 |
| 85 | REK-01 | Split View rekening penerima | PPTK | P1 | Ya | Ya | — | D02 §5; D03 §13; D01 §14 poin 2 | SPJ-01 |
| 86 | SPJ-06 | Unggah lampiran PDF (client-first, fallback server) | PPTK | P1 | Ya | Ya | Ya | D03 §12; D01 §13; D02 §5 | SPJ-01 |
| 87 | SPJ-05 | Pengajuan SPJ ke Verifikator | PPTK | P0 | Ya | Ya | — | D02 §5; D03 §10 poin 3; D01 §11 poin 4 | SPJ-04, BNT-03, PEN-08 |
| 88 | BNT-03 | Validasi bentrok jadwal saat pengajuan | PPTK, Sistem | P0 | Ya | Ya | Ya | D01 §11 poin 4–7; D03 §10; D04 §2.4 | BNT-02, SPJ-05 |
| 89 | PJK-01 | Pop-up pajak pada SPJ | PPTK | P1 | Ya | Ya | — | D02 §5; D03 §4 poin 11; D01 §15 poin 6 | SPJ-04, MST-06 |
| 90 | REK-02 | Input bebas & auto-capture rekening | PPTK | P1 | Ya | Ya | — | D03 §13; D01 §14 poin 3; D04 §2.5 | REK-01 |
| 91 | SPJ-03 | Lepas / batalkan SPJ Draft | PPTK | P1 | Ya | Ya | — | D02 §5, §6; D03 §4 poin 5 | SPJ-02, AUD-02 |
| 92 | SPJ-07 | Worker kompresi server & metadata lampiran | Sistem | P1 | — | Ya | Ya | D04 §2.7; D02 §5; D03 §12 poin 5–7 | SPJ-06 |
| 93 | PJK-02 | Total Pajak, Jumlah dibayarkan & validasi | PPTK, Sistem | P0 | Ya | Ya | Ya | D02 §5; D03 §4 poin 11 | PJK-01 |
| 94 | REK-03 | Snapshot rekening pada SPJ & retensi direktori | Sistem | P1 | Ya | Ya | — | D04 §2.5, §6.6; D02 §5; D01 §14 poin 1, 4–5 | REK-02 |
| 95 | REK-05 | Admin kelola Direktori Rekening Bank | Admin | P2 | Ya | Ya | — | D03 §13 poin 3; D01 §14 poin 6; D04 §2.5 | REK-03 |

**Catatan urutan:**
- **SPJ-05:** Dikerjakan satu paket dengan BNT-03 (validasi bentrok berjalan saat "Ajukan ke Verifikator").
- **BNT-03:** Dikerjakan satu paket dengan SPJ-05.
- **REK-05:** dipindah dari fase F1 ke langkah ini karena ketergantungan.

### Langkah 6: Verifikasi & BKU
**Tujuan:** Verifikasi dan pengembalian, token dan nomor verifikasi, cetak Hasil Verifikasi, halaman keaslian, BKU, koreksi, pencabutan berjenjang, dasbor Verifikator.  
**Prasyarat:** Langkah 5  
**Frontend:** Tahap B. **Backend:** Tahap C.  
**Selesai bila skenario D05 lulus (frontend dan backend):** F:28–33e, B:10k, Q:130–134, R:149

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 96 | VER-01 | Pemeriksaan SPJ: setujui / kembalikan | Verifikator | P0 | Ya | Ya | — | D03 §5; D02 §5 | SPJ-05 |
| 97 | BKU-01 | Pencatatan BKU | Bendahara | P0 | Ya | Ya | — | D02 §4 poin 6–7; D03 §3 poin 7; D04 §2.2 | VER-01 |
| 98 | VER-02 | Larangan verifikasi mandiri | Verifikator, PPTK (Plh.) | P0 | Ya | Ya | Ya | D01 §6 poin 9; D03 §5 poin 10 | VER-01, PEN-05 |
| 99 | VER-03 | Token & nomor verifikasi | Sistem | P0 | Ya | Ya | — | D02 §8 poin 3, 5; D04 §2.2 | VER-01, TPL-04 |
| 100 | TPL-04 | Template Hasil Verifikasi SPJ & format nomor verifikasi per TA | Admin | P1 | Ya | Ya | — | D02 §2.3, §8 poin 2–3; D04 §2.2 | TPL-01, VER-03 |
| 101 | DSB-04 | Dasbor Verifikator (Pro Mode) | Verifikator | P1 | Ya | Ya | — | D03 §1, §5, §14; D01 §3.3 | VER-01 |
| 102 | BKU-02 | Cakupan BKU murni pengeluaran | Bendahara | P0 | Ya | Ya | — | D02 §4 poin 6; D01 §9 poin 2b | BKU-01 |
| 103 | BKU-04 | Pencabutan BKU berjenjang | Bendahara, Verifikator, PPTK | P0 | Ya | Ya | — | D02 §6 poin 2; D03 §5 poin 4; D01 §15 poin 6 | BKU-01, VER-03, SPJ-03 |
| 104 | BKU-03 | Koreksi No./tanggal BKU tanpa pencabutan | Bendahara | P1 | Ya | Ya | — | D02 §6 poin 1; D03 §3 poin 7 | BKU-01, AUD-01 |
| 105 | BKU-05 | Daftar BKU dengan pencarian & filter | Bendahara, Verifikator | P1 | Ya | Ya | — | D01 §15 poin 1, 3–5 | BKU-01, UIX-07 |
| 106 | VER-04 | Cetak Hasil Verifikasi SPJ (PDF + QR) | PPTK, Verifikator | P1 | Ya | Ya | — | D02 §8; D03 §4 poin 13, §5 poin 9 | VER-03, PEN-08 |
| 107 | VER-05 | Halaman keaslian SPJ via token | Publik | P1 | Ya | Ya | — | D02 §8 poin 4; D03 §9 poin 10; D04 §2.3; D01 §10 poin 10 | VER-03 |

**Catatan urutan:**
- **VER-03:** Dikerjakan satu paket dengan TPL-04 (format nomor verifikasi per TA).
- **TPL-04:** Dikerjakan satu paket dengan VER-03.

### Langkah 7: Pelaporan
**Tujuan:** Katalog laporan a–g, rekap isian SPJ, rekap pajak, Kartu Kendali, Laporan Kustom, unduh lampiran.  
**Prasyarat:** Langkah 6  
**Frontend:** Tahap B. **Backend:** Tahap C.  
**Selesai bila skenario D05 lulus (frontend dan backend):** H:54–56, K:75–77, Q:124–129, 136–141, T

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 108 | LAP-01 | Katalog laporan baku: PDF & Excel, basis realisasi | Bendahara, PPTK, Verifikator, PA/KPA, Pengawas | P0 | Ya | Ya | Ya | D01 §9 poin 1–3; D05 §2 baris Laporan | FND-02, BKU-01 |
| 109 | SPJ-08 | Unduh lampiran PDF SPJ | Bendahara, PPTK, Verifikator, PA/KPA | P1 | Ya | Ya | — | D02 §9; D05 §2 | SPJ-07, FND-02 |
| 110 | LAP-02 | Laporan (a) Rekap realisasi per seksi | idem | P1 | Ya | Ya | — | D01 §9 poin 2a | LAP-01 |
| 111 | LAP-03 | Laporan (b) Buku Kas, (c) Daftar kuitansi & SPJ, (d) Realisasi per seksi & subkegiatan | idem | P1 | Ya | Ya | Ya | D01 §9 poin 2b–2d, 3 | LAP-01 |
| 112 | LAP-04 | Laporan (e) Rekap isian SPJ per jenis belanja (Excel) | idem | P1 | Ya | Ya | — | D01 §9 poin 2e, 4, 6–9; D05 §2 | LAP-01, SPJ-04 |
| 113 | LAP-05 | Laporan (f) Rekap pajak per jenis pajak | idem | P1 | Ya | Ya | — | D01 §9 poin 2f, 10; D05 §2 | LAP-01, PJK-02 |
| 114 | LAP-06 | Laporan (g) Rincian Kartu Kendali Kegiatan | idem | P1 | Ya | Ya | — | D01 §9 poin 2g | LAP-01 |
| 115 | LAP-07 | Penyusunan Laporan Kustom (halaman sendiri) | Bendahara, PPTK, PA/KPA, Verifikator | P1 | Ya | Ya | Ya | D01 §9 poin 12 | LAP-01 |

### Langkah 8: Analitik PA/KPA, Portal Publik & Pengawas
**Tujuan:** Burn-rate dan zona, dasbor PA/KPA, Heatmap, dasbor Pengawas, portal keterbukaan publik.  
**Prasyarat:** Langkah 7  
**Frontend:** Tahap B. **Backend:** Tahap C.  
**Selesai bila skenario D05 lulus (frontend dan backend):** N, U, L, S, H:52–53

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 116 | PUB-06 | Server hanya mengirim agregat aman | Publik | P0 | — | Ya | Ya | D01 §10 poin 2, 8; D03 §9 poin 6; D04 §2.3 | FND-02 |
| 117 | DSB-05 | Dasbor Pengawas (menu atas) | Pengawas | P1 | Ya | Ya | — | D03 §1, §7, §14; D01 §8 | AUT-02 |
| 118 | PUB-01 | Portal keterbukaan: akses & pilih TA | Publik | P1 | Ya | Ya | — | D03 §9 poin 1, 5; D01 §10 poin 1 | FND-02 |
| 119 | PUB-02 | Persentase realisasi (server-side) | Publik | P1 | Ya | Ya | Ya | D01 §10 poin 3; D04 §2.3 | BKU-01 |
| 120 | PUB-03 | Kategori status SPJ (4 kategori eksklusif) | Publik | P1 | Ya | Ya | — | D01 §10 poin 4; D04 §2.3 | SPJ-02 |
| 121 | ANA-01 | Perhitungan Time Elapsed, Burn-Rate & lonjakan 14 hari | Sistem | P2 | Ya | Ya | — | D01 §12 poin 2; D03 §11; D04 §2.6 (proyeksi analitik) | BKU-01, SPD-04 |
| 122 | ANA-07 | Heatmap Sebaran Realisasi Bulanan (halaman sendiri) | PA/KPA | P2 | Ya | Ya | — | D01 §12 poin 5 | BKU-01, FND-02 |
| 123 | PUB-04 | Peringkat seksi | Publik | P1 | Ya | Ya | — | D01 §10 poin 5; D03 §9 poin 2 | PUB-02 |
| 124 | PUB-05 | Visualisasi, fullscreen, refresh | Publik | P1 | Ya | Ya | — | D01 §10 poin 6–7; D03 §9 poin 3–5 | PUB-02, PUB-03 |
| 125 | ANA-02 | Klasifikasi 4 zona warna | PA/KPA | P2 | Ya | Ya | — | D01 §12 poin 3; D03 §6, §11 | ANA-01 |
| 126 | ANA-06 | Isolasi RBAC analitik | PA/KPA | P1 | Ya | Ya | — | D01 §12 poin 4; D04 §2.6 poin 2 | ANA-02, FND-02 |
| 127 | PUB-07 | Tema & responsif portal | Publik | P1 | Ya | — | — | D03 §9 poin 7–9; D01 §10 poin 9 | UIX-01, PUB-05 |
| 128 | ANA-03 | Pembekuan analitik Masa Transisi/Arsip | Sistem | P2 | Ya | Ya | — | D01 §12 poin 2; D03 §11 poin 2; D04 §2.5 | ANA-02, TA-01 |
| 129 | ANA-04 | Dasbor Eksekutif PA/KPA (Pro Mode) | PA/KPA | P2 | Ya | Ya | — | D03 §6, §11 poin 3; D01 §3.3 | ANA-02, DRL-01 |
| 130 | ANA-05 | Sifat advisory tanpa blokir | PA/KPA | P2 | Ya | Ya | — | D01 §12 poin 1 | ANA-02 |

### Langkah 9: Retensi & Penutup
**Tujuan:** Penghapusan TA setelah retensi dan penutupan sesuai kriteria kelulusan minimum D05 §4.  
**Prasyarat:** Langkah 8  
**Frontend:** Tahap B. **Backend:** Tahap C.  
**Selesai bila skenario D05 lulus (frontend dan backend):** J:67–70 dan seluruh kriteria D05 §4

| Urut | ID | Fitur | Peran | Prioritas | Frontend | Backend | Penegakan server | Rujukan dokumen | Dependensi |
|---|---|---|---|---|---|---|---|---|---|
| 131 | TA-08 | Penghapusan TA setelah retensi 12 tahun | Admin | P2 | Ya | Ya | Ya | D01 §1.3 poin 6; D03 §2.3; D04 §6, §8 | TA-07, AUD-02 |

## 6. Hal yang belum diputuskan pemilik dokumen
Tidak ada. Dua butir terakhir sudah diputuskan: baris "sumber dana" tidak ada pada kuitansi (Dokumen 02 §2.1), dan pergeseran ke pasangan subkegiatan–rekening yang belum dialokasikan ditolak (Dokumen 01 §5.1 poin 6; skenario D-22a).
