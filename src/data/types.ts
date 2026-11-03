// FND-01 / FND-04 — Domain types mengikuti Dokumen 04 (Kamus Data & Skema).
// Master global tanpa nominal; Workspace TA terisolasi sebagai snapshot operasional.
// Kode rekening, NIP/NIK, no. rekening bank disimpan sebagai string (D04 §4).
// Nominal bilangan bulat rupiah tanpa sen (D04 §4).

// ===== Peran =====
export type Role =
  | 'admin'
  | 'bendahara'
  | 'pptk'
  | 'verifikator'
  | 'pa_kpa'
  | 'pengawas';

export type ActorType = 'internal' | 'auditor';

export type AccountStatus = 'Belum Ada Akun' | 'ACTIVE' | 'NON-ACTIVE';

// ===== Master Global (D04 §2.1) =====
export interface MasterSOTK {
  id: string;
  nama_unit: string;
  tmt_mulai: string; // ISO date WITA
  tmt_selesai: string | null; // null = masih aktif
  dasar_hukum: string;
  pengganti_dari_id: string | null;
  status_versi: 'Aktif' | 'Diarsipkan';
}

export interface PangkatHistoryEntry {
  id: string;
  personel_id: string;
  pangkat: string;
  gelar_depan: string;
  gelar_belakang: string;
  tmt_mulai: string; // ISO date WITA
  tmt_selesai: string | null; // null = periode berjalan
}

export interface MasterPersonel {
  id: string;
  gelar_depan: string;
  nama: string;
  gelar_belakang: string;
  nip: string; // string; kosong jika tidak punya
  nik: string; // string; wajib bila NIP kosong
  pangkat: string; // snapshot riwayat terkini
  tmt: string; // ISO date WITA
  no_whatsapp: string; // angka dan +
}

export interface AkunLogin {
  id: string;
  personel_id: string | null; // null untuk akun admin murni bila perlu
  username: string; // auto dari NIP/NIK
  password: string; // data contoh plaintext; backend Tahap B mengganti
  status: AccountStatus;
  failed_attempts: number;
  locked: boolean;
}

export interface AkunPengawas {
  id: string;
  nama_lengkap: string;
  instansi_asal: string;
  nomor_surat_tugas: string;
  tanggal_surat_tugas: string;
  email: string;
  tanggal_akhir_akses: string;
  password: string;
  status: AccountStatus;
  failed_attempts: number;
  locked: boolean;
}

