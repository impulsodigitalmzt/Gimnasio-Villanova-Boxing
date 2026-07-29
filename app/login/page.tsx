'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useRef, useState } from 'react';
import { Loader2, LockKeyhole } from 'lucide-react';

/** Credenciales del panel administrativo (prueba local). */
const DEMO_EMAIL = 'admin@villanovaboxing.mx';
const DEMO_PASSWORD = 'villanovaadmin';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';
  const autoStarted = useRef(false);

  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function login(withEmail: string, withPassword: string) {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: withEmail, password: withPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'No se pudo iniciar sesión.');
        setLoading(false);
        return;
      }

      router.push(next.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoStarted.current) return;
    autoStarted.current = true;
    void login(DEMO_EMAIL, DEMO_PASSWORD);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo auto-login demo al montar
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await login(email, password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,.18),transparent_40%),#050505] px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[1.75rem] border-[3px] border-zinc-500 bg-zinc-900 p-8 shadow-2xl"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.png" alt="Villanova Boxing" className="mx-auto size-16 object-contain" />
        <p className="mt-6 text-center font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
          Panel administrativo
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-black uppercase text-white">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Acceso exclusivo para el equipo Villanova Boxing.
        </p>

        <label className="mt-8 block">
          <span className="mb-2 block text-xs font-semibold text-zinc-300">Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-3.5 text-sm text-white outline-none focus:border-brand"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-semibold text-zinc-300">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/30 bg-zinc-800 px-4 py-3.5 text-sm text-white outline-none focus:border-brand"
          />
        </label>

        {error ? (
          <p className="mt-4 rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-300">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-brand-light disabled:opacity-70"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
          {loading ? 'Entrando…' : 'Entrar al panel'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-zinc-400">
          Cargando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
