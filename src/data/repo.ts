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
import { selisihHari, tambahHari, todayWita, nowWita } from '@/lib/wita';
import { validasiTagSistem, versiBerikutnya } from '@/lib/formDinamis';
import { recordAudit, purgeAuditForKuitansi, purgeAuditForSPJ } from '@/lib/audit';
import { gerbangStatus, sisaSpdBebas, komitmenAlokasi } from '@/data/anggaran';
import type { SessionPayload, StatusKuitansi, StatusSPJ } from '@/data/types';

// Helper: remove items matching predicate from a namespace-imported array (in-place).
function removeAll<T>(arr: T[], pred: (x: T) => boolean): void {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (pred(arr[i])) arr.splice(i, 1);
  }
}

function formatRupiahLocal(n: number): string {
  return 'Rp ' + Math.trunc(Math.abs(n)).toLocaleString('de-DE');
}

// B-10f: Cek apakah session PPTK adalah pejabat definitif yang aktif (bukan digantikan delegasi)
function _isDefinitifAktifForSeksi(session: SessionPayload, seksi_ta_id: string): boolean {
  const ta_id = session.active_ta_id;
  if (!ta_id) return false;
  // Cari penugasan definitif untuk personel ini pada seksi+TA
  const acc = data.akunLogin.find((a) => a.id === session.user_id);
  if (!acc || !acc.personel_id) return false;
  const tgs = data.penugasanTA.find(
    (t) => t.ta_id === ta_id && t.personel_id === acc.personel_id && t.peran === 'pptk' && t.seksi_ta_id === seksi_ta_id && t.tmt_selesai === null,
  );
  if (!tgs) return false; // bukan definitif
  // Cek apakah ada delegasi aktif yang menggantikan pejabat definitif ini
  const dels = data.penugasanDelegasi.filter(
    (d) => d.ta_id === ta_id && d.status === 'Delegasi Aktif' && d.peran_digantikan === 'pptk' && d.seksi_ta_id === seksi_ta_id && d.definitive_officer_id === acc.personel_id,
  );
  // Jika ada delegasi aktif yang menggantikan pejabat ini, hak transaksi definitif nonaktif
  // TAPI: jika session user_id adalah akun dari delegasi pengganti, dia boleh transaksi
  // Jika session user_id adalah akun dari definitif yang digantikan, nonaktif
  if (dels.length > 0) {
    // Cek apakah session ini adalah delegasi pengganti (Plh.) atau definitif
    const isDelegasiPengganti = dels.some((d) => d.personel_pengganti_id === acc.personel_id);
    if (isDelegasiPengganti) return true; // Plh. PPTK boleh transaksi
    return false; // definitif digantikan, nonaktif
  }
  return true;
}

// F-33d/e: Snapshot penandatangan dari penugasan aktif
function _snapshotPenandatangan(ta_id: string, seksi_ta_id: string): {
  pa_kpa_nama: string; pa_kpa_nip: string;
  bendahara_nama: string; bendahara_nip: string;
  pptk_nama: string; pptk_nip: string;
} {
  const tgs = data.penugasanTA.filter((t) => t.ta_id === ta_id && t.tmt_selesai === null);
  const pa = tgs.find((t) => t.peran === 'pa_kpa');
  const bend = tgs.find((t) => t.peran === 'bendahara');
  // PPTK: cari definitif atau delegasi aktif untuk seksi ini
  let pptkNama = '—', pptkNip = '—';
  const pptkDef = tgs.find((t) => t.peran === 'pptk' && t.seksi_ta_id === seksi_ta_id);
  if (pptkDef) {
    // Cek apakah ada delegasi aktif yang menggantikan
    const dels = data.penugasanDelegasi.filter(
      (d) => d.ta_id === ta_id && d.status === 'Delegasi Aktif' && d.peran_digantikan === 'pptk' && d.seksi_ta_id === seksi_ta_id && d.definitive_officer_id === pptkDef.personel_id,
    );
    if (dels.length > 0) {
      // Gunakan snapshot delegasi (Plh.)
      pptkNama = `Plh. ${dels[0].nama_snapshot}`;
      pptkNip = dels[0].nip_snapshot;
    } else {
      pptkNama = pptkDef.nama_snapshot;
      pptkNip = pptkDef.nip_snapshot;
    }
  }
  // Bendahara: cek delegasi juga
  let bendNama = '—', bendNip = '—';
  if (bend) {
    const bendDels = data.penugasanDelegasi.filter(
      (d) => d.ta_id === ta_id && d.status === 'Delegasi Aktif' && d.peran_digantikan === 'bendahara' && d.definitive_officer_id === bend.personel_id,
    );
    if (bendDels.length > 0) {
      bendNama = `Plh. ${bendDels[0].nama_snapshot}`;
      bendNip = bendDels[0].nip_snapshot;
    } else {
      bendNama = bend.nama_snapshot;
      bendNip = bend.nip_snapshot;
    }
  }
  return {
    pa_kpa_nama: pa?.nama_snapshot ?? '—', pa_kpa_nip: pa?.nip_snapshot ?? '—',
    bendahara_nama: bendNama, bendahara_nip: bendNip,
    pptk_nama: pptkNama, pptk_nip: pptkNip,
  };
}

