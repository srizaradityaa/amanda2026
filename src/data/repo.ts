// FND-01 — Lapisan akses data bentuknya mengikuti Dokumen 04.
// Pada Tahap A ini membaca data contoh dari sampleData.
// Di Tahap B lapisan ini diganti dengan panggilan backend (Supabase) tanpa mengubah konsumennya.

import * as data from '@/data/sampleData';
import type {
  MasterSOTK, MasterPersonel, PangkatHistoryEntry, AkunLogin, AkunPengawas,
  MasterSubkegiatan, MasterRekeningBelanja, MasterJenisPajak,
  TahunAnggaran, SeksiTA, PemetaanSubkegiatanTA, PenugasanTA, PenugasanDelegasi,
  PenugasanPengawasTA, RegisterSK, AlokasiSubkegiatan, AlokasiRekening,
  Kuitansi, SPJ, BKU, AuditEvent, PeranPenugasan,
  DirektoriTransaksionalSPJ, AccountStatus, TAStatus,
  FormDinamis, FieldFormDinamis, BlokBerulangFormDinamis, TemplateKuitansi,
} from '@/data/types';
import { selisihHari, tambahHari, todayWita } from '@/lib/wita';
import { validasiTagSistem, versiBerikutnya } from '@/lib/formDinamis';

// Helper: remove items matching predicate from a namespace-imported array (in-place).
function removeAll<T>(arr: T[], pred: (x: T) => boolean): void {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (pred(arr[i])) arr.splice(i, 1);
  }
}

// TA-01 — transisi status TA yang diizinkan (Dokumen 02 / PAKET Langkah 3)
const TRANSISI_TA: Record<TAStatus, TAStatus[]> = {
  'Draft': ['Aktif Penuh'],
  'Aktif Penuh': ['Masa Transisi'],
  'Masa Transisi': ['Arsip Read-Only', 'Aktif Penuh'],
  'Arsip Read-Only': ['Masa Transisi'],
};

