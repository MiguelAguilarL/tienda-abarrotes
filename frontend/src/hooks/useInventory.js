import { useCallback, useMemo, useState } from 'react';
import {
  getDaysUntil,
  INITIAL_INVENTARIO,
  MOCK_PRODUCTOS,
} from '../data/mockData';

const PAGE_SIZE = 5;

/**
 * Custom Hook que gestiona el inventario mock, KPIs, filtros, paginación y CRUD en memoria.
 */
export function useInventory() {
  const [items, setItems] = useState(() =>
    INITIAL_INVENTARIO.map((inv) => {
      const prod = MOCK_PRODUCTOS.find((p) => p.id_producto === inv.id_producto);
      return {
        ...inv,
        inv_code: prod.inv_code,
        sku: prod.sku,
        nombre_producto: prod.nombre_producto,
        especificacion: prod.especificacion,
        categoria: prod.categoria,
        p_actual: prod.p_actual,
      };
    }),
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const kpis = useMemo(() => {
    const criticalCount = items.filter((item) => item.stock < 10).length;
    const expiringCount = items.filter(
      (item) => getDaysUntil(item.f_caducidad) <= 7,
    ).length;
    return { criticalCount, expiringCount };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.nombre_producto.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.inv_code.toLowerCase().includes(query) ||
        item.especificacion.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'all' || item.categoria === categoryFilter;

      const daysLeft = getDaysUntil(item.f_caducidad);
      let matchesStatus = true;
      if (statusFilter === 'critical') {
        matchesStatus = item.stock < 10;
      } else if (statusFilter === 'optimal') {
        matchesStatus = item.stock >= 10;
      } else if (statusFilter === 'expiring') {
        matchesStatus = daysLeft <= 7;
      }

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, safePage]);

  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((val) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const saveItem = useCallback((formData, editingId = null) => {
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id_inventario === editingId ? { ...item, ...formData } : item,
        ),
      );
    } else {
      setItems((prev) => {
        const nextId =
          prev.reduce((max, i) => Math.max(max, i.id_inventario), 100) + 1;
        return [
          {
            id_inventario: nextId,
            id_producto: nextId,
            inv_code: `#INV-${nextId}`,
            sku: `SKU-7501${nextId}`,
            ...formData,
          },
          ...prev,
        ];
      });
      setCurrentPage(1);
    }
  }, []);

  const deleteItem = useCallback((idInventario) => {
    setItems((prev) => prev.filter((item) => item.id_inventario !== idInventario));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  }, []);

  return {
    kpis,
    totalCount: filteredItems.length,
    paginatedItems,
    searchQuery,
    categoryFilter,
    statusFilter,
    currentPage: safePage,
    totalPages,
    pageSize: PAGE_SIZE,
    setCurrentPage,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    saveItem,
    deleteItem,
    resetFilters,
  };
}
