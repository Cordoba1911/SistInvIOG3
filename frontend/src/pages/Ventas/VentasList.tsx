import EntityList from '../../components/EntityList';
import type { Venta } from '../../types/venta';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface VentasListProps {
  ventas: Venta[];
}

const VentasList = ({ ventas }: VentasListProps) => {

  const columnas = [
    { campo: 'id', etiqueta: 'ID Venta' },
    { campo: 'fecha_venta', etiqueta: 'Fecha de Venta' },
    { campo: 'articulos', etiqueta: 'Artículos' },
    { campo: 'cantidades', etiqueta: 'Cantidades Totales' },
  ];

  const datosProcesados = ventas.map(venta => ({
    id: venta.id,
    fecha_venta: new Date(venta.fecha_venta).toLocaleDateString(),
    articulos: venta.detalle_venta?.map(d => d.articulo?.nombre || `ID: ${d.articulo_id}`).join(', ') || 'N/A',
    cantidades: venta.detalle_venta?.reduce((sum, d) => sum + d.cantidad, 0) || 0,
  }));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Listado de Ventas</h2>
        <Link to="/ventas/nueva" className="btn btn-primary">
          Registrar Venta
        </Link>
      </div>
      <EntityList
        datos={datosProcesados}
        columnas={columnas}
        campoId="id"
      />
    </div>
  );
};

export default VentasList;