# Registro Histórico de Cambios del Proyecto

Este archivo documenta en orden cronológico inverso todos los cambios, decisiones técnicas, adiciones de funcionalidades y modificaciones estructurales realizadas en el proyecto. Su objetivo es garantizar la continuidad del contexto técnico sin importar cambios de sesión o agente.

---

## [Inicialización] - 2026-11-15

### Contexto y Configuración Base
- **Proyecto**: Sistema Gestor de Tienda de Abarrotes (`tienda-app`).
- **Arquitectura**:
  - `backend/`: Node.js (ES Modules), Express 5, MySQL2 (`mysql2`), dotenv, cors.
  - `frontend/`: React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`).
  - `references/`:
    - `references/bd/estructura.sql`: Esquema DDL de base de datos MySQL (tablas `empleado`, `cliente`, `producto`, `proveedor`, `venta`, `d_venta`, `compra`, `d_compra`, `corte_caja`, `inventario`).
    - `references/ui/`: Diseños y layouts HTML con Tailwind/Material Symbols (`login.html`, `venta.html`, `compra.html`, `inventario.html`).
- **Reglas del Proyecto**:
  - Creación del archivo de gobierno y directrices `AGENTS.md`.
  - Configuración del flujo de mantenimiento de este archivo `HISTORIAL.md`.
  - Regla de gestor de paquetes: **Uso estricto de pnpm** (prohibido `npm` / `yarn`).
  - Cumplimiento estricto de las maquetas de UI y modelo relacional.
