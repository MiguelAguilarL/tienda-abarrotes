const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const SESSION_KEY = 'tienda_empleado_activo';

async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(
      payload.error || `Error HTTP ${response.status} al consultar ${endpoint}`,
    );
  }

  return payload.data;
}

export const tiendaApi = {
  getEmpleados: () => apiGet('/empleados'),
  getProveedores: () => apiGet('/proveedores'),
  getProductos: () => apiGet('/productos'),
  getInventario: () => apiGet('/inventario'),
};

export function getSessionEmployee() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSessionEmployee(empleado) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(empleado));
  } catch {
    // Ignorar si sessionStorage no está disponible
  }
}

export function clearSessionEmployee() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignorar
  }
}
