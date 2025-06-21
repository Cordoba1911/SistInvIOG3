import { useState, useEffect } from "react";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import type { CreateVentaDto } from "../../types/venta";
import { articulosService } from "../../services/articulosService";

interface VentasFormProps {
  onSubmit: (datos: CreateVentaDto) => Promise<void>;
}

const VentasForm = ({ onSubmit }: VentasFormProps) => {
  const [articulos, setArticulos] = useState<any[]>([]);
  // El error se manejará en el router
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        const articulosData = await articulosService.getAll();
        setArticulos(articulosData);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
        // Opcional: podrías querer pasar este error al padre
      }
    };
    cargarArticulos();
  }, []);

  const campos: CampoFormulario[] = [
    {
      nombre: "detalles",
      etiqueta: "Detalles de Venta",
      tipo: "array",
      requerido: true,
      arrayConfig: {
        campos: [
          {
            nombre: "articulo_id",
            etiqueta: "Artículo",
            tipo: "select",
            requerido: true,
            opciones: articulos.map((a) => ({
              value: a.id,
              label: `${a.nombre} (${a.codigo})`,
            })),
          },
          {
            nombre: "cantidad",
            etiqueta: "Cantidad",
            tipo: "number",
            requerido: true,
            min: 1,
            step: 1,
          },
        ],
        titulo: "Artículo",
        botonAgregar: "Agregar Artículo",
        botonEliminar: "Eliminar Artículo",
      },
    },
  ];

  const valoresIniciales = {
    detalles: [],
  };

  const manejarEnvio = async (datos: Record<string, any>) => {
    // No se necesita try-catch aquí, el router lo manejará.
    const ventaData: CreateVentaDto = {
      detalles: datos.detalles.map((detalle: any) => ({
        articulo_id: parseInt(detalle.articulo_id),
        cantidad: parseInt(detalle.cantidad),
      })),
    };

    // La lógica de creación y navegación se maneja en el componente padre.
    await onSubmit(ventaData);
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Registrar Venta"
      textoBoton="Registrar Venta"
    />
  );
};

export default VentasForm;
