/**
 * Barra superior de búsqueda rápida y acceso a atajos de teclado del POS.
 */
export default function CatalogSearch({
  searchInputRef,
  searchQuery,
  onSearchChange,
  onOpenShortcuts,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row items-center gap-space-md justify-between">
      <div className="relative w-full sm:flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          ref={searchInputRef}
          id="pos-search-input"
          type="text"
          autoFocus
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar producto por nombre o código de barras (ej. F2)..."
          className="w-full pl-10 pr-20 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
        />
      </div>

      <div className="flex items-center gap-space-xs shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">
            keyboard
          </span>
          <span>Atajos [F]</span>
        </button>
      </div>
    </div>
  );
}
