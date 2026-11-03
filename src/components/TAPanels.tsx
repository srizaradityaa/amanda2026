// Langkah 3 — Panel Admin: Tahun Anggaran & Penugasan (Tahap A).
// TA-01..TA-07, AKN-05, PEN-01..PEN-08, AKN-03.

import { useEffect, useState } from 'react';
import {
  Card, StatusBadge, Button, Field, Input, Select, EmptyState,
  Modal, SearchBox, TableHead, ProtectedNotice, RupiahInput, useToast,
} from '@/components/ui';
import { repo } from '@/data/repo';
import { EditPaguModal } from '@/components/EditPaguModal';
import { ApbdPModal } from '@/components/ApbdPModal';
import { recordAudit } from '@/lib/audit';
import { getSession } from '@/lib/auth';
import { formatTanggal, formatTanggalPendek, todayWita, tambahHari } from '@/lib/wita';
import { formatRupiah } from '@/lib/format';
import type { TahunAnggaran, PeranPenugasan, PenugasanTA, PenugasanDelegasi, SeksiTA, RegisterSK, AccountStatus } from '@/data/types';
import { Plus, Trash2, ArrowRight, Building2, Users, ShieldCheck, TriangleAlert as AlertTriangle, Lock, CircleCheck as CheckCircle2, Circle as XCircle, FileText, CalendarClock, Copy, UserCog, Pencil, UserPlus } from 'lucide-react';

type TAStatus = TahunAnggaran['status'];
const SESSION = getSession();

