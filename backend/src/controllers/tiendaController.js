import { tiendaService } from '../services/tiendaService.js';

/**
 * Controladores HTTP de solo lectura con formato de respuesta estandarizado.
 */
export const tiendaController = {
  async health(req, res, next) {
    try {
      const data = await tiendaService.checkHealth();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getEmpleados(req, res, next) {
    try {
      const data = await tiendaService.listarEmpleados();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getProveedores(req, res, next) {
    try {
      const data = await tiendaService.listarProveedores();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getProductos(req, res, next) {
    try {
      const data = await tiendaService.listarProductos();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getInventario(req, res, next) {
    try {
      const data = await tiendaService.listarInventario();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
