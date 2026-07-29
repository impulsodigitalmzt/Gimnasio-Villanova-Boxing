import Link from 'next/link';
import { Check, Dumbbell } from 'lucide-react';
import { membershipPlans } from '@/lib/site-data';

export function MembershipCards() {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-3">
      {membershipPlans.map((plan) => (
        <article
          key={plan.id}
          className={`flex flex-col rounded-3xl p-7 sm:p-8 ${
            plan.popular
              ? 'border-[3px] border-brand bg-white text-black shadow-2xl shadow-brand/20 lg:-translate-y-3'
              : 'border-[3px] border-brand/40 bg-[#111111] text-white'
          }`}
        >
          <div className="mb-10 flex items-start justify-between">
            <span
              className={`rounded-xl p-3 ${
                plan.popular ? 'bg-brand text-black' : 'bg-brand/15 text-brand-light'
              }`}
            >
              <Dumbbell className="size-5" />
            </span>
            {plan.popular && (
              <span className="rounded-full bg-brand px-4 py-2 text-[10px] font-black uppercase tracking-wider text-black">
                Más popular
              </span>
            )}
          </div>

          <h3 className="font-display text-xl font-semibold uppercase">{plan.title}</h3>
          <div className="mt-3 flex items-end gap-2">
            <span
              className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl ${
                plan.popular ? 'text-brand-dark' : 'text-brand'
              }`}
            >
              ${plan.price.toLocaleString('es-MX')}
            </span>
            <span className={`pb-2 text-sm ${plan.popular ? 'text-black/60' : 'text-zinc-400'}`}>
              {plan.period}
            </span>
          </div>
          <div className="mt-7">
            <p
              className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                plan.popular ? 'text-brand-dark' : 'text-brand-light'
              }`}
            >
              En qué consiste
            </p>
            <p
              className={`mt-3 text-sm leading-relaxed sm:text-base ${
              plan.popular ? 'text-black/65' : 'text-zinc-200'
              }`}
            >
              {plan.description}
            </p>
          </div>

          <div className={`my-7 h-px ${plan.popular ? 'bg-black/10' : 'bg-white/10'}`} />

          <div>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                plan.popular ? 'text-brand-dark' : 'text-brand-light'
              }`}
            >
              Lo que vas a lograr
            </p>
            <div className="mt-4 space-y-4">
              {plan.benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <Check
                    className={`mt-0.5 size-4 shrink-0 ${
                      plan.popular ? 'text-brand-dark' : 'text-brand'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-bold leading-snug">{benefit.title}</p>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        plan.popular ? 'text-black/60' : 'text-zinc-400'
                      }`}
                    >
                      {benefit.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`my-7 h-px ${plan.popular ? 'bg-black/10' : 'bg-white/10'}`} />

          <div className="flex-1">
            <p
              className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                plan.popular ? 'text-brand-dark' : 'text-brand-light'
              }`}
            >
              Lo que incluye
            </p>
            <div className="mt-4 space-y-3.5">
            {plan.features.map((feature) => (
              <p key={feature} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                <Check
                  className={`mt-0.5 size-4 shrink-0 ${
                    plan.popular ? 'text-brand-dark' : 'text-brand'
                  }`}
                />
                <span className={plan.popular ? 'text-black/75' : 'text-zinc-100'}>{feature}</span>
              </p>
            ))}
            </div>
          </div>

          <Link
            href={`/app/login?plan=${plan.id}`}
            className={`mt-9 rounded-xl py-4 text-center text-xs font-black uppercase tracking-wider transition-colors ${
              plan.popular
                ? 'bg-brand text-black hover:bg-brand-dark hover:text-white'
                : 'border border-brand bg-brand/10 text-white hover:bg-brand hover:text-black'
            }`}
          >
            Contratar plan
          </Link>
        </article>
      ))}
    </div>
  );
}
