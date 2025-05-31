import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import AuthForm from './components/AuthForm';
import ProductTable from './components/ProductTable';
import HomePage from './pages/HomePage';
import './App.css'; // Asegúrate de tener estilos básicos
import ProveedoresRouter from './routes/ProveedoresRouter';
import ArticulosRouter from './routes/ArticulosRoutes';



function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          
          <Route path="/" element={<DashboardLayout />}>

          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductTable />} />
          <Route path="proveedores/*" element={<ProveedoresRouter />} />
          <Route path="articulos/*" element={<ArticulosRouter />} />
            <Route index element={<HomePage />} />
            <Route path="productos" element={<ProductTable />} />
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
