import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ArticulosForm from '../pages/Articulos/ArticulosForm';
import ArticulosList from '../pages/Articulos/ArticulosList';

// Definición de la interfaz Articulo
export interface Articulo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  descripcion: string;
  categoria: string;
  proveedor: string;
  imagen?: string; // Imagen opcional
  activo: boolean;
}

// Definición del componente ArticulosRouter
const ArticulosRouter = () => {

  // Estado para manejar la lista de artículos
  // Inicialmente, la lista de artículos está vacía
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  // Funciones para manejar las operaciones CRUD
  const agregarArticulo = (datos: Omit<Articulo, 'id' | 'activo'>) => {
    const nuevo: Articulo = {
      id: crypto.randomUUID(),
      ...datos,
      activo: true,
    };
    // Agrega el nuevo articulo al estado
    setArticulos((prev) => [...prev, nuevo]);
  };

  // Modificar un proveedor existente
  const modificarArticulo = (id: string, nuevosDatos: Partial<Articulo>) => {
    setArticulos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p))
    );
  }; 

  // Realizar baja lógica de un articulo (marcar como inactivo)
  const bajaLogicaArticulo = (id: string) => {
    setArticulos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: false } : p))
    );
  };

  // Renderiza las rutas para agregar y administrar artículos
  // Utiliza el componente Routes de react-router-dom para definir las rutas
  return (
    <Routes>
      <Route path="/articulos" element={<ArticulosForm onAlta={agregarArticulo} />} />
      <Route
        path="/admin-articulos"
        element={
          // Componente que lista y permite editar y dar de baja artículos
          // Se pasa la lista de artículos y las funciones para modificar y dar de baja
          <ArticulosList
            articulo={articulos}
            onModificar={modificarArticulo}
            onBaja={bajaLogicaArticulo}
          />
        }
      />
    </Routes>
  );
};

export default ArticulosRouter;
export type ArticuloSinID = Omit<Articulo, 'id' | 'activo' >; // Exporta la interfaz para que pueda ser usada en otros componentes
