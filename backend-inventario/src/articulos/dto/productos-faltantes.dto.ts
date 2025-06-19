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