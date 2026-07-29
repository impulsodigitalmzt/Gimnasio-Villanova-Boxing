import type { ReactNode } from 'react';
import type { MemberStatus } from '@/lib/admin/types';

const statusStyles: Record<MemberStatus, string> = {
  activo: 'bg-emerald-100 text-emerald-700',
  por_vencer: 'bg-amber-100 text-amber-700',
  vencido: 'bg-rose-100 text-rose-700',
  pendiente: 'bg-fuchsia-100 text-fuchsia-700',
};

const statusLabels: Record<MemberStatus, string> = {
  activo: 'Cliente Activo',
  por_vencer: 'Por vencer',
  vencido: 'Vencido',
  pendiente: 'Pendiente',
};

export function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function OccupancyBar({ enrolled, capacity }: { enrolled: number; capacity: number }) {
  const pct = Math.min(100, Math.round((enrolled / capacity) * 100));
  const color =
    pct >= 95
      ? 'bg-rose-500'
      : pct >= 75
        ? 'bg-amber-500'
        : 'bg-[var(--admin-brand)]';

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-zinc-500">{pct}%</span>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--admin-border)] bg-white px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--admin-brand)]">
            Villanova Boxing
          </p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-zinc-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
    </div>
  );
}

export function ActionCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-[var(--admin-brand)]/40 hover:shadow-md">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-brand)] text-white">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-bold text-zinc-800">{title}</span>
        <span className="mt-1 block text-xs text-zinc-500">{description}</span>
      </span>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-black text-zinc-900">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-[var(--admin-brand)]">{hint}</p> : null}
    </div>
  );
}

export function ColoredStatCard({
  label,
  value,
  headerClass,
}: {
  label: string;
  value: number;
  headerClass: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className={`px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white ${headerClass}`}>
        {label}
      </div>
      <div className="px-4 py-5 text-center font-display text-3xl font-black text-zinc-800">{value}</div>
    </div>
  );
}

/** @deprecated Prefer StatCard */
export function StatPill({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return <StatCard value={value} label={label} />;
}
