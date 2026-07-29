export const membershipPlans = [
  {
    id: 'individual',
    title: 'Plan Individual / Base',
    price: 650,
    period: '/mes',
    popular: false,
    description:
      'Es el entrenamiento fundamental para trabajar a tu propio ritmo. Combinamos calistenia, técnica de golpes en costales y acondicionamiento físico general, sin golpes de contacto ni riesgos de pelea. Ideal para principiantes o para quien busca un cambio real.',
    benefits: [
      {
        title: 'Transformación física total',
        copy: 'Puedes quemar hasta 800 calorías por hora mientras reduces grasa y tonificas brazos, piernas, pecho y abdomen.',
      },
      {
        title: 'Un corazón más fuerte',
        copy: 'Mejora tu circulación, resistencia y condición física con entrenamiento por intervalos de alta intensidad.',
      },
      {
        title: 'Mente despejada y menos estrés',
        copy: 'Libera la tensión del día, canaliza la frustración y fortalece la confianza en ti mismo.',
      },
    ],
    features: [
      'Entrenamiento ilimitado en la zona de costales y aparatos',
      '1 clase guiada diaria para aprender la técnica correcta y evitar lesiones',
      'Rutinas prácticas en tu celular para guiar cada entrenamiento',
    ],
  },
  {
    id: 'duo',
    title: 'Plan Dúo / Compañero',
    price: 1100,
    period: '/mes · 2 personas',
    popular: true,
    description:
      'La opción perfecta para venir con tu pareja, un familiar o un amigo. Comparten el espacio y los entrenamientos, con el impulso de alcanzar sus metas juntos a un precio preferencial.',
    benefits: [
      {
        title: 'Doble constancia, cero pretextos',
        copy: 'Entrenar acompañado aumenta la motivación: se apoyan, compiten sanamente y avanzan juntos.',
      },
      {
        title: 'Ahorro inteligente',
        copy: 'Los dos reciben todos los beneficios del plan Individual con una tarifa especial.',
      },
      {
        title: 'Progreso que pueden ver',
        copy: 'Registran sus asistencias y avances para observar el cambio físico y mental semana a semana.',
      },
    ],
    features: [
      'Todos los beneficios del plan Individual para 2 personas',
      'Retos mensuales en línea para mantener la motivación en equipo',
      'Registro de asistencias y avances desde el celular',
    ],
  },
  {
    id: 'grupal',
    title: 'Plan Grupal / Comunidad',
    price: 1800,
    period: '/mes · hasta 4',
    popular: false,
    description:
      'Un espacio dinámico para entrenar en equipo con hasta 4 integrantes, sin necesidad de ser familia. Las clases se adaptan a la edad y condición de cada persona.',
    benefits: [
      {
        title: 'La energía de la comunidad',
        copy: 'Entrena en un ambiente divertido, seguro e inclusivo donde el compañerismo te impulsa a dar más.',
      },
      {
        title: 'Disciplina y agilidad mental',
        copy: 'Mejora reflejos, coordinación, estabilidad y postura mientras desarrollas recursos útiles de defensa personal.',
      },
      {
        title: 'Vive la experiencia Villanova',
        copy: 'Recibe trato preferencial en eventos y dinámicas de la comunidad, sin obligación de pelear.',
      },
    ],
    features: [
      'Acceso ilimitado para que hasta 4 integrantes entrenen juntos',
      'Clases y horarios adaptados al nivel y edad de cada integrante',
      'Entrada preferencial a eventos y dinámicas de Villanova Boxing',
    ],
  },
] as const;

/** Inscripción única al activar plan. */
export const enrollmentFee: number = 0;

export const otherRates = [
  { id: 'visita', label: 'Visita / clase suelta', price: 150 },
  { id: 'semana', label: 'Semana de prueba', price: 350 },
  { id: 'inscripcion', label: 'Kit de bienvenida (opcional)', price: 200 },
] as const;

export const classes = [
  { name: 'Boxeo Infantil', type: 'Niños', coach: 'Coach Villanova', day: 'Lunes', time: '16:00', duration: '45 min' },
  { name: 'Técnica Base', type: 'Principiantes', coach: 'Coach Villanova', day: 'Lunes', time: '18:00', duration: '60 min' },
  { name: 'Sparring Controlado', type: 'Intermedio', coach: 'Coach Villanova', day: 'Martes', time: '19:00', duration: '60 min' },
  { name: 'Costales & Potencia', type: 'Acondicionamiento', coach: 'Coach Villanova', day: 'Miércoles', time: '07:00', duration: '60 min' },
  { name: 'Boxeo Juvenil', type: 'Jóvenes', coach: 'Coach Villanova', day: 'Miércoles', time: '17:00', duration: '60 min' },
  { name: 'Mitts Avanzado', type: 'Avanzado', coach: 'Coach Villanova', day: 'Jueves', time: '19:00', duration: '60 min' },
  { name: 'Cardio Box', type: 'Fitness', coach: 'Coach Villanova', day: 'Viernes', time: '18:30', duration: '45 min' },
  { name: 'Open Gym Familiar', type: 'Comunidad', coach: 'Coach Villanova', day: 'Sábado', time: '10:00', duration: '90 min' },
] as const;

/** Horario oficial Villanova Boxing. */
export const gymHours = {
  weekday: 'Lun–Vie · 6:00 – 21:00 hrs',
  saturday: 'Sáb · 9:00 – 12:00 hrs',
  sunday: 'Domingo cerrado',
  /** Una línea para footers / nav */
  short: 'Lun–Vie 6–21 · Sáb 9–12 · Dom cerrado',
  /** Línea compacta para el panel administrativo */
  compact: 'Lun–Vie 6:00–21:00 · Sáb 9:00–12:00 · Dom cerrado',
  lines: [
    'Lunes a viernes: 6:00 – 21:00 hrs',
    'Sábado: 9:00 – 12:00 hrs',
    'Domingo: cerrado',
  ],
} as const;

