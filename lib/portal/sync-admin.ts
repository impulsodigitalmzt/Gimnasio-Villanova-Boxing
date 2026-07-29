/**
 * Sincroniza socios del Portal con el panel administrativo.
 * Incluye plan, retos adquiridos y snapshot de entrenamiento.
 */

import type { AdminDatabase, Member, MemberStatus } from '@/lib/admin/types';
import { createSeedDatabase } from '@/lib/admin/types';
import type { PortalUser } from '@/lib/portal/users';
import { resolveAdminStatusFromExpiry } from '@/lib/portal/membership-lifecycle';
import { activeChallenges } from '@/lib/portal/mock-data';

export const ADMIN_DB_STORAGE_KEY = 'villanova-admin-db-v6';
const PORTAL_MEMBER_PREFIX = 'portal_';

function portalStatusToAdmin(user: PortalUser): MemberStatus {
  return resolveAdminStatusFromExpiry(user.expiresAt, user.status);
}

function challengeTitlesFor(ids: string[] | undefined) {
  if (!ids?.length) return [];
  return ids
    .map((id) => activeChallenges.find((c) => c.id === id)?.title || id)
    .filter(Boolean);
}

export function portalUserToAdminMember(user: PortalUser): Member {
  const challengeIds = user.challengeIds || [];
  return {
    id: `${PORTAL_MEMBER_PREFIX}${user.id}`,
    name: user.name,
    email: user.email,
    plan: user.planName,
    planId: user.planId,
    expiresAt: user.status === 'pendiente' ? '—' : user.expiresAt,
    status: portalStatusToAdmin(user),
    registeredAt: user.memberSince,
    phone: user.phone,
    amountPaid: user.amountPaid,
    activatedAt: user.activatedAt,
    challengeIds,
    challengeTitles: challengeTitlesFor(challengeIds),
    trainingLevel: user.trainingLevel,
    primaryClassName: user.primaryClassName,
    lastWorkoutTitle: user.lastWorkoutTitle,
    sessionsThisWeek: user.sessionsThisWeek,
    streakDays: user.streakDays,
    completedSessionsCount: user.completedSessionsCount,
    trainingUpdatedAt: user.trainingUpdatedAt,
  };
}

function readAdminDb(): AdminDatabase {
  try {
    const raw = window.localStorage.getItem(ADMIN_DB_STORAGE_KEY);
    if (!raw) return createSeedDatabase();
    const parsed = JSON.parse(raw) as AdminDatabase;
    if (!parsed?.version || !Array.isArray(parsed.members)) return createSeedDatabase();
    return parsed;
  } catch {
    return createSeedDatabase();
  }
}

function writeAdminDb(db: AdminDatabase) {
  window.localStorage.setItem(ADMIN_DB_STORAGE_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('villanova-admin-db-updated'));
}

/**
 * Upsert de usuarios del portal en la DB del Admin.
 * - activos/vencidos → members
 * - pendientes → pendingUsers (+ también visibles en members con status pendiente)
 */
export function syncPortalUsersToAdmin(portalUsers: PortalUser[]) {
  if (typeof window === 'undefined') return;

  const db = readAdminDb();
  const mapped = portalUsers.map(portalUserToAdminMember);
  const portalEmails = new Set(mapped.map((m) => m.email.toLowerCase()));

  db.members = db.members.filter(
    (m) =>
      !m.id.startsWith(PORTAL_MEMBER_PREFIX) &&
      !portalEmails.has(m.email.toLowerCase()),
  );
  db.pendingUsers = db.pendingUsers.filter(
    (m) =>
      !m.id.startsWith(PORTAL_MEMBER_PREFIX) &&
      !portalEmails.has(m.email.toLowerCase()),
  );

  for (const member of mapped) {
    if (member.status === 'pendiente') {
      db.pendingUsers.unshift(member);
    }
    db.members.unshift(member);
  }

  writeAdminDb(db);
}

export function isPortalSyncedMemberId(id: string) {
  return id.startsWith(PORTAL_MEMBER_PREFIX);
}

export function portalIdFromAdminMemberId(id: string) {
  if (!id.startsWith(PORTAL_MEMBER_PREFIX)) return null;
  return id.slice(PORTAL_MEMBER_PREFIX.length);
}
