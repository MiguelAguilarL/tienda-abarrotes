# Registro Histórico de Cambios del Proyecto

Este archivo documenta en orden cronológico inverso todos los cambios, decisiones técnicas, adiciones de funcionalidades y modificaciones estructurales realizadas en el proyecto. Su objetivo es garantizar la continuidad del contexto técnico sin importar cambios de sesión o agente.

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
