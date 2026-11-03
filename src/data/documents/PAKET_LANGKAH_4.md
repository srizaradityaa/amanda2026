# PAKET LANGKAH 4: ANGGARAN, SPD & GATEKEEPER

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 4 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 4 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 54 | ALK-01 | Alokasi Pagu Induk ke Subkegiatan | Bendahara | P0 | Frontend | TA-05 |
| 55 | SPD-01 | Ledger SPD & Sisa SPD Bebas | Sistem | P0 | Frontend | FND-05 |
| 56 | ALK-02 | Pagu Seksi otomatis | Sistem | P0 | Frontend | ALK-01 |
| 57 | ALK-03 | Alokasi rekening belanja per subkegiatan | PPTK | P0 | Frontend | ALK-01, MST-05 |
| 58 | ALK-07 | Versi Alokasi Anggaran append-only | Sistem | P0 | Frontend | ALK-01 |
| 59 | SPD-02 | Efisiensi anggaran (turunkan SPD) | Bendahara | P1 | Frontend | SPD-01, AUD-01 |
| 60 | UIX-06 | Topbar mini progress bar per peran | Semua kecuali Pengawas | P1 | Frontend | UIX-03, SPD-01 |
| 61 | ALK-04 | Jendela waktu alokasi & pemantauan kesiapan | Bendahara | P0 | Frontend | ALK-03, FND-03 |
| 62 | ALK-05 | Gatekeeper global (tanggung renteng) | PPTK, Bendahara | P0 | Frontend | ALK-03 |
| 63 | DRL-01 | Drill-down anggaran Seksi → Subkegiatan → Rekening | Bendahara, Verifikator, PA/KPA, PPTK | P1 | Frontend | ALK-03, SPD-01 |
| 64 | DSB-03 | Dasbor PPTK | PPTK | P1 | Frontend | ALK-03 |
| 65 | SPD-03 | Pergeseran anggaran | Bendahara | P1 | Frontend | SPD-01, ALK-07 |
| 66 | TA-09 | Aktivasi APBD-P & Pagu Induk perubahan | Admin | P1 | Frontend | TA-01, ALK-07 |
| 67 | ALK-06 | Tombol "Sahkan" & penerbitan SPD | Bendahara | P0 | Frontend | ALK-05, SPD-01 |
| 68 | DRL-02 | Cakupan drill-down per peran (server) | Semua | P0 | Frontend | DRL-01, FND-02 |
| 69 | DRL-03 | Drill-down snapshot pada Masa Transisi/Arsip | Semua | P1 | Frontend | DRL-01, FND-01 |
| 70 | DRL-04 | Kartu Pagu Induk TA | Admin, Bendahara, Verifikator, PA/KPA | P1 | Frontend | DRL-01 |
| 71 | DSB-02 | Dasbor Bendahara (Pro Mode) | Bendahara | P1 | Frontend | ALK-04 |
| 72 | SPD-04 | APBD-P: alokasi ulang & proteksi realisasi | Bendahara, PPTK | P1 | Frontend | TA-09, ALK-07 |
| 73 | UIX-09 | Widget countdown & banner merah gatekeeper | Semua kecuali Pengawas | P1 | Frontend | ALK-04, ALK-05 |
- **UIX-06:** dipindah ke langkah ini dari fase F2 karena ketergantungan.

## 2. Aturan kunci per fitur (ringkasan)
### ALK-01 — Alokasi Pagu Induk ke Subkegiatan
- **Peran:** Bendahara
- **Aturan:** Σ pagu subkegiatan = Pagu Induk; indikator selisih real-time; sah bila Rp 0.
- **Rujukan:** D01 §2.1 poin 2; D03 §3 poin 1

### SPD-01 — Ledger SPD & Sisa SPD Bebas
- **Peran:** Sistem
- **Aturan:** Sisa SPD Bebas = SPD aktif − Komitmen Kuitansi Aktif − Realisasi BKU; kuitansi mengurangi bebas; BKU memindahkan komitmen → realisasi (sisa bebas tidak berubah).
- **Rujukan:** D01 §4.2; D04 §5.2, §9; D02 §4 poin 3, 7
- **Keputusan pemilik yang sudah masuk dokumen:** N-06: SPD aktif = pagu rekening, kecuali diturunkan oleh efisiensi.

