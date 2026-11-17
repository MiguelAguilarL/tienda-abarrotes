import { formatCurrency, formatDateTime } from '../../utils/formatters';
import Modal from './Modal';

/**
 * Modal reutilizable que muestra el Ticket de Venta completo.
 * Si la venta fue en efectivo e incluye pago/cambio, lo muestra en el desglose.
 */
export default function SaleTicketModal({ sale, onClose }) {
  if (!sale) return null;

  const isCash = sale.m_pago === 'Efectivo';
  const hasCashDetails =
    isCash &&
    typeof sale.monto_pagado === 'number' &&
    typeof sale.cambio === 'number';

  return (
    <Modal
      isOpen={Boolean(sale)}
      onClose={onClose}
      title={`Ticket de Venta #${sale.id_venta}`}
      icon="receipt_long"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-space-md">
        {/* Encabezado del ticket */}
        <div className="text-center border-b border-dashed border-outline-variant pb-space-sm">
          <div className="font-headline-sm text-headline-sm font-bold text-primary">
            TiendaAbarrotes
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            Comprobante de Venta
          </div>
          <div className="font-code-num text-body-sm text-outline mt-1">
            {formatDateTime(sale.fecha_venta)}
          </div>
        </div>

        {/* Metadatos de empleado, cliente y pago */}
        <div className="bg-surface-container-low rounded-lg p-space-sm space-y-1 font-body-sm text-body-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Folio (id_venta):</span>
            <span className="font-code-num font-bold text-primary">
              #{sale.id_venta}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Atendió:</span>
            <span className="font-semibold text-on-surface">
              {sale.nombre_empleado}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Cliente:</span>
            <span className="font-semibold text-on-surface">
              {sale.nombre_cliente}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Método de pago:</span>
            <span
              className={`font-semibold ${
                isCash ? 'text-secondary' : 'text-primary'
              }`}
            >
              {sale.m_pago}
            </span>
          </div>
        </div>

        {/* Detalle de d_venta */}
        <div className="max-h-60 overflow-y-auto divide-y divide-surface-container">
          {(sale.detalles || []).map((item) => (
            <div
              key={item.id_d_venta || item.id_producto}
              className="py-2 flex items-center justify-between gap-2 font-body-md text-body-md"
            >
              <div className="min-w-0">
                <div className="font-semibold text-on-surface truncate">
                  {item.cantidad_venta}x {item.nombre_producto}
                </div>
                <div className="font-code-num text-body-sm text-outline">
                  {formatCurrency(item.p_unitario)} c/u
                </div>
              </div>
              <span className="font-code-num font-bold text-on-surface shrink-0">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Totales y cambio si es efectivo */}
        <div className="border-t border-dashed border-outline-variant pt-space-sm space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="font-label-lg text-label-lg text-on-surface">
              TOTAL ({sale.total_piezas} pzas)
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary">
              {formatCurrency(sale.total)} MXN
            </span>
          </div>

          {hasCashDetails && (
            <>
              <div className="flex justify-between font-code-num text-body-md text-on-surface-variant">
                <span>Efectivo recibido:</span>
                <span>{formatCurrency(sale.monto_pagado)} MXN</span>
              </div>
              <div className="flex justify-between font-code-num text-body-md font-bold text-secondary">
                <span>Cambio entregado:</span>
                <span>{formatCurrency(sale.cambio)} MXN</span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-space-xs">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-colors cursor-pointer"
          >
            Cerrar Ticket
          </button>
        </div>
      </div>
    </Modal>
  );
}
