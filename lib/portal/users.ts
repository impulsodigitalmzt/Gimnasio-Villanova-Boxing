/**
 * Base de usuarios del Portal (simulación).
 * Persistencia en localStorage; el seed vive en este archivo para edición fácil.
 *
 * Flujo operativo:
 * registro (pendiente, sin vigencia) → pago → activo + expiresAt = pago + 30 días
 * → CRM sync + bienvenida + recordatorio 3 días antes
 */

import {
  getSubscriptionCheckoutAmount,
  getSubscriptionPlan,
} from '@/lib/portal/subscription-plans';
import type { MemberProfile, MembershipStatus } from '@/lib/portal/types';
import { syncPortalUsersToAdmin } from '@/lib/portal/sync-admin';
import {
  queueWelcomeAutomation,
  scheduleExpiryReminder,
} from '@/lib/portal/automations';
import {
  daysUntilExpiry,
  expiryLabelFromPayment,
  reminderDateFromExpiry,
  resolvePortalDbStatusFromExpiry,
  resolvePortalUiStatusFromExpiry,
  EXPIRY_REMINDER_DAYS,
} from '@/lib/portal/membership-lifecycle';

export const USERS_STORAGE_KEY = 'villanova_portal_users_v1';
export const CURRENT_USER_ID_KEY = 'villanova_portal_current_user_id';

/** Estado en la “DB” de socios (JSON). */
export type PortalUserStatus = 'pendiente' | 'activo' | 'vencido';

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  /** WhatsApp / teléfono de contacto. */
  phone?: string;
  password: string;
  planId: string;
  planName: string;
  status: PortalUserStatus;
  amountPaid: number;
  createdAt: string;
  activatedAt?: string;
  /** '—' hasta el pago; luego DD/MM/AAAA = fecha de pago + 30 días */
  expiresAt: string;
  memberSince: string;
  authProvider?: 'email' | 'google';
  /** Retos adquiridos / inscritos (ids del catálogo). */
  challengeIds?: string[];
  /** Nivel de entrenamiento declarado en el portal. */
  trainingLevel?: 'principiante' | 'intermedio' | 'avanzado';
  /** Snapshot de seguimiento para el CRM. */
  primaryClassName?: string;
  lastWorkoutTitle?: string;
  sessionsThisWeek?: number;
  streakDays?: number;
  completedSessionsCount?: number;
  trainingUpdatedAt?: string;
  /** Asistencia física (check-in QR en recepción). */
  lastCheckInAt?: string;
  checkInsThisMonth?: number;
  daysSinceLastVisit?: number;
  attendanceRisk?: 'ok' | 'baja' | 'en_riesgo' | 'sin_registro';
};

/**
 * Política administrativa post-pago.
 * - 'activo' → entra al dashboard como socio activo
 * - 'pendiente' → pago OK pero espera activación manual
 */
export const ACTIVATION_POLICY = {
  postPaymentStatus: 'activo' as Extract<PortalUserStatus, 'activo' | 'pendiente'>,
};

/** Seed editable — usuarios de demo iniciales. */
export const seedUsers: PortalUser[] = [
  {
    id: 'u_demo',
    name: 'Alex Rivera',
    email: 'socio@villanovaboxing.mx',
    phone: '6691587875',
    password: 'villanovasocio',
    planId: 'duo',
    planName: 'Dúo / Compañero',
    status: 'activo',
    amountPaid: 1100,
    createdAt: '2026-02-03T10:00:00.000Z',
    activatedAt: '2026-02-03T10:05:00.000Z',
    expiresAt: '15/08/2026',
    memberSince: '03/02/2026',
    authProvider: 'email',
    challengeIds: ['reto-30-dias'],
    trainingLevel: 'intermedio',
    primaryClassName: 'Técnica Base',
    lastWorkoutTitle: 'Rutina de Técnica Base',
    sessionsThisWeek: 2,
    streakDays: 2,
    completedSessionsCount: 8,
    trainingUpdatedAt: '2026-07-29T12:00:00.000Z',
  },
];

function todayLabel() {
  return new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function portalStatusToMembership(
  status: PortalUserStatus,
  expiresAt?: string,
): MembershipStatus {
  if (expiresAt) return resolvePortalUiStatusFromExpiry(expiresAt, status);
  if (status === 'activo') return 'activa';
  if (status === 'vencido') return 'vencida';
  return 'pendiente';
}

export function membershipToPortalStatus(status: MembershipStatus): PortalUserStatus {
  if (status === 'activa' || status === 'por_vencer') return 'activo';
  if (status === 'pendiente') return 'pendiente';
  return 'vencido';
}

export function userToMemberProfile(user: PortalUser): MemberProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    planId: user.planId,
    planName: user.planName,
    status: portalStatusToMembership(user.status, user.expiresAt),
    expiresAt: user.expiresAt === '—' ? 'Pendiente de pago' : user.expiresAt,
    memberSince: user.memberSince,
    lastPaymentAt: user.activatedAt,
    amountPaid: user.amountPaid,
    authProvider: user.authProvider ?? 'email',
  };
}

