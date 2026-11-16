import { CATEGORY_LABELS } from '../../data/mockData';

const CATEGORIES = [
  'Lacteos',
  'Abarrotes',
  'Bebidas',
  'Limpieza',
  'Panaderia',
  'Frescos',
  'Otros',
];

/**
 * Filtro tipo píldora por categoría de producto.
 */
export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  totalCount,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl px-space-md py-space-sm shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
      <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider shrink-0 mr-1">
        Filtrar:
      </span>

      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-all active:scale-95 cursor-pointer ${
          selectedCategory === 'all'
            ? 'bg-primary-container text-on-primary shadow-sm'
            : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
        }`}
      >
        Todos ({totalCount})
      </button>

      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-all active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}
