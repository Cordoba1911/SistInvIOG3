// src/models/OrdenCompra.ts

export type EstadoOrden = "Pendiente" | "Enviada" | "Finalizada" | "Cancelada";

export interface OrdenCompra {
  id: string;
  nombre: string;
  proveedor: string;
  cantidad: number;
  estado: EstadoOrden;
  fecha_creacion: string;
  fecha_envio?: string;
  fecha_finalizacion?: string;
}
