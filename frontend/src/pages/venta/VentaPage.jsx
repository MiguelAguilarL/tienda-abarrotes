import { useCallback, useState } from 'react';
import Modal from '../../components/common/Modal';
import SaleTicketModal from '../../components/common/SaleTicketModal';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CatalogSearch from '../../components/venta/CatalogSearch';
import CategoryFilter from '../../components/venta/CategoryFilter';
import CheckoutModal from '../../components/venta/CheckoutModal';
import ProductCatalogTable from '../../components/venta/ProductCatalogTable';
import TicketSummary from '../../components/venta/TicketSummary';
import { usePosCart } from '../../hooks/usePosCart';
import { getSessionEmployee, tiendaApi } from '../../services/api';

/**
 * Pantalla Terminal Punto de Venta (/venta) con registro real de ventas en MySQL.
 */
export default function VentaPage() {
  const [checkoutMethod, setCheckoutMethod] = useState(null);
  const [issuedTicket, setIssuedTicket] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const sessionEmp = getSessionEmployee();
  const employee = sessionEmp || {
    id_empleado: 1,
    nombre_empleado: 'Carlos López',
    puesto: 'Vendedor',
  };

  const handleRequestCheckout = useCallback((method) => {
    setCheckoutMethod(method);
  }, []);

  const pos = usePosCart({ onRequestCheckout: handleRequestCheckout });

  const handleConfirmSale = async (clientAndPaymentPayload, cashInfo) => {
    const items = pos.ticketItems.map((item) => ({
      id_producto: item.id_producto,
      cantidad_venta: item.cantidad,
    }));

    const createdSale = await tiendaApi.createVenta({
      ...clientAndPaymentPayload,
      items,
    });

    pos.clearTicket();
    pos.reloadProducts();
    setCheckoutMethod(null);
    setIssuedTicket({
      ...createdSale,
      ...(cashInfo || {}),
    });
  };

  return (
    <DashboardLayout
      variant="pos"
      employeeName={employee.nombre_empleado}
      employeeRole={employee.puesto}
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
            saleId="Nueva"
            items={pos.ticketItems}
            totals={pos.totals}
            onUpdateQty={pos.updateItemQty}
            onRemoveItem={pos.removeItem}
            onClearTicket={pos.clearTicket}
            onCheckout={(method) =>
              pos.ticketItems.length > 0 && setCheckoutMethod(method)
            }
          />
        </div>
      </div>

      <CheckoutModal
        key={checkoutMethod && pos.ticketItems.length > 0 ? `${checkoutMethod}-${pos.totals.totalAmount}` : 'closed'}
        isOpen={Boolean(checkoutMethod) && pos.ticketItems.length > 0}
        method={checkoutMethod}
        totalAmount={pos.totals.totalAmount}
        totalPieces={pos.totals.totalPieces}
        employee={employee}
        onClose={() => setCheckoutMethod(null)}
        onConfirmSale={handleConfirmSale}
      />

      <SaleTicketModal
        sale={issuedTicket}
        onClose={() => setIssuedTicket(null)}
      />

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
