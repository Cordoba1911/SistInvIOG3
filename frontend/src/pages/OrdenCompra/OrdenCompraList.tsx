import { Badge, Button } from "react-bootstrap";
import {
  PencilFill,
  CheckCircleFill,
  XCircleFill,
  Truck,
} from "react-bootstrap-icons";
import EntidadList from "../../components/EntityList";
import type { OrdenCompra } from "../../types/ordenCompra";

interface PropsOrdenCompraList {
  ordenes: OrdenCompra[];
  onEditar: (orden: OrdenCompra) => void;
  onCancelar: (id: number) => void;
  onEnviar: (id: number) => void;
  onFinalizar: (id: number) => void;
  botonCrear?: React.ReactNode;
}

const OrdenCompraList = ({
  ordenes,
  onEditar,
  onCancelar,
  onEnviar,
  onFinalizar,
  botonCrear,
}: PropsOrdenCompraList) => {
  const columnas = [
    {
      campo: "id",
      etiqueta: "ID",
      render: (id: number) => <span style={{ color: "#0d6efd" }}>{id}</span>,
    },
    {
      campo: "nombre_articulo",
      etiqueta: "Artículo",
      render: (nombre: string) => <strong>{nombre}</strong>,
    },
    { campo: "nombre_proveedor", etiqueta: "Proveedor" },
    { campo: "cantidad", etiqueta: "Cantidad" },
    {
      campo: "estado",
      etiqueta: "Estado",
      render: (estado: string) => {
        const variants = {
          pendiente: "warning",
          enviada: "info",
          finalizada: "success",
          cancelada: "danger",
        };
        const variantKey = estado.toLowerCase() as keyof typeof variants;
        const variant = variants[variantKey] || "secondary";
        const estadoCapitalizado =
          estado.charAt(0).toUpperCase() + estado.slice(1);
        return <Badge bg={variant}>{estadoCapitalizado}</Badge>;
      },
    },
    {
      campo: "fecha_creacion",
      etiqueta: "Fecha de Creación",
      render: (fecha: string) => new Date(fecha).toLocaleDateString(),
    },
  ];

  const datosAdaptados = ordenes.map((orden) => ({
    ...orden,
    nombre_articulo: orden.articulo?.nombre ?? "N/A",
    nombre_proveedor: orden.proveedor?.nombre ?? "N/A",
  }));

  const renderAccionesOrden = (orden: OrdenCompra) => {
    const estado = orden.estado.toLowerCase();

    return (
      <div className="d-flex justify-content-start align-items-center gap-3">
        {estado === "pendiente" && (
          <>
            <div style={{ minWidth: "110px" }}>
              <Button
                variant="primary"
                className="w-100"
                size="sm"
                onClick={() => onEditar(orden)}
              >
                <PencilFill className="me-1" /> Editar
              </Button>
            </div>
            <div style={{ minWidth: "110px" }}>
              <Button
                variant="info"
                className="w-100 text-white"
                size="sm"
                onClick={() => onEnviar(orden.id)}
              >
                <Truck className="me-1" /> Enviar
              </Button>
            </div>
            <div style={{ minWidth: "110px" }}>
              <Button
                variant="danger"
                className="w-100"
                size="sm"
                onClick={() => onCancelar(orden.id)}
              >
                <XCircleFill className="me-1" /> Cancelar
              </Button>
            </div>
          </>
        )}
        {estado === "enviada" && (
          <div style={{ minWidth: "110px" }}>
            <Button
              variant="success"
              className="w-100"
              size="sm"
              onClick={() => onFinalizar(orden.id)}
            >
              <CheckCircleFill className="me-1" /> Finalizar
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <EntidadList
      titulo="Lista de Órdenes de Compra"
      datos={datosAdaptados}
      columnas={columnas}
      campoId="id"
      renderAcciones={renderAccionesOrden}
      botonCrear={botonCrear}
    />
  );
};

export default OrdenCompraList;
