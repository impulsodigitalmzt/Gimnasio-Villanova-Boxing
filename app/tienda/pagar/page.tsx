'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Compat: redirige al checkout completo de la tienda. */
export default function TiendaPagarRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tienda/checkout');
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-black text-sm text-zinc-500">
      Redirigiendo al checkout…
    </div>
  );
}
