'use client';

import Link from 'next/link';
import { MemberCheckInQr } from '@/components/attendance/member-checkin-qr';
import { useMemberPortal } from '@/lib/portal/store';
import {
  createDigitalPass,
  loadDigitalPass,
  saveDigitalPass,
} from '@/lib/digital-pass';

export default function MemberQrPage() {
  const { ready, profile } = useMemberPortal();

  if (!ready) {
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

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-2 py-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
        Asistencia Villanova
      </p>
      <h1 className="mt-2 text-center font-display text-3xl font-black uppercase text-white">
        Mi QR
      </h1>
      <p className="mt-3 max-w-xs text-center text-sm text-zinc-400">
        Muéstralo en recepción. El teléfono del gym lo escanea en un segundo.
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

      <button
        type="button"
        className="mt-8 w-full max-w-xs rounded-2xl border border-white/15 py-3.5 text-[10px] font-black uppercase tracking-wider text-zinc-300 hover:border-brand hover:text-white"
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
