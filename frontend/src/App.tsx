import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import './App.css'; 
import ProveedoresRouter from './routes/ProveedoresRouter';
import ArticulosRouter from './routes/ArticulosRoutes';
import VentasRouter from './routes/VentasRoute';
import { OrdenCompraRoutes as OrdenCompraRouter } from './pages/OrdenCompra/OrdenCompraRoutes';
import ModelosInventarioPage from "./pages/Cálculo de Modelos/ModelosInventarioPage";

function App() { 
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="proveedores/*" element={<ProveedoresRouter />} />
            <Route path="articulos/*" element={<ArticulosRouter />} />
            <Route path="ventas/*" element={<VentasRouter />} />
            <Route path="ordenes/*" element={<OrdenCompraRouter />} />
            <Route path="modelos" element={<ModelosInventarioPage />} />
      {/* Más rutas */}
          </Route>

          {/* Ruta comodín */}
          <Route path="*" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
