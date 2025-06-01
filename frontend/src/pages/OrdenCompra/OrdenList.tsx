import { useState } from "react";
import Form from "../../components/Form";
import EntidadList from "../../components/EntityList";
import type { OrdenCompra } from "../../routes/OrdenCompraRoutes";
import { Button } from "react-bootstrap";

interface PropsOrdenCompraList {
  ordenes: OrdenCompra[];
  onModificar: (id: string, nuevosDatos: Partial<OrdenCompra>) => void;
  onBaja: (id: string) => void;
}

const OrdenCompraList = ({ ordenes, onModificar, onBaja }: PropsOrdenCompraList) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);

  // Aquí puedes definir los campos que quieres mostrar en la lista de órdenes de compra
  const campos = [
    { nombre: "nombre", etiqueta: "Nombre", requerido: true },
    { nombre: "proveedor", etiqueta: "Proveedor", requerido: true },
    { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
    { nombre: "estado", etiqueta: "Estado", tipo: "select", opciones: ["Pendiente", "Enviada", "Finalizada", "Cancelada"] },
    { nombre: "fecha_creacion", etiqueta: "Fecha de Creación", tipo: "date" },
    { nombre: "fecha_envio", etiqueta: "Fecha de Envío", tipo: "date" },
    { nombre: "fecha_finalizacion", etiqueta: "Fecha de Finalización", tipo: "date" },
  ];

  // Las columnas para la lista de órdenes de compra
  const columnas = [
    { campo: "nombre", etiqueta: "Nombre" },
    { campo: "proveedor", etiqueta: "Proveedor" },
    { campo: "cantidad", etiqueta: "Cantidad" },
    { campo: "estado", etiqueta: "Estado" },
    { campo: "fecha_creacion", etiqueta: "Fecha de Creación" },
    { campo: "fecha_envio", etiqueta: "Fecha de Envío" },
    { campo: "fecha_finalizacion", etiqueta: "Fecha de Finalización" },
  ];

  // Aquí puedes definir los valores iniciales o el estado de las órdenes
  const valoresIniciales = ordenSeleccionada
    ? {
        nombre: ordenSeleccionada.nombre,
        proveedor: ordenSeleccionada.proveedor,
        cantidad: ordenSeleccionada.cantidad.toString(),
        estado: ordenSeleccionada.estado,
        fecha_creacion: ordenSeleccionada.fecha_creacion,
        fecha_envio:
          ordenSeleccionada.fecha_envio || "",
        fecha_finalizacion:
          ordenSeleccionada.fecha_finalizacion || "",
      }
    : {
        nombre: "",
        proveedor: "",
        cantidad: "",
        estado: "",
        fecha_creacion: "",
        fecha_envio: "",
        fecha_finalizacion: "",
      };

  // Función para manejar el envío del formulario
  const manejarEnvio = (datos: Record<string, string>) => {
    if (ordenSeleccionada) {
      onModificar(ordenSeleccionada.id, {
        nombre: datos.nombre,
        proveedor: datos.proveedor,
        cantidad: parseInt(datos.cantidad, 10) || 0,
        estado: datos.estado as OrdenCompra["estado"],
        fecha_creacion: datos.fecha_creacion,
        fecha_envio: datos.fecha_envio || undefined,
        fecha_finalizacion: datos.fecha_finalizacion || undefined,
      });
    }
    // Limpia el formulario después de guardar
    setOrdenSeleccionada(null);
  } 

  // Función para manejar la edición de una orden
  const manejarEditar = (id: string) => {
    const ordenEncontrada = ordenes.find((o) => o.id === id);
    if (ordenEncontrada) setOrdenSeleccionada(ordenEncontrada);
  };

  // Función para cambiar orden de estado
  const cambiarEstado = (id: string, nuevoEstado: OrdenCompra["estado"]) => {
  const orden = ordenes.find((o) => o.id === id);
  if (!orden) return;

  // Reglas de transición de estado
  if (orden.estado === "Pendiente") {
    if (nuevoEstado === "Cancelada") {
      if (!confirm("¿Estás seguro de cancelar esta orden?")) return;
    }
    if (nuevoEstado === "Enviada") {
      onModificar(id, {
        estado: "Enviada",
        fecha_envio: new Date().toISOString().split("T")[0],
      });
      return;
    }
  }

  if (orden.estado === "Enviada" && nuevoEstado === "Finalizada") {
    // ⚠️ Lógica de inventario y punto de pedido: se asume backend
    onModificar(id, {
      estado: "Finalizada",
      fecha_finalizacion: new Date().toISOString().split("T")[0],
    });

    return;
  }

  if (nuevoEstado === "Cancelada") {
    onModificar(id, { estado: "Cancelada" });
  }
};


  return (
    <div className="container mt-4">
      <Form
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        titulo="Administrar Orden de Compra"
        textoBoton="Guardar"
      />
      <EntidadList
  titulo="Órdenes de Compra"
  datos={ordenes}
  columnas={columnas}
  onEditar={manejarEditar}
  onEliminar={onBaja}
  campoId="id"
  accionesPersonalizadas={(orden) => (
    <div className="d-flex gap-1 justify-content-center flex-wrap">
      {orden.estado === "Pendiente" && (
        <>
          <Button variant="warning" size="sm" onClick={() => cambiarEstado(orden.id, "Enviada")}>
            Enviar
          </Button>
          <Button variant="secondary" size="sm" onClick={() => cambiarEstado(orden.id, "Cancelada")}>
            Cancelar
          </Button>
        </>
      )}
      {orden.estado === "Enviada" && (
        <Button variant="success" size="sm" onClick={() => cambiarEstado(orden.id, "Finalizada")}>
          Finalizar
        </Button>
      )}
    </div>
  )}
/>

    </div>
  );
}
export default OrdenCompraList;
