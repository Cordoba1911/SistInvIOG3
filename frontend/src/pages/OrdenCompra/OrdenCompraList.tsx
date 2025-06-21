import React from "react";
import { Table, Badge, ButtonGroup } from "react-bootstrap";
import type { OrdenCompra } from "../../types/ordenCompra";
import { Link } from "react-router-dom";

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
    if (estadoNormalizado === "pendiente") return "warning";
    if (estadoNormalizado === "en proceso" || estadoNormalizado === "enviada")
      return "primary";
    if (estadoNormalizado === "finalizada") return "success";
    if (estadoNormalizado === "cancelada") return "danger";
    return "secondary";
  };

  const renderizarAcciones = (orden: OrdenCompra) => {
    const estado = orden.estado.toLowerCase();

    const commonBadgeProps = {
      as: "button",
      className: "me-1 action-badge",
      style: { cursor: "pointer" },
    };

    if (estado === "pendiente") {
      return (
        <ButtonGroup size="sm">
          <Badge
            {...commonBadgeProps}
            bg="primary"
            onClick={() => onEditar(orden)}
          >
            Editar
          </Badge>
          <Badge
            {...commonBadgeProps}
            bg="info"
            onClick={() => onEnviar(orden.id)}
          >
            Enviar
          </Badge>
          <Badge
            {...commonBadgeProps}
            bg="danger"
            onClick={() => onCancelar(orden.id)}
          >
            Cancelar
          </Badge>
        </ButtonGroup>
      );
    }

    if (estado === "enviada" || estado === "en proceso") {
      return (
        <Badge
          {...commonBadgeProps}
          bg="success"
          onClick={() => onFinalizar(orden.id)}
        >
          Finalizar
        </Badge>
      );
    }

    return null; // Sin acciones para estados finalizados o cancelados
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lista de Órdenes de Compra</h3>
        <Link to="/ordenes/orden-compra" className="btn btn-primary">
          Crear Orden
        </Link>
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
