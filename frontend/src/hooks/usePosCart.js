import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_INVENTARIO,
  INITIAL_TICKET_ITEMS,
  MOCK_PRODUCTOS,
} from '../data/mockData';

/**
 * Custom Hook que encapsula el estado del catálogo, filtros, ticket de venta
 * y atajos de teclado del Terminal Punto de Venta (TPV).
 */
export function usePosCart({ onRequestCheckout } = {}) {
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saleId, setSaleId] = useState(1);

  // Mapa rápido de stock inicial por producto
  const [stockByProduct, setStockByProduct] = useState(() => {
    const map = {};
    INITIAL_INVENTARIO.forEach((inv) => {
      map[inv.id_producto] = (map[inv.id_producto] || 0) + inv.stock;
    });
    return map;
  });

  // Partidas del ticket (d_venta)
  const [ticketItems, setTicketItems] = useState(() =>
    INITIAL_TICKET_ITEMS.map((item) => {
      const product = MOCK_PRODUCTOS.find((p) => p.id_producto === item.id_producto);
      return {
        id_producto: item.id_producto,
        nombre_producto: product.nombre_producto,
        p_unitario: product.p_actual,
        cantidad: item.cantidad,
      };
    }),
  );

  // Productos enriquecidos con existencia actual
  const catalogProducts = useMemo(() => {
    return MOCK_PRODUCTOS.map((prod) => ({
      ...prod,
      stock: stockByProduct[prod.id_producto] ?? 0,
    }));
  }, [stockByProduct]);

  // Productos filtrados por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return catalogProducts.filter((prod) => {
      const matchesCat =
        selectedCategory === 'all' || prod.categoria === selectedCategory;
      const matchesQuery =
        !query ||
        prod.nombre_producto.toLowerCase().includes(query) ||
        prod.sku.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });
  }, [catalogProducts, selectedCategory, searchQuery]);

  const addProductToTicket = useCallback(
    (product) => {
      const available = stockByProduct[product.id_producto] ?? 0;
      setTicketItems((prev) => {
        const existing = prev.find((i) => i.id_producto === product.id_producto);
        const currentQty = existing ? existing.cantidad : 0;
        if (currentQty >= available) return prev;

        if (existing) {
          return prev.map((i) =>
            i.id_producto === product.id_producto
              ? { ...i, cantidad: i.cantidad + 1 }
              : i,
          );
        }
        return [
          ...prev,
          {
            id_producto: product.id_producto,
            nombre_producto: product.nombre_producto,
            p_unitario: product.p_actual,
            cantidad: 1,
          },
        ];
      });
    },
    [stockByProduct],
  );

  const updateItemQty = useCallback(
    (productId, delta) => {
      const available = stockByProduct[productId] ?? 0;
      setTicketItems((prev) =>
        prev
          .map((item) => {
            if (item.id_producto !== productId) return item;
            const nextQty = Math.min(available, item.cantidad + delta);
            return { ...item, cantidad: nextQty };
          })
          .filter((item) => item.cantidad > 0),
      );
    },
    [stockByProduct],
  );

  const removeItem = useCallback((productId) => {
    setTicketItems((prev) => prev.filter((item) => item.id_producto !== productId));
  }, []);

  const clearTicket = useCallback(() => {
    setTicketItems([]);
  }, []);

  const totals = useMemo(() => {
    const totalArticles = ticketItems.length;
    const totalPieces = ticketItems.reduce((acc, item) => acc + item.cantidad, 0);
    const totalAmount = ticketItems.reduce(
      (acc, item) => acc + item.cantidad * item.p_unitario,
      0,
    );
    return { totalArticles, totalPieces, totalAmount };
  }, [ticketItems]);

  const completeSale = useCallback(() => {
    if (ticketItems.length === 0) return;
    setStockByProduct((prev) => {
      const next = { ...prev };
      ticketItems.forEach((item) => {
        next[item.id_producto] = Math.max(0, (next[item.id_producto] || 0) - item.cantidad);
      });
      return next;
    });
    setTicketItems([]);
    setSaleId((prev) => prev + 1);
  }, [ticketItems]);

  // Atajos de teclado POS (F2, Escape, F9, F10, F12)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          setSearchQuery('');
        }
      } else if (e.key === 'F9') {
        e.preventDefault();
        onRequestCheckout?.('Efectivo');
      } else if (e.key === 'F10') {
        e.preventDefault();
        onRequestCheckout?.('Tarjeta');
      } else if (e.key === 'F12') {
        e.preventDefault();
        onRequestCheckout?.('Efectivo');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRequestCheckout]);

  return {
    searchInputRef,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    totalCatalogCount: catalogProducts.length,
    filteredProducts,
    ticketItems,
    saleId,
    totals,
    addProductToTicket,
    updateItemQty,
    removeItem,
    clearTicket,
    completeSale,
  };
}
