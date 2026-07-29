import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { CoachingTeamSection } from '@/components/coaching-team-section';
import { FadeUp, AnimatedTitle } from '@/components/animated-title';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import {
  irvingProfile,
  irvingStory,
  irvingValues,
  irvingVision,
} from '@/lib/irving-story';
import { irvingPhotos } from '@/lib/media';

export const metadata = {
  title: 'Quién soy | Irving Villanova',
  description:
    'Irving Villanova cuenta su historia: valores, bullying, boxeo y la visión de Villanova Boxing Gym en Mazatlán.',
};

export default function QuienSoyPage() {
  return (
    <>
      <PageHero
        eyebrow="Quién soy"
        title={'IRVING\n*VILLANOVA.*'}
        description={irvingProfile.lead}
        image={irvingPhotos.hero}
        imagePosition="center top"
        primaryHref="/planes"
        primaryLabel="Entrena con nosotros"
      />

      <section className="bg-black py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-end">
          <div>
            <FadeUp>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
                {irvingProfile.role}
              </p>
            </FadeUp>
            <AnimatedTitle
              as="h2"
              title={'Mi historia detrás\ndel *gimnasio.*'}
              className="mt-4 whitespace-pre-line font-display text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl"
            />
            <FadeUp delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                {irvingProfile.lead}
              </p>
            </FadeUp>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40 sm:aspect-[16/11] lg:aspect-[5/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={irvingPhotos.portrait}
              alt="Irving Villanova, entrenador y fundador"
              className="absolute inset-0 size-full object-cover"
            />
          </figure>
        </div>
      </section>

      <section className="border-t border-brand/15 bg-[#0a0a0a] py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Mis valores"
            title={'ASÍ ENSEÑO.\nASÍ *VIVO.*'}
            description="La disciplina y la perseverancia son mis mayores virtudes. El resto es servicio: formar personas seguras, no solo peleadores."
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {irvingValues.map((value, index) => (
              <article key={value.title} className="border-t-[3px] border-brand/50 pt-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  0{index + 1}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-white">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">{value.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand/15 bg-black py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Mi historia"
            title={'DEL MIEDO\nA *ENSEÑAR.*'}
            description="De las escaleras de la primaria al gym: así nació Villanova Boxing."
          />

          <div className="mt-16 space-y-20">
            {irvingStory.map((chapter, index) => {
              const photo =
                irvingPhotos.training[index] ??
                irvingPhotos.training[irvingPhotos.training.length - 1];
              const reverse = index % 2 === 1;

              return (
                <article
                  key={chapter.eyebrow}
                  className="grid items-center gap-10 lg:grid-cols-2"
                >
                  <figure
                    className={`relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40 sm:aspect-[5/4] ${
                      reverse ? 'lg:order-2' : ''
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  </figure>
                  <div className={reverse ? 'lg:order-1' : ''}>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
                      {chapter.eyebrow}
                    </p>
                    <h3 className="mt-4 font-display text-3xl font-semibold uppercase leading-tight text-white sm:text-4xl">
                      {chapter.title}
                    </h3>
                    <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-300">
                      {chapter.body.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-brand/15 bg-[#090909] py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Mi visión"
              title={'CAMPEONES\nY *PERSONAS.*'}
            />
            <FadeUp delay={0.2}>
              <blockquote className="mt-8 max-w-2xl border-l-[3px] border-brand pl-6 text-lg leading-relaxed text-zinc-200 sm:text-xl">
                {irvingVision}
              </blockquote>
            </FadeUp>
            <FadeUp delay={0.35}>
              <Link
                href="/contacto"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
              >
                Conoce el gym <ArrowRight className="size-4" />
              </Link>
            </FadeUp>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <figure className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-3xl border-[3px] border-brand/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={irvingPhotos.coaching}
                alt="Irving formando a la nueva generación"
                className="absolute inset-0 size-full object-cover"
              />
            </figure>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={irvingPhotos.gym}
                alt="Villanova Boxing Gym"
                className="absolute inset-0 size-full object-cover"
              />
            </figure>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={irvingPhotos.training[0]}
                alt="Entrenamiento Villanova"
                className="absolute inset-0 size-full object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      <CoachingTeamSection />
      <ContactCta />
    </>
  );
}
