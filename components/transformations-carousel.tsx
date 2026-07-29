'use client';

import { AutoScrollGallery } from '@/components/auto-scroll-gallery';
import { trainingPhotos } from '@/lib/media';

const items = trainingPhotos.map((src) => ({
  src,
  alt: 'Entrenamiento Villanova Boxing',
}));

/** Pasarela de sesiones reales en la página de inicio. */
export function TransformationsCarousel() {
  return (
    <div className="relative mt-14 overflow-hidden">
      <AutoScrollGallery
        items={items}
        ariaLabel="Pasarela de sesiones Villanova Boxing"
        cardClassName="aspect-[4/5] w-[240px] sm:w-[300px]"
        controlsClassName="px-5 sm:px-8"
        edgeFade
        showControls
        badge={
          <span className="bg-black/80 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-brand backdrop-blur">
            Villanova
          </span>
        }
      />
    </div>
  );
}
