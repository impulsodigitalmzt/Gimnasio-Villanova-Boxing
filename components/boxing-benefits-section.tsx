'use client';

import { Dumbbell, HeartPulse, Scale, Zap, type LucideIcon } from 'lucide-react';
import { FadeUp } from '@/components/animated-title';
import { ReelCard } from '@/components/reel-card';
import { SectionHeading } from '@/components/section-heading';
import { reels } from '@/lib/media';
import { boxingBenefits } from '@/lib/site-data';

const icons: Record<(typeof boxingBenefits.items)[number]['icon'], LucideIcon> = {
  scale: Scale,
  dumbbell: Dumbbell,
  heart: HeartPulse,
  zap: Zap,
};

export function BoxingBenefitsSection() {
  return (
    <section className="border-t border-brand/15 bg-black py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.05fr_0.72fr] lg:items-start lg:gap-10 xl:gap-14">
          <SectionHeading
            eyebrow={boxingBenefits.eyebrow}
            title={boxingBenefits.title}
            description={boxingBenefits.lead}
          />

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {boxingBenefits.items.map((item, index) => {
              const Icon = icons[item.icon];
              return (
                <FadeUp key={item.id} delay={0.08 * index}>
                  <article className="border-t-[3px] border-brand/45 pt-6">
                    <Icon className="size-8 text-brand" strokeWidth={1.5} aria-hidden />
                    <h3 className="mt-5 font-display text-2xl font-semibold uppercase text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                      {item.copy}
                    </p>
                  </article>
                </FadeUp>
              );
            })}
          </div>

          <FadeUp delay={0.15} className="mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-none">
            <ReelCard
              src={reels.bags}
              title="Máximo impacto"
              subtitle="Entrenamiento intenso"
              className="aspect-[9/16] w-full"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
