# Registro Histórico de Cambios del Proyecto

Este archivo documenta en orden cronológico inverso todos los cambios, decisiones técnicas, adiciones de funcionalidades y modificaciones estructurales realizadas en el proyecto. Su objetivo es garantizar la continuidad del contexto técnico sin importar cambios de sesión o agente.

---

## [Conexión BD MySQL + Backend + Frontend (Solo Lectura)] - 2026-11-16

### Cambios Realizados
- **Backend en Capas (`backend/`)**:
  - `backend/src/db/pool.js`: Pool de conexiones `mysql2/promise` usando variables de `.env`.
  - `backend/src/models/tiendaModel.js`: Consultas SQL preparadas de solo lectura (`checkHealth`, `getEmpleados`, `getProveedores`, `getProductosConStock`, `getInventario`) alineadas a `references/bd/estructura.sql`.
  - `backend/src/services/tiendaService.js`, `backend/src/controllers/tiendaController.js`, `backend/src/routes/tiendaRoutes.js`, `backend/src/middlewares/errorHandler.js` y `backend/index.js`: Endpoints `GET /api/health`, `/api/empleados`, `/api/proveedores`, `/api/productos` y `/api/inventario` con respuestas `{ success, data }` y CORS para `http://localhost:5173`.
  - `backend/package.json`: Scripts `start` y `dev` (`node --watch index.js`).
- **Frontend Conectado a API (`frontend/`)**:
  - `frontend/src/services/api.js` y `frontend/src/utils/formatters.js`: Cliente HTTP centralizado (`tiendaApi`), gestión de sesión de empleado en `sessionStorage` y utilidades de formato.
  - `LoginPage.jsx` / `LoginCard.jsx`: Validación y botones rápidos generados desde `GET /api/empleados`.
  - `VentaPage.jsx` / `usePosCart.js` / `ProductCatalogTable.jsx`: Catálogo y existencias reales desde `GET /api/productos` mostrando `id_producto`, `nombre_producto`, `categoria`, `p_actual` y `stock` tal cual en MySQL.
  - `CompraPage.jsx` / `usePurchaseOrder.js` / `PurchaseHeaderForm.jsx` / `PurchaseItemsTable.jsx`: Proveedores y productos reales desde `GET /api/proveedores` y `GET /api/productos`.
  - `InventarioPage.jsx` / `useInventory.js` / `InventoryTable.jsx`: Lotes reales desde `GET /api/inventario`.
  - Acciones de escritura (`POST`/`PUT`/`DELETE`) deshabilitadas temporalmente con modal informativo de modo solo lectura.

### Verificación
- Backend: Verificado contra MySQL (`health=True`, `empleados=4`, `proveedores=5`, `productos=12`, `inventario=12`).
- Frontend: `pnpm run lint` (0 errores) y `pnpm run build` (292ms, 0 errores).

---

## [Datos de Prueba SQL (Seed)] - 2026-11-16

### Cambios Realizados
- **`references/bd/datos_prueba.sql`**: Se creó el script SQL con registros de prueba para todas las tablas de `references/bd/estructura.sql` (`empleado`, `cliente`, `producto`, `proveedor`, `inventario`, `compra`, `d_compra`, `venta`, `d_venta`, `corte_caja`), respetando tipos, restricciones `CHECK`, `ENUM`, `UNIQUE`, claves foráneas y alineación con los datos mostrados en la UI.

---

## [Implementación Frontend UI con Datos Mock y React Router DOM] - 2026-11-16

### Cambios Realizados
- **Dependencias**: Se instaló `react-router-dom` (`7.18.5`) en `frontend/` mediante `pnpm add react-router-dom`.
- **Estilos y Tipografía (`frontend/index.html`, `frontend/src/index.css`)**:
  - Se configuraron las Google Fonts `Plus Jakarta Sans` y `Material Symbols Outlined`.
  - Se definieron en `@theme` (Tailwind CSS v4) todos los tokens de color Material 3, espaciados y escalas tipográficas de las maquetas en `references/ui/`.
