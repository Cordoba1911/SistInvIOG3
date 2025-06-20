import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import ArticulosForm from "../pages/Articulos/ArticulosForm";
import ArticulosList from "../pages/Articulos/ArticulosList";
import { articulosService } from "../services/articulosService";
import type { Articulo, CreateArticuloDto, UpdateArticuloDto } from "../types/articulo";

// Definición de la interfaz Articulo
export interface Articulo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  descripcion: string;
  categoria: string;
  proveedor: string;
  imagen?: string; // Imagen opcional
  activo: boolean;
}

// Definición del componente ArticulosRouter
const ArticulosRouter = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloAEditar, setArticuloAEditar] = useState<Articulo | null>(null);
  const navigate = useNavigate();

  const cargarArticulos = async () => {
    try {
      const data = await articulosService.getAll();
      setArticulos(data);
    } catch (error) {
      console.error("Error al cargar artículos:", error);
    }
  };

  useEffect(() => {
    cargarArticulos();
  }, []);

  const handleAlta = async () => {
    await cargarArticulos();
    navigate("/articulos/admin-articulos");
  };
  
  const handleEditar = (articulo: Articulo) => {
    setArticuloAEditar(articulo);
  };
  
  const handleCancelarEdicion = () => {
    setArticuloAEditar(null);
  };

  const handleUpdate = async (id: number, data: UpdateArticuloDto) => {
    await articulosService.update(id, data);
    setArticuloAEditar(null);
    await cargarArticulos();
  };

  const handleBaja = async (id: number) => {
    const articulo = articulos.find(a => a.id === id);
    if (!articulo) return;

    if (articulo.estado) {
      await articulosService.delete(id);
    } else {
      await articulosService.reactivar(id);
    }
    
    await cargarArticulos();
  };

  return (
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
    </Routes>
  );
};

export default ArticulosRouter;
export type ArticuloSinID = Omit<Articulo, 'id' | 'activo' >; // Exporta la interfaz para que pueda ser usada en otros componentes
