import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import InventoryFilters from '../../components/inventario/InventoryFilters';
import InventoryKpiCards from '../../components/inventario/InventoryKpiCards';
import InventoryTable from '../../components/inventario/InventoryTable';
import ProductModal from '../../components/inventario/ProductModal';
import { useInventory } from '../../hooks/useInventory';

/**
 * Pantalla de Control de Inventario (/inventario).
 */
export default function InventarioPage() {
  const inventory = useInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'SKU', 'Producto', 'Categoria', 'Precio', 'Stock', 'Entrada', 'Caducidad'];
    const rows = inventory.paginatedItems.map((i) => [
      i.inv_code,
      i.sku,
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
    link.download = 'inventario_mock.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      variant="warehouse"
      employeeName="Juan Pérez"
      employeeRole="Encargado de Almacén"
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
              onClick={handleOpenCreate}
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
          onRefresh={inventory.resetFilters}
        />

        <InventoryTable
          items={inventory.paginatedItems}
          totalCount={inventory.totalCount}
          currentPage={inventory.currentPage}
          totalPages={inventory.totalPages}
          pageSize={inventory.pageSize}
          onPageChange={inventory.setCurrentPage}
          onEdit={handleOpenEdit}
          onDelete={inventory.deleteItem}
        />

        {/* Banner de sincronización POS */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Sincronización POS &amp; Almacén
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Los movimientos en caja registradora descuentan existencias automáticamente en este libro de inventario.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm text-on-secondary-container font-label-md text-label-md bg-secondary-fixed/40 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>Terminal POS 1: En Línea</span>
          </div>
        </div>
      </div>

      <ProductModal
        key={editingItem ? editingItem.id_inventario : modalOpen ? 'new' : 'closed'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
        onSave={inventory.saveItem}
      />
    </DashboardLayout>
  );
}
