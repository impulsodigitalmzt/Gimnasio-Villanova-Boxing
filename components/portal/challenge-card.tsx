'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import type { Challenge } from '@/lib/portal/types';
import { buildChallengeCheckoutUrl } from '@/lib/portal/payments';

export function ChallengeCard({
  challenge,
  highlight = false,
}: {
  challenge: Challenge;
  highlight?: boolean;
}) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);

  function acceptAndPay() {
    setPaying(true);
    router.push(buildChallengeCheckoutUrl(challenge.id, challenge.price));
  }

  return (
    <article
      id={`reto-${challenge.id}`}
      className={`overflow-hidden rounded-[1.5rem] border-[3px] bg-[var(--portal-card)] ${
        highlight ? 'border-brand' : 'border-zinc-500'
      }`}
    >
      <div className="relative h-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={challenge.image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="font-display text-2xl font-black uppercase text-white">{challenge.title}</h2>
          <p className="text-xs text-zinc-300">Termina {challenge.endsAt}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-base leading-relaxed text-zinc-300">{challenge.description}</p>
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-2xl font-black text-[var(--portal-brand-light)]">
            ${challenge.price.toLocaleString('es-MX')}
          </p>
          {challenge.joined ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold uppercase text-emerald-400">
              <Check className="size-3.5" /> Inscrito
            </span>
          ) : (
            <button
              type="button"
              disabled={paying}
              onClick={acceptAndPay}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--portal-brand)] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)] disabled:opacity-70"
            >
              {paying ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
              {challenge.cta ?? 'Aceptar y Pagar'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
