'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { portalNavTabs } from '@/components/portal/bottom-nav';
import { isMembershipCurrent } from '@/lib/portal/membership-access';
import { useMemberPortal } from '@/lib/portal/store';

/** Atajos del portal — siempre visibles debajo del header. */
export function PortalShortcuts() {
  const pathname = usePathname();
  const { ready, profile } = useMemberPortal();
  const current = ready && isMembershipCurrent(profile);
  const shortcuts = portalNavTabs.filter((tab) => tab.href !== '/app');

  return (
    <nav
      aria-label="Opciones principales"
      className="sticky top-[calc(3.25rem+env(safe-area-inset-top,0px))] z-20 border-b border-white/10 bg-black/95 px-3 py-3 backdrop-blur-xl sm:px-4"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 sm:max-w-2xl sm:gap-1.5 sm:px-2 md:max-w-3xl">
        {shortcuts.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const locked = tab.href === '/app/clases' && !current;
          const highlightQr = tab.href === '/app/qr';
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex min-w-0 flex-col items-center gap-1 rounded-2xl border-[3px] px-0.5 py-2 text-center transition active:scale-[0.98] sm:gap-1.5 sm:px-1.5 sm:py-2.5 ${
                active
                  ? 'border-brand bg-[var(--portal-brand)]/15'
                  : locked
                    ? 'border-zinc-700 bg-[var(--portal-card)] opacity-70'
                    : highlightQr
                      ? 'border-brand/60 bg-[var(--portal-brand)]/10 hover:border-brand'
                      : 'border-zinc-500 bg-[var(--portal-card)] hover:border-zinc-400'
              }`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-xl sm:size-9 ${
                  active || highlightQr
                    ? 'bg-[var(--portal-brand)] text-white'
                    : locked
                      ? 'bg-white/5 text-zinc-500'
                      : 'bg-white/5 text-[var(--portal-brand-light)]'
                }`}
              >
                {locked ? (
                  <LockKeyhole className="size-3.5 sm:size-4" />
                ) : (
                  <Icon className="size-3.5 sm:size-4" />
                )}
              </span>
              <span className="w-full truncate text-[8px] font-bold uppercase tracking-wider text-white sm:text-[9px]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
