import pool from '../db/pool.js';

/**
 * Consultas SQL de solo lectura alineadas a references/bd/estructura.sql.
 */
export const tiendaModel = {
  async checkHealth() {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return rows[0];
  },

  async getEmpleados() {
    const [rows] = await pool.query(
      'SELECT id_empleado, nombre_empleado, puesto FROM empleado ORDER BY id_empleado ASC',
    );
    return rows;
  },

  async getProveedores() {
    const [rows] = await pool.query(
      'SELECT id_proveedor, nombre_proveedor, correo_proveedor, tel FROM proveedor ORDER BY id_proveedor ASC',
    );
    return rows;
  },

  async getProductosConStock() {
    const [rows] = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre_producto,
        p.categoria,
        p.p_actual,
        COALESCE(SUM(i.stock), 0) AS stock
      FROM producto p
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      GROUP BY p.id_producto, p.nombre_producto, p.categoria, p.p_actual
      ORDER BY p.id_producto ASC
    `);
    return rows;
  },

  async getInventario() {
    const [rows] = await pool.query(`
      SELECT
        i.id_inventario,
        i.id_producto,
        p.nombre_producto,
        p.categoria,
        p.p_actual,
        i.f_entrada,
        i.f_caducidad,
        i.stock
      FROM inventario i
      INNER JOIN producto p ON i.id_producto = p.id_producto
      ORDER BY i.id_inventario ASC
    `);
    return rows;
  },
};
