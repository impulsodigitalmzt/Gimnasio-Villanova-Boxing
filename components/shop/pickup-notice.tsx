import { MapPin, PackageX } from 'lucide-react';
import { NO_DELIVERY_LEGEND, pickupBranches } from '@/lib/portal/store-data';

/** Leyenda obligatoria: sin domicilio, solo recogida en sucursal. */
export function ShopPickupNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={`rounded-2xl border-[3px] border-amber-500/60 bg-amber-500/10 ${
        compact ? 'px-4 py-3' : 'px-5 py-4'
      }`}
      role="note"
    >
      <div className="flex gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
          <PackageX className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-amber-200">
            Sin servicio a domicilio
          </p>
          <p className={`mt-1 leading-relaxed text-amber-100/90 ${compact ? 'text-sm' : 'text-base'}`}>
            {NO_DELIVERY_LEGEND}
          </p>
          {!compact ? (
            <ul className="mt-3 space-y-2">
              {pickupBranches.map((branch) => (
                <li key={branch.id} className="flex gap-2 text-xs text-amber-50/80">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
                  <span>
                    <span className="font-bold text-amber-100">{branch.name}:</span> {branch.address}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[11px] font-semibold text-amber-100/70">
              Recoge en Villanova Boxing Gym.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