export const repo = {
  // --- Master Global (tanpa nominal) ---
  masterSOTK: (): MasterSOTK[] => data.masterSOTK,
  masterPersonel: (): MasterPersonel[] => data.masterPersonel,
  pangkatHistory: (personel_id: string): PangkatHistoryEntry[] =>
    data.pangkatHistory.filter((p) => p.personel_id === personel_id),
  akunLogin: (): AkunLogin[] => data.akunLogin,
  akunPengawas: (): AkunPengawas[] => data.akunPengawas,
  masterSubkegiatan: (): MasterSubkegiatan[] => data.masterSubkegiatan,
  masterRekeningBelanja: (): MasterRekeningBelanja[] => data.masterRekeningBelanja,
  masterJenisPajak: (): MasterJenisPajak[] => data.masterJenisPajak,

  // --- Template Kuitansi (TPL-01) ---
  templateKuitansi: (): TemplateKuitansi => data.templateKuitansi,
  simpanTemplateKuitansi: (t: TemplateKuitansi): { ok: boolean; error?: string } => {
    if (!t.nama_instansi.trim() || !t.judul_dokumen.trim()) return { ok: false, error: 'Nama instansi dan judul dokumen wajib diisi.' };
    Object.assign(data.templateKuitansi, t);
    return { ok: true };
  },

  // --- Form Dinamis (TPL-02) ---
  formDinamisAll: (): FormDinamis[] => data.formDinamis,
  formTerbaru: (jenis: string): FormDinamis | undefined =>
    data.formDinamis
      .filter((f) => f.jenis_belanja === jenis)
      .sort((a, b) => Number(b.versi.slice(1)) - Number(a.versi.slice(1)))[0],
  simpanVersiForm: (jenis: string, fields: FieldFormDinamis[], blok: BlokBerulangFormDinamis | null): { ok: boolean; error?: string; versi?: string } => {
    const nama = jenis.trim();
    if (!nama) return { ok: false, error: 'Nama jenis belanja wajib diisi.' };
    if (fields.length === 0) return { ok: false, error: 'Form wajib memiliki minimal satu field.' };
    if (fields.some((f) => !f.label.trim())) return { ok: false, error: 'Label setiap field wajib diisi.' };
    if (blok && (!blok.nama.trim() || blok.fields.length === 0)) return { ok: false, error: 'Blok berulang wajib memiliki nama dan minimal satu field.' };
    const tagErr = validasiTagSistem(fields, blok);
    if (tagErr) return { ok: false, error: tagErr };
    const versi = versiBerikutnya(repo.formTerbaru(nama)?.versi);
    data.formDinamis.push({ id: `fd-${Date.now()}`, jenis_belanja: nama, versi, fields, blok_berulang: blok, tanggal_dibuat: todayWita() });
    return { ok: true, versi };
  },

  // --- Workspace TA (snapshot terisolasi) ---
  tahunAnggaran: (): TahunAnggaran[] => data.tahunAnggaran,
  tahunAnggaranById: (id: string): TahunAnggaran | undefined =>
    data.tahunAnggaran.find((t) => t.id === id),
  seksiTAByTA: (ta_id: string): SeksiTA[] =>
    data.seksiTA.filter((s) => s.ta_id === ta_id),
  seksiTAById: (id: string): SeksiTA | undefined =>
    data.seksiTA.find((s) => s.id === id),
  pemetaanByTA: (ta_id: string): PemetaanSubkegiatanTA[] =>
    data.pemetaanSubkegiatanTA.filter((p) => p.ta_id === ta_id),
  pemetaanBySeksi: (seksi_ta_id: string): PemetaanSubkegiatanTA[] =>
    data.pemetaanSubkegiatanTA.filter((p) => p.seksi_ta_id === seksi_ta_id),

  // --- Penugasan ---
  penugasanByTA: (ta_id: string): PenugasanTA[] =>
    data.penugasanTA.filter((t) => t.ta_id === ta_id),
  penugasanByPersonel: (personel_id: string): PenugasanTA[] =>
    data.penugasanTA.filter((t) => t.personel_id === personel_id),
  penugasanPengawasByTA: (ta_id: string): PenugasanPengawasTA[] =>
    data.penugasanPengawasTA.filter((t) => t.ta_id === ta_id),
  penugasanPengawasByAkun: (pengawas_id: string): PenugasanPengawasTA[] =>
    data.penugasanPengawasTA.filter((t) => t.pengawas_id === pengawas_id),
  delegasiByTA: (ta_id: string): PenugasanDelegasi[] =>
    data.penugasanDelegasi.filter((d) => d.ta_id === ta_id && d.status === 'Delegasi Aktif'),
  registerSK: (): RegisterSK[] => data.registerSK,

  // --- Anggaran ---
  alokasiSubkegiatanByTA: (ta_id: string): AlokasiSubkegiatan[] =>
    data.alokasiSubkegiatan.filter((a) => a.ta_id === ta_id),
  alokasiRekeningByTA: (ta_id: string): AlokasiRekening[] =>
    data.alokasiRekening.filter((a) => a.ta_id === ta_id),
  alokasiRekeningByPemetaan: (pemetaan_id: string): AlokasiRekening[] =>
    data.alokasiRekening.filter((a) => a.pemetaan_subkegiatan_id === pemetaan_id),

  // --- Transaksi ---
  kuitansiByTA: (ta_id: string): Kuitansi[] =>
    data.kuitansi.filter((k) => k.ta_id === ta_id),
  kuitansiBySeksi: (seksi_ta_id: string): Kuitansi[] =>
    data.kuitansi.filter((k) => k.seksi_ta_id === seksi_ta_id),
  spjByTA: (ta_id: string): SPJ[] => data.spj.filter((s) => s.ta_id === ta_id),
  spjByKuitansi: (kuitansi_id: string): SPJ | undefined =>
    data.spj.find((s) => s.kuitansi_id === kuitansi_id),
  bkuByTA: (ta_id: string): BKU[] => data.bku.filter((b) => b.ta_id === ta_id),

  // --- Audit ---
  auditByTA: (ta_id: string): AuditEvent[] =>
    data.auditEvents.filter((a) => a.ta_id === ta_id),
  auditAll: (): AuditEvent[] => data.auditEvents,

  // --- Lookup helper ---
  personelById: (id: string): MasterPersonel | undefined =>
    data.masterPersonel.find((p) => p.id === id),
  pengawasById: (id: string): AkunPengawas | undefined =>
    data.akunPengawas.find((p) => p.id === id),
  akunByPersonel: (personel_id: string): AkunLogin | undefined =>
    data.akunLogin.find((a) => a.personel_id === personel_id),
  akunByUsername: (username: string): AkunLogin | undefined =>
    data.akunLogin.find((a) => a.username === username),
  pengawasByEmail: (email: string): AkunPengawas | undefined =>
    data.akunPengawas.find((p) => p.email.toLowerCase() === email.toLowerCase()),

  // --- Penugasan role helper (untuk alur masuk berjenjang) ---
  // Kembalikan daftar TA tempat personel punya penugasan aktif.
  taIdsForPersonel: (personel_id: string): string[] => {
    const tgs = data.penugasanTA.filter(
      (t) => t.personel_id === personel_id && t.tmt_selesai === null,
    );
    const dels = data.penugasanDelegasi.filter(
      (d) => d.personel_pengganti_id === personel_id && d.status === 'Delegasi Aktif' && d.tanggal_berakhir >= todayWita(),
    );
    return [...new Set([...tgs.map((t) => t.ta_id), ...dels.map((d) => d.ta_id)])];
  },
  // Jabatan aktif personel pada satu TA (termasuk delegasi Plh./Plt.).
  jabatanForPersonelOnTA: (personel_id: string, ta_id: string): { peran: PeranPenugasan; seksi_ta_id: string | null; isDelegasi: boolean }[] => {
    const out: { peran: PeranPenugasan; seksi_ta_id: string | null; isDelegasi: boolean }[] = [];
    for (const t of data.penugasanTA) {
      if (t.personel_id === personel_id && t.ta_id === ta_id && t.tmt_selesai === null) {
        out.push({ peran: t.peran, seksi_ta_id: t.seksi_ta_id, isDelegasi: false });
      }
    }
    for (const d of data.penugasanDelegasi) {
      if (d.personel_pengganti_id === personel_id && d.ta_id === ta_id && d.status === 'Delegasi Aktif' && d.tanggal_berakhir >= todayWita()) {
        out.push({ peran: d.peran_digantikan, seksi_ta_id: d.seksi_ta_id, isDelegasi: true });
      }
    }
    return out;
  },
  taIdsForPengawas: (pengawas_id: string): string[] => {
    const tps = data.penugasanPengawasTA.filter((t) => t.pengawas_id === pengawas_id);
    return [...new Set(tps.map((t) => t.ta_id))];
  },

  // ===== Direktori Transaksional SPJ (BNT-01) =====
  direktoriTransaksional: (): DirektoriTransaksionalSPJ[] => data.direktoriTransaksional,
  koreksiDirektori: (id: string, nip_nik: string, nama: string) => {
    const d = data.direktoriTransaksional.find((x) => x.id === id);
    if (d) { d.nip_nik = nip_nik; d.nama = nama; }
  },
  mergeDirektori: (keepId: string, dropId: string) => {
    const keep = data.direktoriTransaksional.find((x) => x.id === keepId);
    const drop = data.direktoriTransaksional.find((x) => x.id === dropId);
    if (!keep || !drop) return;
    keep.referensi_spj_ids = [...new Set([...keep.referensi_spj_ids, ...drop.referensi_spj_ids])];
    const idx = data.direktoriTransaksional.findIndex((x) => x.id === dropId);
    if (idx >= 0) data.direktoriTransaksional.splice(idx, 1);
  },

  // ===== Master SOTK CRUD (MST-01) =====
  tambahSOTK: (nama_unit: string, tmt_mulai: string, dasar_hukum: string): MasterSOTK => {
    const id = `sotk-${Date.now()}`;
    const s: MasterSOTK = { id, nama_unit, tmt_mulai, tmt_selesai: null, dasar_hukum, pengganti_dari_id: null, status_versi: 'Aktif' };
    data.masterSOTK.push(s);
    return s;
  },
  ubahSOTKNomenklatur: (id: string, nama_baru: string, tmt_baru: string) => {
    const lama = data.masterSOTK.find((s) => s.id === id);
    if (!lama) return;
    const h1 = tambahHari(tmt_baru, -1);
    lama.tmt_selesai = h1;
    lama.status_versi = 'Diarsipkan';
    const baru: MasterSOTK = {
      id: `sotk-${Date.now()}`, nama_unit: nama_baru, tmt_mulai: tmt_baru, tmt_selesai: null,
      dasar_hukum: lama.dasar_hukum, pengganti_dari_id: lama.id, status_versi: 'Aktif',
    };
    data.masterSOTK.push(baru);
  },
  ubahSOTKTypo: (id: string, nama_baru: string) => {
    const s = data.masterSOTK.find((x) => x.id === id);
    if (s) s.nama_unit = nama_baru;
  },
  arsipkanSOTK: (id: string, tanggal_efektif: string) => {
    const s = data.masterSOTK.find((x) => x.id === id);
    if (s) { s.tmt_selesai = tanggal_efektif; s.status_versi = 'Diarsipkan'; }
  },

  // ===== Master Personel CRUD (MST-02) =====
  tambahPersonel: (p: Omit<MasterPersonel, 'id'>): { ok: boolean; error?: string; personel?: MasterPersonel } => {
    const nipTrim = p.nip.trim();
    const nikTrim = p.nik.trim();
    if (!nipTrim && !nikTrim) return { ok: false, error: 'NIP atau NIK wajib diisi.' };
    const idKey = nipTrim || nikTrim;
    for (const existing of data.masterPersonel) {
      if (existing.nip === idKey || existing.nik === idKey) return { ok: false, error: 'Nomor sudah digunakan personel lain.' };
    }
    const id = `p-${Date.now()}`;
    const personel: MasterPersonel = { ...p, id, nip: nipTrim, nik: nikTrim };
    data.masterPersonel.push(personel);
    return { ok: true, personel };
  },
  editPersonel: (id: string, p: Partial<MasterPersonel>): { ok: boolean; error?: string } => {
    const per = data.masterPersonel.find((x) => x.id === id);
    if (!per) return { ok: false, error: 'Personel tidak ditemukan.' };
    if (p.nip !== undefined || p.nik !== undefined) {
      const newNip = (p.nip ?? per.nip).trim();
      const newNik = (p.nik ?? per.nik).trim();
      const idKey = newNip || newNik;
      for (const existing of data.masterPersonel) {
        if (existing.id === id) continue;
        if (existing.nip === idKey || existing.nik === idKey) return { ok: false, error: 'Nomor sudah digunakan personel lain.' };
      }
    }
    Object.assign(per, p);
    return { ok: true };
  },

  // ===== Histori Pangkat (MST-03) =====
  pangkatHistoryByPersonel: (personel_id: string): PangkatHistoryEntry[] =>
    data.pangkatHistory.filter((p) => p.personel_id === personel_id),
  tambahPangkatHistory: (personel_id: string, pangkat: string, gelar_depan: string, gelar_belakang: string, tmt_mulai: string): PangkatHistoryEntry => {
    const id = `ph-${Date.now()}`;
    const e: PangkatHistoryEntry = { id, personel_id, pangkat, gelar_depan, gelar_belakang, tmt_mulai, tmt_selesai: null };
    data.pangkatHistory.push(e);
    return e;
  },
  simpanPerubahanPangkat: (personel_id: string, pangkat_baru: string, gelar_depan_baru: string, gelar_belakang_baru: string, tmt_baru: string) => {
    const entries = data.pangkatHistory.filter((p) => p.personel_id === personel_id && p.tmt_selesai === null);
    const hMinus1 = tambahHari(tmt_baru, -1);
    for (const e of entries) e.tmt_selesai = hMinus1;
    data.pangkatHistory.push({
      id: `ph-${Date.now()}`, personel_id, pangkat: pangkat_baru, gelar_depan: gelar_depan_baru, gelar_belakang: gelar_belakang_baru, tmt_mulai: tmt_baru, tmt_selesai: null,
    });
    const per = data.masterPersonel.find((x) => x.id === personel_id);
    if (per) { per.pangkat = pangkat_baru; per.gelar_depan = gelar_depan_baru; per.gelar_belakang = gelar_belakang_baru; per.tmt = tmt_baru; }
  },

  // ===== Akun Login CRUD (AKN-01, AKN-02) =====
  buatAkun: (personel_id: string, password: string): { ok: boolean; error?: string } => {
    if (password.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
    const per = data.masterPersonel.find((p) => p.id === personel_id);
    if (!per) return { ok: false, error: 'Personel tidak ditemukan.' };
    if (data.akunLogin.find((a) => a.personel_id === personel_id)) return { ok: false, error: 'Akun sudah ada.' };
    const username = per.nip || per.nik;
    const id = `acc-${Date.now()}`;
    data.akunLogin.push({ id, personel_id, username, password, status: 'ACTIVE', failed_attempts: 0, locked: false });
    return { ok: true };
  },
  resetPassword: (akun_id: string, new_password: string): { ok: boolean; error?: string } => {
    if (new_password.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
    const acc = data.akunLogin.find((a) => a.id === akun_id);
    if (!acc) return { ok: false, error: 'Akun tidak ditemukan.' };
    acc.password = new_password;
    acc.failed_attempts = 0;
    acc.locked = false;
    return { ok: true };
  },
  setAkunStatus: (akun_id: string, status: AccountStatus): void => {
    const acc = data.akunLogin.find((a) => a.id === akun_id);
    if (acc) acc.status = status;
  },

  // ===== Akun Pengawas CRUD (AKN-04) =====
  tambahPengawas: (p: Omit<AkunPengawas, 'id' | 'failed_attempts' | 'locked' | 'status'>): { ok: boolean; error?: string } => {
    if (p.password.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
    if (!p.nomor_surat_tugas.trim()) return { ok: false, error: 'Nomor surat tugas wajib diisi.' };
    if (data.akunPengawas.find((a) => a.email.toLowerCase() === p.email.toLowerCase())) return { ok: false, error: 'Email sudah digunakan.' };
    const id = `aud-${Date.now()}`;
    data.akunPengawas.push({ ...p, id, status: 'ACTIVE', failed_attempts: 0, locked: false });
    return { ok: true };
  },
  editPengawas: (id: string, p: Partial<AkunPengawas>): void => {
    const a = data.akunPengawas.find((x) => x.id === id);
    if (a) Object.assign(a, p);
  },
  resetPengawasPassword: (id: string, new_password: string): { ok: boolean; error?: string } => {
    if (new_password.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
    const a = data.akunPengawas.find((x) => x.id === id);
    if (!a) return { ok: false, error: 'Akun tidak ditemukan.' };
    a.password = new_password; a.failed_attempts = 0; a.locked = false;
    return { ok: true };
  },

  // ===== Master Subkegiatan & Rekening (MST-05) =====
  tambahSubkegiatan: (kode: string, nama: string, rincian: string): void => {
    data.masterSubkegiatan.push({ id: `sub-${Date.now()}`, kode, nama, rincian, status: 'Aktif' });
  },
  editSubkegiatan: (id: string, p: Partial<MasterSubkegiatan>): void => {
    const s = data.masterSubkegiatan.find((x) => x.id === id); if (s) Object.assign(s, p);
  },
  tambahRekening: (kode_rekening: string, nama: string, rincian: string): void => {
    data.masterRekeningBelanja.push({ id: `rek-${Date.now()}`, kode_rekening, nama, rincian, status: 'Aktif' });
  },
  editRekening: (id: string, p: Partial<MasterRekeningBelanja>): void => {
    const r = data.masterRekeningBelanja.find((x) => x.id === id); if (r) Object.assign(r, p);
  },

  // ===== Master Jenis Pajak (MST-06) =====
  tambahJenisPajak: (kode: string | null, nama_jenis_pajak: string): void => {
    data.masterJenisPajak.push({ id: `pjk-${Date.now()}`, kode, nama_jenis_pajak, status: 'Aktif' });
  },
  editJenisPajak: (id: string, p: Partial<MasterJenisPajak>): void => {
    const j = data.masterJenisPajak.find((x) => x.id === id); if (j) Object.assign(j, p);
  },
  toggleJenisPajakStatus: (id: string): { ok: boolean; error?: string; status?: 'Aktif' | 'Nonaktif' } => {
    const j = data.masterJenisPajak.find((x) => x.id === id);
    if (!j) return { ok: false, error: 'Jenis pajak tidak ditemukan.' };
    j.status = j.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    return { ok: true, status: j.status };
  },

  // ===== Peta Jabatan (MST-04) — daftar penugasan per TA =====
  petaJabatanByTA: (ta_id: string) => {
    const tgs = data.penugasanTA.filter((t) => t.ta_id === ta_id && t.tmt_selesai === null);
    const delegs = data.penugasanDelegasi.filter((d) => d.ta_id === ta_id && d.status === 'Delegasi Aktif' && d.tanggal_berakhir >= todayWita());
    return { penugasan: tgs, delegasi: delegs };
  },
  _allDelegasi: (ta_id: string): PenugasanDelegasi[] =>
    data.penugasanDelegasi.filter((d) => d.ta_id === ta_id),

  // ===== TA-02 — Buat TA & Pagu Induk; hapus TA Draft =====
  buatTA: (tahun: string, pagu_induk: number): { ok: boolean; error?: string; ta?: TahunAnggaran } => {
    if (!tahun.trim()) return { ok: false, error: 'Tahun wajib diisi.' };
    if (data.tahunAnggaran.find((t) => t.tahun === tahun.trim())) return { ok: false, error: 'TA sudah ada.' };
    const id = `ta-${tahun.trim()}`;
    const ta: TahunAnggaran = { id, tahun: tahun.trim(), pagu_induk, status: 'Draft', mode_apbd_p: false, pagu_induk_perubahan: null, tanggal_arsip_terakhir: null, pernah_transaksi: false };
    data.tahunAnggaran.push(ta);
    return { ok: true, ta };
  },
  hapusTA: (id: string): { ok: boolean; error?: string } => {
    const ta = data.tahunAnggaran.find((t) => t.id === id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    if (ta.status !== 'Draft') return { ok: false, error: 'Hanya TA Draft yang dapat dihapus.' };
    if (ta.pernah_transaksi) return { ok: false, error: 'TA yang pernah memiliki kuitansi tidak dapat dihapus kecuali melalui retensi 12 tahun.' };
    // hapus data terkait (seksi, pemetaan, penugasan, pengawas)
    removeAll(data.seksiTA, (s) => s.ta_id === id);
    removeAll(data.pemetaanSubkegiatanTA, (p) => p.ta_id === id);
    removeAll(data.penugasanTA, (t) => t.ta_id === id);
    removeAll(data.penugasanPengawasTA, (t) => t.ta_id === id);
    removeAll(data.penugasanDelegasi, (d) => d.ta_id === id);
    removeAll(data.tahunAnggaran, (t) => t.id === id);
    return { ok: true };
  },
  editPaguInduk: (ta_id: string, pagu_induk: number): void => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    if (ta && ta.status === 'Draft') ta.pagu_induk = pagu_induk;
  },

  // ===== TA-01 — Siklus status TA manual =====
  ubahStatusTA: (ta_id: string, status: TAStatus): { ok: boolean; error?: string } => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    if (!TRANSISI_TA[ta.status].includes(status)) {
      return { ok: false, error: `Perpindahan status dari ${ta.status} ke ${status} tidak diizinkan.` };
    }
    if (status === 'Aktif Penuh' && ta.status === 'Draft' && !repo.checklistKesiapan(ta_id).lengkap) {
      return { ok: false, error: 'Checklist kesiapan belum lengkap. Aktivasi TA ditolak.' };
    }
    // B-10a: tolak aktivasi TA kedua
    if (status === 'Aktif Penuh') {
      const lainAktif = data.tahunAnggaran.find((t) => t.id !== ta_id && t.status === 'Aktif Penuh');
      if (lainAktif) return { ok: false, error: `Sudah ada TA Aktif Penuh: TA ${lainAktif.tahun}. Hanya satu TA boleh Aktif Penuh.` };
    }
    if (status === 'Arsip Read-Only') {
      ta.tanggal_arsip_terakhir = todayWita();
    }
    ta.status = status;
    return { ok: true };
  },

  // ===== TA-05 — Checklist kesiapan =====
  checklistKesiapan: (ta_id: string) => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    if (!ta) return { lengkap: false, items: [] as { label: string; ok: boolean }[] };
    const seksiTA = data.seksiTA.filter((s) => s.ta_id === ta_id && s.status === 'Aktif');
    const pemetaan = data.pemetaanSubkegiatanTA.filter((p) => p.ta_id === ta_id);
    const tgs = data.penugasanTA.filter((t) => t.ta_id === ta_id && t.tmt_selesai === null);
    const items: { label: string; ok: boolean }[] = [
      { label: 'Pagu Induk > 0', ok: ta.pagu_induk > 0 },
      { label: 'Seluruh seksi terpetakan (ada pemetaan)', ok: seksiTA.length > 0 && seksiTA.every((s) => pemetaan.some((p) => p.seksi_ta_id === s.id)) },
      { label: 'Penugasan PA/KPA', ok: tgs.some((t) => t.peran === 'pa_kpa') },
      { label: 'Penugasan Bendahara', ok: tgs.some((t) => t.peran === 'bendahara') },
      { label: 'Penugasan Verifikator', ok: tgs.some((t) => t.peran === 'verifikator') },
      { label: 'Penugasan PPTK untuk setiap seksi', ok: seksiTA.length > 0 && seksiTA.every((s) => tgs.some((t) => t.peran === 'pptk' && t.seksi_ta_id === s.id)) },
      { label: 'SK atau penugasan provisional', ok: tgs.every((t) => data.registerSK.some((sk) => sk.penugasan_id === t.id) || t.provisional) },
    ];
    return { lengkap: items.every((i) => i.ok), items };
  },

  // ===== TA-04 — Snapshot seksi & pemetaan subkegiatan TA =====
  tambahSeksiTA: (ta_id: string, sotka_id: string): { ok: boolean; error?: string; seksi?: SeksiTA } => {
    const sotka = data.masterSOTK.find((s) => s.id === sotka_id && s.status_versi === 'Aktif');
    if (!sotka) return { ok: false, error: 'Master SOTK tidak ditemukan atau sudah diarsipkan.' };
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    if (ta.status !== 'Draft') return { ok: false, error: 'Snapshot seksi hanya bisa ditambah pada TA Draft.' };
    if (data.seksiTA.find((s) => s.ta_id === ta_id && s.sotka_id === sotka_id && s.status === 'Aktif')) return { ok: false, error: 'Seksi ini sudah ada di TA.' };
    const id = `sek-${ta_id}-${Date.now()}`;
    const seksi: SeksiTA = { id, ta_id, sotka_id, nama_snapshot: sotka.nama_unit, tmt_mulai: sotka.tmt_mulai, tmt_selesai: null, status: 'Aktif' };
    data.seksiTA.push(seksi);
    return { ok: true, seksi };
  },
  hapusSeksiTA: (seksi_ta_id: string): { ok: boolean; error?: string } => {
    const seksi = data.seksiTA.find((s) => s.id === seksi_ta_id);
    if (!seksi) return { ok: false, error: 'Seksi tidak ditemukan.' };
    const ta = data.tahunAnggaran.find((t) => t.id === seksi.ta_id);
    if (ta && ta.status !== 'Draft') return { ok: false, error: 'Hanya TA Draft yang dapat menghapus seksi.' };
    // hapus pemetaan terkait
    removeAll(data.pemetaanSubkegiatanTA, (p) => p.seksi_ta_id === seksi_ta_id);
    removeAll(data.seksiTA, (s) => s.id === seksi_ta_id);
    return { ok: true };
  },
  tambahPemetaan: (ta_id: string, seksi_ta_id: string, subkegiatan_id: string): { ok: boolean; error?: string } => {
    const sub = data.masterSubkegiatan.find((s) => s.id === subkegiatan_id && s.status === 'Aktif');
    if (!sub) return { ok: false, error: 'Subkegiatan tidak ditemukan atau nonaktif.' };
    // C-14: satu subkegiatan hanya satu seksi per TA
    if (data.pemetaanSubkegiatanTA.find((p) => p.ta_id === ta_id && p.subkegiatan_id === subkegiatan_id)) return { ok: false, error: 'Subkegiatan ini sudah dipetakan ke seksi lain di TA ini. Satu subkegiatan hanya untuk satu seksi per TA.' };
    const id = `pem-${ta_id}-${Date.now()}`;
    data.pemetaanSubkegiatanTA.push({ id, ta_id, seksi_ta_id, subkegiatan_id, kode_snapshot: sub.kode, nama_snapshot: sub.nama });
    return { ok: true };
  },
  hapusPemetaan: (pemetaan_id: string): void => {
    removeAll(data.pemetaanSubkegiatanTA, (p) => p.id === pemetaan_id);
  },

  // ===== TA-03 — Salin Struktur terbatas =====
  salinStruktur: (ta_id_baru: string, ta_id_lama: string): { ok: boolean; error?: string; count?: number } => {
    const taBaru = data.tahunAnggaran.find((t) => t.id === ta_id_baru);
    if (!taBaru || taBaru.status !== 'Draft') return { ok: false, error: 'TA target harus Draft.' };
    const seksiLama = data.seksiTA.filter((s) => s.ta_id === ta_id_lama && s.status === 'Aktif');
    let count = 0;
    for (const sl of seksiLama) {
      // salin seksi (snapshot baru, referensi SOTK sama)
      const idS = `sek-${ta_id_baru}-${Date.now()}-${count}`;
      data.seksiTA.push({ id: idS, ta_id: ta_id_baru, sotka_id: sl.sotka_id, nama_snapshot: sl.nama_snapshot, tmt_mulai: sl.tmt_mulai, tmt_selesai: null, status: 'Aktif' });
      // salin pemetaan subkegiatan
      const pems = data.pemetaanSubkegiatanTA.filter((p) => p.seksi_ta_id === sl.id);
      for (const p of pems) {
        const idP = `pem-${ta_id_baru}-${Date.now()}-${count}-${p.subkegiatan_id}`;
        data.pemetaanSubkegiatanTA.push({ id: idP, ta_id: ta_id_baru, seksi_ta_id: idS, subkegiatan_id: p.subkegiatan_id, kode_snapshot: p.kode_snapshot, nama_snapshot: p.nama_snapshot });
      }
      count++;
    }
    return { ok: true, count };
  },

  // ===== PEN-01 — Penugasan PA/KPA, Bendahara, Verifikator, PPTK =====
  tambahPenugasan: (ta_id: string, peran: PeranPenugasan, personel_id: string, seksi_ta_id: string | null, tmt_mulai: string, provisional: boolean): { ok: boolean; error?: string } => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    if (ta.status !== 'Draft') return { ok: false, error: 'Penugasan hanya bisa ditambah pada TA Draft.' };
    const per = data.masterPersonel.find((p) => p.id === personel_id);
    if (!per) return { ok: false, error: 'Personel tidak ditemukan.' };
    // PEN-04: Bendahara ≠ PPTK pada TA yang sama (termasuk Plh./Plt.)
    if (peran === 'pptk' || peran === 'bendahara') {
      const tgs = data.penugasanTA.filter((t) => t.ta_id === ta_id && t.tmt_selesai === null);
      if (peran === 'pptk' && tgs.some((t) => t.peran === 'bendahara' && t.personel_id === personel_id)) return { ok: false, error: 'Personel ini sudah menjadi Bendahara pada TA ini. Bendahara tidak boleh merangkap PPTK.' };
      if (peran === 'bendahara' && tgs.some((t) => t.peran === 'pptk' && t.personel_id === personel_id)) return { ok: false, error: 'Personel ini sudah menjadi PPTK pada TA ini. Bendahara tidak boleh merangkap PPTK.' };
      // cek delegasi juga
      const dels = data.penugasanDelegasi.filter((d) => d.ta_id === ta_id && d.status === 'Delegasi Aktif');
      if (peran === 'pptk' && dels.some((d) => d.peran_digantikan === 'bendahara' && d.personel_pengganti_id === personel_id)) return { ok: false, error: 'Personel ini menjadi Plh. Bendahara aktif. Tidak boleh merangkap PPTK.' };
      if (peran === 'bendahara' && dels.some((d) => d.peran_digantikan === 'pptk' && d.personel_pengganti_id === personel_id)) return { ok: false, error: 'Personel ini menjadi Plh. PPTK aktif. Tidak boleh merangkap Bendahara.' };
    }
    const nama = [per.gelar_depan, per.nama, per.gelar_belakang].filter(Boolean).join(' ');
    const nip = per.nip || per.nik;
    const id = `tg-${ta_id}-${Date.now()}`;
    // PEN-03: mutasi — jika ada penugasan lama untuk peran+seksi yang sama, tutup H-1
    const lama = data.penugasanTA.find((t) => t.ta_id === ta_id && t.peran === peran && t.seksi_ta_id === seksi_ta_id && t.tmt_selesai === null);
    if (lama) {
      lama.tmt_selesai = tambahHari(tmt_mulai, -1);
    }
    data.penugasanTA.push({ id, ta_id, peran, personel_id, seksi_ta_id, tmt_mulai, tmt_selesai: null, provisional, nama_snapshot: nama, nip_snapshot: nip });
    return { ok: true };
  },
  hapusPenugasan: (penugasan_id: string): { ok: boolean; error?: string } => {
    const t = data.penugasanTA.find((x) => x.id === penugasan_id);
    if (!t) return { ok: false, error: 'Penugasan tidak ditemukan.' };
    const ta = data.tahunAnggaran.find((x) => x.id === t.ta_id);
    if (ta && ta.status !== 'Draft') return { ok: false, error: 'Hanya TA Draft yang dapat menghapus penugasan.' };
    // hapus SK terkait
    removeAll(data.registerSK, (s) => s.penugasan_id === penugasan_id);
    removeAll(data.penugasanTA, (x) => x.id === penugasan_id);
    return { ok: true };
  },

  // ===== PEN-03 — Mutasi pejabat definitif di tengah TA (B-9, Dokumen 03 §2.3) =====
  gantiPejabatDefinitif: (penugasan_id: string, personel_pengganti_id: string, tmt_baru: string): { ok: boolean; error?: string } => {
    const t = data.penugasanTA.find((x) => x.id === penugasan_id);
    if (!t) return { ok: false, error: 'Penugasan tidak ditemukan.' };
    const ta = data.tahunAnggaran.find((x) => x.id === t.ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    if (ta.status === 'Arsip Read-Only') return { ok: false, error: 'TA Arsip Read-Only tidak dapat diubah.' };
    if (t.tmt_selesai !== null) return { ok: false, error: 'Penugasan ini sudah berakhir.' };
    const per = data.masterPersonel.find((p) => p.id === personel_pengganti_id);
    if (!per) return { ok: false, error: 'Personel tidak ditemukan.' };
    // D-23b: Bendahara ≠ PPTK pada TA yang sama (termasuk Plh./Plt.)
    const peran = t.peran;
    if (peran === 'pptk' || peran === 'bendahara') {
      const tgs = data.penugasanTA.filter((tg) => tg.ta_id === t.ta_id && tg.tmt_selesai === null && tg.id !== penugasan_id);
      if (peran === 'pptk' && tgs.some((tg) => tg.peran === 'bendahara' && tg.personel_id === personel_pengganti_id)) return { ok: false, error: 'Personel ini sudah menjadi Bendahara pada TA ini. Bendahara tidak boleh merangkap PPTK.' };
      if (peran === 'bendahara' && tgs.some((tg) => tg.peran === 'pptk' && tg.personel_id === personel_pengganti_id)) return { ok: false, error: 'Personel ini sudah menjadi PPTK pada TA ini. Bendahara tidak boleh merangkap PPTK.' };
      const dels = data.penugasanDelegasi.filter((d) => d.ta_id === t.ta_id && d.status === 'Delegasi Aktif');
      if (peran === 'pptk' && dels.some((d) => d.peran_digantikan === 'bendahara' && d.personel_pengganti_id === personel_pengganti_id)) return { ok: false, error: 'Personel ini menjadi Plh. Bendahara aktif. Tidak boleh merangkap PPTK.' };
      if (peran === 'bendahara' && dels.some((d) => d.peran_digantikan === 'pptk' && d.personel_pengganti_id === personel_pengganti_id)) return { ok: false, error: 'Personel ini menjadi Plh. PPTK aktif. Tidak boleh merangkap Bendahara.' };
    }
    // Tutup penugasan lama H-1 dari TMT pengganti
    t.tmt_selesai = tambahHari(tmt_baru, -1);
    // Buat penugasan baru dengan personel pengganti
    const nama = [per.gelar_depan, per.nama, per.gelar_belakang].filter(Boolean).join(' ');
    const nip = per.nip || per.nik;
    const id = `tg-${t.ta_id}-${Date.now()}`;
    data.penugasanTA.push({
      id, ta_id: t.ta_id, peran: t.peran, personel_id: personel_pengganti_id,
      seksi_ta_id: t.seksi_ta_id, tmt_mulai: tmt_baru, tmt_selesai: null,
      provisional: false, nama_snapshot: nama, nip_snapshot: nip,
    });
    return { ok: true };
  },

  // ===== PEN-02 — Register SK =====
  tambahSK: (penugasan_id: string, nomor_sk: string, tanggal_sk: string, berkas: string | null, provisional: boolean): { ok: boolean; error?: string } => {
    if (!nomor_sk.trim() || !tanggal_sk) return { ok: false, error: 'Nomor dan tanggal SK wajib diisi.' };
    const id = `sk-${Date.now()}`;
    data.registerSK.push({ id, penugasan_id, nomor_sk, tanggal_sk, berkas, provisional });
    // jika SK final, hapus flag provisional di penugasan
    if (!provisional) {
      const t = data.penugasanTA.find((x) => x.id === penugasan_id);
      if (t) t.provisional = false;
    }
    return { ok: true };
  },
  skByPenugasan: (penugasan_id: string): RegisterSK[] =>
    data.registerSK.filter((s) => s.penugasan_id === penugasan_id),

  // ===== AKN-05 — Penugasan Pengawas per TA =====
  tambahPengawasTA: (ta_id: string, pengawas_id: string, tanggal_mulai: string, tanggal_akhir: string): { ok: boolean; error?: string } => {
    if (!tanggal_mulai || !tanggal_akhir) return { ok: false, error: 'Tanggal mulai dan akhir wajib diisi.' };
    if (data.penugasanPengawasTA.find((t) => t.ta_id === ta_id && t.pengawas_id === pengawas_id)) return { ok: false, error: 'Pengawas sudah ditugaskan di TA ini.' };
    const id = `tp-${Date.now()}`;
    data.penugasanPengawasTA.push({ id, ta_id, pengawas_id, tanggal_mulai, tanggal_akhir });
    return { ok: true };
  },
  hapusPengawasTA: (tp_id: string): void => {
    removeAll(data.penugasanPengawasTA, (t) => t.id === tp_id);
  },

  // ===== PEN-05 — Delegasi Plh./Plt.: penetapan =====
  tambahDelegasi: (ta_id: string, personel_pengganti_id: string, peran_digantikan: PeranPenugasan, seksi_ta_id: string | null, tanggal_mulai: string, tanggal_berakhir: string, definitive_officer_id: string): { ok: boolean; error?: string } => {
    if (!tanggal_mulai || !tanggal_berakhir) return { ok: false, error: 'Tanggal mulai dan berakhir wajib diisi.' };
    if (tanggal_berakhir < tanggal_mulai) return { ok: false, error: 'Tanggal berakhir tidak boleh mendahului tanggal mulai.' };
    // PEN-04: tolak peran bertentangan
    const tgs = data.penugasanTA.filter((t) => t.ta_id === ta_id && t.tmt_selesai === null && t.personel_id === personel_pengganti_id);
    if (peran_digantikan === 'bendahara' && tgs.some((t) => t.peran === 'pptk')) return { ok: false, error: 'Personel ini adalah PPTK pada TA ini. Tidak boleh menjadi Plh. Bendahara (Bendahara ≠ PPTK).' };
    if (peran_digantikan === 'pptk' && tgs.some((t) => t.peran === 'bendahara')) return { ok: false, error: 'Personel ini adalah Bendahara pada TA ini. Tidak boleh menjadi Plh. PPTK (Bendahara ≠ PPTK).' };
    const dels = data.penugasanDelegasi.filter((d) => d.ta_id === ta_id && d.status === 'Delegasi Aktif' && d.personel_pengganti_id === personel_pengganti_id);
    if (peran_digantikan === 'bendahara' && dels.some((d) => d.peran_digantikan === 'pptk')) return { ok: false, error: 'Personel ini menjadi Plh. PPTK aktif. Tidak boleh merangkap Plh. Bendahara.' };
    if (peran_digantikan === 'pptk' && dels.some((d) => d.peran_digantikan === 'bendahara')) return { ok: false, error: 'Personel ini menjadi Plh. Bendahara aktif. Tidak boleh merangkap Plh. PPTK.' };
    const per = data.masterPersonel.find((p) => p.id === personel_pengganti_id);
    if (!per) return { ok: false, error: 'Personel pengganti tidak ditemukan.' };
    const nama = [per.gelar_depan, per.nama, per.gelar_belakang].filter(Boolean).join(' ');
    const nip = per.nip || per.nik;
    const id = `dlg-${Date.now()}`;
    data.penugasanDelegasi.push({ id, ta_id, personel_pengganti_id, peran_digantikan, seksi_ta_id, tanggal_mulai, tanggal_berakhir, status: 'Delegasi Aktif', alasan_pencabutan: null, definitive_officer_id, nama_snapshot: nama, nip_snapshot: nip });
    return { ok: true };
  },

  // ===== PEN-06 — Delegasi: pencabutan dini =====
  cabutDelegasi: (delegasi_id: string, alasan: string): { ok: boolean; error?: string } => {
    if (!alasan.trim()) return { ok: false, error: 'Alasan pencabutan dini wajib diisi.' };
    const d = data.penugasanDelegasi.find((x) => x.id === delegasi_id);
    if (!d) return { ok: false, error: 'Delegasi tidak ditemukan.' };
    if (d.status !== 'Delegasi Aktif') return { ok: false, error: 'Delegasi sudah berakhir/dicabut.' };
    d.status = 'Dicabut';
    d.alasan_pencabutan = alasan.trim();
    return { ok: true };
  },

  // ===== PEN-06 — Delegasi: pengakhiran otomatis 23:59 WITA =====
  akhiriDelegasiJatuhTempo: (): PenugasanDelegasi[] => {
    const today = todayWita();
    const jatuhTempo = data.penugasanDelegasi.filter((d) => d.status === 'Delegasi Aktif' && d.tanggal_berakhir < today);
    for (const d of jatuhTempo) d.status = 'Berakhir';
    return jatuhTempo;
  },

  // ===== TA-06 — Izin aksi per status TA (D02 §7) =====
  canCreateKuitansi: (ta_id: string): boolean => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    return ta?.status === 'Aktif Penuh';
  },
  canEditKuitansi: (ta_id: string): boolean => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    return ta?.status === 'Aktif Penuh';
  },
  canBatalkanKuitansi: (ta_id: string): boolean => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    return ta?.status === 'Aktif Penuh' || ta?.status === 'Masa Transisi';
  },
  canCreateSPJ: (ta_id: string): boolean => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    return ta?.status === 'Aktif Penuh';
  },
  canAksiSPJ: (ta_id: string): boolean => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    return ta?.status === 'Aktif Penuh' || ta?.status === 'Masa Transisi';
  },

  // ===== TA-07 — Retensi 12 tahun =====
  isRetensiLewat: (ta_id: string): boolean => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    if (!ta || ta.status !== 'Arsip Read-Only' || !ta.tanggal_arsip_terakhir) return false;
    const selisih = selisihHari(todayWita(), ta.tanggal_arsip_terakhir);
    return selisih >= 12 * 365;
  },

  // ===== TA-07 — Hapus TA retensi =====
  hapusTARetensi: (ta_id: string): { ok: boolean; error?: string } => {
    const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    if (ta.status !== 'Arsip Read-Only') return { ok: false, error: 'Hanya TA Arsip Read-Only yang dapat dihapus.' };
    if (!repo.isRetensiLewat(ta_id)) return { ok: false, error: 'Retensi 12 tahun belum terlewati.' };
    // hapus total seluruh data TA
    removeAll(data.kuitansi, (k) => k.ta_id === ta_id);
    removeAll(data.spj, (s) => s.ta_id === ta_id);
    removeAll(data.bku, (b) => b.ta_id === ta_id);
    removeAll(data.alokasiRekening, (a) => a.ta_id === ta_id);
    removeAll(data.alokasiSubkegiatan, (a) => a.ta_id === ta_id);
    removeAll(data.pemetaanSubkegiatanTA, (p) => p.ta_id === ta_id);
    removeAll(data.seksiTA, (s) => s.ta_id === ta_id);
    removeAll(data.penugasanTA, (t) => t.ta_id === ta_id);
    removeAll(data.penugasanDelegasi, (d) => d.ta_id === ta_id);
    removeAll(data.penugasanPengawasTA, (t) => t.ta_id === ta_id);
    removeAll(data.tahunAnggaran, (t) => t.id === ta_id);
    // audit event TA juga dihapus (D01 §1.3 poin 6)
    return { ok: true };
  },

  // ===== Ringkasan data TA untuk konfirmasi hapus (tanpa nominal) =====
  ringkasanHapusTA: (ta_id: string) => {
    return {
      kuitansi: data.kuitansi.filter((k) => k.ta_id === ta_id).length,
      spj: data.spj.filter((s) => s.ta_id === ta_id).length,
      bku: data.bku.filter((b) => b.ta_id === ta_id).length,
      lampiran: data.spj.filter((s) => s.ta_id === ta_id && s.lampiran_nama_asli).length,
    };
  },
};
