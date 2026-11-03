import { useState } from 'react';
import { Button, Card, EmptyState, StatusBadge } from '@/components/ui';
import { aktorSesi, ErrorLine, SectionTitle, StatusSeksiBadge } from '@/components/AnggaranShared';
import { getSession } from '@/lib/auth';
import { repo } from '@/data/repo';
import * as drill from '@/data/drilldown';
import type { AngkaTingkat, BarisRekening, BarisSeksi, BarisSubkegiatan } from '@/data/drilldown';
import { formatRupiah } from '@/lib/format';
import { ChevronRight, Layers } from 'lucide-react';

const BOLEH_REKENING = ['bendahara', 'verifikator', 'pptk'];
const BOLEH_PAGU_INDUK = ['bendahara', 'verifikator', 'pa_kpa'];

function persen(n: number) {
  return `${n.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`;
}

export function DrilldownPage() {
  const sesi = getSession();
  const aktor = aktorSesi();
  const [seksi, setSeksi] = useState<BarisSeksi | null>(null);
  const [sub, setSub] = useState<BarisSubkegiatan | null>(null);
  if (!sesi || !aktor || !sesi.active_ta_id) return null;
  const ta_id = sesi.active_ta_id;
  const ta = repo.tahunAnggaranById(ta_id);
  if (!ta) return null;

  const seksiRes = drill.drillSeksi(ta_id, aktor);
  if (!seksiRes.ok) return <ErrorLine msg={seksiRes.error} />;
  const totalSeksi = seksiRes.data.reduce((t, s) => t + s.pagu, 0);

  const subRes = seksi ? drill.drillSubkegiatan(ta_id, seksi.seksi_ta_id, aktor) : null;
  const rekRes = sub ? drill.drillRekening(ta_id, sub.pemetaan_id, aktor) : null;
  const errMsg = subRes && !subRes.ok ? subRes.error : rekRes && !rekRes.ok ? rekRes.error : null;

  return (
    <div>
      {BOLEH_PAGU_INDUK.includes(aktor.peran) && (
        <Card className="mb-4 p-5">
          <div className="flex flex-wrap items-center gap-6 text-sm text-mist">
            <span>Pagu Induk TA {ta.tahun} <span className="mono tnum">{formatRupiah(ta.pagu_induk)}</span></span>
            <span>Total seluruh seksi <span className="mono tnum">{formatRupiah(totalSeksi)}</span></span>
          </div>
        </Card>
      )}
      <Card className="p-5">
        <SectionTitle title="Rincian Anggaran" desc="Seksi, subkegiatan, dan rekening belanja. Nilai setiap tingkat merupakan jumlah tingkat di bawahnya." />
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm">
          <Button variant="ghost" onClick={() => { setSeksi(null); setSub(null); }}>Seluruh Seksi</Button>
          {seksi && (
            <>
              <ChevronRight size={14} className="text-mist-dim" />
              <Button variant="ghost" onClick={() => setSub(null)}>{seksi.nama}</Button>
            </>
          )}
          {sub && (
            <>
              <ChevronRight size={14} className="text-mist-dim" />
              <span className="px-2 text-mist">{sub.kode} {sub.nama}</span>
            </>
          )}
        </nav>
        <ErrorLine msg={errMsg} />
        {!seksi && <TabelSeksi rows={seksiRes.data} onBuka={setSeksi} />}
        {seksi && !sub && subRes?.ok && (
          <TabelSub rows={subRes.data} bisaBuka={BOLEH_REKENING.includes(aktor.peran)} onBuka={setSub} />
        )}
        {sub && rekRes?.ok && <TabelRekening rows={rekRes.data} />}
        {seksi && !sub && subRes?.ok && subRes.data.length === 0 && (
          <EmptyState icon={<Layers size={28} />} title="Belum ada subkegiatan" />
        )}
      </Card>
    </div>
  );
}

function Angka({ a }: { a: AngkaTingkat }) {
  return (
    <>
      <td className="mono tnum text-right text-mist">{formatRupiah(a.pagu)}</td>
      <td className="mono tnum text-right text-mist">{formatRupiah(a.realisasi)}</td>
      <td className="mono tnum text-right text-mist">{formatRupiah(a.komitmen)}</td>
      <td className="mono tnum text-right text-mist">{formatRupiah(a.sisaSpdBebas)}</td>
      <td className="mono tnum text-right text-mist">{persen(a.serapanPersen)}</td>
    </>
  );
}

function StatusSeimbang({ seimbang }: { seimbang: boolean }) {
  return <StatusBadge kind={seimbang ? 'ok' : 'warn'} label={seimbang ? 'Seimbang' : 'Belum Seimbang'} />;
}

const HEAD = ['Pagu', 'Realisasi BKU', 'Komitmen', 'Sisa SPD Bebas', 'Serapan', 'Status'];

function TabelSeksi({ rows, onBuka }: { rows: BarisSeksi[]; onBuka: (s: BarisSeksi) => void }) {
  if (rows.length === 0) return <EmptyState icon={<Layers size={28} />} title="Tidak ada seksi" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-edge text-left text-2xs text-mist-dim">
            <th className="py-2">Seksi</th>
            {HEAD.map((h) => <th key={h} className="py-2 text-right">{h}</th>)}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.seksi_ta_id} className="border-b border-ink-edge/60">
              <td className="py-2 text-mist">{r.nama}</td>
              <Angka a={r} />
              <td className="text-center"><StatusSeksiBadge status={r.status} /></td>
              <td className="pl-2 text-right"><Button variant="ghost" onClick={() => onBuka(r)}>Buka</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabelSub({ rows, bisaBuka, onBuka }: { rows: BarisSubkegiatan[]; bisaBuka: boolean; onBuka: (s: BarisSubkegiatan) => void }) {
  if (rows.length === 0) return <EmptyState icon={<Layers size={28} />} title="Belum ada subkegiatan" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-edge text-left text-2xs text-mist-dim">
            <th className="py-2">Subkegiatan</th>
            {HEAD.map((h) => <th key={h} className="py-2 text-right">{h}</th>)}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.pemetaan_id} className="border-b border-ink-edge/60">
              <td className="py-2 text-mist"><span className="mono">{r.kode}</span> {r.nama}</td>
              <Angka a={r} />
              <td className="text-center"><StatusSeimbang seimbang={r.seimbang} /></td>
              <td className="pl-2 text-right">
                {bisaBuka && <Button variant="ghost" onClick={() => onBuka(r)}>Buka</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabelRekening({ rows }: { rows: BarisRekening[] }) {
  if (rows.length === 0) return <EmptyState icon={<Layers size={28} />} title="Belum ada rekening belanja" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-edge text-left text-2xs text-mist-dim">
            <th className="py-2">Rekening Belanja</th>
            {HEAD.map((h) => <th key={h} className="py-2 text-right">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.alokasi_id} className="border-b border-ink-edge/60">
              <td className="py-2 text-mist"><span className="mono">{r.kode}</span> {r.nama}</td>
              <Angka a={r} />
              <td className="text-center"><StatusSeimbang seimbang={r.seimbang} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
