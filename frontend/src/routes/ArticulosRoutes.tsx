import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import ArticulosForm from "../pages/Articulos/ArticulosForm";
import ArticulosList from "../pages/Articulos/ArticulosList";
import ProductosAReponer from "../pages/Articulos/ProductosAReponer";
import ProductosFaltantes from "../pages/Articulos/ProductosFaltantes";
import ProveedoresPorArticulo from "../pages/Articulos/ProveedoresPorArticulo";
import AjusteInventario from "../pages/Articulos/AjusteInventario";
import AlertModal from "../components/common/AlertModal";
import { articulosService } from "../services/articulosService";
import type { Articulo, CreateArticuloDto, UpdateArticuloInput } from "../types/articulo";
import InventoryCalculations from "../components/InventoryCalculations";

// Definición del componente ArticulosRouter
const ArticulosRouter = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [articuloAEditar, setArticuloAEditar] = useState<Articulo | null>(null);
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    variant: 'danger' as 'danger' | 'warning' | 'success' | 'info'
  });
  const navigate = useNavigate();

  const cargarArticulos = async () => {
    try {
      const data = await articulosService.getAll();
      setArticulos(data);
    } catch (error: any) {
      console.error("Error al cargar artículos:", error);
      showAlert('Error al cargar artículos', error.message || 'Error desconocido', 'danger');
    }
  };

  const showAlert = (title: string, message: string, variant: 'danger' | 'warning' | 'success' | 'info' = 'danger') => {
    setAlertModal({ show: true, title, message, variant });
  };

  const hideAlert = () => {
    setAlertModal(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    cargarArticulos();
  }, []);

  const handleAlta = async () => {
    await cargarArticulos();
    navigate("/articulos/admin-articulos");
  };
  
  const handleEditar = async (articulo: Articulo) => {
    try {
      // Cargar los datos completos del artículo incluyendo proveedores
      const articuloCompleto = await articulosService.getById(articulo.id);
      setArticuloAEditar(articuloCompleto);
    } catch (error: any) {
      console.error('Error al cargar artículo:', error);
      showAlert('Error', 'No se pudo cargar los datos del artículo', 'danger');
    }
  };
  
  const handleCancelarEdicion = () => {
    setArticuloAEditar(null);
  };

  const handleUpdate = async (id: number, data: UpdateArticuloInput) => {
    await articulosService.update(id, data);
    setArticuloAEditar(null);
    await cargarArticulos();
  };

  const handleBaja = async (id: number) => {
    const articulo = articulos.find(a => a.id === id);
    if (!articulo || !articulo.estado) return;

    try {
      const confirmacion = window.confirm(`¿Está seguro que desea dar de baja el artículo "${articulo.nombre}"?`);
      if (!confirmacion) return;

      await articulosService.delete(id);
      showAlert('Éxito', 'Artículo dado de baja exitosamente', 'success');
      await cargarArticulos();
    } catch (error: any) {
      console.error('Error al dar de baja:', error);
      showAlert('Error al dar de baja', error.message || 'Error desconocido', 'danger');
    }
  };

  const handleActivar = async (id: number) => {
    const articulo = articulos.find(a => a.id === id);
    if (!articulo || articulo.estado) return;

    try {
      const confirmacion = window.confirm(`¿Está seguro que desea reactivar el artículo "${articulo.nombre}"?`);
      if (!confirmacion) return;

      await articulosService.reactivar(id);
      showAlert('Éxito', 'Artículo reactivado exitosamente', 'success');
      await cargarArticulos();
    } catch (error: any) {
      console.error('Error al reactivar:', error);
      showAlert('Error al reactivar', error.message || 'Error desconocido', 'danger');
    }
  };

  const filteredArticulos = articulos.filter((articulo) => {
    const term = searchTerm.toLowerCase();
    return (
      articulo.id.toString().includes(term) ||
      (articulo.codigo?.toLowerCase().includes(term)) ||
      (articulo.nombre.toLowerCase().includes(term))
    );
  });

  return (
    <>
      <Routes>
        <Route
          path="/admin-articulos"
          element={
            <>
              <Card>
                <Card.Body>
                  <ArticulosList
                    articulos={filteredArticulos}
                    onEditar={handleEditar}
                    onBaja={handleBaja}
                    onActivar={handleActivar}
                    searchBar={
                      <Form.Group className="mb-4">
                        <InputGroup>
                          <InputGroup.Text>
                            <Search />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Buscar por ID, código o nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    }
                    botonCrear={
                      <Link
                        to="/articulos/articulos"
                        className="btn btn-primary"
                      >
                        Crear Artículo
                      </Link>
                    }
                  />
                </Card.Body>
              </Card>

              {articuloAEditar && (
                <Card className="mt-4">
                  <Card.Body>
                    <InventoryCalculations articulo={articuloAEditar} />
                    <ArticulosForm
                      articuloAEditar={articuloAEditar}
                      onUpdate={handleUpdate}
                      onCancel={handleCancelarEdicion}
                    />
                  </Card.Body>
                </Card>
              )}
            </>
          }
        />
         <Route
          path="/articulos"
          element={
            <Card>
              <Card.Body>
                <ArticulosForm onAlta={handleAlta} />
              </Card.Body>
            </Card>
          }
        />
        <Route
          path="/productos-a-reponer"
          element={<ProductosAReponer />}
        />
        <Route
          path="/productos-faltantes"
          element={<ProductosFaltantes />}
        />
        <Route
          path="/proveedores-por-articulo"
          element={<ProveedoresPorArticulo />}
        />
        <Route
          path="/ajuste-inventario"
          element={<AjusteInventario />}
        />
      </Routes>

      <AlertModal
        show={alertModal.show}
        onHide={hideAlert}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />
    </>
  );
};

export default ArticulosRouter;
