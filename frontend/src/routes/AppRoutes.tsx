import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProveedoresForm from '../pages/ProveedoresForm';
import ArticulosForm from '../pages/ArticulosForm';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/proveedor" element={<ProveedoresForm />} />
        <Route path="/articulo" element={<ArticulosForm />} />
        {/* Puedes agregar más rutas aquí según sea necesario */}
        {/* Ejemplo: <Route path="/otra-pagina" element={<OtraPagina />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
