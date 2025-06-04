export class CreateProveedorDto {
  nombre: string;
  telefono?: string;
  email?: string;
  articulos: {
    articulo_id: number;
    demora_entrega?: number;
    precio_unitario: number;
    cargos_pedido?: number;
  }[];
}
