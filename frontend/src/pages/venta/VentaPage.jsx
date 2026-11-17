import { useCallback, useState } from 'react';
import Modal from '../../components/common/Modal';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CatalogSearch from '../../components/venta/CatalogSearch';
import CategoryFilter from '../../components/venta/CategoryFilter';
import ProductCatalogTable from '../../components/venta/ProductCatalogTable';
import TicketSummary from '../../components/venta/TicketSummary';
import { usePosCart } from '../../hooks/usePosCart';
import { getSessionEmployee } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

/**
 * Pantalla Terminal Punto de Venta (/venta) conectada a MySQL (solo lectura).
 */
export default function VentaPage() {
  const [checkoutModal, setCheckoutModal] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const sessionEmp = getSessionEmployee();
  const employeeName = sessionEmp?.nombre_empleado || 'Carlos López';
  const employeeRole = sessionEmp?.puesto || 'Vendedor';

  const handleRequestCheckout = useCallback((method) => {
    setCheckoutModal({ method });
  }, []);

  const pos = usePosCart({ onRequestCheckout: handleRequestCheckout });

  return (
    <DashboardLayout
      variant="pos"
      employeeName={employeeName}
      employeeRole={employeeRole}
    >
      <div className="flex flex-col w-full pb-space-lg">
        <div className="flex flex-col lg:flex-row gap-space-md w-full items-start mt-space-sm">
          <div className="w-full lg:w-[69%] flex flex-col gap-space-sm">
            <CatalogSearch
              searchInputRef={pos.searchInputRef}
              searchQuery={pos.searchQuery}
              onSearchChange={pos.setSearchQuery}
              onOpenShortcuts={() => setShowShortcuts(true)}
            />

            <CategoryFilter
              selectedCategory={pos.selectedCategory}
              onSelectCategory={pos.setSelectedCategory}
              totalCount={pos.totalCatalogCount}
            />

            <ProductCatalogTable
              products={pos.filteredProducts}
              loading={pos.loading}
              error={pos.error}
              onAddProduct={pos.addProductToTicket}
            />
          </div>

          <TicketSummary
            saleId="Pendiente"
            items={pos.ticketItems}
            totals={pos.totals}
            onUpdateQty={pos.updateItemQty}
            onRemoveItem={pos.removeItem}
            onClearTicket={pos.clearTicket}
            onCheckout={(method) =>
              pos.ticketItems.length > 0 && setCheckoutModal({ method })
            }
          />
        </div>
      </div>

      {/* Modal informativo de cobro (modo solo lectura) */}
      <Modal
        isOpen={Boolean(checkoutModal)}
        onClose={() => setCheckoutModal(null)}
        title="Modo Solo Lectura"
        icon="info"
      >
        {checkoutModal && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Método Seleccionado
                </span>
                <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {checkoutModal.method}
                </p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Total Calculado
                </span>
                <p className="font-headline-sm text-headline-sm font-bold text-primary">
                  {formatCurrency(pos.totals.totalAmount)} MXN
                </p>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Por el momento el sistema está en modo <strong>solo lectura</strong>. El registro de ventas en la base de datos (<code>venta</code>, <code>d_venta</code> y descuento en <code>inventario</code>) se habilitará en la siguiente fase.
            </p>

            <div className="flex justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => setCheckoutModal(null)}
                className="px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Atajos */}
      <Modal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        title="Atajos de Teclado POS"
        icon="keyboard"
      >
        <ul className="space-y-2.5 font-body-md text-body-md">
          <li className="flex justify-between items-center py-1.5 border-b border-surface-container">
            <span>Enfocar buscador de productos</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-high font-code-num text-label-md">
              F2
            </kbd>
          </li>
          <li className="flex justify-between items-center py-1.5 border-b border-surface-container">
            <span>Cobrar en Efectivo</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-high font-code-num text-label-md">
              F9
            </kbd>
          </li>
          <li className="flex justify-between items-center py-1.5 border-b border-surface-container">
            <span>Cobrar con Tarjeta</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-high font-code-num text-label-md">
              F10
            </kbd>
          </li>
          <li className="flex justify-between items-center py-1.5">
            <span>Cobrar y emitir ticket</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-high font-code-num text-label-md">
              F12
            </kbd>
          </li>
        </ul>
      </Modal>
    </DashboardLayout>
  );
}
