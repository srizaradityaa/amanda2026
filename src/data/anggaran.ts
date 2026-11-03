// Aturan anggaran Bagian 1 Langkah 4 (Dokumen 01 §2–4, Dokumen 03 §494).
// Semua perhitungan dan penolakan terjadi di sini, bukan di tampilan.
// Nominal bilangan bulat rupiah tanpa sen.

import * as data from '@/data/sampleData';
import type { AlokasiRekening, FaseAlokasi, LedgerSPD, RincianVersiAlokasi, TahunAnggaran, VersiAlokasiAnggaran } from '@/data/types';
import { recordAudit } from '@/lib/audit';
import { formatRupiah } from '@/lib/format';
import { nowWita } from '@/lib/wita';

export interface AktorAnggaran {
  id: string;
  nama: string;
  peran: string;
  seksi_ta_id: string | null;
}

export type Hasil = { ok: boolean; error?: string };

const JENDELA_FORMAT = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

export function taById(ta_id: string): TahunAnggaran | undefined {
  return data.tahunAnggaran.find((t) => t.id === ta_id);
}

function pemetaanOfTA(ta_id: string) {
  return data.pemetaanSubkegiatanTA.filter((p) => p.ta_id === ta_id);
}

function alokasiSubByPemetaan(pemetaan_id: string) {
  return data.alokasiSubkegiatan.find((a) => a.pemetaan_subkegiatan_id === pemetaan_id);
}

function alokasiRekByPemetaan(pemetaan_id: string) {
  return data.alokasiRekening.filter((a) => a.pemetaan_subkegiatan_id === pemetaan_id);
}

function isBilanganBulat(n: number) {
  return Number.isInteger(n) && n >= 0;
}

// ===== Komitmen, realisasi, sisa SPD bebas (SPD-01) =====

function kuitansiAlokasi(a: AlokasiRekening) {
  return data.kuitansi.filter(
    (k) => k.ta_id === a.ta_id && k.pemetaan_subkegiatan_id === a.pemetaan_subkegiatan_id && k.rekening_id === a.rekening_id,
  );
}

function sudahBKU(kuitansi_id: string) {
  return data.bku.some((b) => b.kuitansi_id === kuitansi_id && b.status === 'Aktif');
}

export function realisasiAlokasi(a: AlokasiRekening): number {
  return kuitansiAlokasi(a).filter((k) => sudahBKU(k.id)).reduce((s, k) => s + k.bruto, 0);
}

export function komitmenAlokasi(a: AlokasiRekening): number {
  return kuitansiAlokasi(a)
    .filter((k) => (k.status === 'Aktif' || k.status === 'Terkunci') && !sudahBKU(k.id))
    .reduce((s, k) => s + k.bruto, 0);
}

export function terpakaiAlokasi(a: AlokasiRekening): number {
  return realisasiAlokasi(a) + komitmenAlokasi(a);
}

export function sisaSpdBebas(a: AlokasiRekening): number {
  return a.spd_aktif - komitmenAlokasi(a) - realisasiAlokasi(a);
}

// ===== Pagu Induk dan pagu subkegiatan (ALK-01, ALK-02, TA-09) =====

// Pagu Induk yang berlaku: Pagu Induk APBD-P bila fase perubahan aktif.
export function paguIndukAktif(ta_id: string): number {
  const ta = taById(ta_id);
  if (!ta) return 0;
  return ta.mode_apbd_p && ta.pagu_induk_perubahan !== null ? ta.pagu_induk_perubahan : ta.pagu_induk;
}

export function paguSubkegiatan(pemetaan_id: string): number {
  return alokasiSubByPemetaan(pemetaan_id)?.pagu ?? 0;
}

export function paguSeksi(ta_id: string, seksi_ta_id: string): number {
  return pemetaanOfTA(ta_id)
    .filter((p) => p.seksi_ta_id === seksi_ta_id)
    .reduce((s, p) => s + paguSubkegiatan(p.id), 0);
}

export function totalRekeningPemetaan(pemetaan_id: string): number {
  return alokasiRekByPemetaan(pemetaan_id).reduce((s, a) => s + a.pagu, 0);
}

