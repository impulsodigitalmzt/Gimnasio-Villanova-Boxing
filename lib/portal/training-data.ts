/**
 * Programa de entrenamiento personalizado del Portal del Alumno.
 * Contenido demo realista: se desbloquea con membresía al corriente.
 */

export type TrainingLevel = 'principiante' | 'intermedio' | 'avanzado';

export type ExerciseAid = {
  kind: 'video' | 'tips';
  /** Ruta de video corto si existe en /public/video */
  src?: string;
  /** Pasos técnicos / postura */
  cues: string[];
};

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  /** Peso sugerido según nivel (kg o descripción). */
  weightByLevel: Record<TrainingLevel, string>;
  restSec: number;
  aid: ExerciseAid;
};

export type DailyWorkout = {
  id: string;
  /** 0=dom … 6=sáb (Date.getDay()) */
  weekday: number;
  focus: string;
  title: string;
  durationMin: number;
  levelHint: string;
  exercises: WorkoutExercise[];
};

export type CalendarSessionStatus = 'completada' | 'pendiente' | 'programada' | 'descanso';

export type CalendarSession = {
  dateKey: string; // YYYY-MM-DD
  weekdayLabel: string;
  title: string;
  time?: string;
  status: CalendarSessionStatus;
  workoutId?: string;
};

export type ProgressEntry = {
  id: string;
  dateKey: string;
  exerciseId: string;
  exerciseName: string;
  weight: string;
  reps: string;
  notes: string;
  createdAt: string;
};

export type MemberTrainingStats = {
  weeksCompleted: number;
  weeksGoal: number;
  sessionsThisWeek: number;
  sessionsWeekGoal: number;
  streakDays: number;
  level: TrainingLevel;
};

const V = (name: string) => `/video/${name}`;

function tips(...cues: string[]): ExerciseAid {
  return { kind: 'tips', cues };
}

function videoAid(src: string, ...cues: string[]): ExerciseAid {
  return { kind: 'video', src, cues };
}

