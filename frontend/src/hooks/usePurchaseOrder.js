import { useCallback, useMemo, useState } from 'react';
import {
  INITIAL_COMPRA_ITEMS,
  MOCK_PRODUCTOS,
  MOCK_PROVEEDORES,
} from '../data/mockData';

/**
 * Custom Hook que gestiona el estado de la orden de compra (compra + d_compra).
 */
export function usePurchaseOrder() {
  const [compraId, setCompraId] = useState(1);
  const [providerId, setProviderId] = useState(MOCK_PROVEEDORES[0].id_proveedor);
  const [purchaseDate, setPurchaseDate] = useState(
    () => new Date().toISOString().split('T')[0],
  );
  const [invoiceNumber, setInvoiceNumber] = useState('FAC-88492');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState(INITIAL_COMPRA_ITEMS);

  const updateItemProduct = useCallback((rowId, newProductId) => {
    const prodIdNum = Number(newProductId);
    const product = MOCK_PRODUCTOS.find((p) => p.id_producto === prodIdNum);
    setItems((prev) =>
      prev.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              id_producto: prodIdNum,
              costo: product ? product.costo_base : row.costo,
            }
          : row,
      ),
    );
  }, []);

  const updateItemQty = useCallback((rowId, nextQty) => {
    const parsed = Math.max(1, Number(nextQty) || 1);
    setItems((prev) =>
      prev.map((row) =>
        row.rowId === rowId ? { ...row, cantidad_compra: parsed } : row,
      ),
    );
  }, []);

  const updateItemCost = useCallback((rowId, nextCost) => {
    const parsed = Math.max(0, Number(nextCost) || 0);
    setItems((prev) =>
      prev.map((row) => (row.rowId === rowId ? { ...row, costo: parsed } : row)),
    );
  }, []);

  const addRow = useCallback(() => {
    const defaultProduct = MOCK_PRODUCTOS[5] || MOCK_PRODUCTOS[0];
    setItems((prev) => [
      ...prev,
      {
        rowId: Date.now() + Math.random(),
        id_producto: defaultProduct.id_producto,
        cantidad_compra: 10,
        costo: defaultProduct.costo_base,
      },
    ]);
  }, []);

  const removeRow = useCallback((rowId) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.rowId !== rowId);
    });
  }, []);

  const resetOrder = useCallback(() => {
    setProviderId(MOCK_PROVEEDORES[0].id_proveedor);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setInvoiceNumber('');
    setNotes('');
    setItems(INITIAL_COMPRA_ITEMS);
  }, []);

  const registerOrder = useCallback(() => {
    setCompraId((prev) => prev + 1);
    setNotes('');
  }, []);

  const summary = useMemo(() => {
    let totalUnits = 0;
    let subtotal = 0;
    items.forEach((row) => {
      totalUnits += row.cantidad_compra;
      subtotal += row.cantidad_compra * row.costo;
    });
    const tax = subtotal * 0.16;
    const total = subtotal + tax;
    return { totalUnits, subtotal, tax, total };
  }, [items]);

  return {
    compraId,
    providerId,
    setProviderId,
    purchaseDate,
    setPurchaseDate,
    invoiceNumber,
    setInvoiceNumber,
    notes,
    setNotes,
    items,
    summary,
    updateItemProduct,
    updateItemQty,
    updateItemCost,
    addRow,
    removeRow,
    resetOrder,
    registerOrder,
  };
}
