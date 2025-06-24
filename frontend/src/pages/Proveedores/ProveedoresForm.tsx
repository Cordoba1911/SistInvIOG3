import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "react-bootstrap";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import AlertModal from "../../components/common/AlertModal";
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
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    variant: 'danger' as 'danger' | 'warning' | 'success' | 'info'
  });

  const navigate = useNavigate();
  const isEditMode = !!proveedorExistente;

  const showAlert = (title: string, message: string, variant: 'danger' | 'warning' | 'success' | 'info' = 'danger') => {
    setAlertModal({ show: true, title, message, variant });
  };

  const hideAlert = () => {
    setAlertModal(prev => ({ ...prev, show: false }));
    // Resetear validaciones cuando se cierre la alerta para permitir intentos posteriores
    setValidacionesAnteriores({});
  };

  // Función para verificar si un artículo ya tiene proveedor predeterminado
  const verificarProveedorPredeterminado = async (articuloId: number): Promise<boolean> => {
    try {
      const proveedores = await articulosService.getProveedoresPorArticulo(articuloId);
      return proveedores.some(proveedor => proveedor.proveedor_predeterminado === true);
    } catch (error) {
      console.error("Error al verificar proveedor predeterminado:", error);
      return false;
    }
  };

  // Estado para rastrear validaciones previas
  const [validacionesAnteriores, setValidacionesAnteriores] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<number | null>(null);

  // Función para manejar cambios en el formulario y validar proveedor predeterminado
  const handleFormChange = useCallback((datos: Record<string, any>) => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    if (datos.articulos && Array.isArray(datos.articulos)) {
      // Usar un timeout para debounce y evitar múltiples validaciones
      timeoutRef.current = window.setTimeout(async () => {
        for (let i = 0; i < datos.articulos.length; i++) {
          const articulo: any = datos.articulos[i];
          
          // Crear una clave única para este artículo en esta posición
          const claveValidacion = `${i}_${articulo.articulo_id}_${articulo.proveedor_predeterminado}`;
          
          // Si se marcó como proveedor predeterminado y no hemos validado este cambio antes
          if (articulo.proveedor_predeterminado === true && 
              articulo.articulo_id && 
              !validacionesAnteriores[claveValidacion]) {
            
            try {
              const yaEsPredeterminado = await verificarProveedorPredeterminado(parseInt(articulo.articulo_id));
              
              if (yaEsPredeterminado) {
                const articuloEncontrado = articulos.find(a => a.id === parseInt(articulo.articulo_id));
                const nombreArticulo = articuloEncontrado ? articuloEncontrado.nombre : `ID: ${articulo.articulo_id}`;
                
                // Mostrar alerta sin afectar el estado del formulario
                setAlertModal({
                  show: true,
                  title: "Artículo Ya Tiene Proveedor Predeterminado",
                  message: `El artículo "${nombreArticulo}" ya tiene otro proveedor marcado como predeterminado. Solo puede haber un proveedor predeterminado por artículo.`,
                  variant: "warning"
                });
                
                // Marcar esta validación como realizada para evitar repetirla
                setValidacionesAnteriores(prev => ({
                  ...prev,
                  [claveValidacion]: true
                }));
              }
            } catch (error) {
              console.error("Error en validación:", error);
            }
          }
        }
      }, 300); // Debounce de 300ms
    }
  }, [articulos, validacionesAnteriores]);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  const campos: CampoFormulario[] = useMemo(() => [
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
  ], [isEditMode, articulos]);

  const valoresIniciales = useMemo(() => ({
    nombre: proveedorExistente?.nombre || "",
    telefono: proveedorExistente?.telefono || "",
    email: proveedorExistente?.email || "",
    articulos: proveedorExistente?.articulos || [],
  }), [proveedorExistente]);

  const manejarEnvio = async (datos: Record<string, any>) => {
    try {
      // Validar que no haya artículos duplicados
      if (datos.articulos && datos.articulos.length > 0) {
        const articulosValidos = datos.articulos.filter((art: any) => art.articulo_id && art.precio_unitario);
        
        // Verificar artículos duplicados
        const articuloIds = articulosValidos.map((art: any) => art.articulo_id);
        const articulosUnicos = [...new Set(articuloIds)];
        
        if (articuloIds.length !== articulosUnicos.length) {
          showAlert(
            "Artículos Duplicados",
            "No se puede incluir el mismo artículo más de una vez. Por favor, elimine los artículos duplicados.",
            "warning"
          );
          return;
        }
      }

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
        showAlert(
          "Error al Procesar Proveedor",
          "Error al procesar el proveedor. Por favor, intente nuevamente.",
          "danger"
        );
      }
    }
  };

  return (
    <>
      <Form
        key={isEditMode ? `edit-${proveedorExistente?.id}` : "create"}
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        onFormChange={handleFormChange}
        titulo={isEditMode ? "Editar Proveedor" : "Agregar Proveedor"}
        textoBoton={isEditMode ? "Guardar Cambios" : "Guardar Proveedor"}
      >
        {isEditMode && onCancel && (
          <Button variant="secondary" onClick={onCancel} className="ms-2">
            Cancelar
          </Button>
        )}
      </Form>

      <AlertModal
        show={alertModal.show}
        onHide={hideAlert}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />
    </>
  );
};

export default ProveedoresForm;
