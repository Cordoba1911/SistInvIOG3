import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import type { Articulo, CreateArticuloDto, UpdateArticuloDto } from "../../types/articulo";
import { articulosService } from "../../services/articulosService";
import { proveedoresService } from "../../services/proveedoresService";
import { useNavigate } from "react-router-dom";

interface PropsArticulosForm {
  onAlta?: () => void;
  articuloAEditar?: Articulo | null;
  onUpdate?: (id: number, data: UpdateArticuloDto) => void;
  onCancel?: () => void;
}

const ArticulosForm = ({ onAlta, articuloAEditar, onUpdate, onCancel }: PropsArticulosForm) => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const navigate = useNavigate();
  const enModoEdicion = !!articuloAEditar;

  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const proveedoresData = await proveedoresService.getAll();
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
      arrayConfig: enModoEdicion ? undefined : {
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
        stock_actual: articuloAEditar.stock_actual,
        proveedores: [], // La edición de proveedores se hará en otra vista
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
        stock_actual: 0,
        proveedores: [],
      };

  const manejarEnvio = async (datos: Record<string, any>) => {
    try {
      if (enModoEdicion && onUpdate && articuloAEditar) {
        const articuloData: UpdateArticuloDto = {
          codigo: datos.codigo,
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          demanda: datos.demanda ? parseInt(datos.demanda) : undefined,
          costo_almacenamiento: datos.costo_almacenamiento ? parseFloat(datos.costo_almacenamiento) : undefined,
          costo_pedido: datos.costo_pedido ? parseFloat(datos.costo_pedido) : undefined,
          costo_compra: datos.costo_compra ? parseFloat(datos.costo_compra) : undefined,
          precio_venta: datos.precio_venta ? parseFloat(datos.precio_venta) : undefined,
          modelo_inventario: datos.modelo_inventario,
          stock_actual: datos.stock_actual ? parseInt(datos.stock_actual) : 0,
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
      alert("Error al procesar el artículo. Por favor, intente nuevamente.");
    }
  };

  return (
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
  );
};

export default ArticulosForm;
