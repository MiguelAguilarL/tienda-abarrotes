/**
 * Utilidades de formato y mapeo visual por categoría (ENUM de estructura.sql).
 */

export const CATEGORY_LABELS = {
  Lacteos: 'Lácteos',
  Abarrotes: 'Abarrotes',
  Bebidas: 'Bebidas',
  Limpieza: 'Limpieza',
  Panaderia: 'Panadería',
  Frescos: 'Frescos',
  Otros: 'Otros',
};

export const CATEGORY_BADGE_CLASSES = {
  Lacteos: 'bg-surface-container-high text-primary',
  Abarrotes: 'bg-tertiary-fixed text-on-tertiary-fixed',
  Bebidas: 'bg-primary-fixed text-on-primary-fixed',
  Limpieza: 'bg-secondary-container text-on-secondary-container',
  Panaderia: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  Frescos: 'bg-secondary-fixed text-on-secondary-fixed',
  Otros: 'bg-surface-container text-on-surface',
};

export const CATEGORY_ICONS = {
  Lacteos: { icon: 'local_drink', color: 'text-primary' },
  Abarrotes: { icon: 'grain', color: 'text-tertiary' },
  Bebidas: { icon: 'sports_bar', color: 'text-primary' },
  Limpieza: { icon: 'cleaning_services', color: 'text-secondary' },
  Panaderia: { icon: 'bakery_dining', color: 'text-tertiary' },
  Frescos: { icon: 'egg', color: 'text-tertiary' },
  Otros: { icon: 'inventory_2', color: 'text-on-surface-variant' },
};

export function formatCurrency(amount) {
  return (
    '$' +
    Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatShortDate(dateValue) {
  if (!dateValue) return '-';
  const datePart = String(dateValue).split('T')[0];
  const parts = datePart.split('-');
  if (parts.length !== 3) return datePart;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function getDaysUntil(dateValue) {
  if (!dateValue) return 999;
  const datePart = String(dateValue).split('T')[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${datePart}T00:00:00`);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}