export interface MasterSubkegiatan {
  id: string;
  kode: string; // teks
  nama: string;
  rincian: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface MasterRekeningBelanja {
  id: string;
  kode_rekening: string; // teks
  nama: string;
  rincian: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface MasterJenisPajak {
  id: string;
  kode: string | null;
  nama_jenis_pajak: string;
  status: 'Aktif' | 'Nonaktif';
}

// ===== Direktori Transaksional SPJ (D04 §2.4) =====
export interface DirektoriTransaksionalSPJ {
  id: string;
  nip_nik: string; // kunci identitas
  nama: string;
  // referensi SPJ historis yang memakai identitas ini
  referensi_spj_ids: string[];
}

// ===== Form Dinamis (D04 §2.2 — dibuat Admin per jenis belanja) =====
export type SystemTag =
  | '[SYS_PERSONNEL_ID]'
  | '[SYS_PERSONNEL_NAME]'
  | '[SYS_START_DATE]'
  | '[SYS_END_DATE]'
  | null;

export type TipeField = 'teks' | 'angka' | 'tanggal' | 'area' | 'file';

export interface FieldFormDinamis {
  id: string;
  label: string;
  tipe: TipeField;
  urutan: number;
  wajib: boolean;
  system_tag: SystemTag;
}

export interface BlokBerulangFormDinamis {
  id: string;
  nama: string;
  fields: FieldFormDinamis[];
}

export interface FormDinamis {
  id: string;
  jenis_belanja: string;
  versi: string;
  fields: FieldFormDinamis[];
  blok_berulang: BlokBerulangFormDinamis | null;
  tanggal_dibuat: string;
}

// ===== Template Kuitansi (TPL-01, D02 §2.1 dan §2.3) — teks konfigurasi, bukan data transaksi =====
export interface TemplateKuitansi {
  nama_instansi: string;
  judul_dokumen: string;
  tempat_penerima: string;
  berkas_doc: string | null; // nama berkas .doc/.docx unggahan alternatif (D02 §2.3)
}

// ===== Snapshot/Operasional TA (D04 §2.2) =====
export type TAStatus = 'Draft' | 'Aktif Penuh' | 'Masa Transisi' | 'Arsip Read-Only';

export interface TahunAnggaran {
  id: string;
  tahun: string; // kode TA, mis. "2026"
  pagu_induk: number; // bilangan bulat rupiah
  status: TAStatus;
  mode_apbd_p: boolean;
  pagu_induk_perubahan: number | null;
  tanggal_arsip_terakhir: string | null; // ISO date WITA
  pernah_transaksi: boolean; // penanda "sudah ada transaksi"
}

export interface SeksiTA {
  id: string;
  ta_id: string;
  sotka_id: string; // referensi versi SOTK
  nama_snapshot: string; // snapshot nama
  tmt_mulai: string;
  tmt_selesai: string | null;
  status: 'Aktif' | 'Diarsipkan';
}

export interface PemetaanSubkegiatanTA {
  id: string;
  ta_id: string;
  seksi_ta_id: string;
  subkegiatan_id: string;
  // snapshot kode/nama subkegiatan (D04 §6 — snapshot kode)
  kode_snapshot: string;
  nama_snapshot: string;
}

export type PeranPenugasan = 'pa_kpa' | 'bendahara' | 'verifikator' | 'pptk';

export interface PenugasanTA {
  id: string;
  ta_id: string;
  peran: PeranPenugasan;
  personel_id: string;
  seksi_ta_id: string | null; // null untuk PA/KPA, Bendahara, Verifikator instansi
  tmt_mulai: string;
  tmt_selesai: string | null;
  provisional: boolean;
  // snapshot nama/NIP penandatangan (D01 §6 poin 11, D04 §6)
  nama_snapshot: string;
  nip_snapshot: string;
}

export type StatusDelegasi = 'Delegasi Aktif' | 'Berakhir' | 'Dicabut';

export interface PenugasanDelegasi {
  id: string;
  ta_id: string;
  personel_pengganti_id: string;
  peran_digantikan: PeranPenugasan;
  seksi_ta_id: string | null;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: StatusDelegasi;
  alasan_pencabutan: string | null;
  definitive_officer_id: string;
  nama_snapshot: string;
  nip_snapshot: string;
}

export interface PenugasanPengawasTA {
  id: string;
  ta_id: string;
  pengawas_id: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
}

export interface RegisterSK {
  id: string;
  penugasan_id: string;
  nomor_sk: string;
  tanggal_sk: string;
  berkas: string | null;
  provisional: boolean;
}

export type FaseAlokasi = 'murni' | 'perubahan' | 'pergeseran';

export interface RincianVersiAlokasi {
  pemetaan_subkegiatan_id: string;
  rekening_id: string | null; // null = baris pagu subkegiatan
  pagu: number;
}

export interface VersiAlokasiAnggaran {
  id: string;
  ta_id: string;
  fase: FaseAlokasi;
  tanggal_efektif: string;
  aktor_id: string;
  aktor_nama_snapshot: string;
  aktor_peran_snapshot: string;
  keterangan: string;
  rincian: RincianVersiAlokasi[];
}

export type JenisLedgerSPD = 'terbit' | 'efisiensi' | 'kenaikan' | 'penyesuaian_apbdp' | 'pergeseran';

// Ledger SPD append-only (D04 §2.2): perubahan negatif = efisiensi, positif = kenaikan kembali.
export interface LedgerSPD {
  id: string;
  ta_id: string;
  alokasi_rekening_id: string;
  jenis: JenisLedgerSPD;
  perubahan: number;
  spd_sesudah: number;
  keterangan: string;
  waktu: string;
  aktor_id: string;
  aktor_nama_snapshot: string;
  aktor_peran_snapshot: string;
  // nomor berita acara (pergeseran) atau ID ledger (efisiensi/kenaikan); null bila tidak ada
  referensi: string | null;
}

export interface JendelaAlokasi {
  ta_id: string;
  tutup_wita: string | null; // 'YYYY-MM-DD HH:mm' WITA; null = jendela belum dibuka
}

export interface AlokasiSubkegiatan {
  id: string;
  ta_id: string;
  pemetaan_subkegiatan_id: string;
  pagu: number;
}

export interface AlokasiRekening {
  id: string;
  ta_id: string;
  pemetaan_subkegiatan_id: string;
  rekening_id: string;
  // snapshot kode/nama rekening (D04 §6)
  kode_rekening_snapshot: string;
  nama_rekening_snapshot: string;
  pagu: number;
  disahkan: boolean; // sudah lewat "Sahkan"?
  spd_aktif: number; // SPD terbit 100% pagu yang disahkan
}

export type StatusKuitansi = 'Aktif' | 'Terkunci';

export interface Kuitansi {
  id: string;
  ta_id: string;
  seksi_ta_id: string;
  pemetaan_subkegiatan_id: string;
  rekening_id: string;
  penerima: string;
  bruto: number;
  uraian: string;
  tanggal_kuitansi: string; // ISO date WITA
  status: StatusKuitansi;
  // snapshot penandatangan (D01 §6 poin 11, F-33d/F-33e)
  pa_kpa_nama: string;
  pa_kpa_nip: string;
  bendahara_nama: string;
  bendahara_nip: string;
  pptk_nama: string;
  pptk_nip: string;
  // E-26: snapshot versi alokasi anggaran saat kuitansi dibuat
  versi_alokasi_snapshot_id: string | null;
}

export type StatusSPJ = 'Draft' | 'Terkunci' | 'Menunggu BKU' | 'Dibukukan';

export interface EntriPajakSPJ {
  id: string;
  jenis_pajak_id: string;
  nominal: number;
}

export interface SPJ {
  id: string;
  ta_id: string;
  kuitansi_id: string;
  jenis_belanja: string;
  versi_form: string;
  jawaban: Record<string, string | string[]>;
  entri_pajak: EntriPajakSPJ[];
  lampiran_nama_asli: string | null;
  lampiran_ukuran_asal: number | null;
  lampiran_ukuran_final: number | null;
  lampiran_status_optimasi: 'BYPASSED' | 'CLIENT_COMPRESSED' | 'SERVER_FALLBACK_COMPRESSED' | 'FAILED' | null;
  catatan_revisi: string | null;
  status: StatusSPJ;
}

export interface BKU {
  id: string;
  ta_id: string;
  kuitansi_id: string;
  spj_id: string;
  nomor_bku: string; // input manual Bendahara, unik per TA
  tanggal_bku: string; // ISO date WITA
  status: 'Aktif' | 'Dicabut';
}

// ===== Audit Event (D04 §2.2, D01 §6 poin 6) =====
export type AuditAksi =
  | 'sahkan'
  | 'alokasi_pasca_sahkan'
  | 'alokasi_apbd_p'
  | 'verifikasi_setujui'
  | 'verifikasi_kembalikan'
  | 'pencatatan_bku'
  | 'koreksi_bku'
  | 'pencabutan_bku'
  | 'delegasi_tetapkan'
  | 'delegasi_pencabutan_dini'
  | 'delegasi_berakhir_otomatis'
  | 'perubahan_status_ta'
  | 'perubahan_status_akun'
  | 'aksi_administratif'
  | 'aksi_pengawas'
  | 'efisiensi_spd'
  | 'kenaikan_spd'
  | 'pergeseran_spd';

export interface AuditEvent {
  id: string;
  ta_id: string | null;
  waktu: string; // ISO datetime WITA
  aktor_id: string;
  aktor_nama_snapshot: string;
  aktor_nip_snapshot: string;
  aktor_peran_snapshot: string;
  entitas: string;
  aksi: AuditAksi;
  nilai_sebelum: string | null;
  nilai_sesudah: string | null;
  alasan: string | null;
  otomatis: boolean;
  // delegasi (D04 §2.2)
  definitive_officer_id?: string;
  delegate_officer_id?: string;
  // relasi untuk penghapusan jejak (D01 §6 poin 6)
  kuitansi_id?: string;
  spj_id?: string;
}

// ===== Sesi (D04 §3 — Single-Context Session) =====
export interface SessionPayload {
  user_id: string;
  actor_type: ActorType;
  active_ta_id: string | null;
  active_role: Role | 'pending';
  active_seksi_id: string | null; // khusus PPTK
  nama_snapshot: string;
  nip_snapshot: string;
  // Pengawas snapshot
  instansi_asal_snapshot?: string;
  nomor_surat_tugas_snapshot?: string;
}
