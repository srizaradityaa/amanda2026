// TPL-02 — Form Builder Form Dinamis (Admin). Satu form per jenis belanja; setiap simpan membentuk versi baru.
import { useState } from 'react';
import { Card, Button, Field, Input, Select, Modal, EmptyState, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import type { FieldFormDinamis, BlokBerulangFormDinamis } from '@/data/types';
import { TAG_SISTEM, TIPE_FIELD_LABEL } from '@/lib/formDinamis';
import { FormPreviewTab } from '@/components/FormPreviewTab';
import { Plus, Trash2, ArrowUp, ArrowDown, Layers, FileText } from 'lucide-react';

type Draft = { jenis: string; fields: FieldFormDinamis[]; blok: BlokBerulangFormDinamis | null };

const DRAFT_KOSONG: Draft = { jenis: '', fields: [], blok: null };

function draftDari(jenis: string): Draft {
  const f = repo.formTerbaru(jenis);
  if (!f) return { ...DRAFT_KOSONG, jenis };
  return { jenis, fields: f.fields.map((x) => ({ ...x })), blok: f.blok_berulang ? { ...f.blok_berulang, fields: f.blok_berulang.fields.map((x) => ({ ...x })) } : null };
}

export function FormBuilderPage() {
  const [, setTick] = useState(0);
  const [aktif, setAktif] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(DRAFT_KOSONG);
  const [jenisBaru, setJenisBaru] = useState('');
  const [err, setErr] = useState('');
  const [modal, setModal] = useState<'utama' | 'blok' | null>(null);
  const [tab, setTab] = useState<'konfigurasi' | 'pratinjau'>('konfigurasi');
  const toast = useToast();

  const daftarJenis = Array.from(new Set(repo.formDinamisAll().map((f) => f.jenis_belanja)));
  const bukaJenis = (jenis: string) => { setAktif(jenis); setDraft(draftDari(jenis)); setErr(''); };
  const mulaiBaru = () => {
    const nama = jenisBaru.trim();
    if (!nama) return;
    setAktif(nama); setDraft({ ...DRAFT_KOSONG, jenis: nama }); setJenisBaru(''); setErr('');
  };

  const pindah = (i: number, arah: -1 | 1) => {
    const j = i + arah;
    if (j < 0 || j >= draft.fields.length) return;
    const f = [...draft.fields];
    [f[i], f[j]] = [f[j], f[i]];
    setDraft({ ...draft, fields: f });
  };

  const simpan = () => {
    const r = repo.simpanVersiForm(draft.jenis, draft.fields.map((f, i) => ({ ...f, urutan: i + 1 })), draft.blok ? { ...draft.blok, fields: draft.blok.fields.map((f, i) => ({ ...f, urutan: i + 1 })) } : null);
    if (!r.ok) { setErr(r.error ?? 'Gagal menyimpan.'); return; }
    toast.notify('Tersimpan');
    setErr('');
    setAktif(draft.jenis);
    setDraft(draftDari(draft.jenis));
    setTick((t) => t + 1);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-mist">Jenis Belanja</h3>
        <div className="space-y-1">
          {daftarJenis.map((j) => (
            <button key={j} onClick={() => bukaJenis(j)} className={`w-full rounded-md px-3 py-2 text-left text-2xs ${aktif === j ? 'bg-ink-edge text-mist' : 'text-mist-dim hover:text-mist'}`}>
              {j} <span className="mono text-mist-dim">{repo.formTerbaru(j)?.versi}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input placeholder="Jenis belanja baru" value={jenisBaru} onChange={(e) => setJenisBaru(e.target.value)} />
          <Button variant="ghost" onClick={mulaiBaru}><Plus size={14} /></Button>
        </div>
      </Card>

      {!aktif ? (
        <EmptyState icon={<FileText size={20} />} title="Pilih jenis belanja" desc="Pilih jenis belanja untuk mengubah form, atau buat jenis baru." />
      ) : (
        <div className="space-y-4">
          <div className="flex w-fit gap-1 rounded-md bg-ink-raised p-1">
            {(['konfigurasi', 'pratinjau'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded px-3 py-1.5 text-2xs transition-colors ${tab === t ? 'bg-ink-edge text-mist' : 'text-mist-dim hover:text-mist'}`}>
                {t === 'konfigurasi' ? 'Konfigurasi' : 'Pratinjau Langsung'}
              </button>
            ))}
          </div>
          {tab === 'pratinjau' ? <FormPreviewTab fields={draft.fields} blok={draft.blok} /> : <>
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-mist">{draft.jenis} {repo.formTerbaru(draft.jenis) && <span className="mono text-2xs text-mist-dim">versi {repo.formTerbaru(draft.jenis)?.versi}</span>}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setModal('utama')}><Plus size={14} /> Field</Button>
                {!draft.blok && <Button variant="ghost" onClick={() => setDraft({ ...draft, blok: { id: `blk-${Date.now()}`, nama: 'Pelaku', fields: [] } })}><Layers size={14} /> Blok Berulang</Button>}
              </div>
            </div>
            <FieldTable fields={draft.fields} onHapus={(i) => setDraft({ ...draft, fields: draft.fields.filter((_, x) => x !== i) })} onPindah={pindah} />
            {draft.fields.length === 0 && <p className="text-2xs text-mist-dim">Belum ada field.</p>}
          </Card>

          {draft.blok && (
            <Card className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Field label="Nama blok"><Input value={draft.blok.nama} onChange={(e) => setDraft({ ...draft, blok: { ...draft.blok!, nama: e.target.value } })} /></Field>
                <Button variant="ghost" onClick={() => setDraft({ ...draft, blok: null })}><Trash2 size={14} /> Hapus blok</Button>
              </div>
              <FieldTable fields={draft.blok.fields} onHapus={(i) => setDraft({ ...draft, blok: { ...draft.blok!, fields: draft.blok!.fields.filter((_, x) => x !== i) } })} onPindah={(i, arah) => {
                const j = i + arah; const f = [...draft.blok!.fields];
                if (j < 0 || j >= f.length) return;
                [f[i], f[j]] = [f[j], f[i]];
                setDraft({ ...draft, blok: { ...draft.blok!, fields: f } });
              }} />
              <Button variant="ghost" className="mt-3" onClick={() => setModal('blok')}><Plus size={14} /> Field dalam blok</Button>
            </Card>
          )}

          {err && <p className="text-2xs text-crit">{err}</p>}
          <div className="flex justify-end"><Button onClick={simpan}>Simpan Versi Baru</Button></div>
          </>}
        </div>
      )}

      {modal && (
        <FieldModal
          onClose={() => setModal(null)}
          onTambah={(f) => {
            if (modal === 'utama') setDraft({ ...draft, fields: [...draft.fields, f] });
            else if (draft.blok) setDraft({ ...draft, blok: { ...draft.blok, fields: [...draft.blok.fields, f] } });
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function FieldTable({ fields, onHapus, onPindah }: {
  fields: FieldFormDinamis[];
  onHapus: (i: number) => void;
  onPindah: (i: number, arah: -1 | 1) => void;
}) {
  if (fields.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-2xs">
        <tbody>
          {fields.map((f, i) => (
            <tr key={f.id} className="border-t border-ink-edge">
              <td className="px-2 py-2 text-mist">{f.label}</td>
              <td className="px-2 py-2 text-mist-dim">{TIPE_FIELD_LABEL[f.tipe]}</td>
              <td className="px-2 py-2 text-mist-dim">{f.wajib ? 'Wajib' : 'Opsional'}</td>
              <td className="px-2 py-2 mono text-mist-dim">{f.system_tag ?? ''}</td>
              <td className="px-2 py-2">
                <div className="flex gap-1">
                  <button onClick={() => onPindah(i, -1)} className="rounded p-1 text-mist-dim hover:text-mist" aria-label="Naik"><ArrowUp size={14} /></button>
                  <button onClick={() => onPindah(i, 1)} className="rounded p-1 text-mist-dim hover:text-mist" aria-label="Turun"><ArrowDown size={14} /></button>
                  <button onClick={() => onHapus(i)} className="rounded p-1 text-mist-dim hover:text-crit" aria-label="Hapus"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FieldModal({ onClose, onTambah }: { onClose: () => void; onTambah: (f: FieldFormDinamis) => void }) {
  const [label, setLabel] = useState('');
  const [tipe, setTipe] = useState<FieldFormDinamis['tipe']>('teks');
  const [wajib, setWajib] = useState(false);
  const [tag, setTag] = useState<string>('');
  const [err, setErr] = useState('');
  const simpan = () => {
    if (!label.trim()) return setErr('Label field wajib diisi.');
    onTambah({ id: `f-${Date.now()}`, label: label.trim(), tipe, urutan: 0, wajib, system_tag: (tag || null) as FieldFormDinamis['system_tag'] });
  };
  return (
    <Modal open onClose={onClose} title="Tambah Field" footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={simpan}>Tambah</Button></div>}>
      <div className="space-y-4">
        <Field label="Label" required><Input value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
        <Field label="Tipe"><Select value={tipe} onChange={(e) => setTipe(e.target.value as FieldFormDinamis['tipe'])}>
          {(Object.keys(TIPE_FIELD_LABEL) as FieldFormDinamis['tipe'][]).map((t) => <option key={t} value={t}>{TIPE_FIELD_LABEL[t]}</option>)}
        </Select></Field>
        <label className="flex items-center gap-2 text-2xs text-mist"><input type="checkbox" checked={wajib} onChange={(e) => setWajib(e.target.checked)} /> Wajib diisi</label>
        <Field label="Tag sistem (opsional)"><Select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Tidak ada</option>
          {TAG_SISTEM.map((t) => t && <option key={t} value={t}>{t}</option>)}
        </Select></Field>
      </div>
    </Modal>
  );
}
