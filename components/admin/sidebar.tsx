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
  QrCode,
  Users,
} from 'lucide-react';
import { adminUser } from '@/lib/admin/types';
import { useHelp } from '@/components/help/help-drawer';
import { gymHours } from '@/lib/site-data';

const nav = [
  { href: '/admin', label: 'Inicio', icon: Home, hint: 'Resumen del día' },
  { href: '/admin/socios', label: 'Socios', icon: Users, hint: 'Planes Individual · Dúo · Grupal' },
  { href: '/admin/asistencia', label: 'Asistencia', icon: QrCode, hint: 'Check-in QR recepción' },
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
            <p className="text-xs text-white/75">Administración</p>
          </div>
        </Link>
      </div>

      <nav className="admin-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
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
                    : 'text-white hover:bg-[var(--admin-hover)]'
                }`}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-[var(--admin-brand)] text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold">{item.label}</span>
                  <span className="block text-xs leading-snug text-white/75">{item.hint}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={openHelpPanel}
          className="group mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-white transition hover:bg-[var(--admin-hover)]"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white group-hover:bg-[var(--admin-brand)]/20">
            <CircleHelp className="size-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold">Ayuda</span>
            <span className="block text-xs text-white/75">Guías y FAQ</span>
          </span>
        </button>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--admin-panel)] px-3 py-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[var(--admin-brand)] text-xs font-bold">
            {adminUser.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">{adminUser.name}</p>
            <p className="truncate text-xs text-white/75">{gymHours.compact}</p>
          </div>
        </div>
        <Link
          href="/"
          className="mb-1 block rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--admin-hover)]"
        >
          Ver sitio web
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--admin-hover)]"
        >
          <LogOut className="size-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
