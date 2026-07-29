/**
 * Autenticación social (Google) — experiencia estándar de One-Tap / cuenta Google.
 * Persistencia local; misma sesión que el resto del portal.
 */

import { persistMemberSession } from '@/lib/portal/auth-session';
import {
  getSubscriptionPlan,
} from '@/lib/portal/subscription-plans';
import {
  getUserByEmail,
  loadUsers,
  saveUsers,
  setCurrentUserId,
  type PortalUser,
} from '@/lib/portal/users';

export type GoogleAccountOption = {
  id: string;
  name: string;
  email: string;
  /** Color del avatar cuando no hay foto de la cuenta. */
  avatarColor: string;
  /** Foto de perfil de la cuenta de Google, si la entrega el token. */
  picture?: string;
};

/** Client ID de Google Identity Services; sin él se usa el acceso por correo. */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

const AVATAR_COLORS = ['#4285F4', '#EA4335', '#34A853', '#FBBC05', '#A142F4'];

export function avatarColorForEmail(email: string) {
  const seed = email
    .toLowerCase()
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_COLORS[seed % AVATAR_COLORS.length];
}

type GoogleIdTokenPayload = {
  sub?: string;
  name?: string;
  given_name?: string;
  email?: string;
  picture?: string;
};

/** Lee el ID token (JWT) que devuelve Google Identity Services. */
export function accountFromGoogleCredential(credential: string): GoogleAccountOption | null {
  try {
    const [, payload] = credential.split('.');
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );

    const data = JSON.parse(json) as GoogleIdTokenPayload;
    if (!data.email) return null;

    const email = data.email.trim().toLowerCase();
    return {
      id: data.sub || email,
      name: (data.name || data.given_name || email.split('@')[0]).trim(),
      email,
      avatarColor: avatarColorForEmail(email),
      picture: data.picture,
    };
  } catch {
    return null;
  }
}

/** Cuentas de Google ya usadas en este dispositivo. */
export function knownGoogleAccounts(): GoogleAccountOption[] {
  return loadUsers()
    .filter((user) => user.authProvider === 'google')
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarColor: avatarColorForEmail(user.email),
    }));
}

function todayLabel() {
  return new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function memberInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'V';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export type GoogleSignInResult = {
  user: PortalUser;
  isNew: boolean;
};

/**
 * Registra o inicia sesión con una cuenta Google.
 * Usuario nuevo → pendiente (sin vigencia hasta pagar).
 * Usuario existente → reutiliza datos y mantiene membresía.
 */
export function signInWithGoogleAccount(
  account: GoogleAccountOption,
  options?: { planId?: string },
): GoogleSignInResult {
  loadUsers();
  const existing = getUserByEmail(account.email);
  const plan = getSubscriptionPlan(
    options?.planId || existing?.planId || 'individual',
  );

  if (existing) {
    const next: PortalUser = {
      ...existing,
      name: existing.name || account.name,
      authProvider: 'google',
      ...(options?.planId && existing.status === 'pendiente'
        ? { planId: plan.id, planName: plan.name }
        : {}),
    };
    const users = loadUsers().map((u) => (u.id === next.id ? next : u));
    saveUsers(users);
    setCurrentUserId(next.id);
    persistMemberSession(next);
    return { user: next, isNew: false };
  }

  const user: PortalUser = {
    id: `u_g_${Date.now().toString(36)}`,
    name: account.name.trim(),
    email: account.email.trim().toLowerCase(),
    phone: '',
    password: `google_${account.id}`,
    planId: plan.id,
    planName: plan.name,
    status: 'pendiente',
    amountPaid: 0,
    createdAt: new Date().toISOString(),
    expiresAt: '—',
    memberSince: todayLabel(),
    authProvider: 'google',
  };

  const users = loadUsers().filter((u) => u.email.toLowerCase() !== user.email);
  users.push(user);
  saveUsers(users);
  setCurrentUserId(user.id);
  persistMemberSession(user);

  return { user, isNew: true };
}

/** Tras auth: cookie de sesión + destino según plan / estado. */
export async function completeMemberBrowserSession(user: PortalUser) {
  const response = await fetch('/api/member/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
      name: user.name,
    }),
  });
  if (!response.ok) {
    throw new Error('No se pudo iniciar sesión.');
  }
}

export function destinationAfterAuth(
  user: PortalUser,
  options?: { planId?: string | null; next?: string | null },
) {
  const next = options?.next;
  if (next && next.startsWith('/app') && !next.startsWith('/app/login') && !next.startsWith('/app/registro')) {
    return next;
  }

  const planId = options?.planId || undefined;
  const needsPay = user.status === 'pendiente' || user.expiresAt === '—';

  if (needsPay && planId) {
    return `/app/pagar?planId=${encodeURIComponent(planId)}&concepto=membresia`;
  }
  if (needsPay) {
    return '/app?accion=elegir-plan';
  }
  return '/app';
}
