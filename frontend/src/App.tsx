import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import AuthForm from './components/AuthForm';
import ProductTable from './components/ProductTable';
import HomePage from './pages/HomePage';
import './App.css'; 
import ArticulosForm from './pages/ABM Forms/ArticulosForm';
import ProveedoresForm from './pages/ABM Forms/ProveedoresForm';
import OrdenForm from './pages/ABM Forms/OrdenForm';
import VentasForm from './pages/ABM Forms/VentasForm';
import OrdenList from './pages/OrdenCompra/OrdenList';
import NuevaOrden from './pages/OrdenCompra/NuevaOrden';
import ProveedoresList from './pages/Proveedores/ProveedoresList';

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
            <Route path="/ordenes" element={<OrdenList />} />
            <Route path="/ordenes/nueva" element={<NuevaOrden />} />
            <Route path="/proveedores" element={<ProveedoresList />} />
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
