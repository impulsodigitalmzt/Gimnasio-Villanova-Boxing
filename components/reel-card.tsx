type ReelCardProps = {
  src: string;
  title?: string;
  subtitle?: string;
  className?: string;
};

export function ReelCard({ src, title, subtitle, className = '' }: ReelCardProps) {
  return (
    <figure className={`group relative overflow-hidden rounded-3xl border-[3px] border-brand/40 bg-zinc-900 ${className}`}>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
      />
      {(title || subtitle) && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-6">
            {subtitle && <p className="font-mono text-[10px] uppercase tracking-widest text-brand">{subtitle}</p>}
            {title && <p className="mt-1 font-display text-2xl font-black uppercase text-white">{title}</p>}
          </figcaption>
        </>
      )}
    </figure>
  );
}
