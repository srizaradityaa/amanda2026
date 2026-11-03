import { useReducer, useState } from 'react';
import { Button, RupiahInput, Select, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import * as anggaran from '@/data/anggaran';
import { formatRupiah } from '@/lib/format';
import { getSession } from '@/lib/auth';
import {
  aktorSesi, ErrorLine, Panel, SectionTitle, StatusSeksiBadge, useTick, sisaWaktu,
} from '@/components/AnggaranShared';

type BarisDraft = { key: number; rekening_id: string; pagu: number };

let keySeq = 0;
function barisBaru(rekening_id = '', pagu = 0): BarisDraft {
  keySeq += 1;
  return { key: keySeq, rekening_id, pagu };
}

export function AnggaranPptkPage() {
  const sesi = getSession();
  const aktor = aktorSesi();
  const [, bump] = useReducer((x: number) => x + 1, 0);
  if (!sesi || !aktor || !sesi.active_ta_id || !sesi.active_seksi_id) return null;
  const ta_id = sesi.active_ta_id;
  const seksi_id = sesi.active_seksi_id;
  const seksi = repo.seksiTAById(seksi_id);
  if (!seksi) return null;
  return (
    <div>
      <Panel>
        <SectionTitle title={`Seksi ${seksi.nama_snapshot}`} desc="Pagu seksi dihitung otomatis dari subkegiatan Bendahara." />
        <div className="flex flex-wrap items-center gap-6 text-sm text-mist">
          <span>Pagu seksi <span className="mono tnum">{formatRupiah(anggaran.paguSeksi(ta_id, seksi_id))}</span></span>
          <span><StatusSeksiBadge status={anggaran.statusSeksi(ta_id, seksi_id)} /></span>
        </div>
      </Panel>
      <RekeningPanel ta_id={ta_id} seksi_id={seksi_id} aktor={aktor} onChanged={() => bump()} />
      <SpdSeksiPanel ta_id={ta_id} seksi_id={seksi_id} />
    </div>
  );
}

function RekeningPanel({ ta_id, seksi_id, aktor, onChanged }: {
  ta_id: string; seksi_id: string; aktor: NonNullable<ReturnType<typeof aktorSesi>>; onChanged: () => void;
}) {
  useTick();
  const pemetaan = repo.pemetaanBySeksi(seksi_id).filter((p) => p.ta_id === ta_id);
  const semuaRekening = repo.masterRekeningBelanja();
  const { notify } = useToast();
  const [draft, setDraft] = useState<Record<string, BarisDraft[]>>(() =>
    Object.fromEntries(pemetaan.map((p) => [
      p.id,
      anggaran.rekeningPemetaan(p.id).map((a) => barisBaru(a.rekening_id, a.pagu)),
    ])),
  );
  const [err, setErr] = useState<Record<string, string | null>>({});
  const terkunci = !anggaran.jendelaTerbuka(ta_id);

  const ubah = (pemetaan_id: string, fn: (rows: BarisDraft[]) => BarisDraft[]) =>
    setDraft((d) => ({ ...d, [pemetaan_id]: fn(d[pemetaan_id] ?? []) }));

  const simpan = (pemetaan_id: string) => {
    const baris = (draft[pemetaan_id] ?? []).filter((b) => b.rekening_id);
    const hasil = anggaran.simpanAlokasiRekening(ta_id, pemetaan_id, baris.map((b) => ({ rekening_id: b.rekening_id, pagu: b.pagu })), aktor);
    if (!hasil.ok) { setErr((e) => ({ ...e, [pemetaan_id]: hasil.error ?? 'Gagal' })); return; }
    setErr((e) => ({ ...e, [pemetaan_id]: null }));
    notify('Tersimpan');
    onChanged();
  };

  return (
    <Panel>
      <SectionTitle title="Alokasi Rekening Belanja" desc="Total rekening harus sama dengan pagu subkegiatan. Satu rekening boleh dipakai di subkegiatan lain, tetapi tidak dua kali di subkegiatan yang sama." />
      {pemetaan.length === 0 && <p className="text-sm text-mist-dim">Seksi ini belum memiliki subkegiatan.</p>}
      {pemetaan.map((p) => {
        const pagu = anggaran.paguSubkegiatan(p.id);
        const rows = draft[p.id] ?? [];
        const total = rows.reduce((s, b) => s + (b.pagu || 0), 0);
        const selisih = pagu - total;
        const disahkan = anggaran.rekeningPemetaan(p.id).some((a) => a.disahkan);
        const kunci = terkunci || disahkan;
        return (
          <div key={p.id} className="mb-5 border-t border-ink-line pt-4 first:border-t-0 first:pt-0">
            <p className="mb-2 text-sm font-semibold text-mist">
              <span className="mono">{p.kode_snapshot}</span> {p.nama_snapshot}
              <span className="ml-3 font-normal text-mist-dim">Pagu subkegiatan <span className="mono tnum">{formatRupiah(pagu)}</span></span>
            </p>
            <div className="space-y-2">
              {rows.map((b) => (
                <div key={b.key} className="flex flex-wrap items-center gap-2">
                  <Select
                    className="min-w-[16rem] flex-1"
                    disabled={kunci}
                    value={b.rekening_id}
                    onChange={(e) => ubah(p.id, (rs) => rs.map((x) => (x.key === b.key ? { ...x, rekening_id: e.target.value } : x)))}
                  >
                    <option value="">Pilih rekening</option>
                    {semuaRekening
                      .filter((r) => r.id === b.rekening_id
                        || (r.status === 'Aktif' && !rows.some((x) => x.key !== b.key && x.rekening_id === r.id)))
                      .map((r) => (
                        <option key={r.id} value={r.id}>{r.kode_rekening} {r.nama}</option>
                      ))}
                  </Select>
                  <div className="w-44">
                    <RupiahInput
                      disabled={kunci}
                      value={b.pagu}
                      onChange={(n) => ubah(p.id, (rs) => rs.map((x) => (x.key === b.key ? { ...x, pagu: n } : x)))}
                    />
                  </div>
                  <Button variant="ghost" disabled={kunci} onClick={() => ubah(p.id, (rs) => rs.filter((x) => x.key !== b.key))}>Hapus</Button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap gap-3 text-mist-dim">
                <span>Total <span className="mono tnum text-mist">{formatRupiah(total)}</span></span>
                <span>Selisih <span className={`mono tnum ${selisih === 0 ? 'text-ok' : 'text-crit'}`}>{formatRupiah(selisih)}</span></span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" disabled={kunci} onClick={() => ubah(p.id, (rs) => [...rs, barisBaru()])}>Tambah Rekening</Button>
                <Button variant="primary" disabled={kunci} onClick={() => simpan(p.id)}>Simpan</Button>
              </div>
            </div>
            {disahkan && <p className="mt-2 text-xs text-mist-dim">Sudah disahkan. Alokasi tidak dapat diubah.</p>}
            <ErrorLine msg={err[p.id] ?? null} />
          </div>
        );
      })}
      {terkunci && pemetaan.length > 0 && (
        <p className="text-xs text-mist-dim">Jendela input tertutup{anggaran.jendelaTutup(ta_id) ? ` (tutup ${anggaran.jendelaTutup(ta_id)} WITA, ${sisaWaktu(anggaran.jendelaTutup(ta_id)!)})` : ''}.</p>
      )}
    </Panel>
  );
}

function SpdSeksiPanel({ ta_id, seksi_id }: { ta_id: string; seksi_id: string }) {
  const pemetaanIds = repo.pemetaanBySeksi(seksi_id).filter((p) => p.ta_id === ta_id).map((p) => p.id);
  const rows = repo.alokasiRekeningByTA(ta_id).filter((a) => pemetaanIds.includes(a.pemetaan_subkegiatan_id) && a.disahkan);
  const paguSeksi = rows.reduce((s, a) => s + a.pagu, 0);
  const realisasi = rows.reduce((s, a) => s + anggaran.realisasiAlokasi(a), 0);
  const sisa = rows.reduce((s, a) => s + anggaran.sisaSpdBebas(a), 0);
  return (
    <Panel>
      <SectionTitle title="SPD Seksi" desc="Sisa SPD Bebas seksi ini dihitung dari SPD aktif, komitmen kuitansi, dan realisasi BKU." />
      {rows.length === 0 ? (
        <p className="text-sm text-mist-dim">SPD seksi belum terbit. Bendahara perlu menekan Sahkan setelah seluruh seksi seimbang.</p>
      ) : (
        <div className="flex flex-wrap gap-6 text-sm text-mist">
          <span>Pagu <span className="mono tnum">{formatRupiah(paguSeksi)}</span></span>
          <span>Realisasi <span className="mono tnum">{formatRupiah(realisasi)}</span></span>
          <span>Sisa SPD Bebas <span className="mono tnum">{formatRupiah(sisa)}</span></span>
        </div>
      )}
    </Panel>
  );
}
