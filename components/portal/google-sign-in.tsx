'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2, X } from 'lucide-react';
import {
  GOOGLE_CLIENT_ID,
  accountFromGoogleCredential,
  avatarColorForEmail,
  completeMemberBrowserSession,
  destinationAfterAuth,
  knownGoogleAccounts,
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

type GoogleIdentityServices = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: 'standard' | 'icon';
          theme?: 'outline' | 'filled_blue' | 'filled_black';
          size?: 'small' | 'medium' | 'large';
          text?: 'signin_with' | 'signup_with' | 'continue_with';
          shape?: 'rectangular' | 'pill';
          logo_alignment?: 'left' | 'center';
          width?: number;
          locale?: string;
        },
      ) => void;
      prompt: () => void;
    };
  };
};

const GSI_SRC = 'https://accounts.google.com/gsi/client';

function loadGoogleScript() {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('gsi')), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('gsi'));
    document.head.appendChild(script);
  });
}

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
  const [busy, setBusy] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<GoogleAccountOption[]>([]);
  const [manual, setManual] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gsiReady, setGsiReady] = useState(false);
  const [gsiFailed, setGsiFailed] = useState(false);
  const gsiButtonRef = useRef<HTMLDivElement>(null);

  const finishWithAccount = useCallback(
    async (account: GoogleAccountOption) => {
      setBusy(account.id);
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
        setBusy(null);
      }
    },
    [next, onError, onSuccess, planId],
  );

  // Google Identity Services real: usa las cuentas activas del navegador.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    const setup = async () => {
      try {
        await loadGoogleScript();
        if (cancelled) return;

        const google = (window as unknown as { google?: GoogleIdentityServices }).google;
        if (!google) return;

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: true,
          callback: ({ credential }) => {
            const account = credential ? accountFromGoogleCredential(credential) : null;
            if (!account) {
              onError?.('No se pudo leer tu cuenta de Google. Intenta de nuevo.');
              return;
            }
            void finishWithAccount(account);
          },
        });

        if (gsiButtonRef.current) {
          google.accounts.id.renderButton(gsiButtonRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'center',
            locale: 'es',
            width: Math.min(gsiButtonRef.current.offsetWidth || 320, 400),
          });
        }
        setGsiReady(true);
      } catch {
        setGsiFailed(true);
      }
    };

    void setup();

    // Si Google no dibuja su botón, se habilita el acceso alterno.
    const guard = window.setTimeout(() => {
      if (!cancelled && !gsiButtonRef.current?.childElementCount) setGsiFailed(true);
    }, 3500);

    return () => {
      cancelled = true;
      window.clearTimeout(guard);
    };
  }, [finishWithAccount, onError]);

  function openChooser() {
    const known = knownGoogleAccounts();
    setAccounts(known);
    setManual(known.length === 0);
    setEmail('');
    setName('');
    setOpen(true);
  }

  function onManualSubmit(event: FormEvent) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    if (!cleanEmail) return;

    void finishWithAccount({
      id: cleanEmail,
      name: cleanName,
      email: cleanEmail,
      avatarColor: avatarColorForEmail(cleanEmail),
    });
  }

  return (
    <>
      {GOOGLE_CLIENT_ID ? (
        <div className="space-y-2">
          <div ref={gsiButtonRef} className="flex justify-center [&>div]:!w-full" />
          {!gsiReady && !gsiFailed ? (
            <p className="text-center text-[11px] text-zinc-500">Cargando acceso con Google…</p>
          ) : null}
          {gsiFailed ? (
            <button
              type="button"
              onClick={openChooser}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white py-3.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
            >
              <GoogleLogo className="size-5" />
              Continuar con Google
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={openChooser}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white py-3.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
        >
          <GoogleLogo className="size-5" />
          Continuar con Google
        </button>
      )}

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
                  <p className="text-sm font-medium text-zinc-500">Continuar con Google</p>
                </div>
                <h2 id="google-auth-title" className="mt-3 text-xl font-normal text-zinc-900">
                  {manual ? 'Usa tu cuenta' : 'Elige una cuenta'}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  para continuar a{' '}
                  <span className="font-medium text-zinc-800">Villanova Boxing</span>
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

            {manual ? (
              <form onSubmit={onManualSubmit} className="px-5 py-5">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-zinc-600">
                    Correo de tu cuenta de Google
                  </span>
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tucuenta@gmail.com"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none focus:border-[#1a73e8]"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="mb-1.5 block text-xs font-semibold text-zinc-600">
                    Tu nombre
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nombre y apellido"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none focus:border-[#1a73e8]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={Boolean(busy)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1765cc] disabled:opacity-60"
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  Continuar
                </button>

                {accounts.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setManual(false)}
                    className="mt-4 text-sm font-medium text-[#1a73e8] hover:underline"
                  >
                    Ver mis cuentas guardadas
                  </button>
                ) : null}
              </form>
            ) : (
              <>
                <ul className="divide-y divide-zinc-100">
                  {accounts.map((account) => (
                    <li key={account.id}>
                      <button
                        type="button"
                        disabled={Boolean(busy)}
                        onClick={() => void finishWithAccount(account)}
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
                          <span className="block truncate text-sm text-zinc-500">
                            {account.email}
                          </span>
                        </span>
                        {busy === account.id ? (
                          <Loader2 className="size-4 animate-spin text-zinc-400" />
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-zinc-100 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setManual(true)}
                    className="text-sm font-medium text-[#1a73e8] hover:underline"
                  >
                    Usar otra cuenta
                  </button>
                  <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">
                    Al continuar, Villanova Boxing podrá usar tu nombre y correo para crear tu
                    perfil de alumno y mantenerte conectado en este dispositivo.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
