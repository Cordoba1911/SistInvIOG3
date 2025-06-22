import React from "react";
import { Modal, Button, Spinner, Table } from "react-bootstrap";
import type { ArticuloProveedorDetalle } from "../../types/proveedor";

interface ArticulosProveedorModalProps {
  show: boolean;
  onHide: () => void;
  proveedorNombre: string;
  articulos: ArticuloProveedorDetalle[];
  isLoading: boolean;
}

const ArticulosProveedorModal: React.FC<ArticulosProveedorModalProps> = ({
  show,
  onHide,
  proveedorNombre,
  articulos,
  isLoading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Artículos de {proveedorNombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Precio Unitario</th>
                <th>Costo de Pedido</th>
                <th>Días de Demora</th>
              </tr>
            </thead>
            <tbody>
              {articulos.length > 0 ? (
                articulos.map((detalle) => (
                  <tr key={detalle.articulo.id}>
                    <td>{detalle.articulo.id}</td>
                    <td>{detalle.articulo.nombre}</td>
                    <td>{detalle.articulo.stock_actual ?? "N/A"}</td>
                    <td>${detalle.precio_unitario.toFixed(2)}</td>
                    <td>${detalle.cargos_pedido?.toFixed(2) ?? "N/A"}</td>
                    <td>{detalle.demora_entrega ?? "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No hay artículos para este proveedor.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArticulosProveedorModal;