/** Rutinas por día de la semana (ciclo Villanova). */
export const weeklyWorkouts: DailyWorkout[] = [
  {
    id: 'wod_lun_superior',
    weekday: 1,
    focus: 'Tren superior',
    title: 'Fuerza de puños y espalda',
    durationMin: 55,
    levelHint: 'Empuja con control; no sacrifiques postura por peso.',
    exercises: [
      {
        id: 'ex_sombra_jab',
        name: 'Sombra: jab–cross',
        sets: 4,
        reps: '3 min',
        weightByLevel: {
          principiante: 'Sin peso · foco en forma',
          intermedio: 'Mancuernas 1–2 kg',
          avanzado: 'Mancuernas 2–3 kg',
        },
        restSec: 60,
        aid: tips(
          'Mentón bajo y mirada al frente',
          'Gira la cadera al cruzar el cross',
          'Vuelve a guardia después de cada golpe',
        ),
      },
      {
        id: 'ex_costal_combos',
        name: 'Costal: combinaciones 1-2-3',
        sets: 5,
        reps: '2 min',
        weightByLevel: {
          principiante: 'Ritmo moderado',
          intermedio: 'Ritmo alto · 70%',
          avanzado: 'Ritmo alto · potencia controlada',
        },
        restSec: 45,
        aid: videoAid(
          V('AQNcpnTKe9yiEnTfxPaCID-mvsW5-nfyvWPNX5k_QNYxha9PooiDhWB9LuDKmruv4EHCKQ5VuTbKguo8ZyiEIniynVe8y5PLeFpa0Gc.mp4'),
          'Pies firmes, no te lances sobre el costal',
          'Golpea y recupera guardia al instante',
          'Exhala en cada impacto',
        ),
      },
      {
        id: 'ex_flexiones',
        name: 'Flexiones de pecho',
        sets: 3,
        reps: '10–15',
        weightByLevel: {
          principiante: 'Rodillas o pared',
          intermedio: 'Peso corporal',
          avanzado: 'Peso corporal + pausa 2 s',
        },
        restSec: 60,
        aid: tips(
          'Codo a ~45° del torso',
          'Core activo, cadera alineada',
          'Baja con control hasta pecho cerca del piso',
        ),
      },
      {
        id: 'ex_remo_manc',
        name: 'Remo con mancuerna',
        sets: 3,
        reps: '12 por brazo',
        weightByLevel: {
          principiante: '4–6 kg',
          intermedio: '8–12 kg',
          avanzado: '14–18 kg',
        },
        restSec: 75,
        aid: tips(
          'Espalda neutra, sin redondear',
          'Codo cerca del cuerpo al subir',
          'Aprieta omóplatos al final del movimiento',
        ),
      },
      {
        id: 'ex_plancha',
        name: 'Plancha frontal',
        sets: 3,
        reps: '30–45 s',
        weightByLevel: {
          principiante: '30 s',
          intermedio: '40 s',
          avanzado: '45–60 s',
        },
        restSec: 45,
        aid: tips('Glúteos apretados', 'No dejes caer la cadera', 'Respira constante'),
      },
    ],
  },
  {
    id: 'wod_mar_pierna',
    weekday: 2,
    focus: 'Pierna y potencia',
    title: 'Base fuerte para el ring',
    durationMin: 50,
    levelHint: 'Prioriza profundidad controlada en sentadillas.',
    exercises: [
      {
        id: 'ex_cuerda',
        name: 'Salto de cuerda',
        sets: 4,
        reps: '2 min',
        weightByLevel: {
          principiante: 'Saltos suaves',
          intermedio: 'Ritmo constante',
          avanzado: 'Dobles o alta cadencia',
        },
        restSec: 40,
        aid: tips('Rodillas suaves', 'Gira desde las muñecas', 'Mantén el torso estable'),
      },
      {
        id: 'ex_sentadilla',
        name: 'Sentadilla goblet',
        sets: 4,
        reps: '10–12',
        weightByLevel: {
          principiante: '6–8 kg',
          intermedio: '12–16 kg',
          avanzado: '18–24 kg',
        },
        restSec: 90,
        aid: tips(
          'Pies al ancho de hombros',
          'Rodillas siguen la punta de los pies',
          'Pecho alto al bajar',
        ),
      },
      {
        id: 'ex_zancadas',
        name: 'Zancadas caminando',
        sets: 3,
        reps: '10 por pierna',
        weightByLevel: {
          principiante: 'Sin peso',
          intermedio: 'Mancuernas 6–8 kg',
          avanzado: 'Mancuernas 10–14 kg',
        },
        restSec: 75,
        aid: tips('Paso largo y estable', 'Rodilla trasera baja sin tocar brusco', 'Tronco erguido'),
      },
      {
        id: 'ex_hip_thrust',
        name: 'Puente de glúteo',
        sets: 3,
        reps: '12–15',
        weightByLevel: {
          principiante: 'Peso corporal',
          intermedio: 'Disco 10–15 kg',
          avanzado: 'Disco 20–30 kg',
        },
        restSec: 60,
        aid: tips('Aprieta glúteos arriba', 'No hiperextiendas la lumbar', 'Talones firmes'),
      },
    ],
  },
  {
    id: 'wod_mie_cardio',
    weekday: 3,
    focus: 'Cardio box',
    title: 'Resistencia y ritmo',
    durationMin: 45,
    levelHint: 'Mantén el ritmo; la técnica gana a la fuerza bruta.',
    exercises: [
      {
        id: 'ex_sombra_flow',
        name: 'Sombra continua',
        sets: 5,
        reps: '3 min',
        weightByLevel: {
          principiante: 'Ritmo conversacional',
          intermedio: 'Ritmo medio-alto',
          avanzado: 'Ráfagas de 20 s cada minuto',
        },
        restSec: 60,
        aid: tips('Muévete en círculo', 'Cambia de guardia cada round', 'No bajes las manos'),
      },
      {
        id: 'ex_costal_rounds',
        name: 'Rounds de costal',
        sets: 6,
        reps: '2 min',
        weightByLevel: {
          principiante: '60% intensidad',
          intermedio: '75% intensidad',
          avanzado: '85% con combos largos',
        },
        restSec: 45,
        aid: videoAid(
          V('AQNcpnTKe9yiEnTfxPaCID-mvsW5-nfyvWPNX5k_QNYxha9PooiDhWB9LuDKmruv4EHCKQ5VuTbKguo8ZyiEIniynVe8y5PLeFpa0Gc.mp4'),
          'Pie de pivote activo',
          'Combina jab, cross y ganchos',
          'Recupera respiración en el descanso',
        ),
      },
      {
        id: 'ex_burpees',
        name: 'Burpees técnicos',
        sets: 3,
        reps: '8–12',
        weightByLevel: {
          principiante: 'Sin salto',
          intermedio: 'Con salto',
          avanzado: 'Con flexión completa',
        },
        restSec: 60,
        aid: tips('Aterriza suave', 'Core cerrado al subir', 'No arches la espalda'),
      },
    ],
  },
  {
    id: 'wod_jue_mitts',
    weekday: 4,
    focus: 'Mitts y técnica',
    title: 'Precisión con el coach',
    durationMin: 50,
    levelHint: 'Escucha las llamadas; prioriza timing sobre fuerza.',
    exercises: [
      {
        id: 'ex_mitts_basico',
        name: 'Mitts: combos básicos',
        sets: 6,
        reps: '2 min',
        weightByLevel: {
          principiante: 'Jab–cross',
          intermedio: '1-2-3 y ganchos',
          avanzado: 'Combos de 5–6 golpes',
        },
        restSec: 45,
        aid: tips(
          'Pisa al golpear',
          'Vuelve a guardia entre combinaciones',
          'Mantén distancia de brazo',
        ),
      },
      {
        id: 'ex_defensa',
        name: 'Defensa: slips y rolls',
        sets: 4,
        reps: '90 s',
        weightByLevel: {
          principiante: 'Solo slips',
          intermedio: 'Slips + roll',
          avanzado: 'Slips + roll + counter',
        },
        restSec: 45,
        aid: tips('Rodillas flexibles', 'Movimiento corto y limpio', 'Ojos siempre al frente'),
      },
      {
        id: 'ex_core_russian',
        name: 'Russian twists',
        sets: 3,
        reps: '20 (10 por lado)',
        weightByLevel: {
          principiante: 'Sin peso',
          intermedio: '4–6 kg',
          avanzado: '8–12 kg',
        },
        restSec: 45,
        aid: tips('Gira desde el tronco', 'Pies elevados si puedes', 'No fuerces el cuello'),
      },
    ],
  },
  {
    id: 'wod_vie_completo',
    weekday: 5,
    focus: 'Full body técnico',
    title: 'Cierre de semana',
    durationMin: 55,
    levelHint: 'Sesión completa: deja margen para enfriar bien.',
    exercises: [
      {
        id: 'ex_movilidad',
        name: 'Movilidad de hombros y cadera',
        sets: 1,
        reps: '8 min',
        weightByLevel: {
          principiante: 'Rango cómodo',
          intermedio: 'Rango completo',
          avanzado: 'Rango completo + pausas',
        },
        restSec: 0,
        aid: tips('Sin rebotes bruscos', 'Respira en cada posición', 'Calienta antes de cargar'),
      },
      {
        id: 'ex_circuit',
        name: 'Circuito: sombra + costal + core',
        sets: 4,
        reps: '3+2+1 min',
        weightByLevel: {
          principiante: 'Ritmo estable',
          intermedio: 'Alta densidad',
          avanzado: 'Máxima densidad controlada',
        },
        restSec: 90,
        aid: tips('Transiciones rápidas', 'Hidratación entre rounds', 'Técnica limpia al final'),
      },
      {
        id: 'ex_estiramiento',
        name: 'Estiramiento final',
        sets: 1,
        reps: '6–8 min',
        weightByLevel: {
          principiante: 'Suave',
          intermedio: 'Moderado',
          avanzado: 'Profundo y controlado',
        },
        restSec: 0,
        aid: tips('30–40 s por zona', 'Hombros, cadera y piernas', 'Sal del gym recuperado'),
      },
    ],
  },
  {
    id: 'wod_sab_open',
    weekday: 6,
    focus: 'Open gym',
    title: 'Sesión libre guiada',
    durationMin: 40,
    levelHint: 'Elige 3–4 ejercicios y registra tus marcas.',
    exercises: [
      {
        id: 'ex_open_sombra',
        name: 'Sombra libre',
        sets: 3,
        reps: '3 min',
        weightByLevel: {
          principiante: 'Forma',
          intermedio: 'Forma + ritmo',
          avanzado: 'Forma + potencia',
        },
        restSec: 60,
        aid: tips('Practica lo visto en la semana', 'Grábate si puedes', 'Corrige guardia'),
      },
      {
        id: 'ex_open_fuerza',
        name: 'Bloque de fuerza a elección',
        sets: 3,
        reps: '8–12',
        weightByLevel: {
          principiante: 'Peso ligero',
          intermedio: 'Peso medio',
          avanzado: 'Peso de marca personal',
        },
        restSec: 90,
        aid: tips('Anota el peso en tu registro', '2–3 reps en reserva', 'Buena postura siempre'),
      },
    ],
  },
  {
    id: 'wod_dom_descanso',
    weekday: 0,
    focus: 'Recuperación',
    title: 'Descanso activo',
    durationMin: 20,
    levelHint: 'Hoy prioriza movilidad y sueño.',
    exercises: [
      {
        id: 'ex_caminata',
        name: 'Caminata suave o movilidad',
        sets: 1,
        reps: '15–20 min',
        weightByLevel: {
          principiante: 'Caminata',
          intermedio: 'Caminata + estiramiento',
          avanzado: 'Movilidad profunda',
        },
        restSec: 0,
        aid: tips('Sin intensidad alta', 'Hidrátate', 'Prepárate para el lunes'),
      },
    ],
  },
];

