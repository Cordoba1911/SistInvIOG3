export interface OrdenCompra {
  id: string;
  nombre: string;
  proveedor: string;
  cantidad: number;
  estado: 'Pendiente' | 'Enviada' | 'Finalizada' | 'Cancelada';
  fecha_creacion: string; // Formato YYYY-MM-DD
  fecha_envio?: string; // Formato YYYY-MM-DD, opcional
  fecha_finalizacion?: string; // Formato YYYY-MM-DD, opcional
  activo: boolean; // Indica si la orden está activa
}