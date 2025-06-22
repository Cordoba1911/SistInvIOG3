import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import AlertModal from "../../components/common/AlertModal";
import InventoryFieldsHelp from "../../components/common/InventoryFieldsHelp";
import CalculosInventario from "../../components/common/CalculosInventario";
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
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    variant: 'danger' as 'danger' | 'warning' | 'success' | 'info'
  });
  const navigate = useNavigate();
  const enModoEdicion = !!articuloAEditar;

  const showAlert = (title: string, message: string, variant: 'danger' | 'warning' | 'success' | 'info' = 'danger') => {
    setAlertModal({ show: true, title, message, variant });
  };

  const hideAlert = () => {
    setAlertModal(prev => ({ ...prev, show: false }));
  };

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

  const campos: CampoFormulario[] = [
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
      nombre: "lote_optimo",
      etiqueta: "Lote Óptimo",
      tipo: "number",
      min: 0,
      step: 1,
      placeholder: "Cantidad óptima por pedido (EOQ)",
    },
    {
      nombre: "punto_pedido",
      etiqueta: "Punto de Pedido",
      tipo: "number",
      min: 0,
      step: 1,
      placeholder: "Nivel de stock para realizar pedido",
    },
    {
      nombre: "stock_seguridad",
      etiqueta: "Stock de Seguridad",
      tipo: "number",
      min: 0,
      step: 1,
      placeholder: "Stock mínimo de seguridad",
    },
    {
      nombre: "inventario_maximo",
      etiqueta: "Inventario Máximo",
      tipo: "number",
      min: 0,
      step: 1,
      placeholder: "Nivel máximo de inventario",
    },
    {
      nombre: "stock_actual",
      etiqueta: "Stock Actual",
      tipo: "number",
      min: 0,
      step: 1,
      placeholder: "Cantidad actual en inventario",
    },
    {
      nombre: "cgi",
      etiqueta: "CGI (Costo Gestión Inventario)",
      tipo: "number",
      min: 0,
      step: 0.001,
      placeholder: "Costo de gestión del inventario (calculado automáticamente)",
    },
    {
      nombre: "desviacion_estandar",
      etiqueta: "Desviación Estándar de la Demanda",
      tipo: "number",
      min: 0,
      step: 0.1,
      placeholder: "Variabilidad de la demanda (opcional)",
    },
    {
      nombre: "nivel_servicio",
      etiqueta: "Nivel de Servicio",
      tipo: "number",
      min: 0.5,
      max: 0.999,
      step: 0.01,
      placeholder: "Ej: 0.95 (95% de confiabilidad)",
    },
    {
      nombre: "intervalo_revision",
      etiqueta: "Intervalo de Revisión (días)",
      tipo: "number",
      min: 1,
      step: 1,
      placeholder: "Frecuencia de revisión del inventario (para modelo período fijo)",
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
  ];

  const valoresIniciales = enModoEdicion
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
        lote_optimo: articuloAEditar.lote_optimo,
        punto_pedido: articuloAEditar.punto_pedido,
        stock_seguridad: articuloAEditar.stock_seguridad,
        inventario_maximo: articuloAEditar.inventario_maximo,
        stock_actual: articuloAEditar.stock_actual,
        cgi: articuloAEditar.cgi,
        desviacion_estandar: articuloAEditar.desviacion_estandar,
        nivel_servicio: articuloAEditar.nivel_servicio,
        intervalo_revision: articuloAEditar.intervalo_revision,
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
        lote_optimo: undefined,
        punto_pedido: undefined,
        stock_seguridad: undefined,
        inventario_maximo: undefined,
        stock_actual: 0,
        cgi: undefined,
        desviacion_estandar: undefined,
        nivel_servicio: 0.95,
        intervalo_revision: undefined,
        proveedores: [],
      };

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
          lote_optimo: datos.lote_optimo ? parseInt(datos.lote_optimo) : undefined,
          punto_pedido: datos.punto_pedido ? parseInt(datos.punto_pedido) : undefined,
          stock_seguridad: datos.stock_seguridad ? parseInt(datos.stock_seguridad) : undefined,
          inventario_maximo: datos.inventario_maximo ? parseInt(datos.inventario_maximo) : undefined,
          stock_actual: datos.stock_actual ? parseInt(datos.stock_actual) : 0,
          cgi: datos.cgi ? parseFloat(datos.cgi) : undefined,
          desviacion_estandar: datos.desviacion_estandar ? parseFloat(datos.desviacion_estandar) : undefined,
          nivel_servicio: datos.nivel_servicio ? parseFloat(datos.nivel_servicio) : undefined,
          intervalo_revision: datos.intervalo_revision ? parseInt(datos.intervalo_revision) : undefined,
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
          lote_optimo: datos.lote_optimo ? parseInt(datos.lote_optimo) : undefined,
          punto_pedido: datos.punto_pedido ? parseInt(datos.punto_pedido) : undefined,
          stock_seguridad: datos.stock_seguridad ? parseInt(datos.stock_seguridad) : undefined,
          inventario_maximo: datos.inventario_maximo ? parseInt(datos.inventario_maximo) : undefined,
          stock_actual: datos.stock_actual ? parseInt(datos.stock_actual) : 0,
          cgi: datos.cgi ? parseFloat(datos.cgi) : undefined,
          desviacion_estandar: datos.desviacion_estandar ? parseFloat(datos.desviacion_estandar) : undefined,
          nivel_servicio: datos.nivel_servicio ? parseFloat(datos.nivel_servicio) : undefined,
          intervalo_revision: datos.intervalo_revision ? parseInt(datos.intervalo_revision) : undefined,
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
      {/* Mostrar cálculos al principio cuando estamos editando */}
      {enModoEdicion && articuloAEditar && (
        <CalculosInventario articulo={articuloAEditar} />
      )}

      <Form
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
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
