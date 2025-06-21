// src/pages/Proveedores/ProveedoresList.tsx
import { Badge } from "react-bootstrap";
import EntidadList from "../../components/EntityList";
import type { Proveedor } from "../types/proveedor";

// Definición de las propiedades del componente ProveedoresList
interface PropsProveedoresList {
  proveedores: Proveedor[];
  onEditar: (id: number) => void;
  onBaja: (id: number) => void;
  onActivar: (id: number) => void;
  accionesPersonalizadas?: (proveedor: Proveedor) => React.ReactNode;
  botonCrear?: React.ReactNode;
}

// Componente para listar proveedores
const ProveedoresList = ({
  proveedores,
  onEditar,
  onBaja,
  onActivar,
  accionesPersonalizadas,
  botonCrear,
}: PropsProveedoresList) => {
  // Las columnas para la lista de proveedores
  const columnas = [
    { campo: "nombre", etiqueta: "Nombre" },
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
      onEditar={onEditar}
      onEliminar={onBaja}
      campoId="id"
      botonCrear={botonCrear}
      esActivo={(proveedor) => proveedor.estado === "Activo"}
      renderAcciones={(proveedor) => {
        const estaActivo = proveedor.estado === "Activo";
        const commonBadgeProps = {
          as: "button",
          className: "me-1 action-badge",
          style: { cursor: "pointer" },
        };
        return (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Badge
              {...commonBadgeProps}
              bg="primary"
              onClick={() => onEditar(proveedor.id)}
            >
              Editar
            </Badge>
            {estaActivo ? (
              <Badge
                {...commonBadgeProps}
                bg="danger"
                onClick={() => onBaja(proveedor.id)}
              >
                Dar de Baja
              </Badge>
            ) : (
              <Badge
                {...commonBadgeProps}
                bg="success"
                onClick={() => onActivar(proveedor.id)}
              >
                Activar
              </Badge>
            )}
            {accionesPersonalizadas && accionesPersonalizadas(proveedor)}
          </div>
        );
      }}
    />
  );
};

export default ProveedoresList;
