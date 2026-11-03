// AUD-01 / AUD-02 — Audit Event store (D04 §2.2; D01 §6 poin 6).
// Tahap A: in-memory mutable store dengan data contoh seed. Tahap B: backend menggantikan.
//
// AUD-01: aktor = ID akun + snapshot nama, NIP/NIK, peran saat aksi.
//   Peristiwa dicatat: Sahkan, perubahan alokasi pasca-sahkan/APBD-P, verifikasi
//   disetujui/dikembalikan, pencatatan BKU, koreksi/pencabutan BKU, aksi administratif,
//   aksi Pengawas. Login/logout TIDAK dicatat. Efek otomatis dicatat atas nama pemicu
//   dengan penanda otomatis. Snapshot tidak berubah walau data personel kemudian diubah.
//
// AUD-02: Pembatalan kuitansi/SPJ Draft menghapus entri audit terkait otomatis.
//   Tidak ada tombol hapus manual. Penghapusan TA retensi menghapus seluruh entri audit TA.

import { repo } from '@/data/repo';
import { nowWita } from '@/lib/wita';
import { getSession, touchActivity } from '@/lib/auth';
import { auditEvents as seedAudit } from '@/data/sampleData';
import type { AuditEvent, AuditAksi } from '@/data/types';

let store: AuditEvent[] = [...seedAudit];
let listeners: (() => void)[] = [];

function notify() {
  for (const l of listeners) l();
}

export function subscribeAudit(fn: () => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

/** Snapshot aktor dari sesi aktif (D04 §2.2 — aktor selalu personel nyata). */
function actorSnapshot():
  | { id: string; nama: string; nip: string; peran: string }
  | { id: string; nama: string; nip: string; peran: string; otomatis: true } {
  const s = getSession();
  if (!s) return { id: 'system', nama: 'Sistem', nip: '—', peran: 'Otomatis', otomatis: true };
  return { id: s.user_id, nama: s.nama_snapshot, nip: s.nip_snapshot, peran: peranLabel(s.active_role) };
}

function peranLabel(role: string): string {
  switch (role) {
    case 'admin': return 'Administrator';
    case 'bendahara': return 'Bendahara Pengeluaran';
    case 'pptk': return 'PPTK/Seksi';
    case 'verifikator': return 'Verifikator';
    case 'pa_kpa': return 'PA/KPA';
    case 'pengawas': return 'Pengawas/Auditor';
    default: return role;
  }
}

let idCounter = 1000;
function nextId(): string {
  idCounter += 1;
  return `ae-${idCounter}`;
}

export interface AuditInput {
  ta_id: string | null;
  entitas: string;
  aksi: AuditAksi;
  nilai_sebelum?: string | null;
  nilai_sesudah?: string | null;
  alasan?: string | null;
  otomatis?: boolean;
  kuitansi_id?: string;
  spj_id?: string;
  // delegasi
  definitive_officer_id?: string;
  delegate_officer_id?: string;
}

export function recordAudit(input: AuditInput): AuditEvent {
  touchActivity();
  const actor = actorSnapshot();
  const ev: AuditEvent = {
    id: nextId(),
    ta_id: input.ta_id,
    waktu: nowWita(),
    aktor_id: actor.id,
    aktor_nama_snapshot: actor.nama,
    aktor_nip_snapshot: actor.nip,
    aktor_peran_snapshot: actor.peran,
    entitas: input.entitas,
    aksi: input.aksi,
    nilai_sebelum: input.nilai_sebelum ?? null,
    nilai_sesudah: input.nilai_sesudah ?? null,
    alasan: input.alasan ?? null,
    otomatis: input.otomatis ?? false,
    kuitansi_id: input.kuitansi_id,
    spj_id: input.spj_id,
    definitive_officer_id: input.definitive_officer_id,
    delegate_officer_id: input.delegate_officer_id,
  };
  store = [ev, ...store];
  notify();
  return ev;
}

/** AUD-02 — Pembatalan kuitansi: hapus entri audit terkait kuitansi (+ SPJ/BKU terkait). */
export function purgeAuditForKuitansi(kuitansi_id: string) {
  store = store.filter(
    (e) => e.kuitansi_id !== kuitansi_id,
  );
  notify();
}

/** AUD-02 — Pembatalan SPJ Draft: hapus entri audit terkait SPJ. */
export function purgeAuditForSPJ(spj_id: string) {
  store = store.filter((e) => e.spj_id !== spj_id);
  notify();
}

/** AUD-02 — Penghapusan TA retensi: hapus seluruh entri audit TA. */
export function purgeAuditForTA(ta_id: string) {
  store = store.filter((e) => e.ta_id !== ta_id);
  notify();
}

/** AUD-01 — Hak baca Jejak Audit per peran (D05 §2; D01 §6 poin 3,5,6). */
export function visibleAuditEvents(): AuditEvent[] {
  const s = getSession();
  if (!s) return [];
  if (s.active_role === 'admin') return store;
  if (s.active_role === 'verifikator') return s.active_ta_id ? store.filter((e) => e.ta_id === s.active_ta_id) : store;
  if (s.active_role === 'pengawas') return s.active_ta_id ? store.filter((e) => e.ta_id === s.active_ta_id) : store;
  if (s.active_role === 'bendahara') {
    // hanya entri aksinya sendiri
    return store.filter((e) => e.aktor_id === s.user_id);
  }
  if (s.active_role === 'pptk') {
    if (!s.active_seksi_id) return [];
    const seksiKuitansi = repo.kuitansiBySeksi(s.active_seksi_id).map((k) => k.id);
    const seksiSpj = repo.spjByTA(s.active_ta_id ?? '')
      .filter((spj) => {
        const k = repo.kuitansiBySeksi(s.active_seksi_id!).find((x) => x.id === spj.kuitansi_id);
        return !!k;
      }).map((spj) => spj.id);
    return store.filter((e) => {
      if (e.aktor_id === s.user_id) return true;
      if (e.kuitansi_id && seksiKuitansi.includes(e.kuitansi_id)) return true;
      if (e.spj_id && seksiSpj.includes(e.spj_id)) return true;
      return false;
    });
  }
  return [];
}

export function allAuditForTA(ta_id: string): AuditEvent[] {
  return store.filter((e) => e.ta_id === ta_id);
}

export { peranLabel };
