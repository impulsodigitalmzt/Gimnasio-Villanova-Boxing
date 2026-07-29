'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dumbbell,
  Home,
  LockKeyhole,
  ShoppingBag,
  Trophy,
  UserRound,
} from 'lucide-react';
import { isMembershipCurrent } from '@/lib/portal/membership-access';
import { useMemberPortal } from '@/lib/portal/store';

/** Opciones de la barra principal del Portal (página Inicio y resto de /app). */
export const portalNavTabs = [
  { href: '/app', label: 'Inicio', icon: Home },
  { href: '/app/clases', label: 'Clases', icon: Dumbbell },
  { href: '/app/tienda', label: 'Tienda', icon: ShoppingBag },
  { href: '/app/retos', label: 'Retos', icon: Trophy },
  { href: '/app/cuenta', label: 'Cuenta', icon: UserRound },
] as const;

export function PortalBottomNav() {
  const pathname = usePathname();
  const { ready, profile } = useMemberPortal();
  const current = ready && isMembershipCurrent(profile);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-1 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl"
      aria-label="Navegación del socio"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around py-1.5 sm:max-w-2xl md:max-w-3xl">
        {portalNavTabs.map((tab) => {
          const active =
            tab.href === '/app' ? pathname === '/app' : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          const isShop = tab.href === '/app/tienda';
          const locked = tab.href === '/app/clases' && !current;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[9px] font-bold uppercase tracking-wider transition ${
                active
                  ? 'text-[var(--portal-brand-light)]'
                  : locked
                    ? 'text-zinc-600'
                    : 'text-zinc-500'
              }`}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-2xl ${
                  active
                    ? 'bg-[var(--portal-brand)] text-white'
                    : isShop
                      ? 'bg-[var(--portal-brand)]/20 text-[var(--portal-brand-light)]'
                      : locked
                        ? 'bg-white/5 text-zinc-600'
                        : 'bg-white/5'
                }`}
              >
                {locked ? <LockKeyhole className="size-4" /> : <Icon className="size-4" />}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
