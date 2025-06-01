import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProveedoresForm from '../pages/Proveedores/ProveedoresForm';
import ProveedoresList from '../pages/Proveedores/ProveedoresList';

export interface Proveedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;
}

const ProveedoresRouter = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const agregarProveedor = (datos: Omit<Proveedor, 'id' | 'activo'>) => {
    const nuevo: Proveedor = {
      id: crypto.randomUUID(),
      ...datos,
      activo: true,
    };
    setProveedores((prev) => [...prev, nuevo]);
  };

  const modificarProveedor = (id: string, nuevosDatos: Partial<Proveedor>) => {
    setProveedores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p))
    );
  };

  const bajaLogicaProveedor = (id: string) => {
    setProveedores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: false } : p))
    );
  };

  return (
    <Routes>
      {/* Ruta por defecto: al ir a /proveedores */}
      <Route
        index
        element={
          <ProveedoresList
            proveedores={proveedores}
            onModificar={modificarProveedor}
            onBaja={bajaLogicaProveedor}
          />
        }
      />
      <Route
        path="nuevo"
        element={<ProveedoresForm onAlta={agregarProveedor} />}
      />
    </Routes>
  );
};

export default ProveedoresRouter;
export type ProveedorSinID = Omit<Proveedor, 'id' | 'activo'>;