/**
 * Método de entrenamiento Villanova — copy adaptado del pitch oficial.
 * Sin emojis; tono de boxeo + funcional para el sitio.
 */
export const trainingMethod = {
  eyebrow: 'Método Villanova',
  title: 'EL ENTRENAMIENTO QUE REVOLUCIONA\n*CUERPO Y MENTE.*',
  lead:
    'Sesenta minutos. Máximo impacto. Cada minuto de la clase está diseñado para sacar lo mejor de ti: desde el primer round te llevamos al límite para que descubras tu verdadero potencial.',
  pillars: [
    {
      id: 'impacto',
      title: '60 minutos, máximo impacto',
      copy:
        'No es un gym de rutinas sueltas. Entrenas con estructura: sombra, costales, mitts y acondicionamiento en una sesión completa que pide todo de ti.',
      points: [] as string[],
    },
    {
      id: 'composicion',
      title: 'Quema grasa y construye músculo',
      copy:
        'La combinación de ejercicios funcionales con boxeo acelera el metabolismo, quema grasa y gana músculo en la misma sesión. Trabajas todo el cuerpo de forma explosiva y efectiva.',
      points: [] as string[],
    },
    {
      id: 'resultados',
      title: 'Resultados reales, sin excusas',
      copy: '',
      points: [
        'Alta intensidad para moldear y tonificar el cuerpo',
        'Progreso sin depender de equipo costoso',
        'Funcional + boxeo para un físico fuerte y definido',
      ],
    },
    {
      id: 'niveles',
      title: 'Para todos los niveles y objetivos',
      copy: '',
      points: [
        'Hombres y mujeres que buscan verse y sentirse mejor',
        'Desde principiantes hasta avanzados',
        'Cada quien ajusta la intensidad; el progreso es inevitable',
      ],
    },
  ],
} as const;

/**
 * Beneficios del boxeo — complementa el método de entrenamiento.
 */
export const boxingBenefits = {
  eyebrow: 'Beneficios',
  title: 'BENEFICIOS\nDEL *BOX.*',
  lead:
    'El boxeo va más allá de los golpes: fuerza, coordinación, mente clara y estrategia. En cada clase trabajas cuerpo y mente a la vez.',
  items: [
    {
      id: 'equilibrio',
      title: 'Equilibrio',
      copy:
        'Con la coordinación de piernas y brazos entrenas también la mente y mejoras tu sentido del equilibrio.',
      icon: 'scale' as const,
    },
    {
      id: 'tonifica',
      title: 'Tonifica',
      copy:
        'Define y tonifica músculo, gana flexibilidad y fuerza en todo el cuerpo — sin rutinas aburridas de gym tradicional.',
      icon: 'dumbbell' as const,
    },
    {
      id: 'cardio',
      title: 'Cardio',
      copy:
        'Fortalece tu sistema cardiovascular con sesiones intensas, adaptadas a tu nivel y ritmo.',
      icon: 'heart' as const,
    },
    {
      id: 'estres',
      title: 'Libera estrés',
      copy:
        'Suelta la tensión del día a día. El boxeo libera endorfinas y sube tu bienestar de verdad.',
      icon: 'zap' as const,
    },
  ],
} as const;

/**
 * Credenciales del equipo de coaches — confianza y seguridad.
 */
export const coachingTeam = {
  eyebrow: 'El equipo',
  title: 'COACHES\n*PREPARADOS.*',
  lead:
    'Contamos con un equipo de profesionales expertos en técnicas de boxeo y disciplinas afines. Entrenas con gente que sabe, y con seguridad de verdad.',
  credentials: [
    {
      id: 'colegio',
      label: 'Certificación de entrenadores',
      detail:
        'por el Colegio Profesional de Licenciados en Entrenamiento Deportivo.',
    },
    {
      id: 'primeros-auxilios',
      label: 'Primeros auxilios',
      detail: 'Todo el equipo está certificado en el Curso de Primeros Auxilios.',
    },
    {
      id: 'femenil',
      label: 'Boxeo femenil y equidad',
      detail:
        'Entrenadores certificados en boxeo femenil como promotores de equidad de género.',
    },
    {
      id: 'licencia',
      label: 'Entrenador Profesional',
      detail: 'Licencia oficial por la Comisión de Box.',
    },
  ],
} as const;

export const reviews = [
  {
    name: 'Ana Martínez',
    initials: 'AM',
    text: 'Ambiente seguro para traer a mis hijos. Los coaches cuidan la técnica y el respeto en cada clase.',
  },
  {
    name: 'Luis Ortega',
    initials: 'LO',
    text: 'Excelente área de costales y clases guiadas. En pocas semanas noté más resistencia y disciplina.',
  },
  {
    name: 'Sofía Rentería',
    initials: 'SR',
    text: 'El plan Dúo nos funcionó perfecto a mi hermana y a mí. Retos mensuales y seguimiento en la app.',
  },
  {
    name: 'Carlos Villalobos',
    initials: 'CV',
    text: 'Inclusivo de verdad: niños, jóvenes y adultos entrenando con niveles claros. 100% recomendado.',
  },
  {
    name: 'Mariana Cruz',
    initials: 'MC',
    text: 'Instalaciones limpias, coaches atentos y una comunidad que motiva. Villanova se siente profesional.',
  },
  {
    name: 'Diego Hernández',
    initials: 'DH',
    text: 'El plan Grupal nos alcanza para cuatro amigos. Horarios por nivel y torneos internos recreativos.',
  },
] as const;
