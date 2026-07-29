/**
 * Catálogo multimedia oficial Villanova Boxing.
 * Rutas reales bajo /public (foto, video, logo, tienda).
 */

const F = (name: string) => `/foto/${name}`;
const V = (name: string) => `/video/${name}`;
const H = (name: string) => `/video/hero/${name}`;

export const brandAssets = {
  /** Logo oficial negro — usar sobre fondos claros/blancos */
  logoBlack: '/logo-black.png',
  /** Logo oficial blanco — usar sobre fondos oscuros */
  logoWhite: '/logo-white.png',
  /** Alias por compatibilidad: default = blanco (sitio oscuro) */
  logo: '/logo-white.png',
  logoGold: '/logo-gold.png',
  /** Carrito de compras — fondo claro */
  cartIcon: '/logo/carrito-de-compras.png',
  /** Carrito de compras — fondo oscuro */
  cartIconWhite: '/logo/carrito-de-compras-white.png',
  /** Logo dorado circular (hero — hold entre videos) */
  heroLogoMark: '/logo-gold-circle.png',
  /** B-roll de apertura del hero */
  heroOpenVideo: '/video/hero/AQMq9nCLy7p.mp4',
  /** Video tipográfico del Hero */
  heroVideo: '/logo/hero.mp4',
  heroGoldVideo: '/logo/hero.mp4',
  introAltVideo: '/logo/PUEDES_GENERAR_UN_VIDEO_CON_MO.mp4',
  /** Intro del logo (cierra el ciclo del hero) */
  introLogoVideo: '/logo/villanova_boxing_intro.mp4',
} as const;

/** Fotos de instalaciones y entrenamientos (orden editorial). */
export const galleryPhotos = [
  {
    src: F('536624422_18063859322252708_3193060558709127234_n.jpg'),
    tag: 'Equipo',
    title: 'Staff Villanova',
    copy: 'Coaches, auxiliares y mitts listos para guiar cada sesión.',
  },
  {
    src: F('536916555_18063859301252708_3376128513473052173_n.jpg'),
    tag: 'Entrenamiento',
    title: 'Trabajo en costales',
    copy: 'Área de sacos para potencia, ritmo y resistencia.',
  },
  {
    src: F('539665997_18064231181252708_1542394678572415758_n.jpg'),
    tag: 'Técnica',
    title: 'Mitts y precisión',
    copy: 'Combinaciones guiadas para refinar golpe y guardia.',
  },
  {
    src: F('542062323_18065467166252708_2909991630370552492_n.jpg'),
    tag: 'Instalaciones',
    title: 'El ring',
    copy: 'Espacio central para sparring controlado y clases.',
  },
  {
    src: F('708312557_18092476970252708_3800250178427868312_n.jpg'),
    tag: 'Clases',
    title: 'Clase grupal',
    copy: 'Energía colectiva con niveles para todos.',
  },
  {
    src: F('542873408_18065467190252708_3397859497609910035_n.jpg'),
    tag: 'Fuerza',
    title: 'Acondicionamiento',
    copy: 'Zona de fuerza y movilidad para complementar el box.',
  },
  {
    src: F('549236973_18066335120252708_7520366317065310157_n.jpg'),
    tag: 'Entrenamiento',
    title: 'Sombra y footwork',
    copy: 'Movimiento, timing y disciplina en cada ronda.',
  },
  {
    src: F('550191506_18066335102252708_1252810529722620648_n.jpg'),
    tag: 'Instalaciones',
    title: 'Área de costales',
    copy: 'Acceso ilimitado a sacos en planes Individual y superiores.',
  },
  {
    src: F('700692238_18091330523252708_5158142353939480374_n.jpg'),
    tag: 'Comunidad',
    title: 'Ambiente sano',
    copy: 'Niños, jóvenes y adultos en un mismo espacio inclusivo.',
  },
  {
    src: F('708394396_18092477006252708_553574689234168136_n.jpg'),
    tag: 'Clases',
    title: 'Sesión guiada',
    copy: 'Rutinas estructuradas por edad y nivel técnico.',
  },
  {
    src: F('565536406_18070385222252708_2515150245455090471_n.jpg'),
    tag: 'Entrenamiento',
    title: 'Intensidad controlada',
    copy: 'Progresión segura con supervisión profesional.',
  },
  {
    src: F('566397486_18070499729252708_543158151437808200_n.jpg'),
    tag: 'Instalaciones',
    title: 'El gym por dentro',
    copy: 'Instalaciones listas para entrenar a cualquier hora del día.',
  },
] as const;

