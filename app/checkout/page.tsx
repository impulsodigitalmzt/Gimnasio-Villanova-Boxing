'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, UserRound } from 'lucide-react';
import { getCurrentUserId } from '@/lib/portal/users';
import { buildMembershipPayUrl } from '@/lib/portal/payments';
import { getSubscriptionCheckoutAmount, getSubscriptionPlan } from '@/lib/portal/subscription-plans';

/**
 * Checkout público de membresía.
 * Regla operativa: no se paga sin cuenta. Redirige a registro o a /app/pagar si ya hay sesión.
 */
export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('plan') || 'individual';
    const tipo = params.get('tipo');
    const userId = getCurrentUserId();

    if (userId && (tipo === 'renovar' || tipo === 'miembro')) {
      const checkout = getSubscriptionCheckoutAmount(planId);
      const plan = getSubscriptionPlan(planId);
      router.replace(buildMembershipPayUrl(checkout.total, plan.name, plan.id));
      return;
    }

    router.replace(`/app/registro?plan=${encodeURIComponent(planId)}`);
  }, [router]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-black px-5">
      <div className="w-full max-w-md rounded-3xl border-[3px] border-brand/35 bg-[#111111] p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/15 text-brand">
          <UserRound className="size-7" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-black uppercase text-white">
          Primero tu cuenta
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Para contratar o renovar una membresía necesitas registrarte. Así ligamos tu pago, tu
          vigencia y el seguimiento en el panel del gym.
        </p>
        <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
          <Loader2 className="size-3.5 animate-spin" /> Redirigiendo…
        </p>
        <Link
          href="/app/registro"
          className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
        >
          Ir a registro
        </Link>
      </div>
    </div>
  );
}
