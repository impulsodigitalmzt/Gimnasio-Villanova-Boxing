'use client';

import { usePathname } from 'next/navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CartProvider } from '@/components/portal/cart-context';
import { CartHeaderButton } from '@/components/portal/cart-header-button';

/**
 * Muestra el chrome de la landing solo fuera de /admin y /login,
 * para que el SaaS no herede header/footer ni estilos de marketing.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppShell =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/app') ||
    pathname === '/login' ||
    pathname.startsWith('/api/');

  const isShop = pathname.startsWith('/tienda');

  if (isAppShell) {
    return <>{children}</>;
  }

  if (isShop) {
    return (
      <CartProvider>
        <SiteHeader cartSlot={<CartHeaderButton />} />
        <main>{children}</main>
        <SiteFooter />
      </CartProvider>
    );
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
