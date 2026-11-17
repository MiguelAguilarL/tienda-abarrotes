import { useEffect, useMemo, useState } from 'react';
import SaleTicketModal from '../../components/common/SaleTicketModal';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getSessionEmployee, tiendaApi } from '../../services/api';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

/**
 * Pantalla de Reportes (/reportes):
 * Muestra la tabla de todas las ventas realizadas en MySQL y permite ver el ticket al hacer clic.
 */
export default function ReportesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const sessionEmp = getSessionEmployee();
  const employeeName = sessionEmp?.nombre_empleado || 'Carlos López';
  const employeeRole = sessionEmp?.puesto || 'Vendedor';

  const loadSales = () => {
    setLoading(true);
    setError(null);
    tiendaApi
      .getVentas()
      .then((data) => setSales(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    tiendaApi
      .getVentas()
      .then((data) => {
        if (active) setSales(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
    const cashCount = sales.filter((s) => s.m_pago === 'Efectivo').length;
    const cardCount = sales.filter((s) => s.m_pago === 'Tarjeta').length;
    return { totalRevenue, cashCount, cardCount };
  }, [sales]);

  const handleRowClick = async (idVenta) => {
    setLoadingTicket(true);
    try {
      const detail = await tiendaApi.getVentaById(idVenta);
      setSelectedTicket(detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTicket(false);
    }
  };

  return (
    <DashboardLayout
      variant={sessionEmp?.puesto === 'Almacen' ? 'warehouse' : 'pos'}
      employeeName={employeeName}
      employeeRole={employeeRole}
    >
      <div className="py-space-lg flex flex-col w-full gap-space-lg max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs text-outline mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">
                Módulo de Reportes
              </span>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                Historial de Ventas
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Ventas Realizadas
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Haz clic en cualquier venta de la tabla para visualizar su ticket detallado.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSales}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-sm font-label-lg text-label-lg transition-all self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Actualizar</span>
          </button>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <span className="font-label-md text-label-md text-on-surface-variant block">
              Total de Ventas
            </span>
            <span className="font-headline-lg text-headline-lg text-primary font-bold mt-1 block">
              {sales.length}
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <span className="font-label-md text-label-md text-on-surface-variant block">
              Ingresos Acumulados
            </span>
            <span className="font-headline-lg text-headline-lg text-secondary font-bold mt-1 block">
              {formatCurrency(summary.totalRevenue)}
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <span className="font-label-md text-label-md text-on-surface-variant block">
              Métodos de Pago
            </span>
            <div className="flex items-center gap-space-sm mt-2">
              <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                Efectivo: {summary.cashCount}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                Tarjeta: {summary.cardCount}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-md">
            Error al consultar ventas: {error}
          </div>
        )}

        {/* Tabla de ventas */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider select-none">
                  <th className="py-3.5 px-space-md font-semibold">Folio</th>
                  <th className="py-3.5 px-space-md font-semibold">Fecha y Hora</th>
                  <th className="py-3.5 px-space-md font-semibold">Empleado</th>
                  <th className="py-3.5 px-space-md font-semibold">Cliente</th>
                  <th className="py-3.5 px-space-md font-semibold text-center">
                    Método de Pago
                  </th>
                  <th className="py-3.5 px-space-md font-semibold text-center">
                    Piezas
                  </th>
                  <th className="py-3.5 px-space-md font-semibold text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface font-body-md text-body-md">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 px-space-md text-center text-on-surface-variant"
                    >
                      Cargando historial de ventas desde MySQL...
                    </td>
                  </tr>
                ) : sales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 px-space-md text-center text-on-surface-variant"
                    >
                      No hay ventas registradas todavía.
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr
                      key={sale.id_venta}
                      onClick={() => handleRowClick(sale.id_venta)}
                      className="hover:bg-primary-fixed/25 transition-colors cursor-pointer"
                      title="Clic para ver el ticket de venta"
                    >
                      <td className="py-3.5 px-space-md font-code-num font-bold text-primary">
                        #{sale.id_venta}
                      </td>
                      <td className="py-3.5 px-space-md font-code-num text-body-sm text-on-surface-variant">
                        {formatDateTime(sale.fecha_venta)}
                      </td>
                      <td className="py-3.5 px-space-md font-semibold">
                        {sale.nombre_empleado}
                      </td>
                      <td className="py-3.5 px-space-md">
                        <div>{sale.nombre_cliente}</div>
                        <div className="font-body-sm text-body-sm text-outline">
                          {sale.correo}
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                            sale.m_pago === 'Efectivo'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-primary-fixed text-on-primary-fixed'
                          }`}
                        >
                          {sale.m_pago}
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md text-center font-code-num">
                        {sale.total_piezas}
                      </td>
                      <td className="py-3.5 px-space-md text-right font-code-num font-bold text-on-surface">
                        {formatCurrency(sale.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {loadingTicket && (
        <div className="fixed bottom-4 right-4 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg shadow-lg font-label-md text-label-md">
          Cargando ticket...
        </div>
      )}

      <SaleTicketModal
        sale={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </DashboardLayout>
  );
}