export function selisihAlokasiInstansi(ta_id: string): number {
  if (!taById(ta_id)) return 0;
  const total = data.alokasiSubkegiatan.filter((a) => a.ta_id === ta_id).reduce((s, a) => s + a.pagu, 0);
  return paguIndukAktif(ta_id) - total;
}

// ===== Status alokasi seksi (ALK-03, ALK-04, ALK-05) =====

export type StatusSeksi = 'Belum Input' | 'Draft Belum Seimbang' | 'Tuntas (100% Seimbang)';

export function pemetaanSeimbang(pemetaan_id: string): boolean {
  const sub = alokasiSubByPemetaan(pemetaan_id);
  if (!sub) return false;
  const rek = alokasiRekByPemetaan(pemetaan_id);
  return rek.length > 0 && totalRekeningPemetaan(pemetaan_id) === sub.pagu;
}

export function statusSeksi(ta_id: string, seksi_ta_id: string): StatusSeksi {
  const pems = pemetaanOfTA(ta_id).filter((p) => p.seksi_ta_id === seksi_ta_id);
  const adaIsi = pems.some((p) => alokasiSubByPemetaan(p.id) || alokasiRekByPemetaan(p.id).length > 0);
  if (!adaIsi) return 'Belum Input';
  if (pems.length > 0 && pems.every((p) => pemetaanSeimbang(p.id))) return 'Tuntas (100% Seimbang)';
  return 'Draft Belum Seimbang';
}

export function sudahDisahkan(ta_id: string): boolean {
  return data.alokasiRekening.some((a) => a.ta_id === ta_id && a.disahkan);
}

// Gerbang tanggung renteng (ALK-05): terbuka hanya bila disahkan dan seluruh seksi Aktif Tuntas.
export function gerbangStatus(ta_id: string) {
  const seksiList = data.seksiTA.filter((s) => s.ta_id === ta_id && s.status === 'Aktif');
  const seksiBelum = seksiList
    .map((s) => ({ id: s.id, nama: s.nama_snapshot, status: statusSeksi(ta_id, s.id) }))
    .filter((x) => x.status !== 'Tuntas (100% Seimbang)');
  const disahkan = sudahDisahkan(ta_id);
  return { terbuka: disahkan && seksiBelum.length === 0, disahkan, seksiBelum };
}

// ===== Jendela waktu alokasi (ALK-04) =====

export function jendelaTutup(ta_id: string): string | null {
  return data.jendelaAlokasi.find((j) => j.ta_id === ta_id)?.tutup_wita ?? null;
}

export function jendelaTerbuka(ta_id: string): boolean {
  const tutup = jendelaTutup(ta_id);
  return tutup !== null && tutup > nowWita();
}

export function aturJendela(ta_id: string, tutup_wita: string, aktor: AktorAnggaran): Hasil {
  if (aktor.peran !== 'bendahara') return { ok: false, error: 'Hanya Bendahara Pengeluaran yang mengatur jendela waktu.' };
  if (!taById(ta_id)) return { ok: false, error: 'TA tidak ditemukan.' };
  if (!JENDELA_FORMAT.test(tutup_wita)) return { ok: false, error: 'Format waktu tutup harus tanggal dan jam WITA.' };
  if (tutup_wita <= nowWita()) return { ok: false, error: 'Waktu penutupan harus setelah waktu sekarang.' };
  const j = data.jendelaAlokasi.find((x) => x.ta_id === ta_id);
  if (j) j.tutup_wita = tutup_wita;
  else data.jendelaAlokasi.push({ ta_id, tutup_wita });
  recordAudit({ ta_id, entitas: `Jendela alokasi TA ${taById(ta_id)?.tahun}`, aksi: 'aksi_administratif', nilai_sesudah: `Ditutup ${tutup_wita} WITA` });
  return { ok: true };
}

// ===== Versi alokasi, append-only (ALK-07) =====

export function versiByTA(ta_id: string): VersiAlokasiAnggaran[] {
  return data.versiAlokasiAnggaran.filter((v) => v.ta_id === ta_id);
}

export function faseAktif(ta_id: string): FaseAlokasi {
  return taById(ta_id)?.mode_apbd_p ? 'perubahan' : 'murni';
}

