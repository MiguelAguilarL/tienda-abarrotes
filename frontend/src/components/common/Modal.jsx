import { useEffect } from 'react';

/**
 * Contenedor Modal accesible con cierre por tecla Escape o clic en el fondo.
 */
export default function Modal({ isOpen, onClose, title, icon, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-xs p-space-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${maxWidth} bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            {icon && (
              <span className="material-symbols-outlined text-primary text-[22px]">
                {icon}
              </span>
            )}
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-space-lg">{children}</div>
      </div>
    </div>
  );
}
