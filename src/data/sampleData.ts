// FND-01 — Data contoh sesuai bentuk Dokumen 04.
// Master Global tanpa nominal; tiap TA snapshot operasional terisolasi.
// Lapisan akses data ini bentuknya mengikuti D04 agar mudah diganti backend di Tahap B.

import type {
  MasterSOTK, MasterPersonel, PangkatHistoryEntry, AkunLogin, AkunPengawas,
  MasterSubkegiatan, MasterRekeningBelanja, MasterJenisPajak,
  TahunAnggaran, SeksiTA, PemetaanSubkegiatanTA, PenugasanTA, PenugasanDelegasi,
  PenugasanPengawasTA, RegisterSK, AlokasiSubkegiatan, AlokasiRekening,
  Kuitansi, SPJ, BKU, AuditEvent, VersiAlokasiAnggaran, DirektoriTransaksionalSPJ,
  JendelaAlokasi, LedgerSPD, FormDinamis, TemplateKuitansi,
} from '@/data/types';
import { tambahHari, todayWita } from '@/lib/wita';

// ===== Master SOTK (flat, berversi) — D04 §2.1 =====
export const masterSOTK: MasterSOTK[] = [
  { id: 'sotk-1', nama_unit: 'Sekretariat', tmt_mulai: '2026-01-01', tmt_selesai: null, dasar_hukum: 'SK Bupati No. 1/2026', pengganti_dari_id: null, status_versi: 'Aktif' },
  { id: 'sotk-2', nama_unit: 'Seksi Perencanaan', tmt_mulai: '2026-01-01', tmt_selesai: null, dasar_hukum: 'SK Bupati No. 1/2026', pengganti_dari_id: null, status_versi: 'Aktif' },
  { id: 'sotk-3', nama_unit: 'Seksi Keuangan', tmt_mulai: '2026-01-01', tmt_selesai: null, dasar_hukum: 'SK Bupati No. 1/2026', pengganti_dari_id: null, status_versi: 'Aktif' },
  { id: 'sotk-4', nama_unit: 'Seksi Pengadaan Barang dan Jasa', tmt_mulai: '2026-01-01', tmt_selesai: null, dasar_hukum: 'SK Bupati No. 1/2026', pengganti_dari_id: null, status_versi: 'Aktif' },
  { id: 'sotk-5', nama_unit: 'Seksi Pelayanan Publik', tmt_mulai: '2026-01-01', tmt_selesai: null, dasar_hukum: 'SK Bupati No. 1/2026', pengganti_dari_id: null, status_versi: 'Aktif' },
];

// ===== Master Personel + histori pangkat/gelar (D04 §3, §2.1) =====
export const masterPersonel: MasterPersonel[] = [
  { id: 'p-1', gelar_depan: '', nama: 'Hendra Wijaya', gelar_belakang: 'S.E., M.Si.', nip: '198501012010011001', nik: '', pangkat: 'Penata Tk. I / III-d', tmt: '2020-01-01', no_whatsapp: '+6281234567001' },
  { id: 'p-2', gelar_depan: 'Dr.', nama: 'Siti Rahmawati', gelar_belakang: 'M.Si.', nip: '198203152009012003', nik: '', pangkat: 'Penata / III-c', tmt: '2018-07-01', no_whatsapp: '+6281234567002' },
  { id: 'p-3', gelar_depan: '', nama: 'Budi Santoso', gelar_belakang: 'S.T.', nip: '198807202012011004', nik: '', pangkat: 'Penata Muda Tk. I / III-b', tmt: '2019-03-01', no_whatsapp: '+6281234567003' },
  { id: 'p-4', gelar_depan: '', nama: 'Maya Lestari', gelar_belakang: 'S.E.', nip: '199002102015042005', nik: '', pangkat: 'Penata Muda / III-a', tmt: '2021-01-01', no_whatsapp: '+6281234567004' },
  { id: 'p-5', gelar_depan: '', nama: 'Rahmat Hidayat', gelar_belakang: 'S.Sos.', nip: '197505052008011006', nik: '', pangkat: 'Penata / III-c', tmt: '2016-01-01', no_whatsapp: '+6281234567005' },
  { id: 'p-6', gelar_depan: '', nama: 'Dewi Anggraini', gelar_belakang: 'S.H.', nip: '198911112014032007', nik: '', pangkat: 'Penata Muda Tk. I / III-b', tmt: '2020-07-01', no_whatsapp: '+6281234567006' },
  { id: 'p-7', gelar_depan: '', nama: 'Agus Prasetiyo', gelar_belakang: 'S.T., M.T.', nip: '198601252011011008', nik: '', pangkat: 'Penata / III-c', tmt: '2017-01-01', no_whatsapp: '+6281234567007' },
  // personel honorer tanpa NIP — pakai NIK
  { id: 'p-8', gelar_depan: '', nama: 'Nina Marlina', gelar_belakang: '', nip: '', nik: '3210014503900001', pangkat: '—', tmt: '2022-01-01', no_whatsapp: '+6281234567008' },
  // personel tanpa akun (uji: penugasan berakhir, calon Plh./Plt.)
  { id: 'p-9', gelar_depan: '', nama: 'Eko Saputra', gelar_belakang: 'S.Pd.', nip: '199408122018031009', nik: '', pangkat: 'Pengatur / II-c', tmt: '2018-03-01', no_whatsapp: '+6281234567009' },
  { id: 'p-10', gelar_depan: '', nama: 'Yuni Astuti', gelar_belakang: '', nip: '', nik: '3210014503900002', pangkat: '—', tmt: '2023-01-01', no_whatsapp: '+6281234567010' },
];

