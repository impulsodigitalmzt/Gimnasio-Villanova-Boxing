'use client';

import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';
import { AnimatedTitle, FadeUp } from '@/components/animated-title';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  /** Punto focal de la imagen (object-position) para evitar cortar caras. */
  imagePosition?: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  video,
  imagePosition = 'center',
  primaryHref = '/app/login',
  primaryLabel = 'Acceso alumnos',
}: PageHeroProps) {
  return (
    <section className="site-page-hero-offset relative flex min-h-[62svh] items-end overflow-hidden border-b border-white/10 sm:min-h-[70svh]">
      {(image || video) && (
        <>
          {image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-85"
              style={{ objectPosition: imagePosition }}
            />
          ) : null}
          {video ? (
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: imagePosition }}
              aria-hidden="true"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />
        </>
      )}
      {!image && !video && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,.22),transparent_35%)]" />
      )}

      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-20">
        <FadeUp>
          <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand">
            {eyebrow}
          </p>
        </FadeUp>
        <AnimatedTitle
          title={title}
          as="h1"
          className="max-w-5xl break-words whitespace-pre-line font-display text-[2.35rem] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
        />
        <FadeUp delay={0.25}>
          <div className="mt-8 flex max-w-3xl flex-col gap-7 border-t border-white/20 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">{description}</p>
            <Link
              href={primaryHref}
              className="inline-flex shrink-0 items-center gap-3 text-sm font-black uppercase tracking-wider text-white hover:text-brand"
            >
              {primaryLabel}
              <span className="rounded-full border border-white/25 p-3">
                <ArrowDownRight className="size-4" />
              </span>
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
