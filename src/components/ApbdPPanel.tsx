import { Panel, SectionTitle } from '@/components/AnggaranShared';
import * as anggaran from '@/data/anggaran';
import { repo } from '@/data/repo';
import { formatRupiah } from '@/lib/format';

export function ApbdPPanel({ ta_id }: { ta_id: string }) {
  const ta = repo.tahunAnggaranById(ta_id);
  if (!ta || !ta.mode_apbd_p) return null;
  const murni = anggaran.paguMurniByRekening(ta_id);
  const rows = anggaran.alokasiRekeningByTA(ta_id);
  const sudah = anggaran.sudahDisahkan(ta_id);

  return (
    <Panel>
      <SectionTitle
        title="Penyesuaian APBD-P"
        desc="Pagu rekening disesuaikan ke pagu perubahan. Pagu baru tidak boleh di bawah realisasi BKU dan komitmen kuitansi aktif. Setelah semua seksi Seimbang, tekan Sahkan ulang."
      />
      <p className="mb-3 text-sm text-mist">
        Pagu Induk murni <span className="mono tnum">{formatRupiah(ta.pagu_induk)}</span>
        {' → '}Pagu Induk perubahan <span className="mono tnum text-amber">{formatRupiah(ta.pagu_induk_perubahan ?? 0)}</span>
        {' · '}
        <span className={sudah ? 'text-ok' : 'text-warn'}>{sudah ? 'Sudah disahkan ulang' : 'Menunggu Sahkan ulang'}</span>
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-edge text-left text-2xs uppercase tracking-wide text-mist-dim">
              <th className="py-2 pr-3 font-medium">Rekening</th>
              <th className="py-2 pr-3 text-right font-medium">Pagu murni</th>
              <th className="py-2 pr-3 text-right font-medium">Pagu saat ini</th>
              <th className="py-2 pr-3 text-right font-medium">Realisasi + komitmen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-ink-edge/60">
                <td className="py-2 pr-3 text-mist">{r.kode_rekening_snapshot} {r.nama_rekening_snapshot}</td>
                <td className="mono tnum py-2 pr-3 text-right text-mist-dim">
                  {murni.has(`${r.pemetaan_subkegiatan_id}|${r.rekening_id}`)
                    ? formatRupiah(murni.get(`${r.pemetaan_subkegiatan_id}|${r.rekening_id}`) ?? 0)
                    : 'Belum tercatat'}
                </td>
                <td className="mono tnum py-2 pr-3 text-right text-mist">{formatRupiah(r.pagu)}</td>
                <td className="mono tnum py-2 pr-3 text-right text-mist-dim">{formatRupiah(anggaran.terpakaiAlokasi(r))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
