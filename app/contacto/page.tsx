'use client';

import { useState } from 'react';
import { Check, Clock3, Facebook, Instagram, MapPin, MessageCircle, Phone, Send, X } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { SOCIAL } from '@/components/social-links';
import { galleryPhotos, healthyEnvironmentPhoto } from '@/lib/media';
import { gymHours } from '@/lib/site-data';

type Panel = 'chat' | 'phone' | null;

export default function ContactPage() {
  const [panel, setPanel] = useState<Panel>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setMessages((current) => [...current, message.trim()]);
    setMessage('');
  }

  return (
    <>
      <PageHero
        eyebrow="Hablemos"
        title={'TU SIGUIENTE PASO\n*EMPIEZA AQUÍ.*'}
        description="Cuéntanos qué buscas: membresía Individual, Dúo o Comunidad, clases para niños/jóvenes/adultos, o una visita al gym."
        image={healthyEnvironmentPhoto}
        imagePosition="center 30%"
        primaryHref="#contacto"
        primaryLabel="Enviar consulta"
      />

      <section id="contacto" className="bg-black py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
              Contacto directo
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold uppercase leading-none text-white">
              Estamos listos para <span className="text-gradient-brand">ayudarte.</span>
            </h2>
            <div className="mt-10 space-y-4">
              <ContactItem
                icon={MessageCircle}
                title="WhatsApp"
                text="Escríbenos para agendar visita"
                onClick={() => setPanel('chat')}
              />
              <ContactItem
                icon={Phone}
                title="Teléfono"
                text="Llámanos al gym"
                onClick={() => setPanel('phone')}
              />
              <ContactItem
                icon={Facebook}
                title="Facebook"
                text="Villanova Boxing"
                href={SOCIAL.facebook}
              />
              <ContactItem
                icon={Instagram}
                title="Instagram"
                text="@villanovaboxing"
                href={SOCIAL.instagram}
              />
              <ContactItem
                icon={MapPin}
                title="Ubicación"
                text="Villanova Boxing Gym · Mazatlán"
                href="#ubicacion"
              />
              <ContactItem
                icon={Clock3}
                title="Horario"
                text={`${gymHours.weekday} · ${gymHours.saturday} · ${gymHours.sunday}`}
              />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              {[galleryPhotos[3].src, galleryPhotos[7].src].map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt="Villanova Boxing"
                  className="aspect-[4/5] w-full rounded-2xl object-cover border-[3px] border-brand/40"
                />
              ))}
            </div>
          </div>

          <form
            onSubmit={submitContact}
            className="rounded-3xl border-[3px] border-brand/40 bg-[#111111] p-7 sm:p-10"
          >
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="size-8" />
                </span>
                <h2 className="mt-6 font-display text-3xl font-semibold uppercase text-white">
                  Solicitud recibida
                </h2>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-zinc-400">
                  Gracias. El equipo Villanova revisará tu mensaje y te contactará pronto.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-7 rounded-full border border-brand/35 px-6 py-3 text-xs font-bold text-white hover:border-brand"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <>
                <p className="font-display text-2xl font-semibold uppercase text-white">
                  Solicita información
                </p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field label="Nombre" required />
                  <Field label="Teléfono" type="tel" required />
                  <Field label="Correo" type="email" required />
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-zinc-300">Me interesa</span>
                    <select className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-4 text-sm text-white outline-none focus:border-brand">
                      <option>Plan Individual ($650)</option>
                      <option>Plan Dúo ($1,100)</option>
                      <option>Plan Grupal ($1,800)</option>
                      <option>Clases / visita</option>
                      <option>Retos y rutinas</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-semibold text-zinc-300">Mensaje</span>
                    <textarea
                      rows={4}
                      className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-4 text-sm text-white outline-none focus:border-brand"
                      placeholder="Cuéntanos edad, nivel o si vienes con familia/amigos…"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-8 w-full bg-brand py-4 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
                >
                  Enviar consulta
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      <section id="ubicacion" className="scroll-mt-24 border-t border-brand/15 bg-[#090909] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
              Ubicación
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold uppercase leading-none text-white sm:text-4xl">
              Cómo llegar a <span className="text-gradient-brand">Villanova Boxing</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Encuéntranos en el mapa, abre la ruta en Google Maps y visita el gym en Mazatlán,
              Sinaloa.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_.85fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl border-[3px] border-brand/40 bg-[#111111]">
              <iframe
                title="Mapa de Villanova Boxing en Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.3856281767935!2d-106.46767132496518!3d23.265433607222096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8698ab112a158e97%3A0xdde6ba9d83f5448e!2sVillanova%20Boxing!5e0!3m2!1ses-419!2smx!4v1785345705064!5m2!1ses-419!2smx"
                className="h-[320px] w-full border-0 sm:h-[420px] lg:h-[480px]"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <aside className="space-y-5 rounded-3xl border-[3px] border-brand/40 bg-[#111111] p-6 sm:p-8">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  Dirección
                </p>
                <p className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-zinc-300">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    <span className="block font-semibold text-white">Villanova Boxing Gym</span>
                    Mazatlán, Sinaloa, México
                  </span>
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  Cómo llegar
                </p>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-400">
                  <li>
                    Usa Google Maps y busca <strong className="text-white">Villanova Boxing</strong>.
                  </li>
                  <li>Activa la navegación en auto, moto o transporte para la ruta más corta.</li>
                  <li>Al llegar, pregunta por recepción para tu visita o clase de prueba.</li>
                  <li>
                    Horario: {gymHours.weekday} · {gymHours.saturday} · {gymHours.sunday}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Villanova+Boxing&destination_place_id=ChIJl44VKxGruIYRjkT1g5265t0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
                >
                  <MapPin className="size-4" /> Cómo llegar en Maps
                </a>
                <a
                  href="https://www.google.com/maps/place/Villanova+Boxing/@23.2654336,-106.4676713,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/40 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:border-brand hover:bg-brand/10"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {panel ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl border-[3px] border-brand/40 bg-[#111111] p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl font-semibold uppercase text-white">
                {panel === 'chat' ? 'WhatsApp' : 'Llamada'}
              </p>
              <button type="button" onClick={() => setPanel(null)} aria-label="Cerrar">
                <X className="size-5 text-zinc-400" />
              </button>
            </div>
            {panel === 'chat' ? (
              <form onSubmit={sendMessage} className="space-y-3">
                <div className="max-h-48 space-y-2 overflow-y-auto text-sm text-zinc-300">
                  {messages.length === 0 ? (
                    <p className="text-zinc-500">Escribe tu mensaje.</p>
                  ) : (
                    messages.map((m) => (
                      <p key={m} className="bg-brand/10 px-3 py-2 text-brand-light">
                        {m}
                      </p>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 rounded-xl border border-white/20 bg-black px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <button type="submit" className="bg-brand px-3 text-black">
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-zinc-400">
                Estamos marcando al 669 158 7875. Si no te contestan, vuelve a intentar o escríbenos por
                WhatsApp.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ContactItem({
  icon: Icon,
  title,
  text,
  onClick,
  href,
}: {
  icon: typeof Phone;
  title: string;
  text: string;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    'flex w-full items-start gap-4 rounded-2xl border-[3px] border-brand/30 bg-[#111111] px-4 py-4 text-left transition hover:border-brand/55';

  const content = (
    <>
      <Icon className="mt-0.5 size-5 shrink-0 text-brand" />
      <span>
        <span className="block text-sm font-bold text-white">{title}</span>
        <span className="mt-1 block text-sm text-zinc-400">{text}</span>
      </span>
    </>
  );

  if (href) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={className}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

function Field({
  label,
  type = 'text',
  required,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-zinc-300">{label}</span>
      <input
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-4 text-sm text-white outline-none focus:border-brand"
      />
    </label>
  );
}
