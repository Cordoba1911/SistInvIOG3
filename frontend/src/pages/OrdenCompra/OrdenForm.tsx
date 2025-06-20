import { useState, useEffect } from "react";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import type {
  CreateOrdenCompraDto,
  OrdenCompraDetalle,
  UpdateOrdenCompraDto,
} from "../../types/ordenCompra";
import { ordenesService } from "../../services/ordenesService";
import { articulosService } from "../../services/articulosService";
import { proveedoresService } from "../../services/proveedoresService";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../components/common/ErrorModal";

interface PropsOrdenForm {
  onAlta?: (datos: CreateOrdenCompraDto) => void;
  ordenAEditar?: OrdenCompraDetalle | null;
  onUpdate?: (id: number, datos: UpdateOrdenCompraDto) => void;
}

const OrdenForm = ({ onAlta, ordenAEditar, onUpdate }: PropsOrdenForm) => {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const enModoEdicion = !!ordenAEditar;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [articulosData, proveedoresData] = await Promise.all([
          articulosService.getAll(),
          proveedoresService.getAll(),
        ]);
        setArticulos(articulosData);
        setProveedores(proveedoresData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("No se pudieron cargar los artículos o proveedores.");
      }
    };
    cargarDatos();
  }, []);

  const campos: CampoFormulario[] = [
    {
      nombre: "articulo_id",
      etiqueta: "Artículo",
      tipo: "select",
      requerido: true,
      deshabilitado: enModoEdicion, // Deshabilitado en modo edición
      opciones: articulos.map((a) => ({
        value: a.id,
        label: `${a.nombre} (${a.codigo})`,
      })),
    },
    {
      nombre: "proveedor_id",
      etiqueta: "Proveedor",
      tipo: "select",
      opciones: proveedores.map((p) => ({ value: p.id, label: p.nombre })),
    },
    {
      nombre: "cantidad",
      etiqueta: "Cantidad",
      tipo: "number",
      min: 1,
      step: 1,
      placeholder: "Cantidad a ordenar",
    },
  ];

  const valoresIniciales = enModoEdicion
    ? {
        articulo_id: ordenAEditar.articulo_id.toString(),
        proveedor_id: ordenAEditar.proveedor_id.toString(),
        cantidad: ordenAEditar.cantidad,
      }
    : {
        articulo_id: "",
        proveedor_id: "",
        cantidad: undefined,
      };

  const manejarEnvio = async (datos: Record<string, any>) => {
    try {
      if (enModoEdicion && onUpdate && ordenAEditar) {
        // Modo Edición
        const ordenData: UpdateOrdenCompraDto = {
          proveedor_id: datos.proveedor_id
            ? parseInt(datos.proveedor_id)
            : undefined,
          cantidad: datos.cantidad ? parseInt(datos.cantidad) : undefined,
        };
        onUpdate(ordenAEditar.id, ordenData);
      } else if (!enModoEdicion && onAlta) {
        // Modo Creación
        const ordenData: CreateOrdenCompraDto = {
          articulo_id: parseInt(datos.articulo_id),
          proveedor_id: datos.proveedor_id
            ? parseInt(datos.proveedor_id)
            : undefined,
          cantidad: datos.cantidad ? parseInt(datos.cantidad) : undefined,
        };

        await ordenesService.create(ordenData);
        onAlta(ordenData);
        navigate("/ordenes/admin-orden-compra");
      }
    } catch (err) {
      console.error("Error al procesar la orden:", err);
      if (err instanceof Error) {
        const errorMessage = err.message;
        const jsonStart = errorMessage.indexOf("{");
        if (jsonStart !== -1) {
          try {
            const jsonString = errorMessage.substring(jsonStart);
            const errorObj = JSON.parse(jsonString);
            setError(errorObj.message || "Error desconocido en la respuesta.");
          } catch (e) {
            setError(errorMessage);
          }
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <>
      <Form
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        titulo={enModoEdicion ? null : "Crear Orden de Compra"}
        textoBoton={enModoEdicion ? "Guardar Cambios" : "Crear Orden"}
      />
      <ErrorModal
        show={!!error}
        onHide={() => setError(null)}
        title={enModoEdicion ? "Error al Editar Orden" : "Error al Crear Orden"}
        message={error}
      />
    </>
  );
};

export default OrdenForm;
