import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProveedoresForm from '../pages/Proveedores/ProveedoresForm';
import ArticulosForm from '../pages/ABM Forms/ArticulosForm';
import OrdenForm from '../pages/ABM Forms/OrdenForm';
import VentasForm from '../pages/ABM Forms/VentasForm';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path="alta-articulo" element={<ArticulosForm />} />
            <Route path="alta-proveedor" element={<ProveedoresForm />} />
            <Route path="alta-orden" element={<OrdenForm />} />
            <Route path="alta-venta" element={<VentasForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
