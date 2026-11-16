import { formatCurrency } from '../../data/mockData';

/**
 * Columna derecha sticky: Ticket dinámico de venta y botones de cobro rápido.
 */
export default function TicketSummary({
  saleId,
  items,
  totals,
  onUpdateQty,
  onRemoveItem,
  onClearTicket,
  onCheckout,
}) {
  const isEmpty = items.length === 0;

  return (
    <div className="w-full lg:w-[31%] flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden sticky top-20">
      {/* Encabezado del Ticket */}
      <div className="p-space-md bg-surface-container-low flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              receipt_long
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Resumen de Venta
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-code-num text-label-md text-on-surface-variant">
              id_venta:
            </span>
            <span className="font-code-num text-label-md font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
              {saleId}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearTicket}
          disabled={isEmpty}
          title="Vaciar lista actual"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container font-label-sm text-label-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px]">
            delete_sweep
          </span>
          <span>Limpiar ticket</span>
        </button>
      </div>

      {/* Lista dinámica de artículos */}
      <div className="flex-1 max-h-[380px] min-h-[160px] overflow-y-auto px-space-md py-space-sm flex flex-col divide-y divide-surface-container space-y-2">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-outline">
            <span className="material-symbols-outlined text-[36px] mb-1">
              shopping_basket
            </span>
            <p className="font-body-md text-body-md">
              El ticket está vacío. Agrega productos desde el catálogo.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id_producto}
              className="pt-2 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="font-code-num font-bold text-primary text-body-md shrink-0 bg-primary-fixed/50 px-1.5 py-0.5 rounded">
                  {item.cantidad}x
                </span>
                <div className="min-w-0">
                  <div className="font-label-lg text-label-lg text-on-surface truncate">
                    {item.nombre_producto}
                  </div>
                  <div className="font-code-num text-body-sm text-on-surface-variant">
                    {formatCurrency(item.p_unitario)} c/u
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-code-num text-body-lg font-bold text-on-surface">
                  {formatCurrency(item.cantidad * item.p_unitario)}
                </span>
                <div className="flex items-center bg-surface-container-high rounded-md p-0.5">
                  <button
                    type="button"
                    title="Restar"
                    onClick={() => onUpdateQty(item.id_producto, -1)}
                    className="w-6 h-6 flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      remove
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Sumar"
                    onClick={() => onUpdateQty(item.id_producto, 1)}
                    className="w-6 h-6 flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      add
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  title="Eliminar fila"
                  onClick={() => onRemoveItem(item.id_producto)}
                  className="text-outline hover:text-error transition-colors p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desglose de Totales y Liquidación */}
      <div className="bg-surface-container-low p-space-md flex flex-col gap-2 mt-auto">
        <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md">
          <span>
            Subtotal ({totals.totalArticles} artículos / {totals.totalPieces}{' '}
            piezas)
          </span>
          <span className="font-code-num font-semibold text-on-surface">
            {formatCurrency(totals.totalAmount)}
          </span>
        </div>

        <div className="h-0.5 w-full bg-surface-container-highest my-1" />

        <div className="flex justify-between items-baseline py-1">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Total a Pagar
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              MXN
            </span>
          </div>
          <span className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">
            {formatCurrency(totals.totalAmount)}
          </span>
        </div>

        {/* Botones de Cobro Rápido */}
        <div className="grid grid-cols-2 gap-space-sm pt-2">
          <button
            type="button"
            disabled={isEmpty}
            onClick={() => onCheckout('Efectivo')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[22px]">
                payments
              </span>
              <span className="font-headline-sm text-headline-sm font-bold">
                Efectivo
              </span>
            </div>
            <span className="font-label-sm text-label-sm opacity-90">
              [F9] Cambio exacto
            </span>
          </button>

          <button
            type="button"
            disabled={isEmpty}
            onClick={() => onCheckout('Tarjeta')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[22px]">
                credit_card
              </span>
              <span className="font-headline-sm text-headline-sm font-bold">
                Tarjeta
              </span>
            </div>
            <span className="font-label-sm text-label-sm opacity-90">
              [F10] Pinpad activo
            </span>
          </button>
        </div>

        <button
          type="button"
          disabled={isEmpty}
          onClick={() => onCheckout('Efectivo')}
          className="w-full py-3 bg-surface-container-highest hover:bg-surface-tint hover:text-on-primary text-on-surface font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 transition-all mt-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">payments</span>
          <span className="font-bold">Cobrar &amp; Emitir Ticket (F12)</span>
        </button>
      </div>
    </div>
  );
}
