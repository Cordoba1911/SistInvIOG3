import type { Articulo } from './articulo';

export interface Venta {
  id: number;
  fecha_venta: Date;
  detalle_venta: DetalleVenta[];
}

export interface DetalleVenta {
  id: number;
  venta_id: number;
  articulo_id: number;
  cantidad: number;
  articulo?: Articulo;
}

export interface CreateVentaDto {
  detalles: DetalleVentaDto[];
}

export interface DetalleVentaDto {
  articulo_id: number;
  cantidad: number;
}
