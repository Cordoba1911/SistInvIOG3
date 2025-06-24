import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { Card } from "react-bootstrap";
import OrdenCompraForm from "../pages/OrdenCompra/OrdenForm";
import OrdenCompraList from "../pages/OrdenCompra/OrdenList";
import { ordenesService } from "../services/ordenesService";
import type { OrdenCompra } from "../types/ordenCompra";

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
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarOrdenes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordenesService.getAll();
      setOrdenes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  // Esta función se llama desde el formulario después de crear una orden
  const handleAlta = () => {
    cargarOrdenes();
  };

  // Funciones simuladas para que la lista no falle, se implementarán después
  const handleModificar = () => console.log("Modificar no implementado");
  const handleBaja = () => console.log("Baja no implementada");

  if (loading) return <div>Cargando órdenes de compra...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Routes>
      <Route
        path="/orden-compra"
        element={
          <div className="container mt-4">
            <Card>
              <Card.Body>
                <OrdenCompraForm onAlta={handleAlta} />
              </Card.Body>
            </Card>
          </div>
        }
      />
      <Route
        path="/admin-orden-compra"
        element={
          <OrdenCompraList
            ordenes={ordenes}
            onModificar={handleModificar}
            onBaja={handleBaja}
          />
        }
      />
    </Routes>
  );
};

export default OrdenCompraRouter;
export type OrdenCompraSinID = Omit<OrdenCompra, 'id' | 'activo'>;