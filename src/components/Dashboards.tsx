// Dasbor per peran (D03 §14) + Audit Trail reader (AUD-01) + Portal Publik stub.
// Tahap A: tampilan dasar untuk demonstrasi skenario Langkah 1.

import { useEffect, useReducer, useState } from 'react';
import {
  repo,
} from '@/data/repo';
import {
  Card, StatusBadge, EmptyState, Button,
} from '@/components/ui';
import { formatRupiah, formatPersen, persenNumerik } from '@/lib/format';
import { formatTanggal, formatTanggalPendek, todayWita } from '@/lib/wita';
import { visibleAuditEvents, peranLabel } from '@/lib/audit';
import { getSession } from '@/lib/auth';
import * as anggaran from '@/data/anggaran';
import { aktorSesi, ErrorLine, StatusSeksiBadge, useTick, sisaWaktu } from '@/components/AnggaranShared';
import type { SessionPayload, AuditEvent, TahunAnggaran } from '@/data/types';
import { Landmark, ScrollText, FileText, ShieldCheck, TriangleAlert as AlertTriangle, Clock, Building2, Search, History, Lock } from 'lucide-react';

// ============ ADMIN — Dasbor Administrasi Global ============
export function AdminDashboard() {
  const taList = repo.tahunAnggaran();
  const auditAll = visibleAuditEvents();
  return (
    <div className="space-y-6">
      <PageHeader title="Dasbor Administrasi Global" desc="Master & Tahun Anggaran — Admin tidak melihat alokasi, SPD, kuitansi, SPJ, verifikasi, atau BKU." />
      {/* Kartu TA + Pagu Induk (pengecualian disetujui D01 §6 poin 3) */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-mist">Tahun Anggaran</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {taList.map((ta) => (
            <Card key={ta.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="mono text-base font-semibold text-mist">TA {ta.tahun}</span>
                <StatusBadge
                  kind={ta.status === 'Aktif Penuh' ? 'ok' : ta.status === 'Draft' ? 'neutral' : 'warn'}
                  label={ta.status}
                />
              </div>
              <div className="mt-3 space-y-1 text-2xs text-mist-dim">
                <Row label="Pagu Induk" value={formatRupiah(ta.pagu_induk)} mono />
                <Row label="APBD-P" value={ta.mode_apbd_p ? 'Aktif' : 'Tidak'} />
                <Row label="Pernah transaksi" value={ta.pernah_transaksi ? 'Ya' : 'Tidak'} />
                <Row label="Arsip terakhir" value={formatTanggal(ta.tanggal_arsip_terakhir)} />
              </div>
              <div className="mt-3 text-2xs text-mist-dim">
                {ta.status === 'Arsip Read-Only' && (
                  <span className="inline-flex items-center gap-1"><Lock size={12} /> Arsip Read-Only — retensi 12 tahun sejak arsip terakhir</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Countdown & banner merah (mode baca saja — D01 §6 poin 3) */}
      <Card className="border-warn/30 bg-warn/5 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warn" />
          <div className="text-2xs text-warn">
            <p className="font-semibold">Pengumuman Gatekeeper (mode baca untuk Admin)</p>
            <p className="mt-1">Pada data contoh seluruh seksi berstatus Seimbang dan Bendahara telah menekan Sahkan — gatekeeper terbuka. Banner merah akan menampilkan daftar seksi yang belum selesai bila ada.</p>
          </div>
        </div>
      </Card>

      {/* Jejak Audit (seluruh TA, termasuk entri keuangan, baca saja) */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-mist">Jejak Audit — Seluruh TA</h3>
        <AuditTrail events={auditAll} />
      </div>
    </div>
  );
}

// ============ BENDAHARA — Dasbor (Pro Mode) ============
export function BendaharaDashboard() {
  const s = getSession()!;
  const ta = repo.tahunAnggaranById(s.active_ta_id!)!;
  const seksiList = repo.seksiTAByTA(ta.id).filter((x) => x.status === 'Aktif');
  const kuitansi = repo.kuitansiByTA(ta.id);
  const [sahkanErr, setSahkanErr] = useState<string | null>(null);
  const [, bump] = useReducer((x: number) => x + 1, 0);
  useTick();

  const statusSeksi = seksiList.map((sek) => ({ sek, status: anggaran.statusSeksi(ta.id, sek.id) }));
  const tuntas = statusSeksi.filter((x) => x.status === 'Tuntas (100% Seimbang)').length;
  const gerbang = anggaran.gerbangStatus(ta.id);
  const gateOpen = gerbang.terbuka;
  const bisaSahkan = !gerbang.disahkan && gerbang.seksiBelum.length === 0;
  const rekAlokasi = anggaran.alokasiRekeningByTA(ta.id);
  const totalPagu = rekAlokasi.reduce((s, r) => s + r.pagu, 0);
  const totalRealisasi = rekAlokasi.reduce((s, r) => s + anggaran.realisasiAlokasi(r), 0);
  const totalSisaSpd = rekAlokasi.reduce((s, r) => s + anggaran.sisaSpdBebas(r), 0);
  const serapan = totalPagu > 0 ? `${((totalRealisasi / totalPagu) * 100).toFixed(1)}%` : '—';
  const tutupJendela = anggaran.jendelaTutup(ta.id);
  const sahkan = () => {
    const aktor = aktorSesi();
    if (!aktor) return;
    const hasil = anggaran.sahkanAlokasi(ta.id, aktor);
    if (!hasil.ok) { setSahkanErr(hasil.error ?? 'Gagal'); return; }
    setSahkanErr(null);
    bump();
  };

  return (
    <div className="space-y-6 pro-dashboard">
      <PageHeader title="Dasbor Bendahara Pengeluaran" desc={`TA ${ta.tahun}`} />

      <KartuPaguInduk ta={ta} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4"><p className="text-2xs text-mist-dim">Pagu Alokasi</p><p className="mono tnum mt-1 text-lg text-mist">{formatRupiah(totalPagu)}</p></Card>
        <Card className="p-4"><p className="text-2xs text-mist-dim">Realisasi BKU</p><p className="mono tnum mt-1 text-lg text-mist">{formatRupiah(totalRealisasi)}</p></Card>
        <Card className="p-4"><p className="text-2xs text-mist-dim">Sisa SPD Bebas</p><p className="mono tnum mt-1 text-lg text-mist">{formatRupiah(totalSisaSpd)}</p></Card>
        <Card className="p-4"><p className="text-2xs text-mist-dim">Serapan</p><p className="mono tnum mt-1 text-lg text-mist">{serapan}</p></Card>
      </div>
      {/* Ticker ringkasan (Pro Mode) */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-4 text-2xs">
          <TikerItem label="Seksi" value={`${seksiList.length}`} />
          <TikerItem label="Tuntas" value={`${tuntas}/${seksiList.length}`} />
          <StatusBadge kind={gateOpen ? 'ok' : 'warn'} label={gateOpen ? 'Gatekeeper Terbuka' : 'Gatekeeper Tertutup'} />
          {gerbang.seksiBelum.length > 0 && tutupJendela && (
            <TikerItem label="Jendela berakhir" value={`${tutupJendela} (${sisaWaktu(tutupJendela)})`} />
          )}
        </div>
      </Card>

      {/* Tabel pemantau kesiapan */}
      <Card>
        <div className="border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Pemantau Kesiapan Seksi</h3>
        </div>
        <table className="w-full text-2xs">
          <thead className="bg-ink text-mist-dim">
            <tr className="text-left">
              <th className="pro-row px-4 font-medium">Seksi</th>
              <th className="pro-row px-4 font-medium">Status Alokasi</th>
            </tr>
          </thead>
          <tbody>
            {statusSeksi.map((x, i) => (
              <tr key={x.sek.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                <td className="pro-row px-4 text-mist">{x.sek.nama_snapshot}</td>
                <td className="pro-row px-4">
                  <StatusBadge
                    kind={x.status === 'Tuntas (100% Seimbang)' ? 'ok' : x.status === 'Belum Input' ? 'crit' : 'warn'}
                    label={x.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Tombol Sahkan */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mist">Pengesahan Alokasi (Sahkan)</p>
            <p className="text-2xs text-mist-dim">SPD terbit 100% pagu yang disahkan setelah seluruh seksi Seimbang.</p>
          </div>
          <Button onClick={sahkan} disabled={!bisaSahkan}>{ta.mode_apbd_p ? 'Sahkan ulang' : 'Sahkan'}</Button>
        </div>
        {!bisaSahkan && (
          <p className="mt-2 text-2xs text-warn">Tombol nonaktif: seluruh seksi belum Seimbang atau pengesahan sudah dilakukan.</p>
        )}
        <ErrorLine msg={sahkanErr} />
      </Card>

      {/* SPJ Menunggu BKU */}
      <Card>
        <div className="border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">SPJ Menunggu BKU</h3>
        </div>
        <div className="p-4">
          {repo.spjByTA(ta.id).filter((s) => s.status === 'Menunggu BKU').length === 0 ? (
            <EmptyState icon={<FileText size={28} />} title="Tidak ada SPJ Menunggu BKU" />
          ) : (
            <p className="text-2xs text-mist-dim">Ada SPJ menunggu pembukuan.</p>
          )}
        </div>
      </Card>

      <AuditTrailSection />
    </div>
  );
}

// ============ PPTK — Dasbor ============
export function PptkDashboard() {
  const s = getSession()!;
  const ta = repo.tahunAnggaranById(s.active_ta_id!)!;
  const seksi = s.active_seksi_id ? repo.seksiTAById(s.active_seksi_id) : undefined;
  const kuitansiSeksi = repo.kuitansiBySeksi(s.active_seksi_id ?? '');
  const spjSeksi = repo.spjByTA(ta.id).filter((spj) => {
    const k = kuitansiSeksi.find((x) => x.id === spj.kuitansi_id);
    return !!k;
  });

  const gerbang = anggaran.gerbangStatus(ta.id);
  const paguSeksiSaya = seksi ? anggaran.paguSeksi(ta.id, seksi.id) : 0;
  const statusSeksiSaya = seksi ? anggaran.statusSeksi(ta.id, seksi.id) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Dasbor PPTK / Seksi" desc={`${seksi?.nama_snapshot ?? '—'} • TA ${ta.tahun}`} />
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-4 text-2xs">
          <TikerItem label="Seksi" value={seksi?.nama_snapshot ?? '—'} />
          <TikerItem label="Pagu Seksi" value={formatRupiah(paguSeksiSaya)} />
          {statusSeksiSaya && <StatusSeksiBadge status={statusSeksiSaya} />}
          {gerbang.terbuka
            ? <StatusBadge kind="ok" label="Gatekeeper Terbuka" />
            : <StatusBadge kind="crit" label="Gatekeeper Tertutup" />}
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="border-b border-ink-edge px-4 py-3">
            <h3 className="text-sm font-semibold text-mist">Kuitansi Aktif</h3>
          </div>
          <div className="p-4">
            {kuitansiSeksi.filter((k) => k.status === 'Aktif').length === 0 ? (
              <EmptyState icon={<FileText size={28} />} title="Tidak ada kuitansi Aktif" />
            ) : (
              <ul className="space-y-2 text-2xs">
                {kuitansiSeksi.filter((k) => k.status === 'Aktif').map((k) => (
                  <li key={k.id} className="flex items-center justify-between rounded-md border border-ink-edge bg-ink px-3 py-2">
                    <div>
                      <div className="text-mist">{k.uraian}</div>
                      <div className="text-mist-dim">{formatTanggalPendek(k.tanggal_kuitansi)} • {k.penerima}</div>
                    </div>
                    <span className="mono tnum text-mist">{formatRupiah(k.bruto)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
        <Card>
          <div className="border-b border-ink-edge px-4 py-3">
            <h3 className="text-sm font-semibold text-mist">SPJ Draft / Dikembalikan</h3>
          </div>
          <div className="p-4">
            {spjSeksi.filter((s) => s.status === 'Draft').length === 0 ? (
              <EmptyState icon={<ScrollText size={28} />} title="Tidak ada SPJ Draft" />
            ) : (
              <ul className="space-y-2 text-2xs">
                {spjSeksi.filter((s) => s.status === 'Draft').map((s) => (
                  <li key={s.id} className="rounded-md border border-ink-edge bg-ink px-3 py-2">
                    <div className="text-mist">SPJ {s.jenis_belanja}</div>
                    {s.catatan_revisi && <div className="mt-1 text-warn">Catatan revisi: {s.catatan_revisi}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
      <AuditTrailSection />
    </div>
  );
}

// ============ VERIFIKATOR — Dasbor (Pro Mode) ============
export function VerifikatorDashboard() {
  const s = getSession()!;
  const ta = repo.tahunAnggaranById(s.active_ta_id!)!;
  const spjList = repo.spjByTA(ta.id);
  const terkunci = spjList.filter((x) => x.status === 'Terkunci');
  const disetujui = spjList.filter((x) => x.status === 'Menunggu BKU' || x.status === 'Dibukukan');
  const dikembalikan = spjList.filter((x) => x.status === 'Draft' && x.catatan_revisi);

  return (
    <div className="space-y-6 pro-dashboard">
      <PageHeader title="Dasbor Verifikator" desc={`TA ${ta.tahun}`} />
      <KartuPaguInduk ta={ta} />
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-4 text-2xs">
          <TikerItem label="Antrean Terkunci" value={`${terkunci.length}`} />
          <TikerItem label="Disetujui" value={`${disetujui.length}`} />
          <TikerItem label="Dikembalikan" value={`${dikembalikan.length}`} />
        </div>
      </Card>
      <Card>
        <div className="border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Antrean SPJ Terkunci</h3>
        </div>
        <div className="p-4">
          {terkunci.length === 0 ? (
            <EmptyState icon={<ScrollText size={28} />} title="Tidak ada SPJ Terkunci" />
          ) : (
            <p className="text-2xs text-mist-dim">{terkunci.length} SPJ menunggu verifikasi.</p>
          )}
        </div>
      </Card>
      <AuditTrailSection />
    </div>
  );
}

// ============ PA/KPA — Dasbor Eksekutif (Pro Mode, Langkah 8 mengembangkan analitik) ============
export function PakpaDashboard() {
  const s = getSession()!;
  const ta = repo.tahunAnggaranById(s.active_ta_id!)!;
  const seksiList = repo.seksiTAByTA(ta.id);
  const pemetaan = repo.pemetaanByTA(ta.id);
  const alokasiSub = repo.alokasiSubkegiatanByTA(ta.id);
  const alokasiRek = repo.alokasiRekeningByTA(ta.id);
  const kuitansi = repo.kuitansiByTA(ta.id);
  const bkuList = repo.bkuByTA(ta.id);
  const realisasiByRek = new Map<string, number>();
  for (const b of bkuList) {
    if (b.status !== 'Aktif') continue;
    const k = kuitansi.find((x) => x.id === b.kuitansi_id);
    if (k) realisasiByRek.set(k.rekening_id, (realisasiByRek.get(k.rekening_id) ?? 0) + k.bruto);
  }

  return (
    <div className="space-y-6 pro-dashboard">
      <PageHeader title="Dasbor Eksekutif PA/KPA" desc={`TA ${ta.tahun} • drill-down sampai subkegiatan`} />
      <KartuPaguInduk ta={ta} />
      {/* Ticker ringkasan */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-4 text-2xs">
          <TikerItem label="Seksi" value={`${seksiList.length}`} />
          <TikerItem label="Realisasi" value={formatRupiah([...realisasiByRek.values()].reduce((s, v) => s + v, 0))} />
        </div>
      </Card>
      {/* Tabel per seksi (sampai subkegiatan; rekening tidak tampil untuk PA/KPA) */}
      <Card>
        <div className="border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Realisasi per Seksi</h3>
        </div>
        <table className="w-full text-2xs">
          <thead className="bg-ink text-mist-dim">
            <tr className="text-right">
              <th className="pro-row px-4 text-left font-medium">Seksi</th>
              <th className="pro-row px-4 font-medium">Pagu</th>
              <th className="pro-row px-4 font-medium">Realisasi</th>
              <th className="pro-row px-4 font-medium">Realisasi %</th>
            </tr>
          </thead>
          <tbody>
            {seksiList.map((sek, i) => {
              const sekPem = pemetaan.filter((p) => p.seksi_ta_id === sek.id);
              const sekRek = alokasiRek.filter((a) => sekPem.some((p) => p.id === a.pemetaan_subkegiatan_id));
              const pagu = sekRek.reduce((s, a) => s + a.pagu, 0);
              const real = sekRek.reduce((s, a) => s + (realisasiByRek.get(a.rekening_id) ?? 0), 0);
              return (
                <tr key={sek.id} className={`text-right ${i % 2 ? 'bg-ink-surface/40' : ''}`}>
                  <td className="pro-row px-4 text-left text-mist">{sek.nama_snapshot}</td>
                  <td className="pro-row px-4 mono tnum text-mist">{formatRupiah(pagu)}</td>
                  <td className="pro-row px-4 mono tnum text-mist">{formatRupiah(real)}</td>
                  <td className="pro-row px-4 mono tnum text-mist">{formatPersen(real, pagu)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="border-t border-ink-edge px-4 py-2 text-2xs text-mist-dim">
          PA/KPA tidak melihat tingkat rekening belanja (D01 §7 poin 5c). Analitik burn-rate & zona tiba di Langkah 8.
        </div>
      </Card>
    </div>
  );
}

// ============ PENGAWAS/AUDITOR — Dasbor baca saja ============
export function PengawasDashboard() {
  const s = getSession()!;
  const ta = repo.tahunAnggaranById(s.active_ta_id!)!;
  const tp = repo.penugasanPengawasByTA(ta.id).find((t) => t.pengawas_id === s.user_id);
  const aud = repo.pengawasById(s.user_id);

  return (
    <div className="space-y-6">
      <PageHeader title="Dasbor Pengawas / Auditor" desc={`${ta.tahun} • Mode baca saja — laporan & jejak audit`} />
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoItem label="Penugasan" value={`TA ${ta.tahun}`} />
          <InfoItem label="Instansi asal" value={aud?.instansi_asal ?? '—'} />
          <InfoItem label="Nomor surat tugas" value={aud?.nomor_surat_tugas ?? '—'} />
          <InfoItem label="Tanggal akhir akses" value={formatTanggal(aud?.tanggal_akhir_akses ?? null)} />
          <InfoItem label="Rentang penugasan" value={`${formatTanggal(tp?.tanggal_mulai ?? null)} — ${formatTanggal(tp?.tanggal_akhir ?? null)}`} />
          <InfoItem label="Status TA" value={ta.status} />
        </div>
        <div className="mt-4 rounded-md border border-ink-edge bg-ink px-3 py-2 text-2xs text-mist-dim">
          Pengawas tidak melihat countdown, banner merah, mini progress bar, atau sidebar. Tanpa drill-down anggaran, master, akun, atau tombol proses.
        </div>
      </Card>
      <AuditTrailSection />
    </div>
  );
}

// ============ Komponen bersama ============
function PageHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-mist">{title}</h2>
      {desc && <p className="text-2xs text-mist-dim">{desc}</p>}
    </div>
  );
}

function KartuPaguInduk({ ta }: { ta: TahunAnggaran }) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-2xs text-mist-dim">Pagu Induk TA {ta.tahun}{ta.mode_apbd_p ? ' (APBD-P berlaku)' : ''}</p>
          <p className="mono tnum text-xl font-semibold text-mist">{formatRupiah(anggaran.paguIndukAktif(ta.id))}</p>
        </div>
        {ta.mode_apbd_p && (
          <div className="space-y-1 text-2xs text-mist-dim">
            <p>Pagu Induk murni <span className="mono tnum text-mist">{formatRupiah(ta.pagu_induk)}</span></p>
            <p>Pagu Induk APBD-P <span className="mono tnum text-mist">{formatRupiah(ta.pagu_induk_perubahan ?? 0)}</span></p>
          </div>
        )}
      </div>
    </Card>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className={mono ? 'mono tnum text-mist' : 'text-mist'}>{value}</span>
    </div>
  );
}

function TikerItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-mist-dim">{label}</span>
      <span className="mono tnum text-mist">{value}</span>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-edge bg-ink px-3 py-2">
      <div className="text-2xs text-mist-dim">{label}</div>
      <div className="mt-0.5 text-sm text-mist">{value}</div>
    </div>
  );
}

function AuditTrailSection() {
  const events = visibleAuditEvents();
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-mist">Jejak Audit</h3>
      <AuditTrail events={events} />
    </div>
  );
}

export function AuditTrail({ events }: { events: AuditEvent[] }) {
  const [q, setQ] = useState('');
  const filtered = events.filter((e) => {
    if (!q) return true;
    const t = `${e.aktor_nama_snapshot} ${e.entitas} ${e.aksi} ${e.nilai_sebelum ?? ''} ${e.nilai_sesudah ?? ''}`.toLowerCase();
    return t.includes(q.toLowerCase());
  });
  return (
    <Card>
      <div className="border-b border-ink-edge px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-mist">Jejak Audit</h3>
          <div className="relative w-64 max-w-full">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-mist-dim" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari aktor, entitas, aksi..."
              className="w-full rounded-md border border-ink-edge bg-ink py-1.5 pl-7 pr-2 text-2xs text-mist placeholder:text-mist-dim/60 focus-visible:outline-amber focus-visible:outline-2"
            />
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<History size={28} />} title="Tidak ada entri jejak audit" desc="Pencarian dan filter hanya mengembalikan data dalam cakupan peran." />
      ) : (
        <div className="divide-y divide-ink-edge">
          {filtered.map((e) => (
            <div key={e.id} className="px-4 py-2.5 text-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-mist">{e.aksi.replace(/_/g, ' ')}</span>
                    {e.otomatis && <span className="rounded-full border border-mist-dim/30 px-1.5 py-0.5 text-2xs text-mist-dim">otomatis</span>}
                  </div>
                  <div className="mt-0.5 text-mist-dim">
                    {e.entitas} • {e.aktor_nama_snapshot} ({e.aktor_peran_snapshot}) • {e.waktu}
                  </div>
                  {(e.nilai_sebelum || e.nilai_sesudah) && (
                    <div className="mt-0.5 text-mist-dim">
                      {e.nilai_sebelum && <span>sebelum: {e.nilai_sebelum}</span>}
                      {e.nilai_sebelum && e.nilai_sesudah && <span> → </span>}
                      {e.nilai_sesudah && <span>sesudah: {e.nilai_sesudah}</span>}
                    </div>
                  )}
                  {e.alasan && <div className="mt-0.5 text-warn">alasan: {e.alasan}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-ink-edge px-4 py-2 text-2xs text-mist-dim">
        Login dan logout tidak dicatat. Pembatalan kuitansi/SPJ Draft menghapus entri terkait otomatis. Tidak ada tombol hapus manual.
      </div>
    </Card>
  );
}

// ============ Portal Publik stub (Langkah 8) — tautan dari login ============
export function PublicPortalStub({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-ink text-mist">
      <div className="flex items-center justify-between border-b border-ink-edge bg-ink-surface px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-edge bg-ink">
            <Landmark size={18} className="text-amber" />
          </div>
          <div>
            <div className="text-sm font-bold">AMANDA — Portal Keterbukaan</div>
            <div className="text-2xs text-mist-dim">Akses anonim tanpa login</div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="rounded-md border border-ink-edge px-3 py-1.5 text-2xs text-mist-dim hover:text-mist"
        >
          Kembali ke login
        </button>
      </div>
      <div className="mx-auto max-w-3xl p-6">
        <Card className="p-6">
          <h2 className="text-base font-semibold text-mist">Portal Keterbukaan Informasi Publik</h2>
          <p className="mt-1 text-2xs text-mist-dim">
            Portal ini akan menampilkan persentase realisasi dan cacah SPJ (tanpa nominal rupiah) sesuai Dokumen 01 §10.
            Pengembangan lengkap tiba di Langkah 8. Saat ini hanya stub tema Treasury.
          </p>
        </Card>
      </div>
    </div>
  );
}
