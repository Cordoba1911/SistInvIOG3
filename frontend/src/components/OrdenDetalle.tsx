
import { Card } from "react-bootstrap";
import type { OrdenCompra } from "../models/OrdenCompra";

interface Props {
  orden: OrdenCompra;
}

const OrdenDetalle = ({ orden }: Props) => {
  return (
    <Card className="mt-4">
      <Card.Header>Detalle de Orden</Card.Header>
      <Card.Body>
        <p><strong>Nombre:</strong> {orden.nombre}</p>
        <p><strong>Proveedor:</strong> {orden.proveedor}</p>
        <p><strong>Cantidad:</strong> {orden.cantidad}</p>
        <p><strong>Estado:</strong> {orden.estado}</p>
        <p><strong>Fecha de creación:</strong> {orden.fecha_creacion}</p>
        {orden.fecha_envio && <p><strong>Fecha de envío:</strong> {orden.fecha_envio}</p>}
        {orden.fecha_finalizacion && <p><strong>Fecha de finalización:</strong> {orden.fecha_finalizacion}</p>}
      </Card.Body>
    </Card>
  );
};

export default OrdenDetalle;
