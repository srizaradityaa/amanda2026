// KUI-01, KUI-02, KUI-03 — Halaman Kuitansi untuk PPTK (D02 §3, §4, §2.1–2.2)
import { useReducer, useState } from 'react';
import {
  Button, Card, StatusBadge, Field, Input, Select, RupiahInput, Modal,
  useToast, SearchBox, FilterSelect, EmptyState,
} from '@/components/ui';
import { repo } from '@/data/repo';
import * as anggaran from '@/data/anggaran';
import { formatRupiah, terbilang } from '@/lib/format';
import { formatTanggal, formatTanggalPendek, todayWita } from '@/lib/wita';
import { getSession } from '@/lib/auth';
import { aktorSesi, ErrorLine, Panel, SectionTitle } from '@/components/AnggaranShared';
import type { Kuitansi, SessionPayload, AlokasiRekening, PemetaanSubkegiatanTA } from '@/data/types';
import { FileText, Printer, Pencil, XCircle, Lock, Plus } from 'lucide-react';

export function KuitansiPage() {
  const sesi = getSession();
  const [, bump] = useReducer((x: number) => x + 1, 0);
  if (!sesi || !sesi.active_ta_id || !sesi.active_seksi_id || sesi.active_role !== 'pptk') return null;
  const ta_id = sesi.active_ta_id;
  const seksi_id = sesi.active_seksi_id;
  const seksi = repo.seksiTAById(seksi_id);
  if (!seksi) return null;

  return <KuitansiContent sesi={sesi} ta_id={ta_id} seksi_id={seksi_id} seksiNama={seksi.nama_snapshot} onChanged={() => bump()} />;
}

