'use client';

import { useEffect, useState } from 'react';
import { Camera, Film, Images, Play, X } from 'lucide-react';
import { eventMoments, eventPosters, eventVideos } from '@/lib/events-data';

type GalleryTab = 'momentos' | 'videos' | 'cartelera';
type SelectedImage = { src: string; alt: string } | null;

const tabs = [
  { id: 'momentos', label: 'Momentos', icon: Camera },
  { id: 'videos', label: 'Videos', icon: Film },
  { id: 'cartelera', label: 'Peleadores', icon: Images },
] as const;

export function EventMediaGallery() {
  const [active, setActive] = useState<GalleryTab>('momentos');
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

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-wider transition ${
              active === id
                ? 'bg-brand text-black'
                : 'border border-brand/30 bg-brand/5 text-zinc-300 hover:border-brand hover:text-white'
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {active === 'momentos' ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {eventMoments.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setSelected({ src: item.src, alt: item.alt })}
              className={`group relative overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-zinc-900 text-left ${
                index === 0 || index === 2
                  ? 'min-h-[390px] lg:col-span-7'
                  : 'min-h-[320px] lg:col-span-5'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-display text-2xl font-semibold uppercase text-white">
                  {item.title}
                </span>
                <span className="mt-2 block max-w-lg text-sm leading-relaxed text-zinc-300">
                  {item.copy}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {active === 'videos' ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {eventVideos.map((item, index) => (
            <article
              key={item.src}
              className={`overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-[#111111] ${
                index === 0 ? 'md:col-span-2 xl:col-span-1' : ''
              }`}
            >
              <div className="relative aspect-[9/16] bg-black">
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="pointer-events-none absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-brand text-black shadow-lg">
                  <Play className="size-4 fill-current" />
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold uppercase text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {active === 'cartelera' ? (
        <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-5">
          {eventPosters.map((item) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setSelected(item)}
              className="group relative aspect-[3/4] w-[240px] shrink-0 snap-start overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-zinc-900 sm:w-[290px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                Ver cartel
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {selected ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada del evento"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white"
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