export function getWorkoutForWeekday(weekday = new Date().getDay()): DailyWorkout {
  return weeklyWorkouts.find((w) => w.weekday === weekday) ?? weeklyWorkouts[0];
}

export function dateKeyFromDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const SCHEDULED_WEEKDAYS = new Set([1, 2, 3, 4, 5, 6]);

export function buildMonthCalendar(
  year: number,
  monthIndex: number,
  completedKeys: Set<string>,
): CalendarSession[] {
  const sessions: CalendarSession[] = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const todayKey = dateKeyFromDate(new Date());

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const weekday = date.getDay();
    const key = dateKeyFromDate(date);
    const workout = getWorkoutForWeekday(weekday);

    if (!SCHEDULED_WEEKDAYS.has(weekday)) {
      sessions.push({
        dateKey: key,
        weekdayLabel: WEEKDAY_LABELS[weekday],
        title: 'Descanso',
        status: 'descanso',
        workoutId: workout.id,
      });
      continue;
    }

    let status: CalendarSessionStatus = 'programada';
    if (completedKeys.has(key)) status = 'completada';
    else if (key < todayKey) status = 'pendiente';
    else if (key === todayKey) status = 'programada';

    sessions.push({
      dateKey: key,
      weekdayLabel: WEEKDAY_LABELS[weekday],
      title: workout.focus,
      time: weekday === 6 ? '09:00' : '18:00',
      status,
      workoutId: workout.id,
    });
  }

  return sessions;
}

