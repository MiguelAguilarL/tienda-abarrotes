const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const SESSION_KEY = 'tienda_empleado_activo';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(
      payload.error || `Error HTTP ${response.status} al consultar ${endpoint}`,
    );
  }

  return payload.data;
}

export const tiendaApi = {
  getEmpleados: () => apiRequest('/empleados'),
  getClientes: () => apiRequest('/clientes'),
  getProveedores: () => apiRequest('/proveedores'),
  getProductos: () => apiRequest('/productos'),
  getInventario: () => apiRequest('/inventario'),
  getVentas: () => apiRequest('/ventas'),
  getVentaById: (id) => apiRequest(`/ventas/${id}`),
  createVenta: (body) =>
    apiRequest('/ventas', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
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
