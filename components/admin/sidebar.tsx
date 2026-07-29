'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CalendarDays,
  CircleHelp,
  ClipboardList,
  Home,
  LogOut,
  Package,
  Users,
} from 'lucide-react';
import { adminUser } from '@/lib/admin/types';
import { useHelp } from '@/components/help/help-drawer';
import { gymHours } from '@/lib/site-data';

const nav = [
  { href: '/admin', label: 'Inicio', icon: Home, hint: 'Resumen del día' },
  { href: '/admin/socios', label: 'Socios', icon: Users, hint: 'Planes Individual · Dúo · Grupal' },
  { href: '/admin/agenda', label: 'Clases', icon: CalendarDays, hint: 'Boxeo por nivel y edad' },
  { href: '/admin/rutinas', label: 'Rutinas', icon: ClipboardList, hint: 'Sombra · costal · mitts' },
  { href: '/admin/productos', label: 'Tienda', icon: Package, hint: 'Guantes, protectores y merch' },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname.startsWith(href);
}

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openHelp } = useHelp();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  function openHelpPanel() {
    onNavigate?.();
    openHelp();
  }

  return (
    <aside className="flex h-full w-[248px] flex-col bg-[var(--admin-ink)] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3" onClick={onNavigate}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="Villanova" className="size-10 object-contain" />
          <div>
            <p className="font-display text-sm font-black uppercase tracking-wide">
              Villanova <span className="text-[var(--admin-brand)]">Admin</span>
            </p>
            <p className="text-[11px] text-zinc-500">Administración</p>
          </div>
        </Link>
      </div>

      <nav className="admin-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Menú
        </p>
        <div onClick={onNavigate}>
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group mb-1 flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                  active
                    ? 'bg-[var(--admin-active)] text-white shadow-[inset_3px_0_0_var(--admin-brand)]'
                    : 'text-zinc-400 hover:bg-[var(--admin-hover)] hover:text-white'
                }`}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-[var(--admin-brand)] text-white'
                      : 'bg-white/5 text-zinc-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-[11px] text-zinc-500">{item.hint}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={openHelpPanel}
          className="group mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-zinc-400 transition hover:bg-[var(--admin-hover)] hover:text-white"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-zinc-400 group-hover:bg-[var(--admin-brand)]/20 group-hover:text-[var(--admin-brand-light)]">
            <CircleHelp className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Ayuda</span>
            <span className="block text-[11px] text-zinc-500">Guías y FAQ</span>
          </span>
        </button>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--admin-panel)] px-3 py-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[var(--admin-brand)] text-xs font-bold">
            {adminUser.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{adminUser.name}</p>
            <p className="truncate text-[11px] text-zinc-500">{gymHours.compact}</p>
          </div>
        </div>
        <Link
          href="/"
          className="mb-1 block rounded-lg px-3 py-2 text-xs font-semibold text-zinc-400 hover:bg-[var(--admin-hover)] hover:text-white"
        >
          Ver sitio web
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-400 hover:bg-[var(--admin-hover)] hover:text-white"
        >
          <LogOut className="size-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
