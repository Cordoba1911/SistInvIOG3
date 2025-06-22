import { Routes, Route, Link } from "react-router-dom";
import { OrdenForm } from "./OrdenForm";
import OrdenCompraList from "./OrdenCompraList";
import { useState, useEffect } from "react";
import { ordenesService } from "../../services/ordenesService";
import type {
  OrdenCompra,
  UpdateOrdenCompraDto,
} from "../../types/ordenCompra";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import EditarOrdenCompraModal from "../../components/common/EditarOrdenCompraModal";

const OrdenCompraRoutes = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredOrdenes = ordenes.filter((orden) => {
    const term = searchTerm.toLowerCase();
    return (
      orden.id.toString().includes(term) ||
      (orden.proveedor?.nombre.toLowerCase().includes(term)) ||
      (orden.articulo?.nombre.toLowerCase().includes(term))
    );
  });

  return (
    <Routes>
      <Route
        path="/admin-orden-compra"
        element={
          <>
            <Card>
              <Card.Body>
                <OrdenCompraList
                  ordenes={filteredOrdenes}
                  onEditar={handleEditar}
                  onCancelar={handleCancelar}
                  onEnviar={handleEnviar}
                  onFinalizar={handleFinalizar}
                  searchBar={
                    <Form.Group className="mb-4">
                      <InputGroup>
                        <InputGroup.Text>
                          <Search />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Buscar por ID, proveedor o artículo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  }
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