// ============ TA-01/02/05/07 — Manajemen Tahun Anggaran ============
export function TahunAnggaranPage() {
  const [list, setList] = useState(repo.tahunAnggaran());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [statusModal, setStatusModal] = useState<{ taId: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ taId: string } | null>(null);
  const [retensiModal, setRetensiModal] = useState<{ taId: string } | null>(null);
  const [apbdpModal, setApbdpModal] = useState<{ taId: string } | null>(null);
  const [paguModal, setPaguModal] = useState<{ taId: string } | null>(null);
  const refresh = () => setList([...repo.tahunAnggaran()]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Tahun Anggaran" desc="Siklus: Draft → Aktif Penuh → Masa Transisi → Arsip Read-Only. Seluruh perpindahan manual oleh Admin." />
        <Button onClick={() => setCreateModal(true)}><Plus size={16} /> Buat TA Baru</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ta) => (
          <Card key={ta.id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="mono text-base font-semibold text-mist">TA {ta.tahun}</span>
              <StatusBadge kind={taStatusKind(ta.status)} label={ta.status} />
            </div>
            <div className="mt-3 space-y-1 text-2xs text-mist-dim">
              <Row label="Pagu Induk" value={formatRupiah(ta.pagu_induk)} mono />
              <Row label="APBD-P" value={ta.mode_apbd_p ? 'Aktif' : 'Tidak'} />
              <Row label="Pernah transaksi" value={ta.pernah_transaksi ? 'Ya' : 'Tidak'} />
              <Row label="Arsip terakhir" value={formatTanggal(ta.tanggal_arsip_terakhir)} />
            </div>
            {ta.status === 'Arsip Read-Only' && <div className="mt-2"><ProtectedNotice label="Arsip Read-Only" /></div>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Button variant="ghost" className="text-2xs" onClick={() => setDetailId(ta.id)}><Building2 size={12} /> Detail</Button>
              <Button variant="ghost" className="text-2xs" onClick={() => setStatusModal({ taId: ta.id })}><CalendarClock size={12} /> Ubah Status</Button>
              {ta.status === 'Draft' && !ta.pernah_transaksi && (
                <Button variant="ghost" className="text-2xs" onClick={() => setPaguModal({ taId: ta.id })}><Pencil size={12} /> Ubah Pagu</Button>
              )}
              {ta.status === 'Draft' && !ta.pernah_transaksi && (
                <Button variant="danger" className="text-2xs" onClick={() => setDeleteModal({ taId: ta.id })}><Trash2 size={12} /> Hapus</Button>
              )}
              {ta.status === 'Aktif Penuh' && !ta.mode_apbd_p && (
                <Button variant="ghost" className="text-2xs" onClick={() => setApbdpModal({ taId: ta.id })}><CalendarClock size={12} /> Aktifkan APBD-P</Button>
              )}
              {ta.status === 'Arsip Read-Only' && (
                <>
                  <Button variant="ghost" className="text-2xs" onClick={() => setStatusModal({ taId: ta.id })}><ArrowRight size={12} /> Buka Kembali</Button>
                  {repo.isRetensiLewat(ta.id) && (
                    <Button variant="danger" className="text-2xs" onClick={() => setRetensiModal({ taId: ta.id })}><Trash2 size={12} /> Hapus (Retensi)</Button>
                  )}
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {detailId && <TADetailModal taId={detailId} onClose={() => setDetailId(null)} />}
      {createModal && <CreateTAModal onClose={() => setCreateModal(false)} onSaved={refresh} />}
      {statusModal && <StatusModal taId={statusModal.taId} onClose={() => setStatusModal(null)} onSaved={refresh} />}
      {deleteModal && <DeleteTAModal taId={deleteModal.taId} onClose={() => setDeleteModal(null)} onSaved={refresh} />}
      {paguModal && <EditPaguModal taId={paguModal.taId} onClose={() => setPaguModal(null)} onSaved={() => { setPaguModal(null); refresh(); }} />}
      {retensiModal && <RetensiModal taId={retensiModal.taId} onClose={() => setRetensiModal(null)} onSaved={refresh} />}
      {apbdpModal && <ApbdPModal taId={apbdpModal.taId} onClose={() => setApbdpModal(null)} onSaved={() => { setApbdpModal(null); refresh(); }} />}
    </div>
  );
}

function taStatusKind(s: TAStatus): 'ok' | 'warn' | 'neutral' | 'crit' {
  if (s === 'Aktif Penuh') return 'ok';
  if (s === 'Masa Transisi') return 'warn';
  if (s === 'Arsip Read-Only') return 'neutral';
  return 'neutral';
}

function CreateTAModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [tahun, setTahun] = useState('');
  const toast = useToast();
  const [pagu, setPagu] = useState(0);
  const [salinDari, setSalinDari] = useState('');
  const [err, setErr] = useState('');
  const taList = repo.tahunAnggaran();

  const save = () => {
    if (!tahun.trim()) return setErr('Tahun wajib diisi.');
    if (!/^\d{4}$/.test(tahun.trim())) return setErr('Tahun harus 4 digit angka.');
    if (pagu <= 0) return setErr('Pagu Induk harus lebih dari 0.');
    const r = repo.buatTA(tahun.trim(), pagu);
    if (!r.ok || !r.ta) return setErr(r.error ?? 'Gagal.');
    recordAudit({ ta_id: r.ta.id, entitas: `TA ${tahun.trim()}`, aksi: 'aksi_administratif', nilai_sesudah: 'TA Draft dibuat' });
    if (salinDari) {
      const sr = repo.salinStruktur(r.ta.id, salinDari);
      if (sr.ok) recordAudit({ ta_id: r.ta.id, entitas: `TA ${tahun.trim()}`, aksi: 'aksi_administratif', nilai_sesudah: `Salin struktur dari TA lain (${sr.count} seksi)` });
    }
    toast.notify('Tersimpan');
    onSaved(); onClose();
  };

  return (
    <Modal open onClose={onClose} title="Buat Tahun Anggaran Baru"
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Buat</Button></div>}>
      <div className="space-y-4">
        <Field label="Tahun Anggaran" required><Input className="mono" value={tahun} onChange={(e) => setTahun(e.target.value)} inputMode="numeric" placeholder="2028" /></Field>
        <Field label="Pagu Induk (Rupiah)" required hint="Bilangan bulat rupiah tanpa sen"><RupiahInput value={pagu} onChange={setPagu} /></Field>
        <Field label="Salin Struktur dari TA Sebelumnya (opsional)" hint="Hanya menyalin seksi aktif & pemetaan subkegiatan. Pagu, SK, dan mutasi tidak disalin.">
          <Select value={salinDari} onChange={(e) => setSalinDari(e.target.value)}>
            <option value="">Tidak salin</option>
            {taList.map((t) => <option key={t.id} value={t.id}>TA {t.tahun} — {t.status}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}

function StatusModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const ta = repo.tahunAnggaranById(taId)!;
  const [target, setTarget] = useState<TAStatus>(ta.status);
  const [err, setErr] = useState('');
  const belumSelesai = repo.spjByTA(taId).filter((s) => s.status !== 'Dibukukan').length;

  // Tentukan transisi yang valid
  const validTransisi: TAStatus[] = (() => {
    if (ta.status === 'Draft') return ['Aktif Penuh'];
    if (ta.status === 'Aktif Penuh') return ['Masa Transisi'];
    if (ta.status === 'Masa Transisi') return ['Arsip Read-Only', 'Aktif Penuh'];
    if (ta.status === 'Arsip Read-Only') return ['Masa Transisi'];
    return [];
  })();

  const save = () => {
    if (!target) return setErr('Pilih status target.');
    // TA-05: checklist kesiapan untuk aktivasi
    if (target === 'Aktif Penuh' && ta.status === 'Draft') {
      const ck = repo.checklistKesiapan(taId);
      if (!ck.lengkap) return setErr('Checklist kesiapan belum lengkap. Lengkapi dulu di halaman Detail TA.');
    }
    const r = repo.ubahStatusTA(taId, target);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    recordAudit({ ta_id: taId, entitas: `TA ${ta.tahun}`, aksi: 'perubahan_status_ta', nilai_sebelum: ta.status, nilai_sesudah: target });
    onSaved(); onClose();
  };

  return (
    <Modal open onClose={onClose} title={`Ubah Status TA ${ta.tahun}`}
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Ubah</Button></div>}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-2xs"><span className="text-mist-dim">Status saat ini:</span><StatusBadge kind={taStatusKind(ta.status)} label={ta.status} /></div>
        <Field label="Status Target" required>
          <Select value={target} onChange={(e) => setTarget(e.target.value as TAStatus)}>
            <option value={ta.status}>— pilih —</option>
            {validTransisi.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        {target === 'Aktif Penuh' && ta.status === 'Draft' && (
          <ChecklistDisplay taId={taId} />
        )}
        {target === 'Arsip Read-Only' && (
          <div className="rounded-md border border-warn/30 bg-warn/5 p-3 text-2xs text-warn">
            <p className="flex items-center gap-1.5 font-semibold"><AlertTriangle size={14} /> Peringatan</p>
            <p className="mt-1">{belumSelesai > 0 ? `Masih ada ${belumSelesai} SPJ yang belum Dibukukan (BKU belum tercatat).` : 'Seluruh SPJ TA ini sudah Dibukukan.'} Keputusan tetap di tangan Admin.</p>
          </div>
        )}
        {target === 'Masa Transisi' && ta.status === 'Arsip Read-Only' && (
          <p className="text-2xs text-mist-dim">Membuka kembali TA Arsip menjadi Masa Transisi. Dapat dikembalikan ke Aktif Penuh bila tidak ada TA lain Aktif Penuh. Retensi 12 tahun dihitung ulang saat diarsipkan kembali.</p>
        )}
      </div>
    </Modal>
  );
}

function ChecklistDisplay({ taId }: { taId: string }) {
  const ck = repo.checklistKesiapan(taId);
  return (
    <div className="rounded-md border border-ink-edge bg-ink p-3 space-y-1.5">
      <p className="text-2xs font-semibold text-mist">Checklist Kesiapan (otomatis dari data)</p>
      {ck.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-2xs">
          {item.ok ? <CheckCircle2 size={14} className="text-ok" /> : <XCircle size={14} className="text-crit" />}
          <span className={item.ok ? 'text-mist-dim' : 'text-mist'}>{item.label}</span>
        </div>
      ))}
      <p className={`text-2xs font-medium ${ck.lengkap ? 'text-ok' : 'text-crit'}`}>
        {ck.lengkap ? 'Checklist lengkap — TA dapat diaktifkan' : 'Checklist belum lengkap — aktivasi ditolak'}
      </p>
    </div>
  );
}

function DeleteTAModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const ta = repo.tahunAnggaranById(taId)!;
  const [err, setErr] = useState('');
  const del = () => {
    const r = repo.hapusTA(taId);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    recordAudit({ ta_id: null, entitas: `TA ${ta.tahun}`, aksi: 'aksi_administratif', nilai_sesudah: 'TA Draft dihapus' });
    onSaved(); onClose();
  };
  return (
    <Modal open onClose={onClose} title={`Hapus TA ${ta.tahun}`}
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button variant="danger" onClick={del}>Hapus</Button></div>}>
      <p className="text-2xs text-mist-dim">TA Draft tanpa transaksi akan dihapus permanen beserta seluruh data terkait (seksi, pemetaan, penugasan).</p>
    </Modal>
  );
}

function RetensiModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const ta = repo.tahunAnggaranById(taId)!;
  const ringkasan = repo.ringkasanHapusTA(taId);
  const [konfirmasi, setKonfirmasi] = useState('');
  const [err, setErr] = useState('');
  const del = () => {
    if (konfirmasi.trim() !== ta.tahun) return setErr(`Ketik "${ta.tahun}" untuk konfirmasi.`);
    const r = repo.hapusTARetensi(taId);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    recordAudit({ ta_id: null, entitas: `TA ${ta.tahun}`, aksi: 'aksi_administratif', nilai_sesudah: 'TA dihapus setelah retensi 12 tahun (total, tanpa catatan penghapusan)' });
    onSaved(); onClose();
  };
  return (
    <Modal open onClose={onClose} title={`Hapus TA ${ta.tahun} (Retensi 12 Tahun)`} wide
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button variant="danger" onClick={del}>Hapus Permanen</Button></div>}>
      <div className="space-y-4">
        <div className="rounded-md border border-crit/30 bg-crit/5 p-3 text-2xs text-crit">
          <p className="font-semibold">Penghapusan total dan permanen</p>
          <p className="mt-1">Seluruh data TA, lampiran, dan jejak audit terkait dihapus permanen tanpa catatan penghapusan.</p>
        </div>
        <div className="rounded-md border border-ink-edge bg-ink p-3">
          <p className="text-2xs font-semibold text-mist">Ringkasan jumlah data (tanpa nominal):</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-2xs text-mist-dim">
            <span>Kuitansi: {ringkasan.kuitansi}</span>
            <span>SPJ: {ringkasan.spj}</span>
            <span>BKU: {ringkasan.bku}</span>
            <span>Lampiran: {ringkasan.lampiran}</span>
          </div>
        </div>
        <Field label={`Ketik kode TA (${ta.tahun}) untuk konfirmasi`} required><Input className="mono" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

