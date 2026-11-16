/**
 * Datos Mock alineados al esquema de references/bd/estructura.sql
 * Se utilizan mientras el backend/BD no cuenta con registros.
 */

export const MOCK_EMPLEADOS = [
  {
    id_empleado: 1,
    codigo: 'EMP-104',
    nombre_empleado: 'Carlos López',
    puesto: 'Vendedor',
  },
  {
    id_empleado: 2,
    codigo: 'EMP-201',
    nombre_empleado: 'Juan Pérez',
    puesto: 'Almacen',
  },
];

export const MOCK_CLIENTES = [
  {
    id_cliente: 1,
    nombre_cliente: 'Público en General',
    correo: 'mostrador@tiendaabarrotes.local',
  },
];

export const MOCK_PROVEEDORES = [
  {
    id_proveedor: 1,
    nombre_proveedor: 'Distribuidora Abarrotera Central S.A.',
    correo_proveedor: 'ventas@abarroteracentral.com',
    tel: '5512345678',
  },
  {
    id_proveedor: 2,
    nombre_proveedor: 'Lácteos Santa Clara S.A.',
    correo_proveedor: 'pedidos@santaclara.com',
    tel: '5587654321',
  },
  {
    id_proveedor: 3,
    nombre_proveedor: 'Bebidas Mundiales S.A. de C.V.',
    correo_proveedor: 'distribucion@bebidasmundiales.mx',
    tel: '5544332211',
  },
  {
    id_proveedor: 4,
    nombre_proveedor: 'Harinas y Panificados del Norte',
    correo_proveedor: 'contacto@harinasnorte.com',
    tel: '5599887766',
  },
];

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

export const MOCK_PRODUCTOS = [
  {
    id_producto: 1,
    sku: 'SKU-7501002',
    inv_code: '#INV-101',
    codigo_compra: 'LAC-001',
    nombre_producto: 'Leche Entera 1L',
    especificacion: 'Pasteurizada | Envase Tetrapak UHT',
    categoria: 'Lacteos',
    p_actual: 26.5,
    costo_base: 18.5,
    icono: 'local_drink',
    icono_color: 'text-primary',
  },
  {
    id_producto: 2,
    sku: 'SKU-7501009',
    inv_code: '#INV-102',
    codigo_compra: 'ABA-102',
    nombre_producto: 'Arroz Grano Extra 1kg',
    especificacion: 'Grano Seleccionado | Bolsa polietileno',
    categoria: 'Abarrotes',
    p_actual: 32.0,
    costo_base: 22.0,
    icono: 'grain',
    icono_color: 'text-tertiary',
  },
  {
    id_producto: 3,
    sku: 'SKU-7501015',
    inv_code: '#INV-105',
    codigo_compra: 'ABA-105',
    nombre_producto: 'Frijol Negro 1kg',
    especificacion: 'Tipo Michoacán | Bolsa termosellada',
    categoria: 'Abarrotes',
    p_actual: 38.0,
    costo_base: 26.0,
    icono: 'nutrition',
    icono_color: 'text-tertiary',
  },
  {
    id_producto: 4,
    sku: 'SKU-7501022',
    inv_code: '#INV-106',
    codigo_compra: 'BEB-201',
    nombre_producto: 'Refresco Cola 600ml',
    especificacion: 'Botella no retornable',
    categoria: 'Bebidas',
    p_actual: 18.5,
    costo_base: 17.0,
    icono: 'sports_bar',
    icono_color: 'text-primary',
  },
  {
    id_producto: 5,
    sku: 'SKU-7501030',
    inv_code: '#INV-107',
    codigo_compra: 'BEB-204',
    nombre_producto: 'Agua Purificada 1.5L',
    especificacion: 'Baja en sodio',
    categoria: 'Bebidas',
    p_actual: 14.0,
    costo_base: 8.5,
    icono: 'water_bottle',
    icono_color: 'text-primary',
  },
  {
    id_producto: 6,
    sku: 'SKU-7501045',
    inv_code: '#INV-108',
    codigo_compra: 'LIM-404',
    nombre_producto: 'Detergente Multiusos 900g',
    especificacion: 'Biodegradable limón',
    categoria: 'Limpieza',
    p_actual: 29.0,
    costo_base: 15.0,
    icono: 'cleaning_services',
    icono_color: 'text-secondary',
  },
  {
    id_producto: 7,
    sku: 'SKU-7501051',
    inv_code: '#INV-111',
    codigo_compra: 'LIM-409',
    nombre_producto: 'Jabón de Barra Neutro 400g',
    especificacion: 'Hipoalergénico',
    categoria: 'Limpieza',
    p_actual: 17.5,
    costo_base: 11.0,
    icono: 'soap',
    icono_color: 'text-secondary',
  },
  {
    id_producto: 8,
    sku: 'SKU-7501062',
    inv_code: '#INV-103',
    codigo_compra: 'PAN-501',
    nombre_producto: 'Pan de Caja Blanco 680g',
    especificacion: 'Envoltura sellada | Rebanado',
    categoria: 'Panaderia',
    p_actual: 45.0,
    costo_base: 32.0,
    icono: 'bakery_dining',
    icono_color: 'text-tertiary',
  },
  {
    id_producto: 9,
    sku: 'SKU-7501074',
    inv_code: '#INV-104',
    codigo_compra: 'FRE-309',
    nombre_producto: 'Huevo Blanco Cono 30 pzas',
    especificacion: 'Empaque de cartón reciclado | Granja San Juan',
    categoria: 'Frescos',
    p_actual: 84.0,
    costo_base: 64.0,
    icono: 'egg',
    icono_color: 'text-tertiary',
  },
  {
    id_producto: 10,
    sku: 'SKU-7501089',
    inv_code: '#INV-112',
    codigo_compra: 'OTR-901',
    nombre_producto: 'Azúcar Estándar 1kg',
    especificacion: 'Caña pura',
    categoria: 'Otros',
    p_actual: 28.0,
    costo_base: 19.5,
    icono: 'inventory_2',
    icono_color: 'text-on-surface-variant',
  },
];

