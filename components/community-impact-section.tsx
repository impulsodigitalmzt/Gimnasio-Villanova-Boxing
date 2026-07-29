'use client';

import { CountUp } from '@/components/count-up';
import { AnimatedTitle, FadeUp } from '@/components/animated-title';
import { ReelCard } from '@/components/reel-card';
import { healthyEnvironmentPhoto, reels } from '@/lib/media';

export function CommunityImpactSection() {
  return (
    <section className="border-y border-brand/15 bg-[#090909] py-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <CountUp
            to={500}
            suffix="+"
            duration={2.2}
            className="inline-block font-display text-7xl font-semibold leading-none text-brand sm:text-9xl"
          />
          <FadeUp delay={0.15}>
            <p className="mt-3 font-display text-2xl font-semibold uppercase text-white">
              Sesiones que forman carácter
            </p>
          </FadeUp>
          <AnimatedTitle
            as="blockquote"
            delay={0.25}
            title={'“El ring no pregunta tu edad. Solo pide *disciplina.*”'}
            className="mt-10 max-w-xl font-display text-3xl font-semibold uppercase leading-tight text-white sm:text-5xl"
          />
          <FadeUp delay={0.45}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-zinc-400">
              En Villanova Boxing entrenan juntos niños, jóvenes y adultos: un ambiente sano,
              inclusivo y orientado al progreso real.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.4fr_0.9fr] sm:items-end">
          <FadeUp delay={0.2}>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40 bg-[#111111] sm:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={healthyEnvironmentPhoto}
                alt="Comunidad Villanova Boxing en un ambiente sano e inclusivo"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-brand">Ambiente sano</p>
                <p className="mt-1 font-display text-2xl font-black uppercase text-white">
                  Comunidad Villanova
                </p>
              </figcaption>
            </figure>
          </FadeUp>

          <FadeUp delay={0.35}>
            <ReelCard
              src={reels.class}
              title="Clases"
              subtitle="Todos los niveles"
              className="aspect-[9/16] w-full"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
