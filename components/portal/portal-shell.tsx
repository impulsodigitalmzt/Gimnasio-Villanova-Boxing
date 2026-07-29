'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleHelp } from 'lucide-react';
import { PortalBottomNav } from '@/components/portal/bottom-nav';
import { PortalShortcuts } from '@/components/portal/portal-shortcuts';
import { HelpDrawer, HelpProvider, useHelp } from '@/components/help/help-drawer';
import { IosInstallHint } from '@/components/ios-install-hint';
import { CartProvider } from '@/components/portal/cart-context';
import { CartHeaderButton } from '@/components/portal/cart-header-button';
import { portalHelpContent } from '@/lib/portal/faq-data';
import '@/app/app/portal.css';

function PortalHeader() {
  const { openHelp } = useHelp();
  const pathname = usePathname();
  const showCart = pathname.startsWith('/app/tienda');

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-between sm:max-w-2xl md:max-w-3xl">
        <Link href="/app" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="Villanova" className="size-8 object-contain" />
          <span className="font-display text-sm font-black uppercase tracking-wide text-white">
            Villanova <span className="text-[var(--portal-brand)]">App</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {showCart ? <CartHeaderButton /> : null}
          <button
            type="button"
            onClick={openHelp}
            className="flex size-9 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition hover:border-[var(--portal-brand)]/50 hover:text-[var(--portal-brand-light)]"
            aria-label="Abrir ayuda"
            title="Ayuda"
          >
            <CircleHelp className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth =
    pathname.startsWith('/app/login') || pathname.startsWith('/app/registro');

  if (isAuth) {
    return <div className="portal-app">{children}</div>;
  }

  return (
    <HelpProvider>
      <CartProvider>
        <div className="portal-app">
          <PortalHeader />
          <PortalShortcuts />

          <main className="portal-safe-bottom mx-auto min-h-[70dvh] w-full max-w-lg px-4 pt-5 sm:max-w-2xl sm:px-6 md:max-w-3xl">
            {children}
          </main>

          <PortalBottomNav />
          <IosInstallHint offsetClassName="bottom-[5.25rem]" />
          <HelpDrawer content={portalHelpContent} theme="portal" />
        </div>
      </CartProvider>
    </HelpProvider>
  );
}
