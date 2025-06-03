import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "react-bootstrap";

const data = [
  { mes: "Enero", ventas: 200000 },
  { mes: "Febrero", ventas: 180000 },
  { mes: "Marzo", ventas: 5500000 },
  { mes: "Abril", ventas: 0 },
  { mes: "Mayo", ventas: 220000 },
  { mes: "Junio", ventas: 0 },
  { mes: "Julio", ventas: 10000 },
  { mes: "Agosto", ventas: 3000 },
  { mes: "Septiembre", ventas: 2000 },
  { mes: "Octubre", ventas: 4000 },
  { mes: "Noviembre", ventas: 5000 },
  { mes: "Diciembre", ventas: 15000 },
];

// Colores para las tarjetas
const cardColors = {
  inventario: "bg-purple text-white",
  ventas: "bg-success text-white",
  compras: "bg-warning text-white",
  clientes: "bg-info text-white",
};

export default function HomePage() {
  return (
    <div className="container-fluid px-4 py-3">
      <h5 className="mb-4">Reporte de ventas 2025</h5>
      <div className="row gx-4 gy-4">
        {/* Gráfico: ocupa más espacio en desktop, se adapta en móvil */}
        <div className="col-12 col-lg-8">
          <h6 className="text-center mb-3">Compras & Ventas 2025</h6>
          <div style={{ width: "100%", height: 320, minHeight: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${val / 1000000}M`
                      : val >= 1000
                      ? `${val / 1000}K`
                      : val
                  }
                />
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    })
                  }
                />
                <Bar dataKey="ventas" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjetas KPI: Responsive y espaciado consistente */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-3">
          <Card className={`${cardColors.inventario} p-3 shadow`}>
            <h6>INVENTARIO NETO</h6>
            <h4 className="fw-bold">-227,627.00</h4>
            <small>Productos en stock: 3</small>
          </Card>

          <Card className={`${cardColors.ventas} p-3 shadow`}>
            <h6>VENTAS 2025</h6>
            <h4 className="fw-bold">6,280,337.90</h4>
            <small>Facturas emitidas: 154</small>
          </Card>

          <Card className={`${cardColors.compras} p-3 shadow`}>
            <h6>COMPRAS 2025</h6>
            <h4 className="fw-bold">292,288.40</h4>
            <small>Compras realizadas: 44</small>
          </Card>

          <Card className={`${cardColors.clientes} p-3 shadow`}>
            <h6>CLIENTES</h6>
            <h4 className="fw-bold">7,880</h4>
            <small>Clientes nuevos: 4</small>
          </Card>
        </div>
      </div>
    </div>
  );
}
