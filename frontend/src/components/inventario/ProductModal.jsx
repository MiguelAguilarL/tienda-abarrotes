import { useState } from 'react';
import { CATEGORY_LABELS } from '../../utils/formatters';
import Modal from '../common/Modal';

const getInitialForm = (editingItem) => {
  if (editingItem) {
    return {
      nombre_producto: editingItem.nombre_producto,
      especificacion: editingItem.especificacion,
      categoria: editingItem.categoria,
      p_actual: editingItem.p_actual,
      stock: editingItem.stock,
      f_entrada: editingItem.f_entrada,
      f_caducidad: editingItem.f_caducidad,
    };
  }
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  return {
    nombre_producto: '',
    especificacion: '',
    categoria: 'Abarrotes',
    p_actual: 25.0,
    stock: 20,
    f_entrada: today,
    f_caducidad: nextMonth.toISOString().split('T')[0],
  };
};

/**
 * Modal para alta o edición mock de un producto/lote en inventario.
 */
export default function ProductModal({ isOpen, onClose, editingItem, onSave }) {
  const [form, setForm] = useState(() => getInitialForm(editingItem));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(
      {
        ...form,
        p_actual: Number(form.p_actual),
        stock: Number(form.stock),
      },
      editingItem?.id_inventario || null,
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? `Editar ${editingItem.inv_code}` : 'Agregar Producto Nuevo'}
      icon={editingItem ? 'edit' : 'add_box'}
    >
      <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface">
            Nombre del Producto *
          </label>
          <input
            type="text"
            required
            value={form.nombre_producto}
            onChange={(e) => handleChange('nombre_producto', e.target.value)}
            placeholder="Ej. Yogurt Natural 1kg"
            className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface">
            Especificación / Presentación
          </label>
          <input
            type="text"
            value={form.especificacion}
            onChange={(e) => handleChange('especificacion', e.target.value)}
            placeholder="Ej. Envase plástico sellado"
            className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface">
              Categoría
            </label>
            <select
              value={form.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface">
              Precio ($) *
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              required
              value={form.p_actual}
              onChange={(e) => handleChange('p_actual', e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-code-num focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface">
              Stock (uds) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-code-num focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface">
              F. Entrada
            </label>
            <input
              type="date"
              required
              value={form.f_entrada}
              onChange={(e) => handleChange('f_entrada', e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface">
              F. Caducidad
            </label>
            <input
              type="date"
              required
              value={form.f_caducidad}
              onChange={(e) => handleChange('f_caducidad', e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
        </div>

        <div className="flex justify-end gap-space-sm pt-space-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-space-md py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg cursor-pointer"
          >
            {editingItem ? 'Guardar Cambios' : 'Agregar al Inventario'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
