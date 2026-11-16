import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Modal from '../common/Modal';

/**
 * Layout principal para módulos con barra lateral y cabecera fija.
 */
export default function DashboardLayout({
  variant = 'warehouse',
  employeeName = 'Juan Pérez',
  employeeRole = 'Encargado de Almacén',
  children,
}) {
  const [infoModal, setInfoModal] = useState(null);

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <Sidebar variant={variant} onUnavailableClick={(mod) => setInfoModal(mod)} />
      <div className="pl-64">
        <Header
          variant={variant}
          employeeName={employeeName}
          employeeRole={employeeRole}
        />
        <main className="w-full pt-16 bg-surface min-h-screen px-space-lg">
          {children}
        </main>
      </div>

      <Modal
        isOpen={Boolean(infoModal)}
        onClose={() => setInfoModal(null)}
        title={`Módulo de ${infoModal}`}
        icon="construction"
      >
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
          El módulo de <strong>{infoModal}</strong> está en preparación y se habilitará en una fase posterior cuando se conecte con la base de datos.
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setInfoModal(null)}
            className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </Modal>
    </div>
  );
}
