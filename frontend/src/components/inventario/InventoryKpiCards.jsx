/**
 * Tarjetas KPI de alertas críticas de inventario y caducidades.
 */
export default function InventoryKpiCards({ criticalCount, expiringCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* Alerta Stock Crítico */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-label-md text-label-md text-on-surface-variant block">
              Alerta Stock Crítico
            </span>
            <span className="font-headline-lg text-headline-lg text-error font-bold mt-1 block">
              {criticalCount}{' '}
              <span className="font-body-md text-body-md text-outline font-normal">
                productos
              </span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
        </div>

        <div className="mt-space-md flex items-center gap-space-xs">
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[14px]">
              priority_high
            </span>
            Reabastecer ya
          </span>
          <span className="font-body-sm text-body-sm text-outline">
            menor a 10 uds
          </span>
        </div>
      </div>

      {/* Próximos a Vencer */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-label-md text-label-md text-on-surface-variant block">
              Próximos a Vencer (&lt;7 días)
            </span>
            <span className="font-headline-lg text-headline-lg text-tertiary font-bold mt-1 block">
              {expiringCount}{' '}
              <span className="font-body-md text-body-md text-outline font-normal">
                lotes
              </span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container">
            <span className="material-symbols-outlined text-[22px]">
              hourglass_bottom
            </span>
          </div>
        </div>

        <div className="mt-space-md flex items-center gap-space-xs">
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">
            Remate / Merma
          </span>
          <span className="font-body-sm text-body-sm text-outline">
            acción sugerida
          </span>
        </div>
      </div>
    </div>
  );
}
