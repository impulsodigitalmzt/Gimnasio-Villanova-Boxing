/**
 * Vigencia de membresía: fechas, +30 días y estados por corte.
 */

import type { MemberStatus } from '@/lib/admin/types';
import type { MembershipStatus } from '@/lib/portal/types';
import type { PortalUserStatus } from '@/lib/portal/users';

/** Días antes del vencimiento para marcar "por vencer" y disparar recordatorio. */
export const EXPIRY_REMINDER_DAYS = 3;

/** Duración estándar de membresía mensual (días naturales desde el pago). */
export const MEMBERSHIP_DURATION_DAYS = 30;

export function parseEsMxDate(label: string): Date | null {
  if (!label || label === '—' || label === '-') return null;
  const parts = label.trim().split(/[/-]/);
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map((p) => Number(p));
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatEsMxDate(date: Date) {
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Fecha de pago + N días (default 30). */
export function expiryFromPaymentDate(from = new Date(), days = MEMBERSHIP_DURATION_DAYS) {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

export function expiryLabelFromPayment(from = new Date(), days = MEMBERSHIP_DURATION_DAYS) {
  return formatEsMxDate(expiryFromPaymentDate(from, days));
}

/** Días restantes hasta expiresAt (negativo = vencido). */
export function daysUntilExpiry(expiresAt: string, today = startOfToday()) {
  const exp = parseEsMxDate(expiresAt);
  if (!exp) return null;
  return Math.ceil((exp.getTime() - today.getTime()) / 86_400_000);
}

export function reminderDateFromExpiry(expiresAt: string) {
  const exp = parseEsMxDate(expiresAt);
  if (!exp) return null;
  const reminder = new Date(exp);
  reminder.setDate(reminder.getDate() - EXPIRY_REMINDER_DAYS);
  return reminder;
}

/**
 * Estado CRM según fecha de corte.
 * pendiente se respeta; activo se recalcula a por_vencer / vencido.
 */
export function resolveAdminStatusFromExpiry(
  expiresAt: string,
  base: PortalUserStatus | MemberStatus,
): MemberStatus {
  if (base === 'pendiente') return 'pendiente';
  const days = daysUntilExpiry(expiresAt);
  if (days === null) {
    if (base === 'vencido') return 'vencido';
    if (base === 'por_vencer') return 'por_vencer';
    return base === 'activo' || base === 'por_vencer' ? 'activo' : 'vencido';
  }
  if (days < 0) return 'vencido';
  if (days <= EXPIRY_REMINDER_DAYS) return 'por_vencer';
  return 'activo';
}

export function resolvePortalUiStatusFromExpiry(
  expiresAt: string,
  base: PortalUserStatus,
): MembershipStatus {
  const admin = resolveAdminStatusFromExpiry(expiresAt, base);
  if (admin === 'pendiente') return 'pendiente';
  if (admin === 'vencido') return 'vencida';
  if (admin === 'por_vencer') return 'por_vencer';
  return 'activa';
}

export function resolvePortalDbStatusFromExpiry(
  expiresAt: string,
  base: PortalUserStatus,
): PortalUserStatus {
  const admin = resolveAdminStatusFromExpiry(expiresAt, base);
  if (admin === 'pendiente') return 'pendiente';
  if (admin === 'vencido') return 'vencido';
  return 'activo';
}
