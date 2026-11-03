// UIX-03 — Layout dasbor: sidebar + topbar untuk semua peran kecuali Pengawas/Auditor.
// Pengawas memakai menu atas tanpa sidebar dan tanpa mini progress bar (D03 §1; D01 §3.3).
// Topbar: TA aktif, peran aktif (label), mini progress bar per peran, tombol logout.
// Tanpa dropdown ganti TA/peran (AUT-03 — isolasi konteks sesi).

import { useEffect, useState, type ReactNode } from 'react';
import {
  LayoutDashboard, ShieldCheck, FileText, ScrollText, Landmark, LogOut, Menu, X,
} from 'lucide-react';
import { getSession, logout, subscribeSession } from '@/lib/auth';
import { touchActivity } from '@/lib/auth';
import { repo } from '@/data/repo';
import { formatRupiah, formatPersen, persenNumerik } from '@/lib/format';
import type { SessionPayload, Role } from '@/data/types';
import { peranLabel } from '@/lib/audit';
import * as anggaran from '@/data/anggaran';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  render: () => ReactNode;
}

export function DashboardShell({
  nav,
  activeId,
  onNavigate,
  children,
}: {
  nav: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
}) {
  const [session, setSession] = useState<SessionPayload | null>(getSession());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeSession(() => setSession(getSession()));
    return unsub;
  }, []);

  // AUT-08 — setiap interaksi memperbarui aktivitas
  useEffect(() => {
    const handler = () => touchActivity();
    window.addEventListener('click', handler, true);
    window.addEventListener('keydown', handler, true);
    return () => {
      window.removeEventListener('click', handler, true);
      window.removeEventListener('keydown', handler, true);
    };
  }, []);

  if (!session) return null;

  const isPengawas = session.active_role === 'pengawas';

  if (isPengawas) {
    return <PengawasLayout nav={nav} activeId={activeId} onNavigate={onNavigate} session={session}>{children}</PengawasLayout>;
  }

  return (
    <div className="flex min-h-screen bg-ink text-mist">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r border-ink-edge bg-ink-surface transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-12 items-center gap-2 border-b border-ink-edge px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-edge bg-ink">
            <Landmark size={16} className="text-amber" />
          </div>
          <span className="text-sm font-bold tracking-tight">AMANDA</span>
          <button
            className="ml-auto rounded p-1 text-mist-dim hover:text-mist lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeId === item.id
                  ? 'bg-amber/10 text-amber ring-1 ring-amber/30'
                  : 'text-mist-dim hover:bg-ink-edge/40 hover:text-mist'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar session={session} onMobileOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6" onClick={() => touchActivity()}>
          {children}
        </main>
      </div>
    </div>
  );
}

