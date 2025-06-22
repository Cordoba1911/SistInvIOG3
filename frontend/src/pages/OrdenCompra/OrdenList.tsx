import { useState } from "react";
import { Badge } from "react-bootstrap";
import EntidadList from "../../components/EntityList";
import type { OrdenCompra } from "../../types/ordenCompra";

interface PropsOrdenCompraList {
  ordenes: OrdenCompra[];
  onModificar: (id: string, nuevosDatos: Partial<OrdenCompra>) => void;
  onBaja: (id: string) => void;
}

const OrdenCompraList = ({ ordenes, onModificar, onBaja }: PropsOrdenCompraList) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);

  const columnas = [
    { campo: "id", etiqueta: "ID Orden" },
    { campo: "nombre_articulo", etiqueta: "Artículo" },
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
        const variantKey = estado as keyof typeof variants;
        const variant = variants[variantKey] || "secondary";
        return <Badge bg={variant}>{estado.toUpperCase()}</Badge>;
      },
    },
    {
      campo: "fecha_creacion",
      etiqueta: "Fecha de Creación",
      render: (fecha: string) => new Date(fecha).toLocaleDateString(),
    },
  ];

  // Adaptar los datos para el componente genérico EntidadList
  const datosAdaptados = ordenes.map((orden) => ({
    ...orden,
    nombre_articulo: orden.articulo?.nombre ?? "N/A",
    nombre_proveedor: orden.proveedor?.nombre ?? "N/A",
  }));

  // La lógica del formulario de edición se mantiene por ahora,
  // aunque no será funcional hasta que se conecten las acciones.
  const campos = [
    { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
    {
      nombre: "estado",
      etiqueta: "Estado",
      tipo: "select",
      opciones: ["pendiente", "enviada", "finalizada", "cancelada"],
    },
  ];

  const valoresIniciales = ordenSeleccionada
    ? {
        cantidad: ordenSeleccionada.cantidad?.toString() || "",
        estado: ordenSeleccionada.estado,
      }
    : {
        cantidad: "",
        estado: "pendiente",
      };

  const manejarEnvio = (datos: Record<string, string>) => {
    if (ordenSeleccionada) {
      // onModificar no está implementado aún, esto no funcionará.
    }
    setOrdenSeleccionada(null);
  };

  const manejarEditar = (id: string | number) => {
    const ordenEncontrada = ordenes.find((o) => o.id === id);
    if (ordenEncontrada) setOrdenSeleccionada(ordenEncontrada);
  };

  return (
    <div className="container mt-4">
      <EntidadList
        titulo="Órdenes de Compra"
        datos={datosAdaptados}
        columnas={columnas}
        onEditar={manejarEditar}
        onEliminar={onBaja}
        campoId="id"
      />
    </div>
  );
};

export default OrdenCompraList;
