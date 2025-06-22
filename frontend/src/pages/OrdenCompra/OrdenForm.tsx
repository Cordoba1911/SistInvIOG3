import { useState, useEffect } from "react";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import type {
  CreateOrdenCompraDto,
  OrdenCompra,
  UpdateOrdenCompraDto,
} from "../../types/ordenCompra";
import { ordenesService } from "../../services/ordenesService";
import { articulosService } from "../../services/articulosService";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../components/common/ErrorModal";
import WarningModal from "../../components/common/WarningModal";
import type { Articulo } from "../../types/articulo";
import type { ProveedorArticuloResponseDto } from "../../types/proveedor";

interface PropsOrdenForm {
  onAlta?: (datos: CreateOrdenCompraDto) => void;
  ordenAEditar?: OrdenCompra | null;
  onUpdate?: (id: number, datos: UpdateOrdenCompraDto) => void;
}

const OrdenForm = ({ onAlta, ordenAEditar, onUpdate }: PropsOrdenForm) => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [proveedoresDelArticulo, setProveedoresDelArticulo] = useState<
    ProveedorArticuloResponseDto[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<CreateOrdenCompraDto | null>(null);
  const navigate = useNavigate();
  const enModoEdicion = !!ordenAEditar;

  // Estado para manejar los valores del formulario
  const [formValues, setFormValues] = useState<Record<string, any>>({
    articulo_id: ordenAEditar?.articulo_id.toString() || "",
    proveedor_id: ordenAEditar?.proveedor_id?.toString() || "",
    cantidad: ordenAEditar?.cantidad || undefined,
  });

  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        const articulosData = await articulosService.getAll();
        setArticulos(articulosData);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
        setError("No se pudieron cargar los artículos.");
      }
    };
    cargarArticulos();
  }, []);

  const handleFormChange = async (nuevosValores: Record<string, any>) => {
    const articuloIdActual = formValues.articulo_id;
    const nuevoArticuloId = nuevosValores.articulo_id;

    setFormValues(nuevosValores);

    if (nuevoArticuloId && nuevoArticuloId !== articuloIdActual) {
      try {
        setProveedoresDelArticulo([]); // Limpiar proveedores anteriores
        
        // Obtener los proveedores del artículo
        const proveedoresData = await articulosService.getProveedoresPorArticulo(
          parseInt(nuevoArticuloId)
        );
        setProveedoresDelArticulo(proveedoresData);

        // Obtener el artículo completo para acceder al lote óptimo
        const articuloSeleccionado = articulos.find(
          (a) => a.id === parseInt(nuevoArticuloId)
        );

        const proveedorPredeterminado = proveedoresData.find(
          (p) => p.proveedor_predeterminado
        );

        // Actualizar el valor del proveedor y la cantidad en el formulario
        setFormValues((prev) => ({
          ...prev,
          proveedor_id: proveedorPredeterminado
            ? proveedorPredeterminado.proveedor_id.toString()
            : "",
          cantidad: articuloSeleccionado?.lote_optimo || undefined,
        }));
      } catch (error) {
        console.error("Error al cargar proveedores por artículo:", error);
        setError("No se pudieron cargar los proveedores para el artículo seleccionado.");
      }
    }
  };

  const campos: CampoFormulario[] = [
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
      nombre: "proveedor_id",
      etiqueta: "Proveedor",
      tipo: "select",
      requerido: true,
      opciones: proveedoresDelArticulo.map((p) => ({
        value: p.proveedor_id,
        label: p.proveedor_predeterminado
          ? `${p.nombre} (Proveedor predeterminado)`
          : p.nombre,
      })),
      // Deshabilitar si no hay artículo seleccionado o si se está en modo edición
      disabled: !formValues.articulo_id || enModoEdicion,
    },
    {
      nombre: "cantidad",
      etiqueta: "Cantidad",
      tipo: "number",
      min: 1,
      step: 1,
      placeholder: formValues.articulo_id 
        ? articulos.find(a => a.id === parseInt(formValues.articulo_id))?.lote_optimo 
          ? `Sugerido: ${articulos.find(a => a.id === parseInt(formValues.articulo_id))?.lote_optimo} (lote óptimo)`
          : "Cantidad a ordenar"
        : "Cantidad a ordenar",
      descripcion: formValues.articulo_id 
        ? articulos.find(a => a.id === parseInt(formValues.articulo_id))?.lote_optimo 
          ? `Se sugiere el lote óptimo de ${articulos.find(a => a.id === parseInt(formValues.articulo_id))?.lote_optimo} unidades`
          : "El artículo no tiene un lote óptimo calculado para sugerir"
        : "Seleccione un artículo para ver sugerencias",
    },
  ];

  const manejarEnvio = async (datos: Record<string, any>) => {
    // En modo edición, el comportamiento no cambia
    if (enModoEdicion && onUpdate && ordenAEditar) {
      const ordenData: UpdateOrdenCompraDto = {
        proveedor_id: datos.proveedor_id
          ? parseInt(datos.proveedor_id)
          : undefined,
        cantidad: datos.cantidad ? parseInt(datos.cantidad) : undefined,
      };
      onUpdate(ordenAEditar.id, ordenData);
      return;
    }

    // Solo para modo creación
    if (!enModoEdicion && onAlta) {
      const ordenData: CreateOrdenCompraDto = {
        articulo_id: parseInt(datos.articulo_id),
        proveedor_id: datos.proveedor_id
          ? parseInt(datos.proveedor_id)
          : undefined,
        cantidad: datos.cantidad ? parseInt(datos.cantidad) : undefined,
      };

      try {
        await ordenesService.create(ordenData, false); // Intento inicial
        onAlta(ordenData);
        navigate("/ordenes/admin-orden-compra");
      } catch (err) {
        if (err instanceof Error) {
          try {
            // El error que viene de api.ts ahora contiene el objeto JSON stringificado
            const errorBody = JSON.parse(err.message);

            if (errorBody && errorBody.warning) {
              // Si es la advertencia específica, mostramos el modal
              setWarning(errorBody.warning);
              setPendingOrder(ordenData);
            } else {
              // Si es otro error del backend (ej: 404, 500)
              setError(errorBody.message || "Ocurrió un error inesperado.");
            }
          } catch (jsonError) {
            // Si el error no contenía un JSON válido
            setError(err.message);
          }
        } else {
          // Por si acaso el error no es una instancia de Error
          setError("Ocurrió un error desconocido.");
        }
      }
    }
  };

  const handleWarningConfirm = async () => {
    if (pendingOrder && onAlta) {
      try {
        await ordenesService.create(pendingOrder, true); // Segundo intento, forzado
        onAlta(pendingOrder);
        navigate("/ordenes/admin-orden-compra");
      } catch (err) {
        if (err instanceof Error) {
          try {
            const errorBody = JSON.parse(err.message);
            setError(errorBody.message || "Ocurrió un error al crear la orden.");
          } catch (jsonError) {
            setError(err.message);
          }
        } else {
          setError("Ocurrió un error desconocido.");
        }
      } finally {
        setWarning(null);
        setPendingOrder(null);
      }
    }
  };

  const handleWarningCancel = () => {
    setWarning(null);
    setPendingOrder(null);
  };

  return (
    <>
      <Form
        campos={campos}
        valoresIniciales={formValues}
        onFormChange={handleFormChange}
        onSubmit={manejarEnvio}
        titulo={enModoEdicion ? undefined : "Crear Orden de Compra"}
        textoBoton={enModoEdicion ? "Guardar Cambios" : "Crear Orden"}
      />
      <ErrorModal
        show={!!error}
        onHide={() => setError(null)}
        title={enModoEdicion ? "Error al Editar Orden" : "Error al Crear Orden"}
        message={error}
      />
      <WarningModal
        show={!!warning}
        onHide={handleWarningCancel}
        onConfirm={handleWarningConfirm}
        title="Advertencia - Punto de Pedido"
        message={warning}
        confirmText="Continuar con la Orden"
      />
    </>
  );
};

export { OrdenForm };
