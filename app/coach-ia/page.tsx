'use client';

import { useState } from 'react';
import { Bot, CheckCircle2, ClipboardCheck, Clock3, Dumbbell, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { ReelCard } from '@/components/reel-card';

type TrainingDay = {
  name: string;
  focus: string;
  exercises: string[];
};

type Routine = {
  title: string;
  summary: string;
  days: TrainingDay[];
  rest: string;
  progression: string;
};

const exerciseBanks: Record<string, Record<string, string[]>> = {
  'Gimnasio completo': {
    push: ['Press de banca · 4 × 8–10', 'Press militar · 3 × 8–10', 'Press inclinado con mancuernas · 3 × 10–12', 'Elevaciones laterales · 3 × 12–15', 'Extensión de tríceps en polea · 3 × 12'],
    pull: ['Peso muerto rumano · 4 × 8', 'Jalón al pecho · 4 × 10', 'Remo sentado en polea · 3 × 10–12', 'Face pull · 3 × 15', 'Curl de bíceps con barra · 3 × 10–12'],
    legs: ['Sentadilla con barra · 4 × 8–10', 'Prensa inclinada · 4 × 10–12', 'Hip thrust · 4 × 10', 'Curl femoral · 3 × 12', 'Elevación de pantorrilla · 4 × 15'],
    full: ['Sentadilla goblet · 3 × 12', 'Press de banca · 3 × 10', 'Remo con mancuerna · 3 × 10 por lado', 'Peso muerto rumano · 3 × 10', 'Plancha frontal · 3 × 40 s'],
    cardio: ['Caminadora inclinada · 12 min', 'Empuje de trineo · 5 × 20 m', 'Remo ergómetro · 6 × 45 s', 'Kettlebell swing · 4 × 15', 'Farmer walk · 4 × 30 m'],
  },
  'Mancuernas y barra': {
    push: ['Press de piso con barra · 4 × 8–10', 'Press militar con mancuernas · 3 × 10', 'Press inclinado con mancuernas · 3 × 12', 'Elevaciones laterales · 3 × 15', 'Press francés · 3 × 12'],
    pull: ['Peso muerto rumano · 4 × 8', 'Remo con barra · 4 × 10', 'Remo unilateral · 3 × 12 por lado', 'Pájaros con mancuernas · 3 × 15', 'Curl martillo · 3 × 12'],
    legs: ['Sentadilla frontal · 4 × 8', 'Zancadas con mancuernas · 3 × 12 por lado', 'Hip thrust con barra · 4 × 10', 'Peso muerto rumano · 3 × 10', 'Pantorrilla de pie · 4 × 15'],
    full: ['Sentadilla goblet · 3 × 12', 'Press militar · 3 × 10', 'Remo con barra · 3 × 10', 'Zancadas alternas · 3 × 12', 'Farmer walk · 4 × 30 m'],
    cardio: ['Thruster con mancuernas · 4 × 12', 'Renegade row · 4 × 10', 'Zancadas alternas · 4 × 12', 'Peso muerto con barra · 4 × 10', 'Farmer walk · 5 × 30 m'],
  },
  'Peso corporal': {
    push: ['Flexiones · 4 × 10–15', 'Flexiones inclinadas · 3 × 12', 'Pike push-ups · 3 × 8–10', 'Fondos en banco · 3 × 12', 'Plancha con toque de hombro · 3 × 20'],
    pull: ['Remo invertido · 4 × 8–12', 'Superman · 4 × 12', 'Ángeles invertidos · 3 × 15', 'Puente escapular · 3 × 12', 'Plancha lateral · 3 × 30 s por lado'],
    legs: ['Sentadilla con pausa · 4 × 15', 'Zancada búlgara · 3 × 12 por lado', 'Puente de glúteo · 4 × 15', 'Curl femoral deslizante · 3 × 12', 'Pantorrilla unilateral · 4 × 15'],
    full: ['Sentadilla · 4 × 15', 'Flexiones · 4 × 10', 'Zancadas alternas · 3 × 12', 'Mountain climbers · 4 × 30 s', 'Plancha frontal · 3 × 40 s'],
    cardio: ['Jumping jacks · 4 × 40 s', 'Sentadilla con salto · 4 × 12', 'Mountain climbers · 4 × 30 s', 'Burpees · 4 × 8', 'Plancha dinámica · 3 × 30 s'],
  },
};

function buildRoutine(goal: string, level: string, daysCount: number, equipment: string): Routine {
  const bank = exerciseBanks[equipment];
  const templates = daysCount <= 3
    ? [
        ['Día 1', 'Cuerpo completo A', 'full'],
        ['Día 2', 'Fuerza y tren inferior', 'legs'],
        ['Día 3', 'Cuerpo completo B', 'full'],
      ]
    : [
        ['Día 1', 'Empuje · Pecho, hombro y tríceps', 'push'],
        ['Día 2', 'Tren inferior · Cuádriceps y glúteo', 'legs'],
        ['Día 3', 'Tirón · Espalda y bíceps', 'pull'],
        ['Día 4', 'Cuerpo completo', 'full'],
        ['Día 5', 'Acondicionamiento metabólico', 'cardio'],
        ['Día 6', 'Técnica y accesorios', 'full'],
      ];
  const goalNote: Record<string, string> = {
    'Ganar masa muscular': 'Volumen progresivo con énfasis en control, rango completo y sobrecarga gradual.',
    'Perder grasa': 'Trabajo de fuerza para conservar músculo, combinado con bloques de alta demanda energética.',
    'Aumentar fuerza': 'Movimientos compuestos, descansos amplios y progresión semanal de cargas.',
    'Mejorar condición': 'Sesiones equilibradas de fuerza y acondicionamiento para elevar tu capacidad de trabajo.',
    'Movilidad y salud': 'Movimiento de calidad, estabilidad y fuerza funcional con intensidad sostenible.',
  };

  return {
    title: `${daysCount} días · ${goal}`,
    summary: `${goalNote[goal]} Plan adaptado a nivel ${level.toLowerCase()} con ${equipment.toLowerCase()}.`,
    days: templates.slice(0, daysCount).map(([name, focus, key]) => ({
      name,
      focus,
      exercises: bank[key],
    })),
    rest: goal === 'Aumentar fuerza' ? '90–150 s entre series principales y 60–90 s en accesorios.' : '60–90 s entre series; hasta 120 s si necesitas recuperar la técnica.',
    progression: level === 'Principiante'
      ? 'Prioriza dominar la técnica. Cuando completes todas las repeticiones con control, aumenta la carga entre 2.5% y 5%.'
      : 'Registra cargas y repeticiones. Añade 1–2 repeticiones por semana y después incrementa el peso entre 2.5% y 5%.',
  };
}

export default function CoachAiPage() {
  const [goal, setGoal] = useState('Ganar masa muscular');
  const [level, setLevel] = useState('Intermedio');
  const [days, setDays] = useState('4');
  const [equipment, setEquipment] = useState('Gimnasio completo');
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(false);

  function generateRoutine() {
    setLoading(true);
    setRoutine(null);
    window.setTimeout(() => {
      const nextRoutine = buildRoutine(goal, level, Number(days), equipment);
      setRoutine(nextRoutine);
      localStorage.setItem('villanova_ai_routine', JSON.stringify(nextRoutine));
      setLoading(false);
    }, 1800);
  }

  return (
    <>
      <PageHero
        eyebrow="Sistema Villanova + flexibilidad"
        title={'60 MINUTOS.\n*A TU MANERA.*'}
        description="Tu mensualidad incluye clases de boxeo + funcional de alto impacto y la atención del coach en turno. Si prefieres un plan independiente, Coach IA te ayuda a armarlo."
        image="/foto/542821274_18065467175252708_2005353166299001268_n.jpg"
        imagePosition="center 35%"
        primaryHref="#generador"
        primaryLabel="Ver cómo funciona"
      />

      <section id="generador" className="bg-black py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="max-w-4xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Método de entrenamiento</p>
            <h2 className="mt-4 whitespace-pre-line font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl">
              LLEGAS Y YA SABES{'\n'}<span className="text-gradient-brand">QUÉ HACER.</span>
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Villanova combina boxeo y ejercicios funcionales en sesiones de 60 minutos: quema grasa, construye músculo y trabaja todo el cuerpo de forma explosiva. Rutina del día e instructor en turno, incluidos en tu mensualidad.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Boxeo + funcional', 'Sombra, costales, mitts y acondicionamiento integrados para un cuerpo fuerte y definido.'],
              ['02', 'Rutina diaria incluida', 'No improvisas: cada sesión trae estructura de alto impacto lista para entrenar.'],
              ['03', 'Coach en turno', 'Orientación en piso para ajustar intensidad según tu nivel — principiante o avanzado.'],
            ].map(([number, title, copy]) => (
              <article key={number} className="rounded-3xl border-[3px] border-zinc-500 bg-zinc-900 p-7">
                <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-brand">{number}</p>
                <h3 className="mt-5 font-display text-xl font-black uppercase text-white">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-500">{copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border-[3px] border-zinc-500 bg-[radial-gradient(circle_at_0%_0%,rgba(212,175,55,.18),transparent_35%),#18181b] p-7 sm:p-9">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">Para quienes siguen su propio plan</p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase text-white">Villanova Coach IA es una opción adicional</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-400">
              Si no sigues la rutina grupal y prefieres entrenar de forma independiente, configura una base según tu objetivo, nivel y equipo disponible. Revísala con un instructor antes de aumentar cargas o cambiar ejercicios.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div className="h-fit rounded-3xl border-[3px] border-zinc-500 bg-[#141414] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-brand/15 p-3 text-brand"><Bot className="size-6" /></span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brand">Villanova Coach IA</p>
                <h2 className="font-display text-2xl font-black uppercase text-white">Rutina independiente</h2>
              </div>
            </div>

            <div className="mt-9 space-y-5">
              <Select label="Objetivo" value={goal} onChange={setGoal} options={['Ganar masa muscular', 'Perder grasa', 'Aumentar fuerza', 'Mejorar condición', 'Movilidad y salud']} />
              <Select label="Nivel" value={level} onChange={setLevel} options={['Principiante', 'Intermedio', 'Avanzado']} />
              <Select label="Días por semana" value={days} onChange={setDays} options={['2', '3', '4', '5', '6']} />
              <Select label="Equipo disponible" value={equipment} onChange={setEquipment} options={['Gimnasio completo', 'Mancuernas y barra', 'Peso corporal']} />
            </div>

            <button
              type="button"
              onClick={generateRoutine}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark disabled:bg-zinc-800"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {loading ? 'Diseñando rutina...' : 'Crear rutina alternativa'}
            </button>
          </div>

          <div className="min-h-[620px] rounded-3xl border-[3px] border-zinc-500 bg-zinc-900 p-7 sm:p-10">
            {routine ? (
              <div>
                <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
                      <CheckCircle2 className="size-4" /> Rutina alternativa lista
                    </div>
                    <h2 className="mt-3 font-display text-3xl font-black uppercase text-white">{routine.title}</h2>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">{routine.summary}</p>
                  </div>
                  <button type="button" onClick={generateRoutine} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:border-brand hover:text-brand">
                    <RotateCcw className="size-3.5" /> Recalcular
                  </button>
                </div>

                <div className="mt-7 grid gap-4 xl:grid-cols-2">
                  {routine.days.map((day) => (
                    <article key={day.name} className="rounded-2xl border-[3px] border-zinc-500 bg-zinc-900 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-brand">{day.name}</p>
                          <h3 className="mt-1 font-display text-lg font-black uppercase text-white">{day.focus}</h3>
                        </div>
                        <Dumbbell className="size-5 shrink-0 text-zinc-600" />
                      </div>
                      <ul className="mt-5 space-y-3">
                        {day.exercises.map((exercise) => (
                          <li key={exercise} className="flex gap-3 text-sm leading-relaxed text-zinc-200 sm:text-base">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border-[3px] border-zinc-500 bg-brand/5 p-5">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white"><Clock3 className="size-4 text-brand" /> Descansos</p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">{routine.rest}</p>
                  </div>
                  <div className="rounded-2xl border-[3px] border-zinc-500 bg-brand/5 p-5">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white"><Sparkles className="size-4 text-brand" /> Progresión</p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">{routine.progression}</p>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="flex min-h-[540px] flex-col items-center justify-center text-center">
                <span className="relative flex size-20 items-center justify-center rounded-full border border-brand/30 bg-brand/10">
                  <span className="absolute inset-0 animate-ping rounded-full border border-brand/30" />
                  <Loader2 className="size-9 animate-spin text-brand" />
                </span>
                <h2 className="mt-7 font-display text-3xl font-black uppercase text-white">Diseñando tu plan</h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-500">Analizando objetivo, experiencia, frecuencia semanal y equipo disponible...</p>
                <div className="mt-7 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-brand" />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[540px] flex-col items-center justify-center text-center">
                <Sparkles className="size-10 text-brand" />
                <h2 className="mt-6 font-display text-3xl font-black uppercase text-white">Tu alternativa aparecerá aquí</h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-500">Esta herramienta es para quienes prefieren seguir una rutina propia. La rutina diaria del sistema Villanova ya está incluida en tu mensualidad.</p>
              </div>
            )}
          </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#090909] py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Tecnología + acompañamiento real</p>
            <h2 className="mt-4 whitespace-pre-line font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl">
              LA IA COMPLEMENTA.{'\n'}<span className="text-gradient-brand">EL COACH ACOMPAÑA.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              El generador no sustituye el sistema diario de Villanova ni la atención en piso. Es una herramienta adicional para miembros que entrenan con su propio plan; un instructor puede ayudarte a validar ejercicios, técnica y cargas.
            </p>
            <ul className="mt-8 space-y-3 text-base text-zinc-300">
              <li className="flex gap-3"><ClipboardCheck className="size-5 shrink-0 text-brand" /> Rutina diaria híbrida incluida en tu mensualidad</li>
              <li className="flex gap-3"><ClipboardCheck className="size-5 shrink-0 text-brand" /> Atención del instructor en turno</li>
              <li className="flex gap-3"><ClipboardCheck className="size-5 shrink-0 text-brand" /> Flexibilidad para seguir una rutina propia</li>
            </ul>
          </div>
          <ReelCard
            src="/video/AQPFJ3CCUmYHXPqiopNy-KsJo33AWCLWmzFVQElOJPsCdf2QOjoOP2qSk7QxMgM1J1LPitvcfr5EtczToWfvofX8lb38nPYYB-dNjms.mp4"
            title="Evaluación física"
            subtitle="Seguimiento con coach"
            className="mx-auto aspect-[9/16] w-full max-w-[300px]"
          />
        </div>
      </section>
    </>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-zinc-300">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-4 text-sm text-white outline-none transition-colors hover:border-white/50 focus:border-brand">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
