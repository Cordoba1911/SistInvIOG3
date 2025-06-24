import { useState, useEffect, useCallback } from "react";
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
      await cargarVentas(); // Recargar para ver la nueva venta
    } catch (err: any) {
      // Intentar parsear el mensaje de error si es un JSON
      try {
        const errorData = JSON.parse(err.message);
        setError(errorData.message || "Ha ocurrido un error inesperado.");
      } catch (parseError) {
        // Si no es un JSON, mostrar el mensaje de error directamente
        setError(err.message || "Error al crear la venta");
      }
    }
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <VentasForm onSubmit={handleCrearVenta} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {loading ? <p>Cargando ventas...</p> : <VentasList ventas={ventas} />}
        </Card.Body>
      </Card>

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
