interface StatCardProps {
  value: number;
  label: string;
  color?: 'green' | 'purple' | 'blue' | 'yellow';
  icon: React.ReactNode;
  outline?: boolean;
}

export default function StatCard({ value, label, icon, color = 'blue', outline = false }: StatCardProps) {
  const bgColors = {
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-400',
  };

  const ringColors = {
    green: 'ring-green-500 text-green-500',
    purple: 'ring-purple-500 text-purple-500',
    blue: 'ring-blue-500 text-blue-500',
    yellow: 'ring-yellow-400 text-yellow-400',
  };

  return (
    <div className={`rounded-md shadow-sm p-4 ${outline ? 'bg-white' : `${bgColors[color]} text-white`} text-center`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className={`text-sm font-semibold ${outline ? 'text-gray-700' : 'text-white'}`}>{label}</div>
      <div className="mt-3 flex justify-center items-center">
        <div className={`p-3 rounded-full ring-2 ${outline ? ringColors[color] : 'text-white'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
