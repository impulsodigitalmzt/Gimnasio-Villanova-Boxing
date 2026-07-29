'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type AutoScrollGalleryItem = {
  src: string;
  alt: string;
};

type AutoScrollGalleryProps = {
  items: readonly AutoScrollGalleryItem[];
  ariaLabel: string;
  cardClassName?: string;
  showControls?: boolean;
  controlsClassName?: string;
  edgeFade?: boolean;
  badge?: ReactNode;
  /** Tipografía / etiqueta inferior sobre cada tarjeta. */
  caption?: string;
};

const AUTO_SPEED = 0.55;
const RESUME_DELAY_MS = 2200;

/**
 * Pasarela horizontal en bucle: avanza sola y se puede arrastrar
 * con mouse/dedo, flechas y abrir cada imagen.
 */
export function AutoScrollGallery({
  items,
  ariaLabel,
  cardClassName = 'aspect-[3/4] w-[68vw] max-w-[18rem] sm:w-[17rem]',
  showControls = true,
  controlsClassName = '',
  edgeFade = false,
  badge,
  caption = 'Ver imagen',
}: AutoScrollGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<AutoScrollGalleryItem | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startScroll: number;
    moved: boolean;
  }>({ active: false, startX: 0, startScroll: 0, moved: false });

  const loopImages = [...items, ...items];

  const pauseAuto = () => {
    pausedRef.current = true;
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const resumeAutoSoon = () => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, RESUME_DELAY_MS);
  };

  const normalizeLoop = (track: HTMLDivElement) => {
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    if (track.scrollLeft >= half) {
      track.scrollLeft -= half;
    } else if (track.scrollLeft <= 0) {
      track.scrollLeft += half;
    }
  };

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    pauseAuto();
    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.8, 620),
      behavior: 'smooth',
    });
    window.setTimeout(() => normalizeLoop(track), 420);
    resumeAutoSoon();
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    let frame = 0;
    const tick = () => {
      if (!pausedRef.current && !selected && !dragRef.current.active) {
        track.scrollLeft += AUTO_SPEED;
        normalizeLoop(track);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, [items.length, selected]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseAuto();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', closeOnEscape);
      resumeAutoSoon();
    };
  }, [selected]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    pauseAuto();
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 6) drag.moved = true;
    track.scrollLeft = drag.startScroll - delta;
    normalizeLoop(track);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;
    dragRef.current.active = false;
    try {
      track.releasePointerCapture(event.pointerId);
    } catch {
      // Ya liberado
    }
    resumeAutoSoon();
  };

  if (items.length === 0) return null;

  return (
    <>
      {showControls ? (
        <div className={`mb-5 flex justify-end gap-2 ${controlsClassName}`.trim()}>
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
      ) : null}

      <div className="relative">
        {edgeFade ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent sm:w-28" />
          </>
        ) : null}

        <div
          ref={trackRef}
          className="flex cursor-grab gap-4 overflow-x-auto pb-5 active:cursor-grabbing touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onWheel={() => {
            pauseAuto();
            resumeAutoSoon();
          }}
          role="region"
          aria-label={ariaLabel}
        >
          {loopImages.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => {
                if (dragRef.current.moved) return;
                setSelected(item);
              }}
              className={`group relative shrink-0 overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-zinc-900 text-left ${cardClassName}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                draggable={false}
                className="pointer-events-none absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {badge ? (
                <span className="pointer-events-none absolute bottom-3 left-3">{badge}</span>
              ) : (
                <span className="pointer-events-none absolute inset-x-4 bottom-4 text-[10px] font-bold uppercase tracking-wider text-white">
                  {caption}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
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
