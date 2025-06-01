import { useState } from 'react';
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
}

const ArticulosRouter = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);

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

  return (
    <Routes>
      {/* Ruta por defecto: al ir a /articulos muestra el formulario o la lista */}
      <Route
        index
        element={<ArticulosList
          articulo={articulos}
          onModificar={modificarArticulo}
          onBaja={bajaLogicaArticulo}
        />}
      />
      <Route
        path="nuevo"
        element={<ArticulosForm onAlta={agregarArticulo} />}
      />
    </Routes>
  );
};

export default ArticulosRouter;
export type ArticuloSinID = Omit<Articulo, 'id' | 'activo'>;
