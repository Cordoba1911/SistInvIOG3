import { Button, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Articulo } from "../../types/articulo";

interface PropsArticulosList {
  articulos: Articulo[];
  onEditar: (articulo: Articulo) => void;
  onBaja: (id: number) => void;
}

const ArticulosList = ({ articulos, onEditar, onBaja }: PropsArticulosList) => {
  const formatValue = (value: number | string | undefined | null, prefix = "$") => {
    if (value === null || typeof value === "undefined" || value === "") return "N/A";
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return "N/A";

    return `${prefix}${numValue.toFixed(2)}`;
  };
  
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lista de Artículos</h3>
        <Link to="/articulos/articulos" className="btn btn-primary">
          Crear Artículo
        </Link>
      </div>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Modelo</th>
            <th>Costo Compra</th>
            <th>Costo Pedido</th>
            <th>Costo Almacen.</th>
            <th>Punto Pedido</th>
            <th>Lote Óptimo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => (
            <tr key={articulo.id}>
              <td>{articulo.id}</td>
              <td>{articulo.codigo}</td>
              <td>{articulo.nombre}</td>
              <td>{articulo.descripcion}</td>
              <td>{articulo.stock_actual ?? "N/A"}</td>
              <td>{articulo.modelo_inventario ?? "N/A"}</td>
              <td>{formatValue(articulo.costo_compra)}</td>
              <td>{formatValue(articulo.costo_pedido)}</td>
              <td>{formatValue(articulo.costo_almacenamiento)}</td>
              <td>{articulo.punto_pedido ?? "N/A"}</td>
              <td>{articulo.lote_optimo ?? "N/A"}</td>
              <td>
                <Badge bg={articulo.estado ? "success" : "danger"}>
                  {articulo.estado ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEditar(articulo)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant={articulo.estado ? "outline-danger" : "outline-success"}
                  size="sm"
                  onClick={() => onBaja(articulo.id)}
                >
                  {articulo.estado ? "Dar de Baja" : "Activar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ArticulosList;