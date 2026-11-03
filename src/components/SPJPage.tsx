// SPJ-01, SPJ-02, SPJ-03, SPJ-04, BNT-04 — Halaman SPJ untuk PPTK (D02 §5, D01 §9, D03 §10)
import { useReducer, useState } from 'react';
import {
  Button, Card, StatusBadge, Field, Input, Select, Modal,
  useToast, SearchBox, FilterSelect, EmptyState,
} from '@/components/ui';
import { repo } from '@/data/repo';
import { gerbangStatus } from '@/data/anggaran';
import { formatRupiah } from '@/lib/format';
import { formatTanggalPendek, todayWita } from '@/lib/wita';
import { getSession } from '@/lib/auth';
import { aktorSesi, ErrorLine, Panel, SectionTitle } from '@/components/AnggaranShared';
import type { SPJ, Kuitansi, SessionPayload, FormDinamis, FieldFormDinamis } from '@/data/types';
import { FileText, ScrollText, Plus, Trash2, Send, Unlock, Lock, Eye, Pencil, XCircle } from 'lucide-react';

export function SPJPage() {
  const sesi = getSession();
  const [, bump] = useReducer((x: number) => x + 1, 0);
  if (!sesi || !sesi.active_ta_id || !sesi.active_seksi_id || sesi.active_role !== 'pptk') return null;
  const ta_id = sesi.active_ta_id;
  const seksi_id = sesi.active_seksi_id;
  const seksi = repo.seksiTAById(seksi_id);
  if (!seksi) return null;

  return <SPJContent sesi={sesi} ta_id={ta_id} seksi_id={seksi_id} seksiNama={seksi.nama_snapshot} onChanged={() => bump()} />;
}

