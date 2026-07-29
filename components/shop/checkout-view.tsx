'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  CreditCard,
  LockKeyhole,
  Loader2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/components/portal/cart-context';
import { ShopPickupNotice } from '@/components/shop/pickup-notice';
import { brandAssets } from '@/lib/media';
import {
  CART_STORAGE_KEY,
  MEMBER_SHOP_DISCOUNT,
  pickupBranches,
} from '@/lib/portal/store-data';
import {
  createShopOrderId,
  saveShopOrder,
  type ShopOrder,
} from '@/lib/portal/shop-orders';
import { shopHomeHref, type ShopOrigin } from '@/lib/portal/shop-navigation';

type Step = 1 | 2 | 3;

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';

function formatCard(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function Stepper({ step }: { step: Step }) {
  const labels = ['Datos', 'Sucursal', 'Pago'];
  return (
    <ol className="mb-8 flex items-center gap-2">
      {labels.map((label, index) => {
        const n = (index + 1) as Step;
        const active = step === n;
        const done = step > n;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                done || active ? 'bg-brand text-white' : 'border border-white/20 text-zinc-500'
              }`}
            >
              {done ? <Check className="size-3.5" /> : n}
            </span>
            <span
              className={`hidden text-[10px] font-bold uppercase tracking-wider sm:block ${
                active ? 'text-white' : 'text-zinc-500'
              }`}
            >
              {label}
            </span>
            {index < labels.length - 1 ? (
              <span className={`h-px flex-1 ${done ? 'bg-brand' : 'bg-white/15'}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function OrderSummary({
  items,
  subtotal,
  discount,
  total,
  isMember,
}: {
  items: ReturnType<typeof useCart>['items'];
  subtotal: number;
  discount: number;
  total: number;
  isMember: boolean;
}) {
  return (
    <aside className="rounded-2xl border-[3px] border-zinc-500 bg-[#121214] p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand-light">
        Resumen del pedido
      </p>
      <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              className="size-14 rounded-lg bg-[#f3f3f3] object-contain p-1"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{item.name}</p>
              <p className="text-xs text-zinc-500">
                {item.qty} × ${item.price.toLocaleString('es-MX')}
              </p>
            </div>
            <p className="text-sm font-bold text-white">
              ${(item.price * item.qty).toLocaleString('es-MX')}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span className="text-white">${subtotal.toLocaleString('es-MX')}</span>
        </div>
        {isMember && discount > 0 ? (
          <div className="flex justify-between text-emerald-400">
            <span>Descuento socio ({Math.round(MEMBER_SHOP_DISCOUNT * 100)}%)</span>
            <span>-${discount.toLocaleString('es-MX')}</span>
          </div>
        ) : null}
        <div className="flex justify-between pt-2 text-base font-bold text-white">
          <span>Total</span>
          <span className="font-display text-2xl text-brand-light">
            ${total.toLocaleString('es-MX')}{' '}
            <span className="text-xs font-semibold text-zinc-500">MXN</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

export function CheckoutView({ origin }: { origin: ShopOrigin }) {
  const { items, subtotal, discount, total, isMember, clearCart, refreshMember, count } = useCart();

  const inPortal = origin === 'portal';
  const shopHome = shopHomeHref(origin);

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branchId, setBranchId] = useState<(typeof pickupBranches)[number]['id']>('principal');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<ShopOrder | null>(null);
  const [orderId] = useState(() => createShopOrderId());

  useEffect(() => {
    refreshMember();
  }, [refreshMember]);

  const branch = useMemo(
    () => pickupBranches.find((b) => b.id === branchId) ?? pickupBranches[0],
    [branchId],
  );

  const cardLast4 = cardNumber.replace(/\s/g, '').slice(-4);

  function submitPayment(event: FormEvent) {
    event.preventDefault();
    if (items.length === 0 || total <= 0) return;
    setProcessing(true);

    window.setTimeout(() => {
      const nextOrder: ShopOrder = {
        orderId,
        createdAt: new Date().toISOString(),
        customerName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        branchId: branch.id,
        branchName: branch.name,
        branchAddress: branch.address,
        items: [...items],
        subtotal,
        discount,
        total,
        memberDiscount: isMember && discount > 0,
        paymentMethod: 'card',
        cardLast4: cardLast4 || '0000',
      };
      saveShopOrder(nextOrder);
      clearCart();
      window.localStorage.setItem(CART_STORAGE_KEY, '[]');
      setOrder(nextOrder);
      setProcessing(false);
    }, 2200);
  }

  if (order) {
    return (
      <section className={inPortal ? 'pb-24' : 'min-h-[80vh] bg-black px-5 py-16'}>
        <div className="mx-auto max-w-lg rounded-[1.75rem] border-[3px] border-emerald-500/50 bg-[#121214] p-6 text-center sm:p-8">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check className="size-8" />
          </span>
          <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
            Pago autorizado
          </p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase text-white">
            Compra exitosa
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Folio <span className="font-mono font-bold text-white">{order.orderId}</span>
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            ${order.total.toLocaleString('es-MX')} MXN · Tarjeta •••• {order.cardLast4}
          </p>

          <div className="mt-6 space-y-3 rounded-2xl border-[3px] border-zinc-500 bg-black/40 p-4 text-left text-sm">
            <p className="text-zinc-400">
              Enviamos el comprobante a{' '}
              <span className="font-semibold text-white">{order.email}</span> y a tu WhatsApp.
            </p>
            <div className="border-t border-white/10 pt-3">
              <p className="flex items-start gap-2 font-bold text-amber-200">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                Recoge en {order.branchName}
              </p>
              <p className="mt-1 pl-6 text-sm leading-relaxed text-zinc-400">
                {order.branchAddress}
              </p>
              <p className="mt-2 pl-6 text-xs text-amber-100/70">
                Sin servicio a domicilio. Presenta este folio en recepción.
              </p>
            </div>
            <ul className="space-y-1 border-t border-white/10 pt-3 text-xs text-zinc-400">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-2">
                  <span>
                    {item.qty}× {item.name}
                  </span>
                  <span className="text-white">
                    ${(item.price * item.qty).toLocaleString('es-MX')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={shopHome}
            className="mt-8 flex w-full justify-center rounded-2xl bg-brand py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark"
          >
            Seguir comprando
          </Link>
          <Link
            href={inPortal ? '/app' : '/'}
            className="mt-3 block w-full text-xs font-bold text-zinc-500 hover:text-white"
          >
            {inPortal ? 'Ir a mi panel' : 'Volver al inicio'}
          </Link>
        </div>
      </section>
    );
  }

  if (count === 0) {
    return (
      <section
        className={
          inPortal
            ? 'flex flex-col items-center justify-center py-16 text-center'
            : 'flex min-h-[60vh] flex-col items-center justify-center bg-black px-5 py-20 text-center'
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brandAssets.cartIconWhite} alt="" className="size-14 object-contain opacity-70" />
        <h1 className="mt-4 font-display text-2xl font-black uppercase text-white">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Agrega productos para continuar con el pago.</p>
        <Link
          href={shopHome}
          className="mt-8 rounded-full bg-brand px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark"
        >
          Ir a la tienda
        </Link>
      </section>
    );
  }

  return (
    <section className={inPortal ? 'pb-24' : 'bg-black px-5 py-12 sm:py-16'}>
      <div className={inPortal ? '' : 'mx-auto max-w-5xl'}>
        <Link
          href={shopHome}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white"
        >
          <ChevronLeft className="size-4" /> Volver a la tienda
        </Link>

        <header className="mb-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-light">
            Checkout Villanova
          </p>
          <h1 className="mt-1 font-display text-3xl font-black uppercase text-white sm:text-4xl">
            Finalizar compra
          </h1>
        </header>

        <Stepper step={step} />

        <div className={`grid gap-8 ${inPortal ? '' : 'lg:grid-cols-[1.15fr_.85fr]'}`}>
          <div className="space-y-5">
            {step === 1 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
                className="space-y-4 rounded-2xl border-[3px] border-zinc-500 bg-[#121214] p-5 sm:p-6"
              >
                <h2 className="font-display text-xl font-black uppercase text-white">
                  Datos del comprador
                </h2>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-zinc-400">
                    Nombre completo
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Como aparece en tu identificación"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-zinc-400">Correo</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="tu@correo.com"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-zinc-400">WhatsApp</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="669 000 0000"
                  />
                </label>
                <ShopPickupNotice compact />
                <button
                  type="submit"
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark"
                >
                  Continuar a sucursal
                </button>
              </form>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4 rounded-2xl border-[3px] border-zinc-500 bg-[#121214] p-5 sm:p-6">
                <h2 className="font-display text-xl font-black uppercase text-white">
                  Sucursal de recolección
                </h2>
                <ShopPickupNotice />
                <div className="space-y-2">
                  {pickupBranches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBranchId(b.id)}
                      className={`flex w-full flex-col rounded-xl border px-4 py-4 text-left transition ${
                        branchId === b.id
                          ? 'border-brand bg-brand/15'
                          : 'border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span className="text-sm font-bold text-white">{b.name}</span>
                      <span className="mt-1 text-xs text-zinc-500">{b.address}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="min-h-12 flex-1 rounded-xl border border-white/15 text-xs font-black uppercase tracking-wider text-white"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="min-h-12 flex-[1.4] rounded-xl bg-brand text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark"
                  >
                    Ir a pagar
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <form
                onSubmit={submitPayment}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-white">
                      <LockKeyhole className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Villanova Pay</p>
                      <p className="text-[11px] text-zinc-500">Pasarela segura · 256-bit SSL</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <span className="rounded border border-zinc-200 px-1.5 py-0.5">Visa</span>
                    <span className="rounded border border-zinc-200 px-1.5 py-0.5">MC</span>
                    <span className="rounded border border-zinc-200 px-1.5 py-0.5">Amex</span>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm">
                    <span className="text-zinc-600">Monto a cobrar</span>
                    <span className="font-display text-xl font-black text-zinc-900">
                      ${total.toLocaleString('es-MX')} MXN
                    </span>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-zinc-600">
                      Nombre en la tarjeta
                    </span>
                    <input
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={inputClass}
                      placeholder="Como aparece en la tarjeta"
                      autoComplete="cc-name"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-zinc-600">
                      Número de tarjeta
                    </span>
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        required
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        className={`${inputClass} pl-10`}
                        placeholder="4532 1234 5678 9010"
                        autoComplete="cc-number"
                        minLength={19}
                      />
                    </div>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-zinc-600">
                        Vencimiento
                      </span>
                      <input
                        required
                        inputMode="numeric"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className={inputClass}
                        placeholder="MM/AA"
                        autoComplete="cc-exp"
                        minLength={5}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-zinc-600">CVV</span>
                      <input
                        required
                        inputMode="numeric"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className={inputClass}
                        placeholder="123"
                        autoComplete="cc-csc"
                        minLength={3}
                      />
                    </label>
                  </div>

                  <p className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-500">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand" />
                    Tus datos viajan cifrados. Villanova Boxing no almacena el CVV de tu tarjeta.
                  </p>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => setStep(2)}
                      className="min-h-12 flex-1 rounded-xl border border-zinc-200 text-xs font-black uppercase tracking-wider text-zinc-700"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex min-h-12 flex-[1.6] items-center justify-center gap-2 rounded-xl bg-brand text-xs font-black uppercase tracking-wider text-white hover:bg-brand-dark disabled:opacity-70"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Autorizando…
                        </>
                      ) : (
                        <>
                          <LockKeyhole className="size-4" />
                          Pagar ${total.toLocaleString('es-MX')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : null}
          </div>

          <div className={inPortal ? '' : 'lg:sticky lg:top-28 lg:self-start'}>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              total={total}
              isMember={isMember}
            />
            <p className="mt-3 text-center text-[11px] text-zinc-600">
              Folio preliminar · {orderId}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
