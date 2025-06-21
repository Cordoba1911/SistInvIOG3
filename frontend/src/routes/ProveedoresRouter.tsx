// src/routes/ProveedoresRouter.tsx
import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import ProveedoresForm from "../pages/Proveedores/ProveedoresForm";
import ProveedoresList from "../pages/Proveedores/ProveedoresList";
import ArticulosList from "../components/common/ArticulosList";
import ErrorModal from "../components/common/ErrorModal";
import type {
  Proveedor,
  CreateProveedorDto,
  ArticuloProveedorDetalle,
} from "../types/proveedor";
import { proveedoresService } from "../services/proveedoresService";
import RelacionarArticuloModal from "../components/common/RelacionarArticuloModal";
import { articulosService } from "../services/articulosService";
import type { Articulo } from "../types/articulo";

// Definición del componente ProveedoresRouter
const ProveedoresRouter = () => {
  // Estado para manejar la lista de proveedores
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorAEditar, setProveedorAEditar] = useState<Proveedor | null>(
    null
  );
  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState<Proveedor | null>(null);
  const [proveedorParaRelacionar, setProveedorParaRelacionar] =
    useState<Proveedor | null>(null);
  const [articulos, setArticulos] = useState<ArticuloProveedorDetalle[]>([]);
  const [articulosDisponibles, setArticulosDisponibles] = useState<Articulo[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingArticulos, setLoadingArticulos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });
  const navigate = useNavigate();

  // Función para cargar los proveedores desde el backend
  const cargarProveedores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await proveedoresService.getAll();
      setProveedores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
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
    let titulo = "Error";
    // Extraer el mensaje de error real. El servicio de API lo encapsula en `error.message`.
    const errorMessage = (error?.message || "Ha ocurrido un error inesperado").toLowerCase();

    // Errores específicos de creación de proveedores
    if (contexto === "crear_proveedor") {
      if (errorMessage.includes("proveedor con el nombre")) {
        titulo = "Proveedor duplicado";
      } else if (errorMessage.includes("no se encontró el artículo")) {
        titulo = "Artículo no encontrado";
      }
    }
    // Errores específicos de actualización de proveedores
    else if (contexto === "actualizar_proveedor") {
      if (errorMessage.includes("no encontrado")) {
        titulo = "Proveedor no encontrado";
      } else if (errorMessage.includes("dado de baja")) {
        titulo = "Proveedor inactivo";
      }
    }
    // Errores específicos de baja de proveedores
    else if (contexto === "baja_proveedor") {
      if (errorMessage.includes("no encontrado")) {
        titulo = "Proveedor no encontrado";
      } else if (errorMessage.includes("ya está dado de baja")) {
        titulo = "Proveedor ya inactivo";
      } else if (errorMessage.includes("proveedor predeterminado")) {
        titulo = "Proveedor predeterminado";
      } else if (errorMessage.includes("órdenes de compra")) {
        titulo = "Órdenes de compra pendientes";
      }
    }
    // Errores específicos de relación de artículos
    else if (contexto === "relacionar_articulos") {
      if (errorMessage.includes("proveedor no encontrado")) {
        titulo = "Proveedor no encontrado";
      } else if (errorMessage.includes("dado de baja")) {
        titulo = "Proveedor inactivo";
      } else if (errorMessage.includes("artículo con id")) {
        titulo = "Artículo no encontrado";
      } else if (errorMessage.includes("ya existe una relación")) {
        titulo = "Relación duplicada";
      }
    }
    // Errores de (des)activación y carga
    else if (contexto === "activar_proveedor") {
      if (errorMessage.includes("no encontrado")) {
        titulo = "Proveedor no encontrado";
      } else if (errorMessage.includes("ya está activo")) {
        titulo = "Proveedor ya activo";
      }
    } else if (contexto === "cargar_proveedores") {
      titulo = "Error al cargar proveedores";
    } else if (contexto === "cargar_articulos") {
      titulo = "Error al cargar artículos";
    }

    // Usar el mensaje de error extraído, que ahora será el correcto
    setErrorModalData({ title: titulo, message: error?.message || "Ha ocurrido un error inesperado" });
    setShowErrorModal(true);
  };

  // useEffect para cargar los proveedores cuando el componente se monta
  useEffect(() => {
    cargarProveedores();
    cargarArticulosDisponibles();
  }, [cargarProveedores, cargarArticulosDisponibles]);

  // Maneja el submit del formulario (crear o editar)
  const handleFormSubmit = async (
    proveedorDto: CreateProveedorDto,
    id?: number
  ) => {
    try {
      if (id) {
        // Para editar, enviamos solo los datos permitidos por el UpdateProveedorDto
        // Usamos desestructuración para excluir la propiedad 'articulos'
        const { articulos, ...updateData } = proveedorDto;
        await proveedoresService.update(id, updateData);
      } else {
        // Para crear, enviamos el objeto completo
        await proveedoresService.create(proveedorDto);
        navigate("/proveedores/admin-proveedores"); // Redirigir a la lista después de crear
      }
      setProveedorAEditar(null); // Cierra el form de edición
      await cargarProveedores(); // Recarga la lista para ver los cambios
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      const contexto = id ? "actualizar_proveedor" : "crear_proveedor";
      procesarError(err, contexto);
    }
  };

  const handleIniciarEdicion = (id: number) => {
    const proveedor = proveedores.find((p) => p.id === id);
    if (proveedor) {
      setProveedorAEditar(proveedor);
    }
  };

  // Función para dar de baja lógica a un proveedor
  const bajaLogicaProveedor = async (id: number) => {
    try {
      await proveedoresService.baja(id);
      await cargarProveedores(); // Recargar la lista
    } catch (err) {
      console.error(`Error al dar de baja al proveedor ${id}:`, err);
      procesarError(err, "baja_proveedor");
    }
  };

  const handleActivarProveedor = async (id: number) => {
    try {
      await proveedoresService.reactivar(id);
      await cargarProveedores();
    } catch (err) {
      console.error(`Error al activar al proveedor ${id}:`, err);
      procesarError(err, "activar_proveedor");
    }
  };

  const handleVerArticulos = async (proveedor: Proveedor) => {
    // Si ya estamos mostrando los artículos de este proveedor, los ocultamos.
    if (proveedorSeleccionado && proveedorSeleccionado.id === proveedor.id) {
      setProveedorSeleccionado(null);
      setArticulos([]);
      return;
    }

    setProveedorSeleccionado(proveedor);
    setLoadingArticulos(true);
    try {
      const data = await proveedoresService.getArticulos(proveedor.id);
      setArticulos(data);
    } catch (err) {
      console.error("Error al cargar artículos:", err);
      procesarError(err, "cargar_articulos");
    } finally {
      setLoadingArticulos(false);
    }
  };

  const handleAbrirModalRelacionar = (proveedor: Proveedor) => {
    setProveedorParaRelacionar(proveedor);
  };

  const handleCerrarModalRelacionar = () => {
    setProveedorParaRelacionar(null);
  };

  const handleRelacionarArticulos = async (
    proveedorId: number,
    articulos: any[]
  ) => {
    try {
      await proveedoresService.relacionarConArticulos(proveedorId, {
        articulos,
      });
      handleCerrarModalRelacionar();
      // Opcional: recargar la lista de artículos del proveedor si está visible
      if (
        proveedorSeleccionado &&
        proveedorSeleccionado.id === proveedorId
      ) {
        await handleVerArticulos(proveedorSeleccionado);
      }
    } catch (err) {
      console.error("Error al relacionar artículos:", err);
      mostrarError(
        "Error al relacionar artículos",
        err
      );
    }
  };

  const handleCerrarArticulos = () => {
    setProveedorSeleccionado(null);
    setArticulos([]);
  };

  if (loading) {
    return <div>Cargando proveedores...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Renderiza las rutas para agregar y administrar proveedores
  return (
    <>
      <Routes>
        <Route
          path="/proveedores"
          element={
            <div className="container mt-4">
              <Card>
                <Card.Body>
                  <ProveedoresForm 
                    onSubmit={handleFormSubmit} 
                    onError={(error) => procesarError(error, "crear_proveedor")}
                  />
                </Card.Body>
              </Card>
            </div>
          }
        />
        <Route
          path="/admin-proveedores"
          element={
            <div className="container mt-4">
              <ProveedoresList
                proveedores={proveedores}
                onEditar={handleIniciarEdicion}
                onBaja={bajaLogicaProveedor}
                onActivar={handleActivarProveedor}
                accionesPersonalizadas={(proveedor) => (
                  <>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleVerArticulos(proveedor)}
                    >
                      Ver Artículos
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleAbrirModalRelacionar(proveedor)}
                    >
                      Añadir Artículo
                    </Button>
                  </>
                )}
              />
              {proveedorAEditar && (
                <Card className="mt-4">
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Editar Proveedor</h5>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => setProveedorAEditar(null)}
                        style={{ color: "red" }}
                      >
                        <FaTimes size={20} />
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <ProveedoresForm
                      onSubmit={handleFormSubmit}
                      proveedorExistente={proveedorAEditar}
                      onCancel={() => setProveedorAEditar(null)}
                      onError={(error) => procesarError(error, "actualizar_proveedor")}
                    />
                  </Card.Body>
                </Card>
              )}
              {loadingArticulos && (
                <div className="mt-4 text-center">Cargando artículos...</div>
              )}
              {proveedorSeleccionado && !loadingArticulos && (
                <ArticulosList
                  articulos={articulos}
                  proveedorNombre={proveedorSeleccionado.nombre}
                  onClose={handleCerrarArticulos}
                />
              )}
            </div>
          }
        />
      </Routes>
      {proveedorParaRelacionar && (
        <RelacionarArticuloModal
          show={!!proveedorParaRelacionar}
          onHide={handleCerrarModalRelacionar}
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
