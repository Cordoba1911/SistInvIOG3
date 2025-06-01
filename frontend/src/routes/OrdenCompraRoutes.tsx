import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import OrdenCompraForm from '../pages/OrdenCompra/OrdenForm';
import OrdenCompraList from '../pages/OrdenCompra/OrdenList';

export interface OrdenCompra {
  id: string;
  nombre: string;
  proveedor: string;
  cantidad: number; // Cantidad de artículos en la orden
  estado: 'Pendiente' | 'Enviada' | 'Finalizada' | 'Cancelada';
  fecha_creacion: string; // Formato YYYY-MM-DD
  fecha_envio?: string; // Formato YYYY-MM-DD, opcional
  fecha_finalizacion?: string; // Formato YYYY-MM-DD, opcional
  activo: boolean; // Indica si la orden está activa
}

const OrdenCompraRouter = () => {

  // Estado para manejar la lista de órdenes de compra
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);

  // Función para agregar una nueva orden de compra
  const agregarOrden = (datos: Omit<OrdenCompra, 'id' | 'activo'>) => {
    const nuevaOrden: OrdenCompra = {
      id: crypto.randomUUID(),
      ...datos,
      activo: true,
    };
    setOrdenes((prev) => [...prev, nuevaOrden]);
  };

  // Función para modificar una orden existente
  const modificarOrden = (id: string, nuevosDatos: Partial<OrdenCompra>) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...nuevosDatos } : o))
    );
  };

  // Función para dar de baja lógica a una orden (marcar como inactiva)
  const bajaLogicaOrden = (id: string) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, activo: false } : o))
    );
  };

  return (
    <Routes>
      <Route path="/orden-compra" element={<OrdenCompraForm onAlta={agregarOrden} />} />
      <Route
        path="/admin-orden-compra"
        element={
          <OrdenCompraList
            ordenes={ordenes}
            onModificar={modificarOrden}
            onBaja={bajaLogicaOrden}
          />
        }
      />
    </Routes>
  );
};

export default OrdenCompraRouter;
export type OrdenCompraSinID = Omit<OrdenCompra, 'id' | 'activo'>;