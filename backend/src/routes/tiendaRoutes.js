import { Router } from 'express';
import { tiendaController } from '../controllers/tiendaController.js';

const router = Router();

router.get('/health', tiendaController.health);
router.get('/empleados', tiendaController.getEmpleados);
router.get('/clientes', tiendaController.getClientes);
router.get('/proveedores', tiendaController.getProveedores);
router.get('/productos', tiendaController.getProductos);
router.get('/inventario', tiendaController.getInventario);
router.get('/ventas', tiendaController.getVentas);
router.get('/ventas/:id', tiendaController.getVentaById);
router.post('/ventas', tiendaController.createVenta);

export default router;
