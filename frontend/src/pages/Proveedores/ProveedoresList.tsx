type Proveedor = {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  estado: boolean;
  fecha_baja: string | null; // Puede ser null si el proveedor está activo
};

const proveedores: Proveedor[] = [
  {
    id: 1,
    nombre: 'Proveedor A',
    telefono: '123456789',
    email: 'a@proveedor.com',
    estado: true,
    fecha_baja: null,
  },
  {
    id: 2,
    nombre: 'Proveedor B',
    telefono: '987654321',
    email: 'b@proveedor.com',
    estado: false,
    fecha_baja: '2024-10-01T00:00:00Z',
  },
];

export default function ProveedoresList() {
  const handleEdit = (id: number) => {
    console.log('Editar proveedor con ID:', id);
    // Lógica para editar
  };

  const handleDelete = (id: number) => {
    console.log('Eliminar proveedor con ID:', id);
    // Lógica para eliminar
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Fecha de Baja</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov) => (
            <tr key={prov.id}>
              <td>{prov.id}</td>
              <td>{prov.nombre}</td>
              <td>{prov.telefono}</td>
              <td>{prov.email}</td>
              <td>
                <span
                  className={`badge ${
                    prov.estado ? 'bg-success' : 'bg-secondary'
                  }`}
                >
                  {prov.estado ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>{prov.fecha_baja ? new Date(prov.fecha_baja).toLocaleDateString() : '-'}</td>
              <td>
                <div className="dropdown">
  <button
    className="btn btn-sm btn-secondary dropdown-toggle"
    type="button"
    id={`dropdown-${prov.id}`}
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Acciones
  </button>
  <ul className="dropdown-menu" aria-labelledby={`dropdown-${prov.id}`}>
    <li>
      <button className="dropdown-item" onClick={() => handleEdit(prov.id)}>
        Editar
      </button>
    </li>
    <li>
      <button className="dropdown-item" onClick={() => handleDelete(prov.id)}>
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

      {/* Botón para agregar un nuevo proveedor */}
      <div className="mt-3">
        <button className="btn btn-success" onClick={() => console.log('Agregar proveedor')}>
          Agregar Proveedor
        </button>
      </div>
    </div>
  );
}
