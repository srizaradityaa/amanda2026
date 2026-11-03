// TPL-01 — Visual Live Editor template kuitansi (Admin). Mengatur teks template, bukan data transaksi.
// D02 §2.3: opsi unggah .doc/.docx sebagai alternatif. Editor mengatur template, bukan data transaksi.
import { useState, useRef } from 'react';
import { Card, Button, Field, Input, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import type { TemplateKuitansi } from '@/data/types';
import { formatRupiah } from '@/lib/format';
import { Upload, FileText, X } from 'lucide-react';

const CONTOH = {
  ta: '2026',
  bruto: 1500000,
  terbilang: 'Satu juta lima ratus ribu rupiah',
  uraian: 'Pembelian bahan habis pakai triwulan I',
  subkeg: 'Penyediaan Layanan Administrasi Perkantoran',
  kodeSubkeg: '5.1.02.02.6.2.01.01',
  kodeRek: '5.2.2.01',
  tanggal: '3 November 2026',
};

const EKSTENSI_DITERIMA = ['.doc', '.docx'];
const MIME_DITERIMA = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function ekstensiValid(nama: string): boolean {
  return EKSTENSI_DITERIMA.some((e) => nama.toLowerCase().endsWith(e));
}

export function TemplateKuitansiPage() {
  const [t, setT] = useState<TemplateKuitansi>(() => ({ ...repo.templateKuitansi() }));
  const [err, setErr] = useState('');
  const [errUpload, setErrUpload] = useState('');
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const simpan = () => {
    const r = repo.simpanTemplateKuitansi(t);
    if (!r.ok) { setErr(r.error ?? 'Gagal menyimpan.'); return; }
    setErr('');
    toast.notify('Tersimpan');
  };

  const onPilihBerkas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const berkas = e.target.files?.[0];
    if (!berkas) return;
    setErrUpload('');
    if (!ekstensiValid(berkas.name)) {
      setErrUpload(`Format tidak didukung. Hanya file ${EKSTENSI_DITERIMA.join(' atau ')}.`);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (MIME_DITERIMA.length > 0 && berkas.type && !MIME_DITERIMA.includes(berkas.type)) {
      setErrUpload(`Tipe MIME tidak didukung. Hanya file ${EKSTENSI_DITERIMA.join(' atau ')}.`);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setT({ ...t, berkas_doc: berkas.name });
  };

  const hapusBerkas = () => {
    setT({ ...t, berkas_doc: null });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-mist">Konfigurasi Editor</h3>
        <Field label="Nama instansi" required><Input value={t.nama_instansi} onChange={(e) => setT({ ...t, nama_instansi: e.target.value })} /></Field>
        <Field label="Judul dokumen" required><Input value={t.judul_dokumen} onChange={(e) => setT({ ...t, judul_dokumen: e.target.value })} /></Field>
        <Field label="Tempat (blok penerima)"><Input value={t.tempat_penerima} onChange={(e) => setT({ ...t, tempat_penerima: e.target.value })} /></Field>

        <div className="space-y-2 border-t border-ink-edge pt-3">
          <p className="text-2xs text-mist-dim">Alternatif: unggah template .doc/.docx (D02 §2.3)</p>
          {t.berkas_doc ? (
            <div className="flex items-center gap-2 rounded-md border border-ink-edge px-3 py-2">
              <FileText size={14} className="text-mist-dim" />
              <span className="flex-1 truncate text-2xs text-mist">{t.berkas_doc}</span>
              <button onClick={hapusBerkas} className="rounded p-1 text-mist-dim hover:text-crit" aria-label="Hapus berkas"><X size={14} /></button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-ink-edge px-3 py-2 text-2xs text-mist-dim hover:border-mist-dim hover:text-mist">
              <Upload size={14} />
              <span>Pilih file .doc / .docx</span>
              <input ref={fileRef} type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onPilihBerkas} className="hidden" />
            </label>
          )}
          {errUpload && <p className="text-2xs text-crit">{errUpload}</p>}
        </div>

        {err && <p className="text-2xs text-crit">{err}</p>}
        <Button onClick={simpan}>Simpan Template</Button>
      </Card>

      <Card className="overflow-x-auto p-4">
        <p className="mb-3 text-2xs text-mist-dim">Pratinjau cetak (contoh data, setengah kertas F4)</p>
        <div className="mx-auto w-full max-w-[520px] space-y-4 bg-white p-6 text-[11px] leading-[1.5] text-black">
          <div className="flex items-start justify-between gap-4">
            <div className="border border-black px-2 py-1 text-[10px]">TA {CONTOH.ta}</div>
            <div className="flex-1 text-center font-semibold">{t.nama_instansi}</div>
            <table className="border border-black text-[10px]"><tbody><tr>
              <td className="border border-black px-2 py-0.5">{CONTOH.kodeSubkeg}</td>
              <td className="border border-black px-2 py-0.5">{CONTOH.kodeRek}</td>
            </tr></tbody></table>
          </div>
          <div className="text-center text-sm font-bold tracking-widest">{t.judul_dokumen}</div>
          <div className="space-y-1">
            <p>Bruto : <span className="font-semibold">{formatRupiah(CONTOH.bruto)}</span></p>
            <p>Terbilang : {CONTOH.terbilang}</p>
            <p>UNTUK PEMBAYARAN {CONTOH.uraian}</p>
            <p>Sub Keg. : {CONTOH.subkeg}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 pt-2 text-center text-[10px]">
            <div><p>PA/KPA</p><div className="h-12" /><p className="font-semibold">Nama PA/KPA</p></div>
            <div><p>Bendahara Pengeluaran</p><div className="h-12" /><p className="font-semibold">Nama Bendahara</p></div>
            <div><p>PPTK</p><div className="h-12" /><p className="font-semibold">Nama PPTK</p></div>
            <div><p>Penerima</p><div className="h-12" /><p className="font-semibold">Nama Penerima</p>
              <p>{t.tempat_penerima}, {CONTOH.tanggal}</p></div>
          </div>
          {t.berkas_doc && (
            <p className="border-t border-black pt-2 text-[9px] text-gray-600">Template unggahan: {t.berkas_doc}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
