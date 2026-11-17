import { Router } from 'express';
import { tiendaController } from '../controllers/tiendaController.js';

const router = Router();

router.get('/health', tiendaController.health);
router.get('/empleados', tiendaController.getEmpleados);
router.get('/proveedores', tiendaController.getProveedores);
router.get('/productos', tiendaController.getProductos);
router.get('/inventario', tiendaController.getInventario);

export default router;
