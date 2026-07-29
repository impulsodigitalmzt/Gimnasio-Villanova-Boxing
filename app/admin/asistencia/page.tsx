'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, QrCode, Search, UserRound } from 'lucide-react';
import { PageHeader, StatusBadge, ColoredStatCard } from '@/components/admin/ui';
import { AdminToast } from '@/components/admin/modal';
import { useAdminDb } from '@/hooks/use-admin-db';
import { QrAttendanceScanner } from '@/components/attendance/qr-attendance-scanner';
import {
  computeAttendanceStats,
  loadAttendanceSync,
} from '@/lib/attendance/repository';
import { recordCheckIn, refreshAttendanceRiskInCrm } from '@/lib/attendance/service';
import {
  ATTENDANCE_UPDATED_EVENT,
  type AttendanceCheckIn,
} from '@/lib/attendance/types';
import { attendanceRiskLabel } from '@/lib/attendance/risk';

export default function AsistenciaPage() {
  const { db, toast, setToast } = useAdminDb();
  const [checkIns, setCheckIns] = useState<AttendanceCheckIn[]>([]);
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState('');

  function reload() {
    setCheckIns(loadAttendanceSync());
  }

  useEffect(() => {
    refreshAttendanceRiskInCrm();
    reload();
    const sync = () => reload();
    window.addEventListener(ATTENDANCE_UPDATED_EVENT, sync);
    window.addEventListener('villanova-admin-db-updated', sync);
    return () => {
      window.removeEventListener(ATTENDANCE_UPDATED_EVENT, sync);
      window.removeEventListener('villanova-admin-db-updated', sync);
    };
  }, []);

  const stats = useMemo(
    () => computeAttendanceStats(checkIns, db.members),
    [checkIns, db.members],
  );

  const today = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return checkIns.filter((c) => new Date(c.checkedInAt) >= start);
  }, [checkIns]);

  const manualMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return db.members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.phone || '').includes(q),
      )
      .slice(0, 6);
  }, [db.members, query]);

  async function handleRaw(raw: string) {
    if (busy) return;
    setBusy(true);
    setPaused(true);
    try {
      const result = await recordCheckIn({
        qrRaw: raw,
        source: 'qr_scan',
        deviceLabel: 'Teléfono recepción',
      });
      if (!result.ok) {
        setLastResult(null);
        setToast(result.error);
      } else {
        const msg = result.duplicateToday
          ? `${result.member.name} ya registró asistencia hoy`
          : `✓ ${result.member.name} · check-in OK`;
        setLastResult(msg);
        setToast(msg);
        reload();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(40);
        }
      }
    } finally {
      setBusy(false);
      window.setTimeout(() => setPaused(false), 1200);
    }
  }

  async function handleManual(memberId: string, email: string) {
    if (busy) return;
    setBusy(true);
    try {
      const result = await recordCheckIn({
        memberId,
        email,
        source: 'manual',
        deviceLabel: 'Teléfono recepción',
      });
      if (!result.ok) {
        setToast(result.error);
      } else {
        const msg = result.duplicateToday
          ? `${result.member.name} ya registró asistencia hoy`
          : `✓ ${result.member.name} · check-in manual`;
        setLastResult(msg);
        setToast(msg);
        setQuery('');
        reload();
      }
    } finally {
      setBusy(false);
    }
  }

  function onManualSubmit(event: FormEvent) {
    event.preventDefault();
    const first = manualMatches[0];
    if (!first) return;
    void handleManual(first.id.replace(/^portal_/, ''), first.email);
  }

  return (
    <div>
      <PageHeader
        title="Asistencia QR"
        subtitle="Teléfono del gym · escanea el pase del alumno · se guarda en el CRM (demo local, listo para BD)"
      />

      <div className="space-y-6 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ColoredStatCard
            label="Check-ins hoy"
            value={stats.checkInsToday}
            headerClass="bg-[var(--admin-brand)]"
          />
          <ColoredStatCard
            label="Alumnos hoy"
            value={stats.uniqueMembersToday}
            headerClass="bg-emerald-600"
          />
          <ColoredStatCard
            label="Baja asistencia"
            value={stats.lowAttendanceCount}
            headerClass="bg-amber-500"
          />
          <ColoredStatCard
            label="En riesgo / $ en juego"
            value={`${stats.atRiskCount} · $${stats.revenueAtRisk.toLocaleString('es-MX')}`}
            headerClass="bg-rose-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-800">
                  <QrCode className="size-4 text-[var(--admin-brand)]" />
                  Escáner de recepción
                </h2>
                <p className="text-xs text-zinc-500">
                  Apunta al QR del pase digital del alumno
                </p>
              </div>
              {busy ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Procesando…
                </span>
              ) : null}
            </header>
            <div className="space-y-4 p-5">
              <QrAttendanceScanner onScan={handleRaw} paused={paused || busy} />
              {lastResult ? (
                <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  {lastResult}
                </div>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <header className="border-b border-zinc-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-800">
                <Search className="size-4 text-[var(--admin-brand)]" />
                Check-in manual
              </h2>
              <p className="text-xs text-zinc-500">
                Si el QR no carga: busca por nombre, correo o WhatsApp
              </p>
            </header>
            <div className="space-y-3 p-5">
              <form onSubmit={onManualSubmit}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar alumno…"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[var(--admin-brand)]"
                />
              </form>
              <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100">
                {manualMatches.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-zinc-400">
                    Escribe al menos 2 letras para buscar
                  </p>
                ) : (
                  manualMatches.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void handleManual(m.id.replace(/^portal_/, ''), m.email)
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-50"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-zinc-800">
                          {m.name}
                        </span>
                        <span className="block text-xs text-zinc-500">{m.email}</span>
                      </span>
                      <StatusBadge status={m.status} />
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <header className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-bold text-zinc-800">Check-ins de hoy</h2>
            <p className="text-xs text-zinc-500">
              Quedan en historial local (demo). Con API/BD usarán la misma estructura.
            </p>
          </header>
          <div className="divide-y divide-zinc-100">
            {today.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-zinc-400">
                Aún no hay asistencias hoy. Escanea el primer pase.
              </p>
            ) : (
              today.slice(0, 30).map((c) => (
                <article
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                      <UserRound className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">{c.memberName}</p>
                      <p className="text-xs text-zinc-500">
                        {c.planName || '—'} · {c.source === 'qr_scan' ? 'QR' : 'Manual'}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-zinc-500">
                    {new Date(c.checkedInAt).toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <header className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-bold text-zinc-800">Retención · asistencia</h2>
            <p className="text-xs text-zinc-500">
              Alumnos con baja asistencia o en riesgo (7 / 14 días sin check-in)
            </p>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Alumno</th>
                  <th className="px-5 py-3 font-semibold">Plan</th>
                  <th className="px-5 py-3 font-semibold">Última visita</th>
                  <th className="px-5 py-3 font-semibold">Riesgo</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {db.members
                  .filter(
                    (m) =>
                      m.status !== 'pendiente' &&
                      (m.attendanceRisk === 'baja' ||
                        m.attendanceRisk === 'en_riesgo' ||
                        m.attendanceRisk === 'sin_registro'),
                  )
                  .slice(0, 20)
                  .map((m) => (
                    <tr key={m.id} className="border-t border-zinc-100">
                      <td className="px-5 py-3 font-semibold text-zinc-800">
                        {m.name}
                        <span className="mt-0.5 block text-xs font-normal text-zinc-400">
                          {m.email}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-600">{m.plan}</td>
                      <td className="px-5 py-3 text-zinc-500">
                        {m.lastCheckInAt
                          ? new Date(m.lastCheckInAt).toLocaleDateString('es-MX')
                          : '—'}
                        {typeof m.daysSinceLastVisit === 'number' ? (
                          <span className="mt-0.5 block text-xs text-zinc-400">
                            Hace {m.daysSinceLastVisit} días
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            m.attendanceRisk === 'en_riesgo'
                              ? 'bg-rose-100 text-rose-700'
                              : m.attendanceRisk === 'baja'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {attendanceRiskLabel(m.attendanceRisk || 'sin_registro')}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={m.status} />
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
