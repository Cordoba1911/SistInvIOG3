import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import AuthForm from './components/AuthForm';
import HomePage from './pages/HomePage';
import './App.css'; 
import ProveedoresRouter from './routes/ProveedoresRouter';
import ArticulosRouter from './routes/ArticulosRoutes';
import VentasRouter from './routes/VentasRoute';



function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          
          <Route path="/" element={<DashboardLayout />}>

          <Route index element={<HomePage />} />
          <Route path="proveedores/*" element={<ProveedoresRouter />} />
          <Route path="articulos/*" element={<ArticulosRouter />} />
          <Route path="ventas/*" element={<VentasRouter />} />
            <Route index element={<HomePage />} />
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
