export type MemberStatus = 'activo' | 'por_vencer' | 'vencido' | 'pendiente';

export type MemberTrainingLevel = 'principiante' | 'intermedio' | 'avanzado';

export type MemberAttendanceRisk = 'ok' | 'baja' | 'en_riesgo' | 'sin_registro';

export type Member = {
  id: string;
  name: string;
  email: string;
  plan: string;
  /** Id del plan del portal (individual / duo / grupal). */
  planId?: string;
  expiresAt: string;
  status: MemberStatus;
  registeredAt?: string;
  phone?: string;
  amountPaid?: number;
  activatedAt?: string;
  /** Retos contratados / inscritos. */
  challengeIds?: string[];
  challengeTitles?: string[];
  trainingLevel?: MemberTrainingLevel;
  /** Última clase / rutina de box asignada. */
  primaryClassName?: string;
  lastWorkoutTitle?: string;
  sessionsThisWeek?: number;
  streakDays?: number;
  completedSessionsCount?: number;
  trainingUpdatedAt?: string;
  /** Asistencia física (check-in QR). */
  lastCheckInAt?: string;
  checkInsThisMonth?: number;
  daysSinceLastVisit?: number;
  attendanceRisk?: MemberAttendanceRisk;
  /** Alta creada al escanear un QR sin expediente en este dispositivo. */
  unverifiedFromQr?: boolean;
};

export type TodayPackage = {
  id: string;
  member: string;
  sessions: number;
  expiresAt: string;
};

export type TodayClass = {
  id: string;
  time: string;
  name: string;
  enrolled: number;
  capacity: number;
};

export type Birthday = {
  id: string;
  name: string;
  birthDate: string;
};

export type AgendaClass = {
  id: string;
  day: number;
  time: string;
  name: string;
  enrolled: number;
  capacity: number;
};

export type AgendaDay = {
  label: string;
  reservations: number;
};

export type Product = {
  id: string;
  name: string;
  stock: number;
  price: number;
  public: boolean;
  modifiedBy: string;
  image: string;
  active: boolean;
};

export type Wod = {
  id: string;
  date: string;
  title: string;
  exercises: string;
  marks: number;
};

export type AdminDatabase = {
  version: number;
  members: Member[];
  pendingUsers: Member[];
  todayPackages: TodayPackage[];
  todayClasses: TodayClass[];
  upcomingBirthdays: Birthday[];
  agendaDays: AgendaDay[];
  agendaClasses: AgendaClass[];
  agendaWeekLabel: string;
  products: Product[];
  wods: Wod[];
  newThisMonth: number;
  reservationsToday: number;
};

export const adminUser = {
  name: 'Admin Villanova',
  initials: 'AC',
  role: 'Administrador',
};