function KuitansiContent({ sesi, ta_id, seksi_id, seksiNama, onChanged }: {
  sesi: SessionPayload; ta_id: string; seksi_id: string; seksiNama: string; onChanged: () => void;
}) {
  const { notify } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editKuitansi, setEditKuitansi] = useState<Kuitansi | null>(null);
  const [cetakKuitansi, setCetakKuitansi] = useState<Kuitansi | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // R-145: filter seksi, periode, jenis belanja
  const [filterPeriode, setFilterPeriode] = useState('');
  const [filterRekening, setFilterRekening] = useState('');
  const [search, setSearch] = useState('');

  const ta = repo.tahunAnggaranById(ta_id)!;
  const gate = anggaran.gerbangStatus(ta_id);
  const gateOpen = gate.terbuka;
  const bisaBuat = gateOpen && repo.canCreateKuitansi(ta_id);

  const semuaKuitansi = repo.kuitansiBySeksi(seksi_id).filter((k) => k.ta_id === ta_id);
  const pemetaanSeksi = repo.pemetaanBySeksi(seksi_id).filter((p) => p.ta_id === ta_id);
  const rekeningOptions = repo.alokasiRekeningByTA(ta_id).filter((a) => a.disahkan && pemetaanSeksi.some((p) => p.id === a.pemetaan_subkegiatan_id));

  // Apply filters
  const filtered = semuaKuitansi.filter((k) => {
    if (filterPeriode && !k.tanggal_kuitansi.startsWith(filterPeriode)) return false;
    if (filterRekening && k.rekening_id !== filterRekening) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!k.uraian.toLowerCase().includes(q) && !k.penerima.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const rekeningLabel = (k: Kuitansi) => {
    const a = rekeningOptions.find((r) => r.rekening_id === k.rekening_id && r.pemetaan_subkegiatan_id === k.pemetaan_subkegiatan_id);
    return a ? `${a.kode_rekening_snapshot}` : '—';
  };

  return (
    <div className="space-y-4">
      <Panel>
        <SectionTitle title="Kuitansi Seksi" desc={`${seksiNama} • TA ${ta.tahun}`} />
        <div className="flex flex-wrap items-center gap-4 text-sm text-mist">
          <span>Total: <span className="mono tnum">{filtered.length}</span></span>
          <StatusBadge kind={gateOpen ? 'ok' : 'crit'} label={gateOpen ? 'Gatekeeper Terbuka' : 'Gatekeeper Tertutup'} />
          {ta.status === 'Masa Transisi' && <StatusBadge kind="warn" label="Masa Transisi — hanya batal" />}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="primary" disabled={!bisaBuat} onClick={() => { setEditKuitansi(null); setShowForm(true); setErr(null); }}>
            <Plus size={16} /> Buat Kuitansi
          </Button>
          {!gateOpen && <span className="text-2xs text-mist-dim">Gatekeeper tertutup. Seluruh seksi harus Seimbang dan Bendahara harus Sahkan.</span>}
          {ta.status === 'Masa Transisi' && <span className="text-2xs text-warn">TA Masa Transisi: tidak dapat membuat kuitansi baru.</span>}
        </div>
      </Panel>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Daftar Kuitansi</h3>
          <div className="flex flex-wrap items-center gap-2">
            <SearchBox value={search} onChange={setSearch} placeholder="Cari uraian/penerima..." />
            <FilterSelect value={filterPeriode} onChange={setFilterPeriode} label="Periode" options={[
              { value: '2026-01', label: 'Jan 2026' }, { value: '2026-02', label: 'Feb 2026' },
              { value: '2026-03', label: 'Mar 2026' }, { value: '2026-04', label: 'Apr 2026' },
              { value: '2026-05', label: 'Mei 2026' }, { value: '2026-06', label: 'Jun 2026' },
            ]} />
            <FilterSelect value={filterRekening} onChange={setFilterRekening} label="Rekening"
              options={[...new Set(rekeningOptions.map((r) => r.rekening_id))].map((rid) => {
                const r = rekeningOptions.find((x) => x.rekening_id === rid)!;
                return { value: rid, label: `${r.kode_rekening_snapshot}` };
              })} />
          </div>
        </div>
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon={<FileText size={28} />} title="Belum ada kuitansi" desc={gateOpen ? 'Tekan "Buat Kuitansi" untuk membuat.' : 'Gatekeeper tertutup.'} />
          ) : (
            <table className="w-full text-2xs">
              <thead className="bg-ink text-mist-dim">
                <tr className="text-left">
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Tanggal</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Rekening</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Uraian</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Penerima</th>
                  <th className="px-4 py-2 font-medium text-right whitespace-nowrap">Bruto</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((k, i) => {
                  const spj = repo.spjByKuitansi(k.id);
                  const bisaEdit = k.status === 'Aktif' && repo.canEditKuitansi(ta_id);
                  const bisaBatal = k.status === 'Aktif' && repo.canBatalkanKuitansi(ta_id);
                  return (
                    <tr key={k.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                      <td className="px-4 py-2 text-mist whitespace-nowrap">{formatTanggalPendek(k.tanggal_kuitansi)}</td>
                      <td className="px-4 py-2 text-mist-dim mono whitespace-nowrap">{rekeningLabel(k)}</td>
                      <td className="px-4 py-2 text-mist">{k.uraian}</td>
                      <td className="px-4 py-2 text-mist-dim">{k.penerima}</td>
                      <td className="px-4 py-2 text-mist mono tnum text-right">{formatRupiah(k.bruto)}</td>
                      <td className="px-4 py-2">
                        {k.status === 'Aktif'
                          ? <StatusBadge kind="ok" label="Aktif" />
                          : <StatusBadge kind="neutral" label="Terkunci" />}
                        {spj && <div className="mt-1 text-2xs text-mist-dim">SPJ: {spj.status}</div>}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setCetakKuitansi(k)} className="rounded p-1 text-mist-dim hover:text-amber" title="Cetak F4">
                            <Printer size={14} />
                          </button>
                          {bisaEdit && (
                            <button onClick={() => { setEditKuitansi(k); setShowForm(true); setErr(null); }} className="rounded p-1 text-mist-dim hover:text-teal" title="Edit">
                              <Pencil size={14} />
                            </button>
                          )}
                          {bisaBatal && (
                            <button onClick={() => {
                              if (confirm('Batalkan kuitansi ini? Data akan dihapus tanpa jejak.')) {
                                const r = repo.batalkanKuitansi(k.id, sesi);
                                if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
                                notify('Tersimpan');
                                onChanged();
                              }
                            }} className="rounded p-1 text-mist-dim hover:text-crit" title="Batalkan">
                              <XCircle size={14} />
                            </button>
                          )}
                          {k.status === 'Terkunci' && (
                            <span className="text-mist-dim" title="Terkunci — lepaskan SPJ untuk mengubah"><Lock size={14} /></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      <ErrorLine msg={err} />

      {showForm && (
        <KuitansiFormModal
          sesi={sesi}
          ta_id={ta_id}
          seksi_id={seksi_id}
          existing={editKuitansi}
          pemetaanSeksi={pemetaanSeksi}
          rekeningOptions={rekeningOptions}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); notify('Tersimpan'); onChanged(); }}
        />
      )}

      {cetakKuitansi && (
        <CetakKuitansiModal kuitansi={cetakKuitansi} onClose={() => setCetakKuitansi(null)} />
      )}
    </div>
  );
}

// ===== KUI-01 — Form buat/ubah kuitansi =====
function KuitansiFormModal({ sesi, ta_id, seksi_id, existing, pemetaanSeksi, rekeningOptions, onClose, onSaved }: {
  sesi: SessionPayload; ta_id: string; seksi_id: string;
  existing: Kuitansi | null;
  pemetaanSeksi: PemetaanSubkegiatanTA[];
  rekeningOptions: AlokasiRekening[];
  onClose: () => void; onSaved: () => void;
}) {
  const [pemetaanId, setPemetaanId] = useState(existing?.pemetaan_subkegiatan_id ?? '');
  const [rekeningId, setRekeningId] = useState(existing?.rekening_id ?? '');
  const [penerima, setPenerima] = useState(existing?.penerima ?? '');
  const [bruto, setBruto] = useState(existing?.bruto ?? 0);
  const [uraian, setUraian] = useState(existing?.uraian ?? '');
  const [tanggal, setTanggal] = useState(existing?.tanggal_kuitansi ?? todayWita());
  const [err, setErr] = useState<string | null>(null);

  // Filter rekening by selected pemetaan
  const rekeningForPemetaan = rekeningOptions.filter((r) => r.pemetaan_subkegiatan_id === pemetaanId);
  const selectedAlokasi = rekeningForPemetaan.find((r) => r.rekening_id === rekeningId);
  const sisaSpd = selectedAlokasi ? anggaran.sisaSpdBebas(selectedAlokasi) : 0;
  // Saat edit, kuitansi sendiri termasuk dalam komitmen, jadi tampilkan sisa + bruto lama
  const sisaUntukEdit = selectedAlokasi && existing ? anggaran.sisaSpdBebas(selectedAlokasi) + existing.bruto : sisaSpd;

  const simpan = () => {
    setErr(null);
    if (!pemetaanId) { setErr('Pilih subkegiatan.'); return; }
    if (!rekeningId) { setErr('Pilih rekening belanja.'); return; }
    if (existing) {
      const r = repo.ubahKuitansi(existing.id, { penerima, bruto, uraian, tanggal_kuitansi: tanggal }, sesi);
      if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
      onSaved();
    } else {
      const r = repo.buatKuitansi({ ta_id, seksi_ta_id: seksi_id, pemetaan_subkegiatan_id: pemetaanId, rekening_id: rekeningId, penerima, bruto, uraian, tanggal_kuitansi: tanggal }, sesi);
      if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
      onSaved();
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={existing ? 'Ubah Kuitansi' : 'Buat Kuitansi'}
      wide
      footer={
        <div className="flex items-center justify-between">
          <ErrorLine msg={err} />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Batal</Button>
            <Button variant="primary" onClick={simpan}>{existing ? 'Simpan Perubahan' : 'Simpan'}</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Subkegiatan" required>
          <Select value={pemetaanId} onChange={(e) => { setPemetaanId(e.target.value); setRekeningId(''); }} disabled={!!existing}>
            <option value="">Pilih subkegiatan</option>
            {pemetaanSeksi.map((p) => (
              <option key={p.id} value={p.id}>{p.kode_snapshot} — {p.nama_snapshot}</option>
            ))}
          </Select>
          {existing && <span className="mt-1 block text-2xs text-mist-dim">Subkegiatan tidak dapat diubah setelah kuitansi dibuat.</span>}
        </Field>

        <Field label="Rekening Belanja" required>
          <Select value={rekeningId} onChange={(e) => setRekeningId(e.target.value)} disabled={!!existing || !pemetaanId}>
            <option value="">Pilih rekening</option>
            {rekeningForPemetaan.map((r) => (
              <option key={r.rekening_id} value={r.rekening_id}>{r.kode_rekening_snapshot} — {r.nama_rekening_snapshot}</option>
            ))}
          </Select>
          {selectedAlokasi && (
            <span className="mt-1 block text-2xs text-mist-dim">
              Sisa SPD Bebas: <span className="mono tnum text-mist">{formatRupiah(sisaUntukEdit)}</span>
            </span>
          )}
        </Field>

        <Field label="Nominal Bruto" required>
          <RupiahInput value={bruto} onChange={setBruto} />
        </Field>

        <Field label="Uraian Pembayaran" required>
          <Input value={uraian} onChange={(e) => setUraian(e.target.value)} placeholder="Contoh: Honorarium kegiatan rapat koordinasi" />
        </Field>

        <Field label="Nama Penerima" required>
          <Input value={penerima} onChange={(e) => setPenerima(e.target.value)} placeholder="Nama penerima/identitas" />
        </Field>

        <Field label="Tanggal Kuitansi" required>
          <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

// ===== KUI-03 — Cetak kuitansi universal F4 dibagi dua (D02 §2.1–2.2) =====
function CetakKuitansiModal({ kuitansi, onClose }: { kuitansi: Kuitansi; onClose: () => void }) {
  const tmpl = repo.templateKuitansi();
  const ta = repo.tahunAnggaranById(kuitansi.ta_id)!;
  const pem = repo.pemetaanBySeksi(kuitansi.seksi_ta_id).find((p) => p.id === kuitansi.pemetaan_subkegiatan_id);
  const alokasi = repo.alokasiRekeningByTA(kuitansi.ta_id).find(
    (a) => a.pemetaan_subkegiatan_id === kuitansi.pemetaan_subkegiatan_id && a.rekening_id === kuitansi.rekening_id,
  );

  return (
    <Modal open={true} onClose={onClose} title="Cetak Kuitansi (F4)" wider
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Tutup</Button><Button variant="primary" onClick={() => window.print()}>Cetak</Button></div>}
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-ink-edge bg-white p-8 text-black print:border-0 print:p-0">
        {/* Header: kotak TA kiri atas, logo/instansi, tabel kanan atas kode subkegiatan + rekening */}
        <div className="flex items-start justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-3">
            <div className="border-2 border-black px-3 py-1 text-center">
              <div className="text-xs font-bold">TA</div>
              <div className="text-lg font-bold">{ta.tahun}</div>
            </div>
            <div>
              <div className="text-sm font-bold">{tmpl.nama_instansi}</div>
              <div className="text-xs">{tmpl.judul_dokumen}</div>
            </div>
          </div>
          <table className="border-2 border-black text-xs">
            <tbody>
              <tr>
                <td className="border-b border-black px-2 py-0.5 font-mono">{pem?.kode_snapshot ?? '—'}</td>
                <td className="border-b border-black px-2 py-0.5 font-mono">{alokasi?.kode_rekening_snapshot ?? '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Badan: bruto, terbilang, UNTUK PEMBAYARAN, Sub Keg. */}
        <div className="mt-4 space-y-3">
          <div className="flex">
            <span className="w-40 text-sm">Terima uang sejumlah</span>
            <span className="text-sm font-bold">: {formatRupiah(kuitansi.bruto)}</span>
          </div>
          <div className="flex">
            <span className="w-40 text-sm">Terbilang</span>
            <span className="text-sm italic">: {terbilang(kuitansi.bruto)}</span>
          </div>
          <div className="flex">
            <span className="w-40 text-sm">UNTUK PEMBAYARAN</span>
            <span className="text-sm">: {kuitansi.uraian}</span>
          </div>
          <div className="flex">
            <span className="w-40 text-sm">Sub Keg.</span>
            <span className="text-sm">: {pem?.nama_snapshot ?? '—'}</span>
          </div>
        </div>

        {/* 4 blok TTD 2x2 (F-29) */}
        <div className="mt-10 grid grid-cols-2 gap-8 text-center text-sm">
          <div>
            <div className="font-semibold">PA/KPA</div>
            <div className="mt-12 font-bold">{kuitansi.pa_kpa_nama}</div>
            <div className="text-xs">NIP. {kuitansi.pa_kpa_nip}</div>
          </div>
          <div>
            <div className="font-semibold">Bendahara Pengeluaran</div>
            <div className="mt-12 font-bold">{kuitansi.bendahara_nama}</div>
            <div className="text-xs">NIP. {kuitansi.bendahara_nip}</div>
          </div>
          <div>
            <div className="font-semibold">PPTK</div>
            <div className="mt-12 font-bold">{kuitansi.pptk_nama}</div>
            <div className="text-xs">NIP. {kuitansi.pptk_nip}</div>
          </div>
          <div>
            <div className="font-semibold">Penerima</div>
            <div className="mt-8 text-xs text-gray-500">{tmpl.tempat_penerima}, {formatTanggal(kuitansi.tanggal_kuitansi)}</div>
            <div className="mt-4 font-bold">{kuitansi.penerima}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
