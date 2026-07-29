/**
 * Catálogo oficial Tienda Villanova.
 * Cualquiera compra en línea; socios → 10% descuento.
 * Recogida solo en sucursal (sin domicilio).
 */

import type { Product } from '@/lib/admin/types';
import { MEMBER_PROFILE_KEY } from '@/lib/portal/types';
import { CURRENT_USER_ID_KEY, getCurrentUser, getUserById } from '@/lib/portal/users';

export const ADMIN_DB_KEY = 'villanova-admin-db-v6';
export const CART_STORAGE_KEY = 'villanova_portal_cart_v2';

/** Descuento para miembros Villanova. */
export const MEMBER_SHOP_DISCOUNT = 0.1;

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  /** Ángulos extras del mismo artículo */
  gallery?: string[];
  description: string;
  brand?: string;
  sku?: string;
  category:
    | 'playera'
    | 'short'
    | 'gorra'
    | 'shaker'
    | 'toalla'
    | 'suplemento'
    | 'guante'
    | 'protector'
    | 'camiseta';
};

export type ShopProductSpec = { label: string; value: string };

export type ShopProductInfo = {
  summary: string;
  features: string[];
  moreText: string;
  specs: ShopProductSpec[];
};

const categoryLabels: Record<ShopProduct['category'], string> = {
  playera: 'Playera',
  short: 'Short',
  gorra: 'Gorra',
  shaker: 'Shaker',
  toalla: 'Toalla',
  suplemento: 'Suplemento',
  guante: 'Guantes',
  protector: 'Protector',
  camiseta: 'Camiseta',
};

const categoryDefaults: Record<
  ShopProduct['category'],
  { features: string[]; moreText: string; specs: ShopProductSpec[] }