// E-26: ID versi alokasi terbaru
function _versiAlokasiTerbaru(ta_id: string): string | null {
  const versi = data.versiAlokasiAnggaran.filter((v) => v.ta_id === ta_id);
  if (versi.length === 0) return null;
  return versi[versi.length - 1].id;
}

// I-64: Ambil form by versi
function _getFormByVersion(jenis_belanja: string, versi: string) {
  return data.formDinamis.find((f) => f.jenis_belanja === jenis_belanja && f.versi === versi);
}

// SPJ-04: Cek field wajib terisi sebelum diajukan
function _cekWajib(form: FormDinamis, jawaban: Record<string, string | string[] | Record<string, string>[]>): string | null {
  for (const f of form.fields) {
    if (!f.wajib) continue;
    const val = jawaban[f.id];
    if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
      return `Field wajib "${f.label}" harus diisi sebelum SPJ diajukan.`;
    }
  }
  if (form.blok_berulang) {
    const entri = jawaban[form.blok_berulang.id];
    if (!entri || !Array.isArray(entri) || entri.length === 0) {
      return `Blok berulang "${form.blok_berulang.nama}" minimal harus memiliki satu entri.`;
    }
    for (let i = 0; i < entri.length; i++) {
      const row = entri[i] as Record<string, string>;
      for (const bf of form.blok_berulang.fields) {
        if (!bf.wajib) continue;
        const v = row?.[bf.id];
        if (v === undefined || v === '') {
          return `Field wajib "${bf.label}" pada entri ${i + 1} blok "${form.blok_berulang.nama}" harus diisi.`;
        }
      }
    }
  }
  return null;
}

