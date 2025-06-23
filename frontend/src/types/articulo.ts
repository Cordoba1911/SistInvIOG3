export interface Articulo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  demanda?: number;
  costo_almacenamiento?: number;
  costo_pedido?: number;
  costo_compra?: number;
  precio_venta?: number;
  modelo_inventario?: "lote_fijo" | "periodo_fijo";
  lote_optimo?: number;
  punto_pedido?: number;
  stock_seguridad?: number;
  inventario_maximo?: number;
  nivel_servicio?: number;
  desviacion_estandar?: number;
  tiempo_reposicion?: number;
  cgi?: number;
  stock_actual?: number;
  estado: boolean;
  fecha_baja?: Date;
  proveedores?: ProveedorArticulo[];
}

export interface ProveedorArticulo {
  proveedor_id: number;
  precio_unitario: number;
  demora_entrega?: number;
  cargos_pedido?: number;
  proveedor_predeterminado?: boolean;
}

export interface CreateArticuloDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  demanda?: number;
  costo_almacenamiento?: number;
  costo_pedido?: number;
  costo_compra?: number;
  precio_venta?: number;
  modelo_inventario?: "lote_fijo" | "periodo_fijo";
  lote_optimo?: number;
  punto_pedido?: number;
  stock_seguridad?: number;
  inventario_maximo?: number;
  nivel_servicio?: number;
  desviacion_estandar?: number;
  tiempo_reposicion?: number;
  cgi?: number;
  stock_actual?: number;
  proveedores: ProveedorArticulo[];
}

export interface UpdateArticuloInput {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  demanda?: number;
  costo_almacenamiento?: number;
  costo_pedido?: number;
  costo_compra?: number;
  precio_venta?: number;
  modelo_inventario?: "lote_fijo" | "periodo_fijo";
  lote_optimo?: number;
  punto_pedido?: number;
  stock_seguridad?: number;
  inventario_maximo?: number;
  nivel_servicio?: number;
  desviacion_estandar?: number;
  tiempo_reposicion?: number;
  cgi?: number;
  stock_actual?: number;
  proveedores?: ProveedorArticulo[];
}

// Nuevos tipos para productos a reponer y productos faltantes
export interface ProductoFaltante {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  stock_seguridad: number;
  diferencia: number; // stock_seguridad - stock_actual
  punto_pedido: number;
  proveedor_predeterminado?: {
    id: number;
    nombre: string;
    telefono: string;
  };
}

export interface ProductoAReponer {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  punto_pedido: number;
  diferencia: number; // punto_pedido - stock_actual
  lote_optimo?: number;
  modelo_inventario: string;
  proveedor_predeterminado?: {
    id: number;
    nombre: string;
    telefono: string;
  };
  cantidad_sugerida?: number; // Cantidad que se sugiere ordenar
}

// Tipos para ajuste de inventario
export interface AjusteInventarioDto {
  nueva_cantidad: number;
  motivo?: string;
}

export interface ResultadoAjusteDto {
  articulo_id: number;
  codigo: string;
  nombre: string;
  stock_anterior: number;
  stock_nuevo: number;
  diferencia: number;
  motivo?: string;
  fecha_ajuste: Date;
}
