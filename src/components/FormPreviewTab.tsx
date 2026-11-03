// TPL-03 — Pratinjau Langsung Form Dinamis (Admin). Hanya memori browser; tidak menyimpan apa pun.
import { useState } from 'react';
import { Card, Button, Field, Input } from '@/components/ui';
import { repo } from '@/data/repo';
import type { FieldFormDinamis, BlokBerulangFormDinamis } from '@/data/types';
import { Plus, TriangleAlert } from 'lucide-react';

type Nilai = Record<string, string>;

export function FormPreviewTab({ fields, blok }: { fields: FieldFormDinamis[]; blok: BlokBerulangFormDinamis | null }) {
  const [utama, setUtama] = useState<Nilai>({});
  const [entri, setEntri] = useState<Nilai[]>(() => (blok ? [{}] : []));
  const [hasil, setHasil] = useState<{ ok: boolean; kosong: string[] } | null>(null);

  const set = (ctx: Nilai, daftar: FieldFormDinamis[], id: string, v: string): Nilai => {
    const next = { ...ctx, [id]: v };
    const f = daftar.find((x) => x.id === id);
    if (f?.system_tag === '[SYS_PERSONNEL_ID]') {
      const nama = daftar.find((x) => x.system_tag === '[SYS_PERSONNEL_NAME]');
      const dikenal = repo.direktoriTransaksional().find((d) => d.nip_nik === v.trim());
      if (nama && dikenal) next[nama.id] = dikenal.nama;
    }
    return next;
  };

  const simulasiAjukan = () => {
    const kosong = [
      ...fields.filter((f) => f.wajib && !(utama[f.id] ?? '').trim()).map((f) => f.label),
      ...(blok ? entri.flatMap((e, i) => blok.fields.filter((f) => f.wajib && !(e[f.id] ?? '').trim()).map((f) => `${f.label} (entri ${i + 1})`)) : []),
    ];
    setHasil({ ok: kosong.length === 0, kosong });
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-4">
        {fields.map((f) => (
          <IsianField key={f.id} f={f} value={utama[f.id] ?? ''} onChange={(v) => setUtama(set(utama, fields, f.id, v))} />
        ))}
        {fields.length === 0 && <p className="text-2xs text-mist-dim">Form belum memiliki field.</p>}
      </Card>

      {blok && (
        <Card className="space-y-4 p-4">
          <h4 className="text-sm font-semibold text-mist">{blok.nama}</h4>
          {entri.map((e, i) => (
            <div key={i} className="space-y-3 rounded-md border border-ink-edge p-3">
              <p className="text-2xs text-mist-dim">Entri {i + 1}</p>
              {blok.fields.map((f) => (
                <IsianField key={f.id} f={f} value={e[f.id] ?? ''} onChange={(v) => setEntri(entri.map((x, j) => (j === i ? set(x, blok.fields, f.id, v) : x)))} />
              ))}
            </div>
          ))}
          <Button variant="ghost" onClick={() => setEntri([...entri, {}])}><Plus size={14} /> Tambah</Button>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={simulasiAjukan}>Simulasi Ajukan</Button>
        {hasil && hasil.ok && <span className="text-2xs text-teal">Simulasi: pengajuan diterima.</span>}
        {hasil && !hasil.ok && (
          <span className="flex items-center gap-1.5 text-2xs text-warn">
            <TriangleAlert size={14} /> Simulasi: pengajuan ditolak. Wajib diisi: {hasil.kosong.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

function IsianField({ f, value, onChange }: { f: FieldFormDinamis; value: string; onChange: (v: string) => void }) {
  const label = f.wajib ? `${f.label} *` : f.label;
  if (f.tipe === 'area') {
    return <Field label={label}><textarea className="w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-2xs text-mist" rows={3} value={value} onChange={(e) => onChange(e.target.value)} /></Field>;
  }
  if (f.tipe === 'file') {
    return <Field label={label}><p className="text-2xs text-mist-dim">Unggah berkas belum tersedia pada pratinjau.</p></Field>;
  }
  const type = f.tipe === 'angka' ? 'number' : f.tipe === 'tanggal' ? 'date' : 'text';
  return <Field label={label}><Input type={type} value={value} onChange={(e) => onChange(e.target.value)} /></Field>;
}
