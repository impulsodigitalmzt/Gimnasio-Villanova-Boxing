/**
 * Pedidos de la Tienda Villanova (localStorage — proceso de compra simulado).
 */

import type { CartItem } from '@/lib/portal/store-data';

export const LAST_SHOP_ORDER_KEY = 'villanova_shop_last_order_v1';

export type ShopOrder = {
  orderId: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  branchId: string;
  branchName: string;
  branchAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  memberDiscount: boolean;
  paymentMethod: 'card';
  cardLast4: string;
};

export function createShopOrderId() {
  return `VNB-T${Math.floor(100000 + Math.random() * 900000)}`;
}

export function saveShopOrder(order: ShopOrder) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LAST_SHOP_ORDER_KEY, JSON.stringify(order));
}

export function loadShopOrder(): ShopOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LAST_SHOP_ORDER_KEY);
    return raw ? (JSON.parse(raw) as ShopOrder) : null;
  } catch {
    return null;
  }
}
