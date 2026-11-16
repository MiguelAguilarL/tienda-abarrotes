import { formatCurrency, MOCK_PRODUCTOS } from '../../data/mockData';
import { CategoryBadge } from '../common/Badge';

/**
 * Tabla dinámica de partidas de entrada (d_compra).
 */
export default function PurchaseItemsTable({
  items,
  onProductChange,
  onQtyChange,
  onCostChange,
  onAddRow,
  onRemoveRow,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-[20px]">
              inventory
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Partidas de Entrada (d_compra)
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Especifica volumen, costos unitarios pactados e incrementos de stock
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[16px] text-primary">
            keyboard
          </span>
          <span>
            Navega ágilmente usando la tecla <b>[Tab]</b>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <th className="py-3 px-space-md w-12 text-center">#</th>
              <th className="py-3 px-space-md min-w-[260px]">Producto</th>
              <th className="py-3 px-space-md w-36">Categoría</th>
              <th className="py-3 px-space-md w-44 text-center">Cantidad</th>
              <th className="py-3 px-space-md w-40">Costo Unitario</th>
              <th className="py-3 px-space-md w-36 text-right">Subtotal</th>
              <th className="py-3 px-space-md w-16 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => {
              const product =
                MOCK_PRODUCTOS.find((p) => p.id_producto === row.id_producto) ||
                MOCK_PRODUCTOS[0];
              const rowSubtotal = row.cantidad_compra * row.costo;

              return (
                <tr
                  key={row.rowId}
                  className="bg-surface-container-lowest hover:bg-surface-container-low/40 transition-colors"
                >
                  <td className="py-3 px-space-md text-center font-code-num text-code-num text-outline">
                    {String(idx + 1).padStart(2, '0')}
                  </td>

                  <td className="py-3 px-space-md">
                    <div className="relative">
                      <select
                        value={row.id_producto}
                        onChange={(e) => onProductChange(row.rowId, e.target.value)}
                        className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 appearance-none cursor-pointer"
                      >
                        {MOCK_PRODUCTOS.map((prod) => (
                          <option key={prod.id_producto} value={prod.id_producto}>
                            {prod.nombre_producto} (Cod: {prod.codigo_compra})
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                        unfold_more
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-space-md">
                    <CategoryBadge categoria={product.categoria} />
                  </td>

                  <td className="py-3 px-space-md">
                    <div className="flex items-center justify-center bg-surface-container-low rounded-lg p-0.5 w-32 mx-auto">
                      <button
                        type="button"
                        onClick={() =>
                          onQtyChange(row.rowId, Math.max(1, row.cantidad_compra - 1))
                        }
                        className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          remove
                        </span>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={row.cantidad_compra}
                        onChange={(e) => onQtyChange(row.rowId, e.target.value)}
                        className="w-12 text-center bg-transparent font-code-num text-code-num text-on-surface font-semibold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onQtyChange(row.rowId, row.cantidad_compra + 1)
                        }
                        className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          add
                        </span>
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-space-md">
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-code-num text-code-num text-outline">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.50"
                        value={row.costo}
                        onChange={(e) => onCostChange(row.rowId, e.target.value)}
                        className="w-full h-10 pl-7 pr-3 rounded-lg bg-surface-container-low font-code-num text-code-num text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                      />
                    </div>
                  </td>

                  <td className="py-3 px-space-md text-right font-code-num text-code-num font-semibold text-on-surface">
                    {formatCurrency(rowSubtotal)}
                  </td>

                  <td className="py-3 px-space-md text-center">
                    <button
                      type="button"
                      title={
                        items.length <= 1
                          ? 'Se requiere al menos una partida'
                          : 'Eliminar fila'
                      }
                      disabled={items.length <= 1}
                      onClick={() => onRemoveRow(row.rowId)}
                      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pie de tabla */}
      <div className="p-space-md bg-surface-container-low/60 flex items-center justify-between flex-wrap gap-space-sm">
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            add_circle
          </span>
          + Añadir Producto
        </button>

        <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[18px] text-secondary">
            verified
          </span>
          <span>
            Los precios unitarios no incluyen IVA y actualizarán el costo ponderado.
          </span>
        </div>
      </div>
    </div>
  );
}
