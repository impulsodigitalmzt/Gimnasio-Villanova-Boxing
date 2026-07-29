'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeUp } from '@/components/animated-title';
import { SectionHeading } from '@/components/section-heading';
import { trainingMethod } from '@/lib/site-data';
import { galleryPhotos } from '@/lib/media';

type TrainingMethodSectionProps = {
  ctaHref?: string;
  ctaLabel?: string;
  showImage?: boolean;
};

export function TrainingMethodSection({
  ctaHref = '/planes#clases',
  ctaLabel = 'Ver clases',
  showImage = true,
}: TrainingMethodSectionProps) {
  const image = galleryPhotos[4]?.src ?? galleryPhotos[0].src;

  return (
    <section className="border-t border-brand/15 bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className={`grid gap-12 ${showImage ? 'lg:grid-cols-[1.15fr_.85fr] lg:items-end' : ''}`}>
          <SectionHeading
            eyebrow={trainingMethod.eyebrow}
            title={trainingMethod.title}
            description={trainingMethod.lead}
          />
          {showImage ? (
            <FadeUp delay={0.15}>
              <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40 sm:aspect-[16/11] lg:aspect-[5/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Clase de boxeo Villanova — 60 minutos de máximo impacto"
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-light">
                    Sesión completa
                  </p>
                  <p className="mt-1 font-display text-2xl uppercase text-white">60 min · Máximo impacto</p>
                </figcaption>
              </figure>
            </FadeUp>
          ) : null}
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {trainingMethod.pillars.map((pillar, index) => (
            <FadeUp key={pillar.id} delay={0.06 * index}>
              <article className="border-t-[3px] border-brand/50 pt-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  0{index + 1}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-white">
                  {pillar.title}
                </h3>
                {pillar.copy ? (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">{pillar.copy}</p>
                ) : null}
                {pillar.points.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {pillar.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-relaxed text-zinc-400 sm:text-base"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </FadeUp>
          ))}
        </div>

        {ctaHref ? (
          <FadeUp delay={0.2}>
            <div className="mt-12">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
              >
                {ctaLabel} <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>
        ) : null}
      </div>
    </section>
  );
}
