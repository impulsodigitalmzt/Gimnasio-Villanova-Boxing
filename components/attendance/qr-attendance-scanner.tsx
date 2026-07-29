'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  onScan: (raw: string) => void;
  paused?: boolean;
};

/**
 * Escáner de cámara para el teléfono dedicado del gym.
 * Usa html5-qrcode (solo cliente).
 */
export function QrAttendanceScanner({ onScan, paused }: Props) {
  const regionId = useRef(`vnb-qr-${Math.random().toString(36).slice(2, 9)}`).current;
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const lastScan = useRef({ value: '', at: 0 });
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (paused) return;

    let cancelled = false;
    let scanner: { stop: () => Promise<void>; clear?: () => void } | null = null;

    async function start() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;

        const instance = new Html5Qrcode(regionId);
        scanner = instance;

        await instance.start(
          { facingMode: 'environment' },
          {
            fps: 8,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1,
          },
          (decoded) => {
            const now = Date.now();
            if (
              decoded === lastScan.current.value &&
              now - lastScan.current.at < 3500
            ) {
              return;
            }
            lastScan.current = { value: decoded, at: now };
            onScanRef.current(decoded);
          },
          () => {
            /* frames sin QR */
          },
        );

        if (!cancelled) setReady(true);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'No se pudo abrir la cámara';
        setError(
          message.includes('Permission') || message.includes('NotAllowed')
            ? 'Permite el acceso a la cámara en este teléfono del gimnasio.'
            : 'No se pudo iniciar el escáner. Revisa la cámara o usa búsqueda manual.',
        );
      }
    }

    start();

    return () => {
      cancelled = true;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner?.clear?.())
          .catch(() => undefined);
      }
    };
  }, [paused, regionId]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950">
      <div id={regionId} className="min-h-[280px] w-full overflow-hidden [&_video]:w-full" />
      {!ready && !error ? (
        <p className="px-4 py-3 text-center text-xs text-zinc-400">
          Abriendo cámara del teléfono del gym…
        </p>
      ) : null}
      {error ? (
        <p className="px-4 py-3 text-center text-xs text-rose-300">{error}</p>
      ) : null}
    </div>
  );
}