> = {
  playera: {
    features: [
      '【MARCA VILLANOVA】: Estampado oficial Villanova Boxing Mazatlán.',
      '【COMODIDAD】: Tela ligera y respirable para entrenar o uso diario.',
      '【CORTE UNISEX】: Ajuste versátil para hombre y mujer.',
      '【CUIDADO】: Lavar a máquina en frío; no usar blanqueador.',
    ],
    moreText:
      'Ideal para sesiones de boxeo, clases grupales o streetwear. Combínala con shorts Villanova. Recoge en el gym después de pagar en línea.',
    specs: [
      { label: 'Material', value: 'Algodón / blend deportivo' },
      { label: 'Corte', value: 'Unisex' },
      { label: 'Uso', value: 'Gym y diario' },
    ],
  },
  short: {
    features: [
      '【ENTRENAMIENTO】: Pensado para fuerza, HIIT y cardio.',
      '【MOVILIDAD】: Cintura elástica y corte que no limita el movimiento.',
      '【MARCA VILLANOVA】: Logo oficial del club.',
      '【CUIDADO】: Secado rápido; lavar en frío.',
    ],
    moreText:
      'Short técnico Villanova para sesiones largas en el box. Recogida en sucursal tras tu compra en línea; sin envío a domicilio.',
    specs: [
      { label: 'Material', value: 'Tela técnica' },
      { label: 'Cintura', value: 'Elástica' },
      { label: 'Uso', value: 'Entrenamiento' },
    ],
  },
  gorra: {
    features: [
      '【ESTILO CLUB】: Logo / parche Villanova Boxing.',
      '【AJUSTE】: Cierre trasero ajustable.',
      '【LIGERA】: Cómoda para gym, calle o playa en Mazatlán.',
      '【CUIDADO】: Limpiar con paño húmedo; no meter a lavadora agresiva.',
    ],
    moreText:
      'Gorra oficial Villanova para completar tu look del club. Paga en línea y recoge en cualquiera de nuestras dos sucursales.',
    specs: [
      { label: 'Tipo', value: 'Gorra ajustable' },
      { label: 'Visera', value: 'Curva' },
      { label: 'Uso', value: 'Urbano / outdoor' },
    ],
  },
  shaker: {
    features: [
      '【CAPACIDAD】: 700 ml para proteína, creatina o pre-entreno.',
      '【MEZCLA】: Incluye malla / sistema mezclador.',
      '【SEGURIDAD】: Libre de BPA; tapa anti-derrames.',
      '【MARCA VILLANOVA】: Branding oficial del club.',
    ],
    moreText:
      'Llévalo al gym o a casa. Tras pagar en la tienda en línea, pásalo a recoger en Villanova Boxing Gym.',
    specs: [
      { label: 'Capacidad', value: '700 ml' },
      { label: 'Material', value: 'Plástico libre de BPA' },
      { label: 'Uso', value: 'Suplementos / hidratación' },
    ],
  },
  toalla: {
    features: [
      '【GYM READY】: Absorbente y compacta para tu bolsa.',
      '【MARCA VILLANOVA】: Branding oficial del club.',
      '【PRÁCTICA】: Ideal para clases, peso libre o post-entreno.',
      '【CUIDADO】: Lavar a máquina; no usar suavizante en exceso.',
    ],
    moreText:
      'Toalla de entrenamiento Villanova. Compra en línea y recoge sin costo de envío en sucursal (no hay domicilio).',
    specs: [
      { label: 'Tipo', value: 'Toalla de gym' },
      { label: 'Absorción', value: 'Alta' },
      { label: 'Uso', value: 'Entrenamiento' },
    ],
  },
  suplemento: {
    features: [
      '【RECUPERACIÓN】: Apoya metas de fuerza y masa muscular.',
      '【SABOR】: Chocolate Villanova.',
      '【PRESENTACIÓN】: 1.4 kg.',
      '【USO】: Combínala con tu rutina y nutrición del club.',
    ],
    moreText:
      'Suplemento Villanova Whey. Consulta con tu coach si tienes dudas de uso. Pago en línea y recogida en sucursal únicamente.',
    specs: [
      { label: 'Tipo', value: 'Proteína whey' },
      { label: 'Sabor', value: 'Chocolate' },
      { label: 'Presentación', value: '1.4 kg' },
    ],
  },
  guante: {
    features: [
      '【MARCA VILLANOVA】: Logo oficial Villanova Boxing Gym.',
      '【CIERRE DE CONTACTO】: Velcro de fácil ajuste para entrenar.',
      '【ACOLCHADO】: Espumas para saco, mitts y sparring controlado.',
      '【ONZA】: Presentación 8 oz (consulta otras onzas en el gym).',
    ],
    moreText:
      'Guantes oficiales Villanova Boxing. Paga en línea y recoge en el gym. Pregunta a tu coach por la onza ideal según tu peso y uso.',
    specs: [
      { label: 'Marca', value: 'Villanova Boxing' },
      { label: 'Cierre', value: 'Contacto / velcro' },
      { label: 'Uso', value: 'Entrenamiento / sparring' },
    ],
  },
  protector: {
    features: [
      '【MARCA VILLANOVA】: Protector de cabeza con branding oficial.',
      '【ACOLCHADO】: Absorción de impactos para sparring y fogueo.',
      '【AJUSTE】: Correas y cierre seguro para un fit estable.',
      '【VISIBILIDAD】: Aberturas amplias para no perder el ring.',
    ],
    moreText:
      'Protector de cabeza Villanova Boxing. Te ayudamos a elegir talla en recepción. Compra en línea y recoge en el gym.',
    specs: [
      { label: 'Marca', value: 'Villanova Boxing' },
      { label: 'Tipo', value: 'Protector de cabeza' },
      { label: 'Uso', value: 'Sparring / clases' },
    ],
  },
  camiseta: {
    features: [
      '【CORTE BOXEO】: Camiseta atlética Villanova.',
      '【LIGERA】: Tela respirable para sombra o calentamiento.',
      '【LOGO】: Branding oficial del club.',
      '【CUIDADO】: Lavar en frío; no usar blanqueador.',
    ],
    moreText:
      'Camiseta Villanova Boxing. Paga en línea y recoge sin envío a domicilio en el gym.',
    specs: [
      { label: 'Marca', value: 'Villanova Boxing' },
      { label: 'Tipo', value: 'Camiseta' },
      { label: 'Uso', value: 'Entrenamiento' },
    ],
  },
};

