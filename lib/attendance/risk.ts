/**
 * Cálculo de riesgo por inasistencia (retención / CRM).
 */

import {
  AT_RISK_DAYS,
  LOW_ATTENDANCE_DAYS,
  type AttendanceRisk,
} from '@/lib/attendance/types';
import { startOfToday } from '@/lib/portal/membership-lifecycle';

export function daysSinceIso(iso: string | undefined | null, today = startOfToday()): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - d.getTime()) / 86_400_000);
}

export function resolveAttendanceRisk(
  lastCheckInAt: string | undefined | null,
  today = startOfToday(),
): AttendanceRisk {
  const days = daysSinceIso(lastCheckInAt, today);
  if (days === null) return 'sin_registro';
  if (days >= AT_RISK_DAYS) return 'en_riesgo';
  if (days >= LOW_ATTENDANCE_DAYS) return 'baja';
  return 'ok';
}

export function attendanceRiskLabel(risk: AttendanceRisk): string {
  switch (risk) {
    case 'ok':
      return 'Asiste';
    case 'baja':
      return 'Baja asistencia';
    case 'en_riesgo':
      return 'En riesgo';
    case 'sin_registro':
      return 'Sin check-in';
  }
}

export function countCheckInsInMonth(
  datesIso: string[],
  ref = new Date(),
): number {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  return datesIso.filter((iso) => {
    const d = new Date(iso);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}