### ALK-02 — Pagu Seksi otomatis
- **Peran:** Sistem
- **Aturan:** Σ pagu subkegiatan seksi; tidak boleh input manual oleh Admin/Bendahara.
- **Rujukan:** D01 §2.1 poin 3

### ALK-03 — Alokasi rekening belanja per subkegiatan
- **Peran:** PPTK
- **Aturan:** Σ pagu rekening = pagu subkegiatan; satu rekening boleh di >1 subkegiatan; pasangan subkegiatan+rekening unik per TA; kunci internal ID, kode gabungan hanya tampilan.
- **Rujukan:** D01 §2.1 poin 4; D03 §4 poin 2; D04 §2.2

### ALK-07 — Versi Alokasi Anggaran append-only
- **Peran:** Sistem
- **Aturan:** Fase murni/perubahan/pergeseran, tanggal efektif, aktor; perubahan tidak menimpa jejak lama; transaksi menunjuk versi berlaku saat dibuat.
- **Rujukan:** D04 §2.2, §5.3

### SPD-02 — Efisiensi anggaran (turunkan SPD)
- **Peran:** Bendahara
- **Aturan:** Wewenang tunggal Bendahara; maks. Sisa SPD Bebas; hanya menurunkan SPD (pagu & penyebut tetap); SPD boleh dinaikkan kembali sampai pagu rekening dengan alasan + audit; ditolak bila melanggar; tercatat aktor/waktu/sumber/nilai/referensi.
- **Rujukan:** D01 §4.2; D03 §3 poin 4
- **Keputusan pemilik yang sudah masuk dokumen:** N-06: efisiensi hanya menurunkan SPD; pagu rekening dan penyebut serapan/burn-rate tetap pagu. SPD boleh dinaikkan kembali sampai batas pagu rekening dengan alasan dan Jejak Audit.

### UIX-06 — Topbar mini progress bar per peran
- **Peran:** Semua kecuali Pengawas
- **Aturan:** Bendahara/PA/KPA/Verifikator: pagu, realisasi, sisa SPD bebas, serapan instansi; PPTK: seksinya; Admin: Pagu Induk saja; Pengawas: tidak ada.
- **Rujukan:** D01 §3.3; D05 §2

### ALK-04 — Jendela waktu alokasi & pemantauan kesiapan
- **Peran:** Bendahara
- **Aturan:** Atur tanggal/jam penutupan (WITA); pantau status seksi; buka kembali jendela bila kadaluarsa.
- **Rujukan:** D01 §3.1; D03 §3 poin 2–3

### ALK-05 — Gatekeeper global (tanggung renteng)
- **Peran:** PPTK, Bendahara
- **Aturan:** "+ Buat Kuitansi" & "+ Buat SPJ" aktif hanya jika 100% seksi Seimbang DAN Bendahara sudah menekan "Sahkan"; selain itu nonaktif untuk semua seksi; pemrosesan SPJ ada, verifikasi, BKU tetap jalan.
- **Rujukan:** D01 §3.2; D02 §4 poin 1
- **Keputusan pemilik yang sudah masuk dokumen:**  Diputuskan (1 Nov 2026): tombol "+ Buat Kuitansi" aktif hanya bila semua seksi Seimbang DAN Bendahara sudah menekan "Sahkan".

### DRL-01 — Drill-down anggaran Seksi → Subkegiatan → Rekening
- **Peran:** Bendahara, Verifikator, PA/KPA, PPTK
- **Aturan:** Breadcrumb; kolom Pagu, Realisasi BKU, Komitmen, Sisa SPD Bebas, Serapan (%), Status; Σ tingkat = Σ tingkat bawah; rekening sama pada beberapa subkegiatan = baris terpisah.
- **Rujukan:** D01 §7 poin 1–3, 6, 9
- **Keputusan pemilik yang sudah masuk dokumen:** N-07: "Serapan" tetap = (Realisasi + Komitmen) ÷ Pagu, hanya di drill-down dan mini progress bar.