export function buildWeekCalendar(anchor = new Date(), completedKeys: Set<string>): CalendarSession[] {
  const start = new Date(anchor);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const sessions: CalendarSession[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const weekday = date.getDay();
    const key = dateKeyFromDate(date);
    const workout = getWorkoutForWeekday(weekday);
    const todayKey = dateKeyFromDate(new Date());

    if (!SCHEDULED_WEEKDAYS.has(weekday)) {
      sessions.push({
        dateKey: key,
        weekdayLabel: WEEKDAY_LABELS[weekday],
        title: 'Descanso activo',
        status: 'descanso',
        workoutId: workout.id,
      });
      continue;
    }

    let status: CalendarSessionStatus = 'programada';
    if (completedKeys.has(key)) status = 'completada';
    else if (key < todayKey) status = 'pendiente';

    sessions.push({
      dateKey: key,
      weekdayLabel: WEEKDAY_LABELS[weekday],
      title: workout.title,
      time: weekday === 6 ? '09:00' : '18:00',
      status,
      workoutId: workout.id,
    });
  }
  return sessions;
}

export const DEFAULT_TRAINING_STATS: MemberTrainingStats = {
  weeksCompleted: 3,
  weeksGoal: 8,
  sessionsThisWeek: 2,
  sessionsWeekGoal: 4,
  streakDays: 2,
  level: 'intermedio',
};
