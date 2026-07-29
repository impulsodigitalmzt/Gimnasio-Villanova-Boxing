'use client';

import { BadgeCheck, CalendarClock, Sparkles } from 'lucide-react';
import type { MemberProfile } from '@/lib/portal/types';
import { getSubscriptionPlan } from '@/lib/portal/subscription-plans';
import { daysUntilExpiry } from '@/lib/portal/membership-lifecycle';

export function PlanBenefitsCard({ profile }: { profile: MemberProfile }) {
  const plan = getSubscriptionPlan(profile.planId || 'individual');
  const daysLeft =
    profile.expiresAt === 'Pendiente de pago' ? null : daysUntilExpiry(profile.expiresAt);

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
          Perfil y plan
        </p>
        <h2 className="mt-1 font-display text-xl font-black uppercase text-white">
          {plan.name}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
      </div>

      <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <CalendarClock className="size-3.5" /> Renovación
          </p>
          <p className="mt-1 font-semibold text-[var(--portal-brand-light)]">
            {profile.expiresAt}
          </p>
          {daysLeft !== null ? (
            <p className="mt-0.5 text-xs text-zinc-400">
              {daysLeft < 0
                ? 'Vencida'
                : `${daysLeft} día${daysLeft === 1 ? '' : 's'} restantes`}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <BadgeCheck className="size-3.5" /> Estado
          </p>
          <p className="mt-1 font-semibold capitalize text-white">
            {profile.status === 'por_vencer' ? 'Por vencer' : profile.status}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            ${plan.price.toLocaleString('es-MX')} {plan.period}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
          <Sparkles className="size-4 text-[var(--portal-brand)]" />
          Beneficios incluidos
        </p>
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-zinc-300"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--portal-brand)]" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