### DSB-03 — Dasbor PPTK
- **Peran:** PPTK
- **Aturan:** Countdown, banner, ringkasan seksinya, kuitansi Aktif, SPJ Draft, SPJ dikembalikan + catatan revisi; tidak melihat Pagu Induk; tanpa analitik.
- **Rujukan:** D03 §1, §14; D01 §3.3, §12 poin 4
- **Keputusan pemilik yang sudah masuk dokumen:** N-10: PPTK: countdown+banner, ringkasan seksi, kuitansi Aktif, SPJ Draft, SPJ dikembalikan beserta catatan revisi.

### SPD-03 — Pergeseran anggaran
- **Peran:** Bendahara
- **Aturan:** Satu pintu Bendahara; PPTK tidak punya akses; sumber ≤ Sisa SPD Bebas; tujuan harus pasangan subkegiatan–rekening yang sudah dialokasikan (yang belum dialokasikan ditolak); SPD berpindah bersama pagu; Pagu Induk tetap; berita acara digital (waktu, aktor, no. referensi, sumber −, tujuan +).
- **Rujukan:** D01 §5.1; D03 §3 poin 5
- **Keputusan pemilik yang sudah masuk dokumen:** N-06: pergeseran memindahkan SPD bersama pagu (turun di sumber, naik di tujuan).

### TA-09 — Aktivasi APBD-P & Pagu Induk perubahan
- **Peran:** Admin
- **Aturan:** Admin aktifkan fase APBD-P dan memasukkan Pagu Induk perubahan; pembagian ulang lewat alur Bendahara → PPTK.
- **Rujukan:** D01 §5.2 poin 1–2; D03 §2.3

### ALK-06 — Tombol "Sahkan" & penerbitan SPD
- **Peran:** Bendahara
- **Aturan:** Hanya bila seluruh seksi Seimbang; SPD terbit = 100% pagu disahkan; tanpa pengesahan tidak ada SPD dan kuitansi belum dapat dibuat.
- **Rujukan:** D01 §4.1; D03 §3 poin 8

### DRL-02 — Cakupan drill-down per peran (server)
- **Peran:** Semua
- **Aturan:** Bendahara/Verifikator sampai rekening; PA/KPA sampai subkegiatan; PPTK seksi sendiri; Admin & Pengawas tidak punya; data tingkat terlarang tidak dikirim.
- **Rujukan:** D01 §7 poin 5, 8; D03 §3 poin 10, §4 poin 8, §6

### DRL-03 — Drill-down snapshot pada Masa Transisi/Arsip
- **Peran:** Semua
- **Aturan:** Angka dari snapshot TA; perubahan master kemudian tidak mengubah angka.
- **Rujukan:** D01 §7 poin 7

### DRL-04 — Kartu Pagu Induk TA
- **Peran:** Admin, Bendahara, Verifikator, PA/KPA
- **Aturan:** Tampil pada kartu TA & di atas daftar seksi bagi yang berhak; PPTK tidak melihat; Verifikator baca saja.
- **Rujukan:** D01 §6 poin 3, 5; §7 poin 4; D05 §2

### DSB-02 — Dasbor Bendahara (Pro Mode)
- **Peran:** Bendahara
- **Aturan:** Tabel pemantau kesiapan seksi (Belum Input / Draft Belum Seimbang / Tuntas 100% Seimbang), countdown+banner, ringkasan pagu/realisasi/Sisa SPD Bebas/serapan, tombol Sahkan (aktif bila semua seksi Seimbang), daftar SPJ Menunggu BKU.
- **Rujukan:** D01 §3.1 poin 3; D03 §1, §14
- **Keputusan pemilik yang sudah masuk dokumen:** N-10: Bendahara: tabel kesiapan seksi, countdown+banner, ringkasan pagu/realisasi/sisa SPD bebas/serapan, tombol Sahkan (aktif bila semua seksi Seimbang), daftar SPJ Menunggu BKU.

