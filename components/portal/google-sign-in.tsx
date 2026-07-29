'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import {
  GOOGLE_ACCOUNT_OPTIONS,
  completeMemberBrowserSession,
  destinationAfterAuth,
  memberInitials,
  signInWithGoogleAccount,
  type GoogleAccountOption,
} from '@/lib/portal/google-auth';

type GoogleSignInButtonProps = {
  planId?: string | null;
  next?: string | null;
  onSuccess?: (href: string) => void;
  onError?: (message: string) => void;
};

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  planId,
  next,
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function chooseAccount(account: GoogleAccountOption) {
    setLoadingId(account.id);
    try {
      const { user } = signInWithGoogleAccount(account, {
        planId: planId || undefined,
      });
      await completeMemberBrowserSession(user);
      const href = destinationAfterAuth(user, { planId, next });
      setOpen(false);
      onSuccess?.(href);
    } catch {
      onError?.('No se pudo continuar con Google. Intenta de nuevo.');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white py-3.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
      >
        <GoogleLogo className="size-5" />
        Continuar con Google
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="google-auth-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <GoogleLogo className="size-5" />
                  <p className="text-sm font-medium text-zinc-500">Iniciar sesión con Google</p>
                </div>
                <h2
                  id="google-auth-title"
                  className="mt-3 text-xl font-normal text-zinc-900"
                >
                  Elige una cuenta
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  para continuar a <span className="font-medium text-zinc-800">Villanova Boxing</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Cerrar"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="divide-y divide-zinc-100">
              {GOOGLE_ACCOUNT_OPTIONS.map((account) => (
                <li key={account.id}>
                  <button
                    type="button"
                    disabled={Boolean(loadingId)}
                    onClick={() => void chooseAccount(account)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-zinc-50 disabled:opacity-60"
                  >
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: account.avatarColor }}
                    >
                      {memberInitials(account.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-900">
                        {account.name}
                      </span>
                      <span className="block truncate text-sm text-zinc-500">{account.email}</span>
                    </span>
                    {loadingId === account.id ? (
                      <Loader2 className="size-4 animate-spin text-zinc-400" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-zinc-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#1a73e8] hover:underline"
              >
                Usar otra cuenta
              </button>
              <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">
                Al continuar, Villanova Boxing podrá usar tu nombre y correo para crear tu perfil de
                alumno y mantenerte conectado en este dispositivo.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
