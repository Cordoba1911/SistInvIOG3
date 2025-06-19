import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-4 py-4">
      <h5 className="mb-4">Resumen general 2025</h5>

      <div className="row gy-4">
        {/* INVENTARIO */}
        <div className="col-12 col-md-6 col-lg-3">
          <Card className="bg-purple text-white p-3 shadow"
            role="button"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/modelos")}>
            <h6>INVENTARIO NETO</h6>
            <h4 className="fw-bold">227,627.00</h4>
            <small>Productos en stock: 3</small>
          </Card>
        </div>

        {/* VENTAS */}
        <div className="col-12 col-md-6 col-lg-3">
          <Card
            className="bg-success text-white p-3 shadow"
            role="button"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/ventas")}
          >
            <h6>VENTAS</h6>
            <h4 className="fw-bold">6,280,337.90</h4>
            <small>Facturas emitidas: 154</small>
          </Card>
        </div>

        {/* COMPRAS */}
        <div className="col-12 col-md-6 col-lg-3">
          <Card
            className="bg-warning text-white p-3 shadow"
            role="button"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/ordenes/admin-orden-compra")}
          >
            <h6>COMPRAS</h6>
            <h4 className="fw-bold">292,288.40</h4>
            <small>Compras realizadas: 44</small>
          </Card>
        </div>

        {/* CLIENTES */}
        <div className="col-12 col-md-6 col-lg-3">
          <Card className="bg-info text-white p-3 shadow">
            <h6>CLIENTES</h6>
            <h4 className="fw-bold">7,880</h4>
            <small>Clientes nuevos: 4</small>
          </Card>
        </div>
      </div>
    </div>
  );
}
