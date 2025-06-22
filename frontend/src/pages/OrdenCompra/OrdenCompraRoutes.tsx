import { Routes, Route, Link } from "react-router-dom";
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
import EditarOrdenCompraModal from "../../components/common/EditarOrdenCompraModal";

const OrdenCompraRoutes = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [ordenAEditar, setOrdenAEditar] =
    useState<OrdenCompra | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const cargarOrdenes = async () => {
    const data = await ordenesService.getAll();
    setOrdenes(data);
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleEditar = (orden: OrdenCompra) => {
    setOrdenAEditar(orden);
    setShowEditModal(true);
  };

  const handleCancelarEdicion = () => {
    setOrdenAEditar(null);
    setShowEditModal(false);
  };

  const handleUpdate = async (id: number, datos: UpdateOrdenCompraDto) => {
    await ordenesService.update(id, datos);
    handleCancelarEdicion();
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
            <Card>
              <Card.Body>
                <OrdenCompraList
                  ordenes={ordenes}
                  onEditar={handleEditar}
                  onCancelar={handleCancelar}
                  onEnviar={handleEnviar}
                  onFinalizar={handleFinalizar}
                  botonCrear={
                    <Link to="/ordenes/orden-compra" className="btn btn-primary">
                      Crear Orden
                    </Link>
                  }
                />
              </Card.Body>
            </Card>

            <EditarOrdenCompraModal
              show={showEditModal}
              onHide={handleCancelarEdicion}
              orden={ordenAEditar}
              onUpdate={handleUpdate}
            />
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