function SPJContent({ sesi, ta_id, seksi_id, seksiNama, onChanged }: {
  sesi: SessionPayload; ta_id: string; seksi_id: string; seksiNama: string; onChanged: () => void;
}) {
  const { notify } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [editSPJ, setEditSPJ] = useState<SPJ | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // R-145: filter
  const [filterStatus, setFilterStatus] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [search, setSearch] = useState('');

  const ta = repo.tahunAnggaranById(ta_id)!;
  const kuitansiSeksi = repo.kuitansiBySeksi(seksi_id).filter((k) => k.ta_id === ta_id);
  const spjSeksi = repo.spjByTA(ta_id).filter((s) => kuitansiSeksi.some((k) => k.id === s.kuitansi_id));

  const filtered = spjSeksi.filter((s) => {
    if (filterStatus && s.status !== filterStatus) return false;
    if (filterJenis && s.jenis_belanja !== filterJenis) return false;
    if (search) {
      const q = search.toLowerCase();
      const k = kuitansiSeksi.find((x) => x.id === s.kuitansi_id);
      if (!k?.uraian.toLowerCase().includes(q) && !s.jenis_belanja.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Kuitansi Aktif yang belum punya SPJ (bisa dibuatkan SPJ)
  const kuitansiUntukSPJ = kuitansiSeksi.filter((k) => k.status === 'Aktif' && !repo.spjByKuitansi(k.id) && repo.canCreateSPJ(ta_id));

  const jenisBelanjaList = repo.jenisBelanjaList();

  return (
    <div className="space-y-4">
      <Panel>
        <SectionTitle title="SPJ Seksi" desc={`${seksiNama} • TA ${ta.tahun}`} />
        <div className="flex flex-wrap items-center gap-4 text-sm text-mist">
          <span>Total: <span className="mono tnum">{filtered.length}</span></span>
          <span>Kuitansi Aktif tanpa SPJ: <span className="mono tnum">{kuitansiUntukSPJ.length}</span></span>
        </div>
        <div className="mt-4">
          <Button variant="primary" disabled={kuitansiUntukSPJ.length === 0 || !repo.canCreateSPJ(ta_id) || !gerbangStatus(ta_id).terbuka} onClick={() => { setShowCreate(true); setErr(null); }}>
            <Plus size={16} /> Buat SPJ
          </Button>
          {kuitansiUntukSPJ.length === 0 && <span className="ml-3 text-2xs text-mist-dim">Tidak ada kuitansi Aktif yang siap dipasangkan SPJ.</span>}
          {ta.status === 'Masa Transisi' && <span className="ml-3 text-2xs text-warn">TA Masa Transisi: tidak dapat membuat SPJ baru.</span>}
        </div>
      </Panel>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Daftar SPJ</h3>
          <div className="flex flex-wrap items-center gap-2">
            <SearchBox value={search} onChange={setSearch} placeholder="Cari uraian/jenis..." />
            <FilterSelect value={filterStatus} onChange={setFilterStatus} label="Status" options={[
              { value: 'Draft', label: 'Draft' }, { value: 'Terkunci', label: 'Terkunci' },
              { value: 'Menunggu BKU', label: 'Menunggu BKU' }, { value: 'Dibukukan', label: 'Dibukukan' },
            ]} />
            <FilterSelect value={filterJenis} onChange={setFilterJenis} label="Jenis Belanja"
              options={jenisBelanjaList.map((j) => ({ value: j, label: j }))} />
          </div>
        </div>
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon={<ScrollText size={28} />} title="Belum ada SPJ" />
          ) : (
            <table className="w-full text-2xs">
              <thead className="bg-ink text-mist-dim">
                <tr className="text-left">
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Kuitansi</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Jenis Belanja</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Versi Form</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-2 font-medium whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const k = kuitansiSeksi.find((x) => x.id === s.kuitansi_id);
                  return (
                    <tr key={s.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                      <td className="px-4 py-2 text-mist">
                        <div>{k?.uraian ?? '—'}</div>
                        <div className="text-mist-dim">{k && formatTanggalPendek(k.tanggal_kuitansi)} • {formatRupiah(k?.bruto ?? 0)}</div>
                      </td>
                      <td className="px-4 py-2 text-mist-dim">{s.jenis_belanja}</td>
                      <td className="px-4 py-2 text-mist-dim mono">{s.versi_form}</td>
                      <td className="px-4 py-2">
                        <SPJStatusBadge status={s.status} />
                        {s.catatan_revisi && <div className="mt-1 text-2xs text-warn">Revisi: {s.catatan_revisi}</div>}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditSPJ(s)} className="rounded p-1 text-mist-dim hover:text-amber" title="Buka SPJ">
                            <Eye size={14} />
                          </button>
                          {s.status === 'Draft' && (
                            <>
                              <button onClick={() => {
                                const r = repo.lepasSPJ(s.id, sesi);
                                if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
                                notify('Tersimpan'); onChanged();
                              }} className="rounded p-1 text-mist-dim hover:text-teal" title="Lepas SPJ (kuitansi kembali Aktif)">
                                <Unlock size={14} />
                              </button>
                              <button onClick={() => {
                                if (confirm('Batalkan SPJ ini? Data akan dihapus tanpa jejak.')) {
                                  const r = repo.batalkanSPJ(s.id, sesi);
                                  if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
                                  notify('Tersimpan'); onChanged();
                                }
                              }} className="rounded p-1 text-mist-dim hover:text-crit" title="Batalkan SPJ">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {s.status === 'Terkunci' && <Lock size={14} className="text-mist-dim" />}
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

      {showCreate && (
        <BuatSPJModal sesi={sesi} ta_id={ta_id} kuitansiOptions={kuitansiUntukSPJ} jenisBelanjaList={jenisBelanjaList}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); notify('Tersimpan'); onChanged(); }} />
      )}

      {editSPJ && (
        <EditSPJModal sesi={sesi} spj={editSPJ} kuitansi={kuitansiSeksi.find((k) => k.id === editSPJ.kuitansi_id) ?? null}
          onClose={() => { setEditSPJ(null); onChanged(); }}
          onSaved={() => { notify('Tersimpan'); onChanged(); }} />
      )}
    </div>
  );
}

function SPJStatusBadge({ status }: { status: SPJ['status'] }) {
  const kind = status === 'Draft' ? 'neutral' : status === 'Terkunci' ? 'warn' : status === 'Menunggu BKU' ? 'spike' : 'ok';
  return <StatusBadge kind={kind as 'neutral' | 'warn' | 'spike' | 'ok'} label={status} />;
}

// ===== SPJ-01 — Buat SPJ: pilih kuitansi Aktif + jenis belanja =====
function BuatSPJModal({ sesi, ta_id, kuitansiOptions, jenisBelanjaList, onClose, onCreated }: {
  sesi: SessionPayload; ta_id: string;
  kuitansiOptions: Kuitansi[];
  jenisBelanjaList: string[];
  onClose: () => void; onCreated: () => void;
}) {
  const [kuitansiId, setKuitansiId] = useState('');
  const [jenis, setJenis] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const simpan = () => {
    setErr(null);
    if (!kuitansiId) { setErr('Pilih kuitansi.'); return; }
    if (!jenis) { setErr('Pilih jenis belanja.'); return; }
    const r = repo.buatSPJ({ ta_id, kuitansi_id: kuitansiId, jenis_belanja: jenis }, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    onCreated();
  };

  return (
    <Modal open={true} onClose={onClose} title="Buat SPJ" wide
      footer={<div className="flex items-center justify-between"><ErrorLine msg={err} /><div className="flex gap-2"><Button variant="ghost" onClick={onClose}>Batal</Button><Button variant="primary" onClick={simpan}>Buat SPJ</Button></div></div>}>
      <div className="space-y-4">
        <Field label="Kuitansi Aktif (tanpa SPJ)" required>
          <Select value={kuitansiId} onChange={(e) => setKuitansiId(e.target.value)}>
            <option value="">Pilih kuitansi</option>
            {kuitansiOptions.map((k) => (
              <option key={k.id} value={k.id}>{formatTanggalPendek(k.tanggal_kuitansi)} — {k.uraian} ({formatRupiah(k.bruto)})</option>
            ))}
          </Select>
        </Field>
        <Field label="Jenis Belanja" required hint="Menentukan Form Dinamis yang tampil. Tidak dapat diubah setelah SPJ dibuat.">
          <Select value={jenis} onChange={(e) => setJenis(e.target.value)}>
            <option value="">Pilih jenis belanja</option>
            {jenisBelanjaList.map((j) => <option key={j} value={j}>{j}</option>)}
          </Select>
        </Field>
        <p className="text-2xs text-mist-dim">SPJ berpasangan 1:1 dengan kuitansi. Kuitansi akan terkunci sejak SPJ Draft dibuat.</p>
      </div>
    </Modal>
  );
}

// ===== SPJ-04 + BNT-04 — Edit SPJ: isi Form Dinamis, auto-fill nama, ajukan =====
function EditSPJModal({ sesi, spj, kuitansi, onClose, onSaved }: {
  sesi: SessionPayload; spj: SPJ; kuitansi: Kuitansi | null;
  onClose: () => void; onSaved: () => void;
}) {
  const { notify } = useToast();
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<'form' | 'detail'>('form');
  const isDraft = spj.status === 'Draft';
  const form = repo.getFormByVersion(spj.jenis_belanja, spj.versi_form);

  // State jawaban: field tunggal + blok berulang
  const [jawaban, setJawaban] = useState<Record<string, string | string[] | Record<string, string>[]>>(() => {
    const init: Record<string, string | string[] | Record<string, string>[]> = {};
    if (form) {
      for (const f of form.fields) init[f.id] = spj.jawaban[f.id] ?? '';
      if (form.blok_berulang) {
        const existing = spj.jawaban[form.blok_berulang.id];
        init[form.blok_berulang.id] = Array.isArray(existing) ? existing : [createBlokRow(form.blok_berulang.id, form.blok_berulang.fields)];
      }
    }
    return init;
  });

  const simpanJawaban = () => {
    setErr(null);
    // BNT-04: catat direktori dari field bertag [SYS_PERSONNEL_ID] / [SYS_PERSONNEL_NAME]
    if (form) {
      _catatDirektoriFromJawaban(form, jawaban, spj.id);
    }
    const r = repo.simpanJawabanSPJ(spj.id, jawaban, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    notify('Tersimpan');
    onSaved();
  };

  const ajukan = () => {
    setErr(null);
    // Simpan dulu
    if (form) _catatDirektoriFromJawaban(form, jawaban, spj.id);
    const rSave = repo.simpanJawabanSPJ(spj.id, jawaban, sesi);
    if (!rSave.ok) { setErr(rSave.error ?? 'Gagal'); return; }
    // Ajukan
    const r = repo.ajukanSPJ(spj.id, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    notify('Tersimpan');
    onClose();
  };

  const lepas = () => {
    if (!confirm('Lepas SPJ ini? Kuitansi akan kembali Aktif. Data SPJ dihapus tanpa jejak.')) return;
    const r = repo.lepasSPJ(spj.id, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    notify('Tersimpan');
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title={`SPJ — ${spj.jenis_belanja} (${spj.versi_form})`} wider
      footer={
        <div className="flex items-center justify-between">
          <ErrorLine msg={err} />
          <div className="flex gap-2">
            {isDraft && <Button variant="danger" onClick={lepas}><Unlock size={14} /> Lepas SPJ</Button>}
            {isDraft && <Button variant="secondary" onClick={simpanJawaban}><Pencil size={14} /> Simpan Draft</Button>}
            {isDraft && <Button variant="primary" onClick={ajukan}><Send size={14} /> Ajukan ke Verifikator</Button>}
            {!isDraft && <span className="text-2xs text-mist-dim">SPJ {spj.status} — tidak dapat diubah</span>}
          </div>
        </div>
      }
    >
      {/* Info kuitansi */}
      {kuitansi && (
        <div className="mb-4 rounded-md border border-ink-edge bg-ink p-3 text-2xs text-mist-dim">
          <div>Kuitansi: <span className="text-mist">{kuitansi.uraian}</span></div>
          <div>Bruto: <span className="text-mist mono tnum">{formatRupiah(kuitansi.bruto)}</span> • Penerima: <span className="text-mist">{kuitansi.penerima}</span></div>
          <div>Status SPJ: <SPJStatusBadge status={spj.status} /></div>
          {spj.catatan_revisi && <div className="mt-1 text-warn">Catatan revisi: {spj.catatan_revisi}</div>}
        </div>
      )}

      {/* Tab */}
      <div className="mb-4 flex gap-1 border-b border-ink-edge">
        <button onClick={() => setTab('form')} className={`px-3 py-1.5 text-sm ${tab === 'form' ? 'border-b-2 border-amber text-amber' : 'text-mist-dim'}`}>Form Dinamis</button>
        <button onClick={() => setTab('detail')} className={`px-3 py-1.5 text-sm ${tab === 'detail' ? 'border-b-2 border-amber text-amber' : 'text-mist-dim'}`}>Detail</button>
      </div>

      {tab === 'form' && form ? (
        <FormDinamisEditor form={form} jawaban={jawaban} setJawaban={setJawaban} isDraft={isDraft} spjId={spj.id} />
      ) : tab === 'form' && !form ? (
        <p className="text-sm text-mist-dim">Form tidak ditemukan untuk versi {spj.versi_form}.</p>
      ) : (
        <div className="space-y-2 text-2xs text-mist-dim">
          <div>Jenis Belanja: <span className="text-mist">{spj.jenis_belanja}</span></div>
          <div>Versi Form: <span className="text-mist mono">{spj.versi_form}</span></div>
          <div>Status: <span className="text-mist">{spj.status}</span></div>
          <div>Total Pajak: <span className="text-mist mono tnum">{formatRupiah(spj.entri_pajak.reduce((s, e) => s + e.nominal, 0))}</span></div>
          <div>Lampiran: <span className="text-mist">{spj.lampiran_nama_asli ?? 'belum ada'}</span></div>
        </div>
      )}
    </Modal>
  );
}

// ===== SPJ-04 — Form Dinamis editor dengan blok berulang + BNT-04 auto-fill =====
function FormDinamisEditor({ form, jawaban, setJawaban, isDraft, spjId }: {
  form: FormDinamis;
  jawaban: Record<string, string | string[] | Record<string, string>[]>;
  setJawaban: (j: Record<string, string | string[] | Record<string, string>[]>) => void;
  isDraft: boolean;
  spjId: string;
}) {
  const setField = (id: string, val: string) => {
    setJawaban({ ...jawaban, [id]: val });
  };

  // BNT-04: auto-fill nama dari Direktori Transaksional
  const handleNipNikChange = (fieldId: string, val: string, partnerFieldId: string) => {
    setField(fieldId, val);
    const dir = repo.lookupDirektori(val);
    if (dir) {
      setJawaban({ ...jawaban, [fieldId]: val, [partnerFieldId]: dir.nama });
    }
  };

  // Blok berulang
  const blok = form.blok_berulang;
  const blokRows: Record<string, string>[] = blok ? (Array.isArray(jawaban[blok.id]) ? jawaban[blok.id] as Record<string, string>[] : [createBlokRow(blok.id, blok.fields)]) : [];

  const setBlokRow = (idx: number, fieldId: string, val: string) => {
    const newRows = [...blokRows];
    newRows[idx] = { ...newRows[idx], [fieldId]: val };
    setJawaban({ ...jawaban, [blok!.id]: newRows });
  };

  const handleBlokNipNik = (idx: number, fieldId: string, val: string, partnerFieldId: string) => {
    const dir = repo.lookupDirektori(val);
    const newRows = [...blokRows];
    newRows[idx] = { ...newRows[idx], [fieldId]: val, ...(dir ? { [partnerFieldId]: dir.nama } : {}) };
    setJawaban({ ...jawaban, [blok!.id]: newRows });
  };

  const tambahBlokEntri = () => {
    if (!blok) return;
    const newRows = [...blokRows, createBlokRow(blok.id, blok.fields)];
    setJawaban({ ...jawaban, [blok.id]: newRows });
  };

  const hapusBlokEntri = (idx: number) => {
    if (!blok || blokRows.length <= 1) return; // min 1 entri
    const newRows = blokRows.filter((_, i) => i !== idx);
    setJawaban({ ...jawaban, [blok.id]: newRows });
  };

  return (
    <div className="space-y-4">
      {/* Field tunggal */}
      {form.fields.map((f) => (
        <FieldDinamis key={f.id} field={f} value={jawaban[f.id] as string ?? ''} onChange={(v) => {
          // Cek apakah field ini punya tag [SYS_PERSONNEL_ID]
          if (f.system_tag === '[SYS_PERSONNEL_ID]') {
            // Cari partner [SYS_PERSONNEL_NAME] di field utama
            const partner = form.fields.find((x) => x.system_tag === '[SYS_PERSONNEL_NAME]');
            if (partner) { handleNipNikChange(f.id, v, partner.id); return; }
          }
          setField(f.id, v);
        }} disabled={!isDraft} />
      ))}

      {/* Blok berulang */}
      {blok && (
        <div className="border-t border-ink-edge pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-mist">{blok.nama}</h4>
            {isDraft && <Button variant="secondary" onClick={tambahBlokEntri}><Plus size={14} /> Tambah</Button>}
          </div>
          <div className="space-y-3">
            {blokRows.map((row, idx) => (
              <div key={idx} className="rounded-md border border-ink-edge bg-ink p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xs text-mist-dim">Entri {idx + 1}</span>
                  {isDraft && blokRows.length > 1 && (
                    <button onClick={() => hapusBlokEntri(idx)} className="text-mist-dim hover:text-crit" title="Hapus entri">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {blok.fields.map((bf) => (
                    <FieldDinamis key={bf.id} field={bf} value={row[bf.id] ?? ''} onChange={(v) => {
                      if (bf.system_tag === '[SYS_PERSONNEL_ID]') {
                        const partner = blok.fields.find((x) => x.system_tag === '[SYS_PERSONNEL_NAME]');
                        if (partner) { handleBlokNipNik(idx, bf.id, v, partner.id); return; }
                      }
                      setBlokRow(idx, bf.id, v);
                    }} disabled={!isDraft} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {isDraft && <p className="mt-2 text-2xs text-mist-dim">Minimal satu entri. Field wajib harus diisi sebelum diajukan.</p>}
        </div>
      )}
    </div>
  );
}

// Helper: buat row kosong untuk blok berulang
function createBlokRow(blokId: string, fields: FieldFormDinamis[]): Record<string, string> {
  const row: Record<string, string> = {};
  for (const f of fields) row[f.id] = '';
  return row;
}

// Render field tunggal Form Dinamis
function FieldDinamis({ field, value, onChange, disabled }: {
  field: FieldFormDinamis; value: string; onChange: (v: string) => void; disabled: boolean;
}) {
  return (
    <Field label={field.label} required={field.wajib}>
      {field.tipe === 'area' ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
          className="w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-sm text-mist focus-visible:outline-amber focus-visible:outline-2" rows={3} />
      ) : field.tipe === 'tanggal' ? (
        <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      ) : field.tipe === 'angka' ? (
        <Input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      )}
    </Field>
  );
}

// BNT-04: Catat pasangan NIP/NIK + nama dari jawaban ke Direktori Transaksional
function _catatDirektoriFromJawaban(form: FormDinamis, jawaban: Record<string, string | string[] | Record<string, string>[]>, spjId: string) {
  // Field utama
  const idField = form.fields.find((f) => f.system_tag === '[SYS_PERSONNEL_ID]');
  const nameField = form.fields.find((f) => f.system_tag === '[SYS_PERSONNEL_NAME]');
  if (idField && nameField) {
    const nip = (jawaban[idField.id] as string ?? '').trim();
    const nama = (jawaban[nameField.id] as string ?? '').trim();
    if (nip && nama) repo.catatDirektori(nip, nama, spjId);
  }
  // Blok berulang
  if (form.blok_berulang) {
    const blokIdField = form.blok_berulang.fields.find((f) => f.system_tag === '[SYS_PERSONNEL_ID]');
    const blokNameField = form.blok_berulang.fields.find((f) => f.system_tag === '[SYS_PERSONNEL_NAME]');
    if (blokIdField && blokNameField) {
      const rows = jawaban[form.blok_berulang.id];
      if (Array.isArray(rows)) {
        for (const row of rows as Record<string, string>[]) {
          const nip = (row[blokIdField.id] ?? '').trim();
          const nama = (row[blokNameField.id] ?? '').trim();
          if (nip && nama) repo.catatDirektori(nip, nama, spjId);
        }
      }
    }
  }
}
