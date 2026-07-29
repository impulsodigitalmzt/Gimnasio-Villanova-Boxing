import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, Instagram, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import { EventMediaGallery } from '@/components/event-media-gallery';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { eventMoments, oceanFightNight } from '@/lib/events-data';
import { SOCIAL } from '@/components/social-links';

export const metadata: Metadata = {
  title: 'Eventos y Ocean Fight Night | Villanova Boxing',
  description:
    'Ejemplos reales de lo que Villanova Boxing hace con sus pupilos: noches amateur, ring frente al mar y comunidad en Mazatlán. No son anuncios de peleas.',
};

const eventHighlights = [
  {
    icon: Trophy,
    title: 'Experiencia para nuestros pupilos',
    copy: 'Subir al ring forma carácter: preparación, respeto y la emoción de competir amateur.',
  },
  {
    icon: ShieldCheck,
    title: 'Ambiente familiar y seguro',
    copy: 'Noches pensadas para que familias y amigos acompañen el crecimiento de cada alumno.',
  },
  {
    icon: Users,
    title: 'Comunidad Villanova',
    copy: 'No entrenas solo: la esquina, el gym y el público caminan con nuestros peleadores.',
  },
] as const;

export default function EventosPage() {
  return (
    <>
      <PageHero
        eyebrow="Ocean Fight Night · Villanova Boxing"
        title={'ASÍ FORMAMOS:\n*NUESTROS EVENTOS.*'}
        description="Estas noches no son anuncios de boletos ni carteleras comerciales. Son ejemplos reales de lo que Villanova hace con sus pupilos: darles un escenario para crecer frente a Mazatlán."
        image={oceanFightNight.hero}
        video={oceanFightNight.heroVideo}
        imagePosition="center"
        primaryHref="#momentos"
        primaryLabel="Ver momentos reales"
      />

      <section className="border-b border-brand/20 bg-[#0c0c0c] py-8">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <p className="max-w-4xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            <span className="font-semibold text-brand-light">Aclaración importante:</span>{' '}
            lo que ves en esta página es un <strong className="text-white">archivo de experiencias</strong>{' '}
            con nuestros alumnos. No es publicidad de una pelea próxima ni venta de entradas.
            Es la prueba de cómo Villanova saca a sus pupilos a escenarios reales.
          </p>
        </div>
      </section>

      <section id="momentos" className="scroll-mt-24 bg-black py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Momentos de eventos especiales"
            title={'LO QUE HACEMOS\n*CON NUESTROS PUPILOS.*'}
            description="Ring, público, esquina y comunidad: una selección visual de la energía que viven nuestros pupilos."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventMoments.map((item) => (
              <article
                key={item.src}
                className="group relative min-h-[19rem] overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-[#111111] sm:min-h-[23rem]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="font-display text-lg font-semibold uppercase leading-snug text-white sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia" className="scroll-mt-24 border-t border-brand/15 bg-[#090909] py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Ocean Fight Night"
                title={'MÁS QUE UN RING:\n*ES FORMACIÓN.*'}
                description="Montamos un ring profesional en locaciones de Mazatlán —como Baraka Beach Club frente al mar— para que nuestros alumnos vivan la competencia amateur con respeto, seguridad y comunidad."
              />

              <div className="mt-12 space-y-6">
                {eventHighlights.map(({ icon: Icon, title, copy }, index) => (
                  <article key={title} className="flex gap-5 border-t border-brand/30 pt-6">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-brand">
                        0{index + 1}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold uppercase text-white">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">{copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <figure className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-3xl border-[3px] border-brand/40 bg-[#111111]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={oceanFightNight.featuredPoster}
                alt="Ejemplo visual de una edición anterior de Ocean Fight Night"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-6 pt-20">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  Archivo · no es un anuncio
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Imagen de una edición pasada. Ilustra el tipo de experiencia que ofrecemos a
                  nuestros pupilos; no promociona una pelea a la venta.
                </p>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section id="galeria" className="border-t border-brand/15 bg-black py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Archivo Villanova"
            title={'ROSTROS E HISTORIAS\n*QUE SUBIERON AL RING.*'}
            description="Una pasarela de pupilos, carteles y recuerdos de ediciones anteriores. Es archivo de nuestro trabajo, no una cartelera vigente."
          />
          <div className="mt-12">
            <EventMediaGallery />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-brand/20 bg-black py-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={oceanFightNight.nightScene}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/55" />

        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand">
              Forma parte de Villanova
            </p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl">
              ¿QUIERES QUE TU HISTORIA{' '}
              <span className="text-gradient-brand">TAMBIÉN SUBA AL RING?</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Si buscas entrenar, competir amateur o simplemente crecer con disciplina, este es el
              camino. Las fechas de funciones se comparten en redes cuando hay una nueva edición —
              aquí mostramos el tipo de experiencia, no una venta de boletos.
            </p>

            <div className="mt-8 rounded-2xl border border-brand/35 bg-brand/10 p-5">
              <p className="flex items-start gap-3 font-semibold text-brand-light">
                <Sparkles className="mt-0.5 size-5 shrink-0" />
                Síguenos en Instagram para ver nuevas funciones y el avance de nuestros pupilos.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
              >
                <Instagram className="size-4" /> Ver más en Instagram
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-brand hover:bg-brand/10"
              >
                Quiero entrenar <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <aside className="overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-black/80 backdrop-blur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={oceanFightNight.sponsors}
              alt="Marcas y aliados que han acompañado Ocean Fight Night"
              className="aspect-square w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand/15 text-brand">
                <HeartHandshake className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold uppercase text-white">
                Aliados de la formación
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Marcas que han acompañado estas noches de crecimiento para nuestros alumnos. Si
                quieres sumar tu marca a la próxima experiencia formativa, hablemos.
              </p>
              <Link
                href="/contacto"
                className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand hover:text-brand-light"
              >
                Hablar sobre patrocinio <ArrowRight className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
