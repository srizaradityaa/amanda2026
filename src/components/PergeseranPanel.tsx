import { useReducer, useState } from 'react';
import { Button, Input, Modal, RupiahInput, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import * as anggaran from '@/data/anggaran';
import { formatRupiah } from '@/lib/format';
import { formatTanggalPendek } from '@/lib/wita';
import { aktorSesi, ErrorLine, Panel, SectionTitle } from '@/components/AnggaranShared';

type Aktor = NonNullable<ReturnType<typeof aktorSesi>>;

const SELECT_CLASS = 'mt-1 block w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-sm text-mist focus:border-amber focus:outline-none';

export function PergeseranPanel({ ta_id, aktor, onChanged }: { ta_id: string; aktor: Aktor; onChanged: () => void }) {
  const rows = repo.alokasiRekeningByTA(ta_id).filter((a) => a.disahkan);
  const pemetaan = new Map(repo.pemetaanByTA(ta_id).map((p) => [p.id, p]));
  const labelBaris = (id: string) => {
    const a = rows.find((r) => r.id === id);
    if (!a) return '';
    const sub = pemetaan.get(a.pemetaan_subkegiatan_id);
    return `${sub?.kode_snapshot ?? '-'} • ${a.kode_rekening_snapshot} ${a.nama_rekening_snapshot}`;
  };

  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [sumber, setSumber] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [nilai, setNilai] = useState(0);
  const [alasan, setAlasan] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  const bisaGeser = rows.length >= 2;
  const sumberRow = rows.find((r) => r.id === sumber);
  const tutup = () => { setOpen(false); setErr(null); };
  const buka = () => {
    setSumber(rows[0]?.id ?? '');
    setTujuan(rows[1]?.id ?? '');
    setNilai(0);
    setAlasan('');
    setErr(null);
    setOpen(true);
  };
  const kirim = () => {
    const hasil = anggaran.geserSPD(ta_id, sumber, tujuan, nilai, alasan, aktor);
    if (!hasil.ok) { setErr(hasil.error ?? 'Gagal'); return; }
    setOpen(false);
    setErr(null);
    toast.notify('Tersimpan');
    refresh();
    onChanged();
  };

  const riwayat = anggaran.ledgerByTA(ta_id).filter((l) => l.jenis === 'pergeseran');
  const riwayatPerNomor = new Map<string, typeof riwayat>();
  for (const l of riwayat) {
    const daftar = riwayatPerNomor.get(l.referensi ?? '') ?? [];
    daftar.push(l);
    riwayatPerNomor.set(l.referensi ?? '', daftar);
  }

  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <SectionTitle title="Pergeseran Anggaran" desc="Memindahkan alokasi antar-rekening atau antar-subkegiatan. Total Pagu Induk tidak berubah. Hanya Bendahara yang dapat menggeser." />
        <Button variant="secondary" onClick={buka} disabled={!bisaGeser}>Geser Anggaran</Button>
      </div>
      {!bisaGeser && (
        <p className="text-sm text-mist-dim">Pergeseran membutuhkan minimal dua rekening yang sudah disahkan.</p>
      )}
      {riwayatPerNomor.size > 0 && (
        <ul className="space-y-2 text-sm">
          {[...riwayatPerNomor.entries()].map(([nomor, daftar]) => {
            const sumberLog = daftar.find((l) => l.perubahan < 0);
            const tujuanLog = daftar.find((l) => l.perubahan > 0);
            return (
              <li key={nomor} className="rounded-md border border-ink-line px-3 py-2">
                <p className="mono text-mist">{nomor}</p>
                <p className="text-mist-dim">
                  {formatTanggalPendek(daftar[0].waktu.slice(0, 10))} · {daftar[0].aktor_nama_snapshot} · {formatRupiah(tujuanLog?.perubahan ?? 0)}
                </p>
                <p className="text-mist-dim">
                  Sumber (-): {labelBaris(sumberLog?.alokasi_rekening_id ?? '')}
                </p>
                <p className="text-mist-dim">
                  Tujuan (+): {labelBaris(tujuanLog?.alokasi_rekening_id ?? '')}
                </p>
                {daftar[0].keterangan && <p className="text-mist-dim">Alasan: {daftar[0].keterangan}</p>}
              </li>
            );
          })}
        </ul>
      )}
      <Modal
        open={open}
        onClose={tutup}
        title="Geser Anggaran"
        footer={
          <>
            <Button variant="secondary" onClick={tutup}>Batal</Button>
            <Button variant="primary" onClick={kirim}>Geser</Button>
          </>
        }
      >
        <label className="block text-sm text-mist-dim">
          Rekening sumber (-)
          <select className={SELECT_CLASS} value={sumber} onChange={(e) => setSumber(e.target.value)}>
            {rows.map((r) => (
              <option key={r.id} value={r.id}>{labelBaris(r.id)}</option>
            ))}
          </select>
        </label>
        <p className="mt-1 text-xs text-mist-dim">
          Sisa SPD Bebas sumber: <span className="mono tnum text-mist">{sumberRow ? formatRupiah(anggaran.sisaSpdBebas(sumberRow)) : '—'}</span>
        </p>
        <label className="mt-3 block text-sm text-mist-dim">
          Rekening tujuan (+)
          <select className={SELECT_CLASS} value={tujuan} onChange={(e) => setTujuan(e.target.value)}>
            {rows.filter((r) => r.id !== sumber).map((r) => (
              <option key={r.id} value={r.id}>{labelBaris(r.id)}</option>
            ))}
          </select>
        </label>
        <label className="mt-3 block text-sm text-mist-dim">
          Nilai (Rp)
          <RupiahInput className="mt-1 block w-full" value={nilai} onChange={setNilai} />
        </label>
        <label className="mt-3 block text-sm text-mist-dim">
          Keterangan (opsional)
          <Input className="mt-1 block w-full" value={alasan} onChange={(e) => setAlasan(e.target.value)} />
        </label>
        <ErrorLine msg={err} />
      </Modal>
    </Panel>
  );
}
