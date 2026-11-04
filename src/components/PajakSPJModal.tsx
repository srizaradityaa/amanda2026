// PJK-01 — Pop-up pajak SPJ: banyak entri, jenis dari Master aktif, nominal manual (D02 §5, D03 §4 poin 11)
import { useState } from 'react';
import { Button, Field, Modal, RupiahInput, Select, useToast } from '@/components/ui';
import { ErrorLine } from '@/components/AnggaranShared';
import { repo } from '@/data/repo';
import { formatRupiah } from '@/lib/format';
import type { SPJ, SessionPayload } from '@/data/types';
import { Plus, Trash2 } from 'lucide-react';

type BarisPajak = { key: number; jenis_pajak_id: string; nominal: number };

export function PajakSPJModal({ sesi, spj, onClose, onSaved }: {
  sesi: SessionPayload; spj: SPJ;
  onClose: () => void; onSaved: () => void;
}) {
  const { notify } = useToast();
  const [err, setErr] = useState<string | null>(null);
  const jenisAktif = repo.masterJenisPajak().filter((j) => j.status === 'Aktif');
  const [nextKey, setNextKey] = useState(spj.entri_pajak.length);
  const [baris, setBaris] = useState<BarisPajak[]>(() =>
    spj.entri_pajak.map((e, i) => ({ key: i, jenis_pajak_id: e.jenis_pajak_id, nominal: e.nominal })),
  );

  const bruto = repo.ringkasanPajakSPJ(spj.id)?.bruto ?? 0;
  const totalLive = baris.reduce((s, r) => s + r.nominal, 0);

  const tambahBaris = () => {
    setBaris((b) => [...b, { key: nextKey, jenis_pajak_id: '', nominal: 0 }]);
    setNextKey((n) => n + 1);
  };
  const ubahBaris = (key: number, patch: Partial<Pick<BarisPajak, 'jenis_pajak_id' | 'nominal'>>) =>
    setBaris((b) => b.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const hapusBaris = (key: number) => setBaris((b) => b.filter((r) => r.key !== key));

  const simpan = () => {
    setErr(null);
    if (baris.some((r) => !r.jenis_pajak_id)) { setErr('Pilih jenis pajak pada setiap entri.'); return; }
    const r = repo.simpanEntriPajakSPJ(spj.id, baris.map((x) => ({ jenis_pajak_id: x.jenis_pajak_id, nominal: x.nominal })), sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    notify('Tersimpan');
    onSaved();
  };

  return (
    <Modal open={true} onClose={onClose} title="Pajak SPJ" wide
      footer={
        <div className="flex items-center justify-between">
          <ErrorLine msg={err} />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Batal</Button>
            <Button variant="primary" onClick={simpan}>Simpan Pajak</Button>
          </div>
        </div>
      }>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 rounded-md border border-ink-edge bg-ink p-3 text-2xs text-mist-dim">
          <div>Bruto<div className="mono tnum text-mist">{formatRupiah(bruto)}</div></div>
          <div>Total Pajak<div className="mono tnum text-mist">{formatRupiah(totalLive)}</div></div>
          <div>Jumlah dibayarkan<div className="mono tnum text-mist">{formatRupiah(bruto - totalLive)}</div></div>
        </div>
        {baris.length === 0 && <p className="text-2xs text-mist-dim">Belum ada entri pajak. SPJ tanpa pajak tetap dapat diterima.</p>}
        {baris.map((r) => (
          <div key={r.key} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Field label="Jenis Pajak" required>
              <Select value={r.jenis_pajak_id} onChange={(e) => ubahBaris(r.key, { jenis_pajak_id: e.target.value })}>
                <option value="">Pilih jenis pajak</option>
                {jenisAktif.map((j) => <option key={j.id} value={j.id}>{j.kode} — {j.nama_jenis_pajak}</option>)}
              </Select>
            </Field>
            <Field label="Nominal" required>
              <RupiahInput value={r.nominal} onChange={(v) => ubahBaris(r.key, { nominal: v })} />
            </Field>
            <button onClick={() => hapusBaris(r.key)} className="mb-1 rounded p-1 text-mist-dim hover:text-crit" title="Hapus entri" aria-label="Hapus entri">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <Button variant="secondary" onClick={tambahBaris}><Plus size={14} /> Tambah Entri Pajak</Button>
      </div>
    </Modal>
  );
}
