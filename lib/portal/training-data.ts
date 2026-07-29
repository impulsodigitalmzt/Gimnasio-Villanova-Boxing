/**
 * Rutinas del Portal del Alumno — alineadas a clases de box y retos contratados.
 */

import { todayClass, weeklyClassSchedule } from '@/lib/portal/mock-data';
import type { Challenge, DayClass } from '@/lib/portal/types';

export type TrainingLevel = 'principiante' | 'intermedio' | 'avanzado';

export type ExerciseAid = {
  kind: 'video' | 'tips';
  src?: string;
  cues: string[];
};

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  /** Intensidad / carga según nivel (en box: ritmo, rounds, mancuernas ligeras). */
  weightByLevel: Record<TrainingLevel, string>;
  restSec: number;
  aid: ExerciseAid;
  /** Si viene de un reto pagado. */
  fromChallenge?: string;
};

export type DailyWorkout = {
  id: string;
  /** Nombre de la clase Villanova a la que responde esta rutina. */
  className: string;
  focus: string;
  title: string;
  durationMin: number;
  levelHint: string;
  coach?: string;
  time?: string;
  room?: string;
  /** Retos activos que modifican o suman bloques a la sesión. */
  activeChallenges: string[];
  exercises: WorkoutExercise[];
};

export type CalendarSessionStatus = 'completada' | 'pendiente' | 'programada' | 'descanso';

