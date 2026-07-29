import Link from 'next/link';
import { ArrowRight, Dumbbell, ShoppingBag, UserRound, Users } from 'lucide-react';
import { AnimatedTitle, FadeUp } from '@/components/animated-title';
import { ContactCta } from '@/components/contact-cta';
import { CommunityImpactSection } from '@/components/community-impact-section';
import { HeroIntro } from '@/components/hero-intro';
import { HeroVideoWall } from '@/components/hero-video-wall';
import { MembershipCards } from '@/components/membership-cards';
import { ReviewsSection } from '@/components/reviews-section';
import { SectionHeading } from '@/components/section-heading';
import { TransformationsCarousel } from '@/components/transformations-carousel';
import { TrainingMethodSection } from '@/components/training-method-section';
import { BoxingBenefitsSection } from '@/components/boxing-benefits-section';
import { galleryPhotos, irvingPhotos } from '@/lib/media';

const experiences = [
  {
    href: '/quien-soy',
    title: 'Quién soy',
    copy: 'Conoce a Irving Villanova: valores, historia y visión del gym.',
    image: irvingPhotos.hero,
    icon: UserRound,
  },
  {
    href: '/gimnasio',
    title: 'Instalaciones',
    copy: 'Ring, costales, mitts y acondicionamiento en un solo espacio.',
    image: galleryPhotos[3].src,
    icon: Dumbbell,
  },
  {
    href: '/planes',
    title: 'Planes',
    copy: 'Clases, membresías y retos en una sola experiencia.',
    image: galleryPhotos[4].src,
    icon: Users,
  },
  {
    href: '/tienda',
    title: 'Tienda',
    copy: 'Equipamiento y merch oficial Villanova Boxing.',
    image: galleryPhotos[0].src,
    icon: ShoppingBag,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[100svh] flex-col bg-black pt-20">
        {/* Contenedor con altura real para que el video absolute se pinte */}
        <div className="relative h-[42svh] min-h-[15rem] w-full shrink-0 sm:h-[52svh] lg:h-[62svh]">
          <HeroVideoWall />
        </div>
        <div className="relative z-10 shrink-0 border-t border-brand/15 bg-black">
          <HeroIntro />
        </div>
      </section>

      <section className="bg-black py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="La experiencia Villanova"
            title={'TODO LO QUE NECESITAS\nPARA *SUBIR DE NIVEL.*'}
            description="Instalaciones, clases, retos y tienda oficial: un ecosistema de boxeo pensado para toda la familia y la comunidad."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative min-h-[420px] overflow-hidden rounded-3xl border-[3px] border-brand/40 sm:min-h-[500px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <item.icon className="mb-5 size-6 text-brand" />
                  <h2 className="font-display text-3xl font-semibold uppercase text-white">{item.title}</h2>
                  <p className="mt-2 text-base leading-relaxed text-zinc-300">{item.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white group-hover:text-brand">
                    Explorar <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div id="metodo" className="scroll-mt-24">
        <TrainingMethodSection ctaHref="/planes#clases" ctaLabel="Ver clases y horarios" />
      </div>

      <BoxingBenefitsSection />

      <section id="membresias" className="border-t border-brand/15 bg-[#0a0a0a] py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Membresías"
            title={'PLANES ABIERTOS\nA *TODO PÚBLICO.*'}
            description="Estructurados por nivel de beneficios. Sin restricciones familiares: ideal para niños, jóvenes y adultos."
          />
          <div className="mt-16">
            <MembershipCards />
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/planes"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand hover:text-brand-light"
            >
              Ver detalle completo <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-brand/15 bg-[#0a0a0a] py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <FadeUp>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
                  Tu cuenta Villanova
                </p>
              </FadeUp>
              <AnimatedTitle
                as="h2"
                title={'Tu entrenamiento,\n*siempre a la mano.*'}
                className="mt-4 font-display text-4xl font-semibold leading-none text-white sm:text-5xl"
              />
              <FadeUp delay={0.2}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
                  Desde tu celular ves tu plan, la clase de hoy, los retos del mes y la tienda
                  oficial. Sin complicaciones: entras, entrenas y sigues tu progreso.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/app/login"
                    className="inline-flex max-w-full rounded-full bg-brand px-5 py-3.5 text-center text-[11px] font-black uppercase leading-snug tracking-wider text-black hover:bg-brand-light sm:px-6 sm:py-4 sm:text-xs"
                  >
                    <span className="sm:hidden">Acceso Alumnos</span>
                    <span className="hidden sm:inline">Iniciar Sesión / Acceso Alumnos</span>
                  </Link>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.15}>
              <div className="relative overflow-hidden rounded-3xl border-[3px] border-brand/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryPhotos[2].src}
                  alt="Socio Villanova consultando su entrenamiento"
                  className="aspect-[4/5] w-full object-cover sm:aspect-[16/11] lg:aspect-[5/4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 sm:p-8">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-light">
                    Qué puedes hacer
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Revisar si tu membresía está al día',
                      'Ver la clase de hoy y qué vas a entrenar',
                      'Unirte a retos del mes y medir tu constancia',
                      'Comprar playeras, guantes y merch oficial',
                    ].map((item, index) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white sm:text-base">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-[10px] font-bold text-black">
                          {index + 1}
                        </span>
                        <span className="leading-snug text-zinc-100">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <CommunityImpactSection />

      <section className="bg-black py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Comunidad en acción"
              title={'*SESIONES*\nQUE SE SIENTEN.'}
              description="Fotos reales de clases de 60 minutos: costales, mitts y la energía Villanova."
            />
            <Link
              href="/planes"
              className="inline-flex h-fit shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-4 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
            >
              Empieza tu cambio <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <TransformationsCarousel />
      </section>

      <ReviewsSection />
      <ContactCta />
    </>
  );
}
