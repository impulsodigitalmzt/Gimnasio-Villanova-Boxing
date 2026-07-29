/**
 * Servicio de check-in por QR / manual.
 * Actualiza historial de asistencia + snapshot en CRM (demo localStorage).
 */

import { decodeCheckInQr } from '@/lib/attendance/qr-payload';
import {
  getAttendanceRepository,
  loadAttendanceSync,
  ensureDemoAttendanceSeed,
} from '@/lib/attendance/repository';
import {
  countCheckInsInMonth,
  daysSinceIso,
  resolveAttendanceRisk,
} from '@/lib/attendance/risk';
import type { AttendanceCheckIn, AttendanceSource } from '@/lib/attendance/types';
import { ADMIN_DB_STORAGE_KEY } from '@/lib/portal/sync-admin';
import { createSeedDatabase, type AdminDatabase, type Member } from '@/lib/admin/types';
import {
  getUserByEmail,
  getUserById,
  loadUsers,
  saveUsers,
  type PortalUser,
} from '@/lib/portal/users';
import { clearInactivityNudges, queueInactivityNudge } from '@/lib/portal/automations';
import { AT_RISK_DAYS, LOW_ATTENDANCE_DAYS } from '@/lib/attendance/types';

export type CheckInResult =
  | { ok: true; checkIn: AttendanceCheckIn; member: Member; duplicateToday?: boolean }
  | { ok: false; error: string };

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

function applyAttendanceSnapshot(
  member: Member,
  lastCheckInAt: string,
  checkInsThisMonth: number,
): Member {
  const daysSinceLastVisit = daysSinceIso(lastCheckInAt) ?? 0;
  return {
    ...member,
    lastCheckInAt,
    checkInsThisMonth,
    daysSinceLastVisit,
    attendanceRisk: resolveAttendanceRisk(lastCheckInAt),
  };
}

function findMember(
  db: AdminDatabase,
  opts: { memberId?: string; email?: string },
): Member | null {
  const email = opts.email?.toLowerCase();
  const id = opts.memberId;

  const pool = [...db.members, ...db.pendingUsers];
  if (id) {
    const byId =
      pool.find((m) => m.id === id) ||
      pool.find((m) => m.id === `portal_${id}`) ||
      pool.find((m) => m.id.replace(/^portal_/, '') === id);
    if (byId) return byId;
  }
  if (email) {
    return pool.find((m) => m.email.toLowerCase() === email) ?? null;
  }
  return null;
}

