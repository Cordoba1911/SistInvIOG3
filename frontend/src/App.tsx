import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import AuthForm from './components/AuthForm';
import ProductTable from './components/ProductTable';
import HomePage from './pages/HomePage';
import './App.css'; // Asegúrate de tener estilos básicos
import ArticulosForm from './pages/ABM Forms/ArticulosForm';
import ProveedoresForm from './pages/ABM Forms/ProveedoresForm';
import OrdenForm from './pages/ABM Forms/OrdenForm';
import VentasForm from './pages/ABM Forms/VentasForm';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<AuthForm />} />
           <Route path="/" element={<HomePage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="productos" element={<ProductTable />} />
            <Route path="alta-articulo" element={<ArticulosForm />} />
            <Route path="alta-proveedor" element={<ProveedoresForm />} />
            <Route path="alta-orden" element={<OrdenForm />} />
            <Route path="alta-venta" element={<VentasForm />} />
            {/* Otras rutas protegidas */}
          </Route>
          <Route path="*" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
