'use client';

import Link from 'next/link';
import { LockKeyhole, QrCode, ShoppingBag } from 'lucide-react';
import {
  isMembershipCurrent,
  membershipLockCopy,
} from '@/lib/portal/membership-access';
import { useMemberPortal } from '@/lib/portal/store';
import { membershipRenewalPrice } from '@/lib/portal/mock-data';
import { buildMembershipPayUrl } from '@/lib/portal/payments';
import { getSubscriptionCheckoutAmount } from '@/lib/portal/subscription-plans';
import {
  confirmTodayCheckInFromPortal,
  useTodayCheckIn,
} from '@/lib/portal/daily-checkin';
import { useState } from 'react';

/**
 * 1) Membresía al corriente
 * 2) Check-in QR del día en recepción
 * Sin (2), no muestra clases/rutinas aunque el plan esté pagado.
 */
export function MembershipContentGate({ children }: { children: React.ReactNode }) {
  const { ready, profile } = useMemberPortal();
  const membershipOk = isMembershipCurrent(profile);
  const checkIn = useTodayCheckIn({
    memberId: profile?.id,
    email: profile?.email,
    enabled: ready && membershipOk,
  });
  const [confirming, setConfirming] = useState(false);
  const demoMode = !process.env.NEXT_PUBLIC_ATTENDANCE_API_URL?.trim();

  if (!ready || (membershipOk && !checkIn.ready)) {
    return <div className="py-20 text-center text-sm text-zinc-500">Cargando…</div>;
  }

  if (membershipOk && checkIn.checkedIn) {
    return <>{children}</>;
  }

  if (membershipOk && !checkIn.checkedIn) {
    return (
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-brand/40 bg-[var(--portal-card)] p-6 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/15 text-brand">
            <QrCode className="size-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-black uppercase text-white">
            Registra tu asistencia
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
            Tu membresía está al corriente. Para ver la rutina, clases y progreso de hoy,
            muéstrale tu QR a recepción y registra tu entrada.
          </p>

          <Link
            href="/app/qr"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--portal-brand)] py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)]"
          >
            <QrCode className="size-4" /> Abrir Mi QR
          </Link>

          {demoMode ? (
            <button
              type="button"
              disabled={confirming}
              className="mt-3 w-full rounded-2xl border border-white/15 py-3.5 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:border-brand hover:text-white disabled:opacity-50"
              onClick={() => {
                if (!profile) return;
                setConfirming(true);
                void confirmTodayCheckInFromPortal({
                  memberId: profile.id,
                  email: profile.email,
                }).finally(() => {
                  setConfirming(false);
                  checkIn.refresh();
                });
              }}
            >
              {confirming ? 'Confirmando…' : 'Ya me escanearon (demo)'}
            </button>
          ) : null}

          <Link
            href="/app/tienda"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-brand"
          >
            <ShoppingBag className="size-4" /> Ir a la tienda
          </Link>
        </section>
      </div>
    );
  }

  const copy = membershipLockCopy(profile?.status);
  const pending = profile?.status === 'pendiente' || !profile;
  const amount = pending
    ? getSubscriptionCheckoutAmount(profile?.planId || 'individual').total
    : membershipRenewalPrice;
  const payUrl = buildMembershipPayUrl(
    amount,
    profile?.planName || 'Membresía',
    profile?.planId || 'individual',
  );

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-brand/40 bg-[var(--portal-card)] p-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/15 text-brand">
          <LockKeyhole className="size-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-black uppercase text-white">{copy.title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">{copy.body}</p>

        <Link
          href={payUrl}
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[var(--portal-brand)] py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)]"
        >
          {copy.cta}
        </Link>
        <Link
          href="/app/tienda"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-brand"
        >
          <ShoppingBag className="size-4" /> Ir a la tienda
        </Link>
      </section>
    </div>
  );
}
