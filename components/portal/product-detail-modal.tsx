'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  Store,
  X,
} from 'lucide-react';
import {
  getProductImages,
  getShopProductInfo,
  isVillanovaMemberForDiscount,
  memberUnitPrice,
  MEMBER_SHOP_DISCOUNT,
  pickupBranches,
  type ShopProduct,
} from '@/lib/portal/store-data';
import { brandAssets } from '@/lib/media';
import { useCart } from '@/components/portal/cart-context';

type ProductDetailModalProps = {
  product: ShopProduct;
  onClose: () => void;
};

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addItem, isMember } = useCart();
  const member = isMember || isVillanovaMemberForDiscount();
  const displayPrice = memberUnitPrice(product.price, member);
  const info = getShopProductInfo(product);
  const images = getProductImages(product);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
    setExpanded(false);
  }, [product.id]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1200);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  function handleAdd() {
    addItem(product, qty);
    setJustAdded(true);
  }

  if (!mounted) return null;

  const visibleFeatures = expanded ? info.features : info.features.slice(0, 2);

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/75 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[1.5rem] border-[3px] border-zinc-500 bg-[#0c0c0e] sm:rounded-[1.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
            Detalle del artículo
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/5"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Imagen + galería */}
            <div className="space-y-3 bg-[#f3f3f3] p-3 lg:min-h-[22rem]">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImage] ?? product.image}
                  alt={product.name}
                  className="absolute inset-0 size-full object-contain p-4"
                />
              </div>
              {images.length > 1 ? (
                <div className="flex flex-wrap gap-2 px-1 pb-1">
                  {images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`relative size-14 overflow-hidden rounded-lg border-2 bg-white ${
                        activeImage === index ? 'border-brand' : 'border-zinc-300'
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="absolute inset-0 size-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Info + compra */}
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <p className="text-sm font-semibold text-brand-light">
                  {product.brand ?? 'Villanova Boxing'}
                </p>
                {product.sku ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    SKU {product.sku}
                  </p>
                ) : null}
                <h2
                  id="product-detail-title"
                  className="mt-1 font-display text-2xl font-black uppercase leading-tight text-white sm:text-3xl"
                >
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{info.summary}</p>
              </div>

              <div className="rounded-2xl border-[3px] border-zinc-500 bg-zinc-900/80 p-4">
                <div className="flex flex-wrap items-end gap-2">
                  <p className="font-display text-3xl font-black text-brand-light">
                    ${displayPrice.toLocaleString('es-MX')}
                  </p>
                  <span className="pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    MXN
                  </span>
                  {member ? (
                    <>
                      <p className="pb-1 text-sm text-zinc-500 line-through">
                        ${product.price.toLocaleString('es-MX')}
                      </p>
                      <span className="mb-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        -{Math.round(MEMBER_SHOP_DISCOUNT * 100)}% socio
                      </span>
                    </>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full border-[3px] border-zinc-500 bg-black/50 p-1">
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-full text-white active:bg-white/10"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Menos"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-[1.75rem] text-center text-sm font-bold text-white">
                      {qty}
                    </span>
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-full text-white active:bg-white/10"
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      aria-label="Más"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500">{product.stock} en stock</p>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-white ${
                    justAdded ? 'bg-emerald-500' : 'bg-brand hover:bg-brand-dark'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brandAssets.cartIconWhite} alt="" className="size-4 object-contain" />
                  {justAdded ? 'Agregado' : 'Agregar al carrito'}
                </button>

                <ul className="mt-4 space-y-2 text-xs text-zinc-400">
                  <li className="flex items-start gap-2">
                    <Store className="mt-0.5 size-3.5 shrink-0 text-brand" />
                    Recogida en sucursal sin costo
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
                    Sin servicio a domicilio · Recoge en el gym
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Información del artículo — estilo Walmart */}
          <div className="border-t border-white/10 px-5 py-6 sm:px-6">
            <h3 className="text-lg font-bold text-white">Información del artículo</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
              {visibleFeatures.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {expanded ? (
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{info.moreText}</p>
            ) : null}

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-light hover:text-brand"
            >
              {expanded ? 'Ver menos' : 'Ver más'}
              <ChevronDown
                className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </button>

            <h3 className="mt-8 text-lg font-bold text-white">Un vistazo</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {info.specs.slice(0, 3).map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3"
                >
                  <p className="text-xs font-semibold text-brand-light">{spec.label}</p>
                  <p className="mt-1 text-sm font-bold text-white">{spec.value}</p>
                </div>
              ))}
            </div>
            {info.specs.length > 3 ? (
              <div className="mt-3 space-y-2 text-sm text-zinc-400">
                {info.specs.slice(3).map((spec) => (
                  <p key={spec.label}>
                    <span className="font-semibold text-zinc-300">{spec.label}:</span> {spec.value}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="mt-6 rounded-xl border border-zinc-600 bg-zinc-900/60 p-4 text-xs leading-relaxed text-zinc-400">
              <p className="font-bold text-zinc-300">Sucursales de recogida</p>
              <ul className="mt-2 space-y-1.5">
                {pickupBranches.map((b) => (
                  <li key={b.id}>
                    <span className="font-semibold text-white">{b.name}:</span> {b.address}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