// ============ TA Detail — Snapshot seksi, pemetaan, penugasan, delegasi, pengawas ============
function TADetailModal({ taId, onClose }: { taId: string; onClose: () => void }) {
  const [tab, setTab] = useState<'seksi' | 'penugasan' | 'pengawas' | 'delegasi'>('seksi');
  const ta = repo.tahunAnggaranById(taId)!;
  const isDraft = ta.status === 'Draft';
  const isArsip = ta.status === 'Arsip Read-Only';

  return (
    <Modal open onClose={onClose} title={`Detail TA ${ta.tahun} — ${ta.status}`} wider
      footer={<div className="flex justify-end"><Button variant="ghost" onClick={onClose}>Tutup</Button></div>}>
      <div className="flex flex-wrap gap-2 border-b border-ink-edge pb-2">
        {(['seksi', 'penugasan', 'pengawas', 'delegasi'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md border px-3 py-1.5 text-2xs ${tab === t ? 'border-amber/40 bg-amber/10 text-amber' : 'border-ink-edge text-mist-dim'}`}>
            {t === 'seksi' ? 'Snapshot Seksi' : t === 'penugasan' ? 'Penugasan' : t === 'pengawas' ? 'Pengawas' : 'Delegasi'}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {tab === 'seksi' && <SeksiTab taId={taId} isDraft={isDraft} isArsip={isArsip} />}
        {tab === 'penugasan' && <PenugasanTab taId={taId} isDraft={isDraft} isArsip={isArsip} />}
        {tab === 'pengawas' && <PengawasTab taId={taId} isDraft={isDraft} />}
        {tab === 'delegasi' && <DelegasiTab taId={taId} />}
      </div>
    </Modal>
  );
}

// ===== TA-04 — Snapshot seksi & pemetaan subkegiatan =====
function SeksiTab({ taId, isDraft, isArsip }: { taId: string; isDraft: boolean; isArsip: boolean }) {
  const [refresh, setRefresh] = useState(0);
  const [addSeksi, setAddSeksi] = useState(false);
  const seksi = repo.seksiTAByTA(taId);
  const sotkaAktif = repo.masterSOTK().filter((s) => s.status_versi === 'Aktif');

  return (
    <div className="space-y-3">
      {isDraft && (
        <Button onClick={() => setAddSeksi(true)}><Plus size={14} /> Tambah Seksi (Snapshot dari SOTK)</Button>
      )}
      {seksi.length === 0 ? (
        <EmptyState icon={<Building2 size={28} />} title="Belum ada seksi" desc={isDraft ? "Tambah seksi dari Master SOTK." : "TA ini tidak memiliki seksi."} />
      ) : (
        <div className="space-y-3">
          {seksi.map((s) => {
            const pems = repo.pemetaanBySeksi(s.id);
            return (
              <Card key={s.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-mist">{s.nama_snapshot}</span>
                    <span className="ml-2 text-2xs text-mist-dim">(snapshot dari Master SOTK)</span>
                  </div>
                  {isDraft && <button onClick={() => { repo.hapusSeksiTA(s.id); setRefresh((r) => r + 1); }} className="text-2xs text-crit hover:underline">Hapus</button>}
                </div>
                {pems.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-2xs text-mist-dim">Pemetaan Subkegiatan:</p>
                    {pems.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded border border-ink-edge bg-ink px-2 py-1 text-2xs">
                        <span className="mono text-mist">{p.kode_snapshot}</span>
                        <span className="text-mist-dim">{p.nama_snapshot}</span>
                        {isDraft && <button onClick={() => { repo.hapusPemetaan(p.id); setRefresh((r) => r + 1); }} className="text-2xs text-crit hover:underline">Lepas</button>}
                      </div>
                    ))}
                  </div>
                )}
                {isDraft && <AddPemetaanInline seksiId={s.id} taId={taId} onAdded={() => setRefresh((r) => r + 1)} />}
              </Card>
            );
          })}
        </div>
      )}
      {addSeksi && <AddSeksiModal taId={taId} onClose={() => setAddSeksi(false)} onSaved={() => { setAddSeksi(false); setRefresh((r) => r + 1); }} />}
      {refresh >= 0 && <span className="hidden" />}
    </div>
  );
}

function AddSeksiModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const [sotkaId, setSotkaId] = useState('');
  const [err, setErr] = useState('');
  const sotkaAktif = repo.masterSOTK().filter((s) => s.status_versi === 'Aktif');
  const save = () => {
    if (!sotkaId) return setErr('Pilih unit SOTK.');
    const r = repo.tambahSeksiTA(taId, sotkaId);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    recordAudit({ ta_id: taId, entitas: `Seksi TA`, aksi: 'aksi_administratif', nilai_sesudah: r.seksi!.nama_snapshot });
    onSaved();
  };
  return (
    <Modal open onClose={onClose} title="Tambah Seksi dari Master SOTK"
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Tambah</Button></div>}>
      <Field label="Unit Master SOTK" required>
        <Select value={sotkaId} onChange={(e) => setSotkaId(e.target.value)}>
          <option value="">— pilih —</option>
          {sotkaAktif.map((s) => <option key={s.id} value={s.id}>{s.nama_unit}</option>)}
        </Select>
      </Field>
      <p className="mt-3 text-2xs text-mist-dim">Nama unit disalin sebagai snapshot. Perubahan Master SOTK setelah ini tidak mengubah snapshot TA.</p>
    </Modal>
  );
}

function AddPemetaanInline({ seksiId, taId, onAdded }: { seksiId: string; taId: string; onAdded: () => void }) {
  const [subId, setSubId] = useState('');
  const [err, setErr] = useState('');
  const sudahDipetakan = repo.pemetaanByTA(taId).map((p) => p.subkegiatan_id);
  const subs = repo.masterSubkegiatan().filter((s) => s.status === 'Aktif' && !sudahDipetakan.includes(s.id));
  const add = () => {
    if (!subId) return setErr('Pilih subkegiatan.');
    const r = repo.tambahPemetaan(taId, seksiId, subId);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    setSubId(''); setErr('');
    onAdded();
  };
  return (
    <div className="mt-2 flex items-end gap-2">
      <Select value={subId} onChange={(e) => setSubId(e.target.value)} aria-label="Subkegiatan">
        <option value="">+ Petakan subkegiatan...</option>
        {subs.map((s) => <option key={s.id} value={s.id}>{s.kode} — {s.nama}</option>)}
      </Select>
      <Button variant="secondary" className="text-2xs" onClick={add}>Petakan</Button>
      {err && <span className="text-2xs text-crit">{err}</span>}
      {subs.length === 0 && <span className="text-2xs text-mist-dim">Semua subkegiatan aktif sudah dipetakan.</span>}
    </div>
  );
}

// ===== PEN-01/02/03/04 — Penugasan =====
function PenugasanTab({ taId, isDraft, isArsip }: { taId: string; isDraft: boolean; isArsip: boolean }) {
  const [refresh, setRefresh] = useState(0);
  const [addModal, setAddModal] = useState<{ peran: PeranPenugasan } | null>(null);
  const [skModal, setSkModal] = useState<{ penugasanId: string } | null>(null);
  const [gantiModal, setGantiModal] = useState<{ penugasanId: string } | null>(null);
  const tgs = [...repo.penugasanByTA(taId)].sort((a, b) => Number(a.tmt_selesai !== null) - Number(b.tmt_selesai !== null));
  const seksiTA = repo.seksiTAByTA(taId);

  return (
    <div className="space-y-3">
      {isDraft && (
        <div className="flex flex-wrap gap-2">
          {(['pa_kpa', 'bendahara', 'verifikator', 'pptk'] as PeranPenugasan[]).map((p) => (
            <Button key={p} variant="secondary" className="text-2xs" onClick={() => setAddModal({ peran: p })}>
              <Plus size={12} /> {peranLabel(p)}
            </Button>
          ))}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-ink-edge bg-ink-surface">
        <table className="w-full text-2xs">
          <TableHead columns={['Peran', 'Personel', 'Seksi', 'TMT', 'Status', 'SK', 'Aksi']} />
          <tbody>
            {tgs.map((t, i) => {
              const per = repo.personelById(t.personel_id);
              const acc = repo.akunByPersonel(t.personel_id);
              const sks = repo.skByPenugasan(t.id);
              const isNONACTIVE = acc?.status === 'NON-ACTIVE' && t.tmt_selesai === null;
              const isBerakhir = t.tmt_selesai !== null;
              return (
                <tr key={t.id} className={`${i % 2 ? 'bg-ink-surface/40' : ''} ${isBerakhir ? 'opacity-70' : ''}`}>
                  <td className="std-row px-4 text-mist capitalize">{peranLabel(t.peran)}</td>
                  <td className="std-row px-4 text-mist">{t.nama_snapshot} <span className="mono text-mist-dim">({t.nip_snapshot})</span></td>
                  <td className="std-row px-4 text-mist-dim">{t.seksi_ta_id ? repo.seksiTAById(t.seksi_ta_id)?.nama_snapshot ?? '—' : '— instansi —'}</td>
                  <td className="std-row px-4 mono text-mist-dim whitespace-nowrap">{formatTanggalPendek(t.tmt_mulai)} — {t.tmt_selesai ? formatTanggalPendek(t.tmt_selesai) : 'sekarang'}</td>
                  <td className="std-row px-4">
                    <div className="flex flex-col gap-1">
                      {isBerakhir
                        ? <StatusBadge kind="neutral" label="Berakhir" />
                        : t.provisional ? <StatusBadge kind="warn" label="Provisional" /> : <StatusBadge kind="ok" label="Final" />}
                      {isNONACTIVE && (
                        <span className="inline-flex items-center gap-1 text-2xs text-warn"><AlertTriangle size={12} /> NON-ACTIVE</span>
                      )}
                    </div>
                  </td>
                  <td className="std-row px-4 text-mist-dim">{sks.length > 0 ? sks.map((s) => s.nomor_sk).join(', ') : '—'}</td>
                  <td className="std-row px-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => setSkModal({ penugasanId: t.id })} className="rounded p-1 text-mist-dim hover:text-mist" title="Tambah SK"><FileText size={14} /></button>
                      {!isArsip && !isBerakhir && <button onClick={() => setGantiModal({ penugasanId: t.id })} className="rounded p-1 text-mist-dim hover:text-amber" title="Ganti Pejabat"><UserPlus size={14} /></button>}
                      {isDraft && !isBerakhir && <button onClick={() => { repo.hapusPenugasan(t.id); setRefresh((r) => r + 1); }} className="rounded p-1 text-mist-dim hover:text-crit" title="Hapus"><Trash2 size={14} /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {tgs.length === 0 && <EmptyState icon={<Users size={28} />} title="Belum ada penugasan" />}
      </div>
      {addModal && <AddPenugasanModal taId={taId} peran={addModal.peran} onClose={() => setAddModal(null)} onSaved={() => { setAddModal(null); setRefresh((r) => r + 1); }} />}
      {skModal && <SKModal penugasanId={skModal.penugasanId} onClose={() => setSkModal(null)} onSaved={() => { setSkModal(null); setRefresh((r) => r + 1); }} />}
      {gantiModal && <GantiPejabatModal penugasanId={gantiModal.penugasanId} taId={taId} onClose={() => setGantiModal(null)} onSaved={() => { setGantiModal(null); setRefresh((r) => r + 1); }} />}
      {refresh >= 0 && <span className="hidden" />}
    </div>
  );
}

function AddPenugasanModal({ taId, peran, onClose, onSaved }: { taId: string; peran: PeranPenugasan; onClose: () => void; onSaved: () => void }) {
  const [personelId, setPersonelId] = useState('');
  const [seksiId, setSeksiId] = useState('');
  const [tmt, setTmt] = useState(todayWita());
  const [provisional, setProvisional] = useState(false);
  const [err, setErr] = useState('');
  const personel = repo.masterPersonel();
  const seksiTA = repo.seksiTAByTA(taId);
  const needsSeksi = peran === 'pptk';

  const save = () => {
    if (!personelId) return setErr('Pilih personel.');
    if (needsSeksi && !seksiId) return setErr('PPTK wajib memiliki seksi.');
    const r = repo.tambahPenugasan(taId, peran, personelId, needsSeksi ? seksiId : null, tmt, provisional);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    const per = repo.personelById(personelId)!;
    recordAudit({ ta_id: taId, entitas: `Penugasan ${peranLabel(peran)}: ${per.nama}`, aksi: 'aksi_administratif', nilai_sesudah: `TMT ${tmt}${provisional ? ' (provisional)' : ''}` });
    onSaved();
  };

  return (
    <Modal open onClose={onClose} title={`Tambah Penugasan ${peranLabel(peran)}`}
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Tambah</Button></div>}>
      <div className="space-y-4">
        <Field label="Personel" required>
          <Select value={personelId} onChange={(e) => setPersonelId(e.target.value)}>
            <option value="">— pilih —</option>
            {personel.map((p) => <option key={p.id} value={p.id}>{[p.gelar_depan, p.nama, p.gelar_belakang].filter(Boolean).join(' ')}</option>)}
          </Select>
        </Field>
        {needsSeksi && (
          <Field label="Seksi" required>
            <Select value={seksiId} onChange={(e) => setSeksiId(e.target.value)}>
              <option value="">— pilih —</option>
              {seksiTA.map((s) => <option key={s.id} value={s.id}>{s.nama_snapshot}</option>)}
            </Select>
          </Field>
        )}
        <Field label="TMT Mulai" required><Input type="date" value={tmt} onChange={(e) => setTmt(e.target.value)} /></Field>
        <label className="flex items-center gap-2 text-2xs text-mist-dim">
          <input type="checkbox" checked={provisional} onChange={(e) => setProvisional(e.target.checked)} />
          Penugasan Provisional (SK dilengkapi kemudian)
        </label>
        <p className="text-2xs text-mist-dim">Jika sudah ada penugasan untuk peran+seksi yang sama, penugasan lama otomatis berakhir H-1 dari TMT baru (mutasi).</p>
      </div>
    </Modal>
  );
}

function GantiPejabatModal({ penugasanId, taId, onClose, onSaved }: { penugasanId: string; taId: string; onClose: () => void; onSaved: () => void }) {
  const penugasan = repo.penugasanByTA(taId).find((x) => x.id === penugasanId);
  const [personelId, setPersonelId] = useState('');
  const [tmt, setTmt] = useState(todayWita());
  const [err, setErr] = useState('');
  const personel = repo.masterPersonel();

  const save = () => {
    if (!personelId) return setErr('Pilih personel pengganti.');
    if (!tmt) return setErr('TMT pengganti wajib diisi.');
    const r = repo.gantiPejabatDefinitif(penugasanId, personelId, tmt);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    const per = repo.personelById(personelId)!;
    recordAudit({ ta_id: penugasan?.ta_id ?? null, entitas: `Ganti Pejabat: ${per.nama}`, aksi: 'aksi_administratif', nilai_sesudah: `TMT ${tmt}; penugasan lama berakhir H-1` });
    onSaved();
  };

  const pejabatLama = penugasan ? `${penugasan.nama_snapshot} (${penugasan.nip_snapshot})` : '—';
  const peranLama = penugasan ? peranLabel(penugasan.peran) : '—';

  return (
    <Modal open onClose={onClose} title="Ganti Pejabat Definitif"
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Ganti</Button></div>}>
      <div className="space-y-4">
        <div className="rounded-md border border-ink-edge bg-ink p-3 text-2xs">
          <p className="text-mist-dim">Pejabat lama</p>
          <p className="mt-0.5 text-mist">{peranLama}: {pejabatLama}</p>
        </div>
        <Field label="Personel Pengganti" required>
          <Select value={personelId} onChange={(e) => setPersonelId(e.target.value)}>
            <option value="">— pilih —</option>
            {personel.map((p) => <option key={p.id} value={p.id}>{[p.gelar_depan, p.nama, p.gelar_belakang].filter(Boolean).join(' ')}</option>)}
          </Select>
        </Field>
        <Field label="TMT Pengganti" required hint="Penugasan lama otomatis berakhir H-1 dari tanggal ini.">
          <Input type="date" value={tmt} onChange={(e) => setTmt(e.target.value)} />
        </Field>
        <p className="text-2xs text-mist-dim">Penugasan baru dibuat dengan personel pengganti. SK penugasan lama tetap tercatat.</p>
      </div>
    </Modal>
  );
}

function SKModal({ penugasanId, onClose, onSaved }: { penugasanId: string; onClose: () => void; onSaved: () => void }) {
  const [nomor, setNomor] = useState('');
  const [tanggal, setTanggal] = useState(todayWita());
  const [provisional, setProvisional] = useState(false);
  const [err, setErr] = useState('');
  const sks = repo.skByPenugasan(penugasanId);
  const save = () => {
    const r = repo.tambahSK(penugasanId, nomor, tanggal, null, provisional);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    recordAudit({ ta_id: null, entitas: `SK: ${nomor}`, aksi: 'aksi_administratif', nilai_sesudah: `Tanggal ${tanggal}${provisional ? ' (provisional)' : ' (final)'}` });
    setNomor(''); setProvisional(false);
    onSaved();
  };
  return (
    <Modal open onClose={onClose} title="Register SK" wide
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Tutup</Button></div>}>
      <div className="space-y-4">
        {sks.length > 0 && (
          <div className="space-y-1">
            <p className="text-2xs font-semibold text-mist">SK tercatat:</p>
            {sks.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded border border-ink-edge bg-ink px-2 py-1 text-2xs">
                <span className="mono text-mist">{s.nomor_sk}</span>
                <span className="text-mist-dim">{formatTanggalPendek(s.tanggal_sk)} {s.provisional && '(Provisional)'}</span>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-3 rounded-md border border-ink-edge bg-ink p-3">
          <p className="text-2xs font-semibold text-mist">Tambah SK</p>
          <Field label="Nomor SK" required><Input value={nomor} onChange={(e) => setNomor(e.target.value)} /></Field>
          <Field label="Tanggal SK" required><Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} /></Field>
          <label className="flex items-center gap-2 text-2xs text-mist-dim">
            <input type="checkbox" checked={provisional} onChange={(e) => setProvisional(e.target.checked)} />
            SK Provisional (berkas dilengkapi kemudian)
          </label>
          {err && <p className="text-2xs text-crit">{err}</p>}
          <Button onClick={save}><Plus size={14} /> Tambah SK</Button>
        </div>
        <p className="text-2xs text-mist-dim">SK lama tetap dapat dibuka setelah penugasan berakhir.</p>
      </div>
    </Modal>
  );
}

// ===== AKN-05 — Penugasan Pengawas per TA =====
function PengawasTab({ taId, isDraft }: { taId: string; isDraft: boolean }) {
  const [refresh, setRefresh] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const tps = repo.penugasanPengawasByTA(taId);

  return (
    <div className="space-y-3">
      {isDraft && <Button onClick={() => setAddModal(true)}><Plus size={14} /> Tugaskan Pengawas</Button>}
      <div className="overflow-x-auto rounded-lg border border-ink-edge bg-ink-surface">
        <table className="w-full text-2xs">
          <TableHead columns={['Pengawas', 'Instansi', 'Mulai', 'Akhir', 'Aksi']} />
          <tbody>
            {tps.map((t, i) => {
              const p = repo.pengawasById(t.pengawas_id);
              return (
                <tr key={t.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                  <td className="std-row px-4 text-mist">{p?.nama_lengkap ?? '—'}</td>
                  <td className="std-row px-4 text-mist-dim">{p?.instansi_asal ?? '—'}</td>
                  <td className="std-row px-4 mono text-mist-dim">{formatTanggalPendek(t.tanggal_mulai)}</td>
                  <td className="std-row px-4 mono text-mist-dim">{formatTanggalPendek(t.tanggal_akhir)}</td>
                  <td className="std-row px-4">{isDraft && <button onClick={() => { repo.hapusPengawasTA(t.id); setRefresh((r) => r + 1); }} className="text-2xs text-crit hover:underline">Hapus</button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {tps.length === 0 && <EmptyState icon={<ShieldCheck size={28} />} title="Belum ada Pengawas ditugaskan" />}
      </div>
      {addModal && <AddPengawasTAModal taId={taId} onClose={() => setAddModal(false)} onSaved={() => { setAddModal(false); setRefresh((r) => r + 1); }} />}
      {refresh >= 0 && <span className="hidden" />}
    </div>
  );
}

function AddPengawasTAModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const [pengawasId, setPengawasId] = useState('');
  const [mulai, setMulai] = useState(todayWita());
  const [akhir, setAkhir] = useState('');
  const [err, setErr] = useState('');
  const pengawas = repo.akunPengawas().filter((a) => a.status === 'ACTIVE');
  const save = () => {
    if (!pengawasId) return setErr('Pilih akun Pengawas.');
    if (!mulai || !akhir) return setErr('Tanggal mulai dan akhir wajib diisi.');
    const r = repo.tambahPengawasTA(taId, pengawasId, mulai, akhir);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    const p = repo.pengawasById(pengawasId)!;
    recordAudit({ ta_id: taId, entitas: `Penugasan Pengawas: ${p.nama_lengkap}`, aksi: 'aksi_administratif', nilai_sesudah: `Mulai ${mulai}, akhir ${akhir}` });
    onSaved();
  };
  return (
    <Modal open onClose={onClose} title="Tugaskan Pengawas ke TA"
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Tugaskan</Button></div>}>
      <div className="space-y-4">
        <Field label="Akun Pengawas" required>
          <Select value={pengawasId} onChange={(e) => setPengawasId(e.target.value)}>
            <option value="">— pilih —</option>
            {pengawas.map((p) => <option key={p.id} value={p.id}>{p.nama_lengkap} ({p.instansi_asal})</option>)}
          </Select>
        </Field>
        <Field label="Tanggal Mulai" required><Input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} /></Field>
        <Field label="Tanggal Akhir" required><Input type="date" value={akhir} onChange={(e) => setAkhir(e.target.value)} /></Field>
        <p className="text-2xs text-mist-dim">Tanpa seksi — cakupan seluruh seksi pada TA yang ditugaskan.</p>
      </div>
    </Modal>
  );
}

// ===== PEN-05/06/07 — Delegasi Plh./Plt. =====
function DelegasiTab({ taId }: { taId: string }) {
  const [refresh, setRefresh] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [cabutModal, setCabutModal] = useState<{ delegasiId: string } | null>(null);
  const allDelegasi = repo._allDelegasi(taId);

  return (
    <div className="space-y-3">
      <Button onClick={() => setAddModal(true)}><Plus size={14} /> Tetapkan Delegasi Plh./Plt.</Button>
      <div className="overflow-x-auto rounded-lg border border-ink-edge bg-ink-surface">
        <table className="w-full text-2xs">
          <TableHead columns={['Peran Digantikan', 'Plh./Plt.', 'Seksi', 'Rentang', 'Status', 'Aksi']} />
          <tbody>
            {allDelegasi.map((d, i) => {
              const def = repo.personelById(d.definitive_officer_id);
              const isAktif = d.status === 'Delegasi Aktif';
              return (
                <tr key={d.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                  <td className="std-row px-4 text-mist capitalize">Plh. {peranLabel(d.peran_digantikan)}</td>
                  <td className="std-row px-4 text-mist">{d.nama_snapshot} <span className="mono text-mist-dim">({d.nip_snapshot})</span></td>
                  <td className="std-row px-4 text-mist-dim">{d.seksi_ta_id ? repo.seksiTAById(d.seksi_ta_id)?.nama_snapshot ?? '—' : '— instansi —'}</td>
                  <td className="std-row px-4 mono text-mist-dim whitespace-nowrap">{formatTanggalPendek(d.tanggal_mulai)} — {formatTanggalPendek(d.tanggal_berakhir)}</td>
                  <td className="std-row px-4"><StatusBadge kind={d.status === 'Delegasi Aktif' ? 'warn' : d.status === 'Berakhir' ? 'neutral' : 'crit'} label={d.status} /></td>
                  <td className="std-row px-4">
                    {isAktif ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => setCabutModal({ delegasiId: d.id })} className="rounded p-1 text-mist-dim hover:text-crit" title="Cabut Dini"><XCircle size={14} /></button>
                      </div>
                    ) : <span className="text-2xs text-mist-dim">{d.alasan_pencabutan ?? '—'}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {allDelegasi.length === 0 && <EmptyState icon={<UserCog size={28} />} title="Belum ada delegasi" />}
      </div>
      {addModal && <AddDelegasiModal taId={taId} onClose={() => setAddModal(false)} onSaved={() => { setAddModal(false); setRefresh((r) => r + 1); }} />}
      {cabutModal && <CabutDelegasiModal delegasiId={cabutModal.delegasiId} taId={taId} onClose={() => setCabutModal(null)} onSaved={() => { setCabutModal(null); setRefresh((r) => r + 1); }} />}
      {refresh >= 0 && <span className="hidden" />}
    </div>
  );
}

function AddDelegasiModal({ taId, onClose, onSaved }: { taId: string; onClose: () => void; onSaved: () => void }) {
  const [personelId, setPersonelId] = useState('');
  const [peran, setPeran] = useState<PeranPenugasan>('pptk');
  const [seksiId, setSeksiId] = useState('');
  const [mulai, setMulai] = useState(todayWita());
  const [berakhir, setBerakhir] = useState('');
  const [definitiveId, setDefinitiveId] = useState('');
  const [err, setErr] = useState('');
  const personel = repo.masterPersonel();
  const seksiTA = repo.seksiTAByTA(taId);
  const tgs = repo.penugasanByTA(taId).filter((t) => t.tmt_selesai === null);

  // Tentukan pejabat definitif berdasar peran+seksi
  const definitifOptions = tgs.filter((t) => t.peran === peran && (peran !== 'pptk' || t.seksi_ta_id === seksiId));

  const save = () => {
    if (!personelId) return setErr('Pilih personel pengganti.');
    if (!mulai || !berakhir) return setErr('Tanggal mulai dan berakhir wajib diisi.');
    if (berakhir < mulai) return setErr('Tanggal berakhir tidak boleh mendahului tanggal mulai.');
    if (peran === 'pptk' && !seksiId) return setErr('PPTK wajib memiliki seksi.');
    if (!definitiveId) return setErr('Pilih pejabat definitif yang digantikan.');
    const r = repo.tambahDelegasi(taId, personelId, peran, peran === 'pptk' ? seksiId : null, mulai, berakhir, definitiveId);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    const per = repo.personelById(personelId)!;
    recordAudit({ ta_id: taId, entitas: `Delegasi: ${per.nama} → Plh. ${peranLabel(peran)}`, aksi: 'delegasi_tetapkan', nilai_sesudah: `Status: Delegasi Aktif, berlaku ${mulai} — ${berakhir}`, definitive_officer_id: definitiveId, delegate_officer_id: personelId });
    onSaved();
  };

  return (
    <Modal open onClose={onClose} title="Tetapkan Delegasi Plh./Plt." wide
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Tetapkan</Button></div>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Peran yang Digantikan" required>
          <Select value={peran} onChange={(e) => { setPeran(e.target.value as PeranPenugasan); setDefinitiveId(''); }}>
            {(['bendahara', 'pptk', 'pa_kpa'] as PeranPenugasan[]).map((p) => <option key={p} value={p}>{peranLabel(p)}</option>)}
          </Select>
        </Field>
        {peran === 'pptk' && (
          <Field label="Seksi" required>
            <Select value={seksiId} onChange={(e) => { setSeksiId(e.target.value); setDefinitiveId(''); }}>
              <option value="">— pilih —</option>
              {seksiTA.map((s) => <option key={s.id} value={s.id}>{s.nama_snapshot}</option>)}
            </Select>
          </Field>
        )}
        <Field label="Pejabat Definitif yang Digantikan" required>
          <Select value={definitiveId} onChange={(e) => setDefinitiveId(e.target.value)}>
            <option value="">— pilih —</option>
            {definitifOptions.map((t) => { const p = repo.personelById(t.personel_id)!; return <option key={t.id} value={t.personel_id}>{[p.gelar_depan, p.nama, p.gelar_belakang].filter(Boolean).join(' ')}</option>; })}
          </Select>
        </Field>
        <Field label="Personel Pengganti (Plh./Plt.)" required>
          <Select value={personelId} onChange={(e) => setPersonelId(e.target.value)}>
            <option value="">— pilih —</option>
            {personel.map((p) => <option key={p.id} value={p.id}>{[p.gelar_depan, p.nama, p.gelar_belakang].filter(Boolean).join(' ')}</option>)}
          </Select>
        </Field>
        <Field label="Tanggal Mulai" required><Input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} /></Field>
        <Field label="Tanggal Berakhir" required hint="Berakhir otomatis 23:59 WITA"><Input type="date" value={berakhir} onChange={(e) => setBerakhir(e.target.value)} /></Field>
      </div>
      <p className="mt-3 text-2xs text-mist-dim">Selama delegasi aktif, hak transaksi pejabat definitif nonaktif. Penugasan definitif tetap tercatat.</p>
    </Modal>
  );
}

function CabutDelegasiModal({ delegasiId, taId, onClose, onSaved }: { delegasiId: string; taId: string; onClose: () => void; onSaved: () => void }) {
  const [alasan, setAlasan] = useState('');
  const [err, setErr] = useState('');
  const save = () => {
    if (!alasan.trim()) return setErr('Alasan pencabutan dini wajib diisi.');
    const r = repo.cabutDelegasi(delegasiId, alasan);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    // find delegasi for audit fields
    const d = repo._allDelegasi(taId).find((x) => x.id === delegasiId);
    recordAudit({ ta_id: taId, entitas: `Delegasi: ${d?.nama_snapshot ?? 'Plh./Plt.'}`, aksi: 'delegasi_pencabutan_dini', nilai_sesudah: 'Status: Dicabut (dari Delegasi Aktif)', alasan: alasan.trim(), definitive_officer_id: d?.definitive_officer_id, delegate_officer_id: d?.personel_pengganti_id });
    onSaved();
  };
  return (
    <Modal open onClose={onClose} title="Cabut Delegasi Dini"
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button variant="danger" onClick={save}>Cabut</Button></div>}>
      <Field label="Alasan Pencabutan Dini" required hint="Wajib alasan tertulis, tercatat di Jejak Audit"><Input value={alasan} onChange={(e) => setAlasan(e.target.value)} /></Field>
    </Modal>
  );
}

// ============ Helper ============
function PageHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-mist">{title}</h2>
      {desc && <p className="mt-0.5 text-2xs text-mist-dim">{desc}</p>}
    </div>
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

function peranLabel(p: string): string {
  switch (p) {
    case 'pa_kpa': return 'PA/KPA';
    case 'bendahara': return 'Bendahara';
    case 'verifikator': return 'Verifikator';
    case 'pptk': return 'PPTK';
    default: return p;
  }
}
