import Link from 'next/link';
import { Check, CreditCard, Trophy, Users } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { activeChallenges } from '@/lib/portal/mock-data';
import { buildChallengeCheckoutUrl } from '@/lib/portal/payments';

export function ChallengesShowcase() {
  return (
    <section id="retos" className="scroll-mt-28 border-t border-brand/15 bg-[#090909] py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Retos"
          title={'DESAFÍOS ACTIVOS\n*PARA TODOS.*'}
          description="Vitrina pública de retos Villanova: conoce tipos, beneficios y precios. Inscríbete cuando quieras."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {activeChallenges.map((challenge) => (
            <article
              key={challenge.id}
              id={`reto-${challenge.id}`}
              className="flex flex-col overflow-hidden rounded-3xl border-[3px] border-brand/40 bg-[#111111]"
            >
              <div className="relative aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black">
                  <Trophy className="size-3.5" />
                  Activo
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl uppercase text-white sm:text-3xl">
                    {challenge.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-300">Termina {challenge.endsAt}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                {challenge.audience ? (
                  <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-light">
                    <Users className="size-3.5" />
                    {challenge.audience}
                  </p>
                ) : null}

                <p className="text-base leading-relaxed text-zinc-300">{challenge.description}</p>

                {challenge.highlights?.length ? (
                  <ul className="mt-5 space-y-2.5">
                    {challenge.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-zinc-200">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
                  <p className="font-display text-3xl text-brand">
                    ${challenge.price.toLocaleString('es-MX')}
                  </p>
                  <Link
                    href={buildChallengeCheckoutUrl(challenge.id, challenge.price)}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
                  >
                    <CreditCard className="size-4" />
                    {challenge.cta ?? 'Inscribirme'}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
