import { formatCurrency } from '../../data/mockData';

/**
 * Sección inferior de notas de recepción y liquidación económica de la compra.
 */
export default function PurchaseSummary({
  notes,
  onNotesChange,
  summary,
  onCancel,
  onRegister,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      {/* Notas e Incidencias */}
      <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center gap-space-xs text-on-surface">
          <span className="material-symbols-outlined text-outline text-[20px]">
            notes
          </span>
          <span className="font-headline-sm text-headline-sm">
            Notas de Recepción e Incidencias
          </span>
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Añadir observaciones sobre el estado del empaque, lote o caducidad detectada en la entrega física..."
          className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/30 resize-none"
        />
      </div>

      {/* Liquidación de Compra */}
      <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Liquidación de Compra
          </span>
          <span className="font-label-md text-label-md px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
            {summary.totalUnits} unidades totales
          </span>
        </div>

        <div className="flex flex-col gap-space-sm font-body-md text-body-md">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span>Subtotal de Compra:</span>
            <span className="font-code-num text-code-num font-semibold text-on-surface">
              {formatCurrency(summary.subtotal)} MXN
            </span>
          </div>

          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="flex items-center gap-1">
              Impuesto IVA Trasladado (16%):
              <span
                className="material-symbols-outlined text-[14px] text-outline"
                title="Cálculo estándar de IVA almacén"
              >
                help_outline
              </span>
            </span>
            <span className="font-code-num text-code-num font-semibold text-on-surface">
              {formatCurrency(summary.tax)} MXN
            </span>
          </div>

          <div className="flex justify-between items-center text-on-surface-variant">
            <span>Retenciones / Descuento proveedor:</span>
            <span className="font-code-num text-code-num text-outline">
              -$0.00 MXN
            </span>
          </div>

          <div className="pt-space-sm mt-space-xs flex justify-between items-baseline bg-surface-container-low p-space-md rounded-xl">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Total a Pagar
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Acreditado a cuenta por pagar
              </span>
            </div>
            <span className="font-headline-lg text-headline-lg font-bold text-primary-container">
              {formatCurrency(summary.total)} MXN
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-md pt-space-xs">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
            Cancelar
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="h-12 px-space-md rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-space-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              task_alt
            </span>
            Registrar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
