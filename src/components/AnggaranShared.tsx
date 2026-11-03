import { useEffect, useState, type ReactNode } from 'react';
import { TriangleAlert as AlertTriangle } from 'lucide-react';
import { getSession } from '@/lib/auth';
import * as anggaran from '@/data/anggaran';
import type { AktorAnggaran } from '@/data/anggaran';
import { Card, StatusBadge } from '@/components/ui';
import { repo } from '@/data/repo';

export function aktorSesi(): AktorAnggaran | null {
  const s = getSession();
  if (!s) return null;
  return { id: s.user_id, nama: s.nama_snapshot, peran: s.active_role, seksi_ta_id: s.active_seksi_id };
}

export function useTick(ms = 30000) {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}

export function sisaWaktu(tutup: string): string {
  const menit = Math.floor((new Date(tutup.replace(' ', 'T') + ':00+08:00').getTime() - Date.now()) / 60000);
  if (menit <= 0) return 'Sudah berakhir';
  return `${Math.floor(menit / 60)} jam ${menit % 60} menit lagi`;
}

export function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-base font-semibold text-mist">{title}</h3>
      {desc && <p className="mt-1 text-sm text-mist-dim">{desc}</p>}
    </div>
  );
}

export function ErrorLine({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <p className="mt-3 flex items-start gap-2 rounded-md border border-crit/40 bg-crit/10 px-3 py-2 text-sm text-mist">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-crit" />
      <span>{msg}</span>
    </p>
  );
}

export function GerbangBanner({ ta_id }: { ta_id: string }) {
  useTick();
  if (repo.tahunAnggaranById(ta_id)?.status !== 'Aktif Penuh') return null;
  const g = anggaran.gerbangStatus(ta_id);
  const tutup = anggaran.jendelaTutup(ta_id);
  if (g.seksiBelum.length === 0 && g.disahkan) return null;
  return (
    <div className="mb-4 rounded-lg border border-crit/50 bg-crit/10 p-4">
      <p className="text-sm font-semibold text-mist">Pembuatan kuitansi dan SPJ baru ditunda</p>
      {g.seksiBelum.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-mist">
          {g.seksiBelum.map((s) => (
            <li key={s.id}>{s.nama}: <span className="text-mist-dim">{s.status}</span></li>
          ))}
        </ul>
      )}
      {!g.disahkan && g.seksiBelum.length === 0 && (
        <p className="mt-2 text-sm text-mist-dim">Seluruh seksi sudah seimbang. Bendahara perlu menekan Sahkan.</p>
      )}
      {tutup && g.seksiBelum.length > 0 && (
        <p className="mt-2 text-sm text-mist-dim">Jendela input berakhir {tutup} WITA ({sisaWaktu(tutup)}).</p>
      )}
    </div>
  );
}

export function StatusSeksiBadge({ status }: { status: anggaran.StatusSeksi }) {
  const kind = status === 'Tuntas (100% Seimbang)' ? 'ok' : status === 'Belum Input' ? 'crit' : 'warn';
  return <StatusBadge kind={kind} label={status} />;
}

export function Panel({ children }: { children: ReactNode }) {
  return <Card className="mb-4 p-5">{children}</Card>;
}