/** Detalle tipo ficha (Walmart): bullets + “un vistazo”. */
export function getShopProductInfo(product: ShopProduct): ShopProductInfo {
  const defaults = categoryDefaults[product.category];
  const extra: ShopProductSpec[] = [];
  if (product.brand) extra.push({ label: 'Marca', value: product.brand });
  if (product.sku) extra.push({ label: 'SKU', value: product.sku });

  return {
    summary: product.description,
    features: defaults.features,
    moreText: defaults.moreText,
    specs: [
      { label: 'Categoría', value: categoryLabels[product.category] },
      ...extra,
      ...defaults.specs.filter(
        (s) => !(product.brand && s.label === 'Marca'),
      ),
      { label: 'Stock', value: `${product.stock} disponibles` },
    ],
  };
}

export function getProductImages(product: ShopProduct): string[] {
  const extras = product.gallery ?? [];
  return [product.image, ...extras.filter((src) => src !== product.image)];
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  qty: number;
};

export const pickupBranches = [
  {
    id: 'principal',
    name: 'Villanova Boxing Gym',
    address: 'Recoge tu pedido en recepción del gimnasio.',
  },
] as const;

export const NO_DELIVERY_LEGEND =
  'No contamos con servicio a domicilio. Tras pagar en línea, recoge tu producto en Villanova Boxing Gym.';

const IMG = '/tienda';

/**
 * Catálogo oficial Villanova Boxing.
 * Imágenes actuales en public/tienda.
 */
