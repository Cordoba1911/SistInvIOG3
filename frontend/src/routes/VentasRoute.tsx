import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import VentasForm from "../pages/Ventas/VentasForm";
import VentasList from "../pages/Ventas/VentasList";

// Definición de la interfaz Venta
export interface Venta {
  id: string;
  articulo: string;
  cantidad: number;
  fecha_venta: string; // Formato YYYY-MM-DD
}

// Definición del componente VentasRouter
const VentasRouter = () => {
  // Estado para manejar la lista de ventas
  const [ventas, setVentas] = useState<Venta[]>([]);

  // Funciones para manejar las operaciones CRUD
  const agregarVenta = (datos: Omit<Venta, "id">) => {
    const nuevaVenta: Venta = {
      id: crypto.randomUUID(),
      ...datos,
    };
    // Agrega la nueva venta al estado
    setVentas((prev) => [...prev, nuevaVenta]);
  };

  // Modificar una venta existente
  const modificarVenta = (id: string, nuevosDatos: Partial<Venta>) => {
    setVentas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...nuevosDatos } : v))
    );
  };

  // Realizar baja lógica de una venta (marcar como inactiva)
  const bajaLogicaVenta = (id: string) => {
    setVentas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, activo: false } : v))
    );
  };

  // Renderiza las rutas para agregar y administrar ventas
  return (
    <Routes>
      <Route path="/ventas" element={<VentasForm onAlta={agregarVenta} />} />
      <Route
        path="/admin-ventas"
        element={
          <VentasList
            ventas={ventas}
            onModificar={modificarVenta}
            onBaja={bajaLogicaVenta}
          />
        }
      />
    </Routes>
  );
};

export default VentasRouter;