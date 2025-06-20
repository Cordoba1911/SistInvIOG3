import { Routes, Route } from "react-router-dom";
import OrdenForm from "./OrdenForm";
import OrdenCompraList from "./OrdenCompraList";
import { useState, useEffect } from "react";
import { ordenesService } from "../../services/ordenesService";
import type {
  OrdenCompraDetalle,
  UpdateOrdenCompraDto,
} from "../../types/ordenCompra";
import { Button, Card } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

const OrdenCompraRoutes = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompraDetalle[]>([]);
  const [ordenAEditar, setOrdenAEditar] =
    useState<OrdenCompraDetalle | null>(null);

  const cargarOrdenes = async () => {
    const data = await ordenesService.getAll();
    setOrdenes(data);
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  // Esta es la función que se debe ejecutar al hacer clic
  const handleEditar = (orden: OrdenCompraDetalle) => {
    console.log("INTENTO FINAL - Editando orden:", orden); // Console.log de depuración
    setOrdenAEditar(orden);
  };

  const handleCancelarEdicion = () => {
    setOrdenAEditar(null);
  };

  const handleUpdate = async (id: number, datos: UpdateOrdenCompraDto) => {
    await ordenesService.update(id, datos);
    setOrdenAEditar(null);
    cargarOrdenes(); // Recargar la lista
  };

  return (
    <Routes>
      <Route
        path="/admin-orden-compra"
        element={
          <>
            <OrdenCompraList ordenes={ordenes} onEditar={handleEditar} />
            
            {/* Este bloque debería aparecer cuando ordenAEditar no sea null */}
            {ordenAEditar && (
              <Card className="mt-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      Modificar Orden de Compra #{ordenAEditar.id}
                    </h5>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={handleCancelarEdicion}
                      style={{ color: "red" }}
                    >
                      <FaTimes size={20} />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <OrdenForm
                    ordenAEditar={ordenAEditar}
                    onUpdate={handleUpdate}
                  />
                </Card.Body>
              </Card>
            )}
          </>
        }
      />
      <Route
        path="/crear-orden-compra"
        element={<OrdenForm onAlta={cargarOrdenes} />}
      />
    </Routes>
  );
};

export default OrdenCompraRoutes; 