import { CATEGORY_BADGE_CLASSES, CATEGORY_LABELS } from '../../data/mockData';

/**
 * Badge reutilizable para categorías y estados semánticos.
 */
export function CategoryBadge({ categoria }) {
  const colorClass =
    CATEGORY_BADGE_CLASSES[categoria] || 'bg-surface-container text-on-surface';
  const label = CATEGORY_LABELS[categoria] || categoria;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${colorClass}`}
    >
      {label}
    </span>
  );
}

/**
 * Badge para mostrar el nivel de stock (Crítico / Bajo / Óptimo).
 */
export function StockBadge({ stock, showStatusText = false }) {
  const isCritical = stock < 10;

  if (isCritical) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-error" />
        {stock} uds{showStatusText ? (stock <= 6 ? ' - Crítico' : ' - Bajo') : ''}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
      {stock} uds{showStatusText ? ' - Óptimo' : ''}
    </span>
  );
}
