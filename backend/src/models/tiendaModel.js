import pool from '../db/pool.js';

/**
 * Consultas SQL alineadas 100% a references/bd/estructura.sql.
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

  async getClientes() {
    const [rows] = await pool.query(
      'SELECT id_cliente, nombre_cliente, correo FROM cliente ORDER BY id_cliente ASC',
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

  async getVentas() {
    const [rows] = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_venta,
        v.m_pago,
        v.id_empleado,
        e.nombre_empleado,
        e.puesto,
        v.id_cliente,
        c.nombre_cliente,
        c.correo,
        COALESCE(SUM(dv.cantidad_venta), 0) AS total_piezas,
        COALESCE(SUM(dv.cantidad_venta * dv.p_unitario), 0) AS total
      FROM venta v
      INNER JOIN empleado e ON v.id_empleado = e.id_empleado
      INNER JOIN cliente c ON v.id_cliente = c.id_cliente
      LEFT JOIN d_venta dv ON v.id_venta = dv.id_venta
      GROUP BY
        v.id_venta, v.fecha_venta, v.m_pago,
        v.id_empleado, e.nombre_empleado, e.puesto,
        v.id_cliente, c.nombre_cliente, c.correo
      ORDER BY v.id_venta DESC
    `);
    return rows;
  },

  async getVentaById(idVenta, connection = pool) {
    const [headerRows] = await connection.query(
      `
      SELECT
        v.id_venta,
        v.fecha_venta,
        v.m_pago,
        v.id_empleado,
        e.nombre_empleado,
        e.puesto,
        v.id_cliente,
        c.nombre_cliente,
        c.correo
      FROM venta v
      INNER JOIN empleado e ON v.id_empleado = e.id_empleado
      INNER JOIN cliente c ON v.id_cliente = c.id_cliente
      WHERE v.id_venta = ?
      `,
      [idVenta],
    );

    if (headerRows.length === 0) return null;

    const [detailRows] = await connection.query(
      `
      SELECT
        dv.id_d_venta,
        dv.id_producto,
        p.nombre_producto,
        p.categoria,
        dv.cantidad_venta,
        dv.p_unitario,
        (dv.cantidad_venta * dv.p_unitario) AS subtotal
      FROM d_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
      ORDER BY dv.id_d_venta ASC
      `,
      [idVenta],
    );

    const total = detailRows.reduce(
      (acc, item) => acc + Number(item.subtotal),
      0,
    );
    const totalPiezas = detailRows.reduce(
      (acc, item) => acc + Number(item.cantidad_venta),
      0,
    );

    return {
      ...headerRows[0],
      total_piezas: totalPiezas,
      total,
      detalles: detailRows.map((d) => ({
        ...d,
        cantidad_venta: Number(d.cantidad_venta),
        p_unitario: Number(d.p_unitario),
        subtotal: Number(d.subtotal),
      })),
    };
  },

  async createVentaTransaction({
    id_empleado,
    id_cliente,
    cliente_nuevo,
    m_pago,
    items,
  }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Verificar empleado existente
      const [empRows] = await connection.query(
        'SELECT id_empleado FROM empleado WHERE id_empleado = ?',
        [id_empleado],
      );
      if (empRows.length === 0) {
        const err = new Error('El empleado especificado no existe en la BD.');
        err.statusCode = 400;
        throw err;
      }

      // 2. Resolver cliente (nuevo, existente o por defecto id_cliente = 1)
      let resolvedClientId = id_cliente;

      if (cliente_nuevo?.nombre_cliente && cliente_nuevo?.correo) {
        const [existingClient] = await connection.query(
          'SELECT id_cliente FROM cliente WHERE correo = ?',
          [cliente_nuevo.correo.trim()],
        );
        if (existingClient.length > 0) {
          resolvedClientId = existingClient[0].id_cliente;
        } else {
          const [insertClient] = await connection.query(
            'INSERT INTO cliente (nombre_cliente, correo) VALUES (?, ?)',
            [cliente_nuevo.nombre_cliente.trim(), cliente_nuevo.correo.trim()],
          );
          resolvedClientId = insertClient.insertId;
        }
      } else if (!resolvedClientId) {
        const [defaultRows] = await connection.query(
          'SELECT id_cliente FROM cliente ORDER BY id_cliente ASC LIMIT 1',
        );
        if (defaultRows.length === 0) {
          const err = new Error(
            'No existe un cliente por defecto registrado en la BD.',
          );
          err.statusCode = 400;
          throw err;
        }
        resolvedClientId = defaultRows[0].id_cliente;
      } else {
        const [clientCheck] = await connection.query(
          'SELECT id_cliente FROM cliente WHERE id_cliente = ?',
          [resolvedClientId],
        );
        if (clientCheck.length === 0) {
          const err = new Error('El cliente seleccionado no existe en la BD.');
          err.statusCode = 400;
          throw err;
        }
      }

      // 3. Validar productos, precios reales y stock disponible
      const preparedItems = [];
      for (const item of items) {
        const [prodRows] = await connection.query(
          `
          SELECT
            p.id_producto,
            p.nombre_producto,
            p.p_actual,
            COALESCE(SUM(i.stock), 0) AS total_stock
          FROM producto p
          LEFT JOIN inventario i ON p.id_producto = i.id_producto
          WHERE p.id_producto = ?
          GROUP BY p.id_producto, p.nombre_producto, p.p_actual
          `,
          [item.id_producto],
        );

        if (prodRows.length === 0) {
          const err = new Error(
            `El producto id=${item.id_producto} no existe en la BD.`,
          );
          err.statusCode = 400;
          throw err;
        }

        const prod = prodRows[0];
        const availableStock = Number(prod.total_stock);
        if (availableStock < item.cantidad_venta) {
          const err = new Error(
            `Stock insuficiente para "${prod.nombre_producto}". Disponible: ${availableStock}, solicitado: ${item.cantidad_venta}.`,
          );
          err.statusCode = 400;
          throw err;
        }

        preparedItems.push({
          id_producto: prod.id_producto,
          cantidad_venta: item.cantidad_venta,
          p_unitario: Number(prod.p_actual),
        });
      }

      // 4. Insertar encabezado en venta
      const [ventaResult] = await connection.query(
        'INSERT INTO venta (id_empleado, id_cliente, fecha_venta, m_pago) VALUES (?, ?, NOW(), ?)',
        [id_empleado, resolvedClientId, m_pago],
      );
      const idVenta = ventaResult.insertId;

      // 5. Insertar d_venta y descontar stock de inventario (FEFO: caducidad más próxima)
      for (const item of preparedItems) {
        await connection.query(
          'INSERT INTO d_venta (id_venta, id_producto, cantidad_venta, p_unitario) VALUES (?, ?, ?, ?)',
          [idVenta, item.id_producto, item.cantidad_venta, item.p_unitario],
        );

        let remaining = item.cantidad_venta;
        const [lotes] = await connection.query(
          `
          SELECT id_inventario, stock
          FROM inventario
          WHERE id_producto = ? AND stock > 0
          ORDER BY f_caducidad ASC, id_inventario ASC
          FOR UPDATE
          `,
          [item.id_producto],
        );

        for (const lote of lotes) {
          if (remaining <= 0) break;
          const deduct = Math.min(remaining, Number(lote.stock));
          await connection.query(
            'UPDATE inventario SET stock = stock - ? WHERE id_inventario = ?',
            [deduct, lote.id_inventario],
          );
          remaining -= deduct;
        }
      }

      await connection.commit();

      const fullSale = await tiendaModel.getVentaById(idVenta, connection);
      return fullSale;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};
