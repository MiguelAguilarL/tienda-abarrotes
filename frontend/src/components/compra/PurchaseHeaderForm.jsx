/**
 * Tarjeta superior de datos generales de la remisión de compra con proveedores reales.
 */
export default function PurchaseHeaderForm({
  providers,
  providerId,
  onProviderChange,
  employeeLabel,
  purchaseDate,
  onDateChange,
  invoiceNumber,
  onInvoiceChange,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">
            receipt_long
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Datos Generales de la Remisión
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
          Paso 1 de 2: Encabezado
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Proveedor */}
        <div className="flex flex-col gap-space-xs">
          <label
            className="font-label-md text-label-md text-on-surface"
            htmlFor="vendor-select"
          >
            Proveedor *
          </label>
          <div className="relative">
            <select
              id="vendor-select"
              value={providerId}
              onChange={(e) => onProviderChange(Number(e.target.value))}
              className="w-full h-11 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all cursor-pointer"
            >
              {providers.length === 0 ? (
                <option value="">Sin proveedores</option>
              ) : (
                providers.map((prov) => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.nombre_proveedor}
                  </option>
                ))
              )}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Empleado Responsable */}
        <div className="flex flex-col gap-space-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Empleado Responsable
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
              badge
            </span>
            <input
              type="text"
              readOnly
              value={employeeLabel}
              className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface-container text-on-surface-variant font-code-num text-code-num cursor-not-allowed select-none"
            />
          </div>
        </div>

        {/* Fecha de Recepción */}
        <div className="flex flex-col gap-space-xs">
          <label
            className="font-label-md text-label-md text-on-surface"
            htmlFor="purchase-date"
          >
            Fecha de Recepción *
          </label>
          <input
            id="purchase-date"
            type="date"
            value={purchaseDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
          />
        </div>

        {/* N° Factura / Remisión */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label
              className="font-label-md text-label-md text-on-surface"
              htmlFor="invoice-number"
            >
              N° Factura / Remisión
            </label>
            <span className="font-label-sm text-label-sm text-outline">
              Opcional
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
              receipt
            </span>
            <input
              id="invoice-number"
              type="text"
              value={invoiceNumber}
              onChange={(e) => onInvoiceChange(e.target.value)}
              placeholder="Ej. FAC-88492"
              className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface font-code-num text-code-num uppercase placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
