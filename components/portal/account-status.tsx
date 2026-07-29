'use client';

import Link from 'next/link';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, CreditCard } from 'lucide-react';
import type { MemberProfile } from '@/lib/portal/types';
import { membershipRenewalPrice } from '@/lib/portal/mock-data';
import { buildMembershipPayUrl } from '@/lib/portal/payments';
import { getSubscriptionCheckoutAmount } from '@/lib/portal/subscription-plans';
import {
  daysUntilExpiry,
  EXPIRY_REMINDER_DAYS,
  formatEsMxDate,
  parseEsMxDate,
} from '@/lib/portal/membership-lifecycle';

function formatPaymentLabel(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return formatEsMxDate(d);
}

export function AccountStatusCard({ profile }: { profile: MemberProfile }) {
  const active = profile.status === 'activa';
  const warning = profile.status === 'por_vencer';
  const pending = profile.status === 'pendiente';
  const expired = profile.status === 'vencida';

  const renew = getSubscriptionCheckoutAmount(profile.planId || 'individual');
  const payAmount = pending ? renew.total : membershipRenewalPrice;
  const payUrl = buildMembershipPayUrl(payAmount, profile.planName, profile.planId);

  const daysLeft =
    pending || profile.expiresAt === 'Pendiente de pago'
      ? null
      : daysUntilExpiry(profile.expiresAt);

  const renewalDate =
    pending || profile.expiresAt === 'Pendiente de pago'
      ? 'Al confirmar el pago'
      : profile.expiresAt;

  /** Renovar solo si falta pagar, está por vencer (≤3 días) o ya venció. */
  const canRenew =
    pending ||
    expired ||
    warning ||
    (daysLeft !== null && daysLeft <= EXPIRY_REMINDER_DAYS);

  const statusLabel = active
    ? 'Cliente activo'
    : warning
      ? 'Por vencer'
      : pending
        ? 'Pendiente de pago'
        : 'Vencido';

  const StatusIcon = active ? CheckCircle2 : pending ? Clock3 : AlertTriangle;

  return (
    <section className="overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-500 bg-[var(--portal-card)]">
      <div
        className={`px-5 py-4 ${
          active
            ? 'bg-gradient-to-r from-[var(--portal-brand)]/30 to-transparent'
            : pending
              ? 'bg-gradient-to-r from-sky-500/25 to-transparent'
              : warning
                ? 'bg-gradient-to-r from-amber-500/25 to-transparent'
                : 'bg-gradient-to-r from-rose-500/25 to-transparent'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--portal-brand-light)]">
              Membresía
            </p>
            <h2 className="mt-2 font-display text-2xl font-black uppercase text-white">
              {statusLabel}
            </h2>
            <p className="mt-2 text-sm font-semibold text-zinc-200">{profile.planName}</p>
          </div>
          <span
            className={`mt-1 flex size-11 items-center justify-center rounded-full ${
              active
                ? 'bg-emerald-500/20 text-emerald-400'
                : pending
                  ? 'bg-sky-500/20 text-sky-400'
                  : warning
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            <StatusIcon className="size-6" />
          </span>
        </div>
      </div>

      <div className="grid gap-3 px-5 py-5 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <CreditCard className="size-3.5" /> Último pago
          </p>
          <p className="mt-1 break-all font-semibold text-white">
            {pending ? 'Sin pagos aún' : formatPaymentLabel(profile.lastPaymentAt)}
          </p>
          {!pending && profile.amountPaid ? (
            <p className="mt-0.5 text-xs text-zinc-400">
              ${profile.amountPaid.toLocaleString('es-MX')} MXN
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <Clock3 className="size-3.5" /> Días activos
          </p>
          <p className="mt-1 font-semibold text-white">
            {daysLeft === null
              ? '—'
              : daysLeft < 0
                ? '0 (vencida)'
                : `${daysLeft} día${daysLeft === 1 ? '' : 's'}`}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <CalendarDays className="size-3.5" /> Próximo pago
          </p>
          <p className="mt-1 font-semibold text-[var(--portal-brand-light)]">{renewalDate}</p>
          {parseEsMxDate(profile.expiresAt) && !canRenew ? (
            <p className="mt-0.5 text-xs text-zinc-400">
              Tu membresía está al corriente. El botón de renovación aparecerá cuando se acerque esa
              fecha.
            </p>
          ) : null}
          {parseEsMxDate(profile.expiresAt) && canRenew && !pending ? (
            <p className="mt-0.5 text-xs text-zinc-400">
              Renueva antes de esa fecha para no perder tu acceso.
            </p>
          ) : null}
        </div>
      </div>

      {canRenew ? (
        <div className="border-t border-white/10 p-4">
          <Link
            href={payUrl}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--portal-brand)] py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-[var(--portal-brand-dark)]"
          >
            <CreditCard className="size-5" />
            {pending ? 'Activar membresía' : 'Renovar ahora'}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