- **Datos Mock (`frontend/src/data/mockData.js`)**:
  - Se crearon datos de prueba en memoria (`MOCK_EMPLEADOS`, `MOCK_PROVEEDORES`, `MOCK_PRODUCTOS`, `INITIAL_INVENTARIO`, `INITIAL_TICKET_ITEMS`, `INITIAL_COMPRA_ITEMS`) respetando los nombres de tablas y columnas de `references/bd/estructura.sql`.
- **Componentes Comunes y Layout (`frontend/src/components/common/`, `frontend/src/components/layout/`)**:
  - `Badge.jsx` (`CategoryBadge`, `StockBadge`), `Modal.jsx`, `Sidebar.jsx` (con `NavLink` de `react-router-dom`), `Header.jsx` (reloj en vivo) y `DashboardLayout.jsx`.
- **Módulos y Custom Hooks (`frontend/src/pages/`, `frontend/src/hooks/`)**:
  - **Login (`/login`)**: `LoginPage.jsx` y `LoginCard.jsx` con toggle de contraseña, estado de carga simulado y botones demo para Vendedor (`/venta`) y Almacén (`/compra`).
  - **Venta (`/venta`)**: `VentaPage.jsx`, `usePosCart.js`, `CatalogSearch.jsx`, `CategoryFilter.jsx`, `ProductCatalogTable.jsx` y `TicketSummary.jsx` con búsqueda, filtros, atajos (`F2`, `F9`, `F10`, `F12`, `Escape`) y modal de cobro mock.
  - **Compra (`/compra`)**: `CompraPage.jsx`, `usePurchaseOrder.js`, `PurchaseHeaderForm.jsx`, `PurchaseItemsTable.jsx` y `PurchaseSummary.jsx` con tabla dinámica `d_compra`, cálculo de subtotal/IVA 16%/total y confirmación mock.
  - **Inventario (`/inventario`)**: `InventarioPage.jsx`, `useInventory.js`, `InventoryKpiCards.jsx`, `InventoryFilters.jsx`, `InventoryTable.jsx` y `ProductModal.jsx` con KPIs dinámicos, filtros combinados, paginación, exportación CSV y CRUD mock en memoria.
- **Enrutamiento (`frontend/src/App.jsx`)**: Configuración de `BrowserRouter` y `Routes` para `/login`, `/venta`, `/compra` e `/inventario`.

### Verificación
- `pnpm run lint` en `frontend/`: Aprobado (código de salida 0).
- `pnpm run build` en `frontend/`: Compilación exitosa con Vite (`dist/` generado sin errores).

---

## [Actualización de Directrices - React Router DOM] - 2026-11-16

### Cambios Realizados
- **`AGENTS.md`**: Se actualizó la sección de arquitectura de frontend para especificar el uso obligatorio de `react-router-dom` para la navegación y paginación entre las vistas (`/login`, `/venta`, `/compra`, `/inventario`), reemplazando el enfoque MPA anterior.

---

## [Inicialización] - 2026-11-15

### Contexto y Configuración Base
- **Proyecto**: Sistema Gestor de Tienda de Abarrotes (`tienda-app`).
- **Arquitectura**:
  - `backend/`: Node.js (ES Modules), Express 5, MySQL2 (`mysql2`), dotenv, cors.
  - `frontend/`: React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), enfoque Multi-Page App (MPA / NO SPA) para mantener pantallas y módulos independientes.
  - `references/`:
    - `references/bd/estructura.sql`: Esquema DDL de base de datos MySQL (tablas `empleado`, `cliente`, `producto`, `proveedor`, `venta`, `d_venta`, `compra`, `d_compra`, `corte_caja`, `inventario`).
    - `references/ui/`: Diseños y layouts HTML con Tailwind/Material Symbols (`login.html`, `venta.html`, `compra.html`, `inventario.html`).
- **Reglas del Proyecto**:
  - Creación del archivo de gobierno y directrices `AGENTS.md`.
  - Configuración del flujo de mantenimiento de este archivo `HISTORIAL.md`.
  - Regla de gestor de paquetes: **Uso estricto de pnpm** (prohibido `npm` / `yarn`).
  - Cumplimiento estricto de las maquetas de UI y modelo relacional.
