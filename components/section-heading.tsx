'use client';

import { FadeUp, AnimatedTitle } from '@/components/animated-title';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl'}>
      <FadeUp>
        <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
          {eyebrow}
        </p>
      </FadeUp>
      <AnimatedTitle
        title={title}
        as="h2"
        className="break-words whitespace-pre-line font-display text-[2rem] font-black uppercase leading-[0.95] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl"
      />
      {description ? (
        <FadeUp delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {description}
          </p>
        </FadeUp>
      ) : null}
    </div>
  );
}
