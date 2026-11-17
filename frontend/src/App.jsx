import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CompraPage from './pages/compra/CompraPage';
import InventarioPage from './pages/inventario/InventarioPage';
import LoginPage from './pages/login/LoginPage';
import ReportesPage from './pages/reportes/ReportesPage';
import VentaPage from './pages/venta/VentaPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/venta" element={<VentaPage />} />
        <Route path="/compra" element={<CompraPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
