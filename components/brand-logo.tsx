import Link from 'next/link';
import { brandAssets } from '@/lib/media';

type BrandLogoProps = {
  /** on-dark → logo blanco; on-light → logo negro */
  variant?: 'on-dark' | 'on-light';
  showWordmark?: boolean;
  className?: string;
  imgClassName?: string;
};

export function BrandLogo({
  variant = 'on-dark',
  showWordmark = true,
  className = '',
  imgClassName = 'size-11',
}: BrandLogoProps) {
  const src = variant === 'on-light' ? brandAssets.logoBlack : brandAssets.logoWhite;

  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 ${className}`}
      aria-label="Villanova Boxing"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`${imgClassName} object-contain transition-transform group-hover:rotate-6`}
      />
      {showWordmark ? (
        <div className="hidden min-w-0 min-[400px]:block">
          <span
            className={`block truncate font-display text-base font-semibold leading-none tracking-tight sm:text-lg ${
              variant === 'on-light' ? 'text-zinc-900' : 'text-white'
            }`}
          >
            VILLANOVA{' '}
            <span className={variant === 'on-light' ? 'text-brand-dark' : 'text-brand'}>BOXING</span>
          </span>
          <span
            className={`mt-1 block font-mono text-[8px] uppercase tracking-[0.25em] ${
              variant === 'on-light' ? 'text-zinc-500' : 'text-zinc-500'
            }`}
          >
            Boxing Gym
          </span>
        </div>
      ) : null}
    </Link>
  );
}
