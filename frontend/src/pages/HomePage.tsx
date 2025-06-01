import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from 'react-bootstrap';

const data = [
  { mes: 'Enero', ventas: 200000 },
  { mes: 'Febrero', ventas: 180000 },
  { mes: 'Marzo', ventas: 5500000 },
  { mes: 'Abril', ventas: 0 },
  { mes: 'Mayo', ventas: 220000 },
  { mes: 'Junio', ventas: 0 },
  { mes: 'Julio', ventas: 10000 },
  { mes: 'Agosto', ventas: 3000 },
  { mes: 'Septiembre', ventas: 2000 },
  { mes: 'Octubre', ventas: 4000 },
  { mes: 'Noviembre', ventas: 5000 },
  { mes: 'Diciembre', ventas: 15000 },
];

export default function HomePage() {
  return (
    <div className="container-fluid">
      <h5 className="mb-3">Reporte de ventas 2025</h5>
      <div className="row">
        {/* Gráfico */}
        <div className="col-lg-9">
          <h6 className="text-center mb-3">Compras & Ventas 2025</h6>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" angle={-45} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjetas a la derecha */}
        <div className="col-lg-3 d-flex flex-column gap-3" style={{ height: '300px' }}>

          <Card className="bg-purple text-white p-3">
            <h6>INVENTARIO NETO</h6>
            <h4 className="fw-bold">-227,627.00</h4>
            <small>Productos en stock: 3</small>
          </Card>

          <Card className="bg-success text-white p-3">
            <h6>VENTAS 2025</h6>
            <h4 className="fw-bold">6,280,337.90</h4>
            <small>Facturas emitidas: 154</small>
          </Card>

          <Card className="bg-warning text-white p-3">
            <h6>COMPRAS 2025</h6>
            <h4 className="fw-bold">292,288.40</h4>
            <small>Compras realizadas: 44</small>
          </Card>

          <Card className="bg-info text-white p-3">
            <h6>CLIENTES</h6>
            <h4 className="fw-bold">7,880</h4>
            <small>Clientes nuevos: 4</small>
          </Card>
        </div>
      </div>
    </div>
  );
}
