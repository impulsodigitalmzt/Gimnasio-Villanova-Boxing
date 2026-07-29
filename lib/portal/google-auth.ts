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
  /** Iniciales o color de avatar */
  avatarColor: string;
};

/** Cuentas de ejemplo estilo selector de Google. */
export const GOOGLE_ACCOUNT_OPTIONS: GoogleAccountOption[] = [
  {
    id: 'g_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@gmail.com',
    avatarColor: '#4285F4',
  },
  {
    id: 'g_maria',
    name: 'María López',
    email: 'maria.lopez.mz@gmail.com',
    avatarColor: '#EA4335',
  },
  {
    id: 'g_carlos',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@gmail.com',
    avatarColor: '#34A853',
  },
];

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
