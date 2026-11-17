import { useState } from 'react';

/**
 * Tarjeta de inicio de sesión conectada a los empleados reales de la BD.
 */
export default function LoginCard({
  employees = [],
  loadingEmployees = false,
  apiError = null,
  onLoginSuccess,
}) {
  const [employeeInput, setEmployeeInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [validationError, setValidationError] = useState('');

  const demoSeller = employees.find((e) => e.puesto === 'Vendedor');
  const demoWarehouse = employees.find((e) => e.puesto === 'Almacen');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setValidationError('');

    const query = employeeInput.trim().toLowerCase();
    const matched = employees.find(
      (emp) =>
        String(emp.id_empleado) === query ||
        emp.nombre_empleado.toLowerCase() === query ||
        emp.nombre_empleado.toLowerCase().includes(query),
    );

    if (!matched) {
      setValidationError(
        'Empleado no encontrado en la base de datos. Verifica el ID o nombre.',
      );
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onLoginSuccess({ employee: matched, rememberSession });
      }, 450);
    }, 500);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center py-space-md sm:py-space-xl relative">
      <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-surface-container/60 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-[0_12px_36px_-6px_rgba(19,27,46,0.06),0_4px_16px_-2px_rgba(19,27,46,0.03)] p-8 sm:p-10 transition-all duration-300">
        <div className="text-left mb-space-xl">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-space-md shadow-sm">
            <span className="material-symbols-outlined text-primary text-[26px]">
              storefront
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Iniciar Sesión
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Sistema de Gestión de Tienda
          </p>
        </div>

        {(apiError || validationError) && (
          <div className="mb-space-md p-3 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0">
              error
            </span>
            <span>{validationError || apiError}</span>
          </div>
        )}

        <form className="space-y-space-md" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              className="block font-label-lg text-label-lg text-on-surface"
              htmlFor="employee-id"
            >
              Nombre de Empleado o ID
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  badge
                </span>
              </div>
              <input
                id="employee-id"
                name="employee-id"
                type="text"
                autoComplete="username"
                required
                value={employeeInput}
                onChange={(e) => {
                  setEmployeeInput(e.target.value);
                  setValidationError('');
                }}
                placeholder="Ej. 1 o Carlos López"
                className="w-full h-11 pl-11 pr-4 bg-surface-container-low/40 text-on-surface placeholder:text-outline font-body-md text-body-md rounded-lg shadow-sm outline-none transition-all duration-200 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:ring-offset-1 focus:ring-offset-surface-container-lowest"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label
              className="block font-label-lg text-label-lg text-on-surface"
              htmlFor="employee-password"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
              </div>
              <input
                id="employee-password"
                name="employee-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-11 pr-11 bg-surface-container-low/40 text-on-surface placeholder:text-outline font-body-md text-body-md rounded-lg shadow-sm outline-none transition-all duration-200 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:ring-offset-1 focus:ring-offset-surface-container-lowest"
              />
              <button
                type="button"
                aria-label="Ver u ocultar contraseña"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <input
                id="remember-session"
                name="remember-session"
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="w-4 h-4 rounded text-primary-container bg-surface-container-low focus:ring-primary-container focus:ring-offset-1 transition-colors cursor-pointer accent-primary-container"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                Recordar sesión
              </span>
            </label>
          </div>

          <div className="pt-space-sm">
            <button
              type="submit"
              disabled={status !== 'idle' || loadingEmployees || Boolean(apiError)}
              className={`w-full h-12 text-on-primary font-label-lg text-label-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                status === 'success'
                  ? 'bg-secondary cursor-default'
                  : status === 'loading' || loadingEmployees || apiError
                    ? 'bg-primary-container opacity-75 cursor-not-allowed'
                    : 'bg-primary-container hover:bg-primary cursor-pointer'
              }`}
            >
              <span>
                {loadingEmployees
                  ? 'Conectando con BD...'
                  : status === 'loading'
                    ? 'Verificando empleado...'
                    : status === 'success'
                      ? 'Acceso concedido'
                      : 'Ingresar'}
              </span>
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                  status === 'loading' || loadingEmployees
                    ? 'animate-spin'
                    : status === 'idle'
                      ? 'group-hover:translate-x-1'
                      : ''
                }`}
              >
                {status === 'loading' || loadingEmployees
                  ? 'sync'
                  : status === 'success'
                    ? 'check_circle'
                    : 'arrow_forward'}
              </span>
            </button>
          </div>
        </form>

        {/* Accesos rápidos con empleados reales de MySQL */}
        <div className="mt-space-lg bg-surface-container-low/60 rounded-lg p-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            {demoSeller && (
              <button
                type="button"
                onClick={() => {
                  setEmployeeInput(demoSeller.nombre_empleado);
                  setPassword('123456');
                  setValidationError('');
                }}
                className="px-2 py-1 rounded bg-surface-container-lowest hover:bg-primary-fixed hover:text-primary font-label-sm text-label-sm transition-colors cursor-pointer"
              >
                {demoSeller.nombre_empleado} (Vendedor)
              </button>
            )}
            {demoWarehouse && (
              <button
                type="button"
                onClick={() => {
                  setEmployeeInput(demoWarehouse.nombre_empleado);
                  setPassword('123456');
                  setValidationError('');
                }}
                className="px-2 py-1 rounded bg-surface-container-lowest hover:bg-primary-fixed hover:text-primary font-label-sm text-label-sm transition-colors cursor-pointer"
              >
                {demoWarehouse.nombre_empleado} (Almacén)
              </button>
            )}
          </div>
          <span className="font-code-num text-body-sm text-on-surface-variant px-2 py-1 bg-surface-container-lowest rounded">
            BD Conectada
          </span>
        </div>
      </div>

      <div className="mt-space-md text-center max-w-[420px] px-space-sm">
        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-center gap-1.5 leading-relaxed">
          <span className="material-symbols-outlined text-[16px] text-tertiary">
            contact_support
          </span>
          Para soporte o reactivación de cuenta, contacta al administrador de turno.
        </p>
      </div>
    </div>
  );
}
