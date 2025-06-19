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
  activo?: boolean; // Opcional si usás baja lógica
}

const VentasRouter = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);

  const agregarVenta = (datos: Omit<Venta, "id">) => {
    const nuevaVenta: Venta = {
      id: crypto.randomUUID(),
      ...datos,
      activo: true,
    };
    setVentas((prev) => [...prev, nuevaVenta]);
  };

  const modificarVenta = (id: string, nuevosDatos: Partial<Venta>) => {
    setVentas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...nuevosDatos } : v))
    );
  };

  const bajaLogicaVenta = (id: string) => {
    setVentas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, activo: false } : v))
    );
  };

  return (
    <Routes>
      {/* Ruta por defecto: al ir a /ventas */}
      <Route
        index
        element={
          <VentasList
            ventas={ventas}
            onModificar={modificarVenta}
            onBaja={bajaLogicaVenta}
          />
        }
      />
      <Route
        path="nueva"
        element={<VentasForm onAlta={agregarVenta} />}
      />
    </Routes>
  );
};

export default VentasRouter;
