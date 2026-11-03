// TPL-01 — Visual Live Editor template kuitansi (Admin). Mengatur teks template, bukan data transaksi.
import { useState } from 'react';
import { Card, Button, Field, Input, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import type { TemplateKuitansi } from '@/data/types';
import { formatRupiah } from '@/lib/format';

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

export function TemplateKuitansiPage() {
  const [t, setT] = useState<TemplateKuitansi>(() => ({ ...repo.templateKuitansi() }));
  const [err, setErr] = useState('');
  const toast = useToast();

  const simpan = () => {
    const r = repo.simpanTemplateKuitansi(t);
    if (!r.ok) { setErr(r.error ?? 'Gagal menyimpan.'); return; }
    setErr('');
    toast.notify('Tersimpan');
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-mist">Konfigurasi Template</h3>
        <Field label="Nama instansi" required><Input value={t.nama_instansi} onChange={(e) => setT({ ...t, nama_instansi: e.target.value })} /></Field>
        <Field label="Judul dokumen" required><Input value={t.judul_dokumen} onChange={(e) => setT({ ...t, judul_dokumen: e.target.value })} /></Field>
        <Field label="Tempat (blok penerima)"><Input value={t.tempat_penerima} onChange={(e) => setT({ ...t, tempat_penerima: e.target.value })} /></Field>
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
        </div>
      </Card>
    </div>
  );
}
