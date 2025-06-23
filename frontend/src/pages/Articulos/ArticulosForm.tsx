import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "react-bootstrap";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import AlertModal from "../../components/common/AlertModal";
import InventoryFieldsHelp from "../../components/common/InventoryFieldsHelp";
import type { Articulo, CreateArticuloDto, UpdateArticuloInput } from "../../types/articulo";
import { articulosService } from "../../services/articulosService";
import { proveedoresService } from "../../services/proveedoresService";
import { useNavigate } from "react-router-dom";

interface PropsArticulosForm {
  onAlta?: () => void;
  articuloAEditar?: Articulo | null;
  onUpdate?: (id: number, data: UpdateArticuloInput) => void;
  onCancel?: () => void;
}

const ArticulosForm = ({ onAlta, articuloAEditar, onUpdate, onCancel }: PropsArticulosForm) => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [modeloInventario, setModeloInventario] = useState<string>(
    articuloAEditar?.modelo_inventario || "lote_fijo"
  );
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    variant: 'danger' as 'danger' | 'warning' | 'success' | 'info'
  });
  const navigate = useNavigate();
  const enModoEdicion = !!articuloAEditar;

  // Estados para validación en tiempo real
  const [validacionesAnteriores, setValidacionesAnteriores] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<number | null>(null);

  const showAlert = (title: string, message: string, variant: 'danger' | 'warning' | 'success' | 'info' = 'danger') => {
    setAlertModal({ show: true, title, message, variant });
  };

  const hideAlert = () => {
    setAlertModal(prev => ({ ...prev, show: false }));
    // Resetear validaciones cuando se cierre la alerta para permitir intentos posteriores
    setValidacionesAnteriores({});
  };

  // Función para verificar si un proveedor ya es predeterminado en otros artículos
  const verificarProveedorPredeterminado = async (proveedorId: number): Promise<boolean> => {
    try {
      const articulos = await proveedoresService.getArticulos(proveedorId);
      return articulos.some(articulo => articulo.proveedor_predeterminado === true);
    } catch (error) {
      console.error("Error al verificar proveedor predeterminado:", error);
      return false;
    }
  };

  // Función para manejar cambios en el formulario y validar proveedor predeterminado
  const handleFormChange = useCallback((datos: Record<string, any>) => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Actualizar modelo de inventario si cambió
    if (datos.modelo_inventario !== modeloInventario) {
      setModeloInventario(datos.modelo_inventario || "lote_fijo");
    }
    
    if (datos.proveedores && Array.isArray(datos.proveedores)) {
      // Usar un timeout para debounce y evitar múltiples validaciones
      timeoutRef.current = window.setTimeout(async () => {
        for (let i = 0; i < datos.proveedores.length; i++) {
          const proveedor: any = datos.proveedores[i];
          
          // Crear una clave única para este proveedor en esta posición
          const claveValidacion = `${i}_${proveedor.proveedor_id}_${proveedor.proveedor_predeterminado}`;
          
          // Si se marcó como proveedor predeterminado y no hemos validado este cambio antes
          if (proveedor.proveedor_predeterminado === "true" && 
              proveedor.proveedor_id && 
              !validacionesAnteriores[claveValidacion]) {
            
            try {
              const yaEsPredeterminado = await verificarProveedorPredeterminado(parseInt(proveedor.proveedor_id));
              
              if (yaEsPredeterminado) {
                const proveedorEncontrado = proveedores.find(p => p.id === parseInt(proveedor.proveedor_id));
                const nombreProveedor = proveedorEncontrado ? proveedorEncontrado.nombre : `ID: ${proveedor.proveedor_id}`;
                
                // Mostrar alerta sin afectar el estado del formulario
                setAlertModal({
                  show: true,
                  title: "Proveedor Ya Es Predeterminado",
                  message: `El proveedor "${nombreProveedor}" ya está marcado como predeterminado para otro artículo. Solo puede ser predeterminado para un artículo a la vez.`,
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
  }, [proveedores, validacionesAnteriores, modeloInventario]);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const proveedoresData = await proveedoresService.getActivos();
        setProveedores(proveedoresData);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
    cargarProveedores();
  }, []);

  const campos: CampoFormulario[] = useMemo(() => [
    {
      nombre: "codigo",
      etiqueta: "Código",
      tipo: "text",
      requerido: true,
      placeholder: "Ingrese el código del artículo",
    },
    {
      nombre: "nombre",
      etiqueta: "Nombre",
      tipo: "text",
      requerido: true,
      placeholder: "Ingrese el nombre del artículo",
    },
    {
      nombre: "descripcion",
      etiqueta: "Descripción",
      tipo: "textarea",
      requerido: true,
      placeholder: "Ingrese la descripción del artículo",
    },
    {
      nombre: "demanda",
      etiqueta: "Demanda Anual",
      tipo: "number",
      min: 0,
      step: 1,
      placeholder: "Demanda anual en unidades",
    },
    {
      nombre: "costo_almacenamiento",
      etiqueta: "Costo de Almacenamiento",
      tipo: "number",
      min: 0,
      step: 0.01,
      placeholder: "Costo por unidad almacenada",
    },
    {
      nombre: "costo_pedido",
      etiqueta: "Costo de Pedido",
      tipo: "number",
      min: 0,
      step: 0.01,
      placeholder: "Costo fijo por pedido",
    },
    {
      nombre: "costo_compra",
      etiqueta: "Costo de Compra",
      tipo: "number",
      min: 0,
      step: 0.01,
      placeholder: "Costo unitario de compra",
    },
    {
      nombre: "precio_venta",
      etiqueta: "Precio de Venta",
      tipo: "number",
      min: 0,
      step: 0.01,
      placeholder: "Precio unitario de venta",
    },
    {
      nombre: "modelo_inventario",
      etiqueta: "Modelo de Inventario",
      tipo: "select",
      opciones: [
        { value: "lote_fijo", label: "Lote Fijo" },
        { value: "periodo_fijo", label: "Período Fijo" },
      ],
    },
    {
      nombre: "nivel_servicio",
      etiqueta: "Nivel de Servicio (%)",
      tipo: "number",
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: "Ej. 95 para 95%",
    },
    {
      nombre: "desviacion_estandar",
      etiqueta: "Desviación Estándar de la Demanda Diaria",
      tipo: "number",
      min: 0,
      step: 0.01,
      placeholder: "Desviación estándar de la demanda diaria",
    },
    // Campo condicional: solo se muestra para modelo de período fijo
    ...(modeloInventario === "periodo_fijo" ? [{
      nombre: "intervalo_revision",
      etiqueta: "Intervalo de Revisión (días)",
      tipo: "number" as const,
      min: 1,
      step: 1,
      requerido: true,
      placeholder: "Días entre revisiones de inventario",
      descripcion: "Frecuencia con la que se revisa el inventario en el modelo de período fijo",
    }] : []),
    {
      nombre: "stock_actual",
      etiqueta: "Stock Actual",
      tipo: "number",
      min: 0,
      step: 1,
      placeholder: "Cantidad actual en inventario",
    },
    {
      nombre: "proveedores",
      etiqueta: "Proveedores",
      tipo: "array",
      requerido: !enModoEdicion,
      arrayConfig: {
        campos: [
          {
            nombre: "proveedor_id",
            etiqueta: "Proveedor",
            tipo: "select",
            requerido: true,
            opciones: proveedores.map((p) => ({
              value: p.id,
              label: p.nombre,
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
            tipo: "select",
            opciones: [
              { value: "true", label: "Sí" },
              { value: "false", label: "No" },
            ],
          },
        ],
        titulo: "Proveedor",
        botonAgregar: "Agregar Proveedor",
        botonEliminar: "Eliminar Proveedor",
      },
    },
  ], [enModoEdicion, proveedores, modeloInventario]);

  const valoresIniciales = useMemo(() => enModoEdicion
    ? {
        codigo: articuloAEditar.codigo,
        nombre: articuloAEditar.nombre,
        descripcion: articuloAEditar.descripcion,
        demanda: articuloAEditar.demanda,
        costo_almacenamiento: articuloAEditar.costo_almacenamiento,
        costo_pedido: articuloAEditar.costo_pedido,
        costo_compra: articuloAEditar.costo_compra,
        precio_venta: articuloAEditar.precio_venta,
        modelo_inventario: articuloAEditar.modelo_inventario,
        nivel_servicio: articuloAEditar.nivel_servicio ? articuloAEditar.nivel_servicio * 100 : undefined,
        desviacion_estandar: articuloAEditar.desviacion_estandar,
        intervalo_revision: articuloAEditar.intervalo_revision,
        stock_actual: articuloAEditar.stock_actual,
        proveedores: articuloAEditar.proveedores?.map(p => ({
          proveedor_id: p.proveedor_id,
          precio_unitario: p.precio_unitario,
          demora_entrega: p.demora_entrega,
          cargos_pedido: p.cargos_pedido,
          proveedor_predeterminado: p.proveedor_predeterminado ? "true" : "false"
        })) || []
      }
    : {
        codigo: "",
        nombre: "",
        descripcion: "",
        demanda: undefined,
        costo_almacenamiento: undefined,
        costo_pedido: undefined,
        costo_compra: undefined,
        precio_venta: undefined,
        modelo_inventario: "lote_fijo",
        nivel_servicio: undefined,
        desviacion_estandar: undefined,
        intervalo_revision: undefined,
        stock_actual: 0,
        proveedores: [],
      }, [enModoEdicion, articuloAEditar]);

  const manejarEnvio = async (datos: Record<string, any>) => {
    try {
      // Validar proveedores predeterminados si hay proveedores
      if (datos.proveedores && datos.proveedores.length > 0) {
        const proveedoresPredeterminados = datos.proveedores.filter(
          (prov: any) => prov.proveedor_predeterminado === "true"
        );
        
        if (proveedoresPredeterminados.length > 1) {
          showAlert(
            "Proveedor Predeterminado Duplicado",
            "Solo puede haber un proveedor predeterminado por artículo. Por favor, seleccione únicamente un proveedor como predeterminado.",
            "warning"
          );
          return;
        }

        // Validar que no haya proveedores duplicados
        const proveedorIds = datos.proveedores.map((prov: any) => prov.proveedor_id);
        const proveedoresUnicos = [...new Set(proveedorIds)];
        
        if (proveedorIds.length !== proveedoresUnicos.length) {
          showAlert(
            "Proveedores Duplicados",
            "No se puede incluir el mismo proveedor más de una vez. Por favor, elimine los proveedores duplicados.",
            "warning"
          );
          return;
        }
      }

      if (enModoEdicion && onUpdate && articuloAEditar) {
        const articuloData: UpdateArticuloInput = {
          codigo: datos.codigo,
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          demanda: datos.demanda ? parseInt(datos.demanda) : undefined,
          costo_almacenamiento: datos.costo_almacenamiento ? parseFloat(datos.costo_almacenamiento) : undefined,
          costo_pedido: datos.costo_pedido ? parseFloat(datos.costo_pedido) : undefined,
          costo_compra: datos.costo_compra ? parseFloat(datos.costo_compra) : undefined,
          precio_venta: datos.precio_venta ? parseFloat(datos.precio_venta) : undefined,
          modelo_inventario: datos.modelo_inventario,
          nivel_servicio: datos.nivel_servicio ? parseFloat(datos.nivel_servicio) / 100 : undefined,
          desviacion_estandar: datos.desviacion_estandar ? parseFloat(datos.desviacion_estandar) : undefined,
          intervalo_revision: datos.intervalo_revision ? parseInt(datos.intervalo_revision) : undefined,
          stock_actual: datos.stock_actual ? parseInt(datos.stock_actual) : 0,
          proveedores: datos.proveedores?.map((prov: any) => ({
            proveedor_id: parseInt(prov.proveedor_id),
            precio_unitario: parseFloat(prov.precio_unitario),
            demora_entrega: prov.demora_entrega ? parseInt(prov.demora_entrega) : undefined,
            cargos_pedido: prov.cargos_pedido ? parseFloat(prov.cargos_pedido) : undefined,
            proveedor_predeterminado: prov.proveedor_predeterminado === "true",
          })),
        };
        onUpdate(articuloAEditar.id, articuloData);

      } else if (!enModoEdicion && onAlta) {
        const articuloData: CreateArticuloDto = {
          codigo: datos.codigo,
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          demanda: datos.demanda ? parseInt(datos.demanda) : undefined,
          costo_almacenamiento: datos.costo_almacenamiento ? parseFloat(datos.costo_almacenamiento) : undefined,
          costo_pedido: datos.costo_pedido ? parseFloat(datos.costo_pedido) : undefined,
          costo_compra: datos.costo_compra ? parseFloat(datos.costo_compra) : undefined,
          precio_venta: datos.precio_venta ? parseFloat(datos.precio_venta) : undefined,
          modelo_inventario: datos.modelo_inventario,
          nivel_servicio: datos.nivel_servicio ? parseFloat(datos.nivel_servicio) / 100 : undefined,
          desviacion_estandar: datos.desviacion_estandar ? parseFloat(datos.desviacion_estandar) : undefined,
          intervalo_revision: datos.intervalo_revision ? parseInt(datos.intervalo_revision) : undefined,
          stock_actual: datos.stock_actual ? parseInt(datos.stock_actual) : 0,
          proveedores: datos.proveedores.map((prov: any) => ({
            proveedor_id: parseInt(prov.proveedor_id),
            precio_unitario: parseFloat(prov.precio_unitario),
            demora_entrega: prov.demora_entrega ? parseInt(prov.demora_entrega) : undefined,
            cargos_pedido: prov.cargos_pedido ? parseFloat(prov.cargos_pedido) : undefined,
            proveedor_predeterminado: prov.proveedor_predeterminado === "true",
          })),
        };
        await articulosService.create(articuloData);
        onAlta();
      }
    } catch (error) {
      console.error("Error al procesar artículo:", error);
      showAlert(
        "Error al Procesar Artículo",
        "Error al procesar el artículo. Por favor, intente nuevamente.",
        "danger"
      );
    }
  };

  return (
    <>
      <Form
        key={enModoEdicion ? `edit-${articuloAEditar?.id}` : "create"}
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        onFormChange={handleFormChange}
        titulo={enModoEdicion ? `Editar Artículo: ${articuloAEditar.nombre}` : "Agregar Artículo"}
        textoBoton={enModoEdicion ? "Guardar Cambios" : "Guardar Artículo"}
      >
        {enModoEdicion && onCancel && (
          <Button variant="secondary" onClick={onCancel} className="ms-2">
            Cancelar
          </Button>
        )}
      </Form>

      <InventoryFieldsHelp />

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

export default ArticulosForm;