function canUseStorage() {
  return typeof window !== 'undefined';
}

function mergeWithSeed(users: PortalUser[]): PortalUser[] {
  const emails = new Set(users.map((u) => u.email.toLowerCase()));
  const merged = [...users];
  for (const seed of seedUsers) {
    if (!emails.has(seed.email.toLowerCase())) {
      merged.unshift(seed);
    }
  }
  return merged;
}

function runLifecycleAutomations(user: PortalUser) {
  if (user.status !== 'activo' || user.expiresAt === '—') return;

  queueWelcomeAutomation({
    memberId: user.id,
    memberName: user.name,
    memberEmail: user.email,
    phone: user.phone,
  });

  const reminderAt = reminderDateFromExpiry(user.expiresAt);
  if (!reminderAt) return;
  const days = daysUntilExpiry(user.expiresAt);
  scheduleExpiryReminder({
    memberId: user.id,
    memberName: user.name,
    memberEmail: user.email,
    phone: user.phone,
    expiresAt: user.expiresAt,
    reminderDateIso: reminderAt.toISOString(),
    dueNow: days !== null && days <= EXPIRY_REMINDER_DAYS,
  });
}

/**
 * Recalcula vencidos según fecha y reprograma recordatorios cercanos.
 * Idempotente; se llama al cargar/guardar usuarios.
 */
export function refreshMembershipLifecycle(users: PortalUser[]): PortalUser[] {
  let changed = false;
  const next = users.map((user) => {
    if (user.status === 'pendiente' || user.expiresAt === '—') return user;
    const resolved = resolvePortalDbStatusFromExpiry(user.expiresAt, user.status);
    if (resolved !== user.status) {
      changed = true;
      return { ...user, status: resolved };
    }
    return user;
  });

  // Recordatorios para socios activos por vencer
  for (const user of next) {
    if (user.status !== 'activo' || user.expiresAt === '—') continue;
    const days = daysUntilExpiry(user.expiresAt);
    if (days === null) continue;
    if (days >= 0 && days <= EXPIRY_REMINDER_DAYS) {
      const reminderAt = reminderDateFromExpiry(user.expiresAt);
      if (reminderAt) {
        scheduleExpiryReminder({
          memberId: user.id,
          memberName: user.name,
          memberEmail: user.email,
          phone: user.phone,
          expiresAt: user.expiresAt,
          reminderDateIso: reminderAt.toISOString(),
          dueNow: true,
        });
      }
    }
  }

  return changed ? next : users;
}

export function loadUsers(): PortalUser[] {
  if (!canUseStorage()) return [...seedUsers];
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const seed = refreshMembershipLifecycle([...seedUsers]);
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seed));
      syncPortalUsersToAdmin(seed);
      return seed;
    }
    const parsed = JSON.parse(raw) as PortalUser[];
    let list = mergeWithSeed(Array.isArray(parsed) ? parsed : []);
    list = refreshMembershipLifecycle(list);
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch {
    return [...seedUsers];
  }
}

export function saveUsers(users: PortalUser[]) {
  if (!canUseStorage()) return;
  const next = refreshMembershipLifecycle(users);
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(next));
  syncPortalUsersToAdmin(next);
  window.dispatchEvent(new CustomEvent('villanova-portal-users-updated'));
}

export function getUserById(id: string) {
  return loadUsers().find((u) => u.id === id) ?? null;
}

export function getUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return loadUsers().find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export function getCurrentUserId() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(CURRENT_USER_ID_KEY);
}

export function setCurrentUserId(id: string | null) {
  if (!canUseStorage()) return;
  if (!id) {
    window.localStorage.removeItem(CURRENT_USER_ID_KEY);
    return;
  }
  window.localStorage.setItem(CURRENT_USER_ID_KEY, id);
}

export function getCurrentUser() {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUserById(id);
}

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  planId: string;
};

