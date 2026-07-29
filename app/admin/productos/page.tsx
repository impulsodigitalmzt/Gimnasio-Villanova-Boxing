'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui';
import { AdminModal, AdminToast, Field, inputClass } from '@/components/admin/modal';
import { useAdminDb } from '@/hooks/use-admin-db';
import {
  createProduct,
  deleteProduct,
  restoreProduct,
  updateProduct,
} from '@/lib/admin/store';
import type { Product } from '@/lib/admin/types';

export default function ProductosPage() {
  const { db, busy, toast, run } = useAdminDb();
  const [tab, setTab] = useState<'activos' | 'inactivos'>('activos');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [stock, setStock] = useState(10);
  const [price, setPrice] = useState(299);
  const [isPublic, setIsPublic] = useState(true);

  const list = useMemo(
    () => db.products.filter((p) => (tab === 'activos' ? p.active : !p.active)),
    [db.products, tab],
  );

  const activeCount = db.products.filter((p) => p.active).length;
  const inactiveCount = db.products.filter((p) => !p.active).length;

  function openCreate() {
    setEditing(null);
    setName('');
    setStock(10);
    setPrice(299);
    setIsPublic(true);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setName(product.name);
    setStock(product.stock);
    setPrice(product.price);
    setIsPublic(product.public);
    setOpen(true);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (editing) {
      await run(
        () => updateProduct(editing.id, { name, stock, price, public: isPublic }),
        'Producto actualizado',
      );
    } else {
      await run(() => createProduct({ name, stock, price, public: isPublic }), 'Producto creado');
    }
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Tienda"
        subtitle="Guantes, protectores, playeras y merch Villanova Boxing"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--admin-brand)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[var(--admin-brand-dark)]"
          >
            <Plus className="size-3.5" /> Nuevo producto
          </button>
        }
      />

      <div className="p-5 sm:p-8">
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-center gap-4 border-b border-zinc-100 px-5 py-4">
            <button
              type="button"
              onClick={() => setTab('activos')}
              className={`border-b-2 pb-1 text-sm font-bold transition ${
                tab === 'activos'
                  ? 'border-[var(--admin-brand)] text-zinc-800'
                  : 'border-transparent text-zinc-400'
              }`}
            >
              Activos ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setTab('inactivos')}
              className={`border-b-2 pb-1 text-sm font-bold transition ${
                tab === 'inactivos'
                  ? 'border-[var(--admin-brand)] text-zinc-800'
                  : 'border-transparent text-zinc-400'
              }`}
            >
              Inactivos ({inactiveCount})
            </button>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Producto</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Precio</th>
                  <th className="px-5 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((product) => (
                  <tr key={product.id} className="border-t border-zinc-100">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt=""
                          className="size-10 rounded-lg border border-zinc-100 object-contain"
                        />
                        <span className="font-medium text-zinc-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">{product.stock}</td>
                    <td className="px-5 py-3.5 font-semibold text-zinc-800">
                      ${product.price.toLocaleString('es-MX')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        {product.active ? (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => openEdit(product)}
                              className="rounded-lg bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200"
                              aria-label="Editar"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                run(() => deleteProduct(product.id), 'Producto desactivado')
                              }
                              className="rounded-lg bg-rose-50 p-2 text-rose-500 hover:bg-rose-100"
                              aria-label="Desactivar"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              run(() => restoreProduct(product.id), 'Producto restaurado')
                            }
                            className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100"
                            aria-label="Restaurar"
                          >
                            <RotateCcw className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AdminModal
        open={open}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit}>
          <Field label="Nombre">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stock">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </Field>
            <Field label="Precio (MXN)">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </Field>
          </div>
          <label className="mb-5 flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="size-4 accent-[var(--admin-brand)]"
            />
            Visible en tienda
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[var(--admin-brand)] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[var(--admin-brand-dark)] disabled:opacity-60"
          >
            Guardar
          </button>
        </form>
      </AdminModal>

      <AdminToast message={toast} />
    </div>
  );
}
