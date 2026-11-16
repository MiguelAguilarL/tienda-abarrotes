import { CATEGORY_LABELS } from '../../data/mockData';

/**
 * Barra de búsqueda y filtros combinados para el módulo de inventario.
 */
export default function InventoryFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  onExport,
  onRefresh,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
          search
        </span>
        <input
          id="inventory-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por producto, código de barras o SKU (ej. #INV-101, Leche, Pan)..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest shadow-inner transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
        <div className="relative">
          <select
            id="filter-category"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none bg-surface-container-low text-on-surface font-label-lg text-label-lg font-medium pl-3.5 pr-8 py-2.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
            expand_more
          </span>
        </div>

        <div className="relative">
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none bg-surface-container-low text-on-surface font-label-lg text-label-lg font-medium pl-3.5 pr-8 py-2.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">Estado: Todos</option>
            <option value="critical">Stock Crítico (&lt;10)</option>
            <option value="optimal">Stock Óptimo (10+)</option>
            <option value="expiring">Próximos a Vencer</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
            tune
          </span>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg font-medium transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            file_download
          </span>
          <span>Exportar</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          title="Limpiar filtros y actualizar"
          className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
      </div>
    </div>
  );
}
