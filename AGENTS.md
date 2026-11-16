# Directrices para Agentes de IA - Sistema Gestor Tienda de Abarrotes (`tienda-app`)

Este documento define de forma obligatoria las reglas, convenciones, arquitectura, estándares de desarrollo y flujos de trabajo que **todo agente de IA debe seguir al pie de la letra** al interactuar, modificar o extender este proyecto.

---

## 1. Reglas de Oro y Restricciones Principales

1. **Idioma**: Todas las respuestas, documentación técnica, mensajes de commit y comentarios relevantes deben redactarse en **español**.
2. **Gestor de Paquetes**: **Usar obligatoriamente `pnpm`** para la gestión de dependencias y scripts de Node.js tanto en `frontend` como en `backend`. Queda **estrictamente prohibido usar `npm` o `yarn`** (no ejecutar `npm install`, `npm run`, etc.).
3. **Mantenimiento Obligatorio de `HISTORIAL.md`**:
   - Cada agente que realice adiciones, refactorizaciones, correcciones o cambios estructurales **debe actualizar [HISTORIAL.md](file:///C:/Users/Dell%20Latitude%207420/Desktop/Uni/taller-bd/tienda-app/HISTORIAL.md)** registrando la fecha, descripción de cambios, archivos modificados y decisiones técnicas tomadas.
   - Esto evita la pérdida de contexto cuando el usuario abra un nuevo chat o cambie de sesión.
4. **Fidelidad Absoluta a las Referencias**:
   - **UI**: Las interfaces de usuario deben seguir **al pie de la letra** los prototipos ubicados en `references/ui/` (`login.html`, `venta.html`, `compra.html`, `inventario.html`).
   - **Base de Datos**: El backend y las consultas SQL deben alinearse al 100% con las definiciones de `references/bd/estructura.sql`.

---

## 2. Estructura del Proyecto

```text
tienda-app/
├── AGENTS.md                  # Reglas maestras del proyecto para agentes
├── HISTORIAL.md               # Registro histórico acumulativo de cambios
├── backend/                   # API REST con Node.js + Express
│   ├── index.js               # Punto de entrada del servidor
│   ├── package.json           # Dependencias de backend (pnpm)
│   ├── .env                   # Variables de entorno locales
│   └── src/                   # Controladores, rutas, servicios y conexión a BD
├── frontend/                  # Aplicación React + Vite + Tailwind CSS con react-router-dom
│   ├── src/                   # Componentes, vistas, hooks y utilidades
│   ├── index.html             # Entry point HTML (fuentes Plus Jakarta Sans & Material Symbols)
│   ├── package.json           # Dependencias de frontend (pnpm)
│   └── vite.config.js         # Configuración Vite + Tailwind CSS
└── references/                # Fuentes de verdad del proyecto
    ├── bd/
    │   └── estructura.sql     # DDL oficial de MySQL
    └── ui/                    # Vistas de referencia HTML/Tailwind
        ├── login.html         # Pantalla de autenticación / inicio de sesión
        ├── venta.html         # Terminal Punto de Venta (TPV)
        ├── compra.html        # Registro de compras a proveedores
        └── inventario.html    # Control de stock, lotes y caducidades
```

---

## 3. Modelo de Base de Datos (`references/bd/estructura.sql`)

El backend debe respetar fielmente las tablas, nombres de columnas, tipos y restricciones:

- **`empleado`**: `id_empleado` (PK), `nombre_empleado`, `puesto` (ENUM: `'Vendedor'`, `'Almacen'`).
- **`cliente`**: `id_cliente` (PK), `nombre_cliente`, `correo` (UNIQUE).
- **`producto`**: `id_producto` (PK), `nombre_producto`, `categoria` (ENUM: `'Lacteos'`, `'Abarrotes'`, `'Bebidas'`, `'Limpieza'`, `'Panaderia'`, `'Frescos'`, `'Otros'`), `p_actual` (`DECIMAL(10,2)` > 0).
- **`proveedor`**: `id_proveedor` (PK), `nombre_proveedor`, `correo_proveedor` (UNIQUE), `tel` (UNIQUE).
- **`venta`**: `id_venta` (PK), `id_empleado` (FK), `id_cliente` (FK), `fecha_venta`, `m_pago` (ENUM: `'Efectivo'`, `'Tarjeta'`).
- **`d_venta`**: `id_d_venta` (PK), `id_venta` (FK CASCADE), `id_producto` (FK), `cantidad_venta`, `p_unitario`.
- **`compra`**: `id_compra` (PK), `id_proveedor` (FK), `id_empleado` (FK), `fecha_compra`.
- **`d_compra`**: `id_d_compra` (PK), `id_compra` (FK CASCADE), `id_producto` (FK), `cantidad_compra`, `costo`.
- **`corte_caja`**: `id_corte_caja` (PK), `id_empleado` (FK), `monto_inicial`, `f_inicio`, `f_fin`.
- **`inventario`**: `id_inventario` (PK), `id_producto` (FK), `f_entrada`, `f_caducidad`, `stock`.

> **Nota para el Backend**: Usar `mysql2/promise` con pool de conexiones y consultas preparadas parametrizadas para evitar inyecciones SQL. Para transacciones multi-tabla (`venta` + `d_venta` + actualización de `inventario`, o `compra` + `d_compra`), utilizar bloques transaccionales (`START TRANSACTION`, `COMMIT`, `ROLLBACK`).

---

## 4. Reglas y Buenas Prácticas de Frontend (React + Tailwind CSS)

### 4.1. Arquitectura, Enrutamiento (`react-router-dom`) y Modularidad
- **Enrutamiento y Paginación con React Router DOM**: Se trabajará obligatoriamente con **`react-router-dom`** para gestionar la navegación y paginación entre las pantallas/módulos principales (`/login`, `/venta`, `/compra`, `/inventario`), manteniendo cada vista como un módulo independiente y aislado según las referencias de `references/ui/` (mediante `BrowserRouter`, `Routes`, `Route`, `NavLink` y `useNavigate`).
- **Modularidad de Componentes**: No crear componentes monolíticos. Dividir cada pantalla en componentes reutilizables, legibles y atómicos:
  - Componentes comunes: `Button`, `Input`, `Select`, `Badge`, `Modal`, `Table`, `Card`.
  - Componentes de layout: `Sidebar`, `Navbar`, `PageHeader`.
  - Componentes de dominio: `ProductSearchCard`, `CartTable`, `PaymentSummary`, `StockBadge`.
- **Responsabilidad Única**: Cada componente debe tener una única responsabilidad clara.
- **Manejo de Estado**: Separar la lógica de negocio de la UI usando Custom Hooks por módulo (ej. `useCart`, `useScanner`, `useAuth`, `useInventory`).
- **Props Limpias**: Tipar o documentar claramente las props esperadas. Evitar estructuras sobrecargadas o dependencias innecesarias de estado global en pantallas aisladas.

### 4.2. Estilo y Fidelidad con Tailwind CSS
- **Fidelidad Visual Estricta**: Los colores, espaciados, tipografías e iconos deben coincidir con las referencias HTML de `references/ui/`.
- **Tipografía y Fuentes**: Fuente principal `Plus Jakarta Sans` y set de iconos Google `Material Symbols Outlined`.
- **Paleta de Diseño**: Respetar el sistema de colores de la maqueta:
  - Primarios: `primary` (`#5300b7`), `primary-container` (`#6d28d9`), `on-primary` (`#ffffff`).
  - Superficies y Fondos: `surface` (`#faf8ff`), `surface-container` (`#eaedff`), `surface-container-high` (`#e2e7ff`), `on-surface` (`#131b2e`).
  - Secundarios y Acentos: `secondary` (`#006c4a`), `secondary-container` (`#82f5c1`), etc.
- **Clases Limpias**: Emplear utilidades semánticas y evitar estilos inline (`style={{ ... }}`).

---

## 5. Reglas y Buenas Prácticas de Backend (Node.js + Express)

- **Arquitectura en Capas**:
  - `routes/`: Definición de endpoints HTTP.
  - `controllers/`: Recepción de peticiones, validación de inputs y envío de respuestas.
  - `services/`: Lógica de negocio y orquestación.
  - `models/` o `db/`: Consultas SQL y gestión de conexiones MySQL.
- **Manejo de Errores**:
  - Middleware global de control de errores.
  - Respuestas HTTP estandarizadas: `{ success: boolean, data?: any, error?: string, message?: string }`.
  - Códigos de estado HTTP correctos (`200`, `201`, `400`, `401`, `403`, `404`, `500`).
- **Validación de Entradas**: Validar tipos, rangos numéricos y nulos antes de ejecutar sentencias SQL.
- **Seguridad**: Usar variables de entorno (`dotenv`), `cors` configurado para el frontend de Vite y nunca quemar credenciales en el código fuente.

---

## 6. Protocolo de Trabajo para Agentes

Al iniciar una tarea o responder a un requerimiento:
1. **Revisar [HISTORIAL.md](file:///C:/Users/Dell%20Latitude%207420/Desktop/Uni/taller-bd/tienda-app/HISTORIAL.md)** para enterarse del estado más reciente del proyecto.
2. **Consultar [references/](file:///C:/Users/Dell%20Latitude%207420/Desktop/Uni/taller-bd/tienda-app/references/)** antes de diseñar cualquier endpoint, componente o esquema.
3. **Instalar paquetes únicamente con `pnpm add <paquete>`** en el directorio correspondiente (`cd frontend` o `cd backend`).
4. **Registrar cada cambio relevante en [HISTORIAL.md](file:///C:/Users/Dell%20Latitude%207420/Desktop/Uni/taller-bd/tienda-app/HISTORIAL.md)** antes de concluir el turno.
