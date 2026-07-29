'use client';

import Link from 'next/link';
import { CalendarDays, ClipboardList, Loader2, Package, Users } from 'lucide-react';
import { ActionCard, OccupancyBar, PageHeader, StatCard } from '@/components/admin/ui';
import { AdminToast } from '@/components/admin/modal';
import { useAdminDb } from '@/hooks/use-admin-db';
import { activatePendingUser } from '@/lib/admin/store';
import { gymHours } from '@/lib/site-data';

export default function AdminDashboardPage() {
  const { db, busy, toast, run, stats } = useAdminDb();

  return (
    <div>
      <PageHeader
        title="Inicio"
        subtitle={`Operación del gym de boxeo · ${gymHours.compact}`}
      />

      <div className="space-y-6 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Socios activos"
            value={stats.dashboard.activeMembers}
            hint="Con membresía vigente"
          />
          <StatCard
            label="Pendientes"
            value={stats.members.pending}
            hint="Esperan activación"
          />
          <StatCard
            label="Nuevos del mes"
            value={stats.dashboard.newThisMonth}
          />
          <StatCard
            label="Clases hoy"
            value={db.todayClasses.length}
            hint={`${stats.dashboard.reservationsToday} reservas`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/admin/socios" className="block">
            <ActionCard
              title="Socios"
              description="Activar Individual, Dúo o Grupal"
              icon={<Users className="size-6" />}
            />
          </Link>
          <Link href="/admin/agenda" className="block">
            <ActionCard
              title="Clases"
              description="Técnica, costales, mitts y sparring"
              icon={<CalendarDays className="size-6" />}
            />
          </Link>
          <Link href="/admin/rutinas" className="block">
            <ActionCard
              title="Rutinas"
              description="Publicar el plan diario de boxeo"
              icon={<ClipboardList className="size-6" />}
            />
          </Link>
          <Link href="/admin/productos" className="block">
            <ActionCard
              title="Tienda"
              description="Guantes, protectores y merch"
              icon={<Package className="size-6" />}
            />
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-zinc-800">Por activar</h2>
                <p className="text-xs text-zinc-500">Nuevos registros que esperan acceso</p>
              </div>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Nombre</th>
                    <th className="px-5 py-3 font-semibold">Correo</th>
                    <th className="px-5 py-3 font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {db.pendingUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-10 text-center text-zinc-400">
                        No hay pendientes por ahora
                      </td>
                    </tr>
                  ) : (
                    db.pendingUsers.map((user) => (
                      <tr key={user.id} className="border-t border-zinc-100">
                        <td className="px-5 py-3.5 font-medium text-zinc-800">{user.name}</td>
                        <td className="px-5 py-3.5 text-zinc-500">{user.email}</td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              run(
                                () => activatePendingUser(user.id),
                                `${user.name} activado`,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--admin-brand)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--admin-brand-dark)] disabled:opacity-60"
                          >
                            {busy ? <Loader2 className="size-3 animate-spin" /> : null}
                            Activar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <header className="border-b border-zinc-100 px-5 py-4">
              <h2 className="text-sm font-bold text-zinc-800">Clases de hoy</h2>
              <p className="text-xs text-zinc-500">Ocupación en tiempo real</p>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Hora</th>
                    <th className="px-5 py-3 font-semibold">Clase</th>
                    <th className="px-5 py-3 font-semibold">Cupo</th>
                    <th className="px-5 py-3 font-semibold">Ocupación</th>
                  </tr>
                </thead>
                <tbody>
                  {db.todayClasses.map((cls) => (
                    <tr key={cls.id} className="border-t border-zinc-100">
                      <td className="px-5 py-3.5 font-medium text-zinc-800">{cls.time}</td>
                      <td className="px-5 py-3.5 text-zinc-600">{cls.name}</td>
                      <td className="px-5 py-3.5 text-zinc-500">
                        {cls.enrolled}/{cls.capacity}
                      </td>
                      <td className="px-5 py-3.5">
                        <OccupancyBar enrolled={cls.enrolled} capacity={cls.capacity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <AdminToast message={toast} />
    </div>
  );
}
