'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/portal/product-card';
import { useCart } from '@/components/portal/cart-context';
import { ShopPickupNotice } from '@/components/shop/pickup-notice';
import {
  isVillanovaMemberForDiscount,
  loadShopCatalog,
  MEMBER_SHOP_DISCOUNT,
  type ShopProduct,
} from '@/lib/portal/store-data';

export default function MemberShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isMember, setIsMember] = useState(false);
  const { refreshMember } = useCart();

  useEffect(() => {
    setProducts(loadShopCatalog());
    setIsMember(isVillanovaMemberForDiscount());
    refreshMember();
  }, [refreshMember]);

  return (
    <div className="space-y-5 pb-24">
      <header>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
          Tienda Villanova
        </p>
        <h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Merch & gear</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Compra en línea y recoge en sucursal.
          {isMember
            ? ` Descuento socio ${Math.round(MEMBER_SHOP_DISCOUNT * 100)}% activo.`
            : ''}
        </p>
      </header>

      <ShopPickupNotice />

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Link
        href="/app/tienda/carrito"
        className="block text-center text-xs font-bold text-zinc-500 hover:text-white"
      >
        Ver mi carrito
      </Link>
    </div>
  );
}
