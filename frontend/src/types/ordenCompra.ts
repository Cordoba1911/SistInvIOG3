export interface OrdenCompra {
  id: number;
  articulo_id: number;
  proveedor_id?: number;
  cantidad?: number;
  estado: "Pendiente" | "En Proceso" | "Finalizada" | "Cancelada";
  fecha_creacion: Date;
  fecha_envio?: Date;
  fecha_finalizacion?: Date;
  articulo?: Articulo;
  proveedor?: Proveedor;
}

export interface CreateOrdenCompraDto {
  articulo_id: number;
  proveedor_id?: number;
  cantidad?: number;
}
