// src/routes/ProveedoresRouter.tsx
import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import ProveedoresForm from "../pages/Proveedores/ProveedoresForm";
import ProveedoresList from "../pages/Proveedores/ProveedoresList";
import ArticulosList from "../components/common/ArticulosList";
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
  const navigate = useNavigate();

  // Función para cargar los proveedores desde el backend
  const cargarProveedores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await proveedoresService.getAll();
      setProveedores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
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
      // Asumiendo que el servicio/backend maneja la baja lógica (ej. cambiando un campo 'estado')
      // Si el endpoint de delete hace baja lógica, se usaría proveedoresService.delete(id)
      await proveedoresService.update(id, { estado: false });
      await cargarProveedores(); // Recargar la lista
    } catch (err) {
      console.error(`Error al dar de baja al proveedor ${id}:`, err);
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
      setError("Error al cargar artículos.");
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
      // Manejar el error en la UI si es necesario
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
                  <ProveedoresForm onSubmit={handleFormSubmit} />
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
    </>
  );
};

export default ProveedoresRouter;
// Ya no es necesario exportar estos tipos desde aquí
// export type ProveedorSinID = Omit<Proveedor, 'id' | 'activo'>;
