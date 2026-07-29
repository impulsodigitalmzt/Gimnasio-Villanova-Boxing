'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  CART_STORAGE_KEY,
  cartItemCount,
  cartPricing,
  cartSubtotal,
  getShopProduct,
  isVillanovaMemberForDiscount,
  type CartItem,
  type ShopProduct,
} from '@/lib/portal/store-data';
import {
  shopCheckoutHref,
  shopOriginFromPathname,
} from '@/lib/portal/shop-navigation';

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  isMember: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: ShopProduct, qty?: number) => CartItem[];
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  checkoutUrl: string;
  refreshMember: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function hydrateCartItem(item: CartItem): CartItem {
  if (item.description) return item;
  const catalog = getShopProduct(item.productId);
  return {
    ...item,
    description: catalog?.description ?? '',
  };
}

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed.map(hydrateCartItem) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const refreshMember = useCallback(() => {
    setIsMember(isVillanovaMemberForDiscount());
  }, []);

  useEffect(() => {
    setItems(readCart());
    setIsMember(isVillanovaMemberForDiscount());
    setReady(true);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const addItem = useCallback(
    (product: ShopProduct, qty = 1) => {
      const current = readCart();
      const existing = current.find((i) => i.productId === product.id);
      let next: CartItem[];
      if (existing) {
        next = current.map((i) =>
          i.productId === product.id
            ? { ...i, qty: Math.min(i.qty + qty, product.stock || 99) }
            : i,
        );
      } else {
        next = [
          ...current,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            qty,
          },
        ];
      }
      persist(next);
      setIsMember(isVillanovaMemberForDiscount());
      return next;
    },
    [persist],
  );

  const removeItem = useCallback(
    (productId: string) => {
      persist(readCart().filter((i) => i.productId !== productId));
    },
    [persist],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) {
        persist(readCart().filter((i) => i.productId !== productId));
        return;
      }
      persist(readCart().map((i) => (i.productId === productId ? { ...i, qty } : i)));
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const liveItems = ready ? items : [];
  const count = cartItemCount(liveItems);
  const pricing = cartPricing(liveItems, isMember);
  const checkoutUrl = shopCheckoutHref(shopOriginFromPathname(pathname));

  const value = useMemo(
    () => ({
      items: liveItems,
      count,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      total: pricing.total,
      isMember: pricing.isMember,
      open,
      setOpen,
      addItem,
      removeItem,
      setQty,
      clearCart,
      checkoutUrl,
      refreshMember,
    }),
    [
      liveItems,
      count,
      pricing,
      open,
      addItem,
      removeItem,
      setQty,
      clearCart,
      checkoutUrl,
      refreshMember,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { cartSubtotal };
