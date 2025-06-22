// src/pages/Proveedores/ProveedoresList.tsx
import EntidadList from "../../components/EntityList";
import type { Proveedor } from "../../types/proveedor";

// Tipo para datos adaptados para EntidadList
interface ProveedorAdaptado extends Omit<Proveedor, 'id' | 'estado'> {
  id: string;
  estado: string;
}

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
  const proveedoresAdaptados: ProveedorAdaptado[] = proveedores.map((p) => ({
    ...p,
    id: p.id.toString(), // Convertir ID a string para EntidadList
    estado: p.estado ? "Activo" : "Inactivo",
  }));

  // Se renderiza solo la lista, sin su propio contenedor
  return (
    <EntidadList<ProveedorAdaptado>
      titulo="Proveedores"
      datos={proveedoresAdaptados}
      columnas={columnas}
      onEditar={(id: string) => onEditar(parseInt(id))} // Convertir de vuelta a number
      onEliminar={(id: string) => onBaja(parseInt(id))} // Convertir de vuelta a number
      campoId="id"
      esActivo={(proveedor: ProveedorAdaptado) => proveedor.estado === "Activo"}
    />
  );
};

export default ProveedoresList;
