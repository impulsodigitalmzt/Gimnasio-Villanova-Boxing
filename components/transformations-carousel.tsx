import { trainingPhotos } from '@/lib/media';

export function TransformationsCarousel() {
  const photos = trainingPhotos;
  const loop = [...photos, ...photos];

  return (
    <div className="relative mt-14 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent sm:w-28" />

      <div className="marquee-track">
        {loop.map((src, index) => (
          <figure
            key={`${src}-${index}`}
            className="relative mr-4 aspect-[4/5] w-[240px] shrink-0 overflow-hidden rounded-3xl border-[3px] border-brand/40 sm:w-[300px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Entrenamiento Villanova Boxing"
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            <figcaption>
              <span className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-brand backdrop-blur">
                Villanova
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
