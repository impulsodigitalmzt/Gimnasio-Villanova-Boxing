'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { ProductCard } from '@/components/portal/product-card';
import { useCart } from '@/components/portal/cart-context';
import { ShopPickupNotice } from '@/components/shop/pickup-notice';
import {
  isVillanovaMemberForDiscount,
  loadShopCatalog,
  MEMBER_SHOP_DISCOUNT,
  type ShopProduct,
} from '@/lib/portal/store-data';

export default function TiendaPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isMember, setIsMember] = useState(false);
  const { count, total, refreshMember } = useCart();

  useEffect(() => {
    setProducts(loadShopCatalog());
    setIsMember(isVillanovaMemberForDiscount());
    refreshMember();
  }, [refreshMember]);

  return (
    <>
      <PageHero
        eyebrow="Tienda Villanova"
        title={'MERCH & GEAR.\n*COMPRA EN LÍNEA.*'}
        description="Merch y equipo oficial Villanova Boxing. Cualquiera puede comprar; socios tienen 10% de descuento. Pagas en línea y recoges en el gym."
        image="/foto/536624422_18063859322252708_3193060558709127234_n.jpg"
        primaryHref="#catalogo"
        primaryLabel="Ver productos"
      />

      <section id="catalogo" className="bg-black py-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                Catálogo
              </p>
              <h2 className="mt-2 font-display text-4xl font-black uppercase text-white sm:text-5xl">
                Merch & equipo
              </h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">
                Playeras, shorts, gorras, guantes, protectores, shakers y más. Compra en línea y recoge
                en sucursal.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/tienda/carrito"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-wider ${
                  count > 0
                    ? 'bg-brand text-white hover:bg-brand-dark'
                    : 'border border-white/15 text-zinc-300 hover:border-brand hover:text-white'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo/carrito-de-compras-white.png" alt="" className="size-5 object-contain" />
                {count > 0
                  ? `Ver carrito · $${total.toLocaleString('es-MX')}`
                  : 'Carrito'}
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <ShopPickupNotice />
          </div>

          {isMember ? (
            <div className="mb-8 rounded-2xl border-[3px] border-emerald-500/50 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
              Socio Villanova: tienes{' '}
              <strong>{Math.round(MEMBER_SHOP_DISCOUNT * 100)}% de descuento</strong> en todos los
              productos.
            </div>
          ) : (
            <div className="mb-8 rounded-2xl border-[3px] border-zinc-500 bg-zinc-900 px-5 py-4 text-sm text-zinc-400">
              ¿Eres miembro?{' '}
              <Link href="/app/login?next=/tienda" className="font-bold text-brand-light underline">
                Acceso Alumnos
              </Link>{' '}
              y obtén {Math.round(MEMBER_SHOP_DISCOUNT * 100)}% de descuento en toda la tienda.
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
