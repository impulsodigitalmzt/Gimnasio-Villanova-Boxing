'use client';

import { CircleHelp, Menu } from 'lucide-react';
import { useHelp } from '@/components/help/help-drawer';

export function AdminTopbar({
  onMenuClick,
  title = 'Administración Villanova',
}: {
  onMenuClick?: () => void;
  title?: string;
}) {
  const { openHelp } = useHelp();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--admin-border)] bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </button>

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-zinc-800">{title}</p>
        <p className="truncate text-[11px] text-zinc-500">Panel Villanova Boxing</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={openHelp}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 px-2.5 py-2 text-zinc-500 transition hover:border-[var(--admin-brand)]/40 hover:bg-[var(--admin-brand)]/5 hover:text-[var(--admin-brand)]"
          aria-label="Abrir ayuda"
          title="Ayuda"
        >
          <CircleHelp className="size-4" />
          <span className="hidden text-xs font-bold uppercase tracking-wider sm:inline">Ayuda</span>
        </button>
        <span className="hidden rounded-full bg-[var(--admin-brand)]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-brand)] sm:inline">
          En línea
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_negro.png" alt="Villanova" className="size-8 object-contain" />
      </div>
    </header>
  );
}
