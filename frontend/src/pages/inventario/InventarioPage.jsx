import { useState } from 'react';
import Modal from '../../components/common/Modal';
import InventoryFilters from '../../components/inventario/InventoryFilters';
import InventoryKpiCards from '../../components/inventario/InventoryKpiCards';
import InventoryTable from '../../components/inventario/InventoryTable';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useInventory } from '../../hooks/useInventory';
import { getSessionEmployee } from '../../services/api';

/**
 * Pantalla de Control de Inventario (/inventario) conectada a MySQL (solo lectura).
 */
export default function InventarioPage() {
  const inventory = useInventory();
  const [readOnlyAction, setReadOnlyAction] = useState(null);

  const sessionEmp = getSessionEmployee();
  const employeeName = sessionEmp?.nombre_empleado || 'Juan Pérez';
  const employeeRole =
    sessionEmp?.puesto === 'Almacen'
      ? 'Encargado de Almacén'
      : sessionEmp?.puesto || 'Encargado de Almacén';

  const handleExportCsv = () => {
    const headers = [
      'id_inventario',
      'id_producto',
      'nombre_producto',
      'categoria',
      'p_actual',
      'stock',
      'f_entrada',
      'f_caducidad',
    ];
    const rows = inventory.paginatedItems.map((i) => [
      i.id_inventario,
      i.id_producto,
      `"${i.nombre_producto}"`,
      i.categoria,
      i.p_actual,
      i.stock,
      i.f_entrada,
      i.f_caducidad,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventario_bd.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      variant="warehouse"
      employeeName={employeeName}
      employeeRole={employeeRole}
    >
      <div className="py-space-lg flex flex-col w-full gap-space-lg">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-outline mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">
                Módulo Operativo
              </span>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                Almacén Central
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Control de Inventario
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Supervisión de existencias en tiempo real, rotación de almacén y monitoreo de caducidades críticas.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              type="button"
              onClick={() => setReadOnlyAction('Agregar producto nuevo')}
              className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold shadow-sm hover:bg-primary transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                add_box
              </span>
              <span>+ Agregar Producto Nuevo</span>
            </button>
          </div>
        </div>

        <InventoryKpiCards
          criticalCount={inventory.kpis.criticalCount}
          expiringCount={inventory.kpis.expiringCount}
        />

        <InventoryFilters
          searchQuery={inventory.searchQuery}
          onSearchChange={inventory.handleSearchChange}
          categoryFilter={inventory.categoryFilter}
          onCategoryChange={inventory.handleCategoryChange}
          statusFilter={inventory.statusFilter}
          onStatusChange={inventory.handleStatusChange}
          onExport={handleExportCsv}
          onRefresh={inventory.refresh}
        />

        <InventoryTable
          items={inventory.paginatedItems}
          loading={inventory.loading}
          error={inventory.error}
          totalCount={inventory.totalCount}
          currentPage={inventory.currentPage}
          totalPages={inventory.totalPages}
          pageSize={inventory.pageSize}
          onPageChange={inventory.setCurrentPage}
          onReadOnlyAction={(action) => setReadOnlyAction(action)}
        />

        {/* Banner de sincronización */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Conectado a Base de Datos MySQL
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Los lotes, precios y existencias mostrados provienen directamente de las tablas <code>producto</code> e <code>inventario</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm text-on-secondary-container font-label-md text-label-md bg-secondary-fixed/40 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>Modo Solo Lectura</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(readOnlyAction)}
        onClose={() => setReadOnlyAction(null)}
        title="Modo Solo Lectura"
        icon="info"
      >
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
          La acción <strong>{readOnlyAction}</strong> no modifica la base de datos por el momento. Las operaciones de escritura (alta, edición y baja en MySQL) se implementarán en la siguiente fase.
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setReadOnlyAction(null)}
            className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
