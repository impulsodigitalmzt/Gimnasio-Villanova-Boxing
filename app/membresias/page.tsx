'use client';

import { useEffect } from 'react';

/** Redirige a la página unificada de Planes. */
export default function MembresiasRedirectPage() {
  useEffect(() => {
    window.location.replace('/planes#membresias');
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-sm text-zinc-400">
      Redirigiendo a Planes…
    </main>
  );
}
