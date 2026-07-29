'use client';

import { FormEvent, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui';
import { AdminModal, AdminToast, Field, inputClass } from '@/components/admin/modal';
import { useAdminDb } from '@/hooks/use-admin-db';
import { createWod, deleteWod, updateWod } from '@/lib/admin/store';
import type { Wod } from '@/lib/admin/types';

export default function RutinasPage() {
  const { db, busy, toast, run } = useAdminDb();
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Wod | null>(null);
  const [editing, setEditing] = useState<Wod | null>(null);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState('');

  function openCreate() {
    setEditing(null);
    const today = new Date();
    setDate(
      `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`,
    );
    setTitle('');
    setExercises('');
    setOpen(true);
  }

  function openEdit(wod: Wod) {
    setEditing(wod);
    setDate(wod.date);
    setTitle(wod.title);
    setExercises(wod.exercises);
    setOpen(true);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (editing) {
      await run(() => updateWod(editing.id, { date, title, exercises }), 'Rutina actualizada');
    } else {
      await run(() => createWod({ date, title, exercises, marks: 0 }), 'Rutina publicada');
    }
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Rutinas"
        subtitle="Plan diario de boxeo: sombra, costales, mitts y sparring para el portal"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--admin-brand)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[var(--admin-brand-dark)]"
          >
            <Plus className="size-3.5" /> Nueva rutina
          </button>
        }
      />

      <div className="p-5 sm:p-8">
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Rutina</th>
                  <th className="px-5 py-3 font-semibold">Detalle</th>
                  <th className="px-5 py-3 font-semibold">Completados</th>
                  <th className="px-5 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {db.wods.map((wod) => (
                  <tr key={wod.id} className="border-t border-zinc-100">
                    <td className="px-5 py-3.5 font-medium text-zinc-800">{wod.date}</td>
                    <td className="px-5 py-3.5 font-bold text-zinc-800">{wod.title}</td>
                    <td className="max-w-md px-5 py-3.5 text-zinc-500">{wod.exercises}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--admin-brand)] text-xs font-bold text-white">
                        {wod.marks}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setViewing(wod)}
                          className="rounded-lg bg-[var(--admin-brand)] p-2 text-white hover:bg-[var(--admin-brand-dark)]"
                          aria-label="Ver"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(wod)}
                          className="rounded-lg bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200"
                          aria-label="Editar"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => run(() => deleteWod(wod.id), 'Rutina eliminada')}
                          className="rounded-lg bg-rose-50 p-2 text-rose-500 hover:bg-rose-100"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AdminModal
        open={open}
        title={editing ? 'Editar rutina' : 'Nueva rutina'}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit}>
          <Field label="Fecha (DD/MM)">
            <input className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Nombre">
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Técnica + costal"
              required
            />
          </Field>
          <Field label="Bloques de la sesión">
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={exercises}
              onChange={(e) => setExercises(e.target.value)}
              placeholder="Ej. 3 rounds: 3 min sombra · 2 min costal · 1 min core"
              required
            />
          </Field>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[var(--admin-brand)] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[var(--admin-brand-dark)] disabled:opacity-60"
          >
            Guardar rutina
          </button>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(viewing)}
        title={viewing?.title ?? 'Rutina'}
        onClose={() => setViewing(null)}
      >
        {viewing ? (
          <div className="space-y-3 text-sm text-zinc-600">
            <p>
              <span className="font-semibold text-zinc-800">Fecha:</span> {viewing.date}
            </p>
            <p>
              <span className="font-semibold text-zinc-800">Socios que la completaron:</span>{' '}
              {viewing.marks}
            </p>
            <p className="rounded-xl bg-zinc-50 p-4 leading-relaxed">{viewing.exercises}</p>
          </div>
        ) : null}
      </AdminModal>

      <AdminToast message={toast} />
    </div>
  );
}
