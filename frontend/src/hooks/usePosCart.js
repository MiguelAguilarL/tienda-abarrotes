import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { tiendaApi } from '../services/api';

/**
 * Custom Hook que carga productos reales de MySQL (GET /api/productos)
 * y controla el ticket garantizando que no existan productos duplicados.
 */
export function usePosCart({ onRequestCheckout } = {}) {
  const searchInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ticketItems, setTicketItems] = useState([]);

  useEffect(() => {
    let active = true;
    tiendaApi
      .getProductos()
      .then((data) => {
        if (active) setProducts(data);
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
  }, [reloadTick]);

  const reloadProducts = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((prod) => {
      const matchesCat =
        selectedCategory === 'all' || prod.categoria === selectedCategory;
      const matchesQuery =
        !query ||
        prod.nombre_producto.toLowerCase().includes(query) ||
        String(prod.id_producto).includes(query);
      return matchesCat && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Nunca duplica id_producto: si ya existe en ticketItems, incrementa su cantidad
  const addProductToTicket = useCallback((product) => {
    const available = product.stock ?? 0;
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
  }, []);

  const updateItemQty = useCallback(
    (productId, delta) => {
      const product = products.find((p) => p.id_producto === productId);
      const available = product?.stock ?? 0;
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
    [products],
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
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    totalCatalogCount: products.length,
    filteredProducts,
    ticketItems,
    totals,
    addProductToTicket,
    updateItemQty,
    removeItem,
    clearTicket,
    reloadProducts,
  };
}
