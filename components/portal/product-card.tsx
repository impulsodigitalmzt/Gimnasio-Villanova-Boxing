'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import {
  isVillanovaMemberForDiscount,
  memberUnitPrice,
  MEMBER_SHOP_DISCOUNT,
  type ShopProduct,
} from '@/lib/portal/store-data';
import { brandAssets } from '@/lib/media';
import { useCart } from '@/components/portal/cart-context';
import { ProductDetailModal } from '@/components/portal/product-detail-modal';

export function ProductCard({ product }: { product: ShopProduct }) {
  const { addItem, isMember } = useCart();
  const member = isMember || isVillanovaMemberForDiscount();
  const displayPrice = memberUnitPrice(product.price, member);
  const [justAdded, setJustAdded] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1200);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  function addToCart(e?: MouseEvent) {
    e?.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
  }

  return (
    <>
      <article
        className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border-[3px] border-zinc-500 bg-[#121214] outline-none transition-colors hover:border-zinc-400 focus-visible:border-brand"
        onDoubleClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDetailOpen(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`${product.name}. Doble clic o Enter para ver detalle`}
        title="Doble clic para ver la descripción completa"
      >
        <div className="relative aspect-square bg-[#f3f3f3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="pointer-events-none absolute inset-0 size-full object-contain p-3"
          />
          {member ? (
            <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black">
              -{Math.round(MEMBER_SHOP_DISCOUNT * 100)}% socio
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-lg font-black uppercase leading-snug text-white">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-300">
            {product.description}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Doble clic · ver detalle
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-2xl font-black text-brand-light">
              ${displayPrice.toLocaleString('es-MX')}
            </p>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              MXN
            </span>
            {member ? (
              <p className="text-xs text-zinc-500 line-through">
                ${product.price.toLocaleString('es-MX')}
              </p>
            ) : null}
          </div>

          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={addToCart}
              onDoubleClick={(e) => e.stopPropagation()}
              className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-white active:scale-[0.98] ${
                justAdded
                  ? 'bg-emerald-500 hover:bg-emerald-500'
                  : 'bg-brand hover:bg-brand-dark'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brandAssets.cartIconWhite} alt="" className="size-4 object-contain" />
              {justAdded ? 'Agregado' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </article>

      {detailOpen ? (
        <ProductDetailModal product={product} onClose={() => setDetailOpen(false)} />
      ) : null}
    </>
  );
}
