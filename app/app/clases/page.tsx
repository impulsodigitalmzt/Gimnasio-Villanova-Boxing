'use client';

import Link from 'next/link';
import { todayClass, todayRoutine, weeklyClassSchedule } from '@/lib/portal/mock-data';
import { ClassOfDayCard } from '@/components/portal/class-of-day';
import { useMemberPortal } from '@/lib/portal/store';

export default function MemberClassesPage() {
  const { profile } = useMemberPortal();
  const planName = profile?.planName || 'tu plan';

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
          Contenido según <span className="text-white">{planName}</span>. Revisa la clase de hoy y tu
          horario de la semana.
        </p>
      </header>

      <ClassOfDayCard dayClass={todayClass} routine={todayRoutine} />

      <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
            Horario semanal
          </p>
          <h2 className="mt-1 font-display text-xl font-black uppercase text-white">Esta semana</h2>
        </div>
        <div className="divide-y divide-white/10">
          {weeklyClassSchedule.map((day) => (
            <div key={day.day} className="px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{day.day}</p>
              <ul className="mt-2 space-y-2">
                {day.slots.map((slot) => (
                  <li
                    key={`${day.day}-${slot.time}`}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span>
                      <span className="font-semibold text-white">{slot.name}</span>
                      <span className="mt-0.5 block text-xs text-zinc-500">{slot.coach}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-bold text-[var(--portal-brand-light)]">
                      {slot.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Link
        href="/planes#clases"
        className="flex w-full justify-center rounded-2xl border border-white/15 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-[var(--portal-brand)]"
      >
        Ver horarios públicos
      </Link>
    </div>
  );
}
