import { useState } from 'react';
import { Button, Modal, RupiahInput, useToast } from '@/components/ui';
import { ErrorLine, aktorSesi } from '@/components/AnggaranShared';
import * as anggaran from '@/data/anggaran';
import { repo } from '@/data/repo';
import { formatRupiah } from '@/lib/format';

export function ApbdPModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const ta = repo.tahunAnggaranById(taId);
  const toast = useToast();
  const [nilai, setNilai] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  if (!ta) return null;

  const simpan = () => {
    const aktor = aktorSesi();
    if (!aktor) { setErr('Sesi tidak ditemukan. Silakan masuk kembali.'); return; }
    const hasil = anggaran.aktifkanApbdP(taId, nilai, aktor);
    if (!hasil.ok) { setErr(hasil.error ?? 'Gagal'); return; }
    toast.notify('Tersimpan');
    onSaved();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Aktifkan APBD-P — TA ${ta.tahun}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={simpan} disabled={!nilai}>Aktifkan</Button>
        </>
      }
    >
      <p className="text-sm text-mist-dim">
        Pagu Induk murni <span className="mono tnum text-mist">{formatRupiah(ta.pagu_induk)}</span>. Setelah APBD-P aktif, Bendahara perlu membuka jendela waktu dan melakukan Sahkan ulang sebelum SPD disesuaikan.
      </p>
      <label className="mt-3 block text-sm text-mist-dim">
        Pagu Induk perubahan (Rp)
        <RupiahInput className="mt-1 block w-full" value={nilai} onChange={setNilai} />
      </label>
      <ErrorLine msg={err} />
    </Modal>
  );
}