### SPD-04 — APBD-P: alokasi ulang & proteksi realisasi
- **Peran:** Bendahara, PPTK
- **Aturan:** Pagu rekening baru ≥ realisasi BKU + komitmen aktif; histori berkolom (Pagu Murni, Pergeseran/Perubahan ±, Pagu Setelah Perubahan); transaksi lama tetap pada snapshot murni; Bendahara menekan "Sahkan" lagi setelah semua seksi Seimbang pada pagu perubahan, SPD menyesuaikan pagu perubahan, kuitansi baru tertahan sampai Sahkan ulang.
- **Rujukan:** D01 §5.2 poin 2–4; D03 §3 poin 6; D04 §5.3
- **Keputusan pemilik yang sudah masuk dokumen:**  Diputuskan (1 Nov 2026): pada APBD-P Bendahara menekan "Sahkan" lagi setelah semua seksi Seimbang pada pagu perubahan; SPD menyesuaikan pagu perubahan (tidak di bawah realisasi + komitmen); kuitansi baru tertahan sampai Sahkan ulang.

### UIX-09 — Widget countdown & banner merah gatekeeper
- **Peran:** Semua kecuali Pengawas
- **Aturan:** Countdown selama jendela dibuka, hilang bila semua seksi Seimbang; banner merah memuat nama seksi + status tanpa nominal; Admin baca saja tanpa kendali jendela.
- **Rujukan:** D01 §3.1–3.2

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 01 §2.1

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

#### Dokumen 03 §3

## 3. Bendahara Pengeluaran
1. Membagi Pagu Induk ke subkegiatan sesuai DPA hingga total sama dengan Pagu Induk. Pagu seksi dihitung otomatis.
2. Mengatur jendela waktu input alokasi (WITA) dan memantau countdown serta status penyelesaian seluruh seksi.
3. Menangani pembukaan kembali jendela input bila diperlukan. Selama ada seksi belum seimbang, gatekeeper menahan pembuatan kuitansi dan SPJ baru untuk semua seksi. Pemrosesan SPJ yang sudah ada dan pencatatan BKU tetap berjalan.
4. Mengelola efisiensi dengan menurunkan SPD, maksimal sebesar sisa SPD bebas.
5. Melakukan pergeseran anggaran; Seksi tidak memiliki kewenangan pergeseran. Sumber dibatasi sisa SPD bebas dan setiap perubahan berjejak. Tujuan pergeseran harus pasangan subkegiatan dan rekening yang sudah dialokasikan.
6. Pada APBD-P, mengalokasikan pagu perubahan ke subkegiatan dan mengkoordinasikan penyelesaian alokasi rekening oleh PPTK.
7. Mencatat No. BKU dan tanggal BKU saat pembukuan, satu BKU per kuitansi. No. BKU diinput secara manual oleh Bendahara (bukan auto-number) dan wajib unik per TA. BKU AMANDA murni mencatat realisasi pengeluaran kas belanja per kuitansi/SPJ tanpa mencatat transaksi penerimaan kas (SP2D, UP, GU, TU) maupun saldo kas riil. Sistem membebaskan tanggal BKU tanpa batasan urutan kronologis terhadap tanggal kuitansi atau tanggal SPJ. Mengoreksi No. BKU atau tanggal BKU tanpa pencabutan jika nominal tidak berubah, dengan jejak di Jejak Audit. Mencabut BKU dan mengikuti urutan pencabutan berjenjang (Dokumen 02 §6).
8. Menekan tombol "Sahkan" setelah seluruh seksi berstatus Seimbang. SPD terbit sebesar pagu yang disahkan.
9. Tidak boleh merangkap PPTK/Seksi pada TA yang sama.
10. Melihat tampilan anggaran berjenjang seksi → subkegiatan → rekening belanja, dengan nilai pagu, realisasi, komitmen, sisa SPD bebas, serapan, dan status pada setiap tingkat.
11. Jejak Audit: hanya melihat entri aksinya sendiri.

- Menyusun dan mengunduh laporan kustom untuk seluruh seksi, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12).

#### Dokumen 01 §4.2

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

#### Dokumen 04 §5.2

### 5.2 SPD dan saldo bebas
Konsep saldo bebas pada suatu alokasi rekening:

`Sisa SPD Bebas = SPD aktif - Komitmen Kuitansi Aktif - Realisasi BKU`

