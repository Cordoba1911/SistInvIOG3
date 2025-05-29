

import { FaTags, FaDollarSign, FaShoppingCart, FaUsers } from 'react-icons/fa';

const cards = [
  {
    title: 'INVENTARIO NETO',
    value: '-227,257.00',
    subtitle: 'Productos en stock: 3',
    color: 'bg-purple-700',
    icon: <FaTags className="text-white text-2xl" />,
  },
  {
    title: 'VENTAS 2025',
    value: '6,279,676.50',
    subtitle: 'Facturas emitidas: 150',
    color: 'bg-green-600',
    icon: <FaDollarSign className="text-white text-2xl" />,
  },
  {
    title: 'COMPRAS 2025',
    value: '292,288.40',
    subtitle: 'Compras realizadas: 44',
    color: 'bg-yellow-500',
    icon: <FaShoppingCart className="text-white text-2xl" />,
  },
  {
    title: 'CLIENTES',
    value: '7,879',
    subtitle: 'Clientes nuevos: 3',
    color: 'bg-cyan-500',
    icon: <FaUsers className="text-white text-2xl" />,
  },
];

export default function SummaryCards() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`p-4 rounded shadow text-white ${card.color} flex items-center justify-between`}>
          <div>
            <h4 className="text-sm font-semibold">{card.title}</h4>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm mt-1">{card.subtitle}</div>
          </div>
          <div className="text-4xl">{card.icon}</div>
        </div>
      ))}
    </section>
  );
}