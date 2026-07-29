'use client';

import { AutoScrollGallery } from '@/components/auto-scroll-gallery';
import { eventArchiveImages } from '@/lib/events-data';

/** Pasarela automática del archivo histórico de Eventos. */
export function EventMediaGallery() {
  return (
    <AutoScrollGallery
      items={eventArchiveImages}
      ariaLabel="Pasarela de imágenes del archivo Villanova"
    />
  );
}
