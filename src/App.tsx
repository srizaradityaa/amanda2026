// AMANDA — App shell (Langkah 1, Tahap A).
// Menghubungkan login -> seleksi konteks berjenjang -> dasbor per peran.

import { useEffect, useState } from 'react';
import { LoginPage } from '@/components/LoginPage';
import { ContextSelectPage } from '@/components/ContextSelectPage';
import { DashboardShell, type NavItem } from '@/components/DashboardShell';
import {
  AdminDashboard, BendaharaDashboard, PptkDashboard, VerifikatorDashboard,
  PakpaDashboard, PengawasDashboard, AuditTrail, PublicPortalStub,
} from '@/components/Dashboards';
import {
  AdminDasborPage, SOTKPage, PersonelPage, KamusPage, PajakPage,
  PengawasPage, DirektoriPage, PetaJabatanPage,
} from '@/components/AdminPanels';
import { TahunAnggaranPage } from '@/components/TAPanels';
import { FormBuilderPage } from '@/components/FormBuilderPage';
import { TemplateKuitansiPage } from '@/components/TemplateKuitansiPage';
import { AnggaranBendaharaPage } from '@/components/AnggaranBendaharaPage';
import { AnggaranPptkPage } from '@/components/AnggaranPptkPage';
import { GerbangBanner } from '@/components/AnggaranShared';
import { repo } from '@/data/repo';
import { DrilldownPage } from '@/components/DrilldownPage';
import { getSession, isPending, subscribeSession, logout } from '@/lib/auth';
import { visibleAuditEvents } from '@/lib/audit';
import { evaluasiDelegasiJatuhTempo } from '@/lib/delegasi';
import { LayoutDashboard, ScrollText, ShieldCheck, History, Building2, Users, Layers, FileText, KeyRound, ScrollText as ScrollIcon, CalendarRange, Wallet } from 'lucide-react';
import type { SessionPayload } from '@/data/types';

type View = 'login' | 'context' | 'app' | 'public';

function App() {
  const [view, setView] = useState<View>('login');
  const [session, setSession] = useState<SessionPayload | null>(getSession());
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    evaluasiDelegasiJatuhTempo();
    const unsub = subscribeSession(() => {
      const s = getSession();
      setSession(s);
      if (!s) setView('login');
      else if (isPending(s)) setView('context');
      else setView('app');
    });
    // sinkronkan tampilan awal
    const s = getSession();
    if (!s) setView('login');
    else if (isPending(s)) setView('context');
    else setView('app');
    return unsub;
  }, []);

  useEffect(() => {
    const goPublic = () => setView('public');
    window.addEventListener('amanda:go-public', goPublic);
    return () => window.removeEventListener('amanda:go-public', goPublic);
  }, []);

  if (view === 'public') {
    return <PublicPortalStub onBack={() => setView('login')} />;
  }

  if (view === 'login' || !session) {
    return <LoginPage onLogin={() => {
      evaluasiDelegasiJatuhTempo();
      const s = getSession();
      setSession(s);
      if (!s) setView('login');
      else if (isPending(s)) setView('context');
      else setView('app');
    }} />;
  }

  if (view === 'context' || isPending(session)) {
    return <ContextSelectPage onResolved={() => {
      const s = getSession();
      setSession(s);
      setView('app');
      setActiveNav('dashboard');
    }} />;
  }

  return <AppShell session={session} activeNav={activeNav} onNavigate={setActiveNav} />;
}

function AppShell({
  session,
  activeNav,
  onNavigate,
}: {
  session: SessionPayload;
  activeNav: string;
  onNavigate: (id: string) => void;
}) {
  const role = session.active_role;
  const nav = buildNav(role);
  const active = nav.find((n) => n.id === activeNav) ?? nav[0];
  const bannerTA = role === 'pengawas'
    ? null
    : session.active_ta_id ?? (role === 'admin' ? repo.tahunAnggaran().find((t) => t.status === 'Aktif Penuh')?.id ?? null : null);

  return (
    <DashboardShell nav={nav} activeId={active?.id ?? 'dashboard'} onNavigate={onNavigate}>
      {bannerTA && <GerbangBanner ta_id={bannerTA} />}
      {active?.render()}
    </DashboardShell>
  );
}

