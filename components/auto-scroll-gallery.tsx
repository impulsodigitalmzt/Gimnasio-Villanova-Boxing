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
const DRAG_CLICK_THRESHOLD = 8;

/**
 * Pasarela horizontal en bucle (transform, no scrollLeft).
 * En móvil: autoplay + swipe con el dedo + tap para ampliar.
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<AutoScrollGalleryItem | null>(null);

  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const selectedRef = useRef<AutoScrollGalleryItem | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startOffset: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startOffset: 0,
    moved: false,
  });

  const loopImages = [...items, ...items];
  selectedRef.current = selected;

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

  const applyTransform = (offset: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const normalizeOffset = (value: number) => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return value;
    let next = value % loopWidth;
    if (next < 0) next += loopWidth;
    return next;
  };

  const measureLoopWidth = () => {
    const track = trackRef.current;
    if (!track) return;
    // Dos copias idénticas → el ancho de una copia es la mitad del track.
    loopWidthRef.current = track.scrollWidth / 2;
  };

  const move = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    pauseAuto();
    const step = Math.min(viewport.clientWidth * 0.8, 620);
    offsetRef.current = normalizeOffset(offsetRef.current + direction * step);
    applyTransform(offsetRef.current);
    resumeAutoSoon();
  };

  useEffect(() => {
    if (items.length === 0) return;

    measureLoopWidth();
    const track = trackRef.current;
    if (!track) return;

    const ro = new ResizeObserver(() => {
      const prevLoop = loopWidthRef.current;
      measureLoopWidth();
      if (prevLoop > 0 && loopWidthRef.current > 0) {
        offsetRef.current = normalizeOffset(offsetRef.current);
        applyTransform(offsetRef.current);
      }
    });
    ro.observe(track);

    // Recalcula cuando cargan imágenes (cambia el ancho real).
    const images = track.querySelectorAll('img');
    const onImgLoad = () => {
      measureLoopWidth();
      offsetRef.current = normalizeOffset(offsetRef.current);
      applyTransform(offsetRef.current);
    };
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImgLoad);
    });

    let frame = 0;
    const tick = () => {
      if (
        !pausedRef.current &&
        !selectedRef.current &&
        !dragRef.current.active &&
        loopWidthRef.current > 0
      ) {
        offsetRef.current = normalizeOffset(offsetRef.current + AUTO_SPEED);
        applyTransform(offsetRef.current);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      ro.disconnect();
      images.forEach((img) => img.removeEventListener('load', onImgLoad));
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, [items.length]);

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
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    pauseAuto();
    // Evita que iOS robe el gesto horizontal para scroll de página.
    viewport.style.touchAction = 'none';
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
    };
    viewport.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD) drag.moved = true;
    offsetRef.current = normalizeOffset(drag.startOffset - delta);
    applyTransform(offsetRef.current);
  };

  const endDrag = () => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;
    if (!drag.active) return;

    drag.active = false;
    if (viewport) {
      viewport.style.touchAction = '';
      if (drag.pointerId != null) {
        try {
          viewport.releasePointerCapture(drag.pointerId);
        } catch {
          // Ya liberado
        }
      }
    }
    drag.pointerId = null;
    offsetRef.current = normalizeOffset(offsetRef.current);
    applyTransform(offsetRef.current);
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
          ref={viewportRef}
          className="cursor-grab touch-pan-y overflow-hidden pb-5 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="region"
          aria-label={ariaLabel}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-4 will-change-transform"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {loopImages.map((item, index) => (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => {
                  if (dragRef.current.moved) {
                    dragRef.current.moved = false;
                    return;
                  }
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
