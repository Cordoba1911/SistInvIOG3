export class UpdateOrdenCompraDto {
  cantidad?: number;
  estado?: 'pendiente' | 'enviada' | 'cancelada' | 'finalizada';
  fecha_creacion?: Date;
  fecha_envio?: Date;
  fecha_finalizacion?: Date;
  proveedorId?: number; // ID del proveedor relacionado
}
