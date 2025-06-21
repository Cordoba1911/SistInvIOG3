import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import VentasForm from "../pages/Ventas/VentasForm";
import VentasList from "../pages/Ventas/VentasList";
import { ventasService } from "../services/ventasService";
import type { Venta, CreateVentaDto } from "../types/venta";
import ErrorModal from "../components/common/ErrorModal";

const VentasRouter = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const cargarVentas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ventasService.getAll();
      setVentas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las ventas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  const handleCrearVenta = async (ventaDto: CreateVentaDto) => {
    try {
      await ventasService.create(ventaDto);
      navigate("/ventas"); // Volver a la lista
      await cargarVentas(); // Recargar para ver la nueva venta
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la venta");
    }
  };

  return (
    <>
      <Routes>
        <Route
          index
          element={
            loading ? <p>Cargando ventas...</p> : <VentasList ventas={ventas} />
          }
        />
        <Route
          path="nueva"
          element={
            <Card>
              <Card.Header>
                <h4>Registrar Nueva Venta</h4>
              </Card.Header>
              <Card.Body>
                <VentasForm onSubmit={handleCrearVenta} />
              </Card.Body>
            </Card>
          }
        />
      </Routes>
      <ErrorModal
        show={!!error}
        onHide={() => setError(null)}
        title="Error en Ventas"
        message={error}
      />
    </>
  );
};

export default VentasRouter;