/** Comunidad y eventos — enfatiza inclusión intergeneracional. */
export const communityPhotos = [
  F('700692238_18091330523252708_5158142353939480374_n.jpg'),
  F('702241005_18091330469252708_7369719696191240629_n.jpg'),
  F('702779349_18091838594252708_5495850547179898574_n.jpg'),
  F('703031953_18091838621252708_9081536507058127967_n.jpg'),
  F('703136403_18091596572252708_5129811594791606189_n.jpg'),
  F('703861374_18091838600252708_4936286768927607415_n.jpg'),
  F('708312557_18092476970252708_3800250178427868312_n.jpg'),
  F('708376910_18092476988252708_2669977634648699479_n.jpg'),
  F('708394396_18092477006252708_553574689234168136_n.jpg'),
  F('709467682_18092477015252708_7324175404055360107_n.jpg'),
  F('709507525_18092476997252708_3201288266094259731_n.jpg'),
  F('720950183_18094003004252708_2293944320807538582_n.jpg'),
] as const;

/** Fotos oficiales de clases grupales. */
export const groupClassPhotos = [
  F('708312557_18092476970252708_3800250178427868312_n.jpg'),
  F('708394396_18092477006252708_553574689234168136_n.jpg'),
] as const;

/** Foto oficial de ambiente sano / comunidad inclusiva. */
export const healthyEnvironmentPhoto =
  F('700692238_18091330523252708_5158142353939480374_n.jpg');

const Q = (name: string) => `/quien-soy/${name}`;

/** Fotos de Irving Villanova — sección Quién soy. */
export const irvingPhotos = {
  hero: Q('irving-01.webp'),
  portrait: Q('irving-02.webp'),
  coaching: Q('irving-03.webp'),
  gym: Q('irving-04.webp'),
  training: [
    Q('572794723_18072374147252708_8142485927723460769_n.jpg'),
    Q('588452747_18074672138252708_2813177631634367706_n.jpg'),
    Q('589021729_18075751046252708_8109147163190945109_n.jpg'),
    Q('590413602_18075751058252708_9052700299277061807_n.jpg'),
  ],
} as const;

/** Carrusel de ambiente / entrenamientos. */
export const trainingPhotos = [
  F('571550459_18071765051252708_8558751538893529230_n.jpg'),
  F('572155232_18071661611252708_7320070058050383345_n.jpg'),
  F('572794723_18072374147252708_8142485927723460769_n.jpg'),
  F('573063224_18071846798252708_3833493042739250965_n.jpg'),
  F('588452747_18074672138252708_2813177631634367706_n.jpg'),
  F('589021729_18075751046252708_8109147163190945109_n.jpg'),
  F('590395683_18074672150252708_4197829878682102564_n.jpg'),
  F('590413602_18075751058252708_9052700299277061807_n.jpg'),
  F('607733971_18077372804252708_8799002362709695294_n.jpg'),
  F('608322749_18077372750252708_911661072487905708_n.jpg'),
  F('608391824_18077372816252708_570943303787563709_n.jpg'),
  F('609178924_18077372825252708_4696721315883744891_n.jpg'),
] as const;

export const facilityPhotos = [
  F('609227310_18077372861252708_829467648921696775_n.jpg'),
  F('618980718_18079019615252708_737273913862679807_n.jpg'),
  F('630042361_18081733886252708_7629612342600906061_n.jpg'),
  F('632357911_18081733898252708_7558918231299320011_n.jpg'),
  F('670287966_18088049861252708_6430741202195680483_n.jpg'),
  F('694605192_18090746717252708_6310615972385733572_n.jpg'),
  F('695757287_18090962975252708_1649704728924832858_n.jpg'),
] as const;

