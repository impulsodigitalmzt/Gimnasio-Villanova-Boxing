'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Check, Circle } from 'lucide-react';
import {
  buildMonthCalendar,
  buildWeekCalendar,
  type CalendarSession,
} from '@/lib/portal/training-data';

const STATUS_STYLE: Record<
  CalendarSession['status'],
  { label: string; className: string }
> = {
  completada: {
    label: 'Completada',
    className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  pendiente: {
    label: 'Pendiente',
    className: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  },
  programada: {
    label: 'Programada',
    className: 'border-brand/40 bg-brand/10 text-[var(--portal-brand-light)]',
  },
  descanso: {
    label: 'Descanso',
    className: 'border-white/10 bg-white/5 text-zinc-400',
  },
};

export function TrainingCalendar({
  completedSet,
  onToggleDay,
}: {
  completedSet: Set<string>;
  onToggleDay: (dateKey: string) => void;
}) {
  const [mode, setMode] = useState<'semana' | 'mes'>('semana');

  const sessions = useMemo(() => {
    const now = new Date();
    if (mode === 'semana') return buildWeekCalendar(now, completedSet);
    return buildMonthCalendar(now.getFullYear(), now.getMonth(), completedSet);
  }, [mode, completedSet]);

  const monthLabel = new Date().toLocaleDateString('es-MX', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
            Calendario de entrenamientos
          </p>
          <h2 className="mt-1 flex items-center gap-2 font-display text-xl font-black uppercase text-white">
            <CalendarDays className="size-5 text-[var(--portal-brand)]" />
            {mode === 'semana' ? 'Esta semana' : monthLabel}
          </h2>
        </div>
        <div className="flex rounded-full border border-white/15 p-1">
          {(['semana', 'mes'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                mode === option
                  ? 'bg-[var(--portal-brand)] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {mode === 'semana' ? (
        <ul className="divide-y divide-white/10">
          {sessions.map((session) => {
            const style = STATUS_STYLE[session.status];
            const canToggle = session.status !== 'descanso';
            return (
              <li key={session.dateKey} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-12 shrink-0 text-center">
                  <p className="text-[10px] font-bold uppercase text-zinc-500">
                    {session.weekdayLabel}
                  </p>
                  <p className="font-display text-lg font-black text-white">
                    {session.dateKey.slice(-2)}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{session.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {session.time ? `${session.time} · ` : ''}
                    <span className={style.className.includes('text-') ? '' : ''}>
                      {style.label}
                    </span>
                  </p>
                </div>
                {canToggle ? (
                  <button
                    type="button"
                    onClick={() => onToggleDay(session.dateKey)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${style.className}`}
                  >
                    {session.status === 'completada' ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Circle className="size-3.5" />
                    )}
                    {session.status === 'completada' ? 'Hecha' : 'Marcar'}
                  </button>
                ) : (
                  <span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${style.className}`}>
                    Off
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="p-4">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[9px] font-bold uppercase tracking-wider text-zinc-500">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <MonthGrid sessions={sessions} onToggleDay={onToggleDay} />
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-emerald-300">
              Completada
            </span>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-200">
              Pendiente
            </span>
            <span className="rounded-full border border-brand/40 bg-brand/10 px-2 py-1 text-[var(--portal-brand-light)]">
              Programada
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

function MonthGrid({
  sessions,
  onToggleDay,
}: {
  sessions: CalendarSession[];
  onToggleDay: (dateKey: string) => void;
}) {
  if (sessions.length === 0) return null;
  const first = sessions[0];
  const firstDate = new Date(
    Number(first.dateKey.slice(0, 4)),
    Number(first.dateKey.slice(5, 7)) - 1,
    Number(first.dateKey.slice(8, 10)),
  );
  // Monday-first offset
  const jsDay = firstDate.getDay();
  const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;
  const cells: (CalendarSession | null)[] = [
    ...Array.from({ length: mondayOffset }, () => null),
    ...sessions,
  ];

  return (
    <div className="grid grid-cols-7 gap-1">
      {cells.map((session, index) => {
        if (!session) {
          return <div key={`empty-${index}`} className="aspect-square" />;
        }
        const tone =
          session.status === 'completada'
            ? 'bg-emerald-500/25 text-emerald-200'
            : session.status === 'pendiente'
              ? 'bg-amber-500/20 text-amber-100'
              : session.status === 'programada'
                ? 'bg-brand/20 text-[var(--portal-brand-light)]'
                : 'bg-white/5 text-zinc-500';
        const canToggle = session.status !== 'descanso';
        return (
          <button
            key={session.dateKey}
            type="button"
            disabled={!canToggle}
            onClick={() => canToggle && onToggleDay(session.dateKey)}
            title={`${session.title} · ${STATUS_STYLE[session.status].label}`}
            className={`aspect-square rounded-xl text-[11px] font-bold transition ${tone} ${
              canToggle ? 'hover:ring-1 hover:ring-white/30' : 'cursor-default'
            }`}
          >
            {Number(session.dateKey.slice(-2))}
          </button>
        );
      })}
    </div>
  );
}
