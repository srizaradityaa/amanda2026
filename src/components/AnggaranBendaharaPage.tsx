import { useReducer, useState } from 'react';
import { Button, Input, Modal, RupiahInput, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import * as anggaran from '@/data/anggaran';
import { formatRupiah } from '@/lib/format';
import { getSession } from '@/lib/auth';
import { formatTanggalPendek } from '@/lib/wita';
import { aktorSesi, ErrorLine, Panel, SectionTitle, StatusSeksiBadge, useTick, sisaWaktu } from '@/components/AnggaranShared';
import { ApbdPPanel } from '@/components/ApbdPPanel';
import { PergeseranPanel } from '@/components/PergeseranPanel';

export function AnggaranBendaharaPage() {
  const sesi = getSession();
  const aktor = aktorSesi();
  const [, bump] = useReducer((x: number) => x + 1, 0);
  if (!sesi || !aktor || !sesi.active_ta_id) return null;
  const ta_id = sesi.active_ta_id;
  const ta = repo.tahunAnggaranById(ta_id);
  if (!ta) return null;
  const onChanged = () => bump();
  return (
    <div>
      <JendelaPanel ta_id={ta_id} aktor={aktor} onChanged={onChanged} />
      <KesiapanPanel ta_id={ta_id} />
      <AlokasiSubkegiatanPanel ta_id={ta_id} aktor={aktor} onChanged={onChanged} />
      <ApbdPPanel ta_id={ta_id} />
      <SahkanPanel ta_id={ta_id} aktor={aktor} onChanged={onChanged} />
      <SpdPanel ta_id={ta_id} aktor={aktor} onChanged={onChanged} />
      <PergeseranPanel ta_id={ta_id} aktor={aktor} onChanged={onChanged} />
      <VersiPanel ta_id={ta_id} />
    </div>
  );
}

function JendelaPanel({ ta_id, aktor, onChanged }: { ta_id: string; aktor: NonNullable<ReturnType<typeof aktorSesi>>; onChanged: () => void }) {
  useTick();
  const toast = useToast();
  const [nilai, setNilai] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const tutup = anggaran.jendelaTutup(ta_id);
  const terbuka = anggaran.jendelaTerbuka(ta_id);
  const atur = () => {
    const hasil = anggaran.aturJendela(ta_id, nilai.replace('T', ' '), aktor);
    if (!hasil.ok) { setErr(hasil.error ?? 'Gagal'); return; }
    setErr(null);
    setNilai('');
    toast.notify('Tersimpan');
    onChanged();
  };
  return (
    <Panel>
      <SectionTitle title="Jendela Waktu Alokasi" desc="Batas waktu pengisian alokasi dalam zona WITA." />
      <p className="text-sm text-mist">
        Status: <span className={terbuka ? 'text-ok' : 'text-crit'}>{terbuka ? 'Dibuka' : 'Tertutup'}</span>
        {tutup && <span className="text-mist-dim"> · tutup {tutup} WITA{terbuka ? ` (${sisaWaktu(tutup)})` : ''}</span>}
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm text-mist-dim">
          Tanggal dan jam tutup
          <Input type="datetime-local" className="mt-1 block" value={nilai} onChange={(e) => setNilai(e.target.value)} />
        </label>
        <Button variant="secondary" onClick={atur} disabled={!nilai}>Atur Jendela</Button>
      </div>
      <ErrorLine msg={err} />
    </Panel>
  );
}

function KesiapanPanel({ ta_id }: { ta_id: string }) {
  const seksi = repo.seksiTAByTA(ta_id).filter((s) => s.status === 'Aktif');
  return (
    <Panel>
      <SectionTitle title="Pemantau Kesiapan Seksi" desc="Status alokasi tiap seksi. Pagu seksi dihitung otomatis dari subkegiatan." />
      <table className="w-full text-sm">
        <thead className="text-left text-mist-dim">
          <tr><th className="py-2">Seksi</th><th>Pagu Seksi</th><th>Status</th></tr>
        </thead>
        <tbody>
          {seksi.map((s) => (
            <tr key={s.id} className="std-row border-t border-ink-line">
              <td className="py-2 text-mist">{s.nama_snapshot}</td>
              <td className="mono tnum text-mist">{formatRupiah(anggaran.paguSeksi(ta_id, s.id))}</td>
              <td><StatusSeksiBadge status={anggaran.statusSeksi(ta_id, s.id)} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-ink-line font-medium">
            <td className="py-2 text-mist">Total Instansi (terhadap Pagu Induk)</td>
            <td className="mono tnum text-mist">{formatRupiah(repo.tahunAnggaranById(ta_id)?.pagu_induk ?? 0)}</td>
            <td>
              {anggaran.selisihAlokasiInstansi(ta_id) === 0 ? (
                <span className="text-ok">Seimbang</span>
              ) : (
                <span className="text-crit">Belum Seimbang</span>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </Panel>
  );
}

function AlokasiSubkegiatanPanel({ ta_id, aktor, onChanged }: { ta_id: string; aktor: NonNullable<ReturnType<typeof aktorSesi>>; onChanged: () => void }) {
  const pemetaan = repo.pemetaanByTA(ta_id);
  const toast = useToast();
  const [draft, setDraft] = useState<Record<string, number>>(() =>
    Object.fromEntries(pemetaan.map((p) => [p.id, anggaran.paguSubkegiatan(p.id)])),
  );
  const [err, setErr] = useState<string | null>(null);
  const induk = repo.tahunAnggaranById(ta_id)?.pagu_induk ?? 0;
  const total = pemetaan.reduce((s, p) => s + (draft[p.id] ?? 0), 0);
  const selisih = induk - total;
  const terkunci = anggaran.sudahDisahkan(ta_id) || !anggaran.jendelaTerbuka(ta_id);
  const simpan = () => {
    const payload = Object.fromEntries(pemetaan.map((p) => [p.id, draft[p.id] ?? 0]));
    const hasil = anggaran.simpanAlokasiSubkegiatan(ta_id, payload, aktor);
    if (!hasil.ok) { setErr(hasil.error ?? 'Gagal'); return; }
    setErr(null);
    toast.notify('Tersimpan');
    onChanged();
  };
  return (
    <Panel>
      <SectionTitle title="Alokasi Pagu Subkegiatan" desc="Total pagu subkegiatan harus sama dengan Pagu Induk. Selisih harus tepat Rp 0 sebelum Sahkan." />
      <table className="w-full text-sm">
        <thead className="text-left text-mist-dim">
          <tr><th className="py-2">Subkegiatan</th><th>Seksi</th><th className="text-right">Pagu (Rp)</th></tr>
        </thead>
        <tbody>
          {pemetaan.map((p) => (
            <tr key={p.id} className="pro-row border-t border-ink-line">
              <td className="py-1.5 text-mist"><span className="mono">{p.kode_snapshot}</span> {p.nama_snapshot}</td>
              <td className="text-mist-dim">{repo.seksiTAById(p.seksi_ta_id)?.nama_snapshot}</td>
              <td className="text-right">
                <RupiahInput
                  className="w-44"
                  disabled={terkunci}
                  value={draft[p.id] ?? 0}
                  onChange={(n) => setDraft((d) => ({ ...d, [p.id]: n }))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-mist-dim">
          Pagu Induk <span className="mono tnum text-mist">{formatRupiah(induk)}</span> · Total <span className="mono tnum text-mist">{formatRupiah(total)}</span> · Selisih{' '}
          <span className={`mono tnum ${selisih === 0 ? 'text-ok' : 'text-crit'}`}>{formatRupiah(selisih)}</span>
        </p>
        <Button variant="primary" onClick={simpan} disabled={terkunci}>Simpan Alokasi</Button>
      </div>
      {terkunci && <p className="mt-2 text-xs text-mist-dim">Alokasi terkunci: jendela tertutup atau sudah disahkan.</p>}
      <ErrorLine msg={err} />
    </Panel>
  );
}

function SahkanPanel({ ta_id, aktor, onChanged }: { ta_id: string; aktor: NonNullable<ReturnType<typeof aktorSesi>>; onChanged: () => void }) {
  const [err, setErr] = useState<string | null>(null);
  const toast = useToast();
  const g = anggaran.gerbangStatus(ta_id);
  const ta = repo.tahunAnggaranById(ta_id);
  const sahkan = () => {
    const hasil = anggaran.sahkanAlokasi(ta_id, aktor);
    if (!hasil.ok) { setErr(hasil.error ?? 'Gagal'); return; }
    setErr(null);
    toast.notify('Tersimpan');
    onChanged();
  };
  return (
    <Panel>
      <SectionTitle
        title={ta?.mode_apbd_p ? 'Sahkan ulang APBD-P' : 'Sahkan Alokasi'}
        desc={ta?.mode_apbd_p ? 'Sahkan ulang menyesuaikan SPD ke pagu perubahan. Tombol aktif bila semua seksi Tuntas dan selisih Rp 0.' : 'Sahkan menerbitkan SPD 100% pagu. Tombol ini aktif bila semua seksi Tuntas dan selisih Rp 0.'}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">
          Status: <span className={g.disahkan ? 'text-ok' : 'text-mist-dim'}>{g.disahkan ? 'Sudah disahkan' : 'Belum disahkan'}</span>
          {' · '}Gerbang kuitansi: <span className={g.terbuka ? 'text-ok' : 'text-crit'}>{g.terbuka ? 'Terbuka' : 'Tertutup'}</span>
        </p>
        <Button variant="primary" onClick={sahkan} disabled={g.disahkan}>{ta?.mode_apbd_p ? 'Sahkan ulang' : 'Sahkan'}</Button>
      </div>
      <ErrorLine msg={err} />
    </Panel>
  );
}

function SpdPanel({ ta_id, aktor, onChanged }: { ta_id: string; aktor: NonNullable<ReturnType<typeof aktorSesi>>; onChanged: () => void }) {
  const rows = repo.alokasiRekeningByTA(ta_id).filter((a) => a.disahkan);
  const [modal, setModal] = useState<{ mode: 'efisiensi' | 'kenaikan'; id: string; label: string } | null>(null);
  const toast = useToast();
  const [nilai, setNilai] = useState(0);
  const [alasan, setAlasan] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [, refresh] = useReducer((x: number) => x + 1, 0);
  const buka = (mode: 'efisiensi' | 'kenaikan', id: string, label: string) => {
    setModal({ mode, id, label }); setNilai(0); setAlasan(''); setErr(null);
  };
  const tutup = () => { setModal(null); setErr(null); };
  const kirim = () => {
    if (!modal) return;
    const hasil = modal.mode === 'efisiensi'
      ? anggaran.efisiensiSPD(modal.id, nilai, alasan, aktor)
      : anggaran.naikkanSPD(modal.id, nilai, alasan, aktor);
    if (!hasil.ok) { setErr(hasil.error ?? 'Gagal'); return; }
    setModal(null); setErr(null);
    toast.notify('Tersimpan');
    refresh();
    onChanged();
  };
  const ledger = anggaran.ledgerByTA(ta_id);
  return (
    <Panel>
      <SectionTitle title="SPD dan Efisiensi" desc="Sisa SPD Bebas = SPD aktif - komitmen kuitansi - realisasi BKU. Efisiensi tidak boleh melebihi Sisa SPD Bebas." />
      {rows.length === 0 ? (
        <p className="text-sm text-mist-dim">SPD belum terbit. Sahkan alokasi terlebih dahulu.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-mist-dim">
            <tr><th className="py-2">Rekening</th><th className="text-right">Pagu</th><th className="text-right">SPD Aktif</th><th className="text-right">Komitmen</th><th className="text-right">Realisasi</th><th className="text-right">Sisa SPD Bebas</th><th /></tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="pro-row border-t border-ink-line">
                <td className="py-1.5 text-mist"><span className="mono">{a.kode_rekening_snapshot}</span> {a.nama_rekening_snapshot}</td>
                <td className="mono tnum text-right text-mist">{formatRupiah(a.pagu)}</td>
                <td className="mono tnum text-right text-mist">{formatRupiah(a.spd_aktif)}</td>
                <td className="mono tnum text-right text-mist">{formatRupiah(anggaran.komitmenAlokasi(a))}</td>
                <td className="mono tnum text-right text-mist">{formatRupiah(anggaran.realisasiAlokasi(a))}</td>
                <td className="mono tnum text-right text-mist">{formatRupiah(anggaran.sisaSpdBebas(a))}</td>
                <td className="whitespace-nowrap text-right">
                  <Button variant="ghost" onClick={() => buka('efisiensi', a.id, a.nama_rekening_snapshot)}>Efisiensi</Button>
                  <Button variant="ghost" onClick={() => buka('kenaikan', a.id, a.nama_rekening_snapshot)} disabled={a.spd_aktif >= a.pagu}>Naikkan</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {ledger.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-mist">Riwayat perubahan SPD</p>
          <ul className="space-y-1 text-sm text-mist-dim">
            {ledger.map((l) => (
              <li key={l.id}>
                {formatTanggalPendek(l.waktu.slice(0, 10))} · {l.jenis} {formatRupiah(l.perubahan)} · sisa {formatRupiah(l.spd_sesudah)} · {l.aktor_nama_snapshot}{l.keterangan ? ` · ${l.keterangan}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Modal
        open={modal !== null}
        onClose={tutup}
        title={modal?.mode === 'efisiensi' ? 'Efisiensi SPD' : 'Naikkan SPD'}
        footer={
          <>
            <Button variant="secondary" onClick={tutup}>Batal</Button>
            <Button variant="primary" onClick={kirim}>Simpan</Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-mist-dim">{modal?.label}</p>
        <label className="block text-sm text-mist-dim">
          Nilai (Rp)
          <RupiahInput className="mt-1 block w-full" value={nilai} onChange={setNilai} />
        </label>
        <label className="mt-3 block text-sm text-mist-dim">
          {modal?.mode === 'kenaikan' ? 'Alasan (wajib)' : 'Keterangan (opsional)'}
          <Input className="mt-1 block w-full" value={alasan} onChange={(e) => setAlasan(e.target.value)} />
        </label>
        <ErrorLine msg={err} />
      </Modal>
    </Panel>
  );
}

function VersiPanel({ ta_id }: { ta_id: string }) {
  const versi = anggaran.versiByTA(ta_id);
  return (
    <Panel>
      <SectionTitle title="Versi Alokasi" desc="Setiap penyimpanan dan pengesahan tercatat dan tidak dapat diubah." />
      {versi.length === 0 ? (
        <p className="text-sm text-mist-dim">Belum ada versi alokasi.</p>
      ) : (
        <ul className="space-y-1 text-sm text-mist-dim">
          {versi.map((v) => (
            <li key={v.id}>
              {formatTanggalPendek(v.tanggal_efektif)} · {v.aktor_nama_snapshot} ({v.aktor_peran_snapshot}) · {v.keterangan} · {v.rincian.length} baris
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