export const pangkatHistory: PangkatHistoryEntry[] = [
  { id: 'ph-1', personel_id: 'p-1', pangkat: 'Penata Muda / III-a', gelar_depan: '', gelar_belakang: 'S.E.', tmt_mulai: '2015-01-01', tmt_selesai: '2020-01-01' },
  { id: 'ph-2', personel_id: 'p-1', pangkat: 'Penata Tk. I / III-d', gelar_depan: '', gelar_belakang: 'S.E., M.Si.', tmt_mulai: '2020-01-01', tmt_selesai: null },
  { id: 'ph-3', personel_id: 'p-2', pangkat: 'Penata Muda / III-a', gelar_depan: 'Dr.', gelar_belakang: 'M.Si.', tmt_mulai: '2014-01-01', tmt_selesai: '2018-07-01' },
  { id: 'ph-4', personel_id: 'p-2', pangkat: 'Penata / III-c', gelar_depan: 'Dr.', gelar_belakang: 'M.Si.', tmt_mulai: '2018-07-01', tmt_selesai: null },
  { id: 'ph-5', personel_id: 'p-3', pangkat: 'Penata Muda Tk. I / III-b', gelar_depan: '', gelar_belakang: 'S.T.', tmt_mulai: '2019-03-01', tmt_selesai: null },
  { id: 'ph-6', personel_id: 'p-4', pangkat: 'Penata Muda / III-a', gelar_depan: '', gelar_belakang: 'S.E.', tmt_mulai: '2021-01-01', tmt_selesai: null },
  { id: 'ph-7', personel_id: 'p-5', pangkat: 'Penata / III-c', gelar_depan: '', gelar_belakang: 'S.Sos.', tmt_mulai: '2016-01-01', tmt_selesai: null },
  { id: 'ph-8', personel_id: 'p-6', pangkat: 'Penata Muda Tk. I / III-b', gelar_depan: '', gelar_belakang: 'S.H.', tmt_mulai: '2020-07-01', tmt_selesai: null },
  { id: 'ph-9', personel_id: 'p-7', pangkat: 'Penata / III-c', gelar_depan: '', gelar_belakang: 'S.T., M.T.', tmt_mulai: '2017-01-01', tmt_selesai: null },
  { id: 'ph-10', personel_id: 'p-8', pangkat: '—', gelar_depan: '', gelar_belakang: '', tmt_mulai: '2022-01-01', tmt_selesai: null },
];

