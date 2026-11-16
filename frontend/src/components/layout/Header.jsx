import { useEffect, useState } from 'react';

/**
 * Cabecera fija superior que muestra estado en línea, reloj en vivo y perfil del empleado.
 */
export default function Header({ variant = 'warehouse', employeeName, employeeRole }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeFormatted = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatted = now.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isPos = variant === 'pos';

  return (
    <header
      className={`fixed top-0 left-64 right-0 h-16 z-40 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${
        isPos
          ? 'bg-surface-container-lowest'
          : 'bg-surface-container-lowest/90 backdrop-blur-xl'
      }`}
    >
      {isPos ? (
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              check_circle
            </span>
            <span className="font-label-md text-label-md text-on-surface">
              Caja en Línea
            </span>
          </div>
          <div className="h-6 w-[1px] bg-outline-variant hidden sm:block" />
          <div className="hidden md:flex items-center gap-space-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span className="font-code-num text-code-num text-on-surface">
              {timeFormatted}
            </span>
            <span className="font-body-sm text-body-sm text-outline mx-1">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant capitalize">
              {dateFormatted}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            TiendaAbarrotes Almacén &amp; Administración
          </span>
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            <span className="font-body-sm text-body-sm capitalize">
              {dateFormatted} | {timeFormatted}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-space-md">
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-label-lg text-label-lg text-on-surface font-semibold leading-tight">
            {employeeName}
          </span>
          <span
            className={`block leading-tight ${
              isPos
                ? 'font-label-sm text-label-sm text-primary'
                : 'font-body-sm text-body-sm text-on-surface-variant'
            }`}
          >
            {employeeRole}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">
            person
          </span>
        </div>
      </div>
    </header>
  );
}