export const mockShopProducts: ShopProduct[] = [
  {
    id: 'playera-negra',
    name: 'Playera Villanova Negra',
    price: 449,
    stock: 22,
    category: 'playera',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_dyw458dyw458dyw4.png`,
    description:
      'Playera deportiva negra de manga corta con logo circular Villanova Boxing Gym. Tela ligera para entrenar o uso diario.',
  },
  {
    id: 'playera-blanca',
    name: 'Playera Villanova Blanca',
    price: 449,
    stock: 20,
    category: 'playera',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_qph5lwqph5lwqph5.png`,
    description:
      'Playera blanca con logo Villanova en contraste. Fresca, versátil y lista para el gym o la calle.',
  },
  {
    id: 'playera-azul',
    name: 'Playera Villanova Azul',
    price: 449,
    stock: 18,
    category: 'playera',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_jw79icjw79icjw79.png`,
    description:
      'Playera azul con branding oficial Villanova Boxing. Corte unisex y tela respirable.',
  },
  {
    id: 'playera-amarilla',
    name: 'Playera Villanova Amarilla',
    price: 469,
    stock: 14,
    category: 'playera',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_kejmv7kejmv7kejm.png`,
    description:
      'Playera amarilla vibrante con logo Villanova. Ideal para entrenamientos de alta energía.',
  },
  {
    id: 'playera-lila',
    name: 'Playera Villanova Lila',
    price: 469,
    stock: 14,
    category: 'playera',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_jkn1vrjkn1vrjkn1.png`,
    description:
      'Playera lila Villanova. Soft-touch, cuello redondo y logo frontal del club.',
  },
  {
    id: 'short-negro',
    name: 'Short Villanova Negro',
    price: 399,
    stock: 17,
    category: 'short',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_1qliyw1qliyw1qli.png`,
    description:
      'Short negro con cordón y logo Villanova en la pierna. Movilidad total para fuerza, HIIT o boxeo.',
  },
  {
    id: 'short-azul',
    name: 'Short Villanova Azul Marino',
    price: 399,
    stock: 15,
    category: 'short',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_dzv9godzv9godzv9.png`,
    description:
      'Short azul marino de malla con logo Villanova. Secado rápido y ajuste cómodo para sesiones largas.',
  },
  {
    id: 'gorra-negra',
    name: 'Gorra Villanova Negra',
    price: 329,
    stock: 14,
    category: 'gorra',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_1z7am01z7am01z7a.png`,
    description:
      'Gorra negra con logo circular Villanova bordado. Perfil clásico para gym o calle.',
  },
  {
    id: 'gorra-blanca',
    name: 'Gorra Villanova Blanca',
    price: 329,
    stock: 12,
    category: 'gorra',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_2vrmz12vrmz12vrm.png`,
    description:
      'Gorra blanca con logo Villanova en contraste. Ligera y ajustable.',
  },
  {
    id: 'gorra-azul',
    name: 'Gorra Villanova Azul',
    price: 329,
    stock: 12,
    category: 'gorra',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_bcm91lbcm91lbcm9.png`,
    description:
      'Gorra azul con logo Villanova en blanco. Estilo club listo para Mazatlán.',
  },
  {
    id: 'gorra-guinda',
    name: 'Gorra Villanova Guinda',
    price: 329,
    stock: 10,
    category: 'gorra',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_aupekfaupekfaupe.png`,
    description:
      'Gorra guinda con branding oficial Villanova. Cómoda y con presencia.',
  },
  {
    id: 'gorra-oliva',
    name: 'Gorra Villanova Verde Olivo',
    price: 329,
    stock: 10,
    category: 'gorra',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_bsu74fbsu74fbsu7.png`,
    description:
      'Gorra verde olivo con logo Villanova. Look urbano para salir del gym.',
  },
  {
    id: 'gorra-rosa',
    name: 'Gorra Villanova Rosa',
    price: 329,
    stock: 10,
    category: 'gorra',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_q5123cq5123cq512.png`,
    description:
      'Gorra rosa con logo Villanova en blanco. Ajuste trasero y estilo club.',
  },
  {
    id: 'guantes-rosa',
    name: 'Guantes Villanova Rosas 8 oz',
    price: 1899,
    stock: 8,
    category: 'guante',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_9rchny9rchny9rch.png`,
    description:
      'Guantes de boxeo rosa con puño negro y logo dorado Villanova. Cierre de contacto, ideales para entrenar.',
  },
  {
    id: 'guantes-negro-blanco',
    name: 'Guantes Villanova Negro / Blanco 8 oz',
    price: 1899,
    stock: 8,
    category: 'guante',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_c2lzigc2lzigc2lz.png`,
    description:
      'Guantes Villanova 8 oz en negro y blanco con logo oficial. Para saco, mitts y sparring controlado.',
  },
  {
    id: 'guantes-rojo-blanco',
    name: 'Guantes Villanova Rojo / Blanco 8 oz',
    price: 1899,
    stock: 8,
    category: 'guante',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_q610jrq610jrq610.png`,
    description:
      'Guantes Villanova rojo y blanco, 8 oz. Branding del club y cierre velcro práctico.',
  },
  {
    id: 'guantes-azul-blanco',
    name: 'Guantes Villanova Azul / Blanco 8 oz',
    price: 1899,
    stock: 8,
    category: 'guante',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_umuavlumuavlumua.png`,
    description:
      'Guantes Villanova azul y blanco. Acolchado para entrenamiento diario en el gym.',
  },
  {
    id: 'guantes-negro-amarillo',
    name: 'Guantes Villanova Negro / Amarillo 8 oz',
    price: 1899,
    stock: 7,
    category: 'guante',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_tkdyzgtkdyzgtkdy.png`,
    description:
      'Guantes Villanova negro con acentos amarillos y logo oficial. Energía y presencia en el ring.',
  },
  {
    id: 'protector-negro',
    name: 'Protector de cabeza Villanova Negro',
    price: 1499,
    stock: 6,
    category: 'protector',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_cxqdcycxqdcycxqd.png`,
    description:
      'Careta de cabeza negra con logo Villanova. Acolchado para sparring y fogueo seguro.',
  },
  {
    id: 'protector-blanco',
    name: 'Protector de cabeza Villanova Blanco',
    price: 1499,
    stock: 5,
    category: 'protector',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_ep5rohep5rohep5r.png`,
    description:
      'Protector de cabeza blanco con logo Villanova. Visibilidad alta y ajuste seguro.',
  },
  {
    id: 'protector-rosa',
    name: 'Protector de cabeza Villanova Rosa',
    price: 1499,
    stock: 5,
    category: 'protector',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_1299pv1299pv1299.png`,
    description:
      'Protector de cabeza rosa con branding Villanova. Protección de pómulos para clases y sparring.',
  },
  {
    id: 'protector-amarillo',
    name: 'Protector de cabeza Villanova Amarillo',
    price: 1599,
    stock: 4,
    category: 'protector',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_he67j2he67j2he67.png`,
    description:
      'Protector de cabeza amarillo con barra facial y logo Villanova. Máxima protección en fogueo.',
  },
  {
    id: 'protector-plata',
    name: 'Protector de cabeza Villanova Plata',
    price: 1599,
    stock: 4,
    category: 'protector',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_j4dcm0j4dcm0j4dc.png`,
    description:
      'Protector de cabeza plata metálico con logo Villanova. Acabado premium para sparring intenso.',
  },
  {
    id: 'shaker-gris',
    name: 'Shaker Villanova Gris 700 ml',
    price: 249,
    stock: 25,
    category: 'shaker',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_52wehh52wehh52we.png`,
    description:
      'Shaker gris humo con tapa negra y logo Villanova. Ideal para proteína, creatina o pre-entreno.',
  },
  {
    id: 'shaker-transparente',
    name: 'Shaker Villanova Transparente 700 ml',
    price: 249,
    stock: 22,
    category: 'shaker',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_6mrg276mrg276mrg.png`,
    description:
      'Shaker transparente con bola mezcladora y branding Villanova. Libre de BPA y anti-derrames.',
  },
  {
    id: 'toalla-negra',
    name: 'Toalla Villanova Negra',
    price: 219,
    stock: 28,
    category: 'toalla',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_66mubv66mubv66mu.png`,
    description:
      'Toalla de microfibra negra con logo Villanova. Absorbente y compacta para tu bolsa de gym.',
  },
  {
    id: 'toalla-blanca',
    name: 'Toalla Villanova Blanca',
    price: 219,
    stock: 26,
    category: 'toalla',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_bn3ydebn3ydebn3y.png`,
    description:
      'Toalla blanca Villanova de microfibra. Suave, resistente y con branding oficial.',
  },
  {
    id: 'proteina-whey',
    name: 'Villanova Whey Proteína Chocolate 1.4 kg',
    price: 949,
    stock: 10,
    category: 'suplemento',
    brand: 'Villanova Boxing',
    image: `${IMG}/Gemini_Generated_Image_2v5ea02v5ea02v5e.png`,
    description:
      'Proteína whey sabor chocolate, presentación 1.4 kg, con branding Villanova Boxing. Apoya recuperación y fuerza.',
  },
];

/** Catálogo de tienda: siempre los artículos oficiales. */
export function loadShopCatalog(): ShopProduct[] {
  return mockShopProducts.filter((p) => p.stock > 0);
}

export function getShopProduct(id: string) {
  return mockShopProducts.find((p) => p.id === id);
}

/** Convierte catálogo Villanova a productos Admin (seed / sync). */
export function shopProductsAsAdminProducts(): Product[] {
  return mockShopProducts.map((p) => ({
    id: p.id,
    name: p.name,
    stock: p.stock,
    price: p.price,
    public: true,
    modifiedBy: 'Admin Villanova',
    image: p.image,
    active: p.stock > 0,
  }));
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function isVillanovaMemberForDiscount(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const current = getCurrentUser();
    if (current && (current.status === 'activo' || current.status === 'pendiente')) {
      return true;
    }

    const id = window.localStorage.getItem(CURRENT_USER_ID_KEY);
    if (id) {
      const user = getUserById(id);
      if (user && (user.status === 'activo' || user.status === 'pendiente')) return true;
    }

    const raw = window.localStorage.getItem(MEMBER_PROFILE_KEY);
    if (!raw) return false;
    const profile = JSON.parse(raw) as { status?: string };
    return (
      profile.status === 'activa' ||
      profile.status === 'por_vencer' ||
      profile.status === 'pendiente'
    );
  } catch {
    return false;
  }
}

export function memberUnitPrice(listPrice: number, isMember: boolean) {
  if (!isMember) return listPrice;
  return Math.round(listPrice * (1 - MEMBER_SHOP_DISCOUNT));
}

export function cartPricing(items: CartItem[], isMember: boolean) {
  const subtotal = cartSubtotal(items);
  if (!isMember || subtotal <= 0) {
    return { subtotal, discount: 0, total: subtotal, isMember: false };
  }
  const discount = Math.round(subtotal * MEMBER_SHOP_DISCOUNT);
  return {
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    isMember: true,
  };
}