// Fechas relativas para simular lotes vigentes y próximos a vencer (< 7 días)
const daysFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const INITIAL_INVENTARIO = [
  {
    id_inventario: 101,
    id_producto: 1,
    f_entrada: daysFromToday(-6),
    f_caducidad: daysFromToday(3),
    stock: 6,
  },
  {
    id_inventario: 102,
    id_producto: 2,
    f_entrada: daysFromToday(-23),
    f_caducidad: daysFromToday(295),
    stock: 48,
  },
  {
    id_inventario: 103,
    id_producto: 8,
    f_entrada: daysFromToday(-4),
    f_caducidad: daysFromToday(2),
    stock: 5,
  },
  {
    id_inventario: 104,
    id_producto: 9,
    f_entrada: daysFromToday(-8),
    f_caducidad: daysFromToday(5),
    stock: 8,
  },
  {
    id_inventario: 105,
    id_producto: 3,
    f_entrada: daysFromToday(-19),
    f_caducidad: daysFromToday(400),
    stock: 55,
  },
  {
    id_inventario: 106,
    id_producto: 4,
    f_entrada: daysFromToday(-12),
    f_caducidad: daysFromToday(180),
    stock: 88,
  },
  {
    id_inventario: 107,
    id_producto: 5,
    f_entrada: daysFromToday(-10),
    f_caducidad: daysFromToday(320),
    stock: 54,
  },
  {
    id_inventario: 108,
    id_producto: 6,
    f_entrada: daysFromToday(-15),
    f_caducidad: daysFromToday(500),
    stock: 22,
  },
  {
    id_inventario: 109,
    id_producto: 7,
    f_entrada: daysFromToday(-16),
    f_caducidad: daysFromToday(420),
    stock: 7,
  },
  {
    id_inventario: 110,
    id_producto: 10,
    f_entrada: daysFromToday(-14),
    f_caducidad: daysFromToday(240),
    stock: 50,
  },
];

export const INITIAL_TICKET_ITEMS = [
  { id_producto: 1, cantidad: 2 },
  { id_producto: 8, cantidad: 1 },
  { id_producto: 4, cantidad: 3 },
  { id_producto: 9, cantidad: 1 },
];

export const INITIAL_COMPRA_ITEMS = [
  { rowId: 1, id_producto: 1, cantidad_compra: 40, costo: 18.5 },
  { rowId: 2, id_producto: 2, cantidad_compra: 25, costo: 22.0 },
  { rowId: 3, id_producto: 3, cantidad_compra: 50, costo: 26.0 },
  { rowId: 4, id_producto: 4, cantidad_compra: 15, costo: 17.0 },
];

export function formatCurrency(amount) {
  return (
    '$' +
    Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatShortDate(isoDate) {
  if (!isoDate) return '-';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function getDaysUntil(isoDate) {
  if (!isoDate) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}
