import { useState } from 'react';
import { Modal, Button, Table, Form, InputGroup, Pagination } from 'react-bootstrap';

interface Producto {
  codigo: string;
  nombre: string;
  fabricante: string;
  cantidad: number;
  costo: number;
}

interface Props {
  show: boolean;
  onClose: () => void;
  onAgregar: (producto: Producto) => void;
}

const productosMock: Producto[] = [
  { codigo: '1511', nombre: 'Monitor LCD', fabricante: 'Sony', cantidad: 1, costo: 100.0 },
  { codigo: '2313', nombre: 'Mouse', fabricante: 'Lenovo', cantidad: 1, costo: 35.0 },
  { codigo: '12345', nombre: 'Hp pavilion', fabricante: 'HP', cantidad: 1, costo: 17833.0 },
  { codigo: '7591002000011', nombre: 'Teclado Terexor', fabricante: 'HP', cantidad: 1, costo: 10.0 },
  { codigo: '3219', nombre: 'Toshiba Satellite L10W-B-104 N2840', fabricante: 'Dell', cantidad: 1, costo: 90.0 },
];

export default function BuscarProductosModal({ show, onClose, onAgregar }: Props) {
  const [busqueda, setBusqueda] = useState('');

  const filtrarProductos = productosMock.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Buscar productos</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Buscar productos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Button variant="outline-secondary">
            <i className="bi bi-search"></i> Buscar
          </Button>
        </InputGroup>

        <Table bordered hover>
          <thead className="table-warning">
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Proveedor</th>
              <th>Cant.</th>
              <th>Costo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrarProductos.map((producto, idx) => (
              <tr key={idx}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.fabricante}</td>
                <td>
                  <Form.Control
                    type="number"
                    min={1}
                    value={producto.cantidad}
                    onChange={(e) =>
                      (producto.cantidad = parseInt(e.target.value) || 1)
                    }
                    style={{ maxWidth: '70px' }}
                  />
                </td>
                <td>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      min={0}
                      value={producto.costo}
                      onChange={(e) =>
                        (producto.costo = parseFloat(e.target.value) || 0)
                      }
                    />
                  </InputGroup>
                </td>
                <td className="text-center">
                  <Button
                    variant="success"
                    onClick={() => onAgregar({ ...producto })}
                  >
                    <i className="bi bi-cart-plus"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Paginación dummy */}
        <div className="d-flex justify-content-end">
          <Pagination>
            <Pagination.Prev>Anterior</Pagination.Prev>
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Next>Siguiente</Pagination.Next>
          </Pagination>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