/** Reels / videos institucionales (fuera del hero dorado). */
export const reels = {
  tour: V('AQM5_KvJ80YynQ7O9075pt_3EekBJEEKw8Xi_qC9RmsW6crjYFiAUOLTahwiWaIoB_uEysJL15QgQ3O1xodWDM07BoXc-0P0HcK4ZAk.mp4'),
  /** Entrenamiento por estaciones: costales, air bike y plataformas */
  equipment: V('AQNwsWtXY-EIPseRvehgxqTEFZkT9odrW3ota4RQ3AlucCc8epOka4ngkUKUKFF4K2VJbsbtF2yb-y4UEcAK2xZe.mp4'),
  /** Entrenamiento de costales / sacos (video oficial) */
  bags: V('AQPgrZG5V0Ox0Ge3bXjGI5JjoA4oNYzWhvRxu0xkHcEytA2W5NXVHQKKjB7tHX9ojivH8DC7IntGzUhwcgnslcO9cqjbF4UTQgooxb0.mp4'),
  class: V('AQMrIy-0YAX87zgtczOuNX9eP7oFMWXx2GB5fK5zLk2uFZ4hkayU56kFPbkzfmZHsU_WJT2AVl-ePP9PpxyXLCDQAo96Csmiy7yPJmo.mp4'),
  community: V('AQMUqBBeCmHcvhjofUAqadhFjjEOk4hEBoHOURa-2-DgB8KYsnCj3PW5Cvph0awa-586QeQn2aYuXuEjuRPZS3XnJA9kwriiD7hbm6A.mp4'),
  mitts: V('AQN7ABgtUE0tgNUlWxKfiUPP6W-IPez2D6Mf6Cf0GpRZPyh6Z5ZRrcDBfKPWs0unBPwQwWjAAqRy2UoKRXta_GpHXWnv8r52NZ7rlew.mp4'),
  shadow: V('AQNcpnTKe9yiEnTfxPaCID-mvsW5-nfyvWPNX5k_QNYxha9PooiDhWB9LuDKmruv4EHCKQ5VuTbKguo8ZyiEIniynVe8y5PLeFpa0Gc.mp4'),
  kids: V('AQOdF_V8pQH5lmd_jZxfv2khYXzzKUMv8XCRRK8Vjuz9UPXDGtoxnTX70EoBjUD4TVO1S1Mpi0XTdFvRRkXyntA2rYu0Q_DqDULl_3f3ZQ.mp4'),
  strength: V('AQONb3ANozInXhrIwgdEJv8EcZKjejeqg_FKosfh0lmnPW33-yospN7-qJhTt6v8Woz1JCzsjzxyQfesrFzVEfMMO0xvX5oQrsdbMp4.mp4'),
  ring: V('AQP8BKVgtveuW2wgfYRCy81T3pwnZTRyBhj6OpkphW6NFtzKpQKDC9OItFTwLOUF6QxvBnMxXxKHHIh4VPkJs15Peud_vAdH4HkhUW0e8A.mp4'),
  pads: V('AQPFJ3CCUmYHXPqiopNy-KsJo33AWCLWmzFVQElOJPsCdf2QOjoOP2qSk7QxMgM1J1LPitvcfr5EtczToWfvofX8lb38nPYYB-dNjms.mp4'),
  cardio: V('AQPfMf7l7byf465pKzEcw-aU1AR4NwoupUpXmkb1iGiWxXSKsQgBMtqSZ5_tJQBzfSa6jbJEiHfoPieeW7E7p6r8EgETzXY3RVvzJaIQXw.mp4'),
  /** Mismo video oficial de costales */
  atmosphere: V('AQPgrZG5V0Ox0Ge3bXjGI5JjoA4oNYzWhvRxu0xkHcEytA2W5NXVHQKKjB7tHX9ojivH8DC7IntGzUhwcgnslcO9cqjbF4UTQgooxb0.mp4'),
  heroBrollA: H('AQMKrhj1Ra8JFaIJkuLdsq8sJln2oisPN-T56-EOW80Ns-dzSHnTP-YEYvIX2mnErONDypJ0_1U6WGxcXX1Iw-sLEZR7scSJUqk.mp4'),
  heroBrollB: H('AQMq9nCLy7pqYwc9gNF5085CbtdD6sAF3me1oqMmcfG_skby0jKt4Li0GRs_uZr-ih-bwm3rLFoezjOSeouMcdd0nripCvaPENMs9ObTPg.mp4'),
} as const;

export const heroPoster = galleryPhotos[3].src;
