import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import type { Proveedor } from "../../types/proveedor";
import type { Articulo } from "../../types/articulo";

interface RelacionarArticuloModalProps {
  show: boolean;
  onHide: () => void;
  proveedor: Proveedor;
  articulosDisponibles: Articulo[];
  onSubmit: (proveedorId: number, articulos: any[]) => void;
}

const RelacionarArticuloModal: React.FC<RelacionarArticuloModalProps> = ({
  show,
  onHide,
  proveedor,
  articulosDisponibles,
  onSubmit,
}) => {
  const [articulos, setArticulos] = useState([
    {
      articulo_id: "",
      precio_unitario: "",
      demora_entrega: "",
      cargos_pedido: "",
      proveedor_predeterminado: "false",
    },
  ]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const list = [...articulos];

    const targetValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : value;
    (list[index] as any)[name] = targetValue;

    setArticulos(list);
  };

  const handleAddClick = () => {
    setArticulos([
      ...articulos,
      {
        articulo_id: "",
        precio_unitario: "",
        demora_entrega: "",
        cargos_pedido: "",
        proveedor_predeterminado: "false",
      },
    ]);
  };

  const handleRemoveClick = (index: number) => {
    const list = [...articulos];
    list.splice(index, 1);
    setArticulos(list);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const articulosAEnviar = articulos
      .filter(
        (art) =>
          art.articulo_id &&
          art.precio_unitario &&
          parseFloat(art.precio_unitario) > 0
      )
      .map((art) => ({
        articulo_id: parseInt(art.articulo_id, 10),
        precio_unitario: parseFloat(art.precio_unitario),
        demora_entrega: art.demora_entrega
          ? parseInt(art.demora_entrega, 10)
          : undefined,
        cargos_pedido: art.cargos_pedido
          ? parseFloat(art.cargos_pedido)
          : undefined,
        proveedor_predeterminado: art.proveedor_predeterminado === "true",
      }));

    if (articulosAEnviar.length > 0) {
      onSubmit(proveedor.id, articulosAEnviar);
    } else {
      // Opcional: mostrar un mensaje de error si no hay artículos válidos
      alert("Por favor, agregue al menos un artículo con precio válido.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Añadir Artículos a {proveedor.nombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {articulos.map((x, i) => (
            <Row key={i} className="mb-3 align-items-end">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Artículo</Form.Label>
                  <Form.Select
                    name="articulo_id"
                    value={x.articulo_id}
                    onChange={(e) => handleChange(i, e)}
                    required
                  >
                    <option value="">Seleccionar artículo</option>
                    {articulosDisponibles.map((art) => (
                      <option key={art.id} value={art.id}>
                        {art.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio_unitario"
                    value={x.precio_unitario}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="Precio"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Demora</Form.Label>
                  <Form.Control
                    type="number"
                    name="demora_entrega"
                    value={x.demora_entrega}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="Días"
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className="text-nowrap">Cargos Pedido</Form.Label>
                  <Form.Control
                    type="number"
                    name="cargos_pedido"
                    value={x.cargos_pedido}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="Costo"
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={2}>
                <Form.Group>
                  <Form.Label>Predeterminado</Form.Label>
                  <Form.Select
                    name="proveedor_predeterminado"
                    value={String(x.proveedor_predeterminado)}
                    onChange={(e) => handleChange(i, e)}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs="auto" className="d-flex align-items-center">
                {articulos.length !== 1 && (
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveClick(i)}
                    className="me-2"
                  >
                    <FaTrash />
                  </Button>
                )}
                {articulos.length - 1 === i && (
                  <Button variant="success" onClick={handleAddClick}>
                    <FaPlus />
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Añadir Artículos
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RelacionarArticuloModal; 