'use client';

import { useMemo, useState } from 'react';
import { Check, Clock3, UserRound } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { groupClassPhotos } from '@/lib/media';
import { classes } from '@/lib/site-data';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function ClassesScheduleSection() {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [selectedClass, setSelectedClass] = useState<(typeof classes)[number] | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const filteredClasses = useMemo(
    () => classes.filter((item) => item.day === selectedDay),
    [selectedDay],
  );

  function reserve(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedClass || !name || !email) return;
    const reservation = { selectedClass, name, email, createdAt: new Date().toISOString() };
    const previous = JSON.parse(localStorage.getItem('villanova_bookings') ?? '[]');
    localStorage.setItem('villanova_bookings', JSON.stringify([reservation, ...previous]));
    setSuccess(true);
    setName('');
    setEmail('');
  }

  return (
    <section id="clases" className="scroll-mt-28 border-t border-brand/15 bg-black py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Clases grupales"
          title={'HORARIOS POR\n*NIVEL Y EDAD.*'}
          description="Sesiones de hasta 60 minutos con máximo impacto: técnica, costales, mitts y acondicionamiento. Reserva tu clase y entrena con supervisión."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {groupClassPhotos.map((src, index) => (
            <figure
              key={src}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl border-[3px] border-brand/40 bg-[#111111] sm:aspect-[16/10]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={index === 0 ? 'Clase grupal con coach y alumnos' : 'Sesión grupal en el gym'}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-light">
                  Clases grupales
                </p>
                <p className="mt-1 font-display text-lg uppercase text-white sm:text-xl">
                  {index === 0 ? 'Coach y comunidad' : 'Energía en el floor'}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="-mx-5 mt-10 flex gap-2 overflow-x-auto border-b border-brand/20 px-5 pb-8 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => {
                setSelectedDay(day);
                setSelectedClass(null);
                setSuccess(false);
              }}
              className={`shrink-0 rounded-full px-4 py-2.5 text-[11px] font-black uppercase tracking-wider sm:px-5 sm:py-3 sm:text-xs ${
                selectedDay === day
                  ? 'bg-brand text-black'
                  : 'border border-white/15 text-zinc-400 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_.8fr]">
          <div className="space-y-3">
            {filteredClasses.length === 0 ? (
              <p className="text-sm text-zinc-500">No hay clases programadas este día.</p>
            ) : (
              filteredClasses.map((item) => (
                <button
                  key={`${item.name}-${item.time}`}
                  type="button"
                  onClick={() => {
                    setSelectedClass(item);
                    setSuccess(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border-[3px] px-4 py-4 text-left transition sm:gap-4 sm:px-5 sm:py-5 ${
                    selectedClass?.name === item.name && selectedClass.time === item.time
                      ? 'border-brand bg-brand/10'
                      : 'border-brand/25 bg-[#111111] hover:border-brand/50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-display text-base uppercase text-white sm:text-lg">{item.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {item.type} · {item.coach} · {item.duration}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 font-mono text-sm text-brand">
                    <Clock3 className="size-4" />
                    {item.time}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="rounded-3xl border-[3px] border-brand/40 bg-[#111111] p-6">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
              Reservar clase
            </p>
            {selectedClass ? (
              <>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">{selectedClass.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {selectedDay} · {selectedClass.time} · {selectedClass.coach}
                </p>
                {success ? (
                  <div className="mt-8 flex flex-col items-center text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-brand/20 text-brand">
                      <Check className="size-6" />
                    </span>
                    <p className="mt-4 text-sm text-zinc-300">Reserva confirmada. Te esperamos en el gym.</p>
                  </div>
                ) : (
                  <form onSubmit={reserve} className="mt-6 space-y-4">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
                        <UserRound className="size-3.5" /> Nombre
                      </span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/20 bg-black px-4 py-3 text-sm text-white outline-none focus:border-brand"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs text-zinc-400">Correo</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/20 bg-black px-4 py-3 text-sm text-white outline-none focus:border-brand"
                      />
                    </label>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-brand py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light"
                    >
                      Confirmar reserva
                    </button>
                  </form>
                )}
              </>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">Selecciona una clase para reservar.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
