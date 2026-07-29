/**
 * Automatizaciones del flujo operativo (demo local).
 * Bienvenida al activar y recordatorio 3 días antes del vencimiento.
 * Sin WhatsApp/correo real: quedan en cola del CRM para seguimiento.
 */

export type AutomationChannel = 'whatsapp' | 'email';
export type AutomationKind = 'welcome' | 'expiry_reminder' | 'inactivity_nudge';
export type AutomationStatus = 'queued' | 'scheduled' | 'sent';

export type CrmAutomation = {
  id: string;
  kind: AutomationKind;
  memberId: string;
  memberName: string;
  memberEmail: string;
  phone?: string;
  channel: AutomationChannel;
  status: AutomationStatus;
  /** Fecha objetivo (ISO) para recordatorios; bienvenida = ahora */
  scheduledFor: string;
  /** Vencimiento de membresía (etiqueta DD/MM/AAAA) si aplica */
  membershipExpiresAt?: string;
  /** Días sin asistencia (nudge de retención). */
  daysAbsent?: number;
  message: string;
  createdAt: string;
};

export const AUTOMATIONS_STORAGE_KEY = 'villanova-crm-automations-v1';

const GYM_LOCATION = 'Villanova Boxing Gym · Mazatlán, Sinaloa';
const GYM_HOURS = 'Lun–Vie 6:00–21:00 · Sáb 9:00–12:00 · Dom cerrado';

function canUseStorage() {
  return typeof window !== 'undefined';
}

