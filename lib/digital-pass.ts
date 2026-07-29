import { expiryLabelFromPayment, MEMBERSHIP_DURATION_DAYS } from '@/lib/portal/membership-lifecycle';

export type DigitalPass = {
  name: string;
  email: string;
  phone?: string;
  planId: string;
  plan: string;
  memberId: string;
  /** Id del usuario portal (para check-in CRM). */
  portalUserId?: string;
  joinDate: string;
  expiresAt: string;
  orderId?: string;
};

export const DIGITAL_PASS_KEY = 'villanova_digital_pass';

export const planLabels: Record<string, string> = {
  individual: 'Plan Individual / Base',
  duo: 'Plan Dúo / Compañero',
  grupal: 'Plan Grupal / Comunidad',
  visita: 'Visita Villanova',
};

export function computePassExpiry(planId: string, from = new Date()) {
  if (planId === 'visita') {
    const date = new Date(from);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  return expiryLabelFromPayment(from, MEMBERSHIP_DURATION_DAYS);
}

export function formatJoinDate(from = new Date()) {
  return from.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function createDigitalPass(input: {
  name: string;
  email: string;
  phone?: string;
  planId: string;
  orderId?: string;
  memberId?: string;
  portalUserId?: string;
}): DigitalPass {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim(),
    planId: input.planId,
    plan: planLabels[input.planId] ?? 'Membresía Villanova',
    memberId: input.memberId ?? `VNB-${Math.floor(100000 + Math.random() * 900000)}`,
    portalUserId: input.portalUserId,
    joinDate: formatJoinDate(),
    expiresAt: computePassExpiry(input.planId),
    orderId: input.orderId,
  };
}

export function saveDigitalPass(pass: DigitalPass) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DIGITAL_PASS_KEY, JSON.stringify(pass));
}

export function loadDigitalPass(): DigitalPass | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DIGITAL_PASS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DigitalPass;
  } catch {
    return null;
  }
}

export function clearDigitalPass() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DIGITAL_PASS_KEY);
}