function Topbar({ session, onMobileOpen }: { session: SessionPayload; onMobileOpen: () => void }) {
  const ta = session.active_ta_id ? repo.tahunAnggaranById(session.active_ta_id) : undefined;
  const role = session.active_role;

  return (
    <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-ink-edge bg-ink-surface/95 px-4 backdrop-blur-sm">
      <button
        className="rounded p-1 text-mist-dim hover:text-mist lg:hidden"
        onClick={onMobileOpen}
        aria-label="Buka menu"
      >
        <Menu size={18} />
      </button>

      {/* Label TA aktif + peran aktif (tanpa dropdown) */}
      <div className="flex items-center gap-2 text-2xs">
        {ta ? (
          <span className="mono rounded-full border border-ink-edge bg-ink px-2.5 py-0.5 font-medium text-mist">
            TA {ta.tahun}
          </span>
        ) : (
          <span className="rounded-full border border-ink-edge bg-ink px-2.5 py-0.5 font-medium text-mist-dim">
            Tanpa TA
          </span>
        )}
        <span className="rounded-full border border-ink-edge bg-ink px-2.5 py-0.5 font-medium text-mist-dim">
          {peranLabel(role)}
        </span>
        {role === 'admin' && (
          <span className="rounded-full border border-ink-edge bg-ink px-2.5 py-0.5 text-2xs text-mist-dim lg:hidden">
            Pagu Induk: {ta ? formatRupiah(ta.pagu_induk) : '—'}
          </span>
        )}
      </div>

      {/* Mini progress bar — slot di tengah (di desktop) */}
      <div className="ml-auto hidden items-center gap-4 lg:flex">
        <MiniProgress role={role} session={session} />
      </div>

      <div className="ml-auto flex items-center gap-2 lg:ml-2">
        <span className="hidden text-2xs text-mist-dim sm:inline">{session.nama_snapshot}</span>
        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink-edge px-2.5 py-1.5 text-2xs font-medium text-mist-dim hover:border-crit/40 hover:text-crit"
          aria-label="Keluar"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}

// Mini progress bar per peran (D01 §3.3)
function MiniProgress({ role, session }: { role: Role | 'pending'; session: SessionPayload }) {
  if (role === 'admin') {
    // Admin hanya Pagu Induk
    const ta = session.active_ta_id ? repo.tahunAnggaranById(session.active_ta_id) : undefined;
    return (
      <div className="flex items-center gap-2 text-2xs text-mist-dim">
        <span>Pagu Induk</span>
        <span className="mono tnum text-mist">{ta ? formatRupiah(ta.pagu_induk) : '—'}</span>
      </div>
    );
  }
  if (role === 'pengawas') return null; // tidak ada mini progress bar

  // Hitung agregat instansi atau seksi (SPD-01: komitmen = kuitansi Aktif atau Terkunci tanpa BKU)
  const ta_id = session.active_ta_id;
  if (!ta_id) return null;
  const ta = repo.tahunAnggaranById(ta_id);
  if (!ta) return null;

  const semuaRek = repo.alokasiRekeningByTA(ta_id);
  const rekAktif = semuaRek.filter((a) => a.disahkan);
  const agregat = (rows: typeof rekAktif, semua: typeof rekAktif) => ({
    pagu: semua.reduce((s, a) => s + a.pagu, 0),
    realisasi: rows.reduce((s, a) => s + anggaran.realisasiAlokasi(a), 0),
    komitmen: rows.reduce((s, a) => s + anggaran.komitmenAlokasi(a), 0),
    sisa: rows.reduce((s, a) => s + anggaran.sisaSpdBebas(a), 0),
  });

  if (role === 'pptk') {
    const seksiId = session.active_seksi_id;
    if (!seksiId) return null;
    const pemetaanIds = repo.pemetaanBySeksi(seksiId).map((p) => p.id);
    const milikSeksi = (a: (typeof semuaRek)[number]) => pemetaanIds.includes(a.pemetaan_subkegiatan_id);
    const m = agregat(rekAktif.filter(milikSeksi), semuaRek.filter(milikSeksi));
    return (
      <div className="flex items-center gap-3 text-2xs">
        <Metric label="Pagu" value={formatRupiah(m.pagu)} />
        <Metric label="Realisasi" value={formatRupiah(m.realisasi)} />
        <Metric label="Sisa SPD Bebas" value={formatRupiah(m.sisa)} />
        <Bar pct={persenNumerik(m.realisasi + m.komitmen, m.pagu)} label={formatPersen(m.realisasi + m.komitmen, m.pagu)} />
      </div>
    );
  }

  const m = agregat(rekAktif, semuaRek);
  return (
    <div className="flex items-center gap-3 text-2xs">
      <Metric label="Pagu" value={formatRupiah(m.pagu)} />
      <Metric label="Realisasi" value={formatRupiah(m.realisasi)} />
      <Metric label="Sisa SPD Bebas" value={formatRupiah(m.sisa)} />
      <Bar pct={persenNumerik(m.realisasi + m.komitmen, m.pagu)} label={formatPersen(m.realisasi + m.komitmen, m.pagu)} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-mist-dim">{label}</span>
      <span className="mono tnum text-mist">{value}</span>
    </div>
  );
}

function Bar({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-mist-dim">Serapan</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-edge">
        <div className="h-full rounded-full bg-amber" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <span className="mono tnum text-mist">{label}</span>
    </div>
  );
}

// Pengawas: menu atas tanpa sidebar, tanpa mini progress bar
function PengawasLayout({
  nav,
  activeId,
  onNavigate,
  session,
  children,
}: {
  nav: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  session: SessionPayload;
  children: ReactNode;
}) {
  const ta = session.active_ta_id ? repo.tahunAnggaranById(session.active_ta_id) : undefined;
  return (
    <div className="flex min-h-screen flex-col bg-ink text-mist">
      <header className="border-b border-ink-edge bg-ink-surface">
        <div className="flex h-12 items-center gap-3 px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-edge bg-ink">
            <Landmark size={16} className="text-amber" />
          </div>
          <span className="text-sm font-bold tracking-tight">AMANDA</span>
          <span className="rounded-full border border-ink-edge bg-ink px-2.5 py-0.5 text-2xs font-medium text-mist-dim">
            Pengawas/Auditor
          </span>
          {ta && (
            <span className="mono rounded-full border border-ink-edge bg-ink px-2.5 py-0.5 text-2xs font-medium text-mist">
              TA {ta.tahun}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-2xs text-mist-dim sm:inline">{session.nama_snapshot}</span>
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink-edge px-2.5 py-1.5 text-2xs font-medium text-mist-dim hover:border-crit/40 hover:text-crit"
              aria-label="Keluar"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
        {/* Menu atas, bukan sidebar */}
        <nav className="flex gap-1 overflow-x-auto border-t border-ink-edge px-4 py-2">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeId === item.id
                  ? 'bg-amber/10 text-amber ring-1 ring-amber/30'
                  : 'text-mist-dim hover:bg-ink-edge/40 hover:text-mist'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}

// Ikon helper untuk nav
export const NavIcons = {
  dashboard: <LayoutDashboard size={18} />,
  shield: <ShieldCheck size={18} />,
  file: <FileText size={18} />,
  scroll: <ScrollText size={18} />,
};
