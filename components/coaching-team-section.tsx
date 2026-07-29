'use client';

import { Check } from 'lucide-react';
import { FadeUp } from '@/components/animated-title';
import { SectionHeading } from '@/components/section-heading';
import { coachingTeam } from '@/lib/site-data';
import { galleryPhotos } from '@/lib/media';

export function CoachingTeamSection() {
  const staffPhoto = galleryPhotos[0];

  return (
    <section className="border-t border-brand/15 bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={coachingTeam.eyebrow}
              title={coachingTeam.title}
              description={coachingTeam.lead}
            />

            <ul className="mt-10 space-y-5">
              {coachingTeam.credentials.map((item, index) => (
                <FadeUp key={item.id} delay={0.08 * index}>
                  <li className="flex gap-4 border-t border-brand/25 pt-5">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                      <Check className="size-4" strokeWidth={2.5} aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold uppercase text-white">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-400 sm:text-base">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                </FadeUp>
              ))}
            </ul>
          </div>

          <FadeUp delay={0.12}>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40 sm:aspect-[5/4] lg:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={staffPhoto.src}
                alt={staffPhoto.title}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-light">
                  {staffPhoto.tag}
                </p>
                <p className="mt-1 font-display text-2xl uppercase text-white">{staffPhoto.title}</p>
                <p className="mt-1 text-sm text-zinc-300">{staffPhoto.copy}</p>
              </figcaption>
            </figure>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
