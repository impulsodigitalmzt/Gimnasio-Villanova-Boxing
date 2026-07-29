'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, LockKeyhole, Mail } from 'lucide-react';
import { GoogleSignInButton } from '@/components/portal/google-sign-in';
import { loginFromLocalStorage } from '@/lib/portal/auth-session';
import {
  completeMemberBrowserSession,
  destinationAfterAuth,
} from '@/lib/portal/google-auth';
import { getUserByEmail, loadUsers } from '@/lib/portal/users';
import '@/app/app/portal.css';

function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/app';
  const planId = searchParams.get('plan');

  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      loadUsers();

      const existing = getUserByEmail(email);
      if (!existing) {
        setError('Este correo no está registrado. Continúa con Google o crea tu cuenta.');
        return;
      }

      const user = loginFromLocalStorage(email, password);
      if (!user) {
        setError('Contraseña incorrecta.');
        return;
      }

      await completeMemberBrowserSession(user);
      router.push(destinationAfterAuth(user, { planId, next }));
      router.refresh();
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-app flex min-h-dvh items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)] p-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.png" alt="Villanova" className="mx-auto size-14 object-contain" />
        <p className="mt-5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--portal-brand-light)]">
          Acceso alumnos
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-black uppercase text-white">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Entra con Google o con tu correo. Quedas conectado en este dispositivo.
        </p>

        <div className="mt-8 space-y-3">
          <GoogleSignInButton
            planId={planId}
            next={next}
            onSuccess={(href) => {
              router.push(href);
              router.refresh();
            }}
            onError={setError}
          />

          <button
            type="button"
            onClick={() => setEmailMode((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[var(--portal-brand)]"
          >
            <Mail className="size-4" />
            {emailMode ? 'Ocultar correo' : 'Continuar con correo'}
          </button>
        </div>

        {emailMode ? (
          <form onSubmit={onSubmit} className="mt-6 border-t border-white/10 pt-6">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-zinc-300">Correo</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-semibold text-zinc-300">Contraseña</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--portal-brand)] py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)] disabled:opacity-70"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
              Entrar
            </button>
          </form>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-300">{error}</p>
        ) : null}

        <p className="mt-6 text-center text-xs text-zinc-500">
          ¿Prefieres registrarte con datos manuales?{' '}
          <Link
            href={`/app/registro${planId ? `?plan=${planId}` : ''}`}
            className="font-semibold text-[var(--portal-brand-light)] hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={<div className="portal-app min-h-dvh" />}>
      <MemberLoginForm />
    </Suspense>
  );
}
