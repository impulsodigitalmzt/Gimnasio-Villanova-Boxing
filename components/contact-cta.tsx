import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { brandAssets } from '@/lib/media';

export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brandAssets.logoBlack}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 size-[420px] rotate-12 object-contain opacity-20"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <h2 className="max-w-4xl font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-black sm:text-6xl">
          Sube al ring. <span className="text-black/70">Hazlo con disciplina.</span>
        </h2>
        <Link
          href="/contacto"
          className="inline-flex shrink-0 items-center gap-3 rounded-full bg-black px-7 py-4 text-xs font-black uppercase tracking-wider text-brand hover:bg-zinc-900"
        >
          Comienza hoy <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
