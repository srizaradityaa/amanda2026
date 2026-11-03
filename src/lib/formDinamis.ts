// TPL-02 / BNT-02 — aturan Form Dinamis yang murni (tanpa state), dipakai repo dan UI.
import type { FieldFormDinamis, BlokBerulangFormDinamis, SystemTag } from '@/data/types';

export const TAG_SISTEM: SystemTag[] = ['[SYS_PERSONNEL_ID]', '[SYS_PERSONNEL_NAME]', '[SYS_START_DATE]', '[SYS_END_DATE]'];

export const TIPE_FIELD_LABEL: Record<FieldFormDinamis['tipe'], string> = {
  teks: 'Teks',
  angka: 'Angka',
  tanggal: 'Tanggal',
  area: 'Teks Panjang',
  file: 'Berkas',
};

// BNT-02 — ID dan nama harus berpasangan dalam konteks yang sama; tiap tag hanya sekali per konteks.
export function validasiTagSistem(fields: FieldFormDinamis[], blok: BlokBerulangFormDinamis | null): string | null {
  const konteks: [string, FieldFormDinamis[]][] = [['field utama', fields]];
  if (blok) konteks.push([`blok "${blok.nama}"`, blok.fields]);
  for (const [nama, daftar] of konteks) {
    const tags = daftar.map((f) => f.system_tag).filter((t): t is Exclude<SystemTag, null> => t !== null);
    const duplikat = tags.find((t, i) => tags.indexOf(t) !== i);
    if (duplikat) return `Tag ${duplikat} hanya boleh dipakai sekali dalam ${nama}.`;
    const adaId = tags.includes('[SYS_PERSONNEL_ID]');
    const adaNama = tags.includes('[SYS_PERSONNEL_NAME]');
    if (adaId !== adaNama) {
      return `[SYS_PERSONNEL_ID] dan [SYS_PERSONNEL_NAME] harus dipasangkan dalam ${nama} yang sama.`;
    }
  }
  return null;
}

export function versiBerikutnya(versi: string | undefined): string {
  const n = versi ? parseInt(versi.replace(/^v/, ''), 10) : 0;
  return `v${(Number.isFinite(n) ? n : 0) + 1}`;
}