Efisiensi dan sumber pergeseran tidak boleh mengambil lebih dari saldo bebas. Efisiensi hanya menurunkan SPD; pagu rekening tetap, dan SPD dapat dinaikkan kembali sampai batas pagu rekening dengan alasan dan Audit Event. Pergeseran memindahkan SPD bersama pagu (turun di sumber, naik di tujuan). Pastikan implementasi menghindari penghitungan ganda atas nilai yang telah dibukukan sesuai model ledger yang dipilih.

#### Dokumen 02 §4

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

#### Dokumen 01 §3.3

### 3.3 Topbar dan Mini Progress Bar
Istilah navbar pada seluruh dokumen berarti topbar. Navigasi menu memakai sidebar untuk semua peran kecuali Pengawas/Auditor. Topbar menampilkan label TA aktif dan peran aktif (tanpa dropdown ganti TA atau peran), mini progress bar realisasi terhadap pagu, dan tombol logout. Mini progress bar disertai angka sesuai cakupan peran:

| Peran | Isi mini progress bar topbar |
|---|---|
| Bendahara, PA/KPA, Verifikator | Pagu, realisasi, sisa SPD bebas, dan serapan seluruh instansi |
| PPTK | Pagu, realisasi, dan sisa SPD bebas seksinya saja |
| Admin | Pagu Induk saja |
| Pengawas/Auditor | Tidak ada mini progress bar dan tidak ada sidebar |

---

#### Dokumen 01 §3.1

### 3.1 Manajemen Jendela Waktu Alokasi
1. Bendahara Pengeluaran memiliki kewenangan mengatur batas waktu pengisian anggaran (tanggal dan jam penutupan). Seluruh jendela waktu memakai zona waktu WITA (UTC+8).
2. Dashboard seluruh pengguna, kecuali Pengawas/Auditor, menampilkan widget hitung mundur (*countdown*) yang memperlihatkan sisa waktu input alokasi selama jendela input dibuka. Widget hilang setelah seluruh seksi berstatus Seimbang. Admin melihat widget ini dalam mode baca saja dan tidak memiliki kendali atas jendela waktu.
3. Dashboard Bendahara dilengkapi tabel pemantau kesiapan yang menampilkan status masing-masing Seksi:
   - *Belum Input*
   - *Draft Belum Seimbang*
   - *Tuntas (100% Seimbang)*

#### Dokumen 01 §3.2

### 3.2 Prinsip Tanggung Renteng Transaksi (*Global Lock*)
Operasional transaksi kuitansi menerapkan aturan disiplin kolektif:
1. Tombol **"+ Buat Kuitansi"** pada seluruh akun Seksi/PPTK di instansi hanya akan aktif jika **100% Seksi telah menyelesaikan alokasi rekening belanja dengan status Seimbang** DAN Bendahara Pengeluaran telah menekan tombol "Sahkan" (§4.1 poin 3). Kedua syarat wajib terpenuhi.
2. Jika ada **minimal 1 Seksi yang belum selesai atau belum seimbang**, ATAU jika batas waktu habis sementara masih ada seksi yang belum tuntas:
   - Tombol **"+ Buat Kuitansi"** dan **"+ Buat SPJ"** baru dinonaktifkan untuk SEMUA Seksi tanpa pengecualian.
   - Dashboard seluruh pengguna, kecuali Pengawas/Auditor, memunculkan banner pengumuman merah terbuka yang secara transparan mencantumkan daftar nama seksi yang belum menyelesaikan alokasi. Banner hanya memuat nama seksi dan status, tanpa nominal alokasi, tampil juga untuk Admin, dan hilang otomatis setelah seluruh seksi Seimbang.
   - Pembuatan kuitansi dan SPJ baru tertunda hingga Seksi yang bersangkutan menyelesaikan alokasinya. Pemrosesan SPJ yang sudah ada, verifikasi, dan pencatatan BKU tetap berjalan. Bendahara membuka kembali akses jendela input jika waktu sempat kadaluarsa.

---

#### Dokumen 01 §7

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

#### Dokumen 01 §5.1

