import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCard from '../../components/login/LoginCard';
import { setSessionEmployee, tiendaApi } from '../../services/api';

/**
 * Pantalla de autenticación (/login) conectada a GET /api/empleados.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    tiendaApi
      .getEmpleados()
      .then((data) => {
        if (active) setEmployees(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLoginSuccess = ({ employee }) => {
    setSessionEmployee(employee);
    navigate(employee.puesto === 'Almacen' ? '/compra' : '/venta');
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between">
      <header className="w-full py-space-lg flex justify-center items-center">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <span className="material-symbols-outlined text-on-primary text-[20px]">
              storefront
            </span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            TiendaAbarrotes
          </span>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center px-gutter-mobile md:px-gutter">
        <LoginCard
          employees={employees}
          loadingEmployees={loading}
          apiError={error}
          onLoginSuccess={handleLoginSuccess}
        />
      </main>

      <footer className="w-full py-space-lg text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-space-xs sm:gap-space-md font-body-sm text-body-sm text-on-surface-variant">
          <p>© Sistema de Gestión de Tienda. Hecho por Miguel Aguilar.</p>
        </div>
      </footer>
    </div>
  );
}
