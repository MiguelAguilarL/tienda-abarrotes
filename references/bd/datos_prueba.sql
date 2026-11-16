-- ============================================================================
-- Script de Datos de Prueba (Seed) - Sistema Gestor Tienda de Abarrotes
-- Alineado 100% con references/bd/estructura.sql y las vistas de references/ui/
-- ============================================================================

-- 1. EMPLEADOS (puesto: 'Vendedor', 'Almacen')
INSERT INTO empleado (id_empleado, nombre_empleado, puesto) VALUES
(1, 'Carlos López', 'Vendedor'),
(2, 'Juan Pérez', 'Almacen'),
(3, 'María Fernanda González', 'Vendedor'),
(4, 'Luis Alberto Ramírez', 'Almacen');

-- 2. CLIENTES (correo UNIQUE)
INSERT INTO cliente (id_cliente, nombre_cliente, correo) VALUES
(1, 'Público en General', 'mostrador@tiendaabarrotes.local'),
(2, 'Ana Sofía Martínez', 'ana.martinez@correo.com'),
(3, 'Roberto Hernández Cruz', 'roberto.hc@correo.com'),
(4, 'Lucía Méndez Vargas', 'lucia.mendez@correo.com'),
(5, 'Jorge Eduardo Torres', 'jorge.torres@correo.com');

-- 3. PRODUCTOS (categoria: 'Lacteos', 'Abarrotes', 'Bebidas', 'Limpieza', 'Panaderia', 'Frescos', 'Otros')
INSERT INTO producto (id_producto, nombre_producto, categoria, p_actual) VALUES
(1, 'Leche Entera 1L', 'Lacteos', 26.50),
(2, 'Arroz Grano Extra 1kg', 'Abarrotes', 32.00),
(3, 'Frijol Negro 1kg', 'Abarrotes', 38.00),
(4, 'Refresco Cola 600ml', 'Bebidas', 18.50),
(5, 'Agua Purificada 1.5L', 'Bebidas', 14.00),
(6, 'Detergente Multiusos 900g', 'Limpieza', 29.00),
(7, 'Jabón de Barra Neutro 400g', 'Limpieza', 17.50),
(8, 'Pan de Caja Blanco 680g', 'Panaderia', 45.00),
(9, 'Huevo Blanco Cono 30 pzas', 'Frescos', 84.00),
(10, 'Azúcar Estándar 1kg', 'Otros', 28.00),
(11, 'Aceite Vegetal Comestible 800ml', 'Abarrotes', 39.50),
(12, 'Galletas María Paquete 170g', 'Abarrotes', 16.00);

-- 4. PROVEEDORES (correo_proveedor UNIQUE, tel UNIQUE)
INSERT INTO proveedor (id_proveedor, nombre_proveedor, correo_proveedor, tel) VALUES
(1, 'Distribuidora Abarrotera Central S.A.', 'ventas@abarroteracentral.com', '5512345678'),
(2, 'Lácteos Santa Clara S.A.', 'pedidos@santaclara.com', '5587654321'),
(3, 'Bebidas Mundiales S.A. de C.V.', 'distribucion@bebidasmundiales.mx', '5544332211'),
(4, 'Harinas y Panificados del Norte', 'contacto@harinasnorte.com', '5599887766'),
(5, 'Granjas y Frescos del Bajío', 'logistica@frescosbajio.mx', '5533221100');

-- 5. INVENTARIO (lotes con stock crítico < 10, stock óptimo >= 10, caducidades próximas < 7 días y vigentes)
INSERT INTO inventario (id_inventario, id_producto, f_entrada, f_caducidad, stock) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY), 6),
(2, 2, DATE_SUB(NOW(), INTERVAL 23 DAY), DATE_ADD(NOW(), INTERVAL 295 DAY), 48),
(3, 8, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 5),
(4, 9, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 8),
(5, 3, DATE_SUB(NOW(), INTERVAL 19 DAY), DATE_ADD(NOW(), INTERVAL 400 DAY), 55),
(6, 4, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_ADD(NOW(), INTERVAL 180 DAY), 88),
(7, 5, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 320 DAY), 54),
(8, 6, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_ADD(NOW(), INTERVAL 500 DAY), 22),
(9, 7, DATE_SUB(NOW(), INTERVAL 16 DAY), DATE_ADD(NOW(), INTERVAL 420 DAY), 7),
(10, 10, DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 240 DAY), 50),
(11, 11, DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_ADD(NOW(), INTERVAL 365 DAY), 35),
(12, 12, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 210 DAY), 60);

-- 6. COMPRAS A PROVEEDORES
INSERT INTO compra (id_compra, id_proveedor, id_empleado, fecha_compra) VALUES
(1, 1, 2, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(2, 2, 2, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(3, 3, 4, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 4, 2, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 7. DETALLE DE COMPRAS (d_compra, costo > 0)
INSERT INTO d_compra (id_d_compra, id_compra, id_producto, cantidad_compra, costo) VALUES
(1, 1, 2, 50, 22.00),
(2, 1, 3, 60, 26.00),
(3, 1, 11, 40, 28.50),
(4, 2, 1, 40, 18.50),
(5, 3, 4, 96, 12.50),
(6, 3, 5, 60, 8.50),
(7, 4, 8, 25, 32.00),
(8, 4, 12, 60, 10.50);

-- 8. VENTAS (m_pago: 'Efectivo', 'Tarjeta')
INSERT INTO venta (id_venta, id_empleado, id_cliente, fecha_venta, m_pago) VALUES
(1, 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Efectivo'),
(2, 1, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Tarjeta'),
(3, 3, 3, DATE_SUB(NOW(), INTERVAL 5 HOUR), 'Efectivo'),
(4, 1, 4, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Tarjeta'),
(5, 3, 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'Efectivo');

-- 9. DETALLE DE VENTAS (d_venta, p_unitario >= 0)
INSERT INTO d_venta (id_d_venta, id_venta, id_producto, cantidad_venta, p_unitario) VALUES
(1, 1, 1, 2, 26.50),
(2, 1, 8, 1, 45.00),
(3, 1, 4, 3, 18.50),
(4, 2, 2, 2, 32.00),
(5, 2, 11, 1, 39.50),
(6, 2, 6, 1, 29.00),
(7, 3, 9, 1, 84.00),
(8, 3, 3, 2, 38.00),
(9, 4, 5, 4, 14.00),
(10, 4, 12, 3, 16.00),
(11, 5, 10, 2, 28.00),
(12, 5, 7, 1, 17.50);

-- 10. CORTES DE CAJA (monto_inicial >= 0)
INSERT INTO corte_caja (id_corte_caja, id_empleado, monto_inicial, f_inicio, f_fin) VALUES
(1, 1, 1500.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 8 HOUR)),
(2, 3, 1500.00, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 8 HOUR)),
(3, 1, 2000.00, DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW());
