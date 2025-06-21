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
  cgi?: number;
  stock_actual?: number;
  proveedores?: ProveedorArticulo[];
}
