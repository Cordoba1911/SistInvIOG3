// This file defines the TypeScript types for a Proveedor (Provider) entity.
// It includes the full Proveedor interface and a type for creating new providers without an ID or active status.
import type { Articulo } from "./articulo";

export interface Proveedor {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  estado: boolean;
  fecha_baja?: Date;
  articulos?: ArticuloProveedor[];
}

export interface ArticuloProveedor {
  articulo_id: number;
  demora_entrega?: number;
  precio_unitario: number;
  cargos_pedido?: number;
  proveedor_predeterminado?: boolean;
}

export interface CreateProveedorDto {
  nombre: string;
  telefono?: string;
  email?: string;
  articulos?: ArticuloProveedor[];
}

export type ProveedorSinID = Omit<Proveedor, "id" | "activo">;

// NUEVA INTERFAZ: para el detalle de artículos de un proveedor
export interface ArticuloProveedorDetalle {
  articulo: Articulo;
  precio_unitario: number;
  demora_entrega?: number;
  cargos_pedido?: number;
  proveedor_predeterminado?: boolean;
}

// DTO para la respuesta del endpoint /articulos/:id/proveedores
export interface ProveedorArticuloResponseDto {
  proveedor_id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  precio_unitario: number;
  demora_entrega?: number;
  cargos_pedido?: number;
  proveedor_predeterminado: boolean;
}
