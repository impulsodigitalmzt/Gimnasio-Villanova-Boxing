'use client';

import Link from 'next/link';
import { LockKeyhole, ShoppingBag } from 'lucide-react';
import {
  isMembershipCurrent,
  membershipLockCopy,
} from '@/lib/portal/membership-access';
import { useMemberPortal } from '@/lib/portal/store';
import { membershipRenewalPrice } from '@/lib/portal/mock-data';
import { buildMembershipPayUrl } from '@/lib/portal/payments';
import { getSubscriptionCheckoutAmount } from '@/lib/portal/subscription-plans';

/**
 * Bloquea contenido de personalización (clases/rutinas) si la membresía
 * no está al corriente. La tienda y otras ventas siguen disponibles.
 */
export function MembershipContentGate({ children }: { children: React.ReactNode }) {
  const { ready, profile } = useMemberPortal();

  if (!ready) {
    return <div className="py-20 text-center text-sm text-zinc-500">Cargando…</div>;
  }

  if (isMembershipCurrent(profile)) {
    return <>{children}</>;
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