export function createSeedDatabase(): AdminDatabase {
  const shop: Product[] = [
    {
      id: 'playera-negra',
      name: 'Playera Villanova Negra',
      stock: 22,
      price: 449,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_dyw458dyw458dyw4.png',
      active: true,
    },
    {
      id: 'playera-blanca',
      name: 'Playera Villanova Blanca',
      stock: 20,
      price: 449,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_qph5lwqph5lwqph5.png',
      active: true,
    },
    {
      id: 'short-negro',
      name: 'Short Villanova Negro',
      stock: 17,
      price: 399,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_1qliyw1qliyw1qli.png',
      active: true,
    },
    {
      id: 'gorra-negra',
      name: 'Gorra Villanova Negra',
      stock: 14,
      price: 329,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_1z7am01z7am01z7a.png',
      active: true,
    },
    {
      id: 'guantes-rojo-blanco',
      name: 'Guantes Villanova Rojo / Blanco 8 oz',
      stock: 8,
      price: 1899,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_q610jrq610jrq610.png',
      active: true,
    },
    {
      id: 'guantes-negro-blanco',
      name: 'Guantes Villanova Negro / Blanco 8 oz',
      stock: 8,
      price: 1899,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_c2lzigc2lzigc2lz.png',
      active: true,
    },
    {
      id: 'protector-negro',
      name: 'Protector de cabeza Villanova Negro',
      stock: 6,
      price: 1499,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_cxqdcycxqdcycxqd.png',
      active: true,
    },
    {
      id: 'protector-rosa',
      name: 'Protector de cabeza Villanova Rosa',
      stock: 5,
      price: 1499,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_1299pv1299pv1299.png',
      active: true,
    },
    {
      id: 'shaker-gris',
      name: 'Shaker Villanova Gris 700 ml',
      stock: 25,
      price: 249,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_52wehh52wehh52we.png',
      active: true,
    },
    {
      id: 'toalla-negra',
      name: 'Toalla Villanova Negra',
      stock: 28,
      price: 219,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_66mubv66mubv66mu.png',
      active: true,
    },
    {
      id: 'proteina-whey',
      name: 'Villanova Whey Proteína Chocolate 1.4 kg',
      stock: 10,
      price: 949,
      public: true,
      modifiedBy: 'Admin Villanova',
      image: '/tienda/Gemini_Generated_Image_2v5ea02v5ea02v5e.png',
      active: true,
    },
  ];

  return {
    version: 2,
    newThisMonth: 9,
    reservationsToday: 28,
    agendaWeekLabel: 'Semana del lunes 27 de julio',
    pendingUsers: [
      {
        id: 'p1',
        name: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        plan: 'Individual / Base',
        expiresAt: '—',
        status: 'pendiente',
        registeredAt: '25/07/2026',
      },
      {
        id: 'p2',
        name: 'Carlos Ruiz',
        email: 'carlos.ruiz@email.com',
        plan: 'Visita / clase suelta',
        expiresAt: '—',
        status: 'pendiente',
        registeredAt: '26/07/2026',
      },
      {
        id: 'p3',
        name: 'Diana López',
        email: 'diana.lopez@email.com',
        plan: 'Dúo / Compañero',
        expiresAt: '—',
        status: 'pendiente',
        registeredAt: '27/07/2026',
      },
    ],
    todayPackages: [
      { id: 'pk1', member: 'Luciana Gomez', sessions: 12, expiresAt: '30/08/2026' },
      { id: 'pk2', member: 'Martin Rodriguez', sessions: 8, expiresAt: '28/08/2026' },
      { id: 'pk3', member: 'Sofía Herrera', sessions: 16, expiresAt: '05/09/2026' },
      { id: 'pk4', member: 'Diego Vargas', sessions: 4, expiresAt: '22/08/2026' },
      { id: 'pk5', member: 'Valentina Cruz', sessions: 12, expiresAt: '02/09/2026' },
    ],
    todayClasses: [
      { id: 'c1', time: '07:00', name: 'Costales & Potencia', enrolled: 12, capacity: 16 },
      { id: 'c2', time: '16:00', name: 'Boxeo Infantil', enrolled: 10, capacity: 12 },
      { id: 'c3', time: '18:00', name: 'Técnica Base', enrolled: 14, capacity: 16 },
      { id: 'c4', time: '19:00', name: 'Sparring Controlado', enrolled: 8, capacity: 10 },
      { id: 'c5', time: '19:30', name: 'Mitts Avanzado', enrolled: 6, capacity: 8 },
    ],
    upcomingBirthdays: [
      { id: 'b1', name: 'Luciana Gomez', birthDate: '02/08' },
      { id: 'b2', name: 'Pedro Sánchez', birthDate: '08/08' },
      { id: 'b3', name: 'María Fernanda', birthDate: '15/08' },
    ],
    members: [
      {
        id: 'm1',
        name: 'Luciana Gomez',
        email: 'luciana.gomez@email.com',
        plan: 'Individual / Base',
        expiresAt: '30/08/2026',
        status: 'activo',
      },
      {
        id: 'm2',
        name: 'Martin Rodriguez',
        email: 'martin.rodriguez@email.com',
        plan: 'Dúo / Compañero',
        expiresAt: '05/08/2026',
        status: 'por_vencer',
      },
      {
        id: 'm3',
        name: 'Sofía Herrera',
        email: 'sofia.herrera@email.com',
        plan: 'Grupal / Comunidad',
        expiresAt: '12/09/2026',
        status: 'activo',
      },
      {
        id: 'm4',
        name: 'Diego Vargas',
        email: 'diego.vargas@email.com',
        plan: 'Individual / Base',
        expiresAt: '10/07/2026',
        status: 'vencido',
      },
      {
        id: 'm5',
        name: 'Valentina Cruz',
        email: 'valentina.cruz@email.com',
        plan: 'Dúo / Compañero',
        expiresAt: '18/08/2026',
        status: 'activo',
      },
      {
        id: 'm6',
        name: 'Andrés Morales',
        email: 'andres.morales@email.com',
        plan: 'Individual / Base',
        expiresAt: '03/08/2026',
        status: 'por_vencer',
      },
      {
        id: 'm7',
        name: 'Camila Torres',
        email: 'camila.torres@email.com',
        plan: 'Grupal / Comunidad',
        expiresAt: '01/10/2026',
        status: 'activo',
      },
      {
        id: 'm8',
        name: 'Javier Peña',
        email: 'javier.pena@email.com',
        plan: 'Visita / clase suelta',
        expiresAt: '05/06/2026',
        status: 'vencido',
      },
    ],
    agendaDays: [
      { label: 'Lunes 27', reservations: 36 },
      { label: 'Martes 28', reservations: 32 },
      { label: 'Miércoles 29', reservations: 40 },
      { label: 'Jueves 30', reservations: 34 },
      { label: 'Viernes 31', reservations: 38 },
      { label: 'Sábado 1', reservations: 24 },
      { label: 'Domingo 2', reservations: 0 },
    ],
    agendaClasses: [
      { id: 'a1', day: 0, time: '16:00', name: 'Boxeo Infantil', enrolled: 10, capacity: 12 },
      { id: 'a2', day: 0, time: '18:00', name: 'Técnica Base', enrolled: 14, capacity: 16 },
      { id: 'a3', day: 1, time: '19:00', name: 'Sparring Controlado', enrolled: 8, capacity: 10 },
      { id: 'a4', day: 2, time: '07:00', name: 'Costales & Potencia', enrolled: 12, capacity: 16 },
      { id: 'a5', day: 2, time: '17:00', name: 'Boxeo Juvenil', enrolled: 11, capacity: 14 },
      { id: 'a6', day: 3, time: '19:00', name: 'Mitts Avanzado', enrolled: 6, capacity: 8 },
      { id: 'a7', day: 4, time: '18:30', name: 'Cardio Box', enrolled: 13, capacity: 16 },
      { id: 'a8', day: 5, time: '10:00', name: 'Open Gym Familiar', enrolled: 15, capacity: 20 },
    ],
    products: shop,
    wods: [
      {
        id: 'w1',
        date: '28/07',
        title: 'Técnica + costal',
        exercises: '3 rounds: 3 min sombra · 2 min costal · 1 min core',
        marks: 18,
      },
      {
        id: 'w2',
        date: '27/07',
        title: 'Mitts y timing',
        exercises: 'Calentamiento cuerda · 6 rounds mitts · enfriamiento movilidad',
        marks: 12,
      },
      {
        id: 'w3',
        date: '26/07',
        title: 'Potencia en sacos',
        exercises: 'Rounds de potencia en costales · burpees · sombra final',
        marks: 22,
      },
      {
        id: 'w4',
        date: '25/07',
        title: 'Sparring controlado',
        exercises: 'Técnica de guardia · 4 rounds sparring ligero · debrief coach',
        marks: 9,
      },
      {
        id: 'w5',
        date: '24/07',
        title: 'Cardio box',
        exercises: 'Circuito: cuerda · sombra · costal · abdominales · 4 estaciones',
        marks: 16,
      },
    ],
  };
}
