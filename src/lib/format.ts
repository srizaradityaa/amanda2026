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