export type CalendarSession = {
  dateKey: string;
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
const COSTAL_VIDEO = V(
  'AQNcpnTKe9yiEnTfxPaCID-mvsW5-nfyvWPNX5k_QNYxha9PooiDhWB9LuDKmruv4EHCKQ5VuTbKguo8ZyiEIniynVe8y5PLeFpa0Gc.mp4',
);

function tips(...cues: string[]): ExerciseAid {
  return { kind: 'tips', cues };
}

function videoAid(src: string, ...cues: string[]): ExerciseAid {
  return { kind: 'video', src, cues };
}

function intensity(
  principiante: string,
  intermedio: string,
  avanzado: string,
): Record<TrainingLevel, string> {
  return { principiante, intermedio, avanzado };
}

/** Catálogo de rutinas por tipo de clase de box. */
const classWorkouts: Record<string, Omit<DailyWorkout, 'activeChallenges' | 'coach' | 'time' | 'room'>> = {
  'Técnica Base': {
    id: 'clase_tecnica_base',
    className: 'Técnica Base',
    focus: 'Guardia, jab-cross y pie',
    title: 'Rutina de Técnica Base',
    durationMin: 55,
    levelHint: 'Prioriza forma limpia: cada golpe vuelve a guardia.',
    exercises: [
      {
        id: 'tec_calentamiento',
        name: 'Calentamiento: salto de cuerda + movilidad de hombros',
        sets: 1,
        reps: '6 min',
        weightByLevel: intensity('Ritmo suave', 'Ritmo medio', 'Ritmo alto controlado'),
        restSec: 0,
        aid: tips('Muñecas sueltas en la cuerda', 'Hombros calientes antes de golpear', 'Respira por la nariz'),
      },
      {
        id: 'tec_sombra',
        name: 'Sombra: jab–cross–hook',
        sets: 4,
        reps: '3 min',
        weightByLevel: intensity('Sin peso · solo forma', 'Mancuernas 0.5–1 kg', 'Mancuernas 1–2 kg'),
        restSec: 60,
        aid: tips('Mentón bajo', 'Gira cadera en el cross', 'Hook corto, codo a 90°', 'Vuelve siempre a guardia'),
      },
      {
        id: 'tec_mitts_o_pareja',
        name: 'Trabajo técnico en mitts / pareja',
        sets: 5,
        reps: '2 min',
        weightByLevel: intensity('Solo 1-2', '1-2-3', 'Combos de 4–5 golpes'),
        restSec: 45,
        aid: tips('Pisa al golpear', 'Escucha la llamada del coach', 'Distancia de brazo'),
      },
      {
        id: 'tec_defensa',
        name: 'Defensa: slips y rolls',
        sets: 3,
        reps: '90 s',
        weightByLevel: intensity('Solo slips', 'Slips + roll', 'Slips + roll + counter'),
        restSec: 45,
        aid: tips('Rodillas flexibles', 'Movimiento corto', 'Ojos al frente'),
      },
      {
        id: 'tec_cooldown',
        name: 'Enfriamiento: estiramiento de hombros y cadera',
        sets: 1,
        reps: '5 min',
        weightByLevel: intensity('Suave', 'Moderado', 'Profundo y controlado'),
        restSec: 0,
        aid: tips('Sin rebotes', '30–40 s por zona', 'Sal recuperado'),
      },
    ],
  },
  'Cardio Box': {
    id: 'clase_cardio_box',
    className: 'Cardio Box',
    focus: 'Ritmo, resistencia y combos',
    title: 'Rutina de Cardio Box',
    durationMin: 50,
    levelHint: 'Mantén el ritmo de round; la técnica gana a la fuerza bruta.',
    exercises: [
      {
        id: 'cb_cuerda',
        name: 'Rounds de cuerda',
        sets: 4,
        reps: '2 min',
        weightByLevel: intensity('Saltos suaves', 'Cadencia constante', 'Dobles o alta cadencia'),
        restSec: 40,
        aid: tips('Rodillas suaves', 'Gira desde las muñecas', 'Torso estable'),
      },
      {
        id: 'cb_sombra',
        name: 'Sombra continua con desplazamiento',
        sets: 5,
        reps: '3 min',
        weightByLevel: intensity('Ritmo conversacional', 'Ritmo medio-alto', 'Ráfagas 20 s/min'),
        restSec: 60,
        aid: tips('Muévete en círculo', 'Cambia de guardia', 'No bajes las manos'),
      },
      {
        id: 'cb_costal',
        name: 'Costal: rounds de combos',
        sets: 6,
        reps: '2 min',
        weightByLevel: intensity('60% intensidad', '75% intensidad', '85% con combos largos'),
        restSec: 45,
        aid: videoAid(
          COSTAL_VIDEO,
          'Pie de pivote activo',
          'Combina jab, cross y ganchos',
          'Recupera en el descanso',
        ),
      },
      {
        id: 'cb_core',
        name: 'Core de boxeador (plancha + twists)',
        sets: 3,
        reps: '40 s + 20 twists',
        weightByLevel: intensity('Sin peso', '4–6 kg en twists', '8–10 kg en twists'),
        restSec: 45,
        aid: tips('Glúteos activos en plancha', 'Gira desde el tronco', 'No fuerces el cuello'),
      },
    ],
  },
  'Costales & Resistencia': {
    id: 'clase_costales',
    className: 'Costales & Resistencia',
    focus: 'Potencia y volumen en saco',
    title: 'Rutina de Costales',
    durationMin: 50,
    levelHint: 'Golpea y recupera guardia; no te lances sobre el costal.',
    exercises: [
      {
        id: 'cos_warmup',
        name: 'Sombra ligera + movilidad',
        sets: 1,
        reps: '5 min',
        weightByLevel: intensity('Suave', 'Medio', 'Medio-alto'),
        restSec: 0,
        aid: tips('Activa hombros', 'Respira constante', 'Prepara el pie'),
      },
      {
        id: 'cos_rounds',
        name: 'Rounds de costal (potencia)',
        sets: 6,
        reps: '2 min',
        weightByLevel: intensity('Ritmo controlado', 'Alta densidad', 'Máxima densidad limpia'),
        restSec: 45,
        aid: videoAid(
          COSTAL_VIDEO,
          'Pies firmes',
          'Exhala en cada impacto',
          'Vuelve a guardia al instante',
        ),
      },
      {
        id: 'cos_intervalos',
        name: 'Intervalos: 20 s power / 40 s técnico',
        sets: 5,
        reps: '1 min',
        weightByLevel: intensity('Power suave', 'Power medio', 'Power alto'),
        restSec: 30,
        aid: tips('En power no sacrifiques postura', 'En técnico limpia el jab', 'Relaja hombros'),
      },
      {
        id: 'cos_finish',
        name: 'Finisher: sombra + estiramiento',
        sets: 1,
        reps: '6 min',
        weightByLevel: intensity('Suave', 'Suave-medio', 'Controlado'),
        restSec: 0,
        aid: tips('Baja pulsaciones', 'Estira pecho y hombros', 'Hidrátate'),
      },
    ],
  },
  Mitts: {
    id: 'clase_mitts',
    className: 'Mitts',
    focus: 'Precisión y timing con el coach',
    title: 'Rutina de Mitts',
    durationMin: 45,
    levelHint: 'Escucha las llamadas; timing antes que fuerza.',
    exercises: [
      {
        id: 'mit_warmup',
        name: 'Calentamiento de pies y manos',
        sets: 1,
        reps: '5 min',
        weightByLevel: intensity('Suave', 'Medio', 'Activo'),
        restSec: 0,
        aid: tips('Pasos cortos', 'Guardia alta', 'Muñecas firmes'),
      },
      {
        id: 'mit_combos',
        name: 'Mitts: combos del coach',
        sets: 6,
        reps: '2 min',
        weightByLevel: intensity('Jab–cross', '1-2-3 y ganchos', 'Combos de 5–6 golpes'),
        restSec: 45,
        aid: tips('Pisa al golpear', 'Vuelve a guardia entre combos', 'Distancia de brazo'),
      },
      {
        id: 'mit_defensa',
        name: 'Defensa + counter en mitts',
        sets: 4,
        reps: '90 s',
        weightByLevel: intensity('Solo defensa', 'Defensa + 1 counter', 'Defensa + combo counter'),
        restSec: 45,
        aid: tips('Slips limpios', 'Counter rápido', 'No te quedes mirando'),
      },
      {
        id: 'mit_core',
        name: 'Core corto post-mitts',
        sets: 3,
        reps: '30–40 s',
        weightByLevel: intensity('Plancha', 'Plancha + shoulder taps', 'Plancha dinámica'),
        restSec: 30,
        aid: tips('Cadera alineada', 'No arches la lumbar', 'Respira'),
      },
    ],
  },
  'Boxeo Juvenil': {
    id: 'clase_juvenil',
    className: 'Boxeo Juvenil',
    focus: 'Técnica segura y diversión',
    title: 'Rutina Boxeo Juvenil',
    durationMin: 40,
    levelHint: 'Sesión adaptada: prioriza diversión, respeto y buena postura.',
    exercises: [
      {
        id: 'juv_juego',
        name: 'Juego de pies y coordinación',
        sets: 1,
        reps: '6 min',
        weightByLevel: intensity('Suave', 'Activo', 'Activo + retos'),
        restSec: 0,
        aid: tips('Sin contacto fuerte', 'Escucha al coach', 'Guardia siempre'),
      },
      {
        id: 'juv_sombra',
        name: 'Sombra guiada',
        sets: 3,
        reps: '2 min',
        weightByLevel: intensity('Solo jab', 'Jab–cross', 'Jab–cross–hook suave'),
        restSec: 60,
        aid: tips('Golpes cortos', 'No gires de más', 'Sonríe y concéntrate'),
      },
      {
        id: 'juv_costal',
        name: 'Costal suave / técnica',
        sets: 3,
        reps: '90 s',
        weightByLevel: intensity('Toques suaves', 'Ritmo medio', 'Ritmo medio limpio'),
        restSec: 60,
        aid: videoAid(COSTAL_VIDEO, 'No te acerques de más', 'Golpea y regresa', 'Pide agua si lo necesitas'),
      },
    ],
  },
  Acondicionamiento: {
    id: 'clase_acond',
    className: 'Acondicionamiento',
    focus: 'Fuerza funcional para boxeo',
    title: 'Rutina de Acondicionamiento',
    durationMin: 50,
    levelHint: 'Cargas pensadas para transferir potencia al golpe, no hipertrofia libre.',
    exercises: [
      {
        id: 'ac_movilidad',
        name: 'Movilidad de cadera y hombros',
        sets: 1,
        reps: '6 min',
        weightByLevel: intensity('Rango cómodo', 'Rango completo', 'Rango + pausas'),
        restSec: 0,
        aid: tips('Sin rebotes', 'Respira en cada posición', 'Prepara el tren inferior'),
      },
      {
        id: 'ac_sentadilla',
        name: 'Sentadilla goblet (base de pierna para el golpe)',
        sets: 3,
        reps: '10–12',
        weightByLevel: intensity('6–8 kg', '12–16 kg', '18–22 kg'),
        restSec: 75,
        aid: tips('Pecho alto', 'Rodillas siguen los pies', 'Profundidad controlada'),
      },
      {
        id: 'ac_remo',
        name: 'Remo con mancuerna (espalda y postura)',
        sets: 3,
        reps: '10 por brazo',
        weightByLevel: intensity('4–6 kg', '8–12 kg', '14–16 kg'),
        restSec: 60,
        aid: tips('Espalda neutra', 'Codo cerca del cuerpo', 'Aprieta omóplatos'),
      },
      {
        id: 'ac_sombra',
        name: 'Sombra con transferencia de fuerza',
        sets: 3,
        reps: '2 min',
        weightByLevel: intensity('Sin peso', '0.5–1 kg', '1–2 kg'),
        restSec: 60,
        aid: tips('Empuja desde el piso', 'Gira cadera', 'Termina en guardia'),
      },
    ],
  },
  'Sparring técnico': {
    id: 'clase_sparring',
    className: 'Sparring técnico',
    focus: 'Aplicación controlada',
    title: 'Rutina pre / post sparring técnico',
    durationMin: 45,
    levelHint: 'Contacto controlado: respeto, control y aprendizaje.',
    exercises: [
      {
        id: 'sp_warmup',
        name: 'Calentamiento específico de sparring',
        sets: 1,
        reps: '8 min',
        weightByLevel: intensity('Suave', 'Progresivo', 'Activo'),
        restSec: 0,
        aid: tips('Protege siempre', 'Comunica con tu pareja', 'Calienta cuello y mandíbula con cuidado'),
      },
      {
        id: 'sp_rounds',
        name: 'Rounds técnicos (contacto controlado)',
        sets: 4,
        reps: '2 min',
        weightByLevel: intensity('Solo tocar', '50% potencia', '60% potencia máxima'),
        restSec: 60,
        aid: tips('Objetivo: aprender', 'Escucha al coach', 'Para si hay duda de seguridad'),
      },
      {
        id: 'sp_feedback',
        name: 'Feedback + sombra correctiva',
        sets: 2,
        reps: '2 min',
        weightByLevel: intensity('Corrige 1 error', 'Corrige 2 errores', 'Integra combo limpio'),
        restSec: 45,
        aid: tips('Repite lo que falló', 'Lento y limpio', 'Cierra con guardia perfecta'),
      },
    ],
  },
  'Open gym + sombra': {
    id: 'clase_open',
    className: 'Open gym + sombra',
    focus: 'Sesión libre de boxeo',
    title: 'Rutina Open Gym',
    durationMin: 40,
    levelHint: 'Elige bloques de sombra y costal; registra tus marcas.',
    exercises: [
      {
        id: 'og_sombra',
        name: 'Sombra libre (repasa la semana)',
        sets: 3,
        reps: '3 min',
        weightByLevel: intensity('Forma', 'Forma + ritmo', 'Forma + potencia'),
        restSec: 60,
        aid: tips('Practica lo visto en clases', 'Grábate si puedes', 'Corrige guardia'),
      },
      {
        id: 'og_costal',
        name: 'Costal a elección',
        sets: 4,
        reps: '2 min',
        weightByLevel: intensity('Técnico', 'Mixto', 'Potencia controlada'),
        restSec: 45,
        aid: videoAid(COSTAL_VIDEO, 'No te lances', 'Combos limpios', 'Anota cómo te sentiste'),
      },
      {
        id: 'og_core',
        name: 'Core + estiramiento',
        sets: 1,
        reps: '8 min',
        weightByLevel: intensity('Suave', 'Moderado', 'Completo'),
        restSec: 0,
        aid: tips('Plancha o twists', 'Estira hombros', 'Cierra la semana bien'),
      },
    ],
  },
};

const restWorkout: Omit<DailyWorkout, 'activeChallenges'> = {
  id: 'clase_descanso',
  className: 'Descanso activo',
  focus: 'Recuperación',
  title: 'Día de recuperación',
  durationMin: 20,
  levelHint: 'Hoy no hay clase programada: movilidad suave y descanso.',
  exercises: [
    {
      id: 'rest_mov',
      name: 'Movilidad o caminata suave',
      sets: 1,
      reps: '15–20 min',
      weightByLevel: intensity('Caminata', 'Caminata + estiramiento', 'Movilidad profunda'),
      restSec: 0,
      aid: tips('Sin intensidad alta', 'Hidrátate', 'Prepárate para tu próxima clase'),
    },
  ],
};

/** Bloques extra cuando el alumno pagó / se inscribió a un reto. */
const challengeBlocks: Record<string, WorkoutExercise[]> = {
  'reto-30-dias': [
    {
      id: 'reto30_asistencia',
      name: 'Reto 30 días: check de constancia (sombra + costal corto)',
      sets: 1,
      reps: '5 min',
      weightByLevel: intensity('Completa hoy', 'Completa con buena forma', 'Completa + nota de energía'),
      restSec: 0,
      fromChallenge: 'Reto 30 días',
      aid: tips(
        'Este bloque solo aparece si adquiriste el Reto 30 días',
        'Marca la sesión en el calendario',
        'La meta es no fallar el hábito',
      ),
    },
  ],
  'semana-potencia': [
    {
      id: 'reto_potencia',
      name: 'Semana de Potencia: intervalos en costal',
      sets: 4,
      reps: '20 s power / 40 s técnico',
      weightByLevel: intensity('Power suave', 'Power medio', 'Power alto limpio'),
      restSec: 30,
      fromChallenge: 'Semana de Potencia',
      aid: videoAid(
        COSTAL_VIDEO,
        'Solo si contrataste Semana de Potencia',
        'En power no rompas la guardia',
        'Mide mejora al cierre de la semana',
      ),
    },
  ],
  'reto-comunidad': [
    {
      id: 'reto_comunidad',
      name: 'Reto Comunidad: round en pareja / equipo',
      sets: 2,
      reps: '2 min',
      weightByLevel: intensity('Toques suaves', 'Ritmo compartido', 'Combos coordinados'),
      restSec: 60,
      fromChallenge: 'Reto Comunidad',
      aid: tips(
        'Visible si estás inscrito al Reto Comunidad',
        'Comunica con tu compañero',
        'Ambiente inclusivo y seguro',
      ),
    },
  ],
};

const WEEKDAY_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const WEEKDAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function normalizeClassName(name: string) {
  const key = Object.keys(classWorkouts).find(
    (k) => k.toLowerCase() === name.trim().toLowerCase(),
  );
  return key || name;
}

function workoutFromClassName(className: string): Omit<DailyWorkout, 'activeChallenges'> {
  const key = normalizeClassName(className);
  const base = classWorkouts[key];
  if (base) return { ...base, exercises: base.exercises.map((e) => ({ ...e })) };
  return {
    ...restWorkout,
    className,
    title: `Rutina · ${className}`,
    focus: 'Sesión Villanova',
    exercises: restWorkout.exercises.map((e) => ({ ...e })),
  };
}

/** Clase principal del día según horario Villanova (prioriza la de tarde/noche). */
export function getScheduledClassForWeekday(weekday = new Date().getDay()): {
  day: string;
  slot: { time: string; name: string; coach: string } | null;
} {
  const day = WEEKDAY_ES[weekday];
  const row = weeklyClassSchedule.find((r) => r.day === day);
  if (!row || row.slots.length === 0) return { day, slot: null };
  const evening = [...row.slots].reverse().find((s) => {
    const hour = Number(s.time.split(':')[0]);
    return hour >= 17;
  });
  return { day, slot: evening || row.slots[row.slots.length - 1] };
}

export function resolveMemberWorkout(options?: {
  weekday?: number;
  dayClass?: DayClass;
  challenges?: Challenge[];
}): DailyWorkout {
  const weekday = options?.weekday ?? new Date().getDay();
  const joined = (options?.challenges || []).filter((c) => c.joined);
  const challengeTitles = joined.map((c) => c.title);

  // Domingos sin clase en horario → descanso (salvo que haya reto activo que pida trabajo)
  const scheduled = getScheduledClassForWeekday(weekday);
  const fromToday =
    options?.dayClass && weekday === new Date().getDay() ? options.dayClass : null;

  const className = fromToday?.name || scheduled.slot?.name;
  if (!className) {
    const rest = {
      ...restWorkout,
      exercises: restWorkout.exercises.map((e) => ({ ...e })),
      activeChallenges: challengeTitles,
    };
    for (const challenge of joined) {
      const extra = challengeBlocks[challenge.id];
      if (extra) rest.exercises.push(...extra.map((e) => ({ ...e })));
    }
    return rest;
  }

  const base = workoutFromClassName(className);
  const workout: DailyWorkout = {
    ...base,
    coach: fromToday?.coach || scheduled.slot?.coach,
    time: fromToday?.time || scheduled.slot?.time,
    room: fromToday?.room,
    activeChallenges: challengeTitles,
    exercises: base.exercises.map((e) => ({ ...e })),
  };

  for (const challenge of joined) {
    const extra = challengeBlocks[challenge.id];
    if (extra) {
      // Inserta bloques del reto antes del enfriamiento (último ejercicio si parece cooldown)
      const insertAt = Math.max(workout.exercises.length - 1, 0);
      workout.exercises.splice(insertAt, 0, ...extra.map((e) => ({ ...e })));
    }
  }

  if (joined.length > 0) {
    workout.levelHint = `${workout.levelHint} Incluye bloques de tu(s) reto(s): ${challengeTitles.join(', ')}.`;
  }

  return workout;
}

/** @deprecated usa resolveMemberWorkout — se mantiene por compatibilidad. */
export function getWorkoutForWeekday(weekday = new Date().getDay()): DailyWorkout {
  const dayClass = weekday === new Date().getDay() ? todayClass : undefined;
  return resolveMemberWorkout({ weekday, dayClass });
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
    const scheduled = getScheduledClassForWeekday(weekday);

    if (!scheduled.slot) {
      sessions.push({
        dateKey: key,
        weekdayLabel: WEEKDAY_SHORT[weekday],
        title: 'Descanso',
        status: 'descanso',
      });
      continue;
    }

    let status: CalendarSessionStatus = 'programada';
    if (completedKeys.has(key)) status = 'completada';
    else if (key < todayKey) status = 'pendiente';

    sessions.push({
      dateKey: key,
      weekdayLabel: WEEKDAY_SHORT[weekday],
      title: scheduled.slot.name,
      time: scheduled.slot.time,
      status,
      workoutId: workoutFromClassName(scheduled.slot.name).id,
    });
  }

  return sessions;
}

export function buildWeekCalendar(
  anchor = new Date(),
  completedKeys: Set<string>,
): CalendarSession[] {
  const start = new Date(anchor);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const sessions: CalendarSession[] = [];
  const todayKey = dateKeyFromDate(new Date());

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const weekday = date.getDay();
    const key = dateKeyFromDate(date);
    const scheduled = getScheduledClassForWeekday(weekday);

    if (!scheduled.slot) {
      sessions.push({
        dateKey: key,
        weekdayLabel: WEEKDAY_SHORT[weekday],
        title: 'Descanso activo',
        status: 'descanso',
      });
      continue;
    }

    let status: CalendarSessionStatus = 'programada';
    if (completedKeys.has(key)) status = 'completada';
    else if (key < todayKey) status = 'pendiente';

    sessions.push({
      dateKey: key,
      weekdayLabel: WEEKDAY_SHORT[weekday],
      title: scheduled.slot.name,
      time: scheduled.slot.time,
      status,
      workoutId: workoutFromClassName(scheduled.slot.name).id,
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
