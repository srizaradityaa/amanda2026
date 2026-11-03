// UIX-02 — Halaman login Split-Hero responsif (D03 §1).
// Panel kiri identitas Pemkab Balangan • Kec. Batumandi + logo + AMANDA + etos.
// Panel kanan kartu datar; tombol amber "Masuk ke Sistem"; tautan "Lihat Ringkasan Publik".
// Single-field identifier: angka -> personel; '@' -> Pengawas/Auditor (ikon + label teks).

import { useState, useEffect, useRef } from 'react';
import {
  Eye, EyeOff, AlertCircle, ShieldCheck, Building2, ChevronRight, Landmark, Lock,
} from 'lucide-react';
import { login, isAuditorIdentifier } from '@/lib/auth';
import { Button, Field, Input } from '@/components/ui';
import type { LoginResult } from '@/lib/auth';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    idRef.current?.focus();
  }, []);

  const auditorMode = isAuditorIdentifier(identifier);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    // simulasi pemeriksaan singkat agar tombol menampilkan "Memeriksa akun..."
    setTimeout(() => {
      const res: LoginResult = login(identifier, password);
      if (!res.ok) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      onLogin();
    }, 350);
  }

  return (
    <div className="min-h-screen bg-ink text-mist grid lg:grid-cols-2">
      {/* Panel Kiri — Identitas & Wibawa Instansi */}
      <div className="relative flex flex-col justify-between overflow-hidden border-b border-ink-edge p-8 lg:border-b-0 lg:border-r lg:p-12">
        <div className="grid-ornament pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative">
          <header className="text-2xs font-medium uppercase tracking-wider text-mist-dim">
            Pemerintah Kabupaten Balangan • Kecamatan Batumandi
          </header>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ink-edge bg-ink-surface">
              <Landmark size={24} className="text-amber" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-mist">AMANDA</h1>
              <p className="text-2xs text-mist-dim">Aplikasi Manajemen Data Anggaran</p>
            </div>
          </div>
        </div>
        <div className="relative mt-12">
          <p className="max-w-sm text-lg leading-relaxed text-mist">
            "Tertib Administrasi, Akuntabel, dan Transparan dalam Setiap Rupiah."
          </p>
        </div>
        <div className="relative mt-12 flex items-center gap-2 text-2xs text-mist-dim">
          <ShieldCheck size={14} />
          <span>Sistem tunduk pada aturan WITA (UTC+8). Sesi berakhir otomatis 1 jam tanpa aktivitas.</span>
        </div>
      </div>

      {/* Panel Kanan — Kartu Login Datar */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-ink-edge bg-ink-surface p-6 sm:p-8">
            <h2 className="mb-1 text-lg font-semibold text-mist">Masuk ke Sistem</h2>
            <p className="mb-6 text-2xs text-mist-dim">
              Gunakan NIP, NIK, atau email Pengawas/Auditor sesuai penugasan Anda.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field label="NIP / NIK / Email Auditor" required>
                <Input
                  ref={idRef}
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 198501012010011001 atau auditor@balangankab.go.id"
                  className={auditorMode ? 'mono' : 'mono'}
                  autoComplete="username"
                  spellCheck={false}
                />
              </Field>

              {auditorMode && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/5 px-2.5 py-1 text-2xs font-medium text-teal">
                  <Building2 size={12} />
                  <span>Akun Pengawas/Auditor</span>
                </div>
              )}

              <Field label="Kata Sandi" required>
                <div className="relative">
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete="current-password"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-mist-dim hover:text-mist focus-visible:outline-amber focus-visible:outline-2"
                    aria-label={showPwd ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-md border border-crit/30 bg-crit/5 px-3 py-2.5 text-2xs text-crit"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Memeriksa akun...' : 'Masuk ke Sistem'}
              </Button>
            </form>

            <div className="mt-4 flex items-start gap-2 rounded-md border border-ink-edge bg-ink px-3 py-2.5 text-2xs text-mist-dim">
              <Lock size={14} className="mt-0.5 shrink-0 text-mist-dim" />
              <span>
                Lupa password atau akun terkendala? Hubungi Administrator Sistem. Reset password bersifat terpusat oleh Admin.
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);
                window.dispatchEvent(new CustomEvent('amanda:go-public'));
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-teal px-4 py-2 text-sm font-medium text-teal transition-colors hover:bg-teal/10"
            >
              <span>Lihat Ringkasan Publik</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <p className="mt-6 text-center text-2xs text-mist-dim">
            AMANDA &copy; 2026 Pemerintah Kabupaten Balangan
          </p>
        </div>
      </div>
    </div>
  );
}
