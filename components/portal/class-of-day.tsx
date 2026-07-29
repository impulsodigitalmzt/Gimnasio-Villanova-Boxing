import { Clock3, Dumbbell, Flame } from 'lucide-react';
import type { DayClass, DayRoutine } from '@/lib/portal/types';

export function ClassOfDayCard({
  dayClass,
  routine,
}: {
  dayClass: DayClass;
  routine: DayRoutine;
}) {
  const wod = dayClass.wod ?? routine.blocks.find((b) => b.label === 'WOD')?.detail;

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
          Hoy en Villanova
        </p>
        <h2 className="mt-1 font-display text-xl font-black uppercase text-white">Clase del día</h2>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-2xl border-[3px] border-zinc-500 bg-[var(--portal-brand)]/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-2xl font-black uppercase text-white">{dayClass.name}</p>
              <p className="mt-1 text-base text-zinc-300">
                {dayClass.coach} · {dayClass.room}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 text-xs font-bold text-white">
              <Clock3 className="size-3.5 text-[var(--portal-brand-light)]" />
              {dayClass.time}
            </span>
          </div>
          {dayClass.reserved ? (
            <p className="mt-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Reservada
            </p>
          ) : null}
        </div>

        {wod ? (
          <div className="rounded-2xl border-[3px] border-zinc-500 bg-black/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="size-4 text-[var(--portal-brand)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Rutina</h3>
            </div>
            <p className="text-base font-semibold leading-relaxed text-[var(--portal-brand-light)]">
              {wod}
            </p>
          </div>
        ) : null}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Dumbbell className="size-4 text-[var(--portal-brand)]" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              {routine.title}
            </h3>
          </div>
          <p className="mb-3 text-sm text-zinc-400">{routine.focus}</p>
          <ul className="space-y-2">
            {routine.blocks.map((block) => (
              <li
                key={block.label}
                className="flex gap-3 rounded-xl border-[3px] border-zinc-500 bg-black/40 px-3 py-3"
              >
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[var(--portal-brand)]" />
                <div>
                  <p className="text-xs font-bold uppercase text-white">{block.label}</p>
                  <p className="mt-0.5 text-base text-zinc-300">{block.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
