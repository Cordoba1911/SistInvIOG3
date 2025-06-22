import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

type Estado = 'pendiente' | 'enviado' | 'finalizado';

type Orden = {
  id: number;
  articulo_id: number;
  proveedor_id: number;
  cantidad: number;
  estado: Estado;
  fecha_creacion: string;
  fecha_envio: string;
  fecha_finalizacion: string;
};

export default function OrdenList() {
  const [ordenes, setOrdenes] = useState<Orden[]>([
    {
      id: 1,
      articulo_id: 101,
      proveedor_id: 201,
      cantidad: 5,
      estado: 'pendiente',
      fecha_creacion: '2025-05-23T10:00:00',
      fecha_envio: '',
      fecha_finalizacion: '',
    },
    {
      id: 2,
      articulo_id: 102,
      proveedor_id: 202,
      cantidad: 10,
      estado: 'enviado',
      fecha_creacion: '2025-05-20T14:30:00',
      fecha_envio: '2025-05-22T08:00:00',
      fecha_finalizacion: '',
    },
    {
      id: 3,
      articulo_id: 103,
      proveedor_id: 203,
      cantidad: 20,
      estado: 'finalizado',
      fecha_creacion: '2025-05-10T09:00:00',
      fecha_envio: '2025-05-12T11:00:00',
      fecha_finalizacion: '2025-05-18T16:30:00',
    },
  ]);

  const handleEdit = (id: number) => {
    console.log('Editar orden:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Eliminar orden:', id);
  };

  return (
    <div className="container mt-4">
      {/* Filtros */}
      <div className="d-flex gap-2 mb-3">
        <InputGroup style={{ maxWidth: '250px' }}>
  <InputGroup.Text>
    <i className="bi bi-calendar"></i>
  </InputGroup.Text>
  <Form.Control type="date" />
</InputGroup>

        <select className="form-select" style={{ maxWidth: '250px' }}>
          <option>Selecciona el proveedor</option>
          <option value="201">Pepito</option>
          <option value="202">Cerabol</option>
        </select>

        <div className="input-group" style={{ maxWidth: '250px' }}>
          <input type="text" className="form-control" placeholder="Buscar por número" />
          <button className="btn btn-outline-secondary">
            <i className="bi bi-search" />
          </button>
        </div>

        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-outline-primary">
            <i className="bi bi-plus" /> Nuevo
          </button>
          <button className="btn btn-outline-secondary">Mostrar</button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Orden Nº</th>
              <th>Artículo ID</th>
              <th>Proveedor ID</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Creación</th>
              <th>Envío</th>
              <th>Finalización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>{orden.id}</td>
                <td>{orden.articulo_id}</td>
                <td>{orden.proveedor_id}</td>
                <td>{orden.cantidad}</td>
                <td>
                  <span className={`badge 
                    ${orden.estado === 'pendiente' ? 'bg-warning' : 
                      orden.estado === 'enviado' ? 'bg-info' : 
                      'bg-success'}
                  `}>
                    {orden.estado}
                  </span>
                </td>
                <td>{orden.fecha_creacion ? new Date(orden.fecha_creacion).toLocaleDateString() : '-'}</td>
                <td>{orden.fecha_envio ? new Date(orden.fecha_envio).toLocaleDateString() : '-'}</td>
                <td>{orden.fecha_finalizacion ? new Date(orden.fecha_finalizacion).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      Acciones
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button className="dropdown-item" onClick={() => handleEdit(orden.id)}>
                          Editar
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleDelete(orden.id)}>
                          Eliminar
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
