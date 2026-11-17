import { tiendaModel } from '../models/tiendaModel.js';

/**
 * Capa de servicio de solo lectura: normaliza tipos numéricos y fechas
 * sin alterar ni inventar los valores registrados en MySQL.
 */
export const tiendaService = {
  async checkHealth() {
    return tiendaModel.checkHealth();
  },

  async listarEmpleados() {
    return tiendaModel.getEmpleados();
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
};
