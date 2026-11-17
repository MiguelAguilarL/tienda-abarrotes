import { useState } from 'react';
import Modal from '../../components/common/Modal';
import PurchaseHeaderForm from '../../components/compra/PurchaseHeaderForm';
import PurchaseItemsTable from '../../components/compra/PurchaseItemsTable';
import PurchaseSummary from '../../components/compra/PurchaseSummary';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { usePurchaseOrder } from '../../hooks/usePurchaseOrder';
import { getSessionEmployee } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

/**
 * Pantalla de Registro de Compras a Proveedores (/compra) conectada a MySQL (solo lectura).
 */
export default function CompraPage() {
  const order = usePurchaseOrder();
  const [readOnlyModal, setReadOnlyModal] = useState(false);

  const sessionEmp = getSessionEmployee();
  const employeeName = sessionEmp?.nombre_empleado || 'Juan Pérez';
  const employeeRole =
    sessionEmp?.puesto === 'Almacen'
      ? 'Encargado de Almacén'
      : sessionEmp?.puesto || 'Encargado de Almacén';
  const employeeLabel = sessionEmp
    ? `${sessionEmp.nombre_empleado} (ID: ${sessionEmp.id_empleado})`
    : 'Juan Pérez (ID: 2)';

  return (
    <DashboardLayout
      variant="warehouse"
      employeeName={employeeName}
      employeeRole={employeeRole}
    >
      <div className="py-space-lg flex flex-col gap-space-lg w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Nueva Orden de Compra
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md">
                <span className="material-symbols-outlined text-[15px]">
                  database
                </span>
                Solo lectura BD
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Registro de entrada de mercancía a inventario y recepción de proveedores
            </p>
          </div>
        </div>

        {order.error && (
          <div className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>Error al cargar datos de MySQL: {order.error}</span>
          </div>
        )}

        {order.loading ? (
          <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center text-on-surface-variant">
            Cargando proveedores y productos desde la base de datos...
          </div>
        ) : (
          <>
            <PurchaseHeaderForm
              providers={order.providers}
              providerId={order.providerId}
              onProviderChange={order.setProviderId}
              employeeLabel={employeeLabel}
              purchaseDate={order.purchaseDate}
              onDateChange={order.setPurchaseDate}
              invoiceNumber={order.invoiceNumber}
              onInvoiceChange={order.setInvoiceNumber}
            />

            <PurchaseItemsTable
              products={order.products}
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
              onRegister={() => setReadOnlyModal(true)}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={readOnlyModal}
        onClose={() => setReadOnlyModal(false)}
        title="Modo Solo Lectura"
        icon="info"
      >
        <div className="flex flex-col gap-space-md">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Por el momento el sistema está en modo <strong>solo lectura</strong>. Total calculado:{' '}
            <strong className="text-primary">
              {formatCurrency(order.summary.total)} MXN
            </strong>{' '}
            ({order.summary.totalUnits} unidades). La inserción en <code>compra</code>, <code>d_compra</code> e <code>inventario</code> se habilitará en la siguiente fase.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setReadOnlyModal(false)}
              className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
