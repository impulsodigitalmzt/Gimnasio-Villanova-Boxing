/**
 * Desbloqueo diario del entrenamiento: membresía al corriente + check-in del día.
 * Demo: lee localStorage. Con API/BD, getAttendanceRepository() ya está cableado.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ATTENDANCE_UPDATED_EVENT,
  type AttendanceCheckIn,
} from '@/lib/attendance/types';
import { getAttendanceRepository, loadAttendanceSync } from '@/lib/attendance/repository';
import { recordCheckIn } from '@/lib/attendance/service';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function memberHasCheckedInToday(
  checkIns: AttendanceCheckIn[],
  opts: { memberId?: string | null; email?: string | null },
): boolean {
  const id = opts.memberId?.trim();
  const email = opts.email?.trim().toLowerCase();
  if (!id && !email) return false;

  const start = startOfToday();
  return checkIns.some((c) => {
    const when = new Date(c.checkedInAt);
    if (when < start) return false;
    if (id && (c.memberId === id || c.adminMemberId === id || c.adminMemberId === `portal_${id}`)) {
      return true;
    }
    if (email && c.memberEmail.toLowerCase() === email) return true;
    return false;
  });
}

export function hasCheckedInTodaySync(opts: {
  memberId?: string | null;
  email?: string | null;
}): boolean {
  if (typeof window === 'undefined') return false;
  return memberHasCheckedInToday(loadAttendanceSync(), opts);
}

/**
 * Hook: ¿el alumno ya registró asistencia hoy?
 * Se actualiza al escanear en recepción (mismo origen) o al confirmar en demo.
 */
export function useTodayCheckIn(opts: {
  memberId?: string | null;
  email?: string | null;
  enabled?: boolean;
}) {
  const enabled = opts.enabled !== false;
  const [checkedIn, setCheckedIn] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!enabled || (!opts.memberId && !opts.email)) {
      setCheckedIn(false);
      setReady(true);
      return;
    }
    setCheckedIn(
      hasCheckedInTodaySync({ memberId: opts.memberId, email: opts.email }),
    );
    setReady(true);
  }, [enabled, opts.memberId, opts.email]);

  useEffect(() => {
    refresh();
    if (!enabled) return;
    const onUpdate = () => refresh();
    window.addEventListener(ATTENDANCE_UPDATED_EVENT, onUpdate);
    window.addEventListener('villanova-admin-db-updated', onUpdate);
    window.addEventListener('villanova-portal-users-updated', onUpdate);
    // Revisa al volver a la pestaña (p. ej. tras escanear en otro flujo)
    window.addEventListener('focus', onUpdate);
    return () => {
      window.removeEventListener(ATTENDANCE_UPDATED_EVENT, onUpdate);
      window.removeEventListener('villanova-admin-db-updated', onUpdate);
      window.removeEventListener('villanova-portal-users-updated', onUpdate);
      window.removeEventListener('focus', onUpdate);
    };
  }, [refresh, enabled]);

  return { checkedIn, ready, refresh };
}

/**
 * Confirmación local de asistencia (solo demo sin API).
 * En producción el desbloqueo viene del check-in escaneado en recepción → BD.
 */
export async function confirmTodayCheckInFromPortal(input: {
  memberId: string;
  email: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_ATTENDANCE_API_URL?.trim();
  if (apiUrl) {
    // Con API real no se auto-confirma desde el portal: espera el escaneo.
    const repo = getAttendanceRepository();
    const list = await repo.listForMember(input.memberId);
    return memberHasCheckedInToday(list, input);
  }

  const result = await recordCheckIn({
    memberId: input.memberId,
    email: input.email,
    source: 'manual',
    deviceLabel: 'Confirmación portal (demo)',
  });
  return result.ok;
}

export function isDailyTrainingUnlocked(opts: {
  membershipCurrent: boolean;
  checkedInToday: boolean;
}) {
  return opts.membershipCurrent && opts.checkedInToday;
}
