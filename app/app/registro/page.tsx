'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RegisterForm } from '@/components/portal/register-form';
import { GoogleSignInButton } from '@/components/portal/google-sign-in';
import { SignupProvider } from '@/components/portal/signup-context';
import '@/app/app/portal.css';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  return (
    <div className="mx-auto w-full max-w-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-white.png" alt="Villanova" className="mx-auto size-14 object-contain" />
      <p className="mt-5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--portal-brand-light)]">
        Crear cuenta
      </p>
      <h1 className="mt-2 text-center font-display text-3xl font-black uppercase text-white">
        Acceso alumnos
      </h1>
      <p className="mt-2 text-center text-sm text-zinc-400">
        Continúa con Google o completa tus datos. Luego eliges y pagas tu plan.
      </p>

      <div className="mt-8">
        <GoogleSignInButton
          planId={planId}
          onSuccess={(href) => {
            router.push(href);
            router.refresh();
          }}
        />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">o con correo</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <RegisterForm />

      <Link
        href={`/app/login${planId ? `?plan=${planId}` : ''}`}
        className="mt-5 block text-center text-xs font-bold text-zinc-500 hover:text-white"
      >
        Ya tengo cuenta · Iniciar sesión
      </Link>
    </div>
  );
}

export default function MemberRegisterPage() {
  return (
    <SignupProvider>
      <div className="portal-app min-h-dvh px-5 py-10">
        <Suspense fallback={<div className="mx-auto max-w-md py-20 text-center text-zinc-500">Cargando…</div>}>
          <RegisterContent />
        </Suspense>
      </div>
    </SignupProvider>
  );
}
