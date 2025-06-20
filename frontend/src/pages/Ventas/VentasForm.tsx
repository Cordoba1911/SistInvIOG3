import { useState, useEffect } from "react";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import type { CreateVentaDto } from "../../types/venta";
import { ventasService } from "../../services/ventasService";
import { articulosService } from "../../services/articulosService";
import { useNavigate } from "react-router-dom";

interface PropsVentasForm {
  onAlta?: (datos: CreateVentaDto) => void;
}

const VentasForm = ({ onAlta }: PropsVentasForm) => {
  const [articulos, setArticulos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar artículos disponibles
    const cargarArticulos = async () => {
      try {
        const articulosData = await articulosService.getAll();
        setArticulos(articulosData);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
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
    try {
      // Transformar los datos para que coincidan con el DTO del backend
      const ventaData: CreateVentaDto = {
        detalles: datos.detalles.map((detalle: any) => ({
          articulo_id: parseInt(detalle.articulo_id),
          cantidad: parseInt(detalle.cantidad),
        })),
      };

      // Llamar al servicio para crear la venta
      const nuevaVenta = await ventasService.create(ventaData);

      if (onAlta) {
        onAlta(ventaData);
      }

      // Redirigir a la lista de ventas
      navigate("/ventas/admin-ventas");
    } catch (error) {
      console.error("Error al crear venta:", error);
      alert("Error al crear la venta. Por favor, intente nuevamente.");
    }
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
