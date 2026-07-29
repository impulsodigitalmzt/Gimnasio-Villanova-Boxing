import { Clock3, Dumbbell, Shield, Users } from 'lucide-react';
import { ContactCta } from '@/components/contact-cta';
import { CoachingTeamSection } from '@/components/coaching-team-section';
import { PageHero } from '@/components/page-hero';
import { ReelCard } from '@/components/reel-card';
import { SectionHeading } from '@/components/section-heading';
import { facilityPhotos, galleryPhotos, reels } from '@/lib/media';

type GalleryItem = {
  src: string;
  tag: string;
  title: string;
  copy: string;
  kind: 'image' | 'video';
};

const isCostalesCopy = (text: string) => /costal|saco/i.test(text);

const gallery: GalleryItem[] = [
  ...galleryPhotos.map((photo) => {
    const costales = isCostalesCopy(`${photo.title} ${photo.copy}`);
    return {
      ...photo,
      kind: costales ? ('video' as const) : ('image' as const),
      src: costales ? reels.bags : photo.src,
    };
  }),
  {
    src: facilityPhotos[0],
    tag: 'Instalaciones',
    title: 'Espacio de entrenamiento',
    copy: 'Áreas organizadas para costales, acondicionamiento y clases.',
    kind: 'image',
  },
  {
    src: facilityPhotos[1],
    tag: 'Ambiente',
    title: 'Energía del gym',
    copy: 'Un entorno profesional pensado para concentrarte y progresar.',
    kind: 'image',
  },
  {
    src: facilityPhotos[2],
    tag: 'Comunidad',
    title: 'Entrenamiento compartido',
    copy: 'Niños, jóvenes y adultos compartiendo disciplina y respeto.',
    kind: 'image',
  },
];

const amenities = [
  { icon: Dumbbell, title: 'Costales y sacos', copy: 'Área ilimitada de golpeo y acondicionamiento.' },
  { icon: Shield, title: 'Ambiente seguro', copy: 'Espacio sano e inclusivo para todas las edades.' },
  { icon: Users, title: 'Coaches certificados', copy: 'Equipo profesional con formación, primeros auxilios y licencia de box.' },
  { icon: Clock3, title: 'Horarios por nivel', copy: 'Clases adaptadas por edad y técnica.' },
];

export default function GymPage() {
  return (
    <>
      <PageHero
        eyebrow="Instalaciones Villanova"
        title={'UN GYM HECHO\nPARA EL *BOXEO.*'}
        description="Ring, costales, mitts y acondicionamiento: cada zona pensada para que entrenes con intención y progreses con seguridad."
        image={galleryPhotos[5].src}
        primaryHref="/contacto"
        primaryLabel="Agenda una visita"
      />

      <section className="bg-black py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Dentro de Villanova"
            title={'CONOCE TU NUEVO\n*RING.*'}
            description="Videos reales de nuestras instalaciones y sesiones de entrenamiento."
          />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ReelCard
              src={reels.bags}
              title="Costales"
              subtitle="Potencia y ritmo"
              className="min-h-[480px] sm:col-span-2 sm:row-span-2 sm:min-h-0"
            />
            <ReelCard
              src={reels.tour}
              title="Recorre el gym"
              subtitle="Tour Villanova"
              className="aspect-[9/16]"
            />
            <ReelCard
              src={reels.equipment}
              title="Equipamiento en acción"
              subtitle="Costales · air bike · plataformas"
              className="aspect-[9/16]"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-brand/15 bg-[#0b0b0b] py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Galería"
            title={'ASÍ SE VE\n*ENTRENAR AQUÍ.*'}
            description="Un recorrido visual por clases, instalaciones y la comunidad Villanova."
          />

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <figure
                key={`${item.kind}-${item.title}-${index}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40 bg-[#111111]"
              >
                {item.kind === 'video' ? (
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand-light">
                    {item.tag}
                  </p>
                  <h3 className="font-display text-xl font-semibold uppercase leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-300">{item.copy}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand/15 bg-[#090909] py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map((item) => (
              <article key={item.title} className="rounded-3xl border-[3px] border-brand/40 bg-[#090909] p-8">
                <item.icon className="size-6 text-brand" />
                <h3 className="mt-8 font-display text-xl font-semibold uppercase text-white">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-500">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CoachingTeamSection />
      <ContactCta />
    </>
  );
}
