import { useEffect, useState } from 'react';
import { tiendaApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import Modal from '../common/Modal';

/**
 * Modal de confirmación de cobro:
 * - Solicita información del cliente (por defecto, existente o nuevo).
 * - Si el método de pago es Efectivo, solicita el monto pagado y calcula el cambio.
 */
export default function CheckoutModal({
  isOpen,
  method,
  totalAmount,
  totalPieces,
  employee,
  onClose,
  onConfirmSale,
}) {
  const [clients, setClients] = useState([]);
  const [clientMode, setClientMode] = useState('default'); // 'default' | 'existing' | 'new'
  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  const [cashReceived, setCashReceived] = useState(() =>
    method === 'Efectivo' ? String(totalAmount.toFixed(2)) : '',
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    tiendaApi
      .getClientes()
      .then((data) => {
        if (!active) return;
        setClients(data);
        if (data.length > 0) setSelectedClientId(String(data[0].id_cliente));
      })
      .catch(() => {
        // Si falla la carga de clientes, sigue disponible el modo por defecto
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isCash = method === 'Efectivo';
  const parsedCash = Number(cashReceived);
  const cashChange = isCash ? parsedCash - totalAmount : 0;
  const isCashInvalid =
    isCash && (Number.isNaN(parsedCash) || parsedCash < totalAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    if (isCashInvalid) {
      setError('El monto recibido en efectivo debe ser mayor o igual al total.');
      return;
    }

    if (clientMode === 'new') {
      const hasName = newClientName.trim().length > 0;
      const hasEmail = newClientEmail.trim().length > 0;
      if ((hasName && !hasEmail) || (!hasName && hasEmail)) {
        setError(
          'Ingresa nombre y correo del cliente, o selecciona "Cliente por defecto".',
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        id_empleado: employee.id_empleado,
        m_pago: method,
        id_cliente:
          clientMode === 'existing' && selectedClientId
            ? Number(selectedClientId)
            : null,
        cliente_nuevo:
          clientMode === 'new' &&
          newClientName.trim() &&
          newClientEmail.trim()
            ? {
                nombre_cliente: newClientName.trim(),
                correo: newClientEmail.trim(),
              }
            : null,
      };

      await onConfirmSale(payload, isCash ? { monto_pagado: parsedCash, cambio: cashChange } : null);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Cobro de Venta"
      icon="point_of_sale"
    >
      <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
        {/* Resumen rápido */}
        <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-outline uppercase">
              Método / Vendedor
            </span>
            <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {method} • {employee.nombre_empleado}
            </p>
          </div>
          <div className="text-right">
            <span className="font-label-sm text-label-sm text-outline uppercase">
              Total ({totalPieces} pzas)
            </span>
            <p className="font-headline-md text-headline-md font-bold text-primary">
              {formatCurrency(totalAmount)} MXN
            </p>
          </div>
        </div>

        {/* Información del Cliente */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Información del Cliente
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'default', label: 'Por defecto' },
              { id: 'existing', label: 'Existente' },
              { id: 'new', label: 'Nuevo cliente' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setClientMode(opt.id)}
                className={`py-2 px-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  clientMode === opt.id
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {clientMode === 'default' && (
            <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low/60 p-2.5 rounded-lg mt-1">
              Se registrará con el cliente por defecto de mostrador (Público en General).
            </p>
          )}

          {clientMode === 'existing' && (
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="mt-1 h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
            >
              {clients.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  #{c.id_cliente} — {c.nombre_cliente} ({c.correo})
                </option>
              ))}
            </select>
          )}

          {clientMode === 'new' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <input
                type="text"
                placeholder="Nombre completo"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>
          )}
        </div>

        {/* Monto en efectivo y cálculo de cambio */}
        {isCash && (
          <div className="bg-secondary-fixed/25 rounded-xl p-space-md flex flex-col gap-space-sm">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="cash-received"
                className="font-label-md text-label-md text-on-surface"
              >
                Monto recibido en efectivo ($) *
              </label>
              <input
                id="cash-received"
                type="number"
                step="0.50"
                min={totalAmount}
                required
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="h-11 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-code-num text-headline-sm font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                Cambio a entregar:
              </span>
              <span
                className={`font-code-num text-headline-sm font-bold ${
                  isCashInvalid ? 'text-error' : 'text-secondary'
                }`}
              >
                {isCashInvalid
                  ? 'Monto insuficiente'
                  : `${formatCurrency(cashChange)} MXN`}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || isCashInvalid}
            className="px-space-md py-2.5 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-label-lg text-label-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
            <span>{submitting ? 'Registrando...' : 'Confirmar & Emitir Ticket'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
