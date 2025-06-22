// src/pages/Proveedores/ProveedoresList.tsx
import { Badge, Button } from "react-bootstrap";
import { PencilFill, TrashFill, CheckCircleFill } from "react-bootstrap-icons";
import EntidadList from "../../components/EntityList";
import type { Proveedor } from "../../types/proveedor";

// Definición de las propiedades del componente ProveedoresList
interface PropsProveedoresList {
  proveedores: Proveedor[];
  onEditar: (id: number) => void;
  onBaja: (id: number) => void;
  onActivar: (id: number) => void;
  accionesPersonalizadas?: (proveedor: Proveedor) => React.ReactNode;
  botonCrear?: React.ReactNode;
  searchBar?: React.ReactNode;
}

// Componente para listar proveedores
const ProveedoresList = ({
  proveedores,
  onEditar,
  onBaja,
  onActivar,
  accionesPersonalizadas,
  botonCrear,
  searchBar,
}: PropsProveedoresList) => {
  // Las columnas para la lista de proveedores
  const columnas = [
    {
      campo: "id",
      etiqueta: "ID",
      render: (id: number) => (
        <span style={{ color: "#0d6efd" }}>
          {id}
        </span>
      ),
    },
    {
      campo: "nombre",
      etiqueta: "Nombre",
      render: (nombre: string) => <strong>{nombre}</strong>,
    },
    { campo: "email", etiqueta: "Email" },
    { campo: "telefono", etiqueta: "Teléfono" },
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
  const proveedoresAdaptados = proveedores.map((p) => ({
    ...p,
    estado: p.estado ? "Activo" : "Inactivo",
  }));

  // Se renderiza solo la lista, sin su propio contenedor
  return (
    <EntidadList
      titulo="Lista de Proveedores"
      datos={proveedoresAdaptados}
      columnas={columnas}
      onEditar={(id) => onEditar(Number(id))}
      onEliminar={(id) => onBaja(Number(id))}
      campoId="id"
      botonCrear={botonCrear}
      searchBar={searchBar}
      esActivo={(proveedor) => proveedor.estado === "Activo"}
      renderAcciones={(proveedorAdaptado) => {
        const estaActivo = proveedorAdaptado.estado === "Activo";
        const commonBadgeProps = {
          as: "button" as const,
          style: { cursor: "pointer" },
        };

        const proveedorOriginal = proveedores.find(
          (p) => p.id === proveedorAdaptado.id,
        );

        return (
          <div className="d-flex justify-content-start align-items-center gap-3">
            <div style={{ minWidth: "140px" }}>
              <Button
                variant="primary"
                size="sm"
                className="w-100"
                onClick={() => onEditar(proveedorAdaptado.id)}
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
                  onClick={() => onBaja(proveedorAdaptado.id)}
                >
                  <TrashFill color="white" className="me-1" />
                  Dar de Baja
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  className="w-100"
                  onClick={() => onActivar(proveedorAdaptado.id)}
                >
                  <CheckCircleFill color="white" className="me-1" />
                  Activar
                </Button>
              )}
            </div>

            {accionesPersonalizadas &&
              proveedorOriginal &&
              accionesPersonalizadas(proveedorOriginal)}
          </div>
        );
      }}
    />
  );
};

export default ProveedoresList;
