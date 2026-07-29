/**
 * Abstracción de pagos del portal — solo demo / propuesta.
 * No hay Stripe, Mercado Pago ni cobros reales: todo termina en /app/pagar simulado.
 */
export type PaymentProvider = 'villanova_checkout';

export type PaymentIntent = {
  kind: 'membership' | 'challenge';
  amount: number;
  currency: 'MXN';
  reference: string;
  successUrl: string;
  cancelUrl: string;
};

export function getConfiguredPaymentProvider(): PaymentProvider {
  return 'villanova_checkout';
}

export function buildMembershipPayUrl(amount: number, planName = 'Pase Libre', planId?: string) {
  const params = new URLSearchParams({
    concepto: 'membresia',
    monto: String(amount),
    titulo: planName,
  });
  if (planId) params.set('planId', planId);
  return `/app/pagar?${params.toString()}`;
}

/** Checkout del flujo Únete al Club (registro → pagar simulado). */
export function buildSubscriptionCheckoutUrl(planId: string, amount: number) {
  const params = new URLSearchParams({
    planId,
    monto: String(amount),
    concepto: 'suscripcion',
  });
  return `/app/pagar?${params.toString()}`;
}

/** Renovación: exige sesión; si no hay cuenta, el caller debe mandar a registro. */
export function buildMembershipCheckoutUrl(planId: string) {
  return `/app/registro?plan=${planId}`;
}

export function buildChallengeCheckoutUrl(challengeId: string, amount: number) {
  const params = new URLSearchParams({
    reto: challengeId,
    monto: String(amount),
    concepto: 'reto',
  });
  return `/app/pagar?${params.toString()}`;
}