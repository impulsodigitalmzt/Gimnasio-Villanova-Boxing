'use client';

import { useEffect, useRef, useState } from 'react';

const videos = [
  '/video/hero-modo-playa.mp4',
  '/video/funcional-intenso.mp4',
  '/video/clases-gluteo-pierna.mp4',
  '/video/reto-villanova.mp4',
  '/video/comunidad-atardecer.mp4',
  '/video/recorrido-coach.mp4',
  '/video/evaluacion-coach.mp4',
  '/video/montaje-equipo.mp4',
  '/video/kettlebell.mp4',
];

/**
 * Full-bleed hero background that plays several club videos in sequence,
 * crossfading from one to the next when each clip ends.
 */
export function HeroVideoRotator() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const video = refs.current[active];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    const next = refs.current[(active + 1) % videos.length];
    if (next) next.load();
  }, [active]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {videos.map((src, index) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[index] = el;
          }}
          src={src}
          muted
          playsInline
          autoPlay={index === 0}
          preload={index === 0 ? 'auto' : 'metadata'}
          onEnded={() => setActive((current) => (current + 1) % videos.length)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
