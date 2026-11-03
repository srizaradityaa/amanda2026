// TPL-03 — Pratinjau Langsung Form Dinamis (Admin). Hanya memori browser; tidak menyimpan apa pun.
// D01 §9 poin 11; D03 §2.4. Cek bentrok memakai data contoh terisolasi (I-64e).
import { useState } from 'react';
import { Card, Button, Field, Input } from '@/components/ui';
import { repo } from '@/data/repo';
import type { FieldFormDinamis, BlokBerulangFormDinamis } from '@/data/types';
import { Plus, Trash2, TriangleAlert } from 'lucide-react';

type Nilai = Record<string, string>;

// I-64e: mock data terisolasi untuk simulasi bentrok. Tidak membaca SPJ asli.
interface MockSPJ {
  nip_nik: string;
  mulai: string;
  selesai: string;
}
const MOCK_SPJ_BENTROK: MockSPJ[] = [
  { nip_nik: '198807202012011004', mulai: '2026-11-10', selesai: '2026-11-12' },
  { nip_nik: '3210014503900001', mulai: '2026-11-15', selesai: '2026-11-15' },
];

function rentangOverlap(aMulai: string, aSelesai: string, bMulai: string, bSelesai: string): boolean {
  const aSelesaiEfektif = aSelesai || aMulai;
  const bSelesaiEfektif = bSelesai || bMulai;
  if (aSelesaiEfektif < aMulai) return false;
  if (bSelesaiEfektif < bMulai) return false;
  return aMulai <= bSelesaiEfektif && aSelesaiEfektif >= bMulai;
}

interface HasilSimulasi {
  ok: boolean;
  kosong: string[];
  bentrok: { nip_nik: string; mulai: string; selesai: string; referensi: string }[];
}

export function FormPreviewTab({ fields, blok }: { fields: FieldFormDinamis[]; blok: BlokBerulangFormDinamis | null }) {
  const [utama, setUtama] = useState<Nilai>({});
  const [entri, setEntri] = useState<Nilai[]>(() => (blok ? [{}] : []));
  const [hasil, setHasil] = useState<HasilSimulasi | null>(null);

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

  const hapusEntri = (i: number) => {
    setEntri(entri.filter((_, j) => j !== i));
  };

  const simulasiAjukan = () => {
    const kosong: string[] = [];
    for (const f of fields) {
      if (f.wajib && !(utama[f.id] ?? '').trim()) kosong.push(f.label);
    }
    if (blok) {
      for (let i = 0; i < entri.length; i++) {
        for (const f of blok.fields) {
          if (f.wajib && !(entri[i][f.id] ?? '').trim()) kosong.push(`${f.label} (entri ${i + 1})`);
        }
      }
    }

    // I-64e: cek bentrok jadwal dengan mock data terisolasi
    const bentrok: HasilSimulasi['bentrok'] = [];
    const cekIdentitas = (nip: string, mulai: string, selesai: string, sumber: string) => {
      if (!nip.trim() || !mulai) return;
      for (const mock of MOCK_SPJ_BENTROK) {
        if (mock.nip_nik === nip.trim() && rentangOverlap(mulai, selesai, mock.mulai, mock.selesai)) {
          bentrok.push({ nip_nik: nip, mulai, selesai, referensi: `Mock SPJ (${sumber})` });
        }
      }
    };

    // Cek juga bentrok antar-entri dalam pratinjau ini sendiri (identitas sama, rentang overlap)
    const semuaIdentitas: { nip: string; mulai: string; selesai: string; sumber: string }[] = [];
    if (blok) {
      for (let i = 0; i < entri.length; i++) {
        const nipField = blok.fields.find((f) => f.system_tag === '[SYS_PERSONNEL_ID]');
        const mulaiField = blok.fields.find((f) => f.system_tag === '[SYS_START_DATE]');
        const selesaiField = blok.fields.find((f) => f.system_tag === '[SYS_END_DATE]');
        const mulaiUtama = fields.find((f) => f.system_tag === '[SYS_START_DATE]');
        const selesaiUtama = fields.find((f) => f.system_tag === '[SYS_END_DATE]');
        if (nipField) {
          const nip = entri[i][nipField.id] ?? '';
          const mulai = (mulaiField ? entri[i][mulaiField.id] ?? '' : '') || (mulaiUtama ? utama[mulaiUtama.id] ?? '' : '');
          const selesai = (selesaiField ? entri[i][selesaiField.id] ?? '' : '') || (selesaiUtama ? utama[selesaiUtama.id] ?? '' : '');
          if (nip.trim() && mulai) {
            cekIdentitas(nip, mulai, selesai, `entri ${i + 1}`);
            semuaIdentitas.push({ nip, mulai, selesai, sumber: `entri ${i + 1}` });
          }
        }
      }
    }
    // Cek field utama (jika ada tag ID di field utama)
    const nipUtama = fields.find((f) => f.system_tag === '[SYS_PERSONNEL_ID]');
    if (nipUtama) {
      const mulaiUtama = fields.find((f) => f.system_tag === '[SYS_START_DATE]');
      const selesaiUtama = fields.find((f) => f.system_tag === '[SYS_END_DATE]');
      const nip = utama[nipUtama.id] ?? '';
      const mulai = mulaiUtama ? utama[mulaiUtama.id] ?? '' : '';
      const selesai = selesaiUtama ? utama[selesaiUtama.id] ?? '' : '';
      if (nip.trim() && mulai) {
        cekIdentitas(nip, mulai, selesai, 'field utama');
        semuaIdentitas.push({ nip, mulai, selesai, sumber: 'field utama' });
      }
    }
    // Bentrok antar-entri sendiri (identitas sama, rentang overlap)
    for (let i = 0; i < semuaIdentitas.length; i++) {
      for (let j = i + 1; j < semuaIdentitas.length; j++) {
        const a = semuaIdentitas[i];
        const b = semuaIdentitas[j];
        if (a.nip.trim() === b.nip.trim() && rentangOverlap(a.mulai, a.selesai, b.mulai, b.selesai)) {
          bentrok.push({ nip_nik: a.nip, mulai: a.mulai, selesai: a.selesai, referensi: `Bentrok antar entri: ${a.sumber} vs ${b.sumber}` });
        }
      }
    }

    setHasil({ ok: kosong.length === 0 && bentrok.length === 0, kosong, bentrok });
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
              <div className="flex items-center justify-between">
                <p className="text-2xs text-mist-dim">Entri {i + 1}</p>
                {entri.length > 1 && (
                  <button onClick={() => hapusEntri(i)} className="flex items-center gap-1 rounded p-1 text-mist-dim hover:text-crit" aria-label="Hapus entri">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
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
          <div className="space-y-1">
            {hasil.kosong.length > 0 && (
              <span className="flex items-center gap-1.5 text-2xs text-warn">
                <TriangleAlert size={14} /> Wajib diisi: {hasil.kosong.join(', ')}
              </span>
            )}
            {hasil.bentrok.length > 0 && (
              <div className="space-y-1">
                {hasil.bentrok.map((b, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-2xs text-crit">
                    <TriangleAlert size={14} /> Bentrok jadwal: NIP/NIK {b.nip_nik} pada {b.mulai}–{b.selesai} ({b.referensi})
                  </span>
                ))}
              </div>
            )}
          </div>
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
