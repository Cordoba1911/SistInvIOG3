import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ArticulosForm from '../pages/Articulos/ArticulosForm';
import ArticulosList from '../pages/Articulos/ArticulosList';

export interface Articulo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  descripcion: string;
  categoria: string;
  proveedor: string;
  imagen?: string;
  activo: boolean;
  modeloInventario: string;
}

const ArticulosRouter = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [modelosInventario, setModelosInventario] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const res = await fetch('/api/modelos-inventario');
        if (!res.ok) throw new Error('Error al cargar modelos');
        const data: string[] = await res.json();
        setModelosInventario(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchModelos();
  }, []);

  const agregarArticulo = (datos: Omit<Articulo, 'id' | 'activo'>) => {
    const nuevo: Articulo = {
      id: crypto.randomUUID(),
      ...datos,
      activo: true,
    };
    setArticulos((prev) => [...prev, nuevo]);
  };

  const modificarArticulo = (id: string, nuevosDatos: Partial<Articulo>) => {
    setArticulos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p))
    );
  };

  const bajaLogicaArticulo = (id: string) => {
    setArticulos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: false } : p))
    );
  };

  if (loading) return <div>Cargando modelos de inventario...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <Routes>
        <Route
          path="nuevo"
          element={
            <ArticulosForm
              onAlta={agregarArticulo}
              modelosInventario={modelosInventario}
            />
          }
        />
        <Route
          path="admin-articulos"
          element={
            <ArticulosList
              articulo={articulos}
              onModificar={modificarArticulo}
              onBaja={bajaLogicaArticulo}
              modelosInventario={modelosInventario}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default ArticulosRouter;