function catatVersi(ta_id: string, aktor: AktorAnggaran, keterangan: string, fase: FaseAlokasi = faseAktif(ta_id)) {
  const rincian: RincianVersiAlokasi[] = [
    ...data.alokasiSubkegiatan.filter((a) => a.ta_id === ta_id).map((a) => ({ pemetaan_subkegiatan_id: a.pemetaan_subkegiatan_id, rekening_id: null, pagu: a.pagu })),
    ...data.alokasiRekening.filter((a) => a.ta_id === ta_id).map((a) => ({ pemetaan_subkegiatan_id: a.pemetaan_subkegiatan_id, rekening_id: a.rekening_id, pagu: a.pagu })),
  ];
  data.versiAlokasiAnggaran.push({
    id: `vaa-${data.versiAlokasiAnggaran.length + 1}`,
    ta_id,
    fase,
    tanggal_efektif: nowWita().slice(0, 10),
    aktor_id: aktor.id,
    aktor_nama_snapshot: aktor.nama,
    aktor_peran_snapshot: aktor.peran,
    keterangan,
    rincian,
  });
}

// ===== Alokasi subkegiatan oleh Bendahara (ALK-01) =====

export function simpanAlokasiSubkegiatan(ta_id: string, pagu_per_pemetaan: Record<string, number>, aktor: AktorAnggaran): Hasil {
  const ta = taById(ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  if (aktor.peran !== 'bendahara') return { ok: false, error: 'Hanya Bendahara Pengeluaran yang dapat mengalokasikan pagu subkegiatan.' };
  if (ta.status === 'Arsip Read-Only' || ta.status === 'Masa Transisi') return { ok: false, error: 'Alokasi hanya dapat diubah pada TA yang belum disahkan.' };
  if (!jendelaTerbuka(ta_id)) return { ok: false, error: 'Jendela input alokasi tertutup. Bendahara perlu membuka kembali jendela waktu.' };
  if (sudahDisahkan(ta_id)) return { ok: false, error: 'Alokasi TA ini sudah disahkan dan tidak dapat diubah di Langkah 4.' };
  for (const [pemetaan_id, pagu] of Object.entries(pagu_per_pemetaan)) {
    if (!isBilanganBulat(pagu)) return { ok: false, error: 'Pagu harus bilangan bulat rupiah tanpa sen, dan tidak boleh negatif.' };
    if (!pemetaanOfTA(ta_id).some((p) => p.id === pemetaan_id)) return { ok: false, error: 'Subkegiatan tidak terpetakan pada TA ini.' };
    const terpakai = alokasiRekByPemetaan(pemetaan_id).reduce((s, a) => s + terpakaiAlokasi(a), 0);
    if (pagu < terpakai) {
      return { ok: false, error: `Pagu subkegiatan tidak boleh di bawah realisasi BKU dan komitmen kuitansi aktif (${formatRupiah(terpakai)}).` };
    }
  }
  for (const [pemetaan_id, pagu] of Object.entries(pagu_per_pemetaan)) {
    const existing = alokasiSubByPemetaan(pemetaan_id);
    if (existing) existing.pagu = pagu;
    else data.alokasiSubkegiatan.push({ id: `as-${ta_id}-${pemetaan_id}`, ta_id, pemetaan_subkegiatan_id: pemetaan_id, pagu });
  }
  catatVersi(ta_id, aktor, 'Penyimpanan alokasi pagu subkegiatan');
  recordAudit({ ta_id, entitas: `Alokasi subkegiatan TA ${ta.tahun}`, aksi: 'aksi_administratif', nilai_sesudah: `Selisih ${formatRupiah(selisihAlokasiInstansi(ta_id))}` });
  return { ok: true };
}

// ===== Alokasi rekening oleh PPTK (ALK-03) =====

export function simpanAlokasiRekening(
  ta_id: string,
  pemetaan_id: string,
  baris: { rekening_id: string; pagu: number }[],
  aktor: AktorAnggaran,
): Hasil {
  const ta = taById(ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  const pem = data.pemetaanSubkegiatanTA.find((p) => p.id === pemetaan_id && p.ta_id === ta_id);
  if (!pem) return { ok: false, error: 'Subkegiatan tidak ditemukan pada TA ini.' };
  if (aktor.peran !== 'pptk' || aktor.seksi_ta_id !== pem.seksi_ta_id) {
    return { ok: false, error: 'Hanya PPTK seksi pemilik subkegiatan ini yang dapat mengisi rekening belanja.' };
  }
  if (!jendelaTerbuka(ta_id)) return { ok: false, error: 'Jendela input alokasi tertutup. Hubungi Bendahara untuk membukanya kembali.' };
  if (alokasiRekByPemetaan(pemetaan_id).some((a) => a.disahkan)) return { ok: false, error: 'Alokasi subkegiatan ini sudah disahkan.' };
  const rekIds = new Set<string>();
  for (const b of baris) {
    if (!isBilanganBulat(b.pagu)) return { ok: false, error: 'Pagu rekening harus bilangan bulat rupiah tanpa sen, dan tidak boleh negatif.' };
    if (rekIds.has(b.rekening_id)) return { ok: false, error: 'Rekening yang sama tidak boleh muncul dua kali pada subkegiatan ini.' };
    rekIds.add(b.rekening_id);
    if (!data.masterRekeningBelanja.some((r) => r.id === b.rekening_id && r.status === 'Aktif')) {
      return { ok: false, error: 'Rekening belanja tidak ditemukan atau nonaktif.' };
    }
  }
  const lama = alokasiRekByPemetaan(pemetaan_id);
  for (const x of lama) {
    const terpakai = terpakaiAlokasi(x);
    const baru = baris.find((b) => b.rekening_id === x.rekening_id);
    if (!baru && terpakai > 0) {
      return { ok: false, error: `Rekening ${x.kode_rekening_snapshot} tidak dapat dihapus karena sudah ada realisasi atau komitmen.` };
    }
    if (baru && baru.pagu < terpakai) {
      return { ok: false, error: `Pagu ${x.kode_rekening_snapshot} tidak boleh di bawah realisasi BKU dan komitmen kuitansi aktif (${formatRupiah(terpakai)}).` };
    }
  }
  for (let i = data.alokasiRekening.length - 1; i >= 0; i--) {
    if (data.alokasiRekening[i].pemetaan_subkegiatan_id === pemetaan_id) data.alokasiRekening.splice(i, 1);
  }
  for (const b of baris) {
    const rek = data.masterRekeningBelanja.find((r) => r.id === b.rekening_id)!;
    const sebelumnya = lama.find((a) => a.rekening_id === b.rekening_id);
    data.alokasiRekening.push({
      id: sebelumnya?.id ?? `ar-${ta_id}-${pemetaan_id}-${b.rekening_id}`,
      ta_id,
      pemetaan_subkegiatan_id: pemetaan_id,
      rekening_id: b.rekening_id,
      kode_rekening_snapshot: rek.kode_rekening,
      nama_rekening_snapshot: rek.nama,
      pagu: b.pagu,
      disahkan: false,
      spd_aktif: sebelumnya?.spd_aktif ?? 0,
    });
  }
  catatVersi(ta_id, aktor, `Penyimpanan rekening belanja ${pem.kode_snapshot}`);
  return { ok: true };
}

export function rekeningPemetaan(pemetaan_id: string): AlokasiRekening[] {
  return alokasiRekByPemetaan(pemetaan_id);
}

// ===== Sahkan dan penerbitan SPD (ALK-05, ALK-06, SPD-04) =====

export function sahkanAlokasi(ta_id: string, aktor: AktorAnggaran): Hasil {
  const ta = taById(ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  if (aktor.peran !== 'bendahara') return { ok: false, error: 'Hanya Bendahara Pengeluaran yang dapat menekan Sahkan.' };
  if (sudahDisahkan(ta_id)) return { ok: false, error: 'Alokasi TA ini sudah disahkan.' };
  const selisih = selisihAlokasiInstansi(ta_id);
  if (selisih !== 0) return { ok: false, error: `Selisih alokasi subkegiatan ${formatRupiah(selisih)}. Sahkan hanya bisa bila selisih tepat Rp 0.` };
  const g = gerbangStatus(ta_id);
  if (g.seksiBelum.length > 0) {
    return { ok: false, error: `Seksi belum seimbang: ${g.seksiBelum.map((s) => s.nama).join(', ')}.` };
  }
  const rows = data.alokasiRekening.filter((x) => x.ta_id === ta_id);
  for (const a of rows) {
    const terpakai = terpakaiAlokasi(a);
    if (a.pagu < terpakai) {
      return { ok: false, error: `Pagu ${a.kode_rekening_snapshot} di bawah realisasi dan komitmen (${formatRupiah(terpakai)}). SPD tidak boleh diturunkan di bawah nilai itu.` };
    }
  }
  const perubahan = ta.mode_apbd_p;
  const waktu = nowWita();
  for (const a of rows) {
    const sebelum = a.spd_aktif;
    a.disahkan = true;
    a.spd_aktif = a.pagu;
    data.ledgerSPD.push({
      id: `ldg-${data.ledgerSPD.length + 1}`,
      ta_id,
      alokasi_rekening_id: a.id,
      jenis: perubahan ? 'penyesuaian_apbdp' : 'terbit',
      perubahan: a.spd_aktif - sebelum,
      spd_sesudah: a.spd_aktif,
      keterangan: perubahan ? 'SPD disesuaikan ke pagu APBD-P saat Sahkan ulang' : 'SPD terbit 100% pagu saat Sahkan',
      waktu,
      aktor_id: aktor.id,
      aktor_nama_snapshot: aktor.nama,
      aktor_peran_snapshot: aktor.peran,
      referensi: null,
    });
  }
  catatVersi(ta_id, aktor, perubahan ? 'Sahkan ulang pagu APBD-P dan penyesuaian SPD' : 'Pengesahan alokasi dan terbitnya SPD');
  recordAudit({
    ta_id,
    entitas: `TA ${ta.tahun}`,
    aksi: 'sahkan',
    nilai_sesudah: perubahan ? 'SPD disesuaikan ke pagu APBD-P' : 'SPD terbit 100% pagu disahkan',
  });
  return { ok: true };
}

// ===== Efisiensi dan kenaikan SPD (SPD-02) =====

function ubahSPD(
  alokasi_rekening_id: string,
  nilai: number,
  jenis: 'efisiensi' | 'kenaikan',
  keterangan: string,
  aktor: AktorAnggaran,
): Hasil {
  const a = data.alokasiRekening.find((x) => x.id === alokasi_rekening_id);
  if (!a) return { ok: false, error: 'Rekening belanja tidak ditemukan.' };
  if (aktor.peran !== 'bendahara') return { ok: false, error: 'Hanya Bendahara Pengeluaran yang dapat mengubah SPD.' };
  if (!a.disahkan) return { ok: false, error: 'SPD belum terbit atau sedang menunggu Sahkan ulang. Alokasi harus disahkan terlebih dahulu.' };
  if (!Number.isInteger(nilai) || nilai <= 0) return { ok: false, error: 'Nilai harus bilangan bulat rupiah lebih dari nol.' };
  const perubahan = jenis === 'efisiensi' ? -nilai : nilai;
  if (jenis === 'efisiensi') {
    const sisa = sisaSpdBebas(a);
    if (nilai > sisa) {
      return { ok: false, error: `Efisiensi ${formatRupiah(nilai)} melebihi Sisa SPD Bebas ${formatRupiah(sisa)}.` };
    }
  } else {
    if (!keterangan.trim()) return { ok: false, error: 'Kenaikan SPD wajib disertai alasan tertulis.' };
    if (a.spd_aktif + nilai > a.pagu) {
      return { ok: false, error: `Kenaikan melebihi pagu rekening. Batas maksimal ${formatRupiah(a.pagu - a.spd_aktif)}.` };
    }
  }
  a.spd_aktif += perubahan;
  const idLedger = `ldg-${data.ledgerSPD.length + 1}`;
  const entri: LedgerSPD = {
    id: idLedger,
    ta_id: a.ta_id,
    alokasi_rekening_id: a.id,
    jenis,
    perubahan,
    spd_sesudah: a.spd_aktif,
    keterangan: keterangan.trim(),
    waktu: nowWita(),
    aktor_id: aktor.id,
    aktor_nama_snapshot: aktor.nama,
    aktor_peran_snapshot: aktor.peran,
    referensi: idLedger,
  };
  data.ledgerSPD.push(entri);
  recordAudit({
    ta_id: a.ta_id,
    entitas: `SPD ${a.kode_rekening_snapshot} ${a.nama_rekening_snapshot}`,
    aksi: jenis === 'efisiensi' ? 'efisiensi_spd' : 'kenaikan_spd',
    nilai_sebelum: formatRupiah(a.spd_aktif - perubahan),
    nilai_sesudah: formatRupiah(a.spd_aktif),
    alasan: keterangan.trim() || null,
  });
  return { ok: true };
}

export function efisiensiSPD(alokasi_rekening_id: string, nilai: number, keterangan: string, aktor: AktorAnggaran): Hasil {
  return ubahSPD(alokasi_rekening_id, nilai, 'efisiensi', keterangan, aktor);
}

export function naikkanSPD(alokasi_rekening_id: string, nilai: number, alasan: string, aktor: AktorAnggaran): Hasil {
  return ubahSPD(alokasi_rekening_id, nilai, 'kenaikan', alasan, aktor);
}

export function nomorPergeseranBerikutnya(ta_id: string): string {
  const urut = data.ledgerSPD
    .filter((l) => l.ta_id === ta_id && l.jenis === 'pergeseran' && l.referensi)
    .reduce((maks, l) => Math.max(maks, Number(/^Pergeseran\/(\d{3})\//.exec(l.referensi ?? '')?.[1] ?? 0)), 0);
  return `Pergeseran/${String(urut + 1).padStart(3, '0')}/${taById(ta_id)?.tahun}`;
}

export function geserSPD(
  ta_id: string,
  sumber_id: string,
  tujuan_id: string,
  nilai: number,
  alasan: string,
  aktor: AktorAnggaran,
): Hasil {
  if (aktor.peran !== 'bendahara') return { ok: false, error: 'Hanya Bendahara Pengeluaran yang dapat menggeser anggaran.' };
  const ta = taById(ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  if (ta.status !== 'Aktif Penuh') return { ok: false, error: 'Pergeseran hanya dapat dilakukan pada TA Aktif Penuh.' };
  if (!isBilanganBulat(nilai) || nilai <= 0) return { ok: false, error: 'Nilai pergeseran harus bilangan bulat rupiah lebih dari nol.' };
  if (sumber_id === tujuan_id) return { ok: false, error: 'Rekening sumber dan tujuan tidak boleh sama.' };
  const sumber = data.alokasiRekening.find((a) => a.id === sumber_id && a.ta_id === ta_id);
  const tujuan = data.alokasiRekening.find((a) => a.id === tujuan_id && a.ta_id === ta_id);
  if (!sumber || !tujuan) return { ok: false, error: 'Rekening sumber atau tujuan tidak ditemukan pada TA ini.' };
  if (!sumber.disahkan || !tujuan.disahkan) return { ok: false, error: 'Pergeseran hanya dapat dilakukan ke rekening yang alokasinya sudah disahkan.' };
  const sisa = sisaSpdBebas(sumber);
  if (nilai > sisa) return { ok: false, error: `Nilai melebihi Sisa SPD Bebas rekening sumber (${formatRupiah(sisa)}).` };

  const asSumber = alokasiSubByPemetaan(sumber.pemetaan_subkegiatan_id);
  const asTujuan = alokasiSubByPemetaan(tujuan.pemetaan_subkegiatan_id);
  if (!asSumber || !asTujuan) return { ok: false, error: 'Pagu subkegiatan belum dialokasikan pada TA ini.' };
  const antarSubkegiatan = sumber.pemetaan_subkegiatan_id !== tujuan.pemetaan_subkegiatan_id;
  if (antarSubkegiatan && asSumber.pagu < nilai) return { ok: false, error: 'Pagu subkegiatan sumber tidak cukup untuk nilai pergeseran ini.' };

  const nomor = nomorPergeseranBerikutnya(ta_id);
  const kodeSumber = sumber.kode_rekening_snapshot;
  const kodeTujuan = tujuan.kode_rekening_snapshot;
  sumber.pagu -= nilai;
  sumber.spd_aktif -= nilai;
  tujuan.pagu += nilai;
  tujuan.spd_aktif += nilai;
  if (antarSubkegiatan) {
    asSumber.pagu -= nilai;
    asTujuan.pagu += nilai;
  }
  const catatan = alasan.trim();
  for (const [rek, perubahan] of [[sumber, -nilai], [tujuan, nilai]] as const) {
    data.ledgerSPD.push({
      id: `ldg-${data.ledgerSPD.length + 1}`,
      ta_id,
      alokasi_rekening_id: rek.id,
      jenis: 'pergeseran',
      perubahan,
      spd_sesudah: rek.spd_aktif,
      keterangan: catatan,
      waktu: nowWita(),
      aktor_id: aktor.id,
      aktor_nama_snapshot: aktor.nama,
      aktor_peran_snapshot: aktor.peran,
      referensi: nomor,
    });
  }
  catatVersi(ta_id, aktor, `${nomor}: ${kodeSumber} (-) ke ${kodeTujuan} (+) ${formatRupiah(nilai)}`, 'pergeseran');
  recordAudit({
    ta_id,
    entitas: `${nomor} • ${formatRupiah(nilai)}`,
    aksi: 'pergeseran_spd',
    nilai_sebelum: `Sumber (-) ${kodeSumber}`,
    nilai_sesudah: `Tujuan (+) ${kodeTujuan}`,
    alasan: catatan || null,
  });
  return { ok: true };
}

// ===== APBD-P (TA-09) dan pembanding pagu murni (SPD-04) =====

export function aktifkanApbdP(ta_id: string, pagu_perubahan: number, aktor: AktorAnggaran): Hasil {
  const ta = taById(ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  if (aktor.peran !== 'admin') return { ok: false, error: 'Hanya Admin yang dapat mengaktifkan APBD-P.' };
  if (ta.status !== 'Aktif Penuh') return { ok: false, error: 'APBD-P hanya dapat diaktifkan pada TA Aktif Penuh.' };
  if (ta.mode_apbd_p) return { ok: false, error: 'APBD-P pada TA ini sudah aktif.' };
  if (!sudahDisahkan(ta_id)) return { ok: false, error: 'Alokasi murni belum disahkan. APBD-P diaktifkan setelah Sahkan murni.' };
  if (!Number.isInteger(pagu_perubahan) || pagu_perubahan <= 0) {
    return { ok: false, error: 'Pagu Induk perubahan harus bilangan bulat rupiah lebih dari nol.' };
  }
  ta.mode_apbd_p = true;
  ta.pagu_induk_perubahan = pagu_perubahan;
  for (const a of data.alokasiRekening.filter((x) => x.ta_id === ta_id)) a.disahkan = false;
  const j = data.jendelaAlokasi.find((x) => x.ta_id === ta_id);
  if (j) j.tutup_wita = null;
  recordAudit({
    ta_id,
    entitas: `TA ${ta.tahun}`,
    aksi: 'alokasi_apbd_p',
    nilai_sebelum: `Pagu Induk ${formatRupiah(ta.pagu_induk)}`,
    nilai_sesudah: `Pagu Induk APBD-P ${formatRupiah(pagu_perubahan)}`,
  });
  return { ok: true };
}

// Pagu murni per pasangan subkegiatan-rekening, dari versi 'murni' terakhir.
export function paguMurniByRekening(ta_id: string): Map<string, number> {
  const murniList = data.versiAlokasiAnggaran.filter((v) => v.ta_id === ta_id && v.fase === 'murni');
  const murni = murniList[murniList.length - 1];
  const peta = new Map<string, number>();
  for (const r of murni?.rincian ?? []) {
    if (r.rekening_id === null) continue;
    peta.set(`${r.pemetaan_subkegiatan_id}|${r.rekening_id}`, r.pagu);
  }
  return peta;
}

export function ledgerByTA(ta_id: string): LedgerSPD[] {
  return data.ledgerSPD.filter((l) => l.ta_id === ta_id);
}

export function alokasiRekeningByTA(ta_id: string): AlokasiRekening[] {
  return data.alokasiRekening.filter((x) => x.ta_id === ta_id);
}
