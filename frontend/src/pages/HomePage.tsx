export default function HomePage() {
  return (
    <div>
      <h1 className="mb-4">🏠 Bienvenido al Dashboard</h1>
      <p>Esta es la página principal. Aquí podés mostrar resúmenes, estadísticas o lo que quieras.</p>

      {/* Ejemplo: tarjetas con resumen */}
      <div className="d-flex gap-3 flex-wrap">
        <div className="card text-white bg-primary p-3" style={{ minWidth: 200 }}>
          <h5>Total Productos</h5>
          <p className="fs-3">120</p>
        </div>
        <div className="card text-white bg-success p-3" style={{ minWidth: 200 }}>
          <h5>Ventas del mes</h5>
          <p className="fs-3">$15,000</p>
        </div>
        <div className="card text-white bg-warning p-3" style={{ minWidth: 200 }}>
          <h5>Clientes activos</h5>
          <p className="fs-3">75</p>
        </div>
      </div>
    </div>
  );
}
