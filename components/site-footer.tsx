import Link from 'next/link';
import { Clock3, Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from './brand-logo';
import { SOCIAL, SocialLinks } from './social-links';
import { gymHours } from '@/lib/site-data';

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-brand/20 bg-black">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-5">
          <BrandLogo />
          <p className="text-sm leading-relaxed text-zinc-500">
            Gimnasio de boxeo abierto a todo público: niños, jóvenes y adultos en un ambiente sano,
            inclusivo y profesional.
          </p>
          <div className="pt-1">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand">
              Redes Sociales
            </p>
            <SocialLinks iconClassName="size-4" />
          </div>
        </div>

        <div>
          <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand">Explora</p>
          <div className="grid gap-3 text-sm text-zinc-400">
            <Link href="/quien-soy" className="hover:text-white">Quién soy</Link>
            <Link href="/gimnasio" className="hover:text-white">Instalaciones</Link>
            <Link href="/planes" className="hover:text-white">Planes</Link>
            <Link href="/planes#clases" className="hover:text-white">Clases</Link>
            <Link href="/planes#membresias" className="hover:text-white">Membresías</Link>
            <Link href="/planes#retos" className="hover:text-white">Retos</Link>
            <Link href="/eventos" className="hover:text-white">Eventos</Link>
            <Link href="/tienda" className="hover:text-white">Tienda</Link>
            <Link href="/admin" className="hover:text-white">Administración</Link>
          </div>
        </div>

        <div>
          <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand">Encuéntranos</p>
          <div className="space-y-4 text-sm text-zinc-400">
            <p className="flex gap-3"><MapPin className="size-4 shrink-0 text-brand" /> Villanova Boxing Gym</p>
            <p className="flex gap-3"><Clock3 className="size-4 shrink-0 text-brand" /> {gymHours.short}</p>
            <Link href="/contacto" className="flex gap-3 hover:text-white">
              <Phone className="size-4 text-brand" /> Contacto
            </Link>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 hover:text-white"
            >
              <Facebook className="size-4 text-brand" /> Facebook
            </a>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 hover:text-white"
            >
              <Instagram className="size-4 text-brand" /> @villanovaboxing
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-brand/10 px-5 py-6 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        © {new Date().getFullYear()} Villanova Boxing · Sitio oficial
      </div>
    </footer>
  );
}
