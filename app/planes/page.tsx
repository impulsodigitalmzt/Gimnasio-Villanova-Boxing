import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import { ChallengesShowcase } from '@/components/challenges-showcase';
import { ClassesScheduleSection } from '@/components/classes-schedule-section';
import { ContactCta } from '@/components/contact-cta';
import { MembershipCards } from '@/components/membership-cards';
import { OfferSubnav } from '@/components/offer-subnav';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { TrainingMethodSection } from '@/components/training-method-section';
import { BoxingBenefitsSection } from '@/components/boxing-benefits-section';
import { otherRates } from '@/lib/site-data';
import { galleryPhotos, healthyEnvironmentPhoto } from '@/lib/media';

export default function PlanesPage() {
  return (
    <>
      <PageHero
        eyebrow="Planes Villanova"
        title={'60 MINUTOS.\n*MÁXIMO IMPACTO.*'}
        description="Clases de boxeo + funcional para quemar grasa, construir músculo y subir de nivel. Elige membresía, visita o reto — abierto a todos los niveles."
        image={galleryPhotos[7].src}
        primaryHref="#membresias"
        primaryLabel="Ver planes"
      />

      <OfferSubnav />

      <TrainingMethodSection
        ctaHref="#clases"
        ctaLabel="Ver horarios"
        showImage={false}
      />

      <BoxingBenefitsSection />

      <section id="membresias" className="scroll-mt-28 bg-black py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-10 grid gap-4 overflow-hidden rounded-2xl border-[3px] border-brand/40 bg-gradient-to-r from-brand/15 via-brand/5 to-transparent sm:grid-cols-[200px_1fr]">
            <figure className="relative min-h-[140px] overflow-hidden sm:min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={healthyEnvironmentPhoto}
                alt="Ambiente sano Villanova Boxing"
                className="absolute inset-0 size-full object-cover"
              />
            </figure>
            <div className="flex items-start gap-4 px-5 py-4 sm:px-6">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-light">
                  Ambiente sano e inclusivo
                </p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-200 sm:text-base">
                  Individual ($650), Dúo ($1,100 / 2 personas) y Grupal ($1,800 / hasta 4). Cada plan
                  suma más beneficios: clases guiadas, retos, seguimiento de avances y eventos de la comunidad.
                </p>
              </div>
            </div>
          </div>

          <SectionHeading
            eyebrow="Membresías"
            title="BENEFICIOS POR *NIVEL.*"
            description="Precios en pesos mexicanos. Abierto a todo público sin importar vínculos familiares."
          />
          <div className="mt-16">
            <MembershipCards />
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border-[3px] border-brand/40 bg-[#111111] px-6 py-5 sm:flex-row">
            <div>
              <p className="text-sm font-bold text-white">¿Ya eres miembro Villanova?</p>
              <p className="mt-1 text-xs text-zinc-400">Renueva o gestiona tu plan desde el portal.</p>
            </div>
            <Link
              href="/app/login"
              className="inline-flex rounded-full bg-brand px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
            >
              Entrar al portal
            </Link>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
            <SectionHeading
              eyebrow="Más opciones"
              title={'VISITAS Y\n*PRUEBAS.*'}
              description="Si aún no eliges membresía mensual, puedes empezar con visita o semana de prueba."
            />
            <div className="overflow-hidden rounded-3xl border-[3px] border-brand/45 bg-[#111111]">
              <div className="flex items-center justify-between bg-gradient-to-r from-brand to-brand-dark px-7 py-5">
                <h3 className="font-display text-xl uppercase text-black">Costos cortos</h3>
                <span className="bg-black/20 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-black">
                  MXN
                </span>
              </div>
              {otherRates.map((rate) => (
                <div
                  key={rate.id}
                  className="flex items-center justify-between border-t border-white/10 px-7 py-5"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                    {rate.label}
                  </span>
                  <span className="font-mono text-xl font-bold text-white">
                    ${rate.price.toLocaleString('es-MX')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <SectionHeading
              eyebrow="Plan Grupal / Comunidad"
              title={'HASTA 4 PERSONAS,\n*SIN RESTRICCIONES.*'}
              description="Amigos, compañeros o familia: $1,800 MXN incluye hasta 4 integrantes, horarios por nivel y prioridad en torneos recreativos."
            />
            <figure className="overflow-hidden rounded-3xl border-[3px] border-brand/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={healthyEnvironmentPhoto}
                alt="Ambiente sano Villanova Boxing"
                className="w-full"
              />
            </figure>
          </div>
        </div>
      </section>

      <ClassesScheduleSection />
      <ChallengesShowcase />
      <ContactCta />
    </>
  );
}
