'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { eventArchiveImages } from '@/lib/events-data';

type SelectedImage = { src: string; alt: string } | null;

/**
 * Pasarela horizontal del archivo histórico. Conserva las tarjetas grandes en
 * móvil, permite arrastrar y suma controles visibles en pantallas amplias.
 */
export function EventMediaGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<SelectedImage>(null);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selected]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * 0.8, 620), behavior: 'smooth' });
  };

  return (
    <>
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => move(-1)}
          className="flex size-11 items-center justify-center rounded-full border border-brand/35 text-white transition hover:border-brand hover:bg-brand/10"
          aria-label="Ver fotografías anteriores"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          className="flex size-11 items-center justify-center rounded-full border border-brand/35 text-white transition hover:border-brand hover:bg-brand/10"
          aria-label="Ver fotografías siguientes"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {eventArchiveImages.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setSelected(item)}
            className="group relative aspect-[3/4] w-[68vw] max-w-[18rem] shrink-0 snap-start overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-zinc-900 text-left sm:w-[17rem]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute inset-x-4 bottom-4 text-[10px] font-bold uppercase tracking-wider text-white">
              Ver imagen
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada del archivo"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-5 top-[calc(1.25rem+env(safe-area-inset-top,0px))] flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white"
            aria-label="Cerrar imagen"
          >
            <X className="size-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.src}
            alt={selected.alt}
            className="max-h-full max-w-full rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
