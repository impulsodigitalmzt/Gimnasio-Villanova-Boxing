'use client';

import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { confirmTodayCheckInFromPortal } from '@/lib/portal/daily-checkin';
import { useState } from 'react';

/** Tarjeta de bloqueo diario en Inicio (membresía OK, falta check-in). */
export function DailyCheckInLockCard({
  memberId,
  email,
  onConfirmed,
}: {
  memberId: string;
  email: string;
  onConfirmed?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const demoMode = !process.env.NEXT_PUBLIC_ATTENDANCE_API_URL?.trim();

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-brand/40 bg-[var(--portal-card)] p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
          <QrCode className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
            Entrada del día
          </p>
          <h2 className="mt-1 font-display text-xl font-black uppercase text-white">
            Regístrate para desbloquear
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Tu plan está al corriente. La rutina, el progreso y las clases de hoy se liberan
            cuando recepción escanea tu QR.
          </p>
          <Link
            href="/app/qr"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--portal-brand)] py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)]"
          >
            <QrCode className="size-4" /> Abrir Mi QR
          </Link>
          {demoMode ? (
            <button
              type="button"
              disabled={confirming}
              className="mt-2 w-full rounded-2xl border border-white/15 py-3 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:border-brand hover:text-white disabled:opacity-50"
              onClick={() => {
                setConfirming(true);
                void confirmTodayCheckInFromPortal({ memberId, email }).finally(() => {
                  setConfirming(false);
                  onConfirmed?.();
                });
              }}
            >
              {confirming ? 'Confirmando…' : 'Ya me escanearon (demo)'}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
