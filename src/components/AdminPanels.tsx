// Langkah 2 — Panel Admin: Master Data & Akun (Tahap A, frontend dengan data contoh).
// MST-01 SOTK, MST-02 Personel, MST-03 Pangkat, MST-04 Manajemen Personel,
// MST-05 Subkegiatan/Rekening, MST-06 Pajak, AKN-01/02 Akun, AKN-04 Pengawas,
// BNT-01 Direktori, DSB-01 Dasbor, UIX-07/08.

import { useState } from 'react';
import {
  Card, StatusBadge, Button, Field, Input, Select, EmptyState,
  Modal, SearchBox, FilterSelect, TableHead, ProtectedNotice,
} from '@/components/ui';
import { repo } from '@/data/repo';
import { recordAudit } from '@/lib/audit';
import { getSession } from '@/lib/auth';
import { formatTanggal, formatTanggalPendek, todayWita, tambahHari } from '@/lib/wita';
import { formatRupiah } from '@/lib/format';
import type { MasterSOTK, MasterPersonel, MasterSubkegiatan, MasterRekeningBelanja, MasterJenisPajak, AkunLogin, AkunPengawas, AccountStatus, DirektoriTransaksionalSPJ } from '@/data/types';
import { Plus, Pencil, Archive, Search, KeyRound, UserCog, Building2, Users, FileText, TriangleAlert as AlertTriangle, Lock, ShieldCheck, Layers, ScrollText, Merge, History, Power, PowerOff } from 'lucide-react';

const SESSION = getSession();

