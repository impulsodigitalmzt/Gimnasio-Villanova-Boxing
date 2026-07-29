'use client';

import { useEffect, useMemo, useState } from 'react';
import { BellRing, Mail, MessageCircle, Search } from 'lucide-react';
import { ColoredStatCard, PageHeader, StatusBadge } from '@/components/admin/ui';
import { AdminToast } from '@/components/admin/modal';
import { useAdminDb } from '@/hooks/use-admin-db';
import { updateMemberStatus } from '@/lib/admin/store';
import type { MemberStatus } from '@/lib/admin/types';
import {
  loadAutomations,
  markAutomationSent,
  type CrmAutomation,
} from '@/lib/portal/automations';

export default function SociosPage() {
  const { db, busy, toast, run, stats } = useAdminDb();
  const [query, setQuery] = useState('');
  const [automations, setAutomations] = useState<CrmAutomation[]>([]);

  useEffect(() => {
    const sync = () => setAutomations(loadAutomations());
    sync();
    window.addEventListener('villanova-crm-automations-updated', sync);
    window.addEventListener('villanova-portal-users-updated', sync);
    return () => {
      window.removeEventListener('villanova-crm-automations-updated', sync);
      window.removeEventListener('villanova-portal-users-updated', sync);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return db.members;
    return db.members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.plan.toLowerCase().includes(q) ||
        (m.phone ?? '').toLowerCase().includes(q) ||
        (m.primaryClassName ?? '').toLowerCase().includes(q) ||
        (m.challengeTitles ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [db.members, query]);

  const pendingAutomations = useMemo(
    () => automations.filter((a) => a.status === 'queued' || a.status === 'scheduled'),
    [automations],
  );

  function cycleStatus(current: MemberStatus): MemberStatus {
    if (current === 'activo') return 'por_vencer';
    if (current === 'por_vencer') return 'vencido';
    return 'activo';
  }

  return (
    <div>
      <PageHeader
        title="Socios"
        subtitle="Prospecto → pago → alumno activo · seguimiento de plan, retos y rutina de box"
      />

      <div className="space-y-6 p-5 sm:p-8">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, plan, clase, reto o WhatsApp..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm text-zinc-700 outline-none focus:border-[var(--admin-brand)]"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ColoredStatCard label="Activos" value={stats.members.active} headerClass="bg-[var(--admin-brand)]" />
          <ColoredStatCard
            label="Por vencer (≤3 días)"
            value={stats.members.soon ?? db.members.filter((m) => m.status === 'por_vencer').length}
            headerClass="bg-amber-500"
          />
          <ColoredStatCard label="Vencidos" value={stats.members.overdue} headerClass="bg-zinc-800" />
          <ColoredStatCard label="Pendientes de pago" value={stats.members.pending} headerClass="bg-[var(--admin-brand-dark)]" />
        </div>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-800">Seguimiento automático</h2>
              <p className="text-xs text-zinc-500">
                Bienvenida al activar · recordatorio 3 días antes del vencimiento
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              {pendingAutomations.length} pendientes
            </span>
          </header>
          <div className="divide-y divide-zinc-100">
            {pendingAutomations.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-zinc-400">
                No hay avisos en cola. Se generan al confirmar un pago o cuando un socio entra en
                ventana de vencimiento.
              </p>
            ) : (
              pendingAutomations.slice(0, 8).map((item) => (
                <article key={item.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                        {item.kind === 'welcome' ? (
                          <>
                            <BellRing className="size-3" /> Bienvenida
                          </>
                        ) : (
                          <>
                            <BellRing className="size-3" /> Renovación
                          </>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {item.channel === 'whatsapp' ? (
                          <MessageCircle className="size-3 text-emerald-600" />
                        ) : (
                          <Mail className="size-3 text-sky-600" />
                        )}
                        {item.channel}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                        {item.status === 'queued' ? 'Listo para enviar' : 'Programado'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-zinc-800">
                      {item.memberName} · {item.memberEmail}
                      {item.phone ? ` · ${item.phone}` : ''}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.message}</p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg bg-[var(--admin-brand)] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[var(--admin-brand-dark)]"
                    onClick={() => {
                      markAutomationSent(item.id);
                      setAutomations(loadAutomations());
                    }}
                  >
                    Marcar enviado
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <header className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-bold text-zinc-800">Listado de socios</h2>
            <p className="text-xs text-zinc-500">
              Seguimiento por plan, retos adquiridos, clase de box y progreso de entrenamiento
            </p>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nombre</th>
                  <th className="px-5 py-3 font-semibold">Contacto</th>
                  <th className="px-5 py-3 font-semibold">Plan</th>
                  <th className="px-5 py-3 font-semibold">Entrenamiento</th>
                  <th className="px-5 py-3 font-semibold">Retos</th>
                  <th className="px-5 py-3 font-semibold">Progreso</th>
                  <th className="px-5 py-3 font-semibold">Vence</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id} className="border-t border-zinc-100 hover:bg-zinc-50/80">
                    <td className="px-5 py-3.5 font-semibold text-[var(--admin-brand)]">
                      {member.name}
                      {member.id.startsWith('portal_') ? (
                        <span className="ml-2 rounded-full bg-[var(--admin-brand)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                          Portal
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">
                      <span className="block">{member.email}</span>
                      {member.phone ? (
                        <span className="mt-0.5 block text-xs text-zinc-400">WA {member.phone}</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-700">
                      <span className="block font-medium">{member.plan}</span>
                      {member.planId ? (
                        <span className="mt-0.5 block font-mono text-[10px] text-zinc-400">
                          {member.planId}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-700">
                      {member.primaryClassName || member.lastWorkoutTitle ? (
                        <>
                          <span className="block font-medium">
                            {member.primaryClassName || '—'}
                          </span>
                          {member.lastWorkoutTitle ? (
                            <span className="mt-0.5 block text-xs text-zinc-400">
                              {member.lastWorkoutTitle}
                            </span>
                          ) : null}
                          {member.trainingLevel ? (
                            <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                              {member.trainingLevel}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-zinc-400">Sin rutina aún</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">
                      {member.challengeTitles && member.challengeTitles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {member.challengeTitles.map((title) => (
                            <span
                              key={title}
                              className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700"
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">
                      <span className="block text-xs">
                        Semana: {member.sessionsThisWeek ?? 0} ses.
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-400">
                        Racha {member.streakDays ?? 0} · Total {member.completedSessionsCount ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">{member.expiresAt}</td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        disabled={busy}
                        title="Cambiar estado del socio"
                        onClick={() =>
                          run(
                            () => updateMemberStatus(member.id, cycleStatus(member.status)),
                            `Estado de ${member.name} actualizado`,
                          )
                        }
                      >
                        <StatusBadge status={member.status} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AdminToast message={toast} />
    </div>
  );
}
