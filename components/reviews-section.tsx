'use client';

import { Star } from 'lucide-react';
import { reviews } from '@/lib/site-data';
import { SectionHeading } from './section-heading';
import { CoverFlowCarousel } from './cover-flow-carousel';

type Review = (typeof reviews)[number];
type CarouselReview = Review & { id: string };

const carouselReviews: CarouselReview[] = reviews.map((review, index) => ({
  ...review,
  id: `${review.initials}-${index}`,
}));

function ReviewCard({ review, isActive }: { review: CarouselReview; isActive: boolean }) {
  return (
    <article
      className={`flex h-[min(72vw,340px)] max-h-[360px] min-h-[260px] flex-col overflow-hidden rounded-3xl border-[3px] p-6 sm:h-[300px] sm:p-7 md:h-[320px] md:p-8 ${
        isActive ? 'border-brand bg-white' : 'border-zinc-400 bg-white/95'
      }`}
    >
      <div className="mb-3 flex gap-0.5 sm:mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <figure className="flex min-h-0 flex-1 flex-col">
        <blockquote className="relative min-h-0 flex-1 overflow-hidden pl-6 text-base font-medium leading-relaxed text-zinc-700 sm:text-lg">
          <span aria-hidden className="absolute left-0 top-0 font-display text-4xl leading-none text-brand/40">
            “
          </span>
          <span className="line-clamp-5 sm:line-clamp-6">{review.text}</span>
        </blockquote>

        <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-200 pt-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-black text-white">
            {review.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-zinc-900">{review.name}</p>
            <p className="text-xs text-zinc-500">Opinión en Google</p>
          </div>
        </figcaption>
      </figure>
    </article>
  );
}

export function ReviewsSection() {
  return (
    <section className="overflow-x-hidden border-t border-white/10 bg-[#080808] py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="La voz de la comunidad" title={'ENTRENAMOS JUNTOS.\n*CRECEMOS JUNTOS.*'} />
          <div className="flex items-center gap-4">
            <span className="font-display text-5xl font-black text-white">4.9</span>
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="mt-1 text-xs text-zinc-500">Opiniones en Google</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CoverFlowCarousel
            items={carouselReviews}
            ariaLabel="Testimonios de la comunidad Villanova"
            autoplay
            autoplayDelay={4500}
            getLabel={(item) => item.name.split(' ')[0] ?? item.name}
            renderItem={(item, isActive) => <ReviewCard review={item} isActive={isActive} />}
          />
        </div>
      </div>
    </section>
  );
}
