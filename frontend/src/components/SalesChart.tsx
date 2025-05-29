import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Enero', ventas: 50000 },
  { name: 'Febrero', ventas: 52000 },
  { name: 'Marzo', ventas: 5600000 },
  { name: 'Abril', ventas: 30000 },
  { name: 'Mayo', ventas: 40000 },
  { name: 'Junio', ventas: 25000 },
  { name: 'Julio', ventas: 20000 },
  { name: 'Agosto', ventas: 10000 },
  { name: 'Septiembre', ventas: 15000 },
  { name: 'Octubre', ventas: 18000 },
  { name: 'Noviembre', ventas: 22000 },
  { name: 'Diciembre', ventas: 26000 },
];

export default function SalesChart() {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-center font-semibold mb-2">Compras & Ventas 2025</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="ventas" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}