/**
 * Planes del flujo "Únete a Villanova".
 * Edita precios/nombres aquí; el registro y /app/pagar los leen automáticamente.
 */

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  /** Incluye cuota de inscripción en el total del checkout. */
  includesEnrollment?: boolean;
  /** Cupo de personas incluidas en el plan. */
  seats?: number;
};

export const SUBSCRIPTION_ENROLLMENT_FEE = 0;

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'individual',
    name: 'Individual / Base',
    price: 650,
    period: '/mes',
    description: 'Entrena a tu ritmo con costales, calistenia y acondicionamiento, sin golpes de contacto.',
    features: [
      'Zona de costales y aparatos sin límite',
      '1 clase guiada diaria',
      'Rutinas prácticas en tu celular',
    ],
    seats: 1,
    includesEnrollment: false,
  },
  {
    id: 'duo',
    name: 'Dúo / Compañero',
    price: 1100,
    period: '/mes · 2 personas',
    description: 'Entrena con tu pareja, un familiar o un amigo y avancen juntos a un precio preferencial.',
    features: [
      'Todos los beneficios Individual para 2',
      'Retos mensuales en equipo',
      'Registro de asistencias y avances',
    ],
    popular: true,
    seats: 2,
    includesEnrollment: false,
  },
  {
    id: 'grupal',
    name: 'Grupal / Comunidad',
    price: 1800,
    period: '/mes · hasta 4',
    description: 'Hasta 4 personas entrenando juntas, con clases adaptadas a la edad y condición de cada una.',
    features: [
      'Acceso ilimitado para hasta 4 integrantes',
      'Clases por nivel y edad',
      'Entrada preferencial a eventos y dinámicas',
    ],
    seats: 4,
    includesEnrollment: false,
  },
];

export function getSubscriptionPlan(planId: string) {
  return subscriptionPlans.find((p) => p.id === planId) ?? subscriptionPlans[0];
}

export function getSubscriptionCheckoutAmount(planId: string) {
  const plan = getSubscriptionPlan(planId);
  const enrollment = plan.includesEnrollment ? SUBSCRIPTION_ENROLLMENT_FEE : 0;
  return {
    plan,
    planPrice: plan.price,
    enrollment,
    total: plan.price + enrollment,
  };
}
