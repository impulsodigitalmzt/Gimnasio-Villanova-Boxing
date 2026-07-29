'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ShoppingBag, Trophy } from 'lucide-react';
import { AccountStatusCard } from '@/components/portal/account-status';
import { ClassOfDayCard } from '@/components/portal/class-of-day';
import { ChallengeCard } from '@/components/portal/challenge-card';
import { useMemberPortal } from '@/lib/portal/store';
import { todayClass, todayRoutine } from '@/lib/portal/mock-data';
import { subscriptionPlans } from '@/lib/portal/subscription-plans';

function PlanPicker() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-brand/40 bg-[var(--portal-card)] p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
        Elige tu plan
      </p>
      <h2 className="mt-2 font-display text-2xl font-black uppercase text-white">
        Activa tu membresía
      </h2>
      <p className="mt-2 text-sm text-zinc-400">
        Ya tienes cuenta. Selecciona un plan y confirma el pago para entrenar.
      </p>
      <div className="mt-4 space-y-2">
        {subscriptionPlans.map((plan) => (
          <Link
            key={plan.id}
            href={`/app/pagar?planId=${plan.id}&concepto=membresia`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 hover:border-brand/50"
          >
            <span>
              <span className="block text-sm font-bold text-white">{plan.name}</span>
              <span className="text-xs text-zinc-500">{plan.period}</span>
            </span>
            <span className="text-sm font-black text-[var(--portal-brand-light)]">
              ${plan.price.toLocaleString('es-MX')}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MemberDashboardContent() {
  const searchParams = useSearchParams();
  const showPlanPicker = searchParams.get('accion') === 'elegir-plan';
  const { ready, profile, challenges } = useMemberPortal();

  const member = profile;
  const featured = challenges.filter((c) => !c.joined).slice(0, 3);

  if (!ready) {
    return <div className="py-20 text-center text-sm text-zinc-500">Cargando tu cuenta…</div>;
  }

  if (!member) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-zinc-400">No hay sesión activa.</p>
        <Link href="/app/login" className="mt-4 inline-block text-[var(--portal-brand-light)]">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const needsPlan =
    showPlanPicker || member.status === 'pendiente' || member.expiresAt === 'Pendiente de pago';

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
          Hola, {member.name.split(' ')[0]}
        </p>
        <h1 className="mt-1 font-display text-3xl font-black uppercase leading-none text-white">
          Tu panel de <span className="text-[var(--portal-brand)]">alumno</span>
        </h1>
      </header>

      {needsPlan ? <PlanPicker /> : null}

      <AccountStatusCard profile={member} />
      <ClassOfDayCard dayClass={todayClass} routine={todayRoutine} />

      <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
        <Link href="/app/tienda" className="flex items-center gap-4 p-5 active:bg-white/5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--portal-brand)] text-white">
            <ShoppingBag className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
              Tienda Villanova
            </p>
            <p className="font-display text-xl font-black uppercase text-white">Merch & gear</p>
            <p className="mt-0.5 text-xs text-zinc-500">Remeras, shakers, proteína y más</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--portal-brand-light)]">
            Ver
          </span>
        </Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
            <Trophy className="size-4 text-[var(--portal-brand)]" /> Retos vigentes
          </h2>
          <Link href="/app/retos" className="text-xs font-bold text-[var(--portal-brand-light)]">
            Ver todos
          </Link>
        </div>
        {featured.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </section>
    </div>
  );
}

export default function MemberDashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-zinc-500">Cargando…</div>}>
      <MemberDashboardContent />
    </Suspense>
  );
}