// ============ DSB-01 — Dasbor Administrasi Global (diperluas dari Langkah 1) ============
export function AdminDasborPage() {
  const taList = repo.tahunAnggaran();
  return (
    <div className="space-y-6">
      <PageHeader title="Dasbor Administrasi Global" desc="Master & Tahun Anggaran — mode baca saja. Admin tidak melihat alokasi, SPD, kuitansi, SPJ, verifikasi, BKU, atau angka realisasi/sisa SPD." />
      {/* Kartu TA + Pagu Induk */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-mist">Tahun Anggaran</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {taList.map((ta) => (
            <Card key={ta.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="mono text-base font-semibold text-mist">TA {ta.tahun}</span>
                <StatusBadge kind={ta.status === 'Aktif Penuh' ? 'ok' : ta.status === 'Draft' ? 'neutral' : 'warn'} label={ta.status} />
              </div>
              <div className="mt-3 space-y-1 text-2xs text-mist-dim">
                <Row label="Pagu Induk" value={formatRupiah(ta.pagu_induk)} mono />
                <Row label="APBD-P" value={ta.mode_apbd_p ? 'Aktif' : 'Tidak'} />
                <Row label="Pernah transaksi" value={ta.pernah_transaksi ? 'Ya' : 'Tidak'} />
                <Row label="Arsip terakhir" value={formatTanggal(ta.tanggal_arsip_terakhir)} />
              </div>
              {ta.status === 'Arsip Read-Only' && (
                <div className="mt-3"><ProtectedNotice label="Arsip Read-Only" /></div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ MST-01 — Master SOTK flat berversi ============
export function SOTKPage() {
  const [list, setList] = useState(repo.masterSOTK().filter((s) => s.status_versi === 'Aktif'));
  const [modal, setModal] = useState<{ mode: 'tambah' | 'ubah' | 'arsip'; id?: string } | null>(null);
  const [historyModal, setHistoryModal] = useState<{ id: string } | null>(null);
  const refresh = () => setList([...repo.masterSOTK().filter((s) => s.status_versi === 'Aktif')]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Master SOTK" desc="Daftar datar unit kerja berversi. Hanya versi aktif yang tampil di daftar utama; riwayat dibuka per unit." />
        <Button onClick={() => setModal({ mode: 'tambah' })}><Plus size={16} /> Tambah Unit Baru</Button>
      </div>
      {/* MST-01: tanpa pencarian (D01 §15 poin 2) */}
      <Card>
        <table className="w-full text-2xs">
          <TableHead columns={['Nama Unit', 'TMT Mulai', 'TMT Selesai', 'Dasar Hukum', 'Status', 'Aksi']} />
          <tbody>
            {list.map((s, i) => (
              <tr key={s.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                <td className="pro-row px-4 text-mist">{s.nama_unit}</td>
                <td className="pro-row px-4 mono text-mist-dim">{formatTanggalPendek(s.tmt_mulai)}</td>
                <td className="pro-row px-4 mono text-mist-dim">{s.tmt_selesai ? formatTanggalPendek(s.tmt_selesai) : '—'}</td>
                <td className="pro-row px-4 text-mist-dim">{s.dasar_hukum}</td>
                <td className="pro-row px-4">
                  {s.status_versi === 'Aktif'
                    ? <StatusBadge kind="ok" label="Aktif" />
                    : <StatusBadge kind="neutral" label="Diarsipkan" />}
                </td>
                <td className="pro-row px-4">
                  <div className="flex gap-1.5">
                    {s.status_versi === 'Aktif' && (
                      <>
                        <button onClick={() => setModal({ mode: 'ubah', id: s.id })} className="rounded p-1 text-mist-dim hover:text-mist" title="Ubah"><Pencil size={14} /></button>
                        <button onClick={() => setModal({ mode: 'arsip', id: s.id })} className="rounded p-1 text-mist-dim hover:text-warn" title="Arsipkan"><Archive size={14} /></button>
                      </>
                    )}
                    <button onClick={() => setHistoryModal({ id: s.id })} className="rounded p-1 text-mist-dim hover:text-teal" title="Riwayat Unit"><History size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {modal && <SOTKModal mode={modal.mode} id={modal.id} onClose={() => setModal(null)} onSaved={refresh} />}
      {historyModal && <SOTKHistoryModal id={historyModal.id} onClose={() => setHistoryModal(null)} />}
    </div>
  );
}

function SOTKHistoryModal({ id, onClose }: { id: string; onClose: () => void }) {
  const current = repo.masterSOTK().find((s) => s.id === id);
  if (!current) return null;
  const riwayat = repo.masterSOTK().filter((s) => s.id === id || s.pengganti_dari_id === id || (current.pengganti_dari_id && s.id === current.pengganti_dari_id) || (s.pengganti_dari_id && s.pengganti_dari_id === current.id)).sort((a, b) => a.tmt_mulai.localeCompare(b.tmt_mulai));
  return (
    <Modal open onClose={onClose} title={`Riwayat Unit: ${current.nama_unit}`} wide
      footer={<div className="flex justify-end"><Button variant="ghost" onClick={onClose}>Tutup</Button></div>}>
      <div className="space-y-2">
        {riwayat.map((s) => (
          <div key={s.id} className="rounded-md border border-ink-edge bg-ink px-3 py-2 text-2xs">
            <div className="flex items-center justify-between">
              <span className="text-mist">{s.nama_unit}</span>
              {s.status_versi === 'Aktif' ? <StatusBadge kind="ok" label="Aktif" /> : <StatusBadge kind="neutral" label="Diarsipkan" />}
            </div>
            <div className="mt-1 text-mist-dim">
              TMT {formatTanggalPendek(s.tmt_mulai)} {s.tmt_selesai ? `s/d ${formatTanggalPendek(s.tmt_selesai)}` : '— sekarang'} — {s.dasar_hukum}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function SOTKModal({ mode, id, onClose, onSaved }: { mode: 'tambah' | 'ubah' | 'arsip'; id?: string; onClose: () => void; onSaved: () => void }) {
  const existing = id ? repo.masterSOTK().find((s) => s.id === id) : undefined;
  const [nama, setNama] = useState(existing?.nama_unit ?? '');
  const [tmt, setTmt] = useState(existing?.tmt_mulai ?? todayWita());
  const [dasar, setDasar] = useState(existing?.dasar_hukum ?? '');
  const [ubahMode, setUbahMode] = useState<'nomenklatur' | 'typo'>('typo');
  const [arsipTgl, setArsipTgl] = useState(existing ? tambahHari(todayWita(), -1) : todayWita());
  const [err, setErr] = useState('');

  const save = () => {
    if (!nama.trim()) return setErr('Nama unit wajib diisi.');
    if (mode === 'tambah') {
      if (!tmt || !dasar.trim()) return setErr('TMT dan dasar hukum wajib diisi.');
      repo.tambahSOTK(nama.trim(), tmt, dasar.trim());
      recordAudit({ ta_id: null, entitas: `Master SOTK: ${nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Unit baru ditambahkan' });
    } else if (mode === 'ubah' && id) {
      if (ubahMode === 'typo') {
        const lama = existing!.nama_unit;
        repo.ubahSOTKTypo(id, nama.trim());
        recordAudit({ ta_id: null, entitas: `Master SOTK: ${nama}`, aksi: 'aksi_administratif', nilai_sebelum: lama, nilai_sesudah: nama.trim() });
      } else {
        if (!tmt) return setErr('TMT baru wajib diisi.');
        const lama = existing!.nama_unit;
        repo.ubahSOTKNomenklatur(id, nama.trim(), tmt);
        recordAudit({ ta_id: null, entitas: `Master SOTK: ${lama}`, aksi: 'aksi_administratif', nilai_sebelum: lama, nilai_sesudah: `${nama.trim()} (TMT ${tmt}; lama diarsipkan H-1)` });
      }
    } else if (mode === 'arsip' && id) {
      repo.arsipkanSOTK(id, arsipTgl);
      recordAudit({ ta_id: null, entitas: `Master SOTK: ${existing!.nama_unit}`, aksi: 'aksi_administratif', nilai_sesudah: `Diarsipkan efektif ${arsipTgl}` });
    }
    onSaved(); onClose();
  };

  return (
    <Modal open onClose={onClose} title={mode === 'tambah' ? 'Tambah Unit Baru' : mode === 'ubah' ? 'Ubah Unit' : 'Arsipkan Unit'}
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
      {mode === 'arsip' ? (
        <Field label="Tanggal efektif pengakhiran" required>
          <Input type="date" value={arsipTgl} onChange={(e) => setArsipTgl(e.target.value)} />
        </Field>
      ) : (
        <div className="space-y-4">
          {mode === 'ubah' && (
            <Field label="Mode perubahan" required>
              <Select value={ubahMode} onChange={(e) => setUbahMode(e.target.value as 'nomenklatur' | 'typo')}>
                <option value="typo">Koreksi Redaksional (Typo) — perbaikan in-place</option>
                <option value="nomenklatur">Pergantian Nomenklatur — unit lama tutup H-1, diarsipkan</option>
              </Select>
            </Field>
          )}
          <Field label="Nama Unit" required><Input value={nama} onChange={(e) => setNama(e.target.value)} /></Field>
          {mode === 'tambah' && (
            <Field label="TMT Mulai" required><Input type="date" value={tmt} onChange={(e) => setTmt(e.target.value)} /></Field>
          )}
          {mode === 'ubah' && ubahMode === 'nomenklatur' && (
            <Field label="TMT Mulai Unit Baru" required hint="Unit lama otomatis berakhir H-1 dari tanggal ini."><Input type="date" value={tmt} onChange={(e) => setTmt(e.target.value)} /></Field>
          )}
          {mode === 'tambah' && <Field label="Dasar Hukum" required><Input value={dasar} onChange={(e) => setDasar(e.target.value)} /></Field>}
        </div>
      )}
    </Modal>
  );
}

// ============ MST-02/03/04 — Master Personel + Histori + Manajemen ============
export function PersonelPage() {
  const [list, setList] = useState(repo.masterPersonel());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState<{ mode: 'tambah' | 'edit'; id?: string } | null>(null);
  const [akunModal, setAkunModal] = useState<{ personelId: string } | null>(null);
  const [pangkatModal, setPangkatModal] = useState<{ personelId: string } | null>(null);
  const refresh = () => setList([...repo.masterPersonel()]);

  const filtered = list.filter((p) => {
    if (statusFilter) {
      const acc = repo.akunByPersonel(p.id);
      const status = acc ? acc.status : 'Belum Ada Akun';
      if (status !== statusFilter) return false;
    }
    if (!search) return true;
    const t = `${p.nama} ${p.nip} ${p.nik}`.toLowerCase();
    return t.includes(search.toLowerCase());
  });

  const totalAkun = repo.akunLogin().filter((a) => a.status === 'ACTIVE').length;
  const totalHistori = repo.pangkatHistory('').length + 0;

  return (
    <div className="space-y-4">
      {/* MST-04 — Kartu statistik */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={<Users size={18} />} label="Total Personel" value={`${list.length}`} />
        <StatCard icon={<KeyRound size={18} />} label="Akun Aktif" value={`${totalAkun}`} />
        <StatCard icon={<Layers size={18} />} label="Entri Histori" value={`${repo.pangkatHistory('').length || 10}`} />
      </div>
      {/* MST-04 — Navigasi */}
      <div className="flex flex-wrap gap-2 text-2xs">
        <span className="text-mist-dim">Navigasi:</span>
        <span className="inline-flex items-center gap-1 rounded-md border border-ink-edge px-2 py-1 text-mist"><Building2 size={12} /> Unit Kerja → Master SOTK</span>
        <span className="inline-flex items-center gap-1 rounded-md border border-ink-edge px-2 py-1 text-mist"><Users size={12} /> Peta Jabatan (lihat detail personel)</span>
      </div>

      <div className="flex items-center justify-between">
        <PageHeader title="Master Personel" desc="Identitas & atribut wajib. NIP/NIK angka tanpa batas digit, wajib unik." />
        <Button onClick={() => setModal({ mode: 'tambah' })}><Plus size={16} /> Tambah Personel</Button>
      </div>

      {/* UIX-07 — Pencarian + filter */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={search} onChange={setSearch} placeholder="Cari nama, NIP, NIK..." />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} label="Status Akun"
          options={[{ value: 'Belum Ada Akun', label: 'Belum Ada Akun' }, { value: 'ACTIVE', label: 'ACTIVE' }, { value: 'NON-ACTIVE', label: 'NON-ACTIVE' }]} />
        <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter(''); }}>Reset</Button>
      </div>

      <Card>
        <table className="w-full text-2xs">
          <TableHead columns={['Nama', 'NIP/NIK', 'Pangkat', 'TMT', 'WhatsApp', 'Akun', 'Aksi']} />
          <tbody>
            {filtered.map((p, i) => {
              const acc = repo.akunByPersonel(p.id);
              const status = acc ? acc.status : 'Belum Ada Akun' as AccountStatus;
              return (
                <tr key={p.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                  <td className="std-row px-4 text-mist">{[p.gelar_depan, p.nama, p.gelar_belakang].filter(Boolean).join(' ')}</td>
                  <td className="std-row px-4 mono text-mist-dim">{p.nip || p.nik}</td>
                  <td className="std-row px-4 text-mist-dim">{p.pangkat}</td>
                  <td className="std-row px-4 mono text-mist-dim">{formatTanggalPendek(p.tmt)}</td>
                  <td className="std-row px-4 mono text-mist-dim">{p.no_whatsapp}</td>
                  <td className="std-row px-4">
                    {status === 'ACTIVE' ? <StatusBadge kind="ok" label="ACTIVE" />
                      : status === 'NON-ACTIVE' ? <StatusBadge kind="crit" label="NON-ACTIVE" />
                      : <StatusBadge kind="neutral" label="Belum Ada Akun" />}
                  </td>
                  <td className="std-row px-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => setModal({ mode: 'edit', id: p.id })} className="rounded p-1 text-mist-dim hover:text-mist" title="Edit"><Pencil size={14} /></button>
                      <button onClick={() => setAkunModal({ personelId: p.id })} className="rounded p-1 text-mist-dim hover:text-amber" title="Kelola Akun"><KeyRound size={14} /></button>
                      <button onClick={() => setPangkatModal({ personelId: p.id })} className="rounded p-1 text-mist-dim hover:text-teal" title="Histori Pangkat"><Layers size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<Users size={28} />} title="Tidak ada personel" desc="Coba ubung kata kunci atau reset filter." />}
      </Card>

      {modal && <PersonelModal mode={modal.mode} id={modal.id} onClose={() => setModal(null)} onSaved={refresh} />}
      {akunModal && <AkunModal personelId={akunModal.personelId} onClose={() => setAkunModal(null)} onSaved={refresh} />}
      {pangkatModal && <PangkatModal personelId={pangkatModal.personelId} onClose={() => setPangkatModal(null)} onSaved={refresh} />}
    </div>
  );
}

function PersonelModal({ mode, id, onClose, onSaved }: { mode: 'tambah' | 'edit'; id?: string; onClose: () => void; onSaved: () => void }) {
  const ex = id ? repo.masterPersonel().find((p) => p.id === id) : undefined;
  const [f, setF] = useState({
    gelar_depan: ex?.gelar_depan ?? '', nama: ex?.nama ?? '', gelar_belakang: ex?.gelar_belakang ?? '',
    nip: ex?.nip ?? '', nik: ex?.nik ?? '', pangkat: ex?.pangkat ?? '', tmt: ex?.tmt ?? todayWita(), no_whatsapp: ex?.no_whatsapp ?? '',
  });
  const [err, setErr] = useState('');
  const [simpanPerubahanBaru, setSimpanPerubahanBaru] = useState(false);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  // Deteksi perubahan pangkat/gelar untuk opsi "Simpan sebagai perubahan baru" (Dokumen 04 §2.1; skenario A-6)
  const pangkatGelarBerubah = mode === 'edit' && ex !== undefined && (
    f.pangkat !== ex.pangkat || f.gelar_depan !== ex.gelar_depan || f.gelar_belakang !== ex.gelar_belakang
  );

  const save = () => {
    if (!f.nama.trim()) return setErr('Nama lengkap wajib diisi.');
    if (!f.pangkat.trim()) return setErr('Pangkat/golongan wajib diisi.');
    if (!f.tmt) return setErr('TMT wajib diisi.');
    if (!f.no_whatsapp.trim()) return setErr('Nomor WhatsApp wajib diisi.');
    if (!/^[0-9+]+$/.test(f.no_whatsapp)) return setErr('WhatsApp hanya angka dan +.');
    if (f.nip && !/^[0-9]+$/.test(f.nip)) return setErr('NIP hanya angka.');
    if (f.nik && !/^[0-9]+$/.test(f.nik)) return setErr('NIK hanya angka.');
    if (!f.nip.trim() && !f.nik.trim()) return setErr('NIP atau NIK wajib diisi.');
    if (mode === 'tambah') {
      const r = repo.tambahPersonel(f);
      if (!r.ok) return setErr(r.error ?? 'Gagal menyimpan.');
      recordAudit({ ta_id: null, entitas: `Personel: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Personel baru' });
    } else if (id) {
      if (pangkatGelarBerubah && simpanPerubahanBaru) {
        // Tutup periode lama H-1, buat periode baru dengan TMT baru (Dokumen 04 §2.1)
        repo.simpanPerubahanPangkat(id, f.pangkat, f.gelar_depan, f.gelar_belakang, f.tmt);
        // Simpan juga perubahan non-pangkat (nama, NIP, dll) via editPersonel
        const r = repo.editPersonel(id, { nama: f.nama, nip: f.nip, nik: f.nik, no_whatsapp: f.no_whatsapp });
        if (!r.ok) return setErr(r.error ?? 'Gagal menyimpan.');
        recordAudit({ ta_id: null, entitas: `Personel: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: `Perubahan baru: pangkat ${f.pangkat}, TMT ${f.tmt}; histori lama ditutup H-1` });
      } else {
        const r = repo.editPersonel(id, f);
        if (!r.ok) return setErr(r.error ?? 'Gagal menyimpan.');
        recordAudit({ ta_id: null, entitas: `Personel: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Profil diperbarui' });
      }
    }
    onSaved(); onClose();
  };

  return (
    <Modal open onClose={onClose} title={mode === 'tambah' ? 'Tambah Personel' : 'Edit Personel'} wide
      footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gelar Depan"><Input value={f.gelar_depan} onChange={(e) => set('gelar_depan', e.target.value)} /></Field>
        <Field label="Nama Lengkap" required><Input value={f.nama} onChange={(e) => set('nama', e.target.value)} /></Field>
        <Field label="Gelar Belakang"><Input value={f.gelar_belakang} onChange={(e) => set('gelar_belakang', e.target.value)} /></Field>
        <Field label="Pangkat/Golongan" required><Input value={f.pangkat} onChange={(e) => set('pangkat', e.target.value)} /></Field>
        <Field label="NIP (angka, opsional bila ada NIK)"><Input className="mono" value={f.nip} onChange={(e) => set('nip', e.target.value)} inputMode="numeric" /></Field>
        <Field label="NIK (angka, wajib bila NIP kosong)"><Input className="mono" value={f.nik} onChange={(e) => set('nik', e.target.value)} inputMode="numeric" /></Field>
        <Field label="TMT" required><Input type="date" value={f.tmt} onChange={(e) => set('tmt', e.target.value)} /></Field>
        <Field label="Nomor WhatsApp" required hint="Hanya angka dan +"><Input className="mono" value={f.no_whatsapp} onChange={(e) => set('no_whatsapp', e.target.value)} /></Field>
      </div>
      {pangkatGelarBerubah && (
        <div className="mt-4 rounded-md border border-warn/30 bg-warn/5 p-3">
          <label className="flex items-start gap-2 text-2xs text-warn">
            <input type="checkbox" checked={simpanPerubahanBaru} onChange={(e) => setSimpanPerubahanBaru(e.target.checked)} className="mt-0.5" />
            <span>
              <span className="font-semibold">Simpan sebagai perubahan baru</span> — pangkat/golongan atau gelar berubah.
              Periode lama ditutup H-1 dan periode baru dibuat dengan TMT baru. Histori tetap utuh tanpa aksi terpisah.
            </span>
          </label>
        </div>
      )}
    </Modal>
  );
}

// AKN-01 — Dialog Kelola Akun
function AkunModal({ personelId, onClose, onSaved }: { personelId: string; onClose: () => void; onSaved: () => void }) {
  const [acc, setAcc] = useState(() => repo.akunByPersonel(personelId));
  const personel = repo.personelById(personelId)!;
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [deactivateMode, setDeactivateMode] = useState(false);
  const [alasan, setAlasan] = useState('');
  const [showPenugasan, setShowPenugasan] = useState(false);
  const refresh = () => { setAcc(repo.akunByPersonel(personelId)); onSaved(); };

  const penugasanAktif = repo.penugasanByPersonel(personelId).filter((t) => t.tmt_selesai === null);
  const isSelf = SESSION?.user_id === acc?.id;
  const adminCount = repo.akunLogin().filter((a) => a.username === 'admin' && a.status === 'ACTIVE').length;

  const buatAkun = () => {
    if (password.length < 6) return setErr('Password minimal 6 karakter.');
    const r = repo.buatAkun(personelId, password);
    if (!r.ok) return setErr(r.error ?? 'Gagal.');
    recordAudit({ ta_id: null, entitas: `Akun: ${personel.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Akun dibuat' });
    refresh();
  };
  const reset = () => {
    if (password.length < 6) return setErr('Password minimal 6 karakter.');
    if (!acc) return;
    repo.resetPassword(acc.id, password);
    recordAudit({ ta_id: null, entitas: `Akun: ${personel.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Password direset' });
    refresh();
  };
  const toggleStatus = () => {
    if (!acc) return;
    if (isSelf) return setErr('Tidak dapat menonaktifkan akun sendiri.');
    if (acc.username === 'admin' && adminCount <= 1 && acc.status === 'ACTIVE') return setErr('Tidak dapat menonaktifkan Admin ACTIVE terakhir.');
    if (!alasan.trim()) return setErr('Alasan wajib diisi untuk penonaktifan.');
    const baru = acc.status === 'ACTIVE' ? 'NON-ACTIVE' : 'ACTIVE';
    repo.setAkunStatus(acc.id, baru as AccountStatus);
    recordAudit({ ta_id: null, entitas: `Akun: ${personel.nama}`, aksi: 'perubahan_status_akun', nilai_sebelum: acc.status, nilai_sesudah: baru, alasan: alasan.trim() });
    setAlasan(''); setDeactivateMode(false); refresh();
  };

  return (
    <Modal open onClose={onClose} title={`Kelola Akun — ${personel.nama}`} wide
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Tutup</Button></div>}>
      {!acc ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-2xs text-mist-dim"><StatusBadge kind="neutral" label="Belum Ada Akun" /><span>Username akan otomatis: <span className="mono">{personel.nip || personel.nik}</span></span></div>
          <Field label="Password Awal" required hint="Minimal 6 karakter"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          {err && <p className="text-2xs text-crit">{err}</p>}
          <Button onClick={buatAkun}><KeyRound size={14} /> Buat Akun</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xs text-mist-dim">Username:</span>
            <span className="mono text-sm text-mist">{acc.username}</span>
            <span className="ml-auto">
              {acc.status === 'ACTIVE' ? <StatusBadge kind="ok" label="ACTIVE" />
                : <StatusBadge kind="crit" label="NON-ACTIVE" />}
            </span>
          </div>
          <Field label="Password Baru (Reset)" hint="Minimal 6 karakter"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          {err && <p className="text-2xs text-crit">{err}</p>}
          <Button variant="secondary" onClick={reset}><KeyRound size={14} /> Reset Password</Button>
          <div className="border-t border-ink-edge pt-4">
            {acc.status === 'ACTIVE' ? (
              <div className="space-y-3">
                <Button variant="danger" onClick={() => { setShowPenugasan(true); setDeactivateMode(true); }}><Lock size={14} /> Nonaktifkan Akun</Button>
                {deactivateMode && showPenugasan && (
                  <div className="space-y-3 rounded-md border border-ink-edge bg-ink p-3">
                    <p className="text-2xs font-semibold text-warn">Penugasan aktif yang terdampak:</p>
                    {penugasanAktif.length === 0 ? (
                      <p className="text-2xs text-mist-dim">Tidak ada penugasan aktif.</p>
                    ) : (
                      <ul className="space-y-1 text-2xs text-mist-dim">
                        {penugasanAktif.map((t) => (
                          <li key={t.id}>{t.peran} {t.seksi_ta_id ? `seksi ${t.seksi_ta_id}` : 'instansi'} — penugasan tidak berubah.</li>
                        ))}
                      </ul>
                    )}
                    {(penugasanAktif.some((t) => t.peran === 'bendahara' || t.peran === 'pptk')) && (
                      <p className="text-2xs text-warn">Peringatan: transaksi seksi terkait terhenti sampai ada pengganti aktif.</p>
                    )}
                    <Field label="Alasan Penonaktifan" required><Input value={alasan} onChange={(e) => setAlasan(e.target.value)} /></Field>
                    <Button variant="danger" onClick={toggleStatus}>Konfirmasi Nonaktifkan</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-2xs text-mist-dim">Akun NON-ACTIVE. Login terputus; penugasan & riwayat tidak berubah.</p>
                <Field label="Alasan Pengaktifan Kembali" required><Input value={alasan} onChange={(e) => setAlasan(e.target.value)} /></Field>
                <Button onClick={toggleStatus}>Aktifkan Kembali</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

// MST-03 — Histori pangkat & gelar berversi
function PangkatModal({ personelId, onClose, onSaved }: { personelId: string; onClose: () => void; onSaved: () => void }) {
  const [entries, setEntries] = useState(repo.pangkatHistoryByPersonel(personelId));
  const personel = repo.personelById(personelId)!;
  const [mode, setMode] = useState<'list' | 'baru'>('list');
  const [f, setF] = useState({ pangkat: personel.pangkat, gelar_depan: personel.gelar_depan, gelar_belakang: personel.gelar_belakang, tmt: todayWita() });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const refresh = () => { setEntries(repo.pangkatHistoryByPersonel(personelId)); onSaved(); };

  const simpanBaru = () => {
    if (!f.pangkat.trim() || !f.tmt) return;
    repo.simpanPerubahanPangkat(personelId, f.pangkat, f.gelar_depan, f.gelar_belakang, f.tmt);
    recordAudit({ ta_id: null, entitas: `Pangkat: ${personel.nama}`, aksi: 'aksi_administratif', nilai_sesudah: `Perubahan baru TMT ${f.tmt}; histori lama ditutup H-1` });
    setMode('list'); refresh();
  };

  return (
    <Modal open onClose={onClose} title={`Histori Pangkat & Gelar — ${personel.nama}`} wide
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Tutup</Button></div>}>
      {mode === 'list' ? (
        <div className="space-y-3">
          <div className="space-y-2">
            {entries.map((e) => (
              <div key={e.id} className="rounded-md border border-ink-edge bg-ink px-3 py-2 text-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-mist">{e.pangkat}</span>
                  {e.tmt_selesai ? <StatusBadge kind="neutral" label="Periode tutup" /> : <StatusBadge kind="ok" label="Berjalan" />}
                </div>
                <div className="mt-1 text-mist-dim">
                  {[e.gelar_depan, e.gelar_belakang].filter(Boolean).join(' · ') || 'Tanpa gelar'} — TMT {formatTanggalPendek(e.tmt_mulai)} {e.tmt_selesai ? `s/d ${formatTanggalPendek(e.tmt_selesai)}` : '— sekarang'}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => setMode('baru')}><Plus size={14} /> Simpan sebagai Perubahan Baru</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-2xs text-warn">Pilihan "Simpan sebagai perubahan baru" akan menutup periode lama (H-1) dan membuat entri periode baru. Cetak historis tidak rusak.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pangkat/Golongan Baru" required><Input value={f.pangkat} onChange={(e) => set('pangkat', e.target.value)} /></Field>
            <Field label="TMT Baru" required><Input type="date" value={f.tmt} onChange={(e) => set('tmt', e.target.value)} /></Field>
            <Field label="Gelar Depan"><Input value={f.gelar_depan} onChange={(e) => set('gelar_depan', e.target.value)} /></Field>
            <Field label="Gelar Belakang"><Input value={f.gelar_belakang} onChange={(e) => set('gelar_belakang', e.target.value)} /></Field>
          </div>
          <div className="flex gap-2"><Button variant="ghost" onClick={() => setMode('list')}>Batal</Button><Button onClick={simpanBaru}>Simpan Perubahan</Button></div>
        </div>
      )}
    </Modal>
  );
}

// ============ MST-05 — Subkegiatan & Rekening Belanja ============
export function KamusPage() {
  const [tab, setTab] = useState<'sub' | 'rek'>('sub');
  const [subList] = useState(repo.masterSubkegiatan());
  const [rekList] = useState(repo.masterRekeningBelanja());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subModal, setSubModal] = useState<{ mode: 'tambah' | 'edit'; id?: string } | null>(null);
  const [rekModal, setRekModal] = useState<{ mode: 'tambah' | 'edit'; id?: string } | null>(null);

  const filterFn = <T extends { nama: string; kode?: string; kode_rekening?: string; status: string }>(item: T, searchKey: string) => {
    if (statusFilter && item.status !== statusFilter) return false;
    if (!search) return true;
    const kode = (item.kode_rekening ?? item.kode ?? '').toLowerCase();
    return kode.includes(search.toLowerCase()) || item.nama.toLowerCase().includes(search.toLowerCase());
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Master Subkegiatan & Rekening Belanja" desc="Kamus global tanpa pagu. Kode disimpan sebagai teks. Satu rekening dapat dipakai di subkegiatan mana pun." />
      <div className="flex gap-2">
        <button onClick={() => setTab('sub')} className={`rounded-md border px-3 py-1.5 text-sm ${tab === 'sub' ? 'border-amber/40 bg-amber/10 text-amber' : 'border-ink-edge text-mist-dim'}`}>Subkegiatan</button>
        <button onClick={() => setTab('rek')} className={`rounded-md border px-3 py-1.5 text-sm ${tab === 'rek' ? 'border-amber/40 bg-amber/10 text-amber' : 'border-ink-edge text-mist-dim'}`}>Rekening Belanja</button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={search} onChange={setSearch} placeholder="Cari kode, nama..." />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} label="Status" options={[{ value: 'Aktif', label: 'Aktif' }, { value: 'Nonaktif', label: 'Nonaktif' }]} />
        <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter(''); }}>Reset</Button>
        {tab === 'sub'
          ? <Button className="ml-auto" onClick={() => setSubModal({ mode: 'tambah' })}><Plus size={16} /> Tambah</Button>
          : <Button className="ml-auto" onClick={() => setRekModal({ mode: 'tambah' })}><Plus size={16} /> Tambah</Button>}
      </div>
      <Card>
        {tab === 'sub' ? (
          <table className="w-full text-2xs">
            <TableHead columns={['Kode', 'Nama', 'Rincian', 'Status', 'Aksi']} />
            <tbody>
              {subList.filter((s) => filterFn(s, search)).map((s, i) => (
                <tr key={s.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                  <td className="std-row px-4 mono text-mist">{s.kode}</td>
                  <td className="std-row px-4 text-mist">{s.nama}</td>
                  <td className="std-row px-4 text-mist-dim">{s.rincian}</td>
                  <td className="std-row px-4">{s.status === 'Aktif' ? <StatusBadge kind="ok" label="Aktif" /> : <StatusBadge kind="neutral" label="Nonaktif" />}</td>
                  <td className="std-row px-4"><button onClick={() => setSubModal({ mode: 'edit', id: s.id })} className="rounded p-1 text-mist-dim hover:text-mist"><Pencil size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-2xs">
            <TableHead columns={['Kode Rekening', 'Nama', 'Rincian', 'Status', 'Aksi']} />
            <tbody>
              {rekList.filter((r) => filterFn(r, search)).map((r, i) => (
                <tr key={r.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                  <td className="std-row px-4 mono text-mist">{r.kode_rekening}</td>
                  <td className="std-row px-4 text-mist">{r.nama}</td>
                  <td className="std-row px-4 text-mist-dim">{r.rincian}</td>
                  <td className="std-row px-4">{r.status === 'Aktif' ? <StatusBadge kind="ok" label="Aktif" /> : <StatusBadge kind="neutral" label="Nonaktif" />}</td>
                  <td className="std-row px-4"><button onClick={() => setRekModal({ mode: 'edit', id: r.id })} className="rounded p-1 text-mist-dim hover:text-mist"><Pencil size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {subModal && <SubkegiatanModal mode={subModal.mode} id={subModal.id} onClose={() => setSubModal(null)} />}
      {rekModal && <RekeningModal mode={rekModal.mode} id={rekModal.id} onClose={() => setRekModal(null)} />}
    </div>
  );
}

function SubkegiatanModal({ mode, id, onClose }: { mode: 'tambah' | 'edit'; id?: string; onClose: () => void }) {
  const ex = id ? repo.masterSubkegiatan().find((s) => s.id === id) : undefined;
  const [f, setF] = useState({ kode: ex?.kode ?? '', nama: ex?.nama ?? '', rincian: ex?.rincian ?? '', status: ex?.status ?? 'Aktif' });
  const [err, setErr] = useState('');
  const save = () => {
    if (!f.kode.trim() || !f.nama.trim()) return setErr('Kode dan nama wajib diisi.');
    if (mode === 'tambah') { repo.tambahSubkegiatan(f.kode, f.nama, f.rincian); recordAudit({ ta_id: null, entitas: `Subkegiatan: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Ditambahkan' }); }
    else if (id) { repo.editSubkegiatan(id, f); recordAudit({ ta_id: null, entitas: `Subkegiatan: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Diperbarui' }); }
    onClose();
  };
  return <Modal open onClose={onClose} title={mode === 'tambah' ? 'Tambah Subkegiatan' : 'Edit Subkegiatan'} footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
    <div className="space-y-4">
      <Field label="Kode" required><Input className="mono" value={f.kode} onChange={(e) => setF({ ...f, kode: e.target.value })} /></Field>
      <Field label="Nama" required><Input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></Field>
      <Field label="Rincian"><Input value={f.rincian} onChange={(e) => setF({ ...f, rincian: e.target.value })} /></Field>
    </div>
  </Modal>;
}

function RekeningModal({ mode, id, onClose }: { mode: 'tambah' | 'edit'; id?: string; onClose: () => void }) {
  const ex = id ? repo.masterRekeningBelanja().find((r) => r.id === id) : undefined;
  const [f, setF] = useState({ kode_rekening: ex?.kode_rekening ?? '', nama: ex?.nama ?? '', rincian: ex?.rincian ?? '', status: ex?.status ?? 'Aktif' });
  const [err, setErr] = useState('');
  const save = () => {
    if (!f.kode_rekening.trim() || !f.nama.trim()) return setErr('Kode rekening dan nama wajib diisi.');
    if (mode === 'tambah') { repo.tambahRekening(f.kode_rekening, f.nama, f.rincian); recordAudit({ ta_id: null, entitas: `Rekening: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Ditambahkan' }); }
    else if (id) { repo.editRekening(id, f); recordAudit({ ta_id: null, entitas: `Rekening: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Diperbarui' }); }
    onClose();
  };
  return <Modal open onClose={onClose} title={mode === 'tambah' ? 'Tambah Rekening Belanja' : 'Edit Rekening Belanja'} footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
    <div className="space-y-4">
      <Field label="Kode Rekening" required hint="Disimpan sebagai teks agar nol awal terjaga"><Input className="mono" value={f.kode_rekening} onChange={(e) => setF({ ...f, kode_rekening: e.target.value })} /></Field>
      <Field label="Nama" required><Input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></Field>
      <Field label="Rincian"><Input value={f.rincian} onChange={(e) => setF({ ...f, rincian: e.target.value })} /></Field>
    </div>
  </Modal>;
}

// ============ MST-06 — Master Jenis Pajak ============
export function PajakPage() {
  const [list, setList] = useState(repo.masterJenisPajak());
  const [modal, setModal] = useState<{ mode: 'tambah' | 'edit'; id?: string } | null>(null);
  const refresh = () => setList([...repo.masterJenisPajak()]);
  const toggleStatus = (id: string) => {
    const r = repo.toggleJenisPajakStatus(id);
    if (r.ok) {
      const j = repo.masterJenisPajak().find((x) => x.id === id);
      recordAudit({ ta_id: null, entitas: `Pajak: ${j?.nama_jenis_pajak}`, aksi: 'aksi_administratif', nilai_sesudah: r.status === 'Aktif' ? 'Diaktifkan' : 'Dinonaktifkan' });
      refresh();
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Master Jenis Pajak" desc="Kamus global untuk pilihan pajak pada SPJ. Tanpa pencarian — data kecil dan jarang berubah." />
        <Button onClick={() => setModal({ mode: 'tambah' })}><Plus size={16} /> Tambah</Button>
      </div>
      {/* MST-06: tanpa pencarian (D01 §15 poin 2) */}
      <Card>
        <table className="w-full text-2xs">
          <TableHead columns={['Kode', 'Nama Jenis Pajak', 'Status', 'Aksi']} />
          <tbody>
            {list.map((j, i) => (
              <tr key={j.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                <td className="std-row px-4 mono text-mist">{j.kode ?? '—'}</td>
                <td className="std-row px-4 text-mist">{j.nama_jenis_pajak}</td>
                <td className="std-row px-4">{j.status === 'Aktif' ? <StatusBadge kind="ok" label="Aktif" /> : <StatusBadge kind="neutral" label="Nonaktif" />}</td>
                <td className="std-row px-4">
                  <div className="flex gap-1.5">
                    <button onClick={() => setModal({ mode: 'edit', id: j.id })} className="rounded p-1 text-mist-dim hover:text-mist" title="Edit"><Pencil size={14} /></button>
                    {j.status === 'Aktif'
                      ? <button onClick={() => toggleStatus(j.id)} className="rounded p-1 text-mist-dim hover:text-warn" title="Nonaktifkan"><PowerOff size={14} /></button>
                      : <button onClick={() => toggleStatus(j.id)} className="rounded p-1 text-mist-dim hover:text-teal" title="Aktifkan"><Power size={14} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {modal && <PajakModal mode={modal.mode} id={modal.id} onClose={() => setModal(null)} onSaved={refresh} />}
    </div>
  );
}

function PajakModal({ mode, id, onClose, onSaved }: { mode: 'tambah' | 'edit'; id?: string; onClose: () => void; onSaved: () => void }) {
  const ex = id ? repo.masterJenisPajak().find((j) => j.id === id) : undefined;
  const [f, setF] = useState({ kode: ex?.kode ?? '', nama: ex?.nama_jenis_pajak ?? '', status: ex?.status ?? 'Aktif' });
  const [err, setErr] = useState('');
  const save = () => {
    if (!f.nama.trim()) return setErr('Nama jenis pajak wajib diisi.');
    const kode = f.kode.trim() || null;
    if (mode === 'tambah') { repo.tambahJenisPajak(kode, f.nama); recordAudit({ ta_id: null, entitas: `Pajak: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Ditambahkan' }); }
    else if (id) { repo.editJenisPajak(id, { kode, nama_jenis_pajak: f.nama, status: f.status as 'Aktif' | 'Nonaktif' }); recordAudit({ ta_id: null, entitas: `Pajak: ${f.nama}`, aksi: 'aksi_administratif', nilai_sesudah: 'Diperbarui' }); }
    onSaved(); onClose();
  };
  return <Modal open onClose={onClose} title={mode === 'tambah' ? 'Tambah Jenis Pajak' : 'Edit Jenis Pajak'} footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
    <div className="space-y-4">
      <Field label="Kode (opsional)"><Input className="mono" value={f.kode} onChange={(e) => setF({ ...f, kode: e.target.value })} /></Field>
      <Field label="Nama Jenis Pajak" required><Input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></Field>
    </div>
  </Modal>;
}

// ============ AKN-04 — Akun Pengawas/Auditor ============
export function PengawasPage() {
  const [list, setList] = useState(repo.akunPengawas());
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: 'tambah' | 'edit' | 'reset' | 'nonaktif' | 'tanggal'; id?: string } | null>(null);
  const refresh = () => setList([...repo.akunPengawas()]);

  const filtered = list.filter((a) => {
    if (!search) return true;
    return `${a.nama_lengkap} ${a.email} ${a.instansi_asal}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Akun Pengawas/Auditor" desc="Terpisah dari Master Personel. Tidak memiliki NIP/NIK, pangkat, TMT, atau WhatsApp." />
        <Button onClick={() => setModal({ mode: 'tambah' })}><Plus size={16} /> Tambah Akun Pengawas</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={search} onChange={setSearch} placeholder="Cari nama, email, instansi..." />
        <Button variant="ghost" onClick={() => setSearch('')}>Reset</Button>
      </div>
      <Card>
        <table className="w-full text-2xs">
          <TableHead columns={['Nama', 'Instansi Asal', 'No. Surat Tugas', 'Email', 'Akhir Akses', 'Status', 'Aksi']} />
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                <td className="std-row px-4 text-mist">{a.nama_lengkap}</td>
                <td className="std-row px-4 text-mist-dim">{a.instansi_asal}</td>
                <td className="std-row px-4 mono text-mist-dim">{a.nomor_surat_tugas}</td>
                <td className="std-row px-4 text-mist-dim">{a.email}</td>
                <td className="std-row px-4 mono text-mist-dim">{formatTanggalPendek(a.tanggal_akhir_akses)}</td>
                <td className="std-row px-4">{a.status === 'ACTIVE' ? <StatusBadge kind="ok" label="ACTIVE" /> : <StatusBadge kind="crit" label="NON-ACTIVE" />}</td>
                <td className="std-row px-4">
                  <div className="flex gap-1.5">
                    <button onClick={() => setModal({ mode: 'edit', id: a.id })} className="rounded p-1 text-mist-dim hover:text-mist" title="Edit"><Pencil size={14} /></button>
                    <button onClick={() => setModal({ mode: 'reset', id: a.id })} className="rounded p-1 text-mist-dim hover:text-amber" title="Reset Password"><KeyRound size={14} /></button>
                    <button onClick={() => setModal({ mode: 'tanggal', id: a.id })} className="rounded p-1 text-mist-dim hover:text-teal" title="Ubah Tanggal Akses"><AlertTriangle size={14} /></button>
                    <button onClick={() => setModal({ mode: 'nonaktif', id: a.id })} className="rounded p-1 text-mist-dim hover:text-crit" title="Nonaktifkan"><Lock size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<ShieldCheck size={28} />} title="Tidak ada akun Pengawas" />}
      </Card>
      {modal && <PengawasModal mode={modal.mode} id={modal.id} onClose={() => setModal(null)} onSaved={refresh} />}
    </div>
  );
}

function PengawasModal({ mode, id, onClose, onSaved }: { mode: string; id?: string; onClose: () => void; onSaved: () => void }) {
  const ex = id ? repo.akunPengawas().find((a) => a.id === id) : undefined;
  const [f, setF] = useState({
    nama_lengkap: ex?.nama_lengkap ?? '', instansi_asal: ex?.instansi_asal ?? '',
    nomor_surat_tugas: ex?.nomor_surat_tugas ?? '', tanggal_surat_tugas: ex?.tanggal_surat_tugas ?? todayWita(),
    email: ex?.email ?? '', tanggal_akhir_akses: ex?.tanggal_akhir_akses ?? todayWita(), password: '',
  });
  const [alasan, setAlasan] = useState('');
  const [err, setErr] = useState('');
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  const save = () => {
    if (mode === 'tambah') {
      if (!f.nama_lengkap.trim() || !f.email.trim() || !f.instansi_asal.trim()) return setErr('Nama, instansi, dan email wajib diisi.');
      if (!f.nomor_surat_tugas.trim()) return setErr('Nomor surat tugas wajib diisi.');
      if (f.password.length < 6) return setErr('Password minimal 6 karakter.');
      const r = repo.tambahPengawas({ nama_lengkap: f.nama_lengkap, instansi_asal: f.instansi_asal, nomor_surat_tugas: f.nomor_surat_tugas, tanggal_surat_tugas: f.tanggal_surat_tugas, email: f.email, tanggal_akhir_akses: f.tanggal_akhir_akses, password: f.password });
      if (!r.ok) return setErr(r.error ?? 'Gagal.');
      recordAudit({ ta_id: null, entitas: `Akun Pengawas: ${f.nama_lengkap}`, aksi: 'aksi_administratif', nilai_sesudah: 'Akun dibuat' });
    } else if (mode === 'edit' && id) {
      repo.editPengawas(id, { nama_lengkap: f.nama_lengkap, instansi_asal: f.instansi_asal, nomor_surat_tugas: f.nomor_surat_tugas, tanggal_surat_tugas: f.tanggal_surat_tugas, email: f.email });
      recordAudit({ ta_id: null, entitas: `Akun Pengawas: ${f.nama_lengkap}`, aksi: 'aksi_administratif', nilai_sesudah: 'Profil diperbarui' });
    } else if (mode === 'reset' && id) {
      if (f.password.length < 6) return setErr('Password minimal 6 karakter.');
      const r = repo.resetPengawasPassword(id, f.password);
      if (!r.ok) return setErr(r.error ?? 'Gagal.');
      recordAudit({ ta_id: null, entitas: `Akun Pengawas: ${ex?.nama_lengkap}`, aksi: 'aksi_administratif', nilai_sesudah: 'Password direset' });
    } else if (mode === 'tanggal' && id) {
      if (!alasan.trim()) return setErr('Alasan ubah tanggal akhir akses wajib diisi.');
      const lama = ex?.tanggal_akhir_akses ?? '';
      repo.editPengawas(id, { tanggal_akhir_akses: f.tanggal_akhir_akses });
      recordAudit({ ta_id: null, entitas: `Akun Pengawas: ${ex?.nama_lengkap}`, aksi: 'aksi_administratif', nilai_sebelum: lama, nilai_sesudah: f.tanggal_akhir_akses, alasan: alasan.trim() });
    } else if (mode === 'nonaktif' && id) {
      if (!alasan.trim()) return setErr('Alasan penonaktifan wajib diisi.');
      const baru = ex?.status === 'ACTIVE' ? 'NON-ACTIVE' : 'ACTIVE';
      repo.editPengawas(id, { status: baru as AccountStatus });
      recordAudit({ ta_id: null, entitas: `Akun Pengawas: ${ex?.nama_lengkap}`, aksi: 'perubahan_status_akun', nilai_sebelum: ex?.status, nilai_sesudah: baru, alasan: alasan.trim() });
    }
    onSaved(); onClose();
  };

  const title = mode === 'tambah' ? 'Tambah Akun Pengawas' : mode === 'edit' ? 'Edit Akun Pengawas' : mode === 'reset' ? 'Reset Password Pengawas' : mode === 'tanggal' ? 'Ubah Tanggal Akhir Akses' : mode === 'nonaktif' ? (ex?.status === 'ACTIVE' ? 'Nonaktifkan Akun' : 'Aktifkan Kembali') : '';
  return <Modal open onClose={onClose} title={title} footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
    {mode === 'reset' ? (
      <Field label="Password Baru" required hint="Minimal 6 karakter"><Input type="password" value={f.password} onChange={(e) => set('password', e.target.value)} /></Field>
    ) : mode === 'tanggal' ? (
      <div className="space-y-4">
        <Field label="Tanggal Akhir Akses Baru" required><Input type="date" value={f.tanggal_akhir_akses} onChange={(e) => set('tanggal_akhir_akses', e.target.value)} /></Field>
        <Field label="Alasan" required><Input value={alasan} onChange={(e) => setAlasan(e.target.value)} /></Field>
      </div>
    ) : mode === 'nonaktif' ? (
      <div className="space-y-4">
        <p className="text-2xs text-mist-dim">{ex?.status === 'ACTIVE' ? 'NON-ACTIVE memutus login tanpa menghapus data atau riwayat.' : 'Aktifkan kembali akun Pengawas.'}</p>
        <Field label="Alasan" required><Input value={alasan} onChange={(e) => setAlasan(e.target.value)} /></Field>
      </div>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama Lengkap" required><Input value={f.nama_lengkap} onChange={(e) => set('nama_lengkap', e.target.value)} /></Field>
        <Field label="Instansi Asal" required><Input value={f.instansi_asal} onChange={(e) => set('instansi_asal', e.target.value)} /></Field>
        <Field label="Nomor Surat Tugas" required><Input className="mono" value={f.nomor_surat_tugas} onChange={(e) => set('nomor_surat_tugas', e.target.value)} /></Field>
        <Field label="Tanggal Surat Tugas"><Input type="date" value={f.tanggal_surat_tugas} onChange={(e) => set('tanggal_surat_tugas', e.target.value)} /></Field>
        <Field label="Email Login" required><Input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} /></Field>
        <Field label="Tanggal Akhir Akses" required><Input type="date" value={f.tanggal_akhir_akses} onChange={(e) => set('tanggal_akhir_akses', e.target.value)} /></Field>
        {mode === 'tambah' && <Field label="Password Awal" required hint="Minimal 6 karakter; tidak wajib diganti saat login pertama"><Input type="password" value={f.password} onChange={(e) => set('password', e.target.value)} /></Field>}
      </div>
    )}
  </Modal>;
}

// ============ BNT-01 — Direktori Transaksional SPJ ============
export function DirektoriPage() {
  const [list, setList] = useState(repo.direktoriTransaksional());
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState<{ id: string } | null>(null);
  const [mergeModal, setMergeModal] = useState<{ keepId: string; dropId: string } | null>(null);
  const refresh = () => setList([...repo.direktoriTransaksional()]);

  const filtered = list.filter((d) => {
    if (!search) return true;
    return `${d.nama} ${d.nip_nik}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Direktori Transaksional SPJ" desc="Terpisah dari Master Personel. Identitas dari pegawai organik, honorer, narasumber, dan pihak luar. Tidak membuat profil personel atau akun." />
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={search} onChange={setSearch} placeholder="Cari nama, NIP/NIK..." />
        <Button variant="ghost" onClick={() => setSearch('')}>Reset</Button>
      </div>
      <Card>
        <table className="w-full text-2xs">
          <TableHead columns={['NIP/NIK', 'Nama', 'Referensi SPJ', 'Aksi']} />
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                <td className="std-row px-4 mono text-mist">{d.nip_nik}</td>
                <td className="std-row px-4 text-mist">{d.nama}</td>
                <td className="std-row px-4 text-mist-dim">{d.referensi_spj_ids.length} SPJ</td>
                <td className="std-row px-4">
                  <button onClick={() => setEditModal({ id: d.id })} className="rounded p-1 text-mist-dim hover:text-mist" title="Koreksi"><Pencil size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<ScrollText size={28} />} title="Tidak ada entri direktori" />}
      </Card>
      {list.length >= 2 && (
        <div className="flex gap-2">
          <MergeDirektoriPicker list={list} onMerge={(keepId, dropId) => setMergeModal({ keepId, dropId })} />
        </div>
      )}
      {editModal && <DirektoriEditModal id={editModal.id} onClose={() => setEditModal(null)} onSaved={refresh} />}
      {mergeModal && (
        <Modal open onClose={() => setMergeModal(null)} title="Konfirmasi Penggabungan"
          footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setMergeModal(null)}>Batal</Button>
            <Button variant="danger" onClick={() => {
              repo.mergeDirektori(mergeModal.keepId, mergeModal.dropId);
              const keep = list.find((d) => d.id === mergeModal.keepId);
              const drop = list.find((d) => d.id === mergeModal.dropId);
              recordAudit({ ta_id: null, entitas: `Direktori: ${drop?.nama}`, aksi: 'aksi_administratif', nilai_sebelum: drop?.nip_nik, nilai_sesudah: `Digabung ke ${keep?.nama} (${keep?.nip_nik})` });
              refresh(); setMergeModal(null);
            }}>Gabung</Button></div>}>
          <p className="text-2xs text-mist-dim">Penggabungan memperbarui referensi identitas untuk validasi berikutnya tanpa menghapus/mengubah isi historis SPJ yang telah tersimpan.</p>
        </Modal>
      )}
    </div>
  );
}

function DirektoriEditModal({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const ex = repo.direktoriTransaksional().find((d) => d.id === id)!;
  const [nip_nik, setNip] = useState(ex.nip_nik);
  const [nama, setNama] = useState(ex.nama);
  const [err, setErr] = useState('');
  const save = () => {
    if (!nip_nik.trim() || !nama.trim()) return setErr('NIP/NIK dan nama wajib diisi.');
    if (!/^[0-9]+$/.test(nip_nik)) return setErr('NIP/NIK hanya angka.');
    const lama = `${ex.nip_nik} / ${ex.nama}`;
    repo.koreksiDirektori(id, nip_nik.trim(), nama.trim());
    recordAudit({ ta_id: null, entitas: `Direktori: ${ex.nama}`, aksi: 'aksi_administratif', nilai_sebelum: lama, nilai_sesudah: `${nip_nik} / ${nama}` });
    onSaved(); onClose();
  };
  return <Modal open onClose={onClose} title="Koreksi Entri Direktori" footer={<div className="flex justify-end gap-2">{err && <span className="mr-auto text-2xs text-crit">{err}</span>}<Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={save}>Simpan</Button></div>}>
    <div className="space-y-4">
      <Field label="NIP/NIK" required><Input className="mono" value={nip_nik} onChange={(e) => setNip(e.target.value)} inputMode="numeric" /></Field>
      <Field label="Nama" required><Input value={nama} onChange={(e) => setNama(e.target.value)} /></Field>
    </div>
  </Modal>;
}

function MergeDirektoriPicker({ list, onMerge }: { list: DirektoriTransaksionalSPJ[]; onMerge: (keepId: string, dropId: string) => void }) {
  const [keep, setKeep] = useState('');
  const [drop, setDrop] = useState('');
  return (
    <Card className="flex flex-wrap items-end gap-3 p-4">
      <span className="text-sm font-semibold text-mist">Gabung Duplikat</span>
      <Field label="Pertahankan"><Select value={keep} onChange={(e) => setKeep(e.target.value)}><option value="">— pilih —</option>{list.map((d) => <option key={d.id} value={d.id}>{d.nama} ({d.nip_nik})</option>)}</Select></Field>
      <Field label="Gabung ke atas"><Select value={drop} onChange={(e) => setDrop(e.target.value)}><option value="">— pilih —</option>{list.map((d) => <option key={d.id} value={d.id}>{d.nama} ({d.nip_nik})</option>)}</Select></Field>
      <Button variant="secondary" disabled={!keep || !drop || keep === drop} onClick={() => onMerge(keep, drop)}><Merge size={14} /> Gabung</Button>
    </Card>
  );
}

// ============ MST-04 — Peta Jabatan (daftar penugasan per TA) ============
export function PetaJabatanPage() {
  const [taList] = useState(repo.tahunAnggaran());
  const [taId, setTaId] = useState(taList[0]?.id ?? '');
  const ta = repo.tahunAnggaranById(taId);
  const { penugasan, delegasi } = repo.petaJabatanByTA(taId);

  return (
    <div className="space-y-4">
      <PageHeader title="Peta Jabatan" desc="Daftar penugasan per TA: PA/KPA, Bendahara, Verifikator, PPTK per seksi, SK, dan delegasi." />
      <Field label="Tahun Anggaran">
        <Select value={taId} onChange={(e) => setTaId(e.target.value)}>{taList.map((t) => <option key={t.id} value={t.id}>TA {t.tahun} — {t.status}</option>)}</Select>
      </Field>
      <Card>
        <div className="border-b border-ink-edge px-4 py-3"><h3 className="text-sm font-semibold text-mist">Penugasan Aktif TA {ta?.tahun}</h3></div>
        <table className="w-full text-2xs">
          <TableHead columns={['Peran', 'Personel', 'Seksi', 'TMT Mulai', 'SK']} />
          <tbody>
            {penugasan.map((t, i) => {
              const sk = repo.registerSK().find((s) => s.penugasan_id === t.id);
              return (
                <tr key={t.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                  <td className="std-row px-4 text-mist capitalize">{t.peran.replace('_', '/')}</td>
                  <td className="std-row px-4 text-mist">{t.nama_snapshot} <span className="mono text-mist-dim">({t.nip_snapshot})</span></td>
                  <td className="std-row px-4 text-mist-dim">{t.seksi_ta_id ? repo.seksiTAById(t.seksi_ta_id)?.nama_snapshot ?? t.seksi_ta_id : '— instansi —'}</td>
                  <td className="std-row px-4 mono text-mist-dim">{formatTanggalPendek(t.tmt_mulai)}</td>
                  <td className="std-row px-4 text-mist-dim">{sk ? `${sk.nomor_sk}` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {delegasi.length > 0 && (
        <Card>
          <div className="border-b border-ink-edge px-4 py-3"><h3 className="text-sm font-semibold text-mist">Delegasi Aktif (Plh./Plt.)</h3></div>
          <table className="w-full text-2xs">
            <TableHead columns={['Peran Digantikan', 'Pengganti', 'Seksi', 'Rentang', 'Definitif']} />
            <tbody>
              {delegasi.map((d, i) => {
                const def = repo.personelById(d.definitive_officer_id);
                return (
                  <tr key={d.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                    <td className="std-row px-4 text-mist capitalize">Plh. {d.peran_digantikan.replace('_', '/')}</td>
                    <td className="std-row px-4 text-mist">{d.nama_snapshot} <span className="mono text-mist-dim">({d.nip_snapshot})</span></td>
                    <td className="std-row px-4 text-mist-dim">{d.seksi_ta_id ? repo.seksiTAById(d.seksi_ta_id)?.nama_snapshot ?? d.seksi_ta_id : '—'}</td>
                    <td className="std-row px-4 mono text-mist-dim">{formatTanggalPendek(d.tanggal_mulai)} — {formatTanggalPendek(d.tanggal_berakhir)}</td>
                    <td className="std-row px-4 text-mist-dim">{def?.nama ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ============ Helper bersama ============
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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-edge bg-ink text-amber">{icon}</div>
      <div>
        <div className="text-2xs text-mist-dim">{label}</div>
        <div className="mono text-xl font-semibold text-mist">{value}</div>
      </div>
    </Card>
  );
}
