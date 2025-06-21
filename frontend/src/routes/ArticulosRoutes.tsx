import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import ArticulosForm from "../pages/Articulos/ArticulosForm";
import ArticulosList from "../pages/Articulos/ArticulosList";
import ProductosAReponer from "../pages/Articulos/ProductosAReponer";
import ProductosFaltantes from "../pages/Articulos/ProductosFaltantes";
import ProveedoresPorArticulo from "../pages/Articulos/ProveedoresPorArticulo";
import AjusteInventario from "../pages/Articulos/AjusteInventario";
import AlertModal from "../components/common/AlertModal";
import { articulosService } from "../services/articulosService";
import type { Articulo, CreateArticuloDto, UpdateArticuloInput } from "../types/articulo";

// Definición del componente ArticulosRouter
const ArticulosRouter = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
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
    if (!articulo) return;

    try {
      if (articulo.estado) {
        // Confirmar antes de dar de baja
        const confirmacion = window.confirm(
          `¿Está seguro que desea dar de baja el artículo "${articulo.nombre}"?`
        );
        
        if (!confirmacion) return;
        
        await articulosService.delete(id);
        showAlert('Éxito', 'Artículo dado de baja exitosamente', 'success');
      } else {
        // Confirmar antes de reactivar
        const confirmacion = window.confirm(
          `¿Está seguro que desea reactivar el artículo "${articulo.nombre}"?`
        );
        
        if (!confirmacion) return;
        
        await articulosService.reactivar(id);
        showAlert('Éxito', 'Artículo reactivado exitosamente', 'success');
      }
      
      await cargarArticulos();
    } catch (error: any) {
      console.error('Error al procesar la baja/reactivación:', error);
      
      // Mostrar alerta específica según el error
      if (error.message) {
        // El backend devuelve mensajes específicos para cada validación
        const message = error.message;
        
        // Determinar el tipo de alerta según el contenido del mensaje
        let variant: 'danger' | 'warning' | 'success' | 'info' = 'danger';
        let title = 'Error';
        
        if (message.includes('stock') && message.includes('unidades en stock')) {
          variant = 'warning';
          title = 'Stock Insuficiente';
        } else if (message.includes('órdenes de compra') || message.includes('ordenes de compra')) {
          variant = 'warning';
          title = 'Órdenes Pendientes';
        } else if (message.includes('ya está dado de baja')) {
          variant = 'info';
          title = 'Artículo ya Inactivo';
        } else if (message.includes('ya está activo')) {
          variant = 'info';
          title = 'Artículo ya Activo';
        }
        
        showAlert(title, message, variant);
      } else {
        showAlert('Error', 'Error inesperado al procesar la solicitud', 'danger');
      }
    }
  };

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
                    articulos={articulos}
                    onEditar={handleEditar}
                    onBaja={handleBaja}
                  />
                </Card.Body>
              </Card>

              {articuloAEditar && (
                <Card className="mt-4">
                   <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        Editar Artículo: {articuloAEditar.nombre}
                      </h5>
                      <Button variant="link" className="p-0" onClick={handleCancelarEdicion} style={{ color: "red" }}>
                        <i className="fas fa-times"></i>
                      </Button>
                    </div>
                  </Card.Header>
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
