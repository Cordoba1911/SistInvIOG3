export class CreateArticuloProveedorDto {
  articulo_id: number;
  proveedor_id: number;
  demora_entrega?: number;
  precio_unitario: number;
  cargos_pedido?: number;
}
