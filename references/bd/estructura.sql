CREATE TABLE empleado (
    id_empleado TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_empleado VARCHAR(100) NOT NULL,
    puesto ENUM('Vendedor', 'Almacen') NOT NULL
);

CREATE TABLE cliente (
    id_cliente INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE producto (
    id_producto SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(80) NOT NULL,
    categoria ENUM('Lacteos', 'Abarrotes', 'Bebidas', 'Limpieza', 'Panaderia', 'Frescos', 'Otros') NOT NULL,
    p_actual DECIMAL(10, 2) NOT NULL CHECK (p_actual > 0)
);

CREATE TABLE proveedor (
    id_proveedor SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_proveedor VARCHAR(80) NOT NULL,
    correo_proveedor VARCHAR(100) NOT NULL UNIQUE,
    tel VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE venta (
    id_venta INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_empleado TINYINT UNSIGNED,
    id_cliente INT UNSIGNED,
    fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    m_pago ENUM('Efectivo', 'Tarjeta') NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE d_venta (
    id_d_venta INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_venta INT UNSIGNED,
    id_producto SMALLINT UNSIGNED,
    cantidad_venta SMALLINT UNSIGNED NOT NULL,
    p_unitario DECIMAL(10, 2) NOT NULL CHECK (p_unitario >= 0),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE compra (
    id_compra INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_proveedor SMALLINT UNSIGNED,
    id_empleado TINYINT UNSIGNED,
    fecha_compra DATETIME NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE d_compra (
    id_d_compra INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_compra INT UNSIGNED,
    id_producto SMALLINT UNSIGNED,
    cantidad_compra SMALLINT UNSIGNED NOT NULL,
    costo DECIMAL(10, 2) NOT NULL CHECK (costo > 0),
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE corte_caja (
    id_corte_caja INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_empleado TINYINT UNSIGNED,
    monto_inicial DECIMAL(10, 2) NOT NULL CHECK (monto_inicial >= 0),
    f_inicio DATETIME NOT NULL,
    f_fin DATETIME NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE inventario (
    id_inventario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_producto SMALLINT UNSIGNED,
    f_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    f_caducidad DATETIME NOT NULL,
    stock SMALLINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
);