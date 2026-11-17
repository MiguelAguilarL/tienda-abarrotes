import { tiendaModel } from '../models/tiendaModel.js';

/**
 * Capa de servicio: validación de reglas de negocio y normalización de datos.
 */
export const tiendaService = {
  async checkHealth() {
    return tiendaModel.checkHealth();
  },

  async listarEmpleados() {
    return tiendaModel.getEmpleados();
  },

  async listarClientes() {
    return tiendaModel.getClientes();
  },

  async listarProveedores() {
    return tiendaModel.getProveedores();
  },

  async listarProductos() {
    const rows = await tiendaModel.getProductosConStock();
    return rows.map((row) => ({
      ...row,
      p_actual: Number(row.p_actual),
      stock: Number(row.stock),
    }));
  },

  async listarInventario() {
    const rows = await tiendaModel.getInventario();
    return rows.map((row) => ({
      ...row,
      p_actual: Number(row.p_actual),
      stock: Number(row.stock),
    }));
  },

  async listarVentas() {
    const rows = await tiendaModel.getVentas();
    return rows.map((row) => ({
      ...row,
      total_piezas: Number(row.total_piezas),
      total: Number(row.total),
    }));
  },

  async obtenerVentaPorId(idVenta) {
    const id = Number(idVenta);
    if (!Number.isInteger(id) || id <= 0) {
      const err = new Error('ID de venta inválido.');
      err.statusCode = 400;
      throw err;
    }
    const venta = await tiendaModel.getVentaById(id);
    if (!venta) {
      const err = new Error(`No se encontró la venta #${id}.`);
      err.statusCode = 404;
      throw err;
    }
    return venta;
  },

  async registrarVenta(payload) {
    const { id_empleado, id_cliente, cliente_nuevo, m_pago, items } =
      payload || {};

    const empId = Number(id_empleado);
    if (!Number.isInteger(empId) || empId <= 0) {
      const err = new Error('Se requiere un id_empleado válido.');
      err.statusCode = 400;
      throw err;
    }

    if (m_pago !== 'Efectivo' && m_pago !== 'Tarjeta') {
      const err = new Error("Método de pago inválido. Usa 'Efectivo' o 'Tarjeta'.");
      err.statusCode = 400;
      throw err;
    }

    if (!Array.isArray(items) || items.length === 0) {
      const err = new Error('La venta debe incluir al menos un producto.');
      err.statusCode = 400;
      throw err;
    }

    // Regla anti-duplicados en d_venta: no permitir dos veces el mismo id_producto
    const seenProducts = new Set();
    const normalizedItems = items.map((item) => {
      const prodId = Number(item.id_producto);
      const qty = Number(item.cantidad_venta);

      if (!Number.isInteger(prodId) || prodId <= 0) {
        const err = new Error('Producto inválido en el detalle de venta.');
        err.statusCode = 400;
        throw err;
      }
      if (!Number.isInteger(qty) || qty <= 0) {
        const err = new Error(
          `La cantidad para el producto ${prodId} debe ser mayor a 0.`,
        );
        err.statusCode = 400;
        throw err;
      }
      if (seenProducts.has(prodId)) {
        const err = new Error(
          `Producto duplicado en d_venta (id_producto=${prodId}). Cada producto solo puede aparecer una vez por venta.`,
        );
        err.statusCode = 400;
        throw err;
      }
      seenProducts.add(prodId);

      return { id_producto: prodId, cantidad_venta: qty };
    });

    if (
      cliente_nuevo &&
      ((cliente_nuevo.nombre_cliente && !cliente_nuevo.correo) ||
        (!cliente_nuevo.nombre_cliente && cliente_nuevo.correo))
    ) {
      const err = new Error(
        'Para registrar un cliente nuevo debes proporcionar nombre y correo, o dejar ambos vacíos para usar el cliente por defecto.',
      );
      err.statusCode = 400;
      throw err;
    }

    return tiendaModel.createVentaTransaction({
      id_empleado: empId,
      id_cliente: id_cliente ? Number(id_cliente) : null,
      cliente_nuevo:
        cliente_nuevo?.nombre_cliente && cliente_nuevo?.correo
          ? cliente_nuevo
          : null,
      m_pago,
      items: normalizedItems,
    });
  },
};
