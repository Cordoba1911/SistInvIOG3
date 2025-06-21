export class ProductoFaltanteDto {
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

export class ProductoAReponerDto {
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