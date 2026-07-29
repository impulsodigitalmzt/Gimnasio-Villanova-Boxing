'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  CirclePlay,
  Clock3,
  Dumbbell,
  Info,
} from 'lucide-react';
import type { DailyWorkout, TrainingLevel } from '@/lib/portal/training-data';

export function DailyWorkoutCard({
  workout,
  level,
  todayCompleted,
  onMarkComplete,
  compact = false,
}: {
  workout: DailyWorkout;
  level: TrainingLevel;
  todayCompleted: boolean;
  onMarkComplete: () => void;
  compact?: boolean;
}) {
  const [openAid, setOpenAid] = useState<string | null>(null);
  const exercises = compact ? workout.exercises.slice(0, 3) : workout.exercises;

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
          Rutina del día · {workout.focus}
        </p>
        <h2 className="mt-1 font-display text-xl font-black uppercase text-white">
          {workout.title}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5 text-[var(--portal-brand)]" />
            {workout.durationMin} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Dumbbell className="size-3.5 text-[var(--portal-brand)]" />
            {workout.exercises.length} ejercicios
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400">{workout.levelHint}</p>
      </div>

      <ul className="divide-y divide-white/10">
        {exercises.map((exercise, index) => {
          const open = openAid === exercise.id;
          return (
            <li key={exercise.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Ejercicio {index + 1}
                  </p>
                  <h3 className="mt-0.5 font-display text-lg font-black uppercase text-white">
                    {exercise.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-zinc-300">
                      {exercise.sets} series
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-zinc-300">
                      {exercise.reps} reps
                    </span>
                    <span className="rounded-full bg-[var(--portal-brand)]/15 px-2.5 py-1 text-[var(--portal-brand-light)]">
                      {exercise.weightByLevel[level]}
                    </span>
                    {exercise.restSec > 0 ? (
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-zinc-500">
                        Desc. {exercise.restSec}s
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenAid(open ? null : exercise.id)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--portal-brand-light)]"
              >
                {exercise.aid.kind === 'video' ? (
                  <CirclePlay className="size-3.5" />
                ) : (
                  <Info className="size-3.5" />
                )}
                {open ? 'Ocultar ayuda' : 'Ver técnica'}
                <ChevronDown className={`size-3.5 transition ${open ? 'rotate-180' : ''}`} />
              </button>

              {open ? (
                <div className="mt-3 space-y-3 rounded-2xl border border-white/10 bg-black/40 p-3">
                  {exercise.aid.src ? (
                    <video
                      src={exercise.aid.src}
                      controls
                      playsInline
                      muted
                      className="aspect-video w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <ul className="space-y-1.5">
                    {exercise.aid.cues.map((cue) => (
                      <li key={cue} className="flex gap-2 text-sm text-zinc-300">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--portal-brand)]" />
                        {cue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {compact && workout.exercises.length > 3 ? (
        <p className="border-t border-white/10 px-5 py-3 text-center text-xs text-zinc-500">
          +{workout.exercises.length - 3} ejercicios más en Clases
        </p>
      ) : null}

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onMarkComplete}
          disabled={todayCompleted}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black uppercase tracking-wider transition ${
            todayCompleted
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-[var(--portal-brand)] text-white hover:bg-[var(--portal-brand-dark)]'
          }`}
        >
          <CheckCircle2 className="size-4" />
          {todayCompleted ? 'Sesión de hoy completada' : 'Marcar sesión como completada'}
        </button>
      </div>
    </section>
  );
}
