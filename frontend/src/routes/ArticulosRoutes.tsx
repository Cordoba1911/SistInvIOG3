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
import ErrorModal from "../components/common/ErrorModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { articulosService } from "../services/articulosService";
import type { Articulo, CreateArticuloDto, UpdateArticuloInput } from "../types/articulo";

// Definición del componente ArticulosRouter
const ArticulosRouter = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [articuloAEditar, setArticuloAEditar] = useState<Articulo | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState<{ title: string; message: string; }>({ title: "", message: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText: string;
  }>({
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Confirmar"
  });
  const navigate = useNavigate();

  const cargarArticulos = async () => {
    try {
      const data = await articulosService.getAllForAdmin();
      setArticulos(data);
    } catch (error: any) {
      console.error("Error al cargar artículos:", error);
      procesarError(error, "cargar_articulos");
    }
  };

  // Función helper para mostrar errores en modal
  const mostrarError = (title: string, error: any) => {
    const message = error instanceof Error ? error.message : String(error);
    setErrorModalData({ title, message });
    setShowErrorModal(true);
  };

  // Función helper para mostrar confirmación
  const mostrarConfirmacion = (title: string, message: string, onConfirm: () => void, confirmText: string = "Confirmar") => {
    setConfirmModalData({ title, message, onConfirm, confirmText });
    setShowConfirmModal(true);
  };

  // Función mejorada para procesar errores específicos
  const procesarError = (error: any, contexto: string) => {
    const rawMessage = error?.message || "Ha ocurrido un error inesperado";
    const errorMessageForTitle = rawMessage.toLowerCase();
    let titulo = "Error";

    if (contexto === "crear_articulo") {
        if (errorMessageForTitle.includes("ya existe un artículo con este código")) titulo = "Código duplicado";
        else if (errorMessageForTitle.includes("ya existe un artículo con esta descripción")) titulo = "Descripción duplicada";
    } else if (contexto === "actualizar_articulo") {
        if (errorMessageForTitle.includes("no encontrado")) titulo = "Artículo no encontrado";
        else if (errorMessageForTitle.includes("ya existe un artículo con este código")) titulo = "Código duplicado";
        else if (errorMessageForTitle.includes("ya existe un artículo con esta descripción")) titulo = "Descripción duplicada";
    } else if (contexto === "baja_articulo") {
        if (errorMessageForTitle.includes("no encontrado")) titulo = "Artículo no encontrado";
        else if (errorMessageForTitle.includes("ya está dado de baja")) titulo = "Artículo ya inactivo";
        else if (errorMessageForTitle.includes("tiene") && errorMessageForTitle.includes("unidades en stock")) titulo = "Artículo con stock";
        else if (errorMessageForTitle.includes("órdenes de compra activas")) titulo = "Órdenes de compra activas";
    } else if (contexto === "activar_articulo") {
        if (errorMessageForTitle.includes("no encontrado")) titulo = "Artículo no encontrado";
        else if (errorMessageForTitle.includes("ya está activo")) titulo = "Artículo ya activo";
    } else if (contexto === "cargar_articulos") {
        titulo = "Error al cargar artículos";
    } else if (contexto === "cargar_articulo") {
        titulo = "Error al cargar artículo";
    } else {
        titulo = `Error en ${contexto.replace(/_/g, " ")}`;
    }
    
    let displayMessage = rawMessage;
    try {
      const parsedError = JSON.parse(rawMessage);
      if (parsedError && parsedError.message) {
        displayMessage = parsedError.message;
      }
    } catch (e) {
      // No es un JSON, se usa el mensaje tal cual
    }

    setErrorModalData({ title: titulo, message: displayMessage });
    setShowErrorModal(true);
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
      procesarError(error, "cargar_articulo");
    }
  };
  
  const handleCancelarEdicion = () => {
    setArticuloAEditar(null);
  };

  const handleUpdate = async (id: number, data: UpdateArticuloInput) => {
    try {
      await articulosService.update(id, data);
      setArticuloAEditar(null);
      await cargarArticulos();
    } catch (error: any) {
      console.error('Error al actualizar artículo:', error);
      procesarError(error, "actualizar_articulo");
    }
  };

  const handleBaja = async (id: number) => {
    const articulo = articulos.find(a => a.id === id);
    if (!articulo || !articulo.estado) return;

    const confirmarBaja = async () => {
      try {
        await articulosService.delete(id);
        await cargarArticulos();
        setShowConfirmModal(false);
      } catch (error: any) {
        console.error('Error al dar de baja:', error);
        setShowConfirmModal(false);
        procesarError(error, "baja_articulo");
      }
    };

    mostrarConfirmacion(
      "Confirmar baja de artículo",
      `¿Está seguro que desea dar de baja el artículo "${articulo.nombre}"?`,
      confirmarBaja,
      "Dar de Baja"
    );
  };

  const handleActivar = async (id: number) => {
    const articulo = articulos.find(a => a.id === id);
    if (!articulo || articulo.estado) return;

    const confirmarActivacion = async () => {
      try {
        await articulosService.reactivar(id);
        await cargarArticulos();
        setShowConfirmModal(false);
      } catch (error: any) {
        console.error('Error al reactivar:', error);
        setShowConfirmModal(false);
        procesarError(error, "activar_articulo");
      }
    };

    mostrarConfirmacion(
      "Confirmar reactivación de artículo",
      `¿Está seguro que desea reactivar el artículo "${articulo.nombre}"?`,
      confirmarActivacion,
      "Reactivar"
    );
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

      <ErrorModal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
      />

      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={confirmModalData.onConfirm}
        title={confirmModalData.title}
        message={confirmModalData.message}
        confirmText={confirmModalData.confirmText}
        cancelText="Cancelar"
      />
    </>
  );
};

export default ArticulosRouter;
