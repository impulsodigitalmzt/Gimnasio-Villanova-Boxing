'use client';

import type { MemberProfile } from '@/lib/portal/types';
import type { MemberTrainingStats, TrainingLevel } from '@/lib/portal/training-data';

const LEVEL_LABEL: Record<TrainingLevel, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export function WelcomeProgressCard({
  profile,
  stats,
  level,
  onLevelChange,
}: {
  profile: MemberProfile;
  stats: MemberTrainingStats;
  level: TrainingLevel;
  onLevelChange: (level: TrainingLevel) => void;
}) {
  const firstName = profile.name.split(' ')[0] || profile.name;
  const weekPct = Math.min(
    100,
    Math.round((stats.sessionsThisWeek / Math.max(1, stats.sessionsWeekGoal)) * 100),
  );
  const goalPct = Math.min(
    100,
    Math.round((stats.weeksCompleted / Math.max(1, stats.weeksGoal)) * 100),
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-brand/40 bg-[var(--portal-card)]">
      <div className="bg-gradient-to-br from-[var(--portal-brand)]/25 via-transparent to-transparent px-5 py-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
          {greeting}, {firstName}
        </p>
        <h1 className="mt-1 font-display text-3xl font-black uppercase leading-none text-white">
          Tu panel de <span className="text-[var(--portal-brand)]">alumno</span>
        </h1>
        <p className="mt-3 text-sm text-zinc-300">
          Plan <span className="font-semibold text-white">{profile.planName}</span> · Nivel{' '}
          {LEVEL_LABEL[level]}
        </p>
      </div>

      <div className="space-y-4 border-t border-white/10 px-5 py-5">
        <div>
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Semana actual
              </p>
              <p className="text-sm font-semibold text-white">
                {stats.sessionsThisWeek} de {stats.sessionsWeekGoal} sesiones
              </p>
            </div>
            <p className="text-sm font-black text-[var(--portal-brand-light)]">{weekPct}%</p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/50">
            <div
              className="h-full rounded-full bg-[var(--portal-brand)] transition-all duration-500"
              style={{ width: `${weekPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Meta del ciclo
              </p>
              <p className="text-sm font-semibold text-white">
                {stats.weeksCompleted} de {stats.weeksGoal} semanas completadas
              </p>
            </div>
            <p className="text-sm font-black text-[var(--portal-brand-light)]">{goalPct}%</p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/50">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Racha</p>
            <p className="mt-1 font-display text-2xl font-black text-white">
              {stats.streakDays}{' '}
              <span className="text-sm font-bold text-zinc-400">días</span>
            </p>
          </div>
          <label className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Tu nivel
            </span>
            <select
              value={level}
              onChange={(e) => onLevelChange(e.target.value as TrainingLevel)}
              className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
