import type { HelpContent } from '@/lib/help/types';

/**
 * Centro de conocimiento — Portal del Socio (boxeo).
 */
export const portalHelpContent: HelpContent = {
  title: 'Ayuda Portal Villanova',
  subtitle: 'Todo lo que necesitas para entrenar boxeo y pagar sin fricción.',
  stepsHeading: 'Primeros pasos',
  steps: [
    {
      id: 'revisar-cuenta',
      title: '1. Revisa tu cuenta',
      description:
        'En Inicio o Cuenta verás si tu membresía (Individual, Dúo o Grupal) está Activa o Vencida, y hasta cuándo vence.',
    },
    {
      id: 'clase-del-dia',
      title: '2. Mira la clase del día',
      description:
        'En Inicio o Clases encuentras horario, coach y la rutina (sombra, costal, mitts). Llega listo; si está reservada, ya tienes tu lugar.',
    },
    {
      id: 'unirte-reto',
      title: '3. Únete a un reto',
      description:
        'En Retos elige el que te motive, toca “Aceptar y Pagar” y confirma el monto. Queda activo al instante.',
    },
  ],
  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      id: 'pagar-membresia',
      question: '¿Cómo pago o renuevo mi membresía?',
      answer:
        'Toca “Pagar ahora” en Estado de cuenta. Te lleva a Pagar con el monto de renovación (Individual $650, Dúo $1,100 o Grupal $1,800). Confirma y tu pase queda Activo.',
    },
    {
      id: 'vencido',
      question: '¿Qué pasa si mi pase está Vencido?',
      answer:
        'Puedes ver la app, pero debes renovar para seguir entrenando. Usa “Pagar ahora” o acércate a recepción en el gym.',
    },
    {
      id: 'aceptar-reto',
      question: '¿Cómo acepto y pago un reto?',
      answer:
        'Abre Retos, elige uno y toca “Aceptar y Pagar”. Se abre la pantalla de pago con el precio del reto. Al confirmar, aparece como Inscrito.',
    },
    {
      id: 'wod',
      question: '¿Dónde veo la rutina del día?',
      answer:
        'En Inicio, dentro de “Clase del día”, o en la pestaña Clases. Ahí están los bloques: sombra, costal, mitts, sparring, etc.',
    },
    {
      id: 'acceso',
      question: '¿Cómo entro al Portal?',
      answer:
        'Desde el sitio web en “Iniciar Sesión / Acceso Alumnos”, o en /app/login. Puedes entrar con Google o con tu correo.',
    },
  ],
  footerNote: '¿Dudas? Escríbenos por WhatsApp desde Contacto o pásate por el gym.',
};
