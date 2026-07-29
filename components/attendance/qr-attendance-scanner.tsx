'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, SwitchCamera } from 'lucide-react';

export type CameraFacing = 'user' | 'environment';

type Props = {
  onScan: (raw: string) => void;
  paused?: boolean;
  /** Frontal = alumno pasa el QR frente a la tablet. Trasera = staff apunta al celular. */
  facing?: CameraFacing;
  onFacingChange?: (facing: CameraFacing) => void;
};

/**
 * Escáner continuo para kiosco de recepción.
 * Cámara frontal por defecto: el alumno acerca el QR a la pantalla.
 */
export function QrAttendanceScanner({
  onScan,
  paused,
  facing = 'user',
  onFacingChange,
}: Props) {
  const regionId = useRef(`vnb-qr-${Math.random().toString(36).slice(2, 9)}`).current;
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const lastScan = useRef({ value: '', at: 0 });
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (paused) return;

    let cancelled = false;
    let scanner: {
      stop: () => Promise<void>;
      clear?: () => void;
      applyVideoConstraints?: (c: MediaTrackConstraints) => Promise<void>;
    } | null = null;

    async function start() {
      setReady(false);
      setError(null);
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;

        const instance = new Html5Qrcode(regionId, {
          verbose: false,
        });
        scanner = instance;

        const tryStart = async (mode: CameraFacing) => {
          await instance.start(
            { facingMode: mode },
            {
              fps: 12,
              // Área amplia: el alumno pasa el celular frente a la pantalla
              qrbox: (viewW, viewH) => {
                const side = Math.floor(Math.min(viewW, viewH) * 0.82);
                return { width: side, height: side };
              },
              aspectRatio: 1.333,
              disableFlip: false,
            },
            (decoded) => {
              const now = Date.now();
              if (
                decoded === lastScan.current.value &&
                now - lastScan.current.at < 4000
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
        };

        try {
          await tryStart(facing);
        } catch {
          // Fallback a la otra cámara si la pedida no existe
          const fallback: CameraFacing = facing === 'user' ? 'environment' : 'user';
          await tryStart(fallback);
          if (!cancelled) onFacingChange?.(fallback);
        }

        // Espejo en frontal: más natural al acercar el celular
        if (!cancelled && facing === 'user') {
          const video = document.querySelector(
            `#${regionId} video`,
          ) as HTMLVideoElement | null;
          if (video) {
            video.style.transform = 'scaleX(-1)';
          }
        }

        if (!cancelled) setReady(true);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'No se pudo abrir la cámara';
        setError(
          message.includes('Permission') || message.includes('NotAllowed')
            ? 'Permite el acceso a la cámara en este dispositivo del gimnasio.'
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
  }, [paused, regionId, facing, onFacingChange]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
          <Camera className="size-3.5 text-[var(--admin-brand)]" />
          {facing === 'user' ? 'Cámara frontal · pasa el QR frente a la pantalla' : 'Cámara trasera · apunta al celular'}
        </p>
        {onFacingChange ? (
          <button
            type="button"
            onClick={() => onFacingChange(facing === 'user' ? 'environment' : 'user')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/20"
          >
            <SwitchCamera className="size-3.5" />
            Cambiar
          </button>
        ) : null}
      </div>
      <div
        id={regionId}
        className="min-h-[320px] w-full overflow-hidden bg-black [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      />
      {!ready && !error ? (
        <p className="px-4 py-3 text-center text-xs text-zinc-400">
          Abriendo cámara… acerca el QR a unos 15–30 cm de la pantalla
        </p>
      ) : null}
      {error ? (
        <p className="px-4 py-3 text-center text-xs text-rose-300">{error}</p>
      ) : null}
    </div>
  );
}
