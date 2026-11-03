// UIX-05 — Komponen UI dasar tema Treasury (D03 §1).
// Status wajib ikon/teks, bukan hanya warna. Kontras WCAG AA. Cincin fokus amber.

import { type ReactNode, type InputHTMLAttributes, forwardRef, useEffect, useState, createContext, useContext, useCallback } from 'react';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Info, Circle as XCircle, Lock, ShieldCheck, X, Search, CircleCheck } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-ink-surface border border-ink-edge rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function StatusBadge({ kind, label }: { kind: 'ok' | 'crit' | 'warn' | 'spike' | 'neutral'; label: string }) {
  const map = {
    ok: { ring: 'border-ok/40 text-ok', dot: 'bg-ok', icon: <CheckCircle2 size={14} /> },
    crit: { ring: 'border-crit/40 text-crit', dot: 'bg-crit', icon: <XCircle size={14} /> },
    warn: { ring: 'border-warn/40 text-warn', dot: 'bg-warn', icon: <AlertTriangle size={14} /> },
    spike: { ring: 'border-spike/40 text-spike', dot: 'bg-spike', icon: <AlertTriangle size={14} /> },
    neutral: { ring: 'border-ink-edge text-mist-dim', dot: 'bg-mist-dim', icon: <Info size={14} /> },
  } as const;
  const c = map[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-2xs font-medium ${c.ring}`}
      role="status"
    >
      {c.icon}
      <span>{label}</span>
    </span>
  );
}

export function IconLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span>{children}</span>
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-amber focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-amber text-amber-ink hover:bg-amber/90',
    secondary: 'border border-teal text-teal hover:bg-teal/10',
    ghost: 'text-mist hover:bg-ink-edge/50',
    danger: 'border border-crit/50 text-crit hover:bg-crit/10',
  } as const;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
  required = false,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-mist">
        {label}
        {required && <span className="ml-0.5 text-crit">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-2xs text-mist-dim">{hint}</span>}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(props, ref) {
  const { className = '', ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      className={`w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-mist placeholder:text-mist-dim/60 focus-visible:outline-amber focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    />
  );
});

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props;
  return (
    <select
      {...rest}
      className={`w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-mist focus-visible:outline-amber focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      {children}
    </select>
  );
}

export function EmptyState({ icon, title, desc }: { icon?: ReactNode; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      {icon && <div className="text-mist-dim">{icon}</div>}
      <p className="text-sm font-medium text-mist">{title}</p>
      {desc && <p className="max-w-md text-2xs text-mist-dim">{desc}</p>}
    </div>
  );
}

export function ProtectedNotice({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 px-2.5 py-0.5 text-2xs font-medium text-teal">
      <ShieldCheck size={12} />
      <span>{label}</span>
    </span>
  );
}

export function LockedNotice() {
  return (
    <span className="inline-flex items-center gap-1.5 text-2xs text-mist-dim">
      <Lock size={12} />
      <span>Arsip Read-Only</span>
    </span>
  );
}

// UIX-08 — Pop-up untuk aksi singkat (D01 §15 poin 6–8)
export function Modal({
  open, onClose, title, children, footer, wide, wider,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  wider?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div
        className={`flex max-h-[90vh] w-full ${wider ? 'max-w-5xl' : wide ? 'max-w-2xl' : 'max-w-md'} min-w-0 flex-col rounded-lg border border-ink-edge bg-ink-surface shadow-xl`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink-edge px-4 py-3">
          <h3 className="truncate text-sm font-semibold text-mist">{title}</h3>
          <button onClick={onClose} className="ml-2 shrink-0 rounded p-1 text-mist-dim hover:text-mist" aria-label="Tutup">
            <X size={16} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        {footer && <div className="shrink-0 border-t border-ink-edge px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}

// UIX-07 — SearchBox satu kotak real-time (D01 §15 poin 3)
export function SearchBox({ value, onChange, placeholder = 'Cari...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:w-64">
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mist-dim" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-ink-edge bg-ink py-1.5 pl-8 pr-3 text-2xs text-mist placeholder:text-mist-dim/60 focus-visible:outline-amber focus-visible:outline-2 focus-visible:outline-offset-2"
      />
    </div>
  );
}

// UIX-07 — Filter dropdown generik
export function FilterSelect({ value, onChange, options, label }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-ink-edge bg-ink px-2 py-1.5 text-2xs text-mist focus-visible:outline-amber focus-visible:outline-2"
      aria-label={label}
    >
      <option value="">{label}: Semua</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead className="bg-ink text-mist-dim">
      <tr className="text-left">
        {columns.map((c, i) => (
          <th key={i} className="pro-row px-4 text-2xs font-medium whitespace-nowrap">{c}</th>
        ))}
      </tr>
    </thead>
  );
}

// ===== Isian nominal dengan titik pemisah ribuan (FND-04, D04 §4) =====
// Menampilkan titik pemisah ribuan saat diketik. Nilai yang disimpan tetap bilangan bulat.
// Hanya menerima angka; tempel nilai bertitik tetap dibersihkan.

export const RupiahInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: number;
  onChange: (nilai: number) => void;
}>(function RupiahInput({ value, onChange, className = '', ...rest }, ref) {
  const [tampil, setTampil] = useState(() => (value === 0 ? '' : formatTampil(value)));

  useEffect(() => {
    setTampil(value === 0 ? '' : formatTampil(value));
  }, [value]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bersih = e.target.value.replace(/[^\d]/g, '');
    const n = bersih === '' ? 0 : parseInt(bersih, 10);
    setTampil(bersih === '' ? '' : formatTampil(n));
    onChange(n);
  };

  return (
    <input
      ref={ref}
      {...rest}
      inputMode="numeric"
      value={tampil}
      onChange={handle}
      className={`w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-right mono tnum text-mist placeholder:text-mist-dim/60 focus-visible:outline-amber focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    />
  );
});

function formatTampil(n: number): string {
  return Math.trunc(Math.abs(n)).toLocaleString('de-DE');
}

// ===== Toast notification (umpan balik Simpan "Tersimpan") =====

interface ToastItem { id: number; pesan: string }
const ToastContext = createContext<{ notify: (pesan: string) => void }>({ notify: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const notify = useCallback((pesan: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, pesan }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-lg border border-ok/40 bg-ink-surface px-4 py-2.5 text-sm text-mist shadow-lg"
            role="status"
          >
            <CircleCheck size={16} className="text-ok" />
            <span>{t.pesan}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
