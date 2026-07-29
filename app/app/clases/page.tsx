'use client';

import Link from 'next/link';
import { MembershipContentGate } from '@/components/portal/membership-content-gate';
import { DailyWorkoutCard } from '@/components/portal/daily-workout';
import { ProgressLogSection } from '@/components/portal/progress-log';
import { TrainingCalendar } from '@/components/portal/training-calendar';
import { useMemberPortal } from '@/lib/portal/store';
import { useTrainingProgress } from '@/lib/portal/training-progress';
import { getWorkoutForWeekday } from '@/lib/portal/training-data';
import { todayClass } from '@/lib/portal/mock-data';
import { Clock3 } from 'lucide-react';

function ClassesContent() {
  const { profile } = useMemberPortal();
  const training = useTrainingProgress();
  const workout = getWorkoutForWeekday();
  const planName = profile?.planName || 'tu plan';

  if (!training.ready) {
    return <div className="py-20 text-center text-sm text-zinc-500">Cargando entrenamiento…</div>;
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
          Clases y rutinas
        </p>
        <h1 className="mt-1 font-display text-3xl font-black uppercase text-white">
          Tu entrenamiento
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Contenido personalizado de <span className="text-white">{planName}</span>: rutina del día,
          ayudas técnicas, registro y calendario.
        </p>
      </header>

      <section className="rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)] p-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
          Clase reservada hoy
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-black uppercase text-white">
              {todayClass.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {todayClass.coach} · {todayClass.room}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 text-xs font-bold text-white">
            <Clock3 className="size-3.5 text-[var(--portal-brand-light)]" />
            {todayClass.time}
          </span>
        </div>
      </section>

      <DailyWorkoutCard
        workout={workout}
        level={training.level}
        todayCompleted={training.todayCompleted}
        onMarkComplete={training.markTodayComplete}
      />

      <ProgressLogSection
        workout={workout}
        entries={training.entries}
        onAdd={training.addEntry}
        onRemove={training.removeEntry}
      />

      <TrainingCalendar
        completedSet={training.completedSet}
        onToggleDay={training.toggleSessionComplete}
      />

      <Link
        href="/planes#clases"
        className="flex w-full justify-center rounded-2xl border border-white/15 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-[var(--portal-brand)]"
      >
        Ver horarios públicos del gym
      </Link>
    </div>
  );
}

export default function MemberClassesPage() {
  return (
    <MembershipContentGate>
      <ClassesContent />
    </MembershipContentGate>
  );
}
