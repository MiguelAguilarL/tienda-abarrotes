import { useCallback, useEffect, useMemo, useState } from 'react';
import { tiendaApi } from '../services/api';

/**
 * Custom Hook que carga proveedores y productos reales desde MySQL
 * para la pantalla de Compras en modo solo lectura.
 */
export function usePurchaseOrder() {
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [providerId, setProviderId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(
    () => new Date().toISOString().split('T')[0],
  );
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([tiendaApi.getProveedores(), tiendaApi.getProductos()])
      .then(([provData, prodData]) => {
        if (!active) return;
        setProviders(provData);
        setProducts(prodData);
        if (provData.length > 0) {
          setProviderId(provData[0].id_proveedor);
        }
        if (prodData.length > 0) {
          setItems([
            {
              rowId: 1,
              id_producto: prodData[0].id_producto,
              cantidad_compra: 1,
              costo: prodData[0].p_actual,
            },
          ]);
        }
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

  const updateItemProduct = useCallback(
    (rowId, newProductId) => {
      const prodIdNum = Number(newProductId);
      const product = products.find((p) => p.id_producto === prodIdNum);
      setItems((prev) =>
        prev.map((row) =>
          row.rowId === rowId
            ? {
                ...row,
                id_producto: prodIdNum,
                costo: product ? product.p_actual : row.costo,
              }
            : row,
        ),
      );
    },
    [products],
  );

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
    if (products.length === 0) return;
    const defaultProduct = products[0];
    setItems((prev) => [
      ...prev,
      {
        rowId: Date.now() + Math.random(),
        id_producto: defaultProduct.id_producto,
        cantidad_compra: 1,
        costo: defaultProduct.p_actual,
      },
    ]);
  }, [products]);

  const removeRow = useCallback((rowId) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.rowId !== rowId);
    });
  }, []);

  const resetOrder = useCallback(() => {
    if (providers.length > 0) setProviderId(providers[0].id_proveedor);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setInvoiceNumber('');
    setNotes('');
    if (products.length > 0) {
      setItems([
        {
          rowId: Date.now(),
          id_producto: products[0].id_producto,
          cantidad_compra: 1,
          costo: products[0].p_actual,
        },
      ]);
    }
  }, [providers, products]);

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
    providers,
    products,
    loading,
    error,
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
  };
}
