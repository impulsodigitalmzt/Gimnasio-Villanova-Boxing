'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChallengeCard } from '@/components/portal/challenge-card';
import { useMemberPortal } from '@/lib/portal/store';

function ChallengesContent() {
  const searchParams = useSearchParams();
  const joinId = searchParams.get('join');
  const { challenges } = useMemberPortal();

  useEffect(() => {
    if (!joinId) return;
    const el = document.getElementById(`reto-${joinId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [joinId]);

  return (
    <div className="space-y-5">
      <header>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
          Retos y promos
        </p>
        <h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Súmate y gana</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Acepta un reto y paga al instante para activarlo en tu cuenta.
        </p>
      </header>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            highlight={joinId === challenge.id}
          />
        ))}
      </div>

      <Link href="/app" className="block text-center text-xs font-bold text-zinc-500 hover:text-white">
        Volver al inicio
      </Link>
    </div>
  );
}

export default function MemberChallengesPage() {
  return (
    <Suspense fallback={<div className="text-zinc-500">Cargando retos...</div>}>
      <ChallengesContent />
    </Suspense>
  );
}
