// Drill-down anggaran Seksi → Subkegiatan → Rekening (DRL-01, DRL-02).
// Cakupan peran ditegakkan di sini. Tingkat yang tidak boleh dilihat peran tidak dihitung dan tidak dikembalikan.
// Nominal bilangan bulat rupiah tanpa sen.

import * as data from '@/data/sampleData';
import type { AlokasiRekening, Role } from '@/data/types';
import * as anggaran from '@/data/anggaran';
import type { AktorAnggaran } from '@/data/anggaran';

type Hasil<T> = { ok: true; data: T } | { ok: false; error: string };

export interface AngkaTingkat {
  pagu: number;
  realisasi: number;
  komitmen: number;
  sisaSpdBebas: number;
  serapanPersen: number;
  seimbang: boolean;
}

export interface BarisSeksi extends AngkaTingkat {
  seksi_ta_id: string;
  nama: string;
  status: anggaran.StatusSeksi;
}

export interface BarisSubkegiatan extends AngkaTingkat {
  pemetaan_id: string;
  kode: string;
  nama: string;
}

export interface BarisRekening extends AngkaTingkat {
  alokasi_id: string;
  kode: string;
  nama: string;
}

function angka(pagu: number, realisasi: number, komitmen: number, sisa: number, seimbang: boolean): AngkaTingkat {
  return {
    pagu,
    realisasi,
    komitmen,
    sisaSpdBebas: sisa,
    serapanPersen: pagu > 0 ? ((realisasi + komitmen) / pagu) * 100 : 0,
    seimbang,
  };
}

function rekeningPemetaan(ta_id: string, pemetaan_id: string): AlokasiRekening[] {
  return data.alokasiRekening.filter((a) => a.ta_id === ta_id && a.pemetaan_subkegiatan_id === pemetaan_id);
}

function pemetaanSeksi(ta_id: string, seksi_ta_id: string) {
  return data.pemetaanSubkegiatanTA.filter((p) => p.ta_id === ta_id && p.seksi_ta_id === seksi_ta_id);
}

// Cakupan per peran (Dokumen 01 §7 poin 5; Dokumen 03 §4 poin 8). Admin dan Pengawas tidak punya drill-down.
export type TingkatDrill = 'seksi' | 'subkegiatan' | 'rekening';

const CAKUPAN: Record<Role, TingkatDrill | null> = {
  bendahara: 'rekening',
  verifikator: 'rekening',
  pa_kpa: 'subkegiatan',
  pptk: 'rekening',
  admin: null,
  pengawas: null,
};

function izinkan(aktor: AktorAnggaran, tingkat: TingkatDrill, seksi_ta_id?: string): string | null {
  const batas = CAKUPAN[aktor.peran as Role] ?? null;
  if (!batas) return 'Peran ini tidak memiliki tampilan drill-down anggaran.';
  const urutan: TingkatDrill[] = ['seksi', 'subkegiatan', 'rekening'];
  if (urutan.indexOf(tingkat) > urutan.indexOf(batas)) return 'Peran ini tidak dapat membuka tingkat rekening belanja.';
  if (aktor.peran === 'pptk' && seksi_ta_id !== undefined && seksi_ta_id !== aktor.seksi_ta_id) {
    return 'PPTK hanya dapat melihat seksinya sendiri.';
  }
  return null;
}

export function drillSeksi(ta_id: string, aktor: AktorAnggaran): Hasil<BarisSeksi[]> {
  const err = izinkan(aktor, 'seksi');
  if (err) return { ok: false, error: err };
  const semua = data.seksiTA.filter((s) => s.ta_id === ta_id);
  const daftar = aktor.peran === 'pptk' ? semua.filter((s) => s.id === aktor.seksi_ta_id) : semua;
  const baris = daftar.map((s): BarisSeksi => {
    const subs = drillSubkegiatanRows(ta_id, s.id);
    const pagu = subs.reduce((t, x) => t + x.pagu, 0);
    const realisasi = subs.reduce((t, x) => t + x.realisasi, 0);
    const komitmen = subs.reduce((t, x) => t + x.komitmen, 0);
    const sisa = subs.reduce((t, x) => t + x.sisaSpdBebas, 0);
    const status = anggaran.statusSeksi(ta_id, s.id);
    return { seksi_ta_id: s.id, nama: s.nama_snapshot, status, ...angka(pagu, realisasi, komitmen, sisa, status === 'Tuntas (100% Seimbang)') };
  });
  return { ok: true, data: baris };
}

function drillSubkegiatanRows(ta_id: string, seksi_ta_id: string): BarisSubkegiatan[] {
  return pemetaanSeksi(ta_id, seksi_ta_id).map((p): BarisSubkegiatan => {
    const rek = rekeningPemetaan(ta_id, p.id);
    const realisasi = rek.reduce((t, a) => t + anggaran.realisasiAlokasi(a), 0);
    const komitmen = rek.reduce((t, a) => t + anggaran.komitmenAlokasi(a), 0);
    const sisa = rek.reduce((t, a) => t + anggaran.sisaSpdBebas(a), 0);
    return {
      pemetaan_id: p.id,
      kode: p.kode_snapshot,
      nama: p.nama_snapshot,
      ...angka(anggaran.paguSubkegiatan(p.id), realisasi, komitmen, sisa, anggaran.pemetaanSeimbang(p.id)),
    };
  });
}

export function drillSubkegiatan(ta_id: string, seksi_ta_id: string, aktor: AktorAnggaran): Hasil<BarisSubkegiatan[]> {
  const err = izinkan(aktor, 'subkegiatan', seksi_ta_id);
  if (err) return { ok: false, error: err };
  return { ok: true, data: drillSubkegiatanRows(ta_id, seksi_ta_id) };
}

export function drillRekening(ta_id: string, pemetaan_id: string, aktor: AktorAnggaran): Hasil<BarisRekening[]> {
  const pem = data.pemetaanSubkegiatanTA.find((p) => p.id === pemetaan_id && p.ta_id === ta_id);
  if (!pem) return { ok: false, error: 'Subkegiatan tidak ditemukan pada TA ini.' };
  const err = izinkan(aktor, 'rekening', pem.seksi_ta_id);
  if (err) return { ok: false, error: err };
  const seimbang = anggaran.pemetaanSeimbang(pemetaan_id);
  return {
    ok: true,
    data: rekeningPemetaan(ta_id, pemetaan_id).map((a): BarisRekening => ({
      alokasi_id: a.id,
      kode: a.kode_rekening_snapshot,
      nama: a.nama_rekening_snapshot,
      ...angka(a.pagu, anggaran.realisasiAlokasi(a), anggaran.komitmenAlokasi(a), anggaran.sisaSpdBebas(a), seimbang),
    })),
  };
}
