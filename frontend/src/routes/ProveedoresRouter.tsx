// src/routes/ProveedoresRouter.tsx
import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { EyeFill, PlusLg, Search } from "react-bootstrap-icons";
import ProveedoresForm from "../pages/Proveedores/ProveedoresForm";
import ProveedoresList from "../pages/Proveedores/ProveedoresList";
import ArticulosPorProveedorModal from "../components/common/ArticulosPorProveedorModal";
import ErrorModal from "../components/common/ErrorModal";
import EditarProveedorModal from "../components/common/EditarProveedorModal";
import type {
  Proveedor,
  CreateProveedorDto,
  ArticuloProveedorDetalle,
} from "../types/proveedor";
import { proveedoresService } from "../services/proveedoresService";
import { articulosService } from "../services/articulosService";
import type { Articulo } from "../types/articulo";
import RelacionarArticuloModal from "../components/common/RelacionarArticuloModal";

// Definición del componente ProveedoresRouter
const ProveedoresRouter = () => {
  // Estado para manejar la lista de proveedores
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [proveedorAEditar, setProveedorAEditar] = useState<Proveedor | null>(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [proveedorParaRelacionar, setProveedorParaRelacionar] = useState<Proveedor | null>(null);
  const [articulos, setArticulos] = useState<ArticuloProveedorDetalle[]>([]);
  const [articulosDisponibles, setArticulosDisponibles] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArticulos, setLoadingArticulos] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState<{ title: string; message: string; }>({ title: "", message: "" });
  const navigate = useNavigate();
  const [showArticulosModal, setShowArticulosModal] = useState(false);

  // Función para cargar los proveedores desde el backend
  const cargarProveedores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await proveedoresService.getAll();
      setProveedores(data);
    } catch (err) {
      procesarError(err, "cargar_proveedores");
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarArticulosDisponibles = useCallback(async () => {
    try {
      const data = await articulosService.getAll();
      setArticulosDisponibles(data);
    } catch (err) {
      console.error("Error al cargar artículos disponibles:", err);
    }
  }, []);

  // Función helper para mostrar errores en modal
  const mostrarError = (title: string, error: any) => {
    const message = error instanceof Error ? error.message : String(error);
    setErrorModalData({ title, message });
    setShowErrorModal(true);
  };

  // Función mejorada para procesar errores específicos
  const procesarError = (error: any, contexto: string) => {
    const errorMessage = (error?.message || "Ha ocurrido un error inesperado").toLowerCase();
    let titulo = "Error";

    if (contexto === "crear_proveedor") {
        if (errorMessage.includes("proveedor con el nombre")) titulo = "Proveedor duplicado";
        else if (errorMessage.includes("no se encontró el artículo")) titulo = "Artículo no encontrado";
    } else if (contexto === "actualizar_proveedor") {
        if (errorMessage.includes("no encontrado")) titulo = "Proveedor no encontrado";
        else if (errorMessage.includes("dado de baja")) titulo = "Proveedor inactivo";
    } else if (contexto === "baja_proveedor") {
        if (errorMessage.includes("no encontrado")) titulo = "Proveedor no encontrado";
        else if (errorMessage.includes("ya está dado de baja")) titulo = "Proveedor ya inactivo";
        else if (errorMessage.includes("proveedor predeterminado")) titulo = "Proveedor predeterminado";
        else if (errorMessage.includes("órdenes de compra")) titulo = "Órdenes de compra pendientes";
    } else if (contexto === "relacionar_articulos") {
        if (errorMessage.includes("proveedor no encontrado")) titulo = "Proveedor no encontrado";
        else if (errorMessage.includes("dado de baja")) titulo = "Proveedor inactivo";
        else if (errorMessage.includes("artículo con id")) titulo = "Artículo no encontrado";
        else if (errorMessage.includes("ya existe una relación")) titulo = "Relación duplicada";
    } else if (contexto === "activar_proveedor") {
        if (errorMessage.includes("no encontrado")) titulo = "Proveedor no encontrado";
        else if (errorMessage.includes("ya está activo")) titulo = "Proveedor ya activo";
    } else {
        titulo = `Error en ${contexto.replace(/_/g, " ")}`;
    }
    
    setErrorModalData({ title: titulo, message: error?.message || "Ha ocurrido un error inesperado" });
    setShowErrorModal(true);
  };

  // useEffect para cargar los proveedores cuando el componente se monta
  useEffect(() => {
    cargarProveedores();
    cargarArticulosDisponibles();
  }, [cargarProveedores, cargarArticulosDisponibles]);

  // Maneja el submit del formulario (crear o editar)
  const handleFormSubmit = async (proveedorDto: CreateProveedorDto, id?: number) => {
    try {
      if (id) {
        const { articulos, ...updateData } = proveedorDto;
        await proveedoresService.update(id, updateData);
      } else {
        await proveedoresService.create(proveedorDto);
        navigate("/proveedores/admin-proveedores");
      }
      setShowEditModal(false);
      await cargarProveedores();
    } catch (err) {
      const contexto = id ? "actualizar_proveedor" : "crear_proveedor";
      procesarError(err, contexto);
    }
  };

  const handleIniciarEdicion = (id: number) => {
    const proveedor = proveedores.find((p) => p.id === id);
    if (proveedor) {
      setProveedorAEditar(proveedor);
      setShowEditModal(true);
    }
  };

  // Función para dar de baja lógica a un proveedor
  const bajaLogicaProveedor = async (id: number) => {
    try {
      await proveedoresService.baja(id);
      await cargarProveedores();
    } catch (err) {
      procesarError(err, "baja_proveedor");
    }
  };

  const handleActivarProveedor = async (id: number) => {
    try {
      await proveedoresService.reactivar(id);
      await cargarProveedores();
    } catch (err) {
      procesarError(err, "activar_proveedor");
    }
  };

  const handleVerArticulos = async (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor);
    setShowArticulosModal(true);
    setLoadingArticulos(true);
    try {
      const data = await proveedoresService.getArticulos(proveedor.id);
      setArticulos(data);
    } catch (err) {
      procesarError(err, "cargar_articulos");
    } finally {
      setLoadingArticulos(false);
    }
  };

  const handleRelacionarArticulos = async (proveedorId: number, articulos: any[]) => {
    try {
      await proveedoresService.relacionarConArticulos(proveedorId, { articulos });
      if (proveedorSeleccionado && proveedorSeleccionado.id === proveedorId) {
        await handleVerArticulos(proveedorSeleccionado);
      }
    } catch (err) {
      procesarError(err, "relacionar_articulos");
    }
  };

  const handleCerrarArticulos = () => {
    setProveedorSeleccionado(null);
    setArticulos([]);
  };

  const filteredProveedores = proveedores.filter((proveedor) => {
    const term = searchTerm.toLowerCase();
    return (
      proveedor.id.toString().includes(term) ||
      proveedor.nombre.toLowerCase().includes(term)
    );
  });

  const renderArticulosButton = (proveedor: Proveedor) => (
    <>
      <div style={{ minWidth: "140px" }}>
        <Button
          variant="info"
          size="sm"
          className="w-100"
          onClick={() => handleVerArticulos(proveedor)}
        >
          <EyeFill color="white" className="me-1" />
          Ver Artículos
        </Button>
      </div>
      <div style={{ minWidth: "140px" }}>
        <Button
          variant="secondary"
          size="sm"
          className="w-100"
          onClick={() => setProveedorParaRelacionar(proveedor)}
        >
          <PlusLg color="white" className="me-1" />
          Añadir Artículo
        </Button>
      </div>
    </>
  );

  if (loading) {
    return <div>Cargando proveedores...</div>;
  }

  // Renderiza las rutas para agregar y administrar proveedores
  return (
    <>
      <Routes>
        <Route
          path="/proveedores"
          element={
            <Card>
              <Card.Body>
                <ProveedoresForm onSubmit={handleFormSubmit} />
              </Card.Body>
            </Card>
          }
        />
        <Route
          path="/admin-proveedores"
          element={
            <>
              <Card>
                <Card.Body>
                  <ProveedoresList
                    proveedores={filteredProveedores}
                    onEditar={handleIniciarEdicion}
                    onBaja={bajaLogicaProveedor}
                    onActivar={handleActivarProveedor}
                    accionesPersonalizadas={renderArticulosButton}
                    searchBar={
                      <Form.Group className="mb-4">
                        <InputGroup>
                          <InputGroup.Text><Search /></InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Buscar por ID o nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    }
                    botonCrear={
                      <Link to="/proveedores/proveedores" className="btn btn-primary">
                        <PlusLg /> Crear Proveedor
                      </Link>
                    }
                  />
                </Card.Body>
              </Card>

              <EditarProveedorModal
                show={showEditModal}
                proveedor={proveedorAEditar}
                onHide={() => setShowEditModal(false)}
                onSave={handleFormSubmit}
              />
            </>
          }
        />
      </Routes>

      <ArticulosPorProveedorModal
        show={showArticulosModal}
        onHide={handleCerrarArticulos}
        proveedor={proveedorSeleccionado}
        articulos={articulos}
        loading={loadingArticulos}
      />

      {proveedorParaRelacionar && (
        <RelacionarArticuloModal
          show={!!proveedorParaRelacionar}
          onHide={() => setProveedorParaRelacionar(null)}
          proveedor={proveedorParaRelacionar}
          articulosDisponibles={articulosDisponibles}
          onSubmit={handleRelacionarArticulos}
        />
      )}

      <ErrorModal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
      />
    </>
  );
};

export default ProveedoresRouter;
// Ya no es necesario exportar estos tipos desde aquí
// export type ProveedorSinID = Omit<Proveedor, 'id' | 'activo'>;
