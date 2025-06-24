import { Badge, Button } from "react-bootstrap";
import {
  PencilFill,
  TrashFill,
  CheckCircleFill,
} from "react-bootstrap-icons";
import EntidadList from "../../components/EntityList";
import type { Articulo } from "../../types/articulo";

interface PropsArticulosList {
  articulos: Articulo[];
  onEditar: (articulo: Articulo) => void;
  onBaja: (id: number) => void;
  onActivar: (id: number) => void;
  accionesPersonalizadas?: (articulo: Articulo) => React.ReactNode;
  botonCrear?: React.ReactNode;
  searchBar?: React.ReactNode;
}

const ArticulosList = ({
  articulos,
  onEditar,
  onBaja,
  onActivar,
  accionesPersonalizadas,
  botonCrear,
  searchBar,
}: PropsArticulosList) => {
  const formatValue = (
    value: number | string | undefined | null,
    prefix = "$"
  ) => {
    if (value === null || typeof value === "undefined" || value === "")
      return "N/A";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return `${prefix}${numValue.toFixed(2)}`;
  };

  const columnas = [
    {
      campo: "id",
      etiqueta: "ID",
      render: (id: number) => <span style={{ color: "#0d6efd" }}>{id}</span>,
    },
    { campo: "codigo", etiqueta: "Código" },
    {
      campo: "nombre",
      etiqueta: "Nombre",
      render: (nombre: string) => <strong>{nombre}</strong>,
    },
    { campo: "descripcion", etiqueta: "Descripción" },
    { campo: "stock_actual", etiqueta: "Stock" },
    {
      campo: "modelo_inventario",
      etiqueta: "Modelo",
      render: (modelo: string) => {
        if (!modelo) return <Badge pill bg="light" text="dark">N/A</Badge>;

        const textoMapeado = modelo
          .split("_")
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(" ");

        return (
          <Badge pill bg="secondary" text="white">
            {textoMapeado}
          </Badge>
        );
      },
    },
    {
      campo: "costo_compra",
      etiqueta: "Costo Compra",
      render: (valor: number) => formatValue(valor),
    },
    {
      campo: "estado",
      etiqueta: "Estado",
      render: (estado: string) => (
        <Badge pill bg={estado === "Activo" ? "success" : "secondary"}>
          {estado}
        </Badge>
      ),
    },
  ];

  // Adaptar los datos para que muestren "Activo" o "Inactivo" en lugar de true/false
  const articulosAdaptados = articulos.map((a) => ({
    ...a,
    estado: a.estado ? "Activo" : "Inactivo",
  }));

  return (
    <EntidadList
      titulo="Lista de Artículos"
      datos={articulosAdaptados}
      columnas={columnas}
      onEditar={(id) => {
        const articuloOriginal = articulos.find(a => a.id === Number(id));
        if (articuloOriginal) onEditar(articuloOriginal);
      }}
      onEliminar={(id) => onBaja(Number(id))}
      campoId="id"
      botonCrear={botonCrear}
      searchBar={searchBar}
      esActivo={(articulo) => articulo.estado === "Activo"}
      renderAcciones={(articuloAdaptado) => {
        const estaActivo = articuloAdaptado.estado === "Activo";
        
        const articuloOriginal = articulos.find(
          (a) => a.id === articuloAdaptado.id,
        );

        return (
          <div className="d-flex justify-content-start align-items-center gap-3">
            <div style={{ minWidth: "140px" }}>
              <Button
                variant="primary"
                size="sm"
                className="w-100"
                onClick={() => {
                  if (articuloOriginal) onEditar(articuloOriginal);
                }}
              >
                <PencilFill color="white" className="me-1" />
                Editar
              </Button>
            </div>

            <div style={{ minWidth: "140px" }}>
              {estaActivo ? (
                <Button
                  variant="danger"
                  size="sm"
                  className="w-100"
                  onClick={() => onBaja(articuloAdaptado.id)}
                >
                  <TrashFill color="white" className="me-1" />
                  Dar de Baja
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  className="w-100"
                  onClick={() => onActivar(articuloAdaptado.id)}
                >
                  <CheckCircleFill color="white" className="me-1" />
                  Activar
                </Button>
              )}
            </div>

            {accionesPersonalizadas &&
              articuloOriginal &&
              accionesPersonalizadas(articuloOriginal)}
          </div>
        );
      }}
    />
  );
};

export default ArticulosList;