import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import type { CreateProveedorDto, Proveedor } from "../../types/proveedor";
import { proveedoresService } from "../../services/proveedoresService";
import { articulosService } from "../../services/articulosService";
import { useNavigate } from "react-router-dom";

interface PropsProveedoresForm {
  onSubmit: (datos: CreateProveedorDto, id?: number) => void;
  proveedorExistente?: Proveedor | null;
  onCancel?: () => void;
  onError?: (error: any) => void;
}

const ProveedoresForm = ({
  onSubmit,
  proveedorExistente,
  onCancel,
  onError,
}: PropsProveedoresForm) => {
  const [articulos, setArticulos] = useState<any[]>([]);
  const navigate = useNavigate();
  const isEditMode = !!proveedorExistente;

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
      nombre: "nombre",
      etiqueta: "Nombre",
      tipo: "text",
      requerido: true,
      placeholder: "Ingrese el nombre del proveedor",
    },
    {
      nombre: "telefono",
      etiqueta: "Teléfono",
      tipo: "tel",
      placeholder: "Ingrese el número de teléfono",
    },
    {
      nombre: "email",
      etiqueta: "Email",
      tipo: "email",
      placeholder: "Ingrese el correo electrónico",
    },
    ...(isEditMode
      ? []
      : [
          {
            nombre: "articulos",
            etiqueta: "Artículos",
            tipo: "array",
            arrayConfig: {
              campos: [
                {
                  nombre: "articulo_id",
                  etiqueta: "Artículo",
                  tipo: "select",
                  requerido: true,
                  opciones: articulos.map((a) => ({
                    value: a.id,
                    label: a.nombre,
                  })),
                },
                {
                  nombre: "precio_unitario",
                  etiqueta: "Precio Unitario",
                  tipo: "number",
                  requerido: true,
                  min: 0,
                  step: 0.01,
                },
                {
                  nombre: "demora_entrega",
                  etiqueta: "Demora de Entrega (días)",
                  tipo: "number",
                  min: 0,
                  step: 1,
                },
                {
                  nombre: "cargos_pedido",
                  etiqueta: "Cargos de Pedido",
                  tipo: "number",
                  min: 0,
                  step: 0.01,
                },
                {
                  nombre: "proveedor_predeterminado",
                  etiqueta: "Proveedor Predeterminado",
                  tipo: "checkbox",
                },
              ],
              titulo: "Artículo",
              botonAgregar: "Agregar Artículo",
              botonEliminar: "Eliminar Artículo",
            },
          },
        ]),
  ];

  const valoresIniciales = {
    nombre: proveedorExistente?.nombre || "",
    telefono: proveedorExistente?.telefono || "",
    email: proveedorExistente?.email || "",
    articulos: proveedorExistente?.articulos || [],
  };

  const manejarEnvio = async (datos: Record<string, any>) => {
    try {
      const proveedorData: CreateProveedorDto = {
        nombre: datos.nombre,
        telefono: datos.telefono || undefined,
        email: datos.email || undefined,
        articulos: (datos.articulos || [])
          .filter((art: any) => art.articulo_id && art.precio_unitario)
          .map((art: any) => ({
            articulo_id: parseInt(art.articulo_id, 10),
            precio_unitario: parseFloat(art.precio_unitario),
            demora_entrega: art.demora_entrega
              ? parseInt(art.demora_entrega, 10)
              : undefined,
            cargos_pedido: art.cargos_pedido
              ? parseFloat(art.cargos_pedido)
              : undefined,
            proveedor_predeterminado: art.proveedor_predeterminado || false,
          })),
      };

      onSubmit(proveedorData, proveedorExistente?.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error en el formulario de proveedor:", errorMessage);
      if (onError) {
        onError(error);
      } else {
        alert("Error al procesar el formulario. Por favor, intente nuevamente.");
      }
    }
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo={isEditMode ? "Editar Proveedor" : "Agregar Proveedor"}
      textoBoton={isEditMode ? "Guardar Cambios" : "Guardar Proveedor"}
    >
      {isEditMode && onCancel && (
        <Button variant="secondary" onClick={onCancel} className="ms-2">
          Cancelar
        </Button>
      )}
    </Form>
  );
};

export default ProveedoresForm;
