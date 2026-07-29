import type {
  Challenge,
  DayClass,
  DayRoutine,
  MemberProfile,
  MembershipStatus,
} from '@/lib/portal/types';
import { galleryPhotos, healthyEnvironmentPhoto } from '@/lib/media';

/**
 * Datos de simulación del Portal del Socio (Villanova Boxing).
 */
export const DEMO_MEMBER_STATUS: MembershipStatus = 'activa';

export const demoMember: MemberProfile = {
  id: 'm_usuario_demo',
  name: 'Alex Rivera',
  email: 'socio@villanovaboxing.mx',
  phone: '6691587875',
  planId: 'duo',
  planName: 'Dúo / Compañero',
  status: DEMO_MEMBER_STATUS,
  expiresAt: '15/08/2026',
  memberSince: '03/02/2026',
  lastPaymentAt: '2026-02-03T10:05:00.000Z',
  amountPaid: 1100,
  authProvider: 'email',
};

/** Precio de renovación por defecto (plan Individual). */
export const membershipRenewalPrice = 650;

export const todayClass: DayClass = {
  id: 'cls_box_tecnica_1800',
  time: '18:00',
  name: 'Técnica Base',
  coach: 'Coach Villanova',
  room: 'Área de mitts',
  reserved: true,
  wod: '3 rounds: 3 min sombra + 2 min costal + 1 min core',
};

export const todayRoutine: DayRoutine = {
  title: 'Rutina del día',
  focus: 'Técnica · Resistencia',
  blocks: [
    { label: 'Warm-up', detail: 'Salto de cuerda 5 min · movilidad de hombros' },
    {
      label: 'Principal',
      detail: '3 rounds: 3 min sombra + 2 min costal + 1 min core',
    },
    { label: 'Cooldown', detail: 'Estiramiento de hombros y cadera 5 min' },
  ],
};

/** Horario semanal del alumno (contenido post-pago). */
export const weeklyClassSchedule: {
  day: string;
  slots: { time: string; name: string; coach: string }[];
}[] = [
  {
    day: 'Lunes',
    slots: [
      { time: '07:00', name: 'Cardio Box', coach: 'Coach Villanova' },
      { time: '18:00', name: 'Técnica Base', coach: 'Coach Villanova' },
    ],
  },
  {
    day: 'Martes',
    slots: [
      { time: '07:00', name: 'Costales & Resistencia', coach: 'Coach Villanova' },
      { time: '19:00', name: 'Mitts', coach: 'Coach Villanova' },
    ],
  },
  {
    day: 'Miércoles',
    slots: [
      { time: '07:00', name: 'Técnica Base', coach: 'Coach Villanova' },
      { time: '18:00', name: 'Boxeo Juvenil', coach: 'Coach Villanova' },
    ],
  },
  {
    day: 'Jueves',
    slots: [
      { time: '07:00', name: 'Acondicionamiento', coach: 'Coach Villanova' },
      { time: '19:00', name: 'Sparring técnico', coach: 'Coach Villanova' },
    ],
  },
  {
    day: 'Viernes',
    slots: [
      { time: '07:00', name: 'Cardio Box', coach: 'Coach Villanova' },
      { time: '18:00', name: 'Técnica Base', coach: 'Coach Villanova' },
    ],
  },
  {
    day: 'Sábado',
    slots: [{ time: '09:00', name: 'Open gym + sombra', coach: 'Coach Villanova' }],
  },
];


export const activeChallenges: Challenge[] = [
  {
    id: 'reto-30-dias',
    title: 'Reto 30 días',
    description:
      'Constancia en costales y clases guiadas durante un mes completo. Ideal para crear el hábito Villanova.',
    price: 500,
    endsAt: '30/08/2026',
    joined: false,
    image: galleryPhotos[1].src,
    cta: 'Inscribirme',
    audience: 'Todos los niveles · Niños, jóvenes y adultos',
    highlights: [
      'Plan de asistencia de 30 días',
      'Seguimiento digital de progreso',
      'Rutinas base digitalizadas incluidas',
    ],
  },
  {
    id: 'semana-potencia',
    title: 'Semana de Potencia',
    description:
      'Mejora tu potencia en sacos y mitts con sesiones intensas y técnicas guiadas durante 7 días.',
    price: 300,
    endsAt: '24/08/2026',
    joined: false,
    image: galleryPhotos[2].src,
    cta: 'Inscribirme',
    audience: 'Intermedio / Avanzado',
    highlights: [
      'Enfoque en potencia y timing',
      'Trabajo en costales y mitts',
      'Medición de mejora al cierre',
    ],
  },
  {
    id: 'reto-comunidad',
    title: 'Reto Comunidad',
    description:
      'Entrena en equipo: amigos, familia o compañeros. Ambiente sano e inclusivo para todas las edades.',
    price: 400,
    endsAt: '10/09/2026',
    joined: false,
    image: healthyEnvironmentPhoto,
    cta: 'Inscribirme',
    audience: 'Grupos · Hasta varios integrantes',
    highlights: [
      'Dinámicas en equipo',
      'Compatible con plan Dúo o Grupal',
      'Participación en dinámicas recreativas',
    ],
  },
];

export function createDemoMember(overrides?: Partial<MemberProfile>): MemberProfile {
  return {
    ...demoMember,
    ...overrides,
  };
}

export function getMembershipLabel(profile: MemberProfile) {
  return `${profile.planName} - Vence ${profile.expiresAt}`;
}
