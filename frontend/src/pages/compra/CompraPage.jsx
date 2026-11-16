import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import PurchaseHeaderForm from '../../components/compra/PurchaseHeaderForm';
import PurchaseItemsTable from '../../components/compra/PurchaseItemsTable';
import PurchaseSummary from '../../components/compra/PurchaseSummary';
import { formatCurrency } from '../../data/mockData';
import { usePurchaseOrder } from '../../hooks/usePurchaseOrder';

/**
 * Pantalla de Registro de Compras a Proveedores (/compra).
 */
export default function CompraPage() {
  const order = usePurchaseOrder();
  const [confirmModal, setConfirmModal] = useState(null);

  const handleRegister = () => {
    const folio = `#OC-2026-${String(order.compraId).padStart(4, '0')}`;
    setConfirmModal({
      folio,
      total: order.summary.total,
      units: order.summary.totalUnits,
    });
    order.registerOrder();
  };

  return (
    <DashboardLayout
      variant="warehouse"
      employeeName="Juan Pérez"
      employeeRole="Encargado de Almacén"
    >
      <div className="py-space-lg flex flex-col gap-space-lg w-full max-w-7xl mx-auto">
        {/* Encabezado de página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Nueva Orden de Compra
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md">
                <span className="material-symbols-outlined text-[15px]">
                  tag
                </span>
                id_compra: {order.compraId}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Registro de entrada de mercancía a inventario y recepción de proveedores
            </p>
          </div>
        </div>

        <PurchaseHeaderForm
          providerId={order.providerId}
          onProviderChange={order.setProviderId}
          purchaseDate={order.purchaseDate}
          onDateChange={order.setPurchaseDate}
          invoiceNumber={order.invoiceNumber}
          onInvoiceChange={order.setInvoiceNumber}
        />

        <PurchaseItemsTable
          items={order.items}
          onProductChange={order.updateItemProduct}
          onQtyChange={order.updateItemQty}
          onCostChange={order.updateItemCost}
          onAddRow={order.addRow}
          onRemoveRow={order.removeRow}
        />

        <PurchaseSummary
          notes={order.notes}
          onNotesChange={order.setNotes}
          summary={order.summary}
          onCancel={order.resetOrder}
          onRegister={handleRegister}
        />
      </div>

      <Modal
        isOpen={Boolean(confirmModal)}
        onClose={() => setConfirmModal(null)}
        title="Orden de Compra Registrada"
        icon="task_alt"
      >
        {confirmModal && (
          <div className="flex flex-col gap-space-md">
            <p className="font-body-md text-body-md text-on-surface-variant">
              La orden de compra <strong className="text-primary">{confirmModal.folio}</strong> fue registrada en modo mock con{' '}
              <strong>{confirmModal.units} unidades</strong> y un total de{' '}
              <strong className="text-on-surface">
                {formatCurrency(confirmModal.total)} MXN
              </strong>.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
