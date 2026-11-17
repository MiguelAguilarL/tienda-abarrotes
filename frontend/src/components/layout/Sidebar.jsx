import { NavLink } from 'react-router-dom';
import { clearSessionEmployee } from '../../services/api';

const POS_LINKS = [
  { to: '/venta', label: 'Punto de Venta', icon: 'point_of_sale', active: true },
  { to: '/inventario', label: 'Inventario', icon: 'inventory_2' },
  { to: '/compra', label: 'Compras', icon: 'local_shipping' },
];

const WAREHOUSE_LINKS = [
  { to: '/compra', label: 'Compras', icon: 'local_shipping' },
  { to: '/inventario', label: 'Inventario', icon: 'inventory_2' },
  { to: '/venta', label: 'Punto de Venta', icon: 'point_of_sale' },
];

/**
 * Barra lateral fija fiel a las maquetas de venta.html, compra.html e inventario.html.
 */
export default function Sidebar({ variant = 'warehouse', onUnavailableClick }) {
  const isPos = variant === 'pos';
  const navItems = isPos ? POS_LINKS : WAREHOUSE_LINKS;

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${
        isPos ? 'bg-surface-container-low' : 'bg-surface-container-lowest'
      }`}
    >
      <div className="flex flex-col">
        {/* Marca */}
        <div className="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-lowest">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[20px]">
              {isPos ? 'storefront' : 'store'}
            </span>
          </div>
          {isPos ? (
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              TiendaAbarrotes
            </span>
          ) : (
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                Abarrotes
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Panel Central
              </span>
            </div>
          )}
        </div>

        {/* Subencabezado contextual */}
        {isPos ? (
          <div className="px-space-md py-space-sm">
            <div className="p-space-sm bg-surface-container rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-label-sm text-on-surface">
                  Turno Activo
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-space-md pt-space-sm pb-space-xs">
            <span className="px-space-sm font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Operaciones
            </span>
          </div>
        )}

        {/* Navegación con React Router NavLink */}
        <nav className="flex flex-col gap-1 px-space-md mt-space-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-md py-space-sm transition-all font-label-lg text-label-lg ${
                  isPos ? 'rounded-lg' : 'rounded-xl'
                } ${
                  isActive
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {onUnavailableClick && (
            <>
              <button
                type="button"
                onClick={() => onUnavailableClick('Reportes')}
                className={`flex items-center gap-space-sm px-space-md py-space-sm text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer text-left ${
                  isPos ? 'rounded-lg' : 'rounded-xl'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPos ? 'bar_chart' : 'analytics'}
                </span>
                <span>Reportes</span>
              </button>
              <button
                type="button"
                onClick={() => onUnavailableClick('Ajustes')}
                className={`flex items-center gap-space-sm px-space-md py-space-sm text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer text-left ${
                  isPos ? 'rounded-lg' : 'rounded-xl'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  settings
                </span>
                <span>Ajustes</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Cerrar Sesión */}
      <div className={`p-space-md ${!isPos ? 'bg-surface-container-low' : ''}`}>
        <NavLink
          to="/login"
          onClick={() => clearSessionEmployee()}
          className={`flex items-center gap-space-sm w-full px-space-md py-space-sm text-error font-label-lg text-label-lg hover:bg-error-container hover:text-on-error-container transition-all ${
            isPos ? 'rounded-lg' : 'rounded-xl font-semibold'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Cerrar Sesión</span>
        </NavLink>
      </div>
    </aside>
  );
}