function buildNav(role: string): NavItem[] {
  if (role === 'admin') {
    return [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={18} />, render: () => <AdminDasborPage /> },
      { id: 'sotk', label: 'Master SOTK', icon: <Building2 size={18} />, render: () => <SOTKPage /> },
      { id: 'personel', label: 'Master Personel', icon: <Users size={18} />, render: () => <PersonelPage /> },
      { id: 'peta-jabatan', label: 'Peta Jabatan', icon: <Users size={18} />, render: () => <PetaJabatanPage /> },
      { id: 'kamus', label: 'Subkegiatan & Rekening', icon: <Layers size={18} />, render: () => <KamusPage /> },
      { id: 'pajak', label: 'Jenis Pajak', icon: <FileText size={18} />, render: () => <PajakPage /> },
      { id: 'form-dinamis', label: 'Form Dinamis', icon: <FileText size={18} />, render: () => <FormBuilderPage /> },
      { id: 'template-kuitansi', label: 'Template Kuitansi', icon: <FileText size={18} />, render: () => <TemplateKuitansiPage /> },
      { id: 'pengawas', label: 'Akun Pengawas', icon: <KeyRound size={18} />, render: () => <PengawasPage /> },
      { id: 'direktori', label: 'Direktori SPJ', icon: <ScrollIcon size={18} />, render: () => <DirektoriPage /> },
      { id: 'tahun-anggaran', label: 'Tahun Anggaran', icon: <CalendarRange size={18} />, render: () => <TahunAnggaranPage /> },
      { id: 'audit', label: 'Jejak Audit', icon: <History size={18} />, render: () => <AuditTrail events={visibleAuditEvents()} /> },
    ];
  }
  if (role === 'bendahara') {
    return [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={18} />, render: () => <BendaharaDashboard /> },
      { id: 'anggaran', label: 'Anggaran', icon: <Wallet size={18} />, render: () => <AnggaranBendaharaPage /> },
      { id: 'rincian', label: 'Rincian Anggaran', icon: <Layers size={18} />, render: () => <DrilldownPage /> },
      { id: 'audit', label: 'Jejak Audit', icon: <History size={18} />, render: () => <AuditTrail events={visibleAuditEvents()} /> },
    ];
  }
  if (role === 'pptk') {
    return [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={18} />, render: () => <PptkDashboard /> },
      { id: 'anggaran', label: 'Anggaran', icon: <Wallet size={18} />, render: () => <AnggaranPptkPage /> },
      { id: 'rincian', label: 'Rincian Anggaran', icon: <Layers size={18} />, render: () => <DrilldownPage /> },
      { id: 'audit', label: 'Jejak Audit', icon: <History size={18} />, render: () => <AuditTrail events={visibleAuditEvents()} /> },
    ];
  }
  if (role === 'verifikator') {
    return [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={18} />, render: () => <VerifikatorDashboard /> },
      { id: 'rincian', label: 'Rincian Anggaran', icon: <Layers size={18} />, render: () => <DrilldownPage /> },
      { id: 'audit', label: 'Jejak Audit', icon: <History size={18} />, render: () => <AuditTrail events={visibleAuditEvents()} /> },
    ];
  }
  if (role === 'pa_kpa') {
    return [
      { id: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={18} />, render: () => <PakpaDashboard /> },
      { id: 'rincian', label: 'Rincian Anggaran', icon: <Layers size={18} />, render: () => <DrilldownPage /> },
      { id: 'audit', label: 'Jejak Audit', icon: <History size={18} />, render: () => <AuditTrail events={visibleAuditEvents()} /> },
    ];
  }
  if (role === 'pengawas') {
    return [
      { id: 'dashboard', label: 'Dasbor', icon: <ShieldCheck size={18} />, render: () => <PengawasDashboard /> },
      { id: 'audit', label: 'Jejak Audit', icon: <History size={18} />, render: () => <AuditTrail events={visibleAuditEvents()} /> },
    ];
  }
  return [];
}

export default App;
