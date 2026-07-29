import type { HelpContent } from '@/lib/help/types';

/**
 * Centro de conocimiento — Administración Villanova Boxing.
 */
export const adminHelpContent: HelpContent = {
  title: 'Ayuda y Centro de Conocimiento',
  subtitle: 'Guías rápidas para operar el gym de boxeo día a día.',
  stepsHeading: 'Primeros pasos',
  steps: [
    {
      id: 'activar-socios',
      title: '1. Activar socios',
      description:
        'Online: el alumno se registra (Google o correo), paga y queda Cliente Activo automáticamente (30 días). Presencial: confirma el pago en Socios y se activa igual.',
    },
    {
      id: 'publicar-clase',
      title: '2. Publicar clase de boxeo',
      description:
        'En Clases crea horarios: Técnica Base, Costales, Mitts, Sparring, Boxeo Infantil, etc. Define cupo para que salga en el portal.',
    },
    {
      id: 'vender-producto',
      title: '3. Vender producto',
      description:
        'En Tienda gestiona guantes, protectores, playeras y merch Villanova. Al vender, descuenta inventario desde el panel.',
    },
  ],
  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      id: 'por-activar',
      question: "¿Por qué el socio aparece 'Por activar'?",
      answer:
        'Se registró pero el pago aún no está confirmado (o pagó en recepción). Abre su ficha, confirma el pago o actívalo: la vigencia se calcula en 30 días y se encola la bienvenida.',
    },
    {
      id: 'por-vencer',
      question: '¿Cómo se marca "Por vencer"?',
      answer:
        'Automático: cuando faltan 3 días o menos para la fecha de corte. También se programa el recordatorio de renovación en Seguimiento automático.',
    },
    {
      id: 'cobrar-reto',
      question: '¿Cómo cobrar un reto?',
      answer:
        'Los retos se publican en el Portal. El socio acepta y paga desde la app; al confirmar el pago el reto queda activo al instante.',
    },
    {
      id: 'clase-portal',
      question: '¿Cómo se ve la clase en el Portal del Socio?',
      answer:
        'La clase del día (horario + rutina de sombra/costal/mitts) alimenta “Clase del día” en el portal. Si no aparece, revisa Clases y Rutinas.',
    },
    {
      id: 'renovar-membresia',
      question: '¿Cómo renueva un socio su membresía?',
      answer:
        'Desde el Portal (“Pagar ahora”) o en recepción activando el pago. La fecha de vencimiento se renueva a +30 días desde el pago.',
    },
  ],
  footerNote: '¿Necesitas algo más? Revisa Socios, Clases o Tienda según la operación del día.',
};
