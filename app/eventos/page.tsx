import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, Instagram, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import { EventMediaGallery } from '@/components/event-media-gallery';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { oceanFightNight } from '@/lib/events-data';
import { SOCIAL } from '@/components/social-links';

export const metadata: Metadata = {
  title: 'Ocean Fight Night y eventos | Villanova Boxing',
  description:
    'Conoce Ocean Fight Night: noches de boxeo amateur organizadas por Villanova Boxing en Mazatlán, con galería, videos y oportunidades de patrocinio.',
};

const eventHighlights = [
  {
    icon: Trophy,
    title: 'Eventos para todos los niveles',
    copy: 'Desde exhibiciones amateur hasta peleas estelares.',
  },
  {
    icon: ShieldCheck,
    title: 'Una experiencia para toda la familia',
    copy: 'Un ambiente seguro, inclusivo y lleno de adrenalina.',
  },
  {
    icon: Users,
    title: 'Apoya a tus favoritos',
    copy: 'Alienta a los peleadores de Villanova y sé parte de su historia.',
  },
] as const;

export default function EventosPage() {
  return (
    <>
      <PageHero
        eyebrow="Ocean Fight Night · Villanova Boxing"
        title={'VIVE LA GLORIA:\n*NUESTROS EVENTOS.*'}
        description="No somos un gimnasio donde entrenas y te vas. Somos una comunidad que vive la pasión del boxeo y crea noches donde nuestros alumnos pueden brillar frente a todo Mazatlán."
        image={oceanFightNight.hero}
        imagePosition="center 48%"
        primaryHref="#cartelera"
        primaryLabel="Descubre la experiencia"
      />

      <section id="cartelera" className="scroll-mt-24 bg-black py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Cartelera estelar"
                title={'NOCHE DE\n*BOXEO AMATEUR.*'}
                description='Ocean Fight Night es más que una serie de peleas: es un espectáculo deportivo completo. Montamos un ring profesional en locaciones únicas de Mazatlán, como Baraka Beach Club frente al mar, para vivir cada round al atardecer.'
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
                alt="Cartelera estelar de Ocean Fight Night en Baraka Beach Club"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-6 pt-20">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  Archivo de Ocean Fight Night
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Cartel de una edición anterior. La próxima fecha se anunciará en nuestras redes.
                </p>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section id="galeria" className="border-t border-brand/15 bg-[#090909] py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Galería multimedia"
            title={'GALERÍA DE EMOCIONES:\n*MOMENTOS CLAVE.*'}
            description="Atardeceres frente al ring, la energía del público, el trabajo en la esquina y los peleadores que dieron vida a Ocean Fight Night."
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
              Próxima cartelera
            </p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl">
              ¿QUIERES SER PARTE DE <span className="text-gradient-brand">LA PRÓXIMA NOCHE?</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Ya sea que quieras entrenar para competir o simplemente disfrutar una noche de boxeo de
              alto nivel, Villanova Boxing es tu lugar.
            </p>

            <div className="mt-8 rounded-2xl border border-brand/35 bg-brand/10 p-5">
              <p className="flex items-start gap-3 font-semibold text-brand-light">
                <Sparkles className="mt-0.5 size-5 shrink-0" />
                Mantente atento a nuestras redes sociales para conocer la próxima fecha y la venta de
                boletos.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
              >
                <Instagram className="size-4" /> Seguir novedades
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-brand hover:bg-brand/10"
              >
                Quiero competir <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <aside className="overflow-hidden rounded-3xl border-[3px] border-brand/35 bg-black/80 backdrop-blur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={oceanFightNight.sponsors}
              alt="Patrocinadores que han formado parte de Ocean Fight Night"
              className="aspect-square w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand/15 text-brand">
                <HeartHandshake className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold uppercase text-white">
                Haz que tu marca suba al ring
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                ¿Te interesa patrocinar? Asocia tu marca con una de las experiencias deportivas más
                emocionantes de Mazatlán.
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