### 5.1 Pergeseran Anggaran (Satu Pintu Bendahara)
1. **Aksesibilitas:** Fitur pergeseran anggaran dikelola satu pintu oleh Bendahara Pengeluaran. Role Seksi/PPTK dilarang melakukan pergeseran saldo antar-rekening secara mandiri.
2. **Integritas Pagu Total:** Pergeseran anggaran hanya memindahkan alokasi antar-rekening belanja dalam subkegiatan atau antar-subkegiatan tanpa mengubah total Pagu Induk SKPD.
3. **Validasi Sumber Pergeseran:** Saldo yang dipindahkan dari rekening sumber dibatasi maksimal sebesar **Sisa SPD Bebas** rekening sumber tersebut.
4. **SPD Ikut Berpindah:** Pergeseran memindahkan SPD bersama pagu: SPD turun pada rekening sumber dan naik pada rekening tujuan sebesar nilai yang sama.
5. **Audit Trail:** Setiap pergeseran mencatat berita acara digital: waktu mutasi, aktor pemindah, nomor referensi pergeseran, rekening sumber (−), dan rekening tujuan (+). Nomor referensi pergeseran dibuat otomatis oleh sistem dengan format `Pergeseran/{nomor urut 3 digit}/{tahun TA}`, misalnya `Pergeseran/001/2026`. Nomor urut dimulai dari 001 pada setiap TA, bertambah satu untuk setiap pergeseran, tidak dapat diinput atau diubah manual, dan tidak dipakai ulang.
6. **Validasi Tujuan Pergeseran:** Rekening tujuan harus berupa pasangan subkegiatan dan rekening yang sudah dialokasikan pada TA yang sama. Pergeseran ke pasangan yang belum dialokasikan ditolak.

#### Dokumen 01 §5.2

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

#### Dokumen 03 §2.3

### 2.3 Perubahan selama TA
- Mencatat mutasi SOTK atau pejabat dengan tanggal efektif dan audit trail; penugasan lama berakhir sehari sebelum penugasan pengganti.
- Menetapkan penugasan Delegasi Aktif (Plh./Plt.) dengan tanggal mulai dan tanggal berakhir, serta mencabutnya lebih awal dengan alasan tertulis. Sistem menolak penunjukan jika personel memegang peran yang bertentangan pada TA tersebut (Dokumen 01 §6 poin 8).
- Mengaktifkan fase APBD-P dan menetapkan Pagu Induk perubahan. Pembagian ulang dilakukan melalui alur Bendahara lalu PPTK/Seksi, bukan dengan menghapus histori.
- Menetapkan status TA ke Masa Transisi/Tutup Buku lalu Arsip Read-Only pada akhir siklus. Seluruh perpindahan status dilakukan Admin secara manual; sistem tidak memindahkan status berdasarkan tanggal. Sebelum menetapkan Arsip Read-Only, sistem menampilkan SPJ atau BKU yang belum selesai sebagai peringatan; keputusan tetap di tangan Admin.
- Admin tidak membagi pagu ke subkegiatan/rekening, tidak mengelola efisiensi SPD atau pergeseran, dan tidak membuat kuitansi, SPJ, verifikasi, atau BKU.
- Membuka kembali TA Arsip Read-Only secara manual bila diperlukan; TA menjadi Masa Transisi / Tutup Buku, dan Admin dapat mengembalikannya ke Aktif Penuh selama tidak ada TA lain yang Aktif Penuh. Perpindahan mundur lain tidak diizinkan. Setiap kali TA diarsipkan kembali, masa retensi dihitung ulang dari tanggal arsip terbaru.
- Setelah TA Arsip Read-Only melewati 12 tahun sejak tanggal arsip terakhir (WITA), Admin dapat menghapus TA secara manual. Sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran tanpa nominal, lalu Admin mengetik kode TA untuk konfirmasi. Penghapusan total menghapus seluruh data TA, lampiran, dan jejak audit terkait, tanpa catatan penghapusan. Salinan cadangan platform mengikuti kebijakan platform.

#### Dokumen 01 §4.1

