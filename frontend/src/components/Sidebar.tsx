export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="flex items-center gap-2 mb-6">
        <img src="https://i.imgur.com/Uz4FvyP.png" alt="Avatar" className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-bold">Obed Alvarado</div>
          <div className="text-xs text-green-400">Online</div>
        </div>
      </div>
      <nav className="space-y-2">
        <a href="#" className="flex items-center gap-2 text-sm bg-gray-700 p-2 rounded">🏠 Inicio</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">🛒 Compras</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">📦 Productos</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">🏭 Fabricantes</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">👥 Contactos</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">📄 Facturación</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">📊 Reportes</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">⚙️ Configuración</a>
        <a href="#" className="flex items-center gap-2 text-sm hover:bg-gray-700 p-2 rounded">🔐 Administrar accesos</a>
      </nav>
    </aside>
  );
}