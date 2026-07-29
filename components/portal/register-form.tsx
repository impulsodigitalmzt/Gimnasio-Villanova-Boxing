'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2 } from 'lucide-react';
import { PlanPicker } from '@/components/portal/plan-picker';
import { useSignupFlow } from '@/components/portal/signup-context';

export function RegisterForm() {
  const router = useRouter();
  const {
    selectedPlanId,
    setSelectedPlanId,
    checkoutAmount,
    registerAndGoToCheckout,
  } = useSignupFlow();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get('plan');
    if (plan === 'individual' || plan === 'duo' || plan === 'grupal') {
      setSelectedPlanId(plan);
    }
  }, [setSelectedPlanId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payUrl = await registerAndGoToCheckout({ name, email, password, phone });
      router.push(payUrl);
      router.refresh();
    } catch {
      setError('No se pudo completar el registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <p className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-xs leading-relaxed text-zinc-300">
        Primero creas tu cuenta (nombre, correo y WhatsApp). Después pasas al pago para activar tu
        membresía y entrar al seguimiento del gym.
      </p>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-zinc-300">Nombre completo</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-zinc-300">Correo</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-zinc-300">WhatsApp</span>
        <input
          type="tel"
          required
          inputMode="tel"
          placeholder="669 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-zinc-300">Contraseña</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
        />
      </label>

      <div className="pt-2">
        <PlanPicker value={selectedPlanId} onChange={setSelectedPlanId} />
      </div>

      <div className="rounded-2xl border-[3px] border-zinc-500 bg-black/40 px-4 py-3 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Plan</span>
          <span className="text-white">${checkoutAmount.planPrice.toLocaleString('es-MX')}</span>
        </div>
        {checkoutAmount.enrollment > 0 ? (
          <div className="mt-1 flex justify-between text-zinc-400">
            <span>Inscripción</span>
            <span className="text-white">${checkoutAmount.enrollment.toLocaleString('es-MX')}</span>
          </div>
        ) : null}
        <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-bold text-white">
          <span>Total hoy</span>
          <span className="text-[var(--portal-brand-light)]">
            ${checkoutAmount.total.toLocaleString('es-MX')} MXN
          </span>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-300">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--portal-brand)] py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)] disabled:opacity-70"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
        Crear cuenta y pagar
      </button>
    </form>
  );
}
