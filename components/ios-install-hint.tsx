'use client';

import { useEffect, useState } from 'react';
import { Share, SquarePlus, X } from 'lucide-react';

const STORAGE_KEY = 'villanova-ios-install-hint';

function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iPhoneLike = /iPad|iPhone|iPod/.test(ua);
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iPhoneLike || iPadOs;
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  const displayMode = window.matchMedia?.('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return Boolean(displayMode || iosStandalone);
}

/**
 * Safari en iPhone siempre dibuja su barra inferior sobre la web: la única forma
 * de verla a pantalla completa es agregarla a la pantalla de inicio. Este aviso
 * explica el paso una sola vez y se recuerda como descartado.
 */
export function IosInstallHint({ offsetClassName = 'bottom-4' }: { offsetClassName?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isIosDevice() || isStandalone()) return;
    if (window.localStorage.getItem(STORAGE_KEY) === 'dismissed') return;

    const timer = window.setTimeout(() => setVisible(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // Modo privado de Safari: basta con ocultarlo en esta sesión
    }
  };

  return (
    <div
      className={`fixed inset-x-3 z-[95] mx-auto max-w-md rounded-2xl border border-brand/40 bg-black/95 p-3.5 shadow-[0_18px_50px_rgba(0,0,0,.6)] backdrop-blur-xl ${offsetClassName}`}
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="dialog"
      aria-label="Instalar Villanova Boxing como app"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <SquarePlus className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black uppercase tracking-wider text-white">
            Úsala como app
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">
            Toca{' '}
            <Share className="inline size-3.5 -translate-y-px text-brand-light" aria-label="Compartir" />{' '}
            <span className="font-semibold text-white">Compartir</span> y elige{' '}
            <span className="font-semibold text-white">Agregar a pantalla de inicio</span>. Se abre
            a pantalla completa, sin la barra de Safari.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Cerrar aviso"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
