import React from "react";
import type { ArticuloProveedorDetalle } from "../../types/proveedor";
import { FaTimes } from "react-icons/fa";
import { Table, Card, Button } from "react-bootstrap";

interface ArticulosListProps {
  articulos: ArticuloProveedorDetalle[];
  proveedorNombre: string;
  onClose: () => void;
}

const ArticulosList: React.FC<ArticulosListProps> = ({
  articulos,
  proveedorNombre,
  onClose,
}) => {
  return (
    <Card className="mt-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Artículos de {proveedorNombre}</h5>
          <Button
            variant="link"
            className="p-0"
            onClick={onClose}
            style={{ color: "red" }}
          >
            <FaTimes size={20} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Stock Actual</th>
              <th>Precio Unitario</th>
              <th>Cargos de Pedido</th>
              <th>Días de Demora</th>
            </tr>
          </thead>
          <tbody>
            {articulos && articulos.length > 0 ? (
              articulos.map((detalle) => {
                if (!detalle || !detalle.articulo) {
                  return null; // Ignora detalles inválidos
                }
                const {
                  articulo,
                  precio_unitario,
                  cargos_pedido,
                  demora_entrega,
                } = detalle;

                const precio =
                  typeof precio_unitario === "number"
                    ? `$${precio_unitario.toFixed(2)}`
                    : "N/A";
                const costoPedido =
                  typeof cargos_pedido === "number"
                    ? `$${cargos_pedido.toFixed(2)}`
                    : "N/A";

                return (
                  <tr key={articulo.id}>
                    <td>{articulo.id}</td>
                    <td>{articulo.nombre ?? "N/A"}</td>
                    <td>{articulo.stock_actual ?? "N/A"}</td>
                    <td>{precio}</td>
                    <td>{costoPedido}</td>
                    <td>{demora_entrega ?? "N/A"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay artículos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ArticulosList;
