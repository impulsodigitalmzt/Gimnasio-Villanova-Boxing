'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { MemberCheckInQr } from '@/components/attendance/member-checkin-qr';
import { useMemberPortal } from '@/lib/portal/store';
import { isMembershipCurrent } from '@/lib/portal/membership-access';
import {
  confirmTodayCheckInFromPortal,
  useTodayCheckIn,
} from '@/lib/portal/daily-checkin';
import { todayClass } from '@/lib/portal/mock-data';
import {
  createDigitalPass,
  loadDigitalPass,
  saveDigitalPass,
} from '@/lib/digital-pass';

export default function MemberQrPage() {
  const router = useRouter();
  const { ready, profile } = useMemberPortal();
  const membershipOk = isMembershipCurrent(profile);
  const checkIn = useTodayCheckIn({
    memberId: profile?.id,
    email: profile?.email,
    enabled: ready && Boolean(profile),
  });
  const [handoff, setHandoff] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const redirected = useRef(false);
  const demoMode = !process.env.NEXT_PUBLIC_ATTENDANCE_API_URL?.trim();

  // Polling corto: al registrarse la entrada (mismo dispositivo / otra pestaña) pasa a clase.
  useEffect(() => {
    if (!profile || !membershipOk) return;
    const id = window.setInterval(() => checkIn.refresh(), 1500);
    return () => window.clearInterval(id);
  }, [profile, membershipOk, checkIn.refresh]);

  useEffect(() => {
    if (!checkIn.ready || !checkIn.checkedIn || redirected.current) return;
    redirected.current = true;
    setHandoff(true);
    const t = window.setTimeout(() => {
      router.replace('/app/clases');
    }, 1200);
    return () => window.clearTimeout(t);
  }, [checkIn.ready, checkIn.checkedIn, router]);

  if (!ready || !checkIn.ready) {
    return <div className="py-20 text-center text-sm text-zinc-500">Cargando…</div>;
  }

  if (!profile) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-zinc-400">Inicia sesión para ver tu QR de asistencia.</p>
        <Link href="/app/login" className="mt-4 inline-block text-[var(--portal-brand-light)]">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (handoff || checkIn.checkedIn) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-2 py-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="size-9" />
        </span>
        <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
          Entrada registrada
        </p>
        <h1 className="mt-2 font-display text-3xl font-black uppercase text-white">
          ¡Listo, {profile.name.split(' ')[0]}!
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Abriendo tu clase de hoy: <span className="text-white">{todayClass.name}</span> ·{' '}
          {todayClass.time}
        </p>
        <p className="mt-8 text-xs text-zinc-500">Un momento…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-2 py-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
        Asistencia Villanova
      </p>
      <h1 className="mt-2 text-center font-display text-3xl font-black uppercase text-white">
        Mi QR
      </h1>
      <p className="mt-3 max-w-xs text-center text-sm text-zinc-400">
        Muéstralo en recepción. Al registrar tu entrada, pasas automático a tu clase del día.
      </p>

      <div className="mt-8 rounded-[1.75rem] border-[3px] border-zinc-500 bg-white p-5 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
        <MemberCheckInQr
          memberId={profile.id}
          email={profile.email}
          size={240}
          showId={false}
          className="!rounded-none !bg-transparent !p-0 !shadow-none"
        />
      </div>

      <p className="mt-5 text-center font-display text-lg font-black uppercase text-white">
        {profile.name}
      </p>
      <p className="mt-1 text-center text-xs text-zinc-500">{profile.planName}</p>
      <p className="mt-1 font-mono text-[10px] text-zinc-600">{profile.id}</p>

      <p className="mt-6 max-w-xs text-center text-xs text-zinc-500">
        Mantén esta pantalla hasta oír la confirmación. Luego verás tu rutina de clase.
      </p>

      {demoMode ? (
        <button
          type="button"
          disabled={confirming}
          className="mt-4 w-full max-w-xs rounded-2xl bg-[var(--portal-brand)] py-3.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)] disabled:opacity-50"
          onClick={() => {
            setConfirming(true);
            void confirmTodayCheckInFromPortal({
              memberId: profile.id,
              email: profile.email,
            })
              .then((ok) => {
                if (!ok) return;
                checkIn.refresh();
                setHandoff(true);
                redirected.current = true;
                router.replace('/app/clases');
              })
              .finally(() => setConfirming(false));
          }}
        >
          {confirming ? 'Abriendo clase…' : 'Ya me escanearon · ir a mi clase'}
        </button>
      ) : null}

      <button
        type="button"
        className="mt-3 w-full max-w-xs rounded-2xl border border-white/15 py-3.5 text-[10px] font-black uppercase tracking-wider text-zinc-300 hover:border-brand hover:text-white"
        onClick={() => {
          const existing = loadDigitalPass();
          const next = createDigitalPass({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            planId: profile.planId,
            memberId: existing?.memberId,
            portalUserId: profile.id,
          });
          if (profile.expiresAt && profile.expiresAt !== 'Pendiente de pago') {
            next.expiresAt = profile.expiresAt;
          }
          saveDigitalPass(next);
        }}
      >
        Guardar en pase digital
      </button>
    </div>
  );
}
