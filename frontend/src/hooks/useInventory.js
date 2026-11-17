import { useCallback, useEffect, useMemo, useState } from 'react';
import { tiendaApi } from '../services/api';
import { getDaysUntil } from '../utils/formatters';

const PAGE_SIZE = 5;

/**
 * Custom Hook que consulta el inventario real desde MySQL (GET /api/inventario)
 * en modo solo lectura.
 */
export function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let active = true;
    tiendaApi
      .getInventario()
      .then((data) => {
        if (active) setItems(data);
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
        String(item.id_inventario).includes(query) ||
        String(item.id_producto).includes(query);

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

  const refresh = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
    setLoading(true);
    setError(null);
    setReloadTick((prev) => prev + 1);
  }, []);

  return {
    loading,
    error,
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
    refresh,
  };
}
