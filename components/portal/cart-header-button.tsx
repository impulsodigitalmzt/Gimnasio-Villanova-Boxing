'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/portal/cart-context';
import { brandAssets } from '@/lib/media';
import { shopCartHref, shopOriginFromPathname } from '@/lib/portal/shop-navigation';

/**
 * Carrito del header — solo en la tienda.
 * Icono oficial Villanova (líneas blancas) + badge + total.
 */
export function CartHeaderButton() {
  const { count, total } = useCart();
  const pathname = usePathname();

  return (
    <Link
      href={shopCartHref(shopOriginFromPathname(pathname))}
      className="group flex min-w-[3.25rem] flex-col items-center justify-center gap-0.5 px-1 py-0.5 text-white transition hover:opacity-90"
      aria-label={
        count > 0
          ? `Carrito: ${count} artículos, $${total.toLocaleString('es-MX')}`
          : 'Carrito vacío'
      }
    >
      <span className="relative inline-flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brandAssets.cartIconWhite}
          alt=""
          className="size-7 object-contain"
        />
        {count > 0 ? (
          <span className="absolute -right-2 -top-1.5 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-[#FBBF24] px-1 text-[10px] font-black leading-none text-black">
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </span>
      <span className="font-mono text-[10px] font-bold tabular-nums text-white">
        ${total.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </span>
    </Link>
  );
}