export function loadAutomations(): CrmAutomation[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(AUTOMATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CrmAutomation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAutomations(items: CrmAutomation[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTOMATIONS_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('villanova-crm-automations-updated'));
}

function upsertAutomation(item: CrmAutomation, dedupeKey: (a: CrmAutomation) => boolean) {
  const list = loadAutomations().filter((a) => !dedupeKey(a));
  list.unshift(item);
  saveAutomations(list.slice(0, 80));
  return item;
}

export function buildWelcomeMessage(name: string) {
  return (
    `¡Bienvenido/a a Villanova Boxing, ${name}! ` +
    `Tu membresía ya está activa. Ubicación: ${GYM_LOCATION}. ` +
    `Horario: ${GYM_HOURS}. ` +
    `Primer día: trae ropa cómoda, agua y ganas. Te esperamos en el ring.`
  );
}

export function buildExpiryReminderMessage(name: string, expiresAt: string) {
  return (
    `Hola ${name}, tu membresía Villanova vence el ${expiresAt} (en 3 días o menos). ` +
    `Renueva desde tu portal para no perder el acceso a clases y retos. ` +
    `También puedes hacerlo en recepción.`
  );
}

/** Al confirmar pago / activación: bienvenida inmediata (cola WhatsApp + correo). */
export function queueWelcomeAutomation(input: {
  memberId: string;
  memberName: string;
  memberEmail: string;
  phone?: string;
}) {
  const now = new Date().toISOString();
  const message = buildWelcomeMessage(input.memberName);

  upsertAutomation(
    {
      id: `auto_welcome_${input.memberId}_${Date.now().toString(36)}`,
      kind: 'welcome',
      memberId: input.memberId,
      memberName: input.memberName,
      memberEmail: input.memberEmail,
      phone: input.phone,
      channel: input.phone ? 'whatsapp' : 'email',
      status: 'queued',
      scheduledFor: now,
      message,
      createdAt: now,
    },
    (a) => a.kind === 'welcome' && a.memberId === input.memberId && a.status === 'queued',
  );

  // Segundo canal: correo de bienvenida
  upsertAutomation(
    {
      id: `auto_welcome_mail_${input.memberId}_${Date.now().toString(36)}`,
      kind: 'welcome',
      memberId: input.memberId,
      memberName: input.memberName,
      memberEmail: input.memberEmail,
      phone: input.phone,
      channel: 'email',
      status: 'queued',
      scheduledFor: now,
      message,
      createdAt: now,
    },
    (a) =>
      a.kind === 'welcome' &&
      a.memberId === input.memberId &&
      a.channel === 'email' &&
      a.status === 'queued',
  );
}

/**
 * Programa recordatorio 3 días antes del vencimiento.
 * Si ya estamos dentro de esa ventana, queda en cola inmediata.
 */
export function scheduleExpiryReminder(input: {
  memberId: string;
  memberName: string;
  memberEmail: string;
  phone?: string;
  expiresAt: string;
  reminderDateIso: string;
  dueNow?: boolean;
}) {
  const message = buildExpiryReminderMessage(input.memberName, input.expiresAt);
  upsertAutomation(
    {
      id: `auto_expiry_${input.memberId}_${input.expiresAt.replace(/\//g, '-')}`,
      kind: 'expiry_reminder',
      memberId: input.memberId,
      memberName: input.memberName,
      memberEmail: input.memberEmail,
      phone: input.phone,
      channel: input.phone ? 'whatsapp' : 'email',
      status: input.dueNow ? 'queued' : 'scheduled',
      scheduledFor: input.reminderDateIso,
      membershipExpiresAt: input.expiresAt,
      message,
      createdAt: new Date().toISOString(),
    },
    (a) =>
      a.kind === 'expiry_reminder' &&
      a.memberId === input.memberId &&
      a.membershipExpiresAt === input.expiresAt,
  );
}

export function buildInactivityMessage(name: string, daysAbsent: number) {
  if (daysAbsent >= 14) {
    return (
      `Hola ${name}, te extrañamos en Villanova Boxing. ` +
      `Llevas ${daysAbsent} días sin venir y no queremos que pierdas el ritmo. ` +
      `¿Te agendamos una clase esta semana? Responde este WhatsApp y te esperamos en el ring.`
    );
  }
  return (
    `Hola ${name}, notamos que llevas ${daysAbsent} días sin asistir a Villanova. ` +
    `Tu lugar sigue reservado: ¿vienes hoy o mañana? Estamos para apoyarte.`
  );
}

/**
 * Mensaje automático por baja asistencia / riesgo de abandono.
 * Demo: queda en cola del CRM (sin WhatsApp real hasta conectar API).
 */
export function queueInactivityNudge(input: {
  memberId: string;
  memberName: string;
  memberEmail: string;
  phone?: string;
  daysAbsent: number;
  risk: 'baja' | 'en_riesgo';
}) {
  const now = new Date().toISOString();
  const message = buildInactivityMessage(input.memberName, input.daysAbsent);
  const bucket = input.risk === 'en_riesgo' ? '14d' : '7d';

  upsertAutomation(
    {
      id: `auto_inactive_${input.memberId}_${bucket}`,
      kind: 'inactivity_nudge',
      memberId: input.memberId,
      memberName: input.memberName,
      memberEmail: input.memberEmail,
      phone: input.phone,
      channel: input.phone ? 'whatsapp' : 'email',
      status: 'queued',
      scheduledFor: now,
      daysAbsent: input.daysAbsent,
      message,
      createdAt: now,
    },
    (a) =>
      a.kind === 'inactivity_nudge' &&
      a.memberId === input.memberId &&
      a.id.endsWith(`_${bucket}`) &&
      a.status !== 'sent',
  );
}

export function clearInactivityNudges(memberId: string) {
  const list = loadAutomations().filter(
    (a) =>
      !(
        a.kind === 'inactivity_nudge' &&
        a.memberId === memberId &&
        (a.status === 'queued' || a.status === 'scheduled')
      ),
  );
  saveAutomations(list);
}

/** Marca como enviada (demo) una automatización. */
export function markAutomationSent(id: string) {
  const list = loadAutomations().map((a) =>
    a.id === id ? { ...a, status: 'sent' as const } : a,
  );
  saveAutomations(list);
}

export function getPendingAutomations() {
  return loadAutomations().filter((a) => a.status === 'queued' || a.status === 'scheduled');
}
