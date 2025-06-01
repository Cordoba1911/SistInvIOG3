import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import AuthForm from './components/AuthForm';
import ProductTable from './pages/Articulos/ProductTable';
import HomePage from './pages/HomePage';
<<<<<<< HEAD
import './App.css'; // Asegúrate de tener estilos básicos
import ProveedoresRouter from './routes/ProveedoresRouter';

=======
import './App.css'; 
import ArticulosForm from './pages/ABM Forms/ArticulosForm';
import ProveedoresForm from './pages/ABM Forms/ProveedoresForm';
import OrdenForm from './pages/ABM Forms/OrdenForm';
import VentasForm from './pages/ABM Forms/VentasForm';
import OrdenList from './pages/OrdenCompra/OrdenList';
import NuevaOrden from './pages/OrdenCompra/NuevaOrden';
import ProveedoresList from './pages/Proveedores/ProveedoresList';
>>>>>>> e42c6165e6c185f35446915d414b4ecd987335f9

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          
          <Route path="/" element={<DashboardLayout />}>
<<<<<<< HEAD
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductTable />} />
          <Route path="proveedores/*" element={<ProveedoresRouter />} />
=======
            <Route index element={<HomePage />} />
            <Route path="productos" element={<ProductTable />} />
            <Route path="/ordenes" element={<OrdenList />} />
            <Route path="/ordenes/nueva" element={<NuevaOrden />} />
            <Route path="/proveedores" element={<ProveedoresList />} />
            <Route path="alta-articulo" element={<ArticulosForm />} />
            <Route path="alta-proveedor" element={<ProveedoresForm />} />
            <Route path="alta-orden" element={<OrdenForm />} />
            <Route path="alta-venta" element={<VentasForm />} />
>>>>>>> e42c6165e6c185f35446915d414b4ecd987335f9
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
