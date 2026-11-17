import { useState } from 'react';
import { CATEGORY_ICONS, formatCurrency } from '../../utils/formatters';
import { CategoryBadge, StockBadge } from '../common/Badge';

/**
 * Tabla operativa de productos cargados desde MySQL.
 */
export default function ProductCatalogTable({
  products,
  loading,
  error,
  onAddProduct,
}) {
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  const handleAdd = (product) => {
    onAddProduct(product);
    setRecentlyAddedId(product.id_producto);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id_producto ? null : prev));
    }, 550);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none">
              <th className="py-3 px-4 font-semibold">Producto / ID</th>
              <th className="py-3 px-3 font-semibold text-center">Categoría</th>
              <th className="py-3 px-4 font-semibold text-right">Precio Unitario</th>
              <th className="py-3 px-4 font-semibold text-center">Existencia</th>
              <th className="py-3 px-4 font-semibold text-center w-28">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 px-4 text-center text-on-surface-variant font-body-md"
                >
                  Cargando productos desde la base de datos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 px-4 text-center text-error font-body-md"
                >
                  Error al consultar la base de datos: {error}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 px-4 text-center text-on-surface-variant font-body-md"
                >
                  No se encontraron productos registrados.
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const isAdded = recentlyAddedId === prod.id_producto;
                const isOutOfStock = prod.stock <= 0;
                const iconMeta =
                  CATEGORY_ICONS[prod.categoria] || CATEGORY_ICONS.Otros;

                return (
                  <tr
                    key={prod.id_producto}
                    className="hover:bg-surface-container-low/70 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg bg-surface-container-high ${iconMeta.color} flex items-center justify-center shrink-0`}
                        >
                          <span className="material-symbols-outlined text-[19px]">
                            {iconMeta.icon}
                          </span>
                        </div>
                        <div>
                          <div className="font-headline-sm text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                            {prod.nombre_producto}
                          </div>
                          <div className="font-code-num text-body-sm text-on-surface-variant">
                            id_producto: {prod.id_producto}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <CategoryBadge categoria={prod.categoria} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        {formatCurrency(prod.p_actual)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <StockBadge stock={prod.stock} />
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleAdd(prod)}
                        className={`inline-flex items-center justify-center gap-1 w-full py-1.5 px-2.5 font-label-md text-label-md rounded-lg transition-all active:scale-95 shadow-sm ${
                          isOutOfStock
                            ? 'bg-surface-container-low text-outline cursor-not-allowed opacity-60'
                            : isAdded
                              ? 'bg-secondary text-on-secondary cursor-pointer'
                              : 'bg-surface-container hover:bg-primary hover:text-on-primary text-primary cursor-pointer'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isAdded ? 'done' : 'add'}
                        </span>
                        <span>{isAdded ? 'Listo' : 'Agregar'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-surface-container-low px-space-md py-2.5 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span>Datos sincronizados en tiempo real desde MySQL</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Mostrando {products.length} productos activos</span>
          <span className="font-code-num text-primary font-semibold hidden sm:inline">
            [Tab: Navegar lista]
          </span>
        </div>
      </div>
    </div>
  );
}
