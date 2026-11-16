import { useCallback, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import CatalogSearch from '../../components/venta/CatalogSearch';
import CategoryFilter from '../../components/venta/CategoryFilter';
import ProductCatalogTable from '../../components/venta/ProductCatalogTable';
import TicketSummary from '../../components/venta/TicketSummary';
import { formatCurrency } from '../../data/mockData';
import { usePosCart } from '../../hooks/usePosCart';

/**
 * Pantalla Terminal Punto de Venta (/venta).
 */
export default function VentaPage() {
  const [checkoutModal, setCheckoutModal] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleRequestCheckout = useCallback((method) => {
    setCheckoutModal({ method });
  }, []);

  const pos = usePosCart({ onRequestCheckout: handleRequestCheckout });

  const confirmSale = () => {
    pos.completeSale();
    setCheckoutModal(null);
  };

  return (
    <DashboardLayout
      variant="pos"
      employeeName="Carlos López"
      employeeRole="Vendedor"
    >
      <div className="flex flex-col w-full pb-space-lg">
        <div className="flex flex-col lg:flex-row gap-space-md w-full items-start mt-space-sm">
          {/* COLUMNA IZQUIERDA (69%) */}
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
              onAddProduct={pos.addProductToTicket}
            />
          </div>

          {/* COLUMNA DERECHA (31%) */}
          <TicketSummary
            saleId={pos.saleId}
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

      {/* Modal de Cobro Mock */}
      <Modal
        isOpen={Boolean(checkoutModal)}
        onClose={() => setCheckoutModal(null)}
        title="Confirmar Cobro de Venta"
        icon="point_of_sale"
      >
        {checkoutModal && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Folio de Venta
                </span>
                <p className="font-code-num text-headline-sm font-bold text-primary">
                  id_venta: {pos.saleId}
                </p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Método de Pago
                </span>
                <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {checkoutModal.method}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-baseline px-1">
              <span className="font-body-md text-on-surface-variant">
                Total ({pos.totals.totalPieces} piezas):
              </span>
              <span className="font-headline-lg text-headline-lg font-bold text-primary">
                {formatCurrency(pos.totals.totalAmount)} MXN
              </span>
            </div>

            <div className="flex justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => setCheckoutModal(null)}
                className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmSale}
                className="px-space-md py-2.5 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-label-lg text-label-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                Emitir Ticket
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
