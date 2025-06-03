// src/routes/ProveedoresRouter.tsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProveedoresForm from '../pages/Proveedores/ProveedoresForm';
import ProveedoresList from '../pages/Proveedores/ProveedoresList';

// Definición de la interfaz Proveedor
export interface Proveedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;
}

// Definición del componente ProveedoresRouter
const ProveedoresRouter = () => {

  // Estado para manejar la lista de proveedores
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  // Funciones para manejar las operaciones CRUD
  const agregarProveedor = (datos: Omit<Proveedor, 'id' | 'activo'>) => {
    const nuevo: Proveedor = {
      id: crypto.randomUUID(),
      ...datos,
      activo: true,
    };
    // Agrega el nuevo proveedor al estado
    setProveedores((prev) => [...prev, nuevo]);
  };

  // Modificar un proveedor existente
  const modificarProveedor = (id: string, nuevosDatos: Partial<Proveedor>) => {
    setProveedores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p))
    );
  };

  // Realizar baja lógica de un proveedor (marcar como inactivo)
  const bajaLogicaProveedor = (id: string) => {
    setProveedores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: false } : p))
    );
  };

  // Renderiza las rutas para agregar y administrar proveedores
  return (
    <Routes>
      <Route path="/proveedores" element={<ProveedoresForm onAlta={agregarProveedor} />} />
      <Route
        path="/admin-proveedores"
        element={
          // Componente que lista y permite editar proveedores
          // Se pasa la lista de proveedores y las funciones para modificar y dar de baja
          <ProveedoresList
            proveedores={proveedores}
            onModificar={modificarProveedor}
            onBaja={bajaLogicaProveedor}
          />
        }
      />
    </Routes>
  );
};

export default ProveedoresRouter;
// This file defines the TypeScript types for a Proveedor (Provider) entity.
export type ProveedorSinID = Omit<Proveedor, 'id' | 'activo'>;