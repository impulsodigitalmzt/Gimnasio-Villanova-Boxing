/**
 * Portal del Socio — tipos y sesión.
 * Los mocks de demo viven en `lib/portal/mock-data.ts`.
 */

export type MembershipStatus = 'activa' | 'vencida' | 'por_vencer' | 'pendiente';

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  planId: string;
  planName: string;
  status: MembershipStatus;
  expiresAt: string;
  memberSince: string;
  /** Último pago confirmado (ISO). */
  lastPaymentAt?: string;
  amountPaid?: number;
  authProvider?: 'email' | 'google';
};

export type DayClass = {
  id: string;
  time: string;
  name: string;
  coach: string;
  room: string;
  reserved: boolean;
  /** Texto de la rutina del día (demo). */
  wod?: string;
};

export type DayRoutine = {
  title: string;
  focus: string;
  blocks: { label: string; detail: string }[];
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  price: number;
  endsAt: string;
  joined: boolean;
  image: string;
  cta?: string;
  /** Público objetivo (vitrina pública). */
  audience?: string;
  /** Beneficios destacados para publicidad. */
  highlights?: string[];
};

export const MEMBER_SESSION_COOKIE = 'villanova_member_session';
export const MEMBER_PROFILE_KEY = 'villanova_member_profile';

export function getMemberSessionToken() {
  return process.env.MEMBER_SESSION_SECRET || 'villanova-member-dev-session';
}

export function isValidMemberSession(token: string | undefined | null) {
  return Boolean(token && token === getMemberSessionToken());
}

export function getMemberDemoCredentials() {
  return {
    email: process.env.MEMBER_EMAIL || 'socio@villanovaboxing.mx',
    password: process.env.MEMBER_PASSWORD || 'villanovasocio',
  };
}

export {
  createDemoMember,
  demoMember,
  todayClass,
  todayRoutine,
  activeChallenges,
  membershipRenewalPrice,
  getMembershipLabel,
  DEMO_MEMBER_STATUS,
} from '@/lib/portal/mock-data';
