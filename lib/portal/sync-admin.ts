/**
 * Sincroniza socios del Portal con el panel administrativo.
 * Mismo origen de verdad en PC y móvil del mismo navegador.
 */

import type { AdminDatabase, Member, MemberStatus } from '@/lib/admin/types';
import { createSeedDatabase } from '@/lib/admin/types';
import type { PortalUser } from '@/lib/portal/users';
import { resolveAdminStatusFromExpiry } from '@/lib/portal/membership-lifecycle';

export const ADMIN_DB_STORAGE_KEY = 'villanova-admin-db-v6';
const PORTAL_MEMBER_PREFIX = 'portal_';

function portalStatusToAdmin(user: PortalUser): MemberStatus {
  return resolveAdminStatusFromExpiry(user.expiresAt, user.status);
}

export function portalUserToAdminMember(user: PortalUser): Member {
  return {
    id: `${PORTAL_MEMBER_PREFIX}${user.id}`,
    name: user.name,
    email: user.email,
    plan: user.planName,
    expiresAt: user.status === 'pendiente' ? '—' : user.expiresAt,
    status: portalStatusToAdmin(user),
    registeredAt: user.memberSince,
    phone: user.phone,
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
  // Notifica al store en memoria del Admin si está montado
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

  // Quita entradas previas del portal y duplicados por email
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
    // Todos los registros del portal aparecen en el listado de socios
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
