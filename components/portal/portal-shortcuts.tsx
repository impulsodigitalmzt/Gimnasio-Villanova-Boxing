'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { portalNavTabs } from '@/components/portal/bottom-nav';

/** Atajos Clases · Tienda · Retos · Cuenta — siempre visibles en el portal. */
export function PortalShortcuts() {
  const pathname = usePathname();
  const shortcuts = portalNavTabs.filter((tab) => tab.href !== '/app');

  return (
    <nav
      aria-label="Opciones principales"
      className="sticky top-[calc(3.25rem+env(safe-area-inset-top,0px))] z-20 border-b border-white/10 bg-black/95 px-4 py-3 backdrop-blur-xl"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1.5 sm:max-w-2xl sm:gap-2 sm:px-2 md:max-w-3xl">
        {shortcuts.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border-[3px] px-1 py-2.5 text-center transition active:scale-[0.98] sm:gap-2 sm:px-2 sm:py-3 ${
                active
                  ? 'border-brand bg-[var(--portal-brand)]/15'
                  : 'border-zinc-500 bg-[var(--portal-card)] hover:border-zinc-400'
              }`}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-xl sm:size-10 ${
                  active
                    ? 'bg-[var(--portal-brand)] text-white'
                    : 'bg-white/5 text-[var(--portal-brand-light)]'
                }`}
              >
                <Icon className="size-4 sm:size-5" />
              </span>
              <span className="w-full truncate text-[9px] font-bold uppercase tracking-wider text-white sm:text-[10px]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
