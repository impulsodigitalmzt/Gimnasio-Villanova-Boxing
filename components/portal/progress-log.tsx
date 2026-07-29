'use client';

import { FormEvent, useMemo, useState } from 'react';
import { NotebookPen, Trash2 } from 'lucide-react';
import type { DailyWorkout, ProgressEntry } from '@/lib/portal/training-data';

function formatEntryDate(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

export function ProgressLogSection({
  workout,
  entries,
  onAdd,
  onRemove,
}: {
  workout: DailyWorkout;
  entries: ProgressEntry[];
  onAdd: (input: {
    exerciseId: string;
    exerciseName: string;
    weight: string;
    reps: string;
    notes: string;
  }) => void;
  onRemove: (id: string) => void;
}) {
  const [exerciseId, setExerciseId] = useState(workout.exercises[0]?.id || '');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  const grouped = useMemo(() => {
    const map = new Map<string, ProgressEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.dateKey) || [];
      list.push(entry);
      map.set(entry.dateKey, list);
    }
    return [...map.entries()];
  }, [entries]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const exercise =
      workout.exercises.find((e) => e.id === exerciseId) || workout.exercises[0];
    if (!exercise || (!weight && !reps && !notes)) return;
    onAdd({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      weight: weight || '—',
      reps: reps || '—',
      notes,
    });
    setWeight('');
    setReps('');
    setNotes('');
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
          Registro de progreso
        </p>
        <h2 className="mt-1 flex items-center gap-2 font-display text-xl font-black uppercase text-white">
          <NotebookPen className="size-5 text-[var(--portal-brand)]" />
          Tus marcas
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Anota pesos, repeticiones y notas para ver tu evolución semana a semana.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-3 border-b border-white/10 px-5 py-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-zinc-400">Ejercicio</span>
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
          >
            {workout.exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-zinc-400">Peso / carga</span>
            <input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej. 12 kg"
              className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-zinc-400">Reps / tiempo</span>
            <input
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Ej. 12 o 3 min"
              className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-zinc-400">Nota de desempeño</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Cómo te sentiste, técnica, mejoras…"
            className="w-full resize-y rounded-xl border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
          />
        </label>
        <button
          type="submit"
          className="flex w-full justify-center rounded-2xl bg-[var(--portal-brand)] py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)]"
        >
          Guardar marca
        </button>
      </form>

      <div className="max-h-[28rem] space-y-4 overflow-y-auto px-5 py-4">
        {grouped.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Aún no hay registros. Guarda tu primera marca después de entrenar.
          </p>
        ) : (
          grouped.map(([dateKey, list]) => (
            <div key={dateKey}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {formatEntryDate(dateKey)}
              </p>
              <ul className="space-y-2">
                {list.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {entry.exerciseName}
                        </p>
                        <p className="mt-1 text-xs text-[var(--portal-brand-light)]">
                          {entry.weight} · {entry.reps}
                        </p>
                        {entry.notes ? (
                          <p className="mt-1 text-xs leading-relaxed text-zinc-400">{entry.notes}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(entry.id)}
                        className="rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-rose-300"
                        aria-label="Eliminar registro"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
