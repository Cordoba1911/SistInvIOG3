
type Product = {
  id: number;
  codigo: string;
  descripcion: string;
  demanda: number;
  costo_almacenamiento: number;
  costo_pedido: number;
  costo_compra: number;
  modelo_inventario: 'EOQ' | 'ROP' | 'Otro';
  proveedor_predeterminado_id: number;
  lote_optimo: number;
  punto_pedido: number;
  stock_seguridad: number;
  inventario_maximo: number;
  cgi: number;
  stock_actual: number;
  estado: boolean;
  fecha_baja: string | null;
};

const productos: Product[] = [
  {
    id: 1,
    codigo: 'P001',
    descripcion: 'Cámara profesional DSLR',
    demanda: 50,
    costo_almacenamiento: 10.5,
    costo_pedido: 25.0,
    costo_compra: 500.0,
    modelo_inventario: 'EOQ',
    proveedor_predeterminado_id: 101,
    lote_optimo: 20,
    punto_pedido: 10,
    stock_seguridad: 5,
    inventario_maximo: 100,
    cgi: 1.2,
    stock_actual: 30,
    estado: true,
    fecha_baja: null,
  },
  {
    id: 2,
    codigo: 'P002',
    descripcion: 'Trípode de aluminio ajustable',
    demanda: 80,
    costo_almacenamiento: 5.0,
    costo_pedido: 15.0,
    costo_compra: 120.0,
    modelo_inventario: 'ROP',
    proveedor_predeterminado_id: 102,
    lote_optimo: 40,
    punto_pedido: 20,
    stock_seguridad: 10,
    inventario_maximo: 200,
    cgi: 0.8,
    stock_actual: 60,
    estado: true,
    fecha_baja: null,
  },
  // Podés agregar más productos...
];

const atributos = [
  { key: 'id', label: 'ID' },
  { key: 'codigo', label: 'Código' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'demanda', label: 'Demanda' },
  { key: 'costo_almacenamiento', label: 'Costo Almacenamiento ($)' },
  { key: 'costo_pedido', label: 'Costo Pedido ($)' },
  { key: 'costo_compra', label: 'Costo Compra ($)' },
  { key: 'modelo_inventario', label: 'Modelo Inventario' },
  { key: 'proveedor_predeterminado_id', label: 'Proveedor ID' },
  { key: 'lote_optimo', label: 'Lote Óptimo' },
  { key: 'punto_pedido', label: 'Punto Pedido' },
  { key: 'stock_seguridad', label: 'Stock Seguridad' },
  { key: 'inventario_maximo', label: 'Inventario Máx' },
  { key: 'cgi', label: 'CGI' },
  { key: 'stock_actual', label: 'Stock Actual' },
  { key: 'estado', label: 'Estado' },
  { key: 'fecha_baja', label: 'Fecha Baja' },
];

export default function ProductTableTranspuesta() {
  const handleEdit = (id: number) => {
    console.log('Editar producto con ID:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Eliminar producto con ID:', id);
  };

  const handleAdd = () => {
    console.log('Agregar nuevo producto');
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>Atributo</th>
            {productos.map((prod) => (
              <th key={prod.id}>{prod.codigo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {atributos.map((attr) => (
            <tr key={attr.key}>
              <td><strong>{attr.label}</strong></td>
              {productos.map((prod) => (
                <td key={prod.id + '-' + attr.key}>
                  {attr.key === 'estado' ? (
                    <span className={`badge ${prod.estado ? 'bg-success' : 'bg-secondary'}`}>
                      {prod.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  ) : (
                    formatValue(attr.key, prod[attr.key as keyof Product])
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td><strong>Acciones</strong></td>
            {productos.map((prod) => (
              <td key={'acciones-' + prod.id}>
  <div className="dropdown">
    <button
      className="btn btn-sm btn-secondary dropdown-toggle"
      type="button"
      id={`dropdown-${prod.id}`}
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Acciones
    </button>
    <ul className="dropdown-menu" aria-labelledby={`dropdown-${prod.id}`}>
      <li>
        <button className="dropdown-item" onClick={() => handleEdit(prod.id)}>
          Editar
        </button>
      </li>
      <li>
        <button className="dropdown-item" onClick={() => handleDelete(prod.id)}>
          Eliminar
        </button>
      </li>
    </ul>
  </div>
</td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="mt-3">
        <button className="btn btn-success" onClick={handleAdd}>
          Agregar Producto
        </button>
      </div>
    </div>
  );
}

function formatValue(key: string, value: any) {
  if (value == null) return '-';
  if (typeof value === 'number') return value.toFixed(2);
  if (typeof value === 'string' && Date.parse(value)) return new Date(value).toLocaleDateString();
  return value;
}
