type Product = {
  codigo: string;
  imagenUrl: string;
  modelo: string;
  producto: string;
  fabricante: string;
  estado: string;
};

const productos: Product[] = [
  {
    codigo: 'P001',
    imagenUrl: 'https://via.placeholder.com/50',
    modelo: 'M100',
    producto: 'Cámara',
    fabricante: 'Canon',
    estado: 'Disponible',
  },
  {
    codigo: 'P002',
    imagenUrl: 'https://via.placeholder.com/50',
    modelo: 'X200',
    producto: 'Teléfono',
    fabricante: 'Samsung',
    estado: 'Agotado',
  },
  // Más productos...
];

export default function ProductTable() {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Imagen</th>
            <th>Modelo</th>
            <th>Producto</th>
            <th>Fabricante</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.codigo}>
              <td>{prod.codigo}</td>
              <td>
                <img
                  src={prod.imagenUrl}
                  alt={prod.producto}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{prod.modelo}</td>
              <td>{prod.producto}</td>
              <td>{prod.fabricante}</td>
              <td>
                <span
                  className={`badge ${
                    prod.estado === 'Disponible' ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {prod.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
