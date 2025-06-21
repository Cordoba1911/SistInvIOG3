import { Routes, Route } from "react-router-dom";
import { OrdenForm } from "./OrdenForm";
import OrdenCompraList from "./OrdenCompraList";
import { useState, useEffect } from "react";
import { ordenesService } from "../../services/ordenesService";
import type {
  OrdenCompra,
  UpdateOrdenCompraDto,
} from "../../types/ordenCompra";
import { Button, Card } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

const OrdenCompraRoutes = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [ordenAEditar, setOrdenAEditar] =
    useState<OrdenCompra | null>(null);

  const cargarOrdenes = async () => {
    const data = await ordenesService.getAll();
    setOrdenes(data);
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleEditar = (orden: OrdenCompra) => {
    setOrdenAEditar(orden);
  };

  const handleCancelarEdicion = () => {
    setOrdenAEditar(null);
  };

  const handleUpdate = async (id: number, datos: UpdateOrdenCompraDto) => {
    await ordenesService.update(id, datos);
    setOrdenAEditar(null);
    cargarOrdenes(); 
  };

  const handleCancelar = async (id: number) => {
    await ordenesService.cancelar(id);
    cargarOrdenes();
  };

  const handleEnviar = async (id: number) => {
    await ordenesService.enviar(id);
    cargarOrdenes();
  };

  const handleFinalizar = async (id: number) => {
    await ordenesService.finalizar(id);
    cargarOrdenes();
  };

  return (
    <Routes>
      <Route
        path="/admin-orden-compra"
        element={
          <>
            {/* Lista de Órdenes */}
            <Card>
              <Card.Body>
                <OrdenCompraList
                  ordenes={ordenes}
                  onEditar={handleEditar}
                  onCancelar={handleCancelar}
                  onEnviar={handleEnviar}
                  onFinalizar={handleFinalizar}
                />
              </Card.Body>
            </Card>

            {/* Formulario de EDICIÓN (aparece al hacer clic en Editar) */}
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
        path="/orden-compra"
        element={
          <Card>
            <Card.Body>
              <OrdenForm onAlta={cargarOrdenes} />
            </Card.Body>
          </Card>
        }
      />
    </Routes>
  );
};

export { OrdenCompraRoutes }; 