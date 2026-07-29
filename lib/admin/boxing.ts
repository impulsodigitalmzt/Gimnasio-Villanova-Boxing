/**
 * Catálogo de clases para la administración de Villanova Boxing.
 * Alineado con la oferta pública (lib/site-data.ts).
 */
export const BOXING_CLASS_NAMES = [
  'Boxeo Infantil',
  'Técnica Base',
  'Sparring Controlado',
  'Costales & Potencia',
  'Boxeo Juvenil',
  'Mitts Avanzado',
  'Cardio Box',
  'Open Gym Familiar',
] as const;

export const BOXING_CLASS_FILTERS = ['Todos', ...BOXING_CLASS_NAMES] as const;

export const BOXING_MEMBERSHIP_PLANS = [
  'Individual / Base',
  'Dúo / Compañero',
  'Grupal / Comunidad',
  'Visita / clase suelta',
  'Semana de prueba',
] as const;
