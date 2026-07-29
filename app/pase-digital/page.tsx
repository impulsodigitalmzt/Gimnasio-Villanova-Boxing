'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { DigitalPassCard } from '@/components/digital-pass-card';
import { PageHero } from '@/components/page-hero';
import {
  clearDigitalPass,
  createDigitalPass,
  loadDigitalPass,
  planLabels,
  saveDigitalPass,
  type DigitalPass,
} from '@/lib/digital-pass';

export default function DigitalPassPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState(() => {
    if (typeof window === 'undefined') return 'individual';
    const queryPlan = new URLSearchParams(window.location.search).get('plan');
    return queryPlan && planLabels[queryPlan] ? queryPlan : 'individual';
  });
  const [pass, setPass] = useState<DigitalPass | null>(() => loadDigitalPass());

  function createPass(event: React.FormEvent) {
    event.preventDefault();
    const nextPass = createDigitalPass({
      name,
      email,
      planId: plan,
      memberId: pass?.memberId,
    });
    saveDigitalPass(nextPass);
    setPass(nextPass);
  }

  function removePass() {
    clearDigitalPass();
    setPass(null);
  }

  return (
    <>
      <PageHero
        eyebrow="Tu acceso Villanova"
        title={'TU MEMBRESÍA.\n*SIEMPRE CONTIGO.*'}
        description="Activa tu pase digital y lleva los datos de tu membresía siempre contigo."
        image="/foto/700692238_18091330523252708_5158142353939480374_n.jpg"
        imagePosition="center 22%"
        primaryHref="#crear-pase"
        primaryLabel="Crear mi pase"
      />

      <section id="crear-pase" className="bg-black py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <form onSubmit={createPass} className="rounded-3xl border-[3px] border-zinc-500 bg-[#141414] p-7 sm:p-9">
            <CreditCard className="size-7 text-brand" />
            <h2 className="mt-5 font-display text-3xl font-black uppercase text-white">Datos de miembro</h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-500">
              Completa tus datos para generar tu credencial de acceso personalizada.
            </p>
            <div className="mt-8 space-y-5">
              <Field label="Nombre completo" value={name} onChange={setName} />
              <Field label="Correo electrónico" value={email} onChange={setEmail} type="email" />
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-zinc-300">Membresía</span>
                <select
                  value={plan}
                  onChange={(event) => setPlan(event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-4 text-sm text-white outline-none transition-colors hover:border-white/50 focus:border-brand"
                >
                  {Object.entries(planLabels).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="mt-8 w-full rounded-xl bg-brand py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark">
              Generar pase
            </button>
            <Link
              href="/app/registro"
              className="mt-4 flex w-full justify-center rounded-xl border border-white/20 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-brand hover:bg-brand/10"
            >
              Contratar / renovar membresía
            </Link>
          </form>

          <div>
            {pass ? (
              <DigitalPassCard pass={pass} />
            ) : (
              <div className="mx-auto flex aspect-[1.58/1] w-full max-w-xl flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/20 bg-[#080808] text-center">
                <CreditCard className="size-10 text-zinc-700" />
                <p className="mt-5 font-display text-2xl font-black uppercase text-zinc-500">
                  Tu pase aparecerá aquí
                </p>
              </div>
            )}
            {pass && (
              <button
                type="button"
                onClick={removePass}
                className="mx-auto mt-6 flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="size-4" /> Eliminar pase guardado
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 hover:border-white/50 focus:border-brand"
        required
      />
    </label>
  );
}
