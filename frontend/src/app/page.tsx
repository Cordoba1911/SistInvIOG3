export default function InventoryCalculations() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Inventario</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">📊 Gestión de Inventario</h2>
        <p className="text-gray-700 mb-4">
          Accede a las funcionalidades de inventario desde el menú principal:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li><strong>Artículos</strong> - Gestionar productos y configurar modelos de inventario</li>
          <li><strong>Proveedores</strong> - Administrar proveedores y relaciones con artículos</li>
          <li><strong>Órdenes de Compra</strong> - Crear y gestionar pedidos</li>
          <li><strong>Ventas</strong> - Registrar y consultar ventas</li>
        </ul>
      </div>
    </div>
  )
}
