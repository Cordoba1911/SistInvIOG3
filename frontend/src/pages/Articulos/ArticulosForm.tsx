import { useState, useEffect } from "react";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import type { CreateArticuloDto } from "../../types/articulo";
import { articulosService } from "../../services/articulosService";
import { proveedoresService } from "../../services/proveedoresService";
import { useNavigate } from "react-router-dom";

interface PropsArticulosForm {
  onAlta?: (datos: CreateArticuloDto) => void;
}

const ArticulosForm = ({ onAlta }: PropsArticulosForm) => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar proveedores disponibles
    const cargarProveedores = async () => {
      try {
        const proveedoresData =
          await articulosService.getProveedoresDisponibles();
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
      requerido: true,
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

  const valoresIniciales = {
    codigo: "",
    nombre: "",
    descripcion: "",
    demanda: undefined,
    costo_almacenamiento: undefined,
    costo_pedido: undefined,
    costo_compra: undefined,
    precio_venta: undefined,
    modelo_inventario: undefined,
    stock_actual: 0,
    proveedores: [],
  };

  const manejarEnvio = async (datos: Record<string, any>) => {
    try {
      // Transformar los datos para que coincidan con el DTO del backend
      const articuloData: CreateArticuloDto = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        demanda: datos.demanda ? parseInt(datos.demanda) : undefined,
        costo_almacenamiento: datos.costo_almacenamiento
          ? parseFloat(datos.costo_almacenamiento)
          : undefined,
        costo_pedido: datos.costo_pedido
          ? parseFloat(datos.costo_pedido)
          : undefined,
        costo_compra: datos.costo_compra
          ? parseFloat(datos.costo_compra)
          : undefined,
        precio_venta: datos.precio_venta
          ? parseFloat(datos.precio_venta)
          : undefined,
        modelo_inventario: datos.modelo_inventario,
        lote_optimo: undefined,
        punto_pedido: undefined,
        stock_seguridad: undefined,
        inventario_maximo: undefined,
        cgi: undefined,
        stock_actual: datos.stock_actual ? parseInt(datos.stock_actual) : 0,
        proveedores: datos.proveedores.map((prov: any) => ({
          proveedor_id: parseInt(prov.proveedor_id),
          precio_unitario: parseFloat(prov.precio_unitario),
          demora_entrega: prov.demora_entrega
            ? parseInt(prov.demora_entrega)
            : undefined,
          cargos_pedido: prov.cargos_pedido
            ? parseFloat(prov.cargos_pedido)
            : undefined,
          proveedor_predeterminado: prov.proveedor_predeterminado === "true",
        })),
      };

      // Llamar al servicio para crear el artículo
      const nuevoArticulo = await articulosService.create(articuloData);

      if (onAlta) {
        onAlta(articuloData);
      }

      // Redirigir a la lista de artículos
      navigate("/articulos/admin-articulos");
    } catch (error) {
      console.error("Error al crear artículo:", error);
      alert("Error al crear el artículo. Por favor, intente nuevamente.");
    }
  };

  return (
    <Form
      campos={campos}
      valoresIniciales={valoresIniciales}
      onSubmit={manejarEnvio}
      titulo="Agregar Artículo"
      textoBoton="Guardar Artículo"
    />
  );
};

export default ArticulosForm;
