/**
 * Repositorio de asistencias.
 * Demo: localStorage. Producción: cambiar getAttendanceRepository() a API/BD.
 *
 * Para habilitar API real:
 *   NEXT_PUBLIC_ATTENDANCE_API_URL=https://tu-api/attendance
 * e implementar ApiAttendanceRepository abajo.
 */

import {
  ATTENDANCE_STORAGE_KEY,
  ATTENDANCE_UPDATED_EVENT,
  type AttendanceCheckIn,
  type AttendanceRepository,
  type AttendanceStats,
} from '@/lib/attendance/types';
import { resolveAttendanceRisk } from '@/lib/attendance/risk';
import type { Member } from '@/lib/admin/types';

function canUseStorage() {
  return typeof window !== 'undefined';
}

function uid() {
  return `att_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readLocal(): AttendanceCheckIn[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AttendanceCheckIn[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items: AttendanceCheckIn[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(items.slice(0, 500)));
  window.dispatchEvent(new CustomEvent(ATTENDANCE_UPDATED_EVENT));
}

/** Semilla demo: una visita antigua para ver riesgo / mensaje de inasistencia. */
export function ensureDemoAttendanceSeed() {
  if (!canUseStorage()) return;
  if (window.localStorage.getItem(ATTENDANCE_STORAGE_KEY)) return;

  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  tenDaysAgo.setHours(18, 30, 0, 0);

  writeLocal([
    {
      id: 'att_seed_demo',
      memberId: 'u_demo',
      adminMemberId: 'portal_u_demo',
      memberName: 'Alex Rivera',
      memberEmail: 'socio@villanovaboxing.mx',
      phone: '6691587875',
      planId: 'duo',
      planName: 'Dúo / Compañero',
      membershipStatus: 'activo',
      checkedInAt: tenDaysAgo.toISOString(),
      source: 'qr_scan',
      deviceLabel: 'Teléfono recepción',
    },
  ]);
}

function startOfDayIso(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

const localAttendanceRepository: AttendanceRepository = {
  async list() {
    return readLocal().sort(
      (a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime(),
    );
  },

  async listToday() {
    const start = startOfDayIso();
    return (await this.list()).filter((c) => c.checkedInAt >= start);
  },

  async listForMember(memberId: string) {
    const id = memberId.trim();
    return (await this.list()).filter(
      (c) => c.memberId === id || c.adminMemberId === id || c.adminMemberId === `portal_${id}`,
    );
  },

  async getLastForMember(memberId: string) {
    const list = await this.listForMember(memberId);
    return list[0] ?? null;
  },

  async record(input) {
    const item: AttendanceCheckIn = {
      ...input,
      id: input.id || uid(),
      checkedInAt: input.checkedInAt || new Date().toISOString(),
    };
    const list = readLocal().filter((c) => c.id !== item.id);
    list.unshift(item);
    writeLocal(list);
    return item;
  },
};

/**
 * Stub listo para producción: POST/GET contra NEXT_PUBLIC_ATTENDANCE_API_URL.
 * No se usa hasta configurar la variable.
 */
class ApiAttendanceRepository implements AttendanceRepository {
  constructor(private baseUrl: string) {}

  private url(path = '') {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`;
  }

  async list() {
    const res = await fetch(this.url(''), { credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo cargar asistencias');
    return (await res.json()) as AttendanceCheckIn[];
  }

  async listToday() {
    const res = await fetch(this.url('/today'), { credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo cargar asistencias de hoy');
    return (await res.json()) as AttendanceCheckIn[];
  }

  async listForMember(memberId: string) {
    const res = await fetch(this.url(`/member/${encodeURIComponent(memberId)}`), {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('No se pudo cargar historial del socio');
    return (await res.json()) as AttendanceCheckIn[];
  }

  async getLastForMember(memberId: string) {
    const list = await this.listForMember(memberId);
    return list[0] ?? null;
  }

  async record(input: Omit<AttendanceCheckIn, 'id'> & { id?: string }) {
    const res = await fetch(this.url(''), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('No se pudo registrar la asistencia');
    return (await res.json()) as AttendanceCheckIn;
  }
}

export function getAttendanceRepository(): AttendanceRepository {
  const apiUrl =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_ATTENDANCE_API_URL?.trim()
      : undefined;
  if (apiUrl) return new ApiAttendanceRepository(apiUrl);
  return localAttendanceRepository;
}

export function computeAttendanceStats(
  checkIns: AttendanceCheckIn[],
  members: Member[],
): AttendanceStats {
  const start = startOfDayIso();
  const today = checkIns.filter((c) => c.checkedInAt >= start);
  const unique = new Set(today.map((c) => c.memberEmail.toLowerCase()));

  let atRiskCount = 0;
  let lowAttendanceCount = 0;
  let noRecordCount = 0;
  let revenueAtRisk = 0;

  for (const m of members) {
    if (m.status === 'pendiente') continue;
    const risk = m.attendanceRisk ?? resolveAttendanceRisk(m.lastCheckInAt);
    if (risk === 'en_riesgo') {
      atRiskCount += 1;
      revenueAtRisk += m.amountPaid ?? 0;
    } else if (risk === 'baja') {
      lowAttendanceCount += 1;
      revenueAtRisk += Math.round((m.amountPaid ?? 0) * 0.5);
    } else if (risk === 'sin_registro') {
      noRecordCount += 1;
    }
  }

  return {
    checkInsToday: today.length,
    uniqueMembersToday: unique.size,
    atRiskCount,
    lowAttendanceCount,
    noRecordCount,
    revenueAtRisk,
  };
}

export function loadAttendanceSync(): AttendanceCheckIn[] {
  return readLocal().sort(
    (a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime(),
  );
}
