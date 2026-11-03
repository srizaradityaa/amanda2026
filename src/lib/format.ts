// FND-04 — Representasi nominal & kode (D04 §4; D03 §1; D01 §7 poin 6).
// Nominal bilangan bulat rupiah tanpa sen; tampil pemisah ribuan titik, tanpa spin button.
// Kode rekening, no. rekening bank, NIP/NIK disimpan sebagai teks (jangan format Rupiah).

/** Format bilangan bulat rupiah -> "Rp 1.234.567" (pemisah ribuan titik). */
export function formatRupiah(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(n));
  const ribuan = abs.toLocaleString('de-DE'); // de-DE memakai titik pemisah ribuan
  return `${sign}Rp ${ribuan}`;
}

/** Format angka saja (tanpa "Rp") untuk input edit. */
export function formatAngka(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  return Math.trunc(n).toLocaleString('de-DE');
}

/** Parse input teks rupiah (titik pemisah) -> bilangan bulat. */
export function parseRupiah(s: string): number {
  const bersih = s.replace(/[^\d-]/g, '');
  return bersih === '' || bersih === '-' ? 0 : parseInt(bersih, 10);
}

/** Persentase aman: denominator nol/tdk tersedia -> "Belum tersedia" (D01 §10 poin 3). */
export function formatPersen(pembilang: number, penyebut: number): string {
  if (!penyebut || penyebut <= 0) return 'Belum tersedia';
  const pct = (pembilang / penyebut) * 100;
  return `${pct.toFixed(2).replace('.', ',')}%`;
}

/** Persentase numerik (untuk progress bar), 0..100. Denominator nol -> 0. */
export function persenNumerik(pembilang: number, penyebut: number): number {
  if (!penyebut || penyebut <= 0) return 0;
  return Math.min(100, (pembilang / penyebut) * 100);
}

/** Kode tetap teks (jangan format angka). */
export function formatKode(kode: string): string {
  return kode;
}

// ===== Terbilang: konversi bilangan bulat ke teks Indonesia (D02 §2.1) =====
const SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
const BELASAN = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];

function konversiGrup(n: number): string {
  if (n === 0) return '';
  const ratus = Math.floor(n / 100);
  const sisa = n % 100;
  let txt = '';
  if (ratus === 1) txt += 'seratus';
  else if (ratus > 1) txt += SATUAN[ratus] + ' ratus';
  if (sisa > 0) {
    if (txt) txt += ' ';
    if (sisa < 10) txt += SATUAN[sisa];
    else if (sisa < 20) txt += BELASAN[sisa - 10];
    else txt += SATUAN[Math.floor(sisa / 10)] + ' puluh' + (sisa % 10 > 0 ? ' ' + SATUAN[sisa % 10] : '');
  }
  return txt;
}

export function terbilang(n: number): string {
  if (n === 0) return 'nol rupiah';
  if (n < 0) return 'minus ' + terbilang(-n);
  const triliun = Math.floor(n / 1_000_000_000_000);
  const sisa1 = n % 1_000_000_000_000;
  const miliar = Math.floor(sisa1 / 1_000_000_000);
  const sisa2 = sisa1 % 1_000_000_000;
  const juta = Math.floor(sisa2 / 1_000_000);
  const sisa3 = sisa2 % 1_000_000;
  const ribu = Math.floor(sisa3 / 1_000);
  const sisa4 = sisa3 % 1_000;
  const parts: string[] = [];
  if (triliun > 0) parts.push(konversiGrup(triliun) + ' triliun');
  if (miliar > 0) parts.push(konversiGrup(miliar) + ' miliar');
  if (juta > 0) parts.push(konversiGrup(juta) + ' juta');
  if (ribu > 0) {
    if (ribu === 1) parts.push('seribu');
    else parts.push(konversiGrup(ribu) + ' ribu');
  }
  if (sisa4 > 0) parts.push(konversiGrup(sisa4));
  return parts.join(' ').replace(/\s+/g, ' ').trim() + ' rupiah';
}