### 4.1 Otomasi Penerbitan SPD
1. Sistem menerapkan prinsip otomasi penyediaan dana: **SPD Terbit = 100% Pagu**.
2. Begitu alokasi rekening belanja dinyatakan seimbang dan disahkan, nilai SPD awal langsung tersedia secara otomatis untuk seluruh rekening belanja tanpa memerlukan pengajuan berkala/triwulanan manual.
3. **Pemicu Pengesahan:** SPD terbit hanya setelah Bendahara Pengeluaran menekan tombol "Sahkan" dan seluruh seksi berstatus Seimbang. Tanpa pengesahan, tidak ada SPD yang terbit dan kuitansi belum dapat dibuat.

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

#### Dokumen 04 §5.3

### 5.3 Pagu perubahan
- Pagu murni, perubahan/pergeseran, dan pagu akhir harus dapat ditelusuri terpisah.
- Pagu baru tidak boleh lebih kecil dari realisasi kas BKU ditambah komitmen kuitansi aktif.
- Transaksi historis menunjuk versi anggaran/penugasan/form yang berlaku saat transaksi dibuat.

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **B-10d** (DSB-03, DRL-04): PPTK tidak dapat melihat Pagu Induk pada kartu TA. Verifikator dapat melihatnya dalam mode baca saja.
- **C-11** (ALK-01): Total alokasi subkegiatan di bawah pagu induk yang belum seimbang tidak dinyatakan siap.
- **C-12** (ALK-02): Pagu seksi selalu hasil penjumlahan otomatis subkegiatan yang dipetakan, bukan input manual.
- **C-13** (ALK-03): Total rekening belanja harus tepat sama dengan pagu subkegiatan terkait.
- **C-13a** (ALK-03): Satu rekening belanja boleh dipakai di subkegiatan mana pun dalam TA yang sama; setiap pasangan subkegiatan dan rekening memiliki pagu dan alokasi sendiri.
- **C-13b** (ALK-03): Sistem menolak pasangan subkegiatan dan rekening yang sama untuk kedua kalinya dalam satu TA.
- **C-15** (UIX-09, DSB-02, ALK-05): Jika satu seksi belum seimbang atau belum selesai, tombol buat kuitansi nonaktif bagi semua seksi dan dashboard mengidentifikasi seksi yang belum selesai.
- **C-15b** (ALK-05): Saat gatekeeper tertutup, pengajuan SPJ yang sudah ada, verifikasi, dan pencatatan BKU tetap berjalan.
- **C-15a** (UIX-09): Dashboard Admin menampilkan countdown dan banner merah dalam mode baca saja, tanpa tombol pengaturan jendela waktu.
- **C-16** (ALK-04): Saat tenggat habis dengan alokasi belum lengkap, status tetap terblokir; hanya Bendahara dapat membuka kembali periode input sesuai aturan.
- **C-17** (ALK-05): Setelah seluruh seksi selesai seimbang dan gatekeeper dibuka, transaksi dapat dimulai.
- **C-17a** (ALK-04): Jendela waktu input dan tanggal arsip memakai zona waktu WITA (UTC+8).
- **C-17b** (ALK-05): Tombol "+ Buat Kuitansi" aktif hanya bila seluruh seksi Seimbang dan Bendahara telah menekan "Sahkan". Bila salah satu belum terpenuhi, tombol nonaktif untuk semua seksi dan pembuatan kuitansi ditolak di server, termasuk melalui pemanggilan langsung.
- **D-18** (ALK-06): SPD terbit sebesar pagu hanya setelah Bendahara menekan tombol "Sahkan" dan seluruh seksi berstatus Seimbang. Tanpa pengesahan, tidak ada SPD yang terbit.
- **D-19** (SPD-01): Kuitansi aktif mengurangi SPD bebas sebagai komitmen; BKU mengurangi/menandai realisasi kas.
- **D-20** (SPD-02): Efisiensi yang melampaui sisa SPD bebas ditolak; nilai kuitansi aktif dan realisasi terlindungi.
- **D-21** (SPD-03): PPTK/Seksi tidak dapat mengakses atau menjalankan pergeseran.
- **D-22** (SPD-03): Bendahara dapat menggeser hanya dari saldo SPD bebas sumber; total pagu induk tetap.
- **D-22a** (SPD-03): Pergeseran ke pasangan subkegiatan dan rekening yang belum dialokasikan pada TA yang sama ditolak, termasuk melalui pemanggilan langsung.
- **D-23** (SPD-02, SPD-03): Setiap efisiensi/pergeseran tercatat dengan aktor, waktu, sumber, tujuan/nilai dan referensi.
- **D-23e** (SPD-03): Pergeseran memindahkan SPD bersama pagu: SPD turun pada rekening sumber dan naik pada rekening tujuan sebesar nilai yang sama.
- **D-23f** (SPD-02): Efisiensi hanya menurunkan SPD; pagu rekening dan penyebut Serapan, Realisasi (%), dan Burn-Rate tidak berubah.
- **D-23g** (SPD-02): SPD yang diturunkan melalui efisiensi dapat dinaikkan kembali oleh Bendahara dengan alasan tertulis dan tercatat di Jejak Audit. Kenaikan melebihi pagu rekening ditolak.
- **E-24** (TA-09, ALK-07, SPD-04): Perubahan pagu tidak menimpa pagu murni; laporan menampilkan pagu murni, perubahan/pergeseran dan pagu akhir.
- **E-25** (SPD-04): Pagu baru di bawah realisasi BKU ditambah komitmen kuitansi aktif ditolak.
- **E-26** (ALK-07, SPD-04): Transaksi lama tetap menunjuk snapshot anggaran yang berlaku saat transaksi diterbitkan.
- **E-26a** (SPD-04): Setelah APBD-P diaktifkan, kuitansi dan SPJ baru tertahan untuk semua seksi sampai seluruh seksi Seimbang pada pagu perubahan dan Bendahara menekan "Sahkan" lagi. SPD menyesuaikan pagu perubahan; penurunan SPD di bawah Realisasi BKU ditambah Komitmen Kuitansi Aktif ditolak.
- **G-37** (DRL-01): Tampilan anggaran berjenjang seksi → subkegiatan → rekening belanja, dengan breadcrumb yang dapat kembali ke tingkat sebelumnya.
- **G-38** (DRL-01): Setiap tingkat menampilkan Pagu, Realisasi BKU, Komitmen Kuitansi Aktif, Sisa SPD Bebas, Serapan (%), dan Status Seimbang atau Belum Seimbang; nilai tingkat induk sama dengan jumlah tingkat di bawahnya.
- **G-39** (DRL-02): PPTK hanya dapat membuka seksinya sendiri. Kartu Pagu Induk tidak tampil, dan permintaan data seksi lain melalui URL ditolak di server.
- **G-40** (DRL-02): PA/KPA tidak dapat membuka tingkat rekening belanja. Permintaan langsung ke data rekening ditolak di server.
- **G-41** (DRL-02): Admin tidak dapat membuka halaman drill-down anggaran maupun memanggil datanya melalui URL atau pemanggilan langsung.
- **G-42** (DRL-03): TA berstatus Arsip Read-Only menampilkan drill-down dari snapshot. Perubahan Master SOTK atau Master Subkegiatan setelahnya tidak mengubah angka yang tampil.
- **G-43** (DRL-01): Nominal tampil dalam Rupiah dengan pemisah ribuan titik; kode subkegiatan dan kode rekening belanja tampil sebagai teks dan tidak diformat sebagai angka.
- **G-43a** (DRL-01): Rekening belanja yang sama pada dua subkegiatan tampil sebagai dua baris terpisah di bawah masing-masing subkegiatan, tidak digabung.
- **H-52** (UIX-06, UIX-09): Pengawas tidak melihat countdown, banner merah, maupun bar navbar.
- **H-53** (UIX-06): Bar navbar sesuai peran: Bendahara, PA/KPA, dan Verifikator melihat angka seluruh instansi; PPTK hanya seksinya; Admin hanya Pagu Induk; Pengawas tanpa bar.
- **N-108** (DSB-03): **Isolasi RBAC Dasbor Analitik:** Widget early warning ticker dan indikator analitik burn-rate hanya dapat diakses oleh akun PA/KPA. Modul tersebut terbukti tidak muncul, dan permintaan langsung ditolak di server, pada tampilan Admin, Bendahara, PPTK, Verifikator, Pengawas/Auditor, maupun Portal Keterbukaan Publik.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.