// ===== Akun Login (username auto dari NIP/NIK) — D04 §3 =====
export const akunLogin: AkunLogin[] = [
  // Admin tidak punya personel_id (akun murni)
  { id: 'acc-admin', personel_id: null, username: 'admin', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-1', personel_id: 'p-1', username: '198501012010011001', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-2', personel_id: 'p-2', username: '198203152009012003', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-3', personel_id: 'p-3', username: '198807202012011004', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-4', personel_id: 'p-4', username: '199002102015042005', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-5', personel_id: 'p-5', username: '197505052008011006', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-6', personel_id: 'p-6', username: '198911112014032007', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-7', personel_id: 'p-7', username: '198601252011011008', password: 'amanda123', status: 'NON-ACTIVE', failed_attempts: 0, locked: false },
  { id: 'acc-8', personel_id: 'p-8', username: '3210014503900001', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
];

// ===== Akun Pengawas/Auditor (terpisah dari personel) — D04 §3, D01 §8 =====
export const akunPengawas: AkunPengawas[] = [
  { id: 'aud-1', nama_lengkap: 'Rizal Fauzan, S.E., M.Si.', instansi_asal: 'Inspektorat Daerah Kab. Balangan', nomor_surat_tugas: '003/INSPEKTORAT/2026', tanggal_surat_tugas: '2026-02-01', email: 'rizal.auditor@balangankab.go.id', tanggal_akhir_akses: '2026-12-31', password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
  { id: 'aud-2', nama_lengkap: 'Lestari Pujiati, S.Sos., M.Si.', instansi_asal: 'BPKP Perwakilan Kalsel', nomor_surat_tugas: '045/BPKP/KSL/2026', tanggal_surat_tugas: '2026-03-10', email: 'lestari.auditor@bpkp.go.id', tanggal_akhir_akses: tambahHari(todayWita(), -30), password: 'amanda123', status: 'ACTIVE', failed_attempts: 0, locked: false },
];

// ===== Master Subkegiatan & Rekening Belanja (kamus global) — D04 §2.1 =====
export const masterSubkegiatan: MasterSubkegiatan[] = [
  { id: 'sub-1', kode: '2.01.2.06.01.01', nama: 'Perencanaan, Penganggaran, dan Evaluasi Kinerja', rincian: 'Dukungan manajemen', status: 'Aktif' },
  { id: 'sub-2', kode: '2.01.2.06.02.01', nama: 'Administrasi Keuangan', rincian: 'Dukungan manajemen', status: 'Aktif' },
  { id: 'sub-3', kode: '2.01.2.06.03.01', nama: 'Penatausahaan dan Pertanggungjawaban', rincian: 'Dukungan manajemen', status: 'Aktif' },
  { id: 'sub-4', kode: '2.02.2.01.01.01', nama: 'Pengadaan Barang dan Jasa', rincian: 'Pelayanan publik', status: 'Aktif' },
  { id: 'sub-5', kode: '2.03.2.04.01.01', nama: 'Pelayanan Administrasi Umum', rincian: 'Pelayanan publik', status: 'Aktif' },
];

export const masterRekeningBelanja: MasterRekeningBelanja[] = [
  { id: 'rek-1', kode_rekening: '5.1.02.02.6.2.01.01', nama: 'Belanja honorarium', rincian: '', status: 'Aktif' },
  { id: 'rek-2', kode_rekening: '5.1.02.02.6.2.01.02', nama: 'Belanja kegiatan', rincian: '', status: 'Aktif' },
  { id: 'rek-3', kode_rekening: '5.1.02.01.6.1.01.01', nama: 'Belanja pegawai', rincian: '', status: 'Aktif' },
  { id: 'rek-4', kode_rekening: '5.2.12.01.6.1.01.01', nama: 'Belanja perjalanan dinas', rincian: '', status: 'Aktif' },
  { id: 'rek-5', kode_rekening: '5.2.02.01.6.1.06.01', nama: 'Belanja barang habis pakai', rincian: '', status: 'Aktif' },
  { id: 'rek-6', kode_rekening: '5.2.12.02.6.1.02.01', nama: 'Belanja jasa konsultan', rincian: '', status: 'Aktif' },
];

export const masterJenisPajak: MasterJenisPajak[] = [
  { id: 'pjk-1', kode: 'PPh21', nama_jenis_pajak: 'Pajak Penghasilan Pasal 21', status: 'Aktif' },
  { id: 'pjk-2', kode: 'PPh22', nama_jenis_pajak: 'Pajak Penghasilan Pasal 22', status: 'Aktif' },
  { id: 'pjk-3', kode: 'PPh23', nama_jenis_pajak: 'Pajak Penghasilan Pasal 23', status: 'Aktif' },
  { id: 'pjk-4', kode: 'PPN', nama_jenis_pajak: 'Pajak Pertambahan Nilai', status: 'Aktif' },
];

// ===== Form Dinamis (D04 §2.2) — dibuat Admin per jenis belanja =====
// 3 contoh form: Belanja Perjalanan Dinas, Belanja Barang Habis Pakai, Belanja Jasa Konsultan
export const formDinamis: FormDinamis[] = [
  {
    id: 'fd-1', jenis_belanja: 'Belanja Perjalanan Dinas', versi: 'v1', tanggal_dibuat: '2026-01-05',
    fields: [
      { id: 'fd1-f1', label: 'Uraian', tipe: 'teks', urutan: 1, wajib: true, system_tag: null },
      { id: 'fd1-f2', label: 'Seksi', tipe: 'teks', urutan: 2, wajib: true, system_tag: null },
      { id: 'fd1-f3', label: 'Nomor Surat Perintah Tugas', tipe: 'teks', urutan: 3, wajib: true, system_tag: null },
      { id: 'fd1-f4', label: 'Tanggal Surat Perintah Tugas', tipe: 'tanggal', urutan: 4, wajib: true, system_tag: null },
      { id: 'fd1-f5', label: 'Daerah Tujuan', tipe: 'teks', urutan: 5, wajib: true, system_tag: null },
      { id: 'fd1-f6', label: 'Tanggal Berangkat', tipe: 'tanggal', urutan: 6, wajib: true, system_tag: '[SYS_START_DATE]' },
      { id: 'fd1-f7', label: 'Tanggal Kembali', tipe: 'tanggal', urutan: 7, wajib: true, system_tag: '[SYS_END_DATE]' },
      { id: 'fd1-f8', label: 'Uang Harian Per Hari', tipe: 'angka', urutan: 8, wajib: false, system_tag: null },
    ],
    blok_berulang: {
      id: 'fd1-blok1', nama: 'Pelaku',
      fields: [
        { id: 'fd1-bf1', label: 'NIP/NIK', tipe: 'teks', urutan: 1, wajib: true, system_tag: '[SYS_PERSONNEL_ID]' },
        { id: 'fd1-bf2', label: 'Nama', tipe: 'teks', urutan: 2, wajib: true, system_tag: '[SYS_PERSONNEL_NAME]' },
        { id: 'fd1-bf3', label: 'Golongan Pangkat', tipe: 'teks', urutan: 3, wajib: false, system_tag: null },
      ],
    },
  },
  {
    id: 'fd-2', jenis_belanja: 'Belanja Barang Habis Pakai', versi: 'v1', tanggal_dibuat: '2026-01-05',
    fields: [
      { id: 'fd2-f1', label: 'Uraian', tipe: 'teks', urutan: 1, wajib: true, system_tag: null },
      { id: 'fd2-f2', label: 'Jumlah Item', tipe: 'angka', urutan: 2, wajib: false, system_tag: null },
    ],
    blok_berulang: null,
  },
  {
    id: 'fd-3', jenis_belanja: 'Belanja Jasa Konsultan', versi: 'v1', tanggal_dibuat: '2026-01-05',
    fields: [
      { id: 'fd3-f1', label: 'Uraian', tipe: 'teks', urutan: 1, wajib: true, system_tag: null },
      { id: 'fd3-f2', label: 'Nama Konsultan', tipe: 'teks', urutan: 2, wajib: true, system_tag: null },
      { id: 'fd3-f3', label: 'NIP/NIK Konsultan', tipe: 'teks', urutan: 3, wajib: false, system_tag: '[SYS_PERSONNEL_ID]' },
      { id: 'fd3-f4', label: 'Nama Kontak', tipe: 'teks', urutan: 4, wajib: false, system_tag: '[SYS_PERSONNEL_NAME]' },
    ],
    blok_berulang: null,
  },
];

// TPL-01 — template kuitansi universal (satu untuk semua jenis belanja)
export const templateKuitansi: TemplateKuitansi = {
  nama_instansi: 'Pemerintah Daerah Contoh',
  judul_dokumen: 'KUITANSI',
  tempat_penerima: 'Contoh Kota',
};

// ===== Workspace TA (snapshot operasional terisolasi) — D04 §2.2 =====
// TA 2026 — Aktif Penuh, dengan snapshot + transaksi.
// TA 2025 — Arsip Read-Only (snapshot beku), menunjukkan isolasi (skenario B-8, G-42).
// TA 2024 — Masa Transisi (B-10c testing: menolak kuitansi/SPJ baru, hanya batal kuitansi Aktif).
// TA 2028 — Draft pernah transaksi (B-6 testing: tidak dapat dihapus).
export const tahunAnggaran: TahunAnggaran[] = [
  { id: 'ta-2026', tahun: '2026', pagu_induk: 15_000_000_000, status: 'Aktif Penuh', mode_apbd_p: false, pagu_induk_perubahan: null, tanggal_arsip_terakhir: null, pernah_transaksi: true },
  { id: 'ta-2025', tahun: '2025', pagu_induk: 13_500_000_000, status: 'Arsip Read-Only', mode_apbd_p: false, pagu_induk_perubahan: null, tanggal_arsip_terakhir: '2026-01-15', pernah_transaksi: true },
  { id: 'ta-2027', tahun: '2027', pagu_induk: 12_000_000_000, status: 'Draft', mode_apbd_p: false, pagu_induk_perubahan: null, tanggal_arsip_terakhir: null, pernah_transaksi: false },
  { id: 'ta-2024', tahun: '2024', pagu_induk: 12_000_000_000, status: 'Masa Transisi', mode_apbd_p: false, pagu_induk_perubahan: null, tanggal_arsip_terakhir: null, pernah_transaksi: true },
  { id: 'ta-2028', tahun: '2028', pagu_induk: 10_000_000_000, status: 'Draft', mode_apbd_p: false, pagu_induk_perubahan: null, tanggal_arsip_terakhir: null, pernah_transaksi: true },
];

export const seksiTA: SeksiTA[] = [
  // TA 2026
  { id: 'sek-2026-1', ta_id: 'ta-2026', sotka_id: 'sotk-1', nama_snapshot: 'Sekretariat', tmt_mulai: '2026-01-01', tmt_selesai: null, status: 'Aktif' },
  { id: 'sek-2026-2', ta_id: 'ta-2026', sotka_id: 'sotk-2', nama_snapshot: 'Seksi Perencanaan', tmt_mulai: '2026-01-01', tmt_selesai: null, status: 'Aktif' },
  { id: 'sek-2026-3', ta_id: 'ta-2026', sotka_id: 'sotk-3', nama_snapshot: 'Seksi Keuangan', tmt_mulai: '2026-01-01', tmt_selesai: null, status: 'Aktif' },
  { id: 'sek-2026-4', ta_id: 'ta-2026', sotka_id: 'sotk-4', nama_snapshot: 'Seksi Pengadaan Barang dan Jasa', tmt_mulai: '2026-01-01', tmt_selesai: null, status: 'Aktif' },
  // TA 2025 (snapshot — nama bisa berbeda dari master sekarang, isolasi)
  { id: 'sek-2025-1', ta_id: 'ta-2025', sotka_id: 'sotk-1', nama_snapshot: 'Sekretariat', tmt_mulai: '2025-01-01', tmt_selesai: null, status: 'Aktif' },
  { id: 'sek-2025-2', ta_id: 'ta-2025', sotka_id: 'sotk-2', nama_snapshot: 'Seksi Perencanaan (Lama)', tmt_mulai: '2025-01-01', tmt_selesai: null, status: 'Aktif' },
  // TA 2027 (Draft siap aktivasi)
  { id: 'sek-2027-1', ta_id: 'ta-2027', sotka_id: 'sotk-1', nama_snapshot: 'Sekretariat', tmt_mulai: '2027-01-01', tmt_selesai: null, status: 'Aktif' },
  { id: 'sek-2027-2', ta_id: 'ta-2027', sotka_id: 'sotk-3', nama_snapshot: 'Seksi Keuangan', tmt_mulai: '2027-01-01', tmt_selesai: null, status: 'Aktif' },
  // TA 2024 (Masa Transisi — snapshot dari saat masih Aktif Penuh)
  { id: 'sek-2024-1', ta_id: 'ta-2024', sotka_id: 'sotk-1', nama_snapshot: 'Sekretariat', tmt_mulai: '2024-01-01', tmt_selesai: null, status: 'Aktif' },
  { id: 'sek-2024-2', ta_id: 'ta-2024', sotka_id: 'sotk-4', nama_snapshot: 'Seksi Pengadaan Barang dan Jasa', tmt_mulai: '2024-01-01', tmt_selesai: null, status: 'Aktif' },
];

export const pemetaanSubkegiatanTA: PemetaanSubkegiatanTA[] = [
  // TA 2026 — Sekretariat
  { id: 'pem-2026-1', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-1', subkegiatan_id: 'sub-1', kode_snapshot: '2.01.2.06.01.01', nama_snapshot: 'Perencanaan, Penganggaran, dan Evaluasi Kinerja' },
  // TA 2026 — Seksi Perencanaan
  { id: 'pem-2026-2', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-2', subkegiatan_id: 'sub-2', kode_snapshot: '2.01.2.06.02.01', nama_snapshot: 'Administrasi Keuangan' },
  // TA 2026 — Seksi Keuangan
  { id: 'pem-2026-3', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-3', subkegiatan_id: 'sub-3', kode_snapshot: '2.01.2.06.03.01', nama_snapshot: 'Penatausahaan dan Pertanggungjawaban' },
  // TA 2026 — Seksi Pengadaan
  { id: 'pem-2026-4', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-4', subkegiatan_id: 'sub-4', kode_snapshot: '2.02.2.01.01.01', nama_snapshot: 'Pengadaan Barang dan Jasa' },
  { id: 'pem-2026-5', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-4', subkegiatan_id: 'sub-5', kode_snapshot: '2.03.2.04.01.01', nama_snapshot: 'Pelayanan Administrasi Umum' },
  // TA 2025 (snapshot)
  { id: 'pem-2025-1', ta_id: 'ta-2025', seksi_ta_id: 'sek-2025-1', subkegiatan_id: 'sub-1', kode_snapshot: '2.01.2.06.01.01', nama_snapshot: 'Perencanaan, Penganggaran, dan Evaluasi Kinerja' },
  { id: 'pem-2025-2', ta_id: 'ta-2025', seksi_ta_id: 'sek-2025-2', subkegiatan_id: 'sub-2', kode_snapshot: '2.01.2.06.02.01', nama_snapshot: 'Administrasi Keuangan' },
  // TA 2027 (Draft siap aktivasi)
  { id: 'pem-2027-1', ta_id: 'ta-2027', seksi_ta_id: 'sek-2027-1', subkegiatan_id: 'sub-1', kode_snapshot: '2.01.2.06.01.01', nama_snapshot: 'Perencanaan, Penganggaran, dan Evaluasi Kinerja' },
  { id: 'pem-2027-2', ta_id: 'ta-2027', seksi_ta_id: 'sek-2027-2', subkegiatan_id: 'sub-3', kode_snapshot: '2.01.2.06.03.01', nama_snapshot: 'Penatausahaan dan Pertanggungjawaban' },
  // TA 2024 (Masa Transisi)
  { id: 'pem-2024-1', ta_id: 'ta-2024', seksi_ta_id: 'sek-2024-1', subkegiatan_id: 'sub-1', kode_snapshot: '2.01.2.06.01.01', nama_snapshot: 'Perencanaan, Penganggaran, dan Evaluasi Kinerja' },
];

export const penugasanTA: PenugasanTA[] = [
  // PA/KPA instansi — personel p-1
  { id: 'tg-2026-pakpa', ta_id: 'ta-2026', peran: 'pa_kpa', personel_id: 'p-1', seksi_ta_id: null, tmt_mulai: '2026-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Hendra Wijaya, S.E., M.Si.', nip_snapshot: '198501012010011001' },
  // Bendahara Pengeluaran — p-2
  { id: 'tg-2026-bend', ta_id: 'ta-2026', peran: 'bendahara', personel_id: 'p-2', seksi_ta_id: null, tmt_mulai: '2026-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', nip_snapshot: '198203152009012003' },
  // Verifikator instansi — p-6
  { id: 'tg-2026-ver', ta_id: 'ta-2026', peran: 'verifikator', personel_id: 'p-6', seksi_ta_id: null, tmt_mulai: '2026-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Dewi Anggraini, S.H.', nip_snapshot: '198911112014032007' },
  // PPTK per seksi
  { id: 'tg-2026-pptk-1', ta_id: 'ta-2026', peran: 'pptk', personel_id: 'p-3', seksi_ta_id: 'sek-2026-1', tmt_mulai: '2026-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Budi Santoso, S.T.', nip_snapshot: '198807202012011004' },
  { id: 'tg-2026-pptk-2', ta_id: 'ta-2026', peran: 'pptk', personel_id: 'p-4', seksi_ta_id: 'sek-2026-2', tmt_mulai: tambahHari(todayWita(), -39), tmt_selesai: null, provisional: false, nama_snapshot: 'Maya Lestari, S.E.', nip_snapshot: '199002102015042005' },
  { id: 'tg-2026-pptk-3', ta_id: 'ta-2026', peran: 'pptk', personel_id: 'p-5', seksi_ta_id: 'sek-2026-3', tmt_mulai: '2026-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Rahmat Hidayat, S.Sos.', nip_snapshot: '197505052008011006' },
  { id: 'tg-2026-pptk-4', ta_id: 'ta-2026', peran: 'pptk', personel_id: 'p-7', seksi_ta_id: 'sek-2026-4', tmt_mulai: '2026-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Agus Prasetiyo, S.T., M.T.', nip_snapshot: '198601252011011008' },
  // PPTK yang juga pegang seksi lain (skenario 1 personel multi-penugasan, P-120/121)
  // p-3 juga PPTK seksi Perencanaan — tapi p-2 sudah Bendahara, tidak boleh merangkap (D01 §6 poin 1). p-3 boleh.
  // TA 2025 penugasan (untuk arsip)
  // PPTK Seksi Perencanaan sebelumnya (penugasan lama, sudah berakhir, ber-SK)
  { id: 'tg-2026-pptk-2-lama', ta_id: 'ta-2026', peran: 'pptk', personel_id: 'p-9', seksi_ta_id: 'sek-2026-2', tmt_mulai: '2026-01-01', tmt_selesai: tambahHari(todayWita(), -40), provisional: false, nama_snapshot: 'Eko Saputra, S.Pd.', nip_snapshot: '199408122018031009' },
  { id: 'tg-2025-pakpa', ta_id: 'ta-2025', peran: 'pa_kpa', personel_id: 'p-1', seksi_ta_id: null, tmt_mulai: '2025-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Hendra Wijaya, S.E., M.Si.', nip_snapshot: '198501012010011001' },
  // TA 2027 (Draft siap aktivasi; SK belum dicatat, penugasan provisional)
  { id: 'tg-2027-pakpa', ta_id: 'ta-2027', peran: 'pa_kpa', personel_id: 'p-1', seksi_ta_id: null, tmt_mulai: '2027-01-01', tmt_selesai: null, provisional: true, nama_snapshot: 'Hendra Wijaya, S.E., M.Si.', nip_snapshot: '198501012010011001' },
  { id: 'tg-2027-bend', ta_id: 'ta-2027', peran: 'bendahara', personel_id: 'p-2', seksi_ta_id: null, tmt_mulai: '2027-01-01', tmt_selesai: null, provisional: true, nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', nip_snapshot: '198203152009012003' },
  { id: 'tg-2027-ver', ta_id: 'ta-2027', peran: 'verifikator', personel_id: 'p-6', seksi_ta_id: null, tmt_mulai: '2027-01-01', tmt_selesai: null, provisional: true, nama_snapshot: 'Dewi Anggraini, S.H.', nip_snapshot: '198911112014032007' },
  { id: 'tg-2027-pptk-1', ta_id: 'ta-2027', peran: 'pptk', personel_id: 'p-3', seksi_ta_id: 'sek-2027-1', tmt_mulai: '2027-01-01', tmt_selesai: null, provisional: true, nama_snapshot: 'Budi Santoso, S.T.', nip_snapshot: '198807202012011004' },
  { id: 'tg-2027-pptk-2', ta_id: 'ta-2027', peran: 'pptk', personel_id: 'p-5', seksi_ta_id: 'sek-2027-2', tmt_mulai: '2027-01-01', tmt_selesai: null, provisional: true, nama_snapshot: 'Rahmat Hidayat, S.Sos.', nip_snapshot: '197505052008011006' },
  // TA 2024 (Masa Transisi — penugasan definitif masih aktif)
  { id: 'tg-2024-pakpa', ta_id: 'ta-2024', peran: 'pa_kpa', personel_id: 'p-1', seksi_ta_id: null, tmt_mulai: '2024-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Hendra Wijaya, S.E., M.Si.', nip_snapshot: '198501012010011001' },
  { id: 'tg-2024-bend', ta_id: 'ta-2024', peran: 'bendahara', personel_id: 'p-2', seksi_ta_id: null, tmt_mulai: '2024-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', nip_snapshot: '198203152009012003' },
  { id: 'tg-2024-pptk-1', ta_id: 'ta-2024', peran: 'pptk', personel_id: 'p-3', seksi_ta_id: 'sek-2024-1', tmt_mulai: '2024-01-01', tmt_selesai: null, provisional: false, nama_snapshot: 'Budi Santoso, S.T.', nip_snapshot: '198807202012011004' },
];

export const penugasanDelegasi: PenugasanDelegasi[] = [
  // Contoh delegasi aktif: p-4 (PPTK Seksi Perencanaan) berhalangan, p-8 (honorer) jadi Plh. PPTK
  // dlg-2: sudah lewat tanggal berakhir, akan diakhiri otomatis saat aplikasi dimuat
  { id: 'dlg-2', ta_id: 'ta-2026', personel_pengganti_id: 'p-10', peran_digantikan: 'bendahara', seksi_ta_id: null, tanggal_mulai: tambahHari(todayWita(), -20), tanggal_berakhir: tambahHari(todayWita(), -2), status: 'Delegasi Aktif', alasan_pencabutan: null, definitive_officer_id: 'p-2', nama_snapshot: 'Yuni Astuti', nip_snapshot: '3210014503900002' },
  { id: 'dlg-1', ta_id: 'ta-2026', personel_pengganti_id: 'p-8', peran_digantikan: 'pptk', seksi_ta_id: 'sek-2026-2', tanggal_mulai: tambahHari(todayWita(), -5), tanggal_berakhir: tambahHari(todayWita(), 20), status: 'Delegasi Aktif', alasan_pencabutan: null, definitive_officer_id: 'p-4', nama_snapshot: 'Nina Marlina', nip_snapshot: '3210014503900001' },
];

export const penugasanPengawasTA: PenugasanPengawasTA[] = [
  { id: 'tp-1', ta_id: 'ta-2026', pengawas_id: 'aud-1', tanggal_mulai: '2026-02-01', tanggal_akhir: '2026-12-31' },
  { id: 'tp-2', ta_id: 'ta-2025', pengawas_id: 'aud-1', tanggal_mulai: '2025-01-01', tanggal_akhir: '2026-12-31' },
  { id: 'tp-3', ta_id: 'ta-2026', pengawas_id: 'aud-2', tanggal_mulai: '2026-03-10', tanggal_akhir: tambahHari(todayWita(), -30) },
];

export const registerSK: RegisterSK[] = [
  { id: 'sk-1', penugasan_id: 'tg-2026-pakpa', nomor_sk: 'SK-001/2026', tanggal_sk: '2026-01-02', berkas: null, provisional: false },
  { id: 'sk-2', penugasan_id: 'tg-2026-bend', nomor_sk: 'SK-002/2026', tanggal_sk: '2026-01-02', berkas: null, provisional: false },
  { id: 'sk-3', penugasan_id: 'tg-2026-ver', nomor_sk: 'SK-003/2026', tanggal_sk: '2026-01-02', berkas: null, provisional: false },
  { id: 'sk-4', penugasan_id: 'tg-2026-pptk-2-lama', nomor_sk: 'SK-004/2026', tanggal_sk: '2026-01-02', berkas: null, provisional: false },
];

export const versiAlokasiAnggaran: VersiAlokasiAnggaran[] = [
  { id: 'vaa-1', ta_id: 'ta-2026', fase: 'murni', tanggal_efektif: '2026-01-10', aktor_id: 'p-2', aktor_nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', aktor_peran_snapshot: 'Bendahara Pengeluaran', keterangan: 'Pengesahan alokasi murni (data contoh)', rincian: [
    { pemetaan_subkegiatan_id: 'pem-2026-1', rekening_id: null, pagu: 3_000_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-2', rekening_id: null, pagu: 4_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-3', rekening_id: null, pagu: 2_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: null, pagu: 3_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-5', rekening_id: null, pagu: 1_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-1', rekening_id: 'rek-1', pagu: 1_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-1', rekening_id: 'rek-3', pagu: 1_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-2', rekening_id: 'rek-2', pagu: 4_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-3', rekening_id: 'rek-1', pagu: 1_000_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-3', rekening_id: 'rek-5', pagu: 1_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: 'rek-5', pagu: 2_000_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: 'rek-6', pagu: 1_500_000_000 },
    { pemetaan_subkegiatan_id: 'pem-2026-5', rekening_id: 'rek-4', pagu: 1_500_000_000 },
  ] },
];

export const jendelaAlokasi: JendelaAlokasi[] = [
  { ta_id: 'ta-2026', tutup_wita: null },
  { ta_id: 'ta-2027', tutup_wita: null },
];

const ledgerTerbitAwal = (id: string, alokasi_rekening_id: string, pagu: number): LedgerSPD => ({
  id,
  ta_id: 'ta-2026',
  alokasi_rekening_id,
  jenis: 'terbit',
  perubahan: pagu,
  spd_sesudah: pagu,
  keterangan: 'Pengesahan awal alokasi (data contoh)',
  referensi: null,
  waktu: '2026-01-02 08:00',
  aktor_id: 'p-2',
  aktor_nama_snapshot: 'Dr. Siti Rahmawati, M.Si.',
  aktor_peran_snapshot: 'Bendahara Pengeluaran',
});

export const ledgerSPD: LedgerSPD[] = [
  { id: 'ldg-2025-1', ta_id: 'ta-2025', alokasi_rekening_id: 'ar-2025-1', jenis: 'terbit', perubahan: 3_000_000_000, spd_sesudah: 3_000_000_000, keterangan: 'Pengesahan awal alokasi (data contoh TA 2025)', waktu: '2025-01-02 08:00', aktor_id: 'p-2', aktor_nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', aktor_peran_snapshot: 'Bendahara Pengeluaran', referensi: null },
  { id: 'ldg-2025-2', ta_id: 'ta-2025', alokasi_rekening_id: 'ar-2025-2', jenis: 'terbit', perubahan: 3_000_000_000, spd_sesudah: 3_000_000_000, keterangan: 'Pengesahan awal alokasi (data contoh TA 2025)', waktu: '2025-01-02 08:00', aktor_id: 'p-2', aktor_nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', aktor_peran_snapshot: 'Bendahara Pengeluaran', referensi: null },
  { id: 'ldg-2025-3', ta_id: 'ta-2025', alokasi_rekening_id: 'ar-2025-3', jenis: 'terbit', perubahan: 7_500_000_000, spd_sesudah: 7_500_000_000, keterangan: 'Pengesahan awal alokasi (data contoh TA 2025)', waktu: '2025-01-02 08:00', aktor_id: 'p-2', aktor_nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', aktor_peran_snapshot: 'Bendahara Pengeluaran', referensi: null },
  ledgerTerbitAwal('ldg-ar-1', 'ar-1', 1_500_000_000),
  ledgerTerbitAwal('ldg-ar-2', 'ar-2', 1_500_000_000),
  ledgerTerbitAwal('ldg-ar-3', 'ar-3', 4_500_000_000),
  ledgerTerbitAwal('ldg-ar-4', 'ar-4', 1_000_000_000),
  ledgerTerbitAwal('ldg-ar-5', 'ar-5', 1_500_000_000),
  ledgerTerbitAwal('ldg-ar-6', 'ar-6', 2_000_000_000),
  ledgerTerbitAwal('ldg-ar-7', 'ar-7', 1_500_000_000),
  ledgerTerbitAwal('ldg-ar-8', 'ar-8', 1_500_000_000),
];


export const alokasiSubkegiatan: AlokasiSubkegiatan[] = [
  { id: 'as-1', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-1', pagu: 3_000_000_000 },
  { id: 'as-2', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-2', pagu: 4_500_000_000 },
  { id: 'as-3', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-3', pagu: 2_500_000_000 },
  { id: 'as-4', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-4', pagu: 3_500_000_000 },
  { id: 'as-5', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-5', pagu: 1_500_000_000 },
  // TA 2025 — snapshot beku, total 13,5 M sama dengan Pagu Induk (data contoh DRL-03/G-42)
  { id: 'as-2025-1', ta_id: 'ta-2025', pemetaan_subkegiatan_id: 'pem-2025-1', pagu: 6_000_000_000 },
  { id: 'as-2025-2', ta_id: 'ta-2025', pemetaan_subkegiatan_id: 'pem-2025-2', pagu: 7_500_000_000 },
  // TA 2024 (Masa Transisi)
  { id: 'as-2024-1', ta_id: 'ta-2024', pemetaan_subkegiatan_id: 'pem-2024-1', pagu: 3_000_000_000 },
];

export const alokasiRekening: AlokasiRekening[] = [
  // TA 2025 — disahkan, SPD sama dengan pagu, tanpa kuitansi (data contoh DRL-03/G-42)
  { id: 'ar-2025-1', ta_id: 'ta-2025', pemetaan_subkegiatan_id: 'pem-2025-1', rekening_id: 'rek-1', kode_rekening_snapshot: '5.1.02.02.6.2.01.01', nama_rekening_snapshot: 'Belanja honorarium', pagu: 3_000_000_000, disahkan: true, spd_aktif: 3_000_000_000 },
  { id: 'ar-2025-2', ta_id: 'ta-2025', pemetaan_subkegiatan_id: 'pem-2025-1', rekening_id: 'rek-3', kode_rekening_snapshot: '5.1.02.01.6.1.01.01', nama_rekening_snapshot: 'Belanja pegawai', pagu: 3_000_000_000, disahkan: true, spd_aktif: 3_000_000_000 },
  { id: 'ar-2025-3', ta_id: 'ta-2025', pemetaan_subkegiatan_id: 'pem-2025-2', rekening_id: 'rek-2', kode_rekening_snapshot: '5.1.02.02.6.2.01.02', nama_rekening_snapshot: 'Belanja kegiatan', pagu: 7_500_000_000, disahkan: true, spd_aktif: 7_500_000_000 },
  // Sekretariat — sub-1, seimbang (pagu 3.0M)
  { id: 'ar-1', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-1', rekening_id: 'rek-1', kode_rekening_snapshot: '5.1.02.02.6.2.01.01', nama_rekening_snapshot: 'Belanja honorarium', pagu: 1_500_000_000, disahkan: true, spd_aktif: 1_500_000_000 },
  { id: 'ar-2', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-1', rekening_id: 'rek-3', kode_rekening_snapshot: '5.1.02.01.6.1.01.01', nama_rekening_snapshot: 'Belanja pegawai', pagu: 1_500_000_000, disahkan: true, spd_aktif: 1_500_000_000 },
  // Seksi Perencanaan — sub-2, seimbang (pagu 4.5M)
  { id: 'ar-3', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-2', rekening_id: 'rek-2', kode_rekening_snapshot: '5.1.02.02.6.2.01.02', nama_rekening_snapshot: 'Belanja kegiatan', pagu: 4_500_000_000, disahkan: true, spd_aktif: 4_500_000_000 },
  // Seksi Keuangan — sub-3, seimbang (pagu 2.5M)
  { id: 'ar-4', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-3', rekening_id: 'rek-1', kode_rekening_snapshot: '5.1.02.02.6.2.01.01', nama_rekening_snapshot: 'Belanja honorarium', pagu: 1_000_000_000, disahkan: true, spd_aktif: 1_000_000_000 },
  { id: 'ar-5', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-3', rekening_id: 'rek-5', kode_rekening_snapshot: '5.2.02.01.6.1.06.01', nama_rekening_snapshot: 'Belanja barang habis pakai', pagu: 1_500_000_000, disahkan: true, spd_aktif: 1_500_000_000 },
  // Seksi Pengadaan — sub-4, seimbang (pagu 3.5M)
  { id: 'ar-6', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: 'rek-5', kode_rekening_snapshot: '5.2.02.01.6.1.06.01', nama_rekening_snapshot: 'Belanja barang habis pakai', pagu: 2_000_000_000, disahkan: true, spd_aktif: 2_000_000_000 },
  { id: 'ar-7', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: 'rek-6', kode_rekening_snapshot: '5.2.12.02.6.1.02.01', nama_rekening_snapshot: 'Belanja jasa konsultan', pagu: 1_500_000_000, disahkan: true, spd_aktif: 1_500_000_000 },
  // Seksi Pengadaan — sub-5, seimbang (pagu 1.5M)
  { id: 'ar-8', ta_id: 'ta-2026', pemetaan_subkegiatan_id: 'pem-2026-5', rekening_id: 'rek-4', kode_rekening_snapshot: '5.2.12.01.6.1.01.01', nama_rekening_snapshot: 'Belanja perjalanan dinas', pagu: 1_500_000_000, disahkan: true, spd_aktif: 1_500_000_000 },
  // TA 2024 (Masa Transisi)
  { id: 'ar-2024-1', ta_id: 'ta-2024', pemetaan_subkegiatan_id: 'pem-2024-1', rekening_id: 'rek-1', kode_rekening_snapshot: '5.1.02.02.6.2.01.01', nama_rekening_snapshot: 'Belanja honorarium', pagu: 3_000_000_000, disahkan: true, spd_aktif: 3_000_000_000 },
];

export const kuitansi: Kuitansi[] = [
  // Kuitansi Aktif pada seksi Sekretariat (pem-2026-1, rek-1) — komitmen
  { id: 'kui-1', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-1', pemetaan_subkegiatan_id: 'pem-2026-1', rekening_id: 'rek-1', penerima: 'Andi Saputra', bruto: 5_000_000, uraian: 'Honorarium kegiatan rapat koordinasi', tanggal_kuitansi: '2026-04-15', status: 'Aktif', pa_kpa_nama: 'Hendra Wijaya, S.E., M.Si.', pa_kpa_nip: '198501012010011001', bendahara_nama: 'Dr. Siti Rahmawati, M.Si.', bendahara_nip: '198203152009012003', pptk_nama: 'Budi Santoso, S.T.', pptk_nip: '198807202012011004', versi_alokasi_snapshot_id: 'vaa-1' },
  // Kuitansi Terkunci pada seksi Pengadaan (pem-2026-4, rek-5) — ada SPJ Draft
  { id: 'kui-2', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-4', pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: 'rek-5', penerima: 'Toko Sumber Makmur', bruto: 12_500_000, uraian: 'Pembelian ATK habis pakai triwulan I', tanggal_kuitansi: '2026-03-20', status: 'Terkunci', pa_kpa_nama: 'Hendra Wijaya, S.E., M.Si.', pa_kpa_nip: '198501012010011001', bendahara_nama: 'Dr. Siti Rahmawati, M.Si.', bendahara_nip: '198203152009012003', pptk_nama: 'Agus Prasetiyo, S.T., M.T.', pptk_nip: '198601252011011008', versi_alokasi_snapshot_id: 'vaa-1' },
  // Kuitansi Terkunci pada seksi Pengadaan (pem-2026-4, rek-5) — SPJ Menunggu BKU
  { id: 'kui-3', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-4', pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: 'rek-5', penerima: 'CV Maju Jaya', bruto: 8_750_000, uraian: 'Pengadaan kertas fotokopi', tanggal_kuitansi: '2026-05-02', status: 'Terkunci', pa_kpa_nama: 'Hendra Wijaya, S.E., M.Si.', pa_kpa_nip: '198501012010011001', bendahara_nama: 'Dr. Siti Rahmawati, M.Si.', bendahara_nip: '198203152009012003', pptk_nama: 'Agus Prasetiyo, S.T., M.T.', pptk_nip: '198601252011011008', versi_alokasi_snapshot_id: 'vaa-1' },
  // Kuitansi Terkunci sudah dibukukan (realisasi) — seksi Pengadaan rek-6
  { id: 'kui-4', ta_id: 'ta-2026', seksi_ta_id: 'sek-2026-4', pemetaan_subkegiatan_id: 'pem-2026-4', rekening_id: 'rek-6', penerima: 'PT Konsultan Sejahtera', bruto: 15_000_000, uraian: 'Jasa konsultan perencanaan', tanggal_kuitansi: '2026-02-28', status: 'Terkunci', pa_kpa_nama: 'Hendra Wijaya, S.E., M.Si.', pa_kpa_nip: '198501012010011001', bendahara_nama: 'Dr. Siti Rahmawati, M.Si.', bendahara_nip: '198203152009012003', pptk_nama: 'Agus Prasetiyo, S.T., M.T.', pptk_nip: '198601252011011008', versi_alokasi_snapshot_id: 'vaa-1' },
  // Kuitansi Aktif pada TA Masa Transisi (B-10c: hanya bisa dibatalkan, tidak diedit)
  { id: 'kui-mt-1', ta_id: 'ta-2024', seksi_ta_id: 'sek-2024-1', pemetaan_subkegiatan_id: 'pem-2024-1', rekening_id: 'rek-1', penerima: 'Budi Hartono', bruto: 3_000_000, uraian: 'Honorarium rapat koordinasi TA 2024', tanggal_kuitansi: '2024-06-10', status: 'Aktif', pa_kpa_nama: 'Hendra Wijaya, S.E., M.Si.', pa_kpa_nip: '198501012010011001', bendahara_nama: 'Dr. Siti Rahmawati, M.Si.', bendahara_nip: '198203152009012003', pptk_nama: 'Budi Santoso, S.T.', pptk_nip: '198807202012011004', versi_alokasi_snapshot_id: null },
];

export const spj: SPJ[] = [
  { id: 'spj-2', ta_id: 'ta-2026', kuitansi_id: 'kui-2', jenis_belanja: 'Belanja Barang Habis Pakai', versi_form: 'v1', jawaban: { uraian: 'Pembelian ATK habis pakai triwulan I' }, entri_pajak: [], lampiran_nama_asli: 'bukti-atk.pdf', lampiran_ukuran_asal: 3_200_000, lampiran_ukuran_final: 3_200_000, lampiran_status_optimasi: 'BYPASSED', catatan_revisi: null, status: 'Draft' },
  { id: 'spj-3', ta_id: 'ta-2026', kuitansi_id: 'kui-3', jenis_belanja: 'Belanja Barang Habis Pakai', versi_form: 'v1', jawaban: { uraian: 'Pengadaan kertas fotokopi' }, entri_pajak: [{ id: 'pj-1', jenis_pajak_id: 'pjk-3', nominal: 437_500 }], lampiran_nama_asli: 'bukti-kertas.pdf', lampiran_ukuran_asal: 8_100_000, lampiran_ukuran_final: 6_400_000, lampiran_status_optimasi: 'CLIENT_COMPRESSED', catatan_revisi: null, status: 'Menunggu BKU' },
  { id: 'spj-4', ta_id: 'ta-2026', kuitansi_id: 'kui-4', jenis_belanja: 'Belanja Jasa Konsultan', versi_form: 'v1', jawaban: { uraian: 'Jasa konsultan perencanaan' }, entri_pajak: [{ id: 'pj-2', jenis_pajak_id: 'pjk-23', nominal: 750_000 }, { id: 'pj-3', jenis_pajak_id: 'pjk-4', nominal: 1_500_000 }], lampiran_nama_asli: 'bukti-konsultan.pdf', lampiran_ukuran_asal: 12_500_000, lampiran_ukuran_final: 7_800_000, lampiran_status_optimasi: 'CLIENT_COMPRESSED', catatan_revisi: null, status: 'Dibukukan' },
];

export const bku: BKU[] = [
  { id: 'bku-1', ta_id: 'ta-2026', kuitansi_id: 'kui-4', spj_id: 'spj-4', nomor_bku: 'BKU-001', tanggal_bku: '2026-03-05', status: 'Aktif' },
];

// ===== Direktori Transaksional SPJ (D04 §2.4) — terpisah dari Master Personel =====
export const direktoriTransaksional: DirektoriTransaksionalSPJ[] = [
  { id: 'dir-1', nip_nik: '198807202012011004', nama: 'Budi Santoso, S.T.', referensi_spj_ids: ['spj-4'] },
  { id: 'dir-2', nip_nik: '3210014503900001', nama: 'Nina Marlina', referensi_spj_ids: ['spj-3'] },
  { id: 'dir-3', nip_nik: '6701234590123456', nama: 'Ahmad Narasumber, S.E.', referensi_spj_ids: ['spj-4'] },
];

// ===== Audit Event (D04 §2.2) — jejak contoh =====
export const auditEvents: AuditEvent[] = [
  { id: 'ae-1', ta_id: 'ta-2026', waktu: '2026-01-10 09:15', aktor_id: 'p-2', aktor_nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', aktor_nip_snapshot: '198203152009012003', aktor_peran_snapshot: 'Bendahara Pengeluaran', entitas: 'TA 2026', aksi: 'sahkan', nilai_sebelum: null, nilai_sesudah: 'SPD terbit 100% pagu disahkan', alasan: null, otomatis: false },
  { id: 'ae-2', ta_id: 'ta-2026', waktu: '2026-03-05 14:30', aktor_id: 'p-2', aktor_nama_snapshot: 'Dr. Siti Rahmawati, M.Si.', aktor_nip_snapshot: '198203152009012003', aktor_peran_snapshot: 'Bendahara Pengeluaran', entitas: 'BKU BKU-001', aksi: 'pencatatan_bku', nilai_sebelum: null, nilai_sesudah: 'No. BKU BKU-001, Tanggal 2026-03-05', alasan: null, otomatis: false, kuitansi_id: 'kui-4', spj_id: 'spj-4' },
];
