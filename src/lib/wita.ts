// FND-03 — Zona waktu WITA (UTC+8) untuk jendela input, tanggal arsip,
// dan seluruh tanggal/jam yang ditampilkan (D04 §4; D01 §3.1).
// Semua aritmetika tanggal memakai komponen tahun-bulan-hari murni
// tanpa objek Date/ zona waktu, sesuai Dokumen 04 §4.

const WITA_OFFSET_MINUTES = 8 * 60;

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Parse ISO date (YYYY-MM-DD) menjadi { y, m, d } murni integer. */
function parseISO(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

/** Tanggal WITA hari ini (YYYY-MM-DD) berdasar waktu sistem + offset. */
export function todayWita(): string {
  const now = new Date();
  const wita = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + WITA_OFFSET_MINUTES * 60000);
  return `${wita.getFullYear()}-${pad(wita.getMonth() + 1)}-${pad(wita.getDate())}`;
}

/** Timestamp WITA lengkap (YYYY-MM-DD HH:mm) untuk jejak audit. */
export function nowWita(): string {
  const now = new Date();
  const wita = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + WITA_OFFSET_MINUTES * 60000);
  return `${wita.getFullYear()}-${pad(wita.getMonth() + 1)}-${pad(wita.getDate())} ${pad(wita.getHours())}:${pad(wita.getMinutes())}`;
}

/** Format tanggal Indonesia dari ISO date (YYYY-MM-DD) -> "2 November 2026". */
const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggal(iso: string | null): string {
  if (!iso) return '—';
  const { y, m, d } = parseISO(iso);
  if (!y || !m || !d) return '—';
  return `${d} ${BULAN_ID[m - 1]} ${y}`;
}

/** Format tanggal pendek (DD/MM/YYYY) untuk tampilan ringkas. */
export function formatTanggalPendek(iso: string | null): string {
  if (!iso) return '—';
  const { y, m, d } = parseISO(iso);
  if (!y || !m || !d) return '—';
  return `${pad(d)}/${pad(m)}/${y}`;
}

/** Hitung selisih hari antara dua tanggal ISO (a - b), bisa negatif. */
export function selisihHari(aIso: string, bIso: string): number {
  const a = parseISO(aIso);
  const b = parseISO(bIso);
  // Konversi ke hari sejak epoch (tanggal proleptik Gregorian) tanpa zona waktu.
  const toDays = (y: number, m: number, d: number): number => {
    // Algoritma Julian Day number untuk kalender Gregorian proleptik.
    const a2 = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a2;
    const m2 = m + 12 * a2 - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  };
  return toDays(a.y, a.m, a.d) - toDays(b.y, b.m, b.d);
}

/** Tambah/hapus hari ke tanggal ISO, menghasilkan ISO. Aritmetika murni tanpa Date/timezone. */
export function tambahHari(iso: string, hari: number): string {
  const { y, m, d } = parseISO(iso);
  // Algoritma: konversi ke Julian Day Number, tambah hari, konversi balik.
  const toJdn = (yy: number, mm: number, dd: number): number => {
    const a = Math.floor((14 - mm) / 12);
    const y2 = yy + 4800 - a;
    const m2 = mm + 12 * a - 3;
    return dd + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  };
  const fromJdn = (jdn: number): { y: number; m: number; d: number } => {
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d2 = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d2) / 4);
    const m2 = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m2 + 2) / 5) + 1;
    const month = m2 + 3 - 12 * Math.floor(m2 / 10);
    const year = 100 * b + d2 - 4800 + Math.floor(m2 / 10);
    return { y: year, m: month, d: day };
  };
  const result = fromJdn(toJdn(y, m, d) + hari);
  return `${result.y}-${pad(result.m)}-${pad(result.d)}`;
}
