/**
 * Navegación de la tienda según el contexto del usuario.
 * El alumno que compra desde su portal nunca sale del portal;
 * el visitante del sitio público se queda en el sitio.
 */
export type ShopOrigin = 'portal' | 'sitio';

export function shopOriginFromPathname(pathname: string): ShopOrigin {
  return pathname.startsWith('/app') ? 'portal' : 'sitio';
}

export function shopHomeHref(origin: ShopOrigin) {
  return origin === 'portal' ? '/app/tienda' : '/tienda';
}

export function shopCartHref(origin: ShopOrigin) {
  return origin === 'portal' ? '/app/tienda/carrito' : '/tienda/carrito';
}

export function shopCheckoutHref(origin: ShopOrigin) {
  return origin === 'portal' ? '/app/tienda/checkout' : '/tienda/checkout';
}
