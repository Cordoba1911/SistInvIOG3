import React from "react";
import { Table, Button, Badge, ButtonGroup } from "react-bootstrap";
import type { OrdenCompra } from "../../types/ordenCompra";

interface Props {
  ordenes: OrdenCompra[];
  onEditar: (orden: OrdenCompra) => void;
  onCancelar: (id: number) => void;
  onEnviar: (id: number) => void;
  onFinalizar: (id: number) => void;
}

const OrdenCompraList: React.FC<Props> = ({
  ordenes,
  onEditar,
  onCancelar,
  onEnviar,
  onFinalizar,
}) => {
  const getBadgeVariant = (estado: string) => {
    const estadoNormalizado = estado.toLowerCase();
    if (estadoNormalizado === "pendiente") return "primary";
    if (estadoNormalizado === "en proceso" || estadoNormalizado === "enviada")
      return "warning";
    if (estadoNormalizado === "finalizada") return "success";
    if (estadoNormalizado === "cancelada") return "danger";
    return "secondary";
  };

  const renderizarAcciones = (orden: OrdenCompra) => {
    const estado = orden.estado.toLowerCase();

    if (estado === "pendiente") {
      return (
        <ButtonGroup size="sm">
          <Button variant="outline-primary" onClick={() => onEditar(orden)}>
            Editar
          </Button>
          <Button variant="outline-success" onClick={() => onEnviar(orden.id)}>
            Enviar
          </Button>
          <Button variant="outline-danger" onClick={() => onCancelar(orden.id)}>
            Cancelar
          </Button>
        </ButtonGroup>
      );
    }

    if (estado === "enviada" || estado === "en proceso") {
      return (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => onFinalizar(orden.id)}
        >
          Finalizar
        </Button>
      );
    }

    return null; // Sin acciones para estados finalizados o cancelados
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
              <td>{renderizarAcciones(orden)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrdenCompraList;
