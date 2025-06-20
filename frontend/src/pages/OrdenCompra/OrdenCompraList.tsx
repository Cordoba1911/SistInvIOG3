import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { OrdenCompra } from "../../types/ordenCompra";

interface Props {
  ordenes: OrdenCompra[];
  onEditar: (orden: OrdenCompra) => void;
}

const OrdenCompraList: React.FC<Props> = ({ ordenes, onEditar }) => {
  const getBadgeVariant = (estado: string) => {
    const estadoNormalizado = estado.toLowerCase();
    if (estadoNormalizado === "pendiente") return "primary";
    if (estadoNormalizado === "en proceso") return "warning";
    if (estadoNormalizado === "finalizada") return "success";
    if (estadoNormalizado === "cancelada") return "danger";
    return "secondary";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Órdenes de Compra</h2>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Artículo</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id}>
              <td>{orden.id}</td>
              <td>{orden.articulo?.nombre}</td>
              <td>{orden.proveedor?.nombre}</td>
              <td>{orden.cantidad}</td>
              <td>
                <Badge pill bg={getBadgeVariant(orden.estado)}>
                  {orden.estado}
                </Badge>
              </td>
              <td>{new Date(orden.fecha_creacion).toLocaleDateString()}</td>
              <td>
                {orden.estado.toLowerCase() === 'pendiente' && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onEditar(orden)}
                  >
                    Editar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrdenCompraList;