/** Crea registro en estado 'pendiente' (espera pago). Sin vigencia hasta pagar. */
export function registerUser(input: RegisterUserInput): PortalUser {
  const plan = getSubscriptionPlan(input.planId);
  const existing = getUserByEmail(input.email);

  const user: PortalUser = {
    id: existing?.id ?? `u_${Date.now().toString(36)}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    password: input.password,
    planId: plan.id,
    planName: plan.name,
    status: 'pendiente',
    amountPaid: 0,
    createdAt: new Date().toISOString(),
    expiresAt: '—',
    memberSince: todayLabel(),
    authProvider: 'email',
  };

  const users = loadUsers().filter((u) => u.email.toLowerCase() !== user.email);
  users.push(user);
  saveUsers(users);
  setCurrentUserId(user.id);

  return user;
}

/** Actualiza datos de perfil del alumno (nombre / WhatsApp). */
export function updatePortalUserProfile(
  userId: string,
  patch: { name?: string; phone?: string },
): PortalUser | null {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return null;
  const next: PortalUser = {
    ...users[index],
    ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
    ...(patch.phone !== undefined ? { phone: patch.phone.trim() } : {}),
  };
  users[index] = next;
  saveUsers(users);
  setCurrentUserId(next.id);
  return next;
}

/** Inscribe al alumno en un reto y lo refleja en el CRM. */
export function enrollPortalUserChallenge(
  userId: string,
  challengeId: string,
): PortalUser | null {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return null;
  const current = users[index];
  const ids = new Set(current.challengeIds || []);
  ids.add(challengeId);
  const next: PortalUser = {
    ...current,
    challengeIds: [...ids],
    trainingUpdatedAt: new Date().toISOString(),
  };
  users[index] = next;
  saveUsers(users);
  return next;
}

/** Actualiza el snapshot de entrenamiento para seguimiento CRM. */
export function updatePortalUserTraining(
  userId: string,
  patch: {
    trainingLevel?: PortalUser['trainingLevel'];
    primaryClassName?: string;
    lastWorkoutTitle?: string;
    sessionsThisWeek?: number;
    streakDays?: number;
    completedSessionsCount?: number;
  },
): PortalUser | null {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return null;
  const next: PortalUser = {
    ...users[index],
    ...patch,
    trainingUpdatedAt: new Date().toISOString(),
  };
  users[index] = next;
  saveUsers(users);
  return next;
}

/**
 * Activa tras pago.
 * Status → activo (Cliente Activo en CRM), expiresAt = hoy + 30 días.
 */
export function activateUserAfterPayment(
  userId: string,
  options?: { planId?: string; amountPaid?: number },
): PortalUser | null {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return null;

  const previous = users[index];
  const wasProspect = previous.status === 'pendiente' || previous.expiresAt === '—';
  const paidAt = new Date();
  const plan = getSubscriptionPlan(options?.planId ?? previous.planId);
  const next: PortalUser = {
    ...previous,
    planId: plan.id,
    planName: plan.name,
    status: ACTIVATION_POLICY.postPaymentStatus,
    amountPaid: options?.amountPaid ?? getSubscriptionCheckoutAmount(plan.id).total,
    activatedAt: paidAt.toISOString(),
    expiresAt:
      ACTIVATION_POLICY.postPaymentStatus === 'activo'
        ? expiryLabelFromPayment(paidAt)
        : '—',
  };

  users[index] = next;
  saveUsers(users);
  setCurrentUserId(next.id);

  if (next.status === 'activo') {
    if (wasProspect) {
      queueWelcomeAutomation({
        memberId: next.id,
        memberName: next.name,
        memberEmail: next.email,
        phone: next.phone,
      });
    }
    const reminderAt = reminderDateFromExpiry(next.expiresAt);
    if (reminderAt) {
      const days = daysUntilExpiry(next.expiresAt);
      scheduleExpiryReminder({
        memberId: next.id,
        memberName: next.name,
        memberEmail: next.email,
        phone: next.phone,
        expiresAt: next.expiresAt,
        reminderDateIso: reminderAt.toISOString(),
        dueNow: days !== null && days <= EXPIRY_REMINDER_DAYS,
      });
    }
  }

  return next;
}

export function authenticateUser(email: string, password: string): PortalUser | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  setCurrentUserId(user.id);
  return user;
}

/** Actualiza estado desde Admin y refleja en portal users. */
export function updatePortalUserStatus(userId: string, status: PortalUserStatus) {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return null;
  const current = users[index];
  const next: PortalUser = {
    ...current,
    status,
    ...(status === 'activo' && current.expiresAt === '—'
      ? {
          activatedAt: new Date().toISOString(),
          expiresAt: expiryLabelFromPayment(),
        }
      : {}),
  };
  users[index] = next;
  saveUsers(users);
  if (status === 'activo' && (current.status !== 'activo' || current.expiresAt === '—')) {
    runLifecycleAutomations(next);
  }
  return next;
}
