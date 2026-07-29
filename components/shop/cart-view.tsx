'use client';

import Link from 'next/link';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/components/portal/cart-context';
import { ShopPickupNotice } from '@/components/shop/pickup-notice';
import { MEMBER_SHOP_DISCOUNT } from '@/lib/portal/store-data';
import {
  shopCartHref,
  shopCheckoutHref,
  shopHomeHref,
  type ShopOrigin,
} from '@/lib/portal/shop-navigation';

export function CartView({ origin }: { origin: ShopOrigin }) {
  const { items, count, subtotal, discount, total, isMember, setQty, removeItem } = useCart();

  const inPortal = origin === 'portal';
  const shopHome = shopHomeHref(origin);
  const checkoutHref = shopCheckoutHref(origin);

  return (
    <section
      className={
        inPortal ? 'pb-24' : 'min-h-screen bg-[#050505] pb-28 pt-28 sm:pb-16'
      }
    >
      <div className={inPortal ? '' : 'mx-auto max-w-[1200px] px-5 sm:px-8'}>
        <Link
          href={shopHome}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white"
        >
          <ChevronLeft className="size-4" /> Seguir comprando
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
              Tienda Villanova
            </p>
            <h1 className="mt-2 font-display text-3xl font-black uppercase text-white sm:text-4xl">
              Carrito de compras
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {count === 0
                ? 'Aún no has agregado productos.'
                : `${count} ${count === 1 ? 'artículo' : 'artículos'} listos para pagar en línea.`}
            </p>
          </div>
        </div>

        {count === 0 ? (
          <div className="mt-10 rounded-[1.75rem] border-[3px] border-zinc-500 bg-zinc-900 px-6 py-16 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/carrito-de-compras-white.png"
              alt=""
              className="mx-auto size-14 object-contain opacity-70"
            />
            <p className="mt-4 text-base text-zinc-400">Tu carrito está vacío</p>
            <Link
              href={shopHome}
              className="mt-6 inline-flex rounded-full bg-brand px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div
            className={`mt-10 grid gap-6 ${
              inPortal ? '' : 'lg:grid-cols-[1.35fr_0.85fr] lg:items-start'
            }`}
          >
            {/* Lista de artículos */}
            <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-zinc-900">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <h2 className="font-display text-lg font-black uppercase text-white">
                  {count} {count === 1 ? 'artículo' : 'artículos'}
                </h2>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Recogida en sucursal
                </span>
              </div>

              <ul className="divide-y divide-white/10">
                {items.map((item) => {
                  const lineTotal = item.price * item.qty;
                  return (
                    <li key={item.productId} className="flex gap-4 px-5 py-5 sm:px-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt=""
                        className="size-20 shrink-0 rounded-xl border-[3px] border-zinc-500 bg-[#f3f3f3] object-contain p-1.5 sm:size-24"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-display text-base font-black uppercase leading-snug text-white">
                              {item.name}
                            </p>
                            {item.description ? (
                              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                                {item.description}
                              </p>
                            ) : null}
                            <p className="mt-1.5 text-sm text-zinc-500">
                              ${item.price.toLocaleString('es-MX')} c/u
                            </p>
                          </div>
                          <p className="font-display text-xl font-black text-brand-light">
                            ${lineTotal.toLocaleString('es-MX')}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-1 rounded-full border-[3px] border-zinc-500 bg-black/50 p-1">
                            <button
                              type="button"
                              className="flex size-9 items-center justify-center rounded-full text-white active:bg-white/10"
                              onClick={() => setQty(item.productId, item.qty - 1)}
                              aria-label="Menos"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="min-w-[1.75rem] text-center text-sm font-bold text-white">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              className="flex size-9 items-center justify-center rounded-full text-white active:bg-white/10"
                              onClick={() => setQty(item.productId, item.qty + 1)}
                              aria-label="Más"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-400"
                          >
                            <Trash2 className="size-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-white/10 p-5 sm:p-6">
                <ShopPickupNotice compact />
              </div>
            </div>

            {/* Resumen */}
            <aside
              className={`rounded-[1.75rem] border-[3px] border-zinc-500 bg-zinc-900 p-5 sm:p-6 ${
                inPortal ? '' : 'lg:sticky lg:top-28'
              }`}
            >
              <h2 className="font-display text-lg font-black uppercase text-white">
                Resumen del pedido
              </h2>

              <Link
                href={checkoutHref}
                className="mt-5 flex min-h-14 w-full items-center justify-center rounded-2xl bg-brand text-sm font-black uppercase tracking-wider text-white hover:bg-brand-dark"
              >
                Continuar
              </Link>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({count})</span>
                  <span className="text-white">${subtotal.toLocaleString('es-MX')}</span>
                </div>

                {isMember ? (
                  <div className="flex justify-between font-semibold text-emerald-400">
                    <span>Ahorros socio ({Math.round(MEMBER_SHOP_DISCOUNT * 100)}%)</span>
                    <span>-${discount.toLocaleString('es-MX')}</span>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-zinc-500">
                    Socios Villanova: {Math.round(MEMBER_SHOP_DISCOUNT * 100)}% off ·{' '}
                    <Link
                      href={`/app/login?next=${encodeURIComponent(shopCartHref(origin))}`}
                      className="text-brand-light underline"
                    >
                      Entrar
                    </Link>
                  </p>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Envío a domicilio</span>
                  <span className="font-semibold text-amber-300">No disponible</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Recogida en sucursal</span>
                  <span className="font-semibold text-emerald-400">Sin costo</span>
                </div>

                <div className="flex items-end justify-between border-t border-white/10 pt-4">
                  <span className="font-bold text-white">Total estimado</span>
                  <span className="text-right">
                    <span className="block font-display text-3xl font-black text-white">
                      ${total.toLocaleString('es-MX')}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      MXN · IVA incluido
                    </span>
                  </span>
                </div>
              </div>

              <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-500">
                Al continuar eliges sucursal de recogida y pagas con tarjeta.
              </p>

              <Link
                href={shopHome}
                className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl border-[3px] border-zinc-500 text-xs font-black uppercase tracking-wider text-white hover:border-zinc-400"
              >
                Seguir comprando
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
