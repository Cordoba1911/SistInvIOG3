// src/pages/Proveedores/ProveedoresList.tsx
import EntidadList from "../../components/EntityList";
import type { Proveedor } from "../types/proveedor";

// Definición de las propiedades del componente ProveedoresList
interface PropsProveedoresList {
  proveedores: Proveedor[];
  onEditar: (id: number) => void;
  onBaja: (id: number) => void;
  accionesPersonalizadas?: (proveedor: Proveedor) => React.ReactNode;
}

// Componente para listar proveedores
const ProveedoresList = ({
  proveedores,
  onEditar,
  onBaja,
  accionesPersonalizadas,
}: PropsProveedoresList) => {
  // Las columnas para la lista de proveedores
  const columnas = [
    { campo: "nombre", etiqueta: "Nombre" },
    { campo: "email", etiqueta: "Email" },
    { campo: "telefono", etiqueta: "Teléfono" },
    { campo: "estado", etiqueta: "Estado" },
  ];

  // Adaptar los datos para que muestren "Activo" o "Inactivo" en lugar de true/false
  const proveedoresAdaptados = proveedores.map((p) => ({
    ...p,
    estado: p.estado ? "Activo" : "Inactivo",
  }));

  // Se renderiza solo la lista, sin su propio contenedor
  return (
    <EntidadList
      titulo="Proveedores"
      datos={proveedoresAdaptados}
      columnas={columnas}
      onEditar={onEditar}
      onEliminar={onBaja}
      campoId="id"
      esActivo={(proveedor) => proveedor.estado === "Activo"}
      accionesPersonalizadas={accionesPersonalizadas}
    />
  );
};

export default ProveedoresList;
