import {
  formatCurrency,
  formatShortDate,
  getDaysUntil,
} from '../../data/mockData';
import { CategoryBadge, StockBadge } from '../common/Badge';

/**
 * Tabla principal de inventario con badges de caducidad, acciones y paginación.
 */
export default function InventoryTable({
  items,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const startIdx = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider select-none">
              <th className="py-3.5 px-space-md font-semibold">SKU / ID</th>
              <th className="py-3.5 px-space-md font-semibold">
                Producto &amp; Especificación
              </th>
              <th className="py-3.5 px-space-md font-semibold">Categoría</th>
              <th className="py-3.5 px-space-md font-semibold text-right">
                Precio Actual
              </th>
              <th className="py-3.5 px-space-md font-semibold text-center">
                Stock Actual
              </th>
              <th className="py-3.5 px-space-md font-semibold">F. Entrada</th>
              <th className="py-3.5 px-space-md font-semibold">F. Caducidad</th>
              <th className="py-3.5 px-space-md font-semibold text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-on-surface font-body-md text-body-md">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 px-space-md text-center text-on-surface-variant"
                >
                  No hay lotes que coincidan con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const daysLeft = getDaysUntil(item.f_caducidad);
                const isExpiringSoon = daysLeft <= 7;

                return (
                  <tr
                    key={item.id_inventario}
                    className="hover:bg-surface-container-low/70 transition-colors group"
                  >
                    <td className="py-3.5 px-space-md font-code-num text-code-num font-semibold text-primary">
                      {item.inv_code}
                    </td>

                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          {item.nombre_producto}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">
                          {item.especificacion} | {item.sku}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-space-md">
                      <CategoryBadge categoria={item.categoria} />
                    </td>

                    <td className="py-3.5 px-space-md text-right font-code-num text-code-num font-bold text-on-surface">
                      {formatCurrency(item.p_actual)}
                    </td>

                    <td className="py-3.5 px-space-md text-center">
                      <StockBadge stock={item.stock} showStatusText />
                    </td>

                    <td className="py-3.5 px-space-md text-on-surface-variant font-code-num text-body-sm">
                      {formatShortDate(item.f_entrada)}
                    </td>

                    <td className="py-3.5 px-space-md">
                      {isExpiringSoon ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold animate-pulse">
                          <span className="material-symbols-outlined text-[14px]">
                            alarm
                          </span>
                          {formatShortDate(item.f_caducidad)} - ¡{Math.max(0, daysLeft)}{' '}
                          días!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                          {formatShortDate(item.f_caducidad)} - Vigente
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-space-md text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          title="Editar SKU"
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          title="Dar de baja o registrar merma"
                          onClick={() => onDelete(item.id_inventario)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer de Paginación */}
      <div className="px-space-md py-3.5 bg-surface-container-low/60 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-outline font-body-sm text-body-sm">
          <span>Mostrando</span>
          <span className="font-code-num text-code-num font-bold text-on-surface">
            {startIdx} a {endIdx}
          </span>
          <span>de</span>
          <span className="font-code-num text-code-num font-bold text-on-surface">
            {totalCount}
          </span>
          <span>artículos en bodega</span>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            className="p-1.5 rounded-lg bg-surface-container-lowest text-outline hover:text-on-surface shadow-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">
              first_page
            </span>
          </button>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1.5 rounded-lg bg-surface-container-lowest text-outline hover:text-on-surface shadow-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-lg font-code-num text-code-num font-medium shadow-sm cursor-pointer ${
                page === currentPage
                  ? 'bg-primary-container text-on-primary font-bold'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">
              last_page
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