function nameFromEmail(email: string) {
  const local = email.split('@')[0] || 'Alumno';
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Alta provisional a partir del QR cuando el alumno no está en este dispositivo.
 * Queda marcado para que recepción lo vincule con su expediente real.
 */
function createProvisionalMember(input: { memberId: string; email: string }): Member {
  const member: Member = {
    id: `portal_${input.memberId}`,
    name: nameFromEmail(input.email),
    email: input.email,
    plan: 'Por confirmar',
    expiresAt: '—',
    status: 'pendiente',
    registeredAt: new Date().toLocaleDateString('es-MX'),
    unverifiedFromQr: true,
  };

  const db = readAdminDb();
  const exists = db.members.some(
    (m) => m.id === member.id || m.email.toLowerCase() === member.email.toLowerCase(),
  );
  if (!exists) {
    db.members.unshift(member);
    db.pendingUsers.unshift(member);
    writeAdminDb(db);
  }
  return member;
}

function resolveFromPortal(user: PortalUser): {
  memberId: string;
  adminMemberId: string;
  memberName: string;
  memberEmail: string;
  phone?: string;
  planId?: string;
  planName?: string;
  membershipStatus: string;
} {
  return {
    memberId: user.id,
    adminMemberId: `portal_${user.id}`,
    memberName: user.name,
    memberEmail: user.email,
    phone: user.phone,
    planId: user.planId,
    planName: user.planName,
    membershipStatus: user.status,
  };
}

export async function recordCheckIn(input: {
  qrRaw?: string;
  memberId?: string;
  email?: string;
  source: AttendanceSource;
  deviceLabel?: string;
}): Promise<CheckInResult> {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Solo disponible en el dispositivo del gimnasio' };
  }

  let memberId = input.memberId?.trim();
  let email = input.email?.trim().toLowerCase();
  let qrPayload = input.qrRaw?.trim();

  if (input.qrRaw) {
    const decoded = decodeCheckInQr(input.qrRaw);
    if (!decoded) {
      return { ok: false, error: 'QR no válido. Debe ser el pase Villanova del alumno.' };
    }
    memberId = decoded.id;
    email = decoded.e;
    qrPayload = input.qrRaw.trim();
  }

  if (!memberId && !email) {
    return { ok: false, error: 'Falta identificar al alumno' };
  }

  const portalUser =
    (memberId ? getUserById(memberId) : null) || (email ? getUserByEmail(email) : null);

  const db = readAdminDb();
  let member = findMember(db, {
    memberId: portalUser?.id ?? memberId,
    email: portalUser?.email ?? email,
  });

  let identity = portalUser
    ? resolveFromPortal(portalUser)
    : member
      ? {
          memberId: member.id.replace(/^portal_/, ''),
          adminMemberId: member.id,
          memberName: member.name,
          memberEmail: member.email,
          phone: member.phone,
          planId: member.planId,
          planName: member.plan,
          membershipStatus: member.status,
        }
      : null;

  if (!identity && memberId && email) {
    // El alumno se registró en otro dispositivo (demo sin BD compartida) o aún no
    // está sincronizado: se da de alta provisional para no frenar la entrada.
    const provisional = createProvisionalMember({ memberId, email });
    member = provisional;
    identity = {
      memberId,
      adminMemberId: provisional.id,
      memberName: provisional.name,
      memberEmail: provisional.email,
      planId: provisional.planId,
      planName: provisional.plan,
      membershipStatus: provisional.status,
    };
  }

  if (!identity) {
    return {
      ok: false,
      error: 'Alumno no encontrado en el CRM. Verifica que esté registrado.',
    };
  }

  const repo = getAttendanceRepository();
  const existing = await repo.listForMember(identity.memberId);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const alreadyToday = existing.some((c) => new Date(c.checkedInAt) >= start);

  if (alreadyToday) {
    const last = existing[0];
    return {
      ok: true,
      checkIn: last,
      member: member
        ? applyAttendanceSnapshot(
            member,
            last.checkedInAt,
            countCheckInsInMonth(existing.map((c) => c.checkedInAt)),
          )
        : ({
            id: identity.adminMemberId,
            name: identity.memberName,
            email: identity.memberEmail,
            plan: identity.planName || '—',
            expiresAt: '—',
            status: 'activo',
            lastCheckInAt: last.checkedInAt,
            attendanceRisk: 'ok',
          } as Member),
      duplicateToday: true,
    };
  }

  const checkedInAt = new Date().toISOString();
  const checkIn = await repo.record({
    memberId: identity.memberId,
    adminMemberId: identity.adminMemberId,
    memberName: identity.memberName,
    memberEmail: identity.memberEmail,
    phone: identity.phone,
    planId: identity.planId,
    planName: identity.planName,
    membershipStatus: identity.membershipStatus,
    checkedInAt,
    source: input.source,
    deviceLabel: input.deviceLabel || 'Teléfono recepción',
    qrPayload,
  });

  clearInactivityNudges(identity.memberId);

  const allForMember = [checkIn, ...existing];
  const monthCount = countCheckInsInMonth(allForMember.map((c) => c.checkedInAt));

  if (portalUser) {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === portalUser.id);
    if (idx >= 0) {
      users[idx] = {
        ...users[idx],
        lastCheckInAt: checkedInAt,
        checkInsThisMonth: monthCount,
        daysSinceLastVisit: 0,
        attendanceRisk: 'ok',
      };
      saveUsers(users);
    }
  }

  // Releer DB tras sync portal
  const nextDb = readAdminDb();
  const targetId = identity.adminMemberId;
  const patchMember = (m: Member) =>
    m.id === targetId || m.email.toLowerCase() === identity!.memberEmail.toLowerCase()
      ? applyAttendanceSnapshot(m, checkedInAt, monthCount)
      : m;

  nextDb.members = nextDb.members.map(patchMember);
  nextDb.pendingUsers = nextDb.pendingUsers.map(patchMember);
  writeAdminDb(nextDb);

  const updated =
    findMember(nextDb, { memberId: identity.memberId, email: identity.memberEmail }) ||
    applyAttendanceSnapshot(
      {
        id: targetId,
        name: identity.memberName,
        email: identity.memberEmail,
        plan: identity.planName || '—',
        expiresAt: member?.expiresAt || '—',
        status: (member?.status || 'activo') as Member['status'],
        phone: identity.phone,
        planId: identity.planId,
        amountPaid: member?.amountPaid,
      },
      checkedInAt,
      monthCount,
    );

  return { ok: true, checkIn, member: updated, duplicateToday: false };
}

/** Refresca riesgo de asistencia en CRM y encola nudges de inactividad. */
export function refreshAttendanceRiskInCrm() {
  if (typeof window === 'undefined') return;

  ensureDemoAttendanceSeed();

  const checkIns = loadAttendanceSync();
  const lastByEmail = new Map<string, string>();
  const monthByEmail = new Map<string, string[]>();

  for (const c of checkIns) {
    const key = c.memberEmail.toLowerCase();
    if (!lastByEmail.has(key)) lastByEmail.set(key, c.checkedInAt);
    const arr = monthByEmail.get(key) || [];
    arr.push(c.checkedInAt);
    monthByEmail.set(key, arr);
  }

  const db = readAdminDb();
  const patch = (m: Member): Member => {
    const key = m.email.toLowerCase();
    const last = lastByEmail.get(key) || m.lastCheckInAt;
    const month = countCheckInsInMonth(monthByEmail.get(key) || []);
    const risk = resolveAttendanceRisk(last);
    const days = daysSinceIso(last);

    if (
      (risk === 'baja' || risk === 'en_riesgo') &&
      m.status !== 'pendiente' &&
      m.phone
    ) {
      queueInactivityNudge({
        memberId: m.id.replace(/^portal_/, ''),
        memberName: m.name,
        memberEmail: m.email,
        phone: m.phone,
        daysAbsent: days ?? (risk === 'en_riesgo' ? AT_RISK_DAYS : LOW_ATTENDANCE_DAYS),
        risk,
      });
    }

    return {
      ...m,
      lastCheckInAt: last,
      checkInsThisMonth: month,
      daysSinceLastVisit: days ?? undefined,
      attendanceRisk: risk,
    };
  };

  db.members = db.members.map(patch);
  db.pendingUsers = db.pendingUsers.map(patch);
  writeAdminDb(db);

  // Portal users (saveUsers re-syncs CRM)
  const users = loadUsers().map((u) => {
    const key = u.email.toLowerCase();
    const last = lastByEmail.get(key) || u.lastCheckInAt;
    const month = countCheckInsInMonth(monthByEmail.get(key) || []);
    return {
      ...u,
      lastCheckInAt: last,
      checkInsThisMonth: month,
      daysSinceLastVisit: daysSinceIso(last) ?? undefined,
      attendanceRisk: resolveAttendanceRisk(last),
    };
  });
  saveUsers(users);
}
