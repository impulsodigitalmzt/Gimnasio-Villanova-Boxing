/**
 * Modelo de asistencia listo para migrar a base de datos.
 * En demo se persiste en localStorage; con API basta implementar AttendanceRepository.
 */

export type AttendanceSource = 'qr_scan' | 'manual';

/** Nivel de riesgo por inasistencia (CRM / contabilidad de retención). */
export type AttendanceRisk = 'ok' | 'baja' | 'en_riesgo' | 'sin_registro';

export type AttendanceCheckIn = {
  id: string;
  /** Id canónico del socio (portal user id o id admin). */
  memberId: string;
  /** Id en CRM admin (p. ej. portal_u_demo). */
  adminMemberId?: string;
  memberName: string;
  memberEmail: string;
  phone?: string;
  planId?: string;
  planName?: string;
  membershipStatus?: string;
  checkedInAt: string;
  source: AttendanceSource;
  /** Etiqueta del dispositivo del gym (teléfono dedicado). */
  deviceLabel?: string;
  /** Payload crudo del QR (auditoría). */
  qrPayload?: string;
};

export type AttendanceStats = {
  checkInsToday: number;
  uniqueMembersToday: number;
  atRiskCount: number;
  lowAttendanceCount: number;
  noRecordCount: number;
  /** Suma aproximada de planes en riesgo (demo). */
  revenueAtRisk: number;
};

/** Contrato para demo local o API/BD real. */
export type AttendanceRepository = {
  list(): Promise<AttendanceCheckIn[]>;
  listToday(): Promise<AttendanceCheckIn[]>;
  listForMember(memberId: string): Promise<AttendanceCheckIn[]>;
  getLastForMember(memberId: string): Promise<AttendanceCheckIn | null>;
  record(input: Omit<AttendanceCheckIn, 'id'> & { id?: string }): Promise<AttendanceCheckIn>;
};

export const ATTENDANCE_STORAGE_KEY = 'villanova-attendance-v1';
export const ATTENDANCE_UPDATED_EVENT = 'villanova-attendance-updated';

/** Días sin venir → baja asistencia. */
export const LOW_ATTENDANCE_DAYS = 7;
/** Días sin venir → en riesgo de abandono. */
export const AT_RISK_DAYS = 14;
