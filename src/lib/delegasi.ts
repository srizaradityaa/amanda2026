// PEN-06 — pengakhiran delegasi jatuh tempo (23:59 WITA).
// Penjadwal sungguhan menunggu backend; saat ini dievaluasi saat aplikasi dimuat dan saat login.

import { repo } from '@/data/repo';
import { recordAudit } from '@/lib/audit';

export function evaluasiDelegasiJatuhTempo(): void {
  for (const d of repo.akhiriDelegasiJatuhTempo()) {
    recordAudit({
      ta_id: d.ta_id,
      entitas: `Delegasi: ${d.nama_snapshot}`,
      aksi: 'delegasi_berakhir_otomatis',
      nilai_sesudah: `Status: Berakhir (dari Delegasi Aktif), 23:59 WITA ${d.tanggal_berakhir}`,
      otomatis: true,
      definitive_officer_id: d.definitive_officer_id,
      delegate_officer_id: d.personel_pengganti_id,
    });
  }
}
