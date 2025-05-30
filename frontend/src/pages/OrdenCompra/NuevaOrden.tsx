import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import BuscarProductosModal from '../../components/BuscarProductosModal';

export default function NuevaOrden() {
  const [fecha, setFecha] = useState('2025-05-29');
  const [numeroCompra, setNumeroCompra] = useState('23141');
  const [proveedor, setProveedor] = useState('');
  // Estado para abrir/cerrar modal
const [mostrarModal, setMostrarModal] = useState(false);

const handleAgregarProducto = (producto: any) => {
  console.log('Agregar producto:', producto);
  // Aquí podés agregar el producto a tu lista de compra
  setMostrarModal(false);
};
  return (
    <div className="container mt-4">
      <h5><i className="bi bi-pencil-square me-2"></i>Agregar nueva compra</h5>
      <hr />

      <div className="border p-3 rounded bg-white shadow-sm">
        <h6 className="mb-3">Detalles de la compra</h6>

        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-4">
            <label className="form-label fw-bold">Proveedor</label>
            <InputGroup>
              <Form.Select value={proveedor} onChange={(e) => setProveedor(e.target.value)}>
                <option>Selecciona Proveedor</option>
                <option value="1">Proveedor 1</option>
                <option value="2">Proveedor 2</option>
              </Form.Select>
              <Button variant="outline-primary">+ Nuevo</Button>
            </InputGroup>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Fecha</label>
            <InputGroup>
              <Form.Control type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              <InputGroup.Text><i className="bi bi-calendar" /></InputGroup.Text>
            </InputGroup>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Compra Nº</label>
            <Form.Control value={numeroCompra} readOnly />
          </div>
        </div>

        <div className="text-end mb-3">
          <Button variant="info" onClick={() => setMostrarModal(true)}>
  <i className="bi bi-search"></i> Buscar productos
</Button>

<BuscarProductosModal
  show={mostrarModal}
  onClose={() => setMostrarModal(false)}
  onAgregar={handleAgregarProducto}
/>
        </div>

        {/* Tabla de productos */}
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>CODIGO</th>
                <th>CANT.</th>
                <th>DESCRIPCION</th>
                <th>PRECIO UNIT.</th>
                <th>PRECIO TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div className="d-flex flex-column">
                    <span>NETO $</span>
                    <Form.Select size="sm" className="mt-1">
                      <option>IVA 0.00 %</option>
                      <option>IVA 21.00 %</option>
                      <option>IVA 10.50 %</option>
                    </Form.Select>
                  </div>
                </td>
                <td>0.00</td>
              </tr>
              <tr>
                <td colSpan={4} className="text-end fw-bold">TOTAL $</td>
                <td>0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-end">
          <Button variant="success">
            <i className="bi bi-save"></i> Guardar datos
          </Button>
        </div>
      </div>
    </div>
  );
}
