import type { MemberProfile, MembershipStatus } from '@/lib/portal/types';

/**
 * Membresía al corriente: activa o por vencer (aún dentro de vigencia).
 * Pendiente / vencida no desbloquean la personalización del portal.
 */
export function isMembershipCurrent(
  profile: Pick<MemberProfile, 'status' | 'expiresAt'> | null | undefined,
): boolean {
  if (!profile) return false;
  if (profile.expiresAt === 'Pendiente de pago' || profile.expiresAt === '—') return false;
  return profile.status === 'activa' || profile.status === 'por_vencer';
}

/** Rutas de personalización (clases, rutinas, etc.) que requieren membresía al corriente. */
export function isMembershipContentPath(pathname: string) {
  return pathname === '/app/clases' || pathname.startsWith('/app/clases/');
}

export function membershipLockCopy(status?: MembershipStatus) {
  if (status === 'vencida') {
    return {
      title: 'Membresía vencida',
      body: 'Renueva tu plan para volver a ver clases, rutinas y tu entrenamiento personalizado. La tienda sigue disponible.',
      cta: 'Renovar membresía',
    };
  }
  return {
    title: 'Activa tu membresía',
    body: 'Clases, rutinas y personalización se desbloquean al pagar tu plan. Mientras tanto puedes comprar en la tienda.',
    cta: 'Activar membresía',
  };
}
