import { QrCode } from 'lucide-react';
import type { DigitalPass } from '@/lib/digital-pass';

export function DigitalPassCard({ pass }: { pass: DigitalPass }) {
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.5rem] border-[3px] border-zinc-500 bg-[radial-gradient(circle_at_90%_10%,rgba(212,175,55,.45),transparent_35%),linear-gradient(135deg,#171717,#050505)] p-5 shadow-2xl shadow-brand/15 sm:rounded-[2rem] sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="" className="size-9 shrink-0 object-contain sm:size-12" />
          <div className="min-w-0">
            <p className="font-display text-base font-black leading-none text-white sm:text-xl">
              VILLANOVA <span className="text-brand">FITNESS</span>
            </p>
            <p className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.22em] text-zinc-500 sm:text-[8px] sm:tracking-[0.3em]">
              Digital member pass
            </p>
          </div>
        </div>
        <QrCode className="size-9 shrink-0 text-white sm:size-12" aria-hidden />
      </div>

      <div className="mt-8 sm:mt-12">
        <p className="break-words font-display text-xl font-black uppercase leading-tight text-white sm:text-3xl md:text-4xl">
          {pass.name}
        </p>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-brand sm:text-xs">
          {pass.plan}
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-white/15 pt-3 font-mono text-[9px] text-zinc-400 sm:mt-6 sm:gap-3 sm:pt-4 sm:text-[10px]">
          <span className="break-all">{pass.memberId}</span>
          <span className="text-brand-light">VENCE {pass.expiresAt}</span>
        </div>
      </div>
    </div>
  );
}