// D01 §11 / D03 §10: identitas perjalanan dinas (NIP/NIK + rentang tanggal efektif) dari jawaban SPJ
type IdentitasJadwal = { nip: string; mulai: string; selesai: string };
function _identitasJadwal(form: FormDinamis, jawaban: SPJ['jawaban']): IdentitasJadwal[] {
  const cari = (fields: FieldFormDinamis[], tag: string) => fields.find((f) => f.system_tag === tag);
  const ambil = (src: Record<string, unknown>, f: FieldFormDinamis | undefined) => (f ? String(src[f.id] ?? '').trim() : '');
  const mulaiUtama = ambil(jawaban, cari(form.fields, '[SYS_START_DATE]'));
  const selesaiUtama = ambil(jawaban, cari(form.fields, '[SYS_END_DATE]'));
  const out: IdentitasJadwal[] = [];
  const tambah = (nip: string, mulai: string, selesai: string) => {
    if (nip && mulai) out.push({ nip, mulai, selesai: selesai || mulai });
  };
  tambah(ambil(jawaban, cari(form.fields, '[SYS_PERSONNEL_ID]')), mulaiUtama, selesaiUtama);
  if (form.blok_berulang) {
    const bf = form.blok_berulang.fields;
    const rows = jawaban[form.blok_berulang.id];
    if (Array.isArray(rows)) {
      for (const row of rows) {
        if (typeof row !== 'object') continue;
        tambah(
          ambil(row, cari(bf, '[SYS_PERSONNEL_ID]')),
          ambil(row, cari(bf, '[SYS_START_DATE]')) || mulaiUtama,
          ambil(row, cari(bf, '[SYS_END_DATE]')) || selesaiUtama,
        );
      }
    }
  }
  return out;
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

  // ===== KUI-01 — Buat/ubah kuitansi (D02 §3, D03 §4 poin 4) =====
  // Membuat kuitansi baru: hanya PPTK seksi pemilik, TA Aktif Penuh, gatekeeper terbuka.
  // Simpan snapshot versi alokasi (E-26) dan snapshot penandatangan (F-33d/e).
  buatKuitansi: (input: {
    ta_id: string;
    seksi_ta_id: string;
    pemetaan_subkegiatan_id: string;
    rekening_id: string;
    penerima: string;
    bruto: number;
    uraian: string;
    tanggal_kuitansi: string;
  }, session: SessionPayload): { ok: boolean; error?: string; kuitansi?: Kuitansi } => {
    const ta = data.tahunAnggaran.find((t) => t.id === input.ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    // B-10c: TA Masa Transisi menolak kuitansi baru
    if (!repo.canCreateKuitansi(input.ta_id)) return { ok: false, error: `Kuitansi baru hanya dapat dibuat pada TA Aktif Penuh. Status TA saat ini: ${ta.status}.` };
    // C-17/C-15: gatekeeper harus terbuka
    const g = gerbangStatus(input.ta_id);
    if (!g.terbuka) return { ok: false, error: 'Gatekeeper tertutup. Seluruh seksi harus Seimbang dan Bendahara harus menekan Sahkan.' };
    // PPTK hanya untuk seksinya
    if (session.active_role !== 'pptk' || session.active_seksi_id !== input.seksi_ta_id) {
      return { ok: false, error: 'Hanya PPTK seksi pemilik yang dapat membuat kuitansi.' };
    }
    // B-10f: hak transaksi pejabat definitif nonaktif selama delegasi Plh./Plt.
    if (!_isDefinitifAktifForSeksi(session, input.seksi_ta_id)) {
      return { ok: false, error: 'Hak transaksi pejabat definitif nonaktif selama delegasi Plh./Plt. berlaku.' };
    }
    const pem = data.pemetaanSubkegiatanTA.find((p) => p.id === input.pemetaan_subkegiatan_id && p.seksi_ta_id === input.seksi_ta_id);
    if (!pem) return { ok: false, error: 'Subkegiatan tidak terpetakan untuk seksi ini.' };
    const alokasi = data.alokasiRekening.find((a) => a.pemetaan_subkegiatan_id === input.pemetaan_subkegiatan_id && a.rekening_id === input.rekening_id && a.disahkan);
    if (!alokasi) return { ok: false, error: 'Rekening belanja belum dialokasikan atau belum disahkan.' };
    if (!Number.isInteger(input.bruto) || input.bruto <= 0) return { ok: false, error: 'Nominal bruto harus bilangan bulat rupiah lebih dari nol.' };
    if (!input.penerima.trim()) return { ok: false, error: 'Nama penerima wajib diisi.' };
    if (!input.uraian.trim()) return { ok: false, error: 'Uraian pembayaran wajib diisi.' };
    if (!input.tanggal_kuitansi) return { ok: false, error: 'Tanggal kuitansi wajib diisi.' };
    // Komitmen tidak boleh melebihi Sisa SPD Bebas
    const sisa = sisaSpdBebas(alokasi);
    if (input.bruto > sisa) return { ok: false, error: `Nominal bruto ${formatRupiahLocal(input.bruto)} melebihi Sisa SPD Bebas ${formatRupiahLocal(sisa)}.` };
    // Snapshot penandatangan dari penugasan aktif (F-33d/e)
    const snaps = _snapshotPenandatangan(input.ta_id, input.seksi_ta_id);
    // E-26: snapshot versi alokasi
    const versiSnap = _versiAlokasiTerbaru(input.ta_id);
    const id = `kui-${Date.now()}`;
    const k: Kuitansi = {
      id, ta_id: input.ta_id, seksi_ta_id: input.seksi_ta_id,
      pemetaan_subkegiatan_id: input.pemetaan_subkegiatan_id,
      rekening_id: input.rekening_id,
      penerima: input.penerima.trim(), bruto: input.bruto, uraian: input.uraian.trim(),
      tanggal_kuitansi: input.tanggal_kuitansi, status: 'Aktif',
      pa_kpa_nama: snaps.pa_kpa_nama, pa_kpa_nip: snaps.pa_kpa_nip,
      bendahara_nama: snaps.bendahara_nama, bendahara_nip: snaps.bendahara_nip,
      pptk_nama: snaps.pptk_nama, pptk_nip: snaps.pptk_nip,
      versi_alokasi_snapshot_id: versiSnap,
    };
    data.kuitansi.push(k);
    ta.pernah_transaksi = true;
    return { ok: true, kuitansi: k };
  },

  // KUI-01 — Ubah kuitansi Aktif (hanya TA Aktif Penuh)
  ubahKuitansi: (kuitansi_id: string, perubahan: {
    penerima?: string; bruto?: number; uraian?: string; tanggal_kuitansi?: string;
  }, session: SessionPayload): { ok: boolean; error?: string } => {
    const k = data.kuitansi.find((x) => x.id === kuitansi_id);
    if (!k) return { ok: false, error: 'Kuitansi tidak ditemukan.' };
    const ta = data.tahunAnggaran.find((t) => t.id === k.ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    // B-10c: Masa Transisi menolak edit
    if (!repo.canEditKuitansi(k.ta_id)) return { ok: false, error: `Edit kuitansi hanya pada TA Aktif Penuh. Status TA: ${ta.status}.` };
    // KUI-02: hanya Aktif yang bisa diedit
    if (k.status !== 'Aktif') return { ok: false, error: 'Kuitansi Terkunci tidak dapat diedit. Lepas SPJ terlebih dahulu.' };
    if (session.active_role !== 'pptk' || session.active_seksi_id !== k.seksi_ta_id) {
      return { ok: false, error: 'Hanya PPTK seksi pemilik yang dapat mengubah kuitansi.' };
    }
    if (perubahan.bruto !== undefined) {
      if (!Number.isInteger(perubahan.bruto) || perubahan.bruto <= 0) return { ok: false, error: 'Nominal bruto harus bilangan bulat rupiah lebih dari nol.' };
      const alokasi = data.alokasiRekening.find((a) => a.pemetaan_subkegiatan_id === k.pemetaan_subkegiatan_id && a.rekening_id === k.rekening_id && a.disahkan);
      if (!alokasi) return { ok: false, error: 'Alokasi rekening tidak ditemukan.' };
      // Hitung sisa SPD bebas dikurangi komitmen kuitansi ini sendiri
      const sisa = sisaSpdBebas(alokasi) + k.bruto; // kuitansi ini sendiri termasuk dalam komitmen
      if (perubahan.bruto > sisa) return { ok: false, error: `Nominal bruto ${formatRupiahLocal(perubahan.bruto)} melebihi Sisa SPD Bebas ${formatRupiahLocal(sisa - k.bruto + k.bruto)}.` };
    }
    if (perubahan.penerima !== undefined && !perubahan.penerima.trim()) return { ok: false, error: 'Nama penerima wajib diisi.' };
    if (perubahan.uraian !== undefined && !perubahan.uraian.trim()) return { ok: false, error: 'Uraian pembayaran wajib diisi.' };
    if (perubahan.penerima !== undefined) k.penerima = perubahan.penerima.trim();
    if (perubahan.bruto !== undefined) k.bruto = perubahan.bruto;
    if (perubahan.uraian !== undefined) k.uraian = perubahan.uraian.trim();
    if (perubahan.tanggal_kuitansi !== undefined) k.tanggal_kuitansi = perubahan.tanggal_kuitansi;
    return { ok: true };
  },

  // KUI-02 — Batalkan kuitansi Aktif: hapus tanpa jejak (F-33a), lepas komitmen
  batalkanKuitansi: (kuitansi_id: string, session: SessionPayload): { ok: boolean; error?: string } => {
    const k = data.kuitansi.find((x) => x.id === kuitansi_id);
    if (!k) return { ok: false, error: 'Kuitansi tidak ditemukan.' };
    const ta = data.tahunAnggaran.find((t) => t.id === k.ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    // B-10c: Masa Transisi hanya batal, tidak edit
    if (!repo.canBatalkanKuitansi(k.ta_id)) return { ok: false, error: `Pembatalan tidak diizinkan pada status TA: ${ta.status}.` };
    if (k.status !== 'Aktif') return { ok: false, error: 'Hanya kuitansi Aktif yang dapat dibatalkan.' };
    if (session.active_role !== 'pptk' || session.active_seksi_id !== k.seksi_ta_id) {
      return { ok: false, error: 'Hanya PPTK seksi pemilik yang dapat membatalkan kuitansi.' };
    }
    // F-33a: hapus tanpa jejak, termasuk audit terkait
    purgeAuditForKuitansi(kuitansi_id);
    removeAll(data.kuitansi, (x) => x.id === kuitansi_id);
    return { ok: true };
  },

  // KUI-02 — Kunci kuitansi saat SPJ Draft dibuat
  _kunciKuitansi: (kuitansi_id: string) => {
    const k = data.kuitansi.find((x) => x.id === kuitansi_id);
    if (k) k.status = 'Terkunci';
  },

  // KUI-02 — Lepas kunci kuitansi saat SPJ Draft dihapus/dilepas
  _bukaKunciKuitansi: (kuitansi_id: string) => {
    const k = data.kuitansi.find((x) => x.id === kuitansi_id);
    if (k && k.status === 'Terkunci') k.status = 'Aktif';
  },

  kuitansiById: (id: string): Kuitansi | undefined =>
    data.kuitansi.find((k) => k.id === id),

  // ===== SPJ-01 — Buat SPJ 1:1 & pilih jenis belanja (D02 §5) =====
  buatSPJ: (input: {
    ta_id: string;
    kuitansi_id: string;
    jenis_belanja: string;
  }, session: SessionPayload): { ok: boolean; error?: string; spj?: SPJ } => {
    const ta = data.tahunAnggaran.find((t) => t.id === input.ta_id);
    if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
    if (!repo.canCreateSPJ(input.ta_id)) return { ok: false, error: `SPJ baru hanya pada TA Aktif Penuh. Status: ${ta.status}.` };
    if (!gerbangStatus(input.ta_id).terbuka) return { ok: false, error: 'Gatekeeper tertutup. SPJ baru belum dapat dibuat.' };
    const k = data.kuitansi.find((x) => x.id === input.kuitansi_id);
    if (!k) return { ok: false, error: 'Kuitansi tidak ditemukan.' };
    if (k.ta_id !== input.ta_id) return { ok: false, error: 'Kuitansi tidak tergabung dalam TA ini.' };
    // F-30: 1:1, tidak boleh ada SPJ untuk kuitansi yang sudah punya SPJ
    if (data.spj.some((s) => s.kuitansi_id === input.kuitansi_id)) return { ok: false, error: 'Kuitansi ini sudah memiliki SPJ. Satu kuitansi hanya berpasangan dengan satu SPJ.' };
    if (session.active_role !== 'pptk' || session.active_seksi_id !== k.seksi_ta_id) {
      return { ok: false, error: 'Hanya PPTK seksi pemilik yang dapat membuat SPJ.' };
    }
    if (!input.jenis_belanja.trim()) return { ok: false, error: 'Jenis belanja wajib dipilih.' };
    // Ambil versi form terbaru untuk jenis belanja ini (I-64: snapshot versi)
    const form = data.formDinamis
      .filter((f) => f.jenis_belanja === input.jenis_belanja)
      .sort((a, b) => Number(b.versi.slice(1)) - Number(a.versi.slice(1)))[0];
    if (!form) return { ok: false, error: 'Form Dinamis untuk jenis belanja ini belum dibuat.' };
    const id = `spj-${Date.now()}`;
    const spj: SPJ = {
      id, ta_id: input.ta_id, kuitansi_id: input.kuitansi_id,
      jenis_belanja: input.jenis_belanja, versi_form: form.versi,
      jawaban: {}, entri_pajak: [],
      lampiran_nama_asli: null, lampiran_ukuran_asal: null,
      lampiran_ukuran_final: null, lampiran_status_optimasi: null,
      catatan_revisi: null, status: 'Draft',
    };
    data.spj.push(spj);
    // Kunci kuitansi (KUI-02 / F-30a)
    repo._kunciKuitansi(input.kuitansi_id);
    return { ok: true, spj };
  },

  // SPJ-04 — Simpan jawaban Form Dinamis SPJ
  simpanJawabanSPJ: (spj_id: string, jawaban: Record<string, string | string[] | Record<string, string>[]>, session: SessionPayload): { ok: boolean; error?: string } => {
    const spj = data.spj.find((s) => s.id === spj_id);
    if (!spj) return { ok: false, error: 'SPJ tidak ditemukan.' };
    if (session.active_role !== 'pptk') return { ok: false, error: 'Hanya PPTK yang dapat menyimpan jawaban SPJ.' };
    const k = data.kuitansi.find((x) => x.id === spj.kuitansi_id);
    if (!k || session.active_seksi_id !== k.seksi_ta_id) return { ok: false, error: 'SPJ bukan milik seksi ini.' };
    if (!repo.canCreateSPJ(k.ta_id)) return { ok: false, error: 'Jawaban SPJ hanya dapat diubah pada TA Aktif Penuh.' };
    if (spj.status !== 'Draft') return { ok: false, error: 'SPJ yang sudah Terkunci tidak dapat diubah.' };
    spj.jawaban = jawaban;
    return { ok: true };
  },

  // SPJ-02 — Ajukan SPJ ke Verifikator (kunci SPJ)
  ajukanSPJ: (spj_id: string, session: SessionPayload): { ok: boolean; error?: string } => {
    const spj = data.spj.find((s) => s.id === spj_id);
    if (!spj) return { ok: false, error: 'SPJ tidak ditemukan.' };
    if (session.active_role !== 'pptk') return { ok: false, error: 'Hanya PPTK yang dapat mengajukan SPJ.' };
    const k = data.kuitansi.find((x) => x.id === spj.kuitansi_id);
    if (!k || session.active_seksi_id !== k.seksi_ta_id) return { ok: false, error: 'SPJ bukan milik seksi ini.' };
    if (!repo.canAksiSPJ(spj.ta_id)) return { ok: false, error: 'Pengajuan SPJ tidak diizinkan pada status TA saat ini.' };
    if (spj.status !== 'Draft') return { ok: false, error: 'Hanya SPJ Draft yang dapat diajukan.' };
    // SPJ-04: field wajib harus terisi
    const form = _getFormByVersion(spj.jenis_belanja, spj.versi_form);
    if (form) {
      const errWajib = _cekWajib(form, spj.jawaban);
      if (errWajib) return { ok: false, error: errWajib };
    }
    const milikSaya = form ? _identitasJadwal(form, spj.jawaban) : [];
    for (const lain of data.spj) {
      if (lain.id === spj.id || lain.ta_id !== spj.ta_id || lain.status === 'Draft') continue;
      const formLain = _getFormByVersion(lain.jenis_belanja, lain.versi_form);
      if (!formLain) continue;
      for (const a of milikSaya) {
        for (const b of _identitasJadwal(formLain, lain.jawaban)) {
          if (a.nip === b.nip && a.mulai <= b.selesai && a.selesai >= b.mulai) {
            return { ok: false, error: `Bentrok jadwal: NIP/NIK ${a.nip} sudah tercatat pada SPJ lain di TA ini untuk tanggal ${b.mulai} s.d. ${b.selesai}. SPJ tetap Draft.` };
          }
        }
      }
    }
    spj.status = 'Terkunci';
    recordAudit({ ta_id: spj.ta_id, entitas: `SPJ ${spj.jenis_belanja}`, aksi: 'aksi_administratif', nilai_sesudah: 'SPJ diajukan ke Verifikator', spj_id: spj.id, kuitansi_id: spj.kuitansi_id });
    return { ok: true };
  },

  // SPJ-02 — Verifikator kembalikan SPJ ke Draft (buka kunci SPJ, kuitansi tetap Terkunci)
  kembalikanSPJ: (spj_id: string, catatan: string, session: SessionPayload): { ok: boolean; error?: string } => {
    const spj = data.spj.find((s) => s.id === spj_id);
    if (!spj) return { ok: false, error: 'SPJ tidak ditemukan.' };
    if (session.active_role !== 'verifikator') return { ok: false, error: 'Hanya Verifikator yang dapat mengembalikan SPJ.' };
    if (!repo.canAksiSPJ(spj.ta_id)) return { ok: false, error: 'Pengembalian SPJ tidak diizinkan pada status TA saat ini.' };
    if (spj.status !== 'Terkunci') return { ok: false, error: 'Hanya SPJ Terkunci yang dapat dikembalikan.' };
    if (!catatan.trim()) return { ok: false, error: 'Catatan revisi wajib diisi.' };
    spj.status = 'Draft';
    spj.catatan_revisi = catatan.trim();
    recordAudit({ ta_id: spj.ta_id, entitas: `SPJ ${spj.jenis_belanja}`, aksi: 'verifikasi_kembalikan', nilai_sesudah: `Dikembalikan: ${catatan.trim()}`, spj_id: spj.id, kuitansi_id: spj.kuitansi_id });
    return { ok: true };
  },

  // SPJ-02 — Verifikator setujui SPJ -> Menunggu BKU
  setujuiSPJ: (spj_id: string, session: SessionPayload): { ok: boolean; error?: string } => {
    const spj = data.spj.find((s) => s.id === spj_id);
    if (!spj) return { ok: false, error: 'SPJ tidak ditemukan.' };
    if (session.active_role !== 'verifikator') return { ok: false, error: 'Hanya Verifikator yang dapat menyetujui SPJ.' };
    if (!repo.canAksiSPJ(spj.ta_id)) return { ok: false, error: 'Persetujuan SPJ tidak diizinkan pada status TA saat ini.' };
    if (spj.status !== 'Terkunci') return { ok: false, error: 'Hanya SPJ Terkunci yang dapat disetujui.' };
    spj.status = 'Menunggu BKU';
    recordAudit({ ta_id: spj.ta_id, entitas: `SPJ ${spj.jenis_belanja}`, aksi: 'verifikasi_setujui', nilai_sesudah: 'SPJ disetujui, Menunggu BKU', spj_id: spj.id, kuitansi_id: spj.kuitansi_id });
    return { ok: true };
  },

  // SPJ-03 — Lepas SPJ Draft: kuitansi kembali Aktif, hapus SPJ tanpa jejak
  lepasSPJ: (spj_id: string, session: SessionPayload): { ok: boolean; error?: string } => {
    const spj = data.spj.find((s) => s.id === spj_id);
    if (!spj) return { ok: false, error: 'SPJ tidak ditemukan.' };
    const k = data.kuitansi.find((x) => x.id === spj.kuitansi_id);
    if (!k) return { ok: false, error: 'Kuitansi terkait tidak ditemukan.' };
    if (session.active_role !== 'pptk' || session.active_seksi_id !== k.seksi_ta_id) {
      return { ok: false, error: 'Hanya PPTK seksi pemilik yang dapat melepas SPJ.' };
    }
    if (!repo.canAksiSPJ(spj.ta_id)) return { ok: false, error: 'Pelepasan SPJ tidak diizinkan pada status TA saat ini.' };
    // Hanya Draft yang bisa dilepas (SPJ-03)
    if (spj.status !== 'Draft') return { ok: false, error: 'Hanya SPJ Draft yang dapat dilepas. SPJ Terkunci harus dikembalikan Verifikator terlebih dahulu.' };
    // F-33a: hapus tanpa jejak
    purgeAuditForSPJ(spj_id);
    removeAll(data.spj, (s) => s.id === spj_id);
    // Kuitansi kembali Aktif (F-30c)
    repo._bukaKunciKuitansi(spj.kuitansi_id);
    return { ok: true };
  },

  // SPJ-03 — Batalkan SPJ Draft: sama dengan lepas, hapus tanpa jejak
  batalkanSPJ: (spj_id: string, session: SessionPayload): { ok: boolean; error?: string } => {
    return repo.lepasSPJ(spj_id, session);
  },

  spjById: (id: string): SPJ | undefined =>
    data.spj.find((s) => s.id === id),

  // ===== BNT-04 — Auto-fill nama dari Direktori Transaksional =====
  lookupDirektori: (nip_nik: string): DirektoriTransaksionalSPJ | undefined =>
    data.direktoriTransaksional.find((d) => d.nip_nik === nip_nik.trim()),

  // BNT-04 — Catat/simpan pasangan NIP/NIK + nama ke direktori saat SPJ disimpan/diajukan
  catatDirektori: (nip_nik: string, nama: string, spj_id: string) => {
    const key = nip_nik.trim();
    if (!key || !nama.trim()) return;
    const existing = data.direktoriTransaksional.find((d) => d.nip_nik === key);
    if (existing) {
      if (!existing.referensi_spj_ids.includes(spj_id)) {
        existing.referensi_spj_ids.push(spj_id);
      }
    } else {
      data.direktoriTransaksional.push({
        id: `dir-${Date.now()}`,
        nip_nik: key, nama: nama.trim(), referensi_spj_ids: [spj_id],
      });
    }
  },

  // ===== Helper: Form Dinamis by versi (I-64) =====
  getFormByVersion: (jenis_belanja: string, versi: string): FormDinamis | undefined =>
    data.formDinamis.find((f) => f.jenis_belanja === jenis_belanja && f.versi === versi),

  // ===== Jenis belanja tersedia (dari Form Dinamis) =====
  jenisBelanjaList: (): string[] =>
    [...new Set(data.formDinamis.map((f) => f.jenis_belanja))],
};
