'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useMemberPortal } from '@/lib/portal/store';
import { membershipRenewalPrice } from '@/lib/portal/mock-data';
import {
  getSubscriptionCheckoutAmount,
  getSubscriptionPlan,
} from '@/lib/portal/subscription-plans';
import {
  ACTIVATION_POLICY,
  activateUserAfterPayment,
  getCurrentUserId,
  userToMemberProfile,
} from '@/lib/portal/users';
import { CART_STORAGE_KEY } from '@/lib/portal/store-data';
import { SignupProvider, useSignupFlow } from '@/components/portal/signup-context';
import { useCart } from '@/components/portal/cart-context';
import { persistMemberSession } from '@/lib/portal/auth-session';

function PayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const reto = params.get('reto');
  const concepto = params.get('concepto');
  const titulo = params.get('titulo');
  const planId = params.get('planId') || undefined;
  const montoParam = Number(params.get('monto') || 0);

  const { joinChallenge, challenges, profile, persistProfile } = useMemberPortal();
  const { completeSimulatedPayment } = useSignupFlow();
  const { clearCart, items: cartItems, subtotal: cartSubtotal } = useCart();

  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const challenge = challenges.find((c) => c.id === reto);
  const isChallenge = Boolean(reto) || concepto === 'reto';
  const isShop = concepto === 'tienda';
  const isSubscription =
    !isShop &&
    (Boolean(planId) || concepto === 'suscripcion' || concepto === 'membresia');

  const checkout = planId ? getSubscriptionCheckoutAmount(planId) : null;
  const plan = planId ? getSubscriptionPlan(planId) : null;

  const amount = isChallenge
    ? challenge?.price ?? montoParam
    : isShop
      ? montoParam || cartSubtotal
      : checkout?.total ?? (montoParam || membershipRenewalPrice);

  const title = isChallenge
    ? challenge?.title ?? titulo ?? 'Reto Villanova'
    : isShop
      ? titulo || 'Pedido Tienda Villanova'
      : plan?.name || titulo || profile?.planName || 'Pase Libre';

  function syncAndActivateMembership() {
    const userId = getCurrentUserId();
    if (!userId && isSubscription) {
      router.replace(`/app/registro${planId ? `?plan=${planId}` : ''}`);
      return null;
    }

    if (userId && isSubscription) {
      const activated =
        completeSimulatedPayment({
          userId,
          planId: planId || profile?.planId,
          amount,
        }) ||
        activateUserAfterPayment(userId, {
          planId: planId || profile?.planId,
          amountPaid: amount,
        });

      if (activated) {
        persistMemberSession(activated);
        persistProfile(userToMemberProfile(activated));
        return activated;
      }
    }

    // Renovación de socio ya logueado sin planId en query
    if (userId) {
      const activated = activateUserAfterPayment(userId, {
        planId: profile?.planId,
        amountPaid: amount,
      });
      if (activated) {
        persistMemberSession(activated);
        persistProfile(userToMemberProfile(activated));
        return activated;
      }
    }

    return null;
  }

  function runPayment(autoRedirect: boolean) {
    setProcessing(true);
    window.setTimeout(() => {
      if (isChallenge && reto) {
        joinChallenge(reto);
        setProcessing(false);
        setDone(true);
        return;
      }

      if (isShop) {
        clearCart();
        window.localStorage.setItem(CART_STORAGE_KEY, '[]');
        setProcessing(false);
        setDone(true);
        if (autoRedirect) {
          setRedirecting(true);
          window.setTimeout(() => {
            router.push('/app/tienda');
            router.refresh();
          }, 1600);
        }
        return;
      }

      const activated = syncAndActivateMembership();
      if (!activated && isSubscription) {
        setProcessing(false);
        return;
      }
      setProcessing(false);
      setDone(true);

      if (autoRedirect && !isChallenge) {
        setRedirecting(true);
        window.setTimeout(() => {
          router.push('/app');
          router.refresh();
        }, 900);
      }
    }, 1400);
  }

  if (done) {
    if (isShop) {
      return (
        <div className="rounded-[1.75rem] border-[3px] border-emerald-500/50 bg-[var(--portal-card)] p-8 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check className="size-8" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-black uppercase text-white">
            ¡Compra confirmada!
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Pago confirmado por ${amount.toLocaleString('es-MX')} MXN. Pasa por recepción a recoger
            tu pedido o te avisamos cuando esté listo.
          </p>
          {redirecting ? (
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--portal-brand-light)]">
              <Loader2 className="size-3.5 animate-spin" /> Volviendo a la tienda
            </p>
          ) : (
            <Link
              href="/app/tienda"
              className="mt-8 flex w-full justify-center rounded-2xl bg-[var(--portal-brand)] py-4 text-xs font-black uppercase tracking-wider text-white"
            >
              Seguir comprando
            </Link>
          )}
        </div>
      );
    }

    const pendingReview = ACTIVATION_POLICY.postPaymentStatus === 'pendiente' && isSubscription;
    return (
      <div className="rounded-[1.75rem] border-[3px] border-emerald-500/50 bg-[var(--portal-card)] p-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-black uppercase text-white">
          {pendingReview ? 'Pago recibido' : 'Pago confirmado'}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isChallenge
            ? 'Tu reto ya está activo.'
            : pendingReview
              ? 'Tu registro quedó pendiente de activación por recepción.'
              : 'Tu membresía quedó activa por 30 días. Te enviamos la bienvenida por WhatsApp y correo, y programamos el aviso de renovación.'}
        </p>
        {redirecting ? (
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--portal-brand-light)]">
            <Loader2 className="size-3.5 animate-spin" /> Redirigiendo
          </p>
        ) : (
          <Link
            href={isChallenge ? '/app/retos' : '/app'}
            className="mt-8 flex w-full justify-center rounded-2xl bg-[var(--portal-brand)] py-4 text-xs font-black uppercase tracking-wider text-white"
          >
            Ir al portal
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
          Checkout Villanova
        </p>
        <h1 className="mt-1 font-display text-3xl font-black uppercase text-white">
          {isChallenge
            ? 'Pagar reto'
            : isShop
              ? 'Pagar pedido'
              : isSubscription
                ? 'Activar membresía'
                : 'Pagar ahora'}
        </h1>
      </header>

      <div className="rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)] p-6">
        <p className="text-sm text-zinc-400">Concepto</p>
        <p className="mt-1 font-display text-2xl font-black uppercase text-white">{title}</p>
        {planId ? (
          <p className="mt-1 text-xs text-zinc-500">
            Plan ID: <span className="font-mono text-zinc-300">{planId}</span>
          </p>
        ) : null}

        {isShop && cartItems.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-zinc-400">
            {cartItems.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="truncate text-zinc-300">
                  {item.qty}× {item.name}
                </span>
                <span className="shrink-0 text-white">
                  ${(item.price * item.qty).toLocaleString('es-MX')}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {checkout && checkout.enrollment > 0 ? (
          <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>Membresía</span>
              <span className="text-white">${checkout.planPrice.toLocaleString('es-MX')}</span>
            </div>
            <div className="flex justify-between">
              <span>Inscripción</span>
              <span className="text-white">${checkout.enrollment.toLocaleString('es-MX')}</span>
            </div>
          </div>
        ) : null}

        <p className="mt-4 font-display text-4xl font-black text-[var(--portal-brand-light)]">
          ${amount.toLocaleString('es-MX')} <span className="text-sm text-zinc-500">MXN</span>
        </p>
      </div>

      <button
        type="button"
        disabled={processing}
        onClick={() => runPayment(true)}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--portal-brand)] py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)] disabled:opacity-70"
      >
        {processing ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
        {processing ? 'Procesando pago...' : 'Confirmar pago'}
      </button>

      <p className="text-center text-[11px] text-zinc-500">
        Pago seguro · Villanova Boxing
      </p>

      <button
        type="button"
        onClick={() => router.back()}
        className="w-full text-center text-xs font-bold text-zinc-500 hover:text-white"
      >
        Cancelar
      </button>
    </div>
  );
}

export default function MemberPayPage() {
  return (
    <SignupProvider>
      <Suspense fallback={<div className="text-zinc-500">Cargando pago...</div>}>
        <PayContent />
      </Suspense>
    </SignupProvider>
  );
}
