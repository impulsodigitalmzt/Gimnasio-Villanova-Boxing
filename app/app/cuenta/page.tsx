'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Save } from 'lucide-react';
import { AccountStatusCard } from '@/components/portal/account-status';
import { useMemberPortal } from '@/lib/portal/store';
import { membershipRenewalPrice } from '@/lib/portal/mock-data';
import { buildMembershipPayUrl } from '@/lib/portal/payments';
import { clearMemberSession, persistMemberSession } from '@/lib/portal/auth-session';
import { memberInitials } from '@/lib/portal/google-auth';
import { getCurrentUser, updatePortalUserProfile } from '@/lib/portal/users';
import {
  daysUntilExpiry,
  EXPIRY_REMINDER_DAYS,
} from '@/lib/portal/membership-lifecycle';

export default function MemberAccountPage() {
  const router = useRouter();
  const { ready, profile, persistProfile } = useMemberPortal();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setPhone(profile.phone || '');
  }, [profile]);

  if (!ready) {
    return <div className="py-20 text-center text-sm text-zinc-500">Cargando…</div>;
  }

  if (!profile) {
    return (
      <div className="py-16 text-center">
        <Link href="/app/login" className="text-[var(--portal-brand-light)]">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const daysLeft =
    profile.expiresAt === 'Pendiente de pago' ? null : daysUntilExpiry(profile.expiresAt);
  const canRenew =
    profile.status === 'pendiente' ||
    profile.status === 'vencida' ||
    profile.status === 'por_vencer' ||
    (daysLeft !== null && daysLeft <= EXPIRY_REMINDER_DAYS);

  async function logout() {
    clearMemberSession();
    await fetch('/api/member/logout', { method: 'POST' });
    router.push('/app/login');
    router.refresh();
  }

  function saveProfile(event: FormEvent) {
    event.preventDefault();
    const current = getCurrentUser();
    if (!current) return;
    const updated = updatePortalUserProfile(current.id, { name, phone });
    if (!updated) return;
    persistMemberSession(updated);
    persistProfile({
      ...profile!,
      name: updated.name,
      phone: updated.phone,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-[var(--portal-brand)] text-lg font-black text-white">
          {memberInitials(profile.name)}
        </span>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--portal-brand-light)]">
            Mi perfil
          </p>
          <h1 className="mt-1 font-display text-3xl font-black uppercase text-white">
            {profile.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{profile.email}</p>
        </div>
      </header>

      <AccountStatusCard profile={profile} />

      <form
        onSubmit={saveProfile}
        className="space-y-4 rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)] p-5"
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
          Datos personales
        </p>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-zinc-400">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-zinc-400">Correo</span>
          <input
            value={profile.email}
            disabled
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-500"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-zinc-400">WhatsApp</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="669 000 0000"
            className="w-full rounded-xl border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[var(--portal-brand)]"
          />
        </label>
        <p className="text-xs text-zinc-500">
          Acceso con {profile.authProvider === 'google' ? 'Google' : 'correo'} · Socio desde{' '}
          {profile.memberSince}
        </p>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand/40 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-brand/10"
        >
          <Save className="size-4" />
          {saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </form>

      <div className="grid gap-3">
        {canRenew ? (
          <Link
            href={buildMembershipPayUrl(membershipRenewalPrice, profile.planName, profile.planId)}
            className="flex w-full justify-center rounded-2xl bg-[var(--portal-brand)] py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)]"
          >
            {profile.status === 'pendiente' ? 'Activar membresía' : 'Renovar ahora'}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-4 text-xs font-black uppercase tracking-wider text-white hover:border-rose-400 hover:text-rose-300"
        >
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
