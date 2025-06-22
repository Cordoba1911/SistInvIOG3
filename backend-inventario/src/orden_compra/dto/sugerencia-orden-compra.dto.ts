import { ModeloInventario } from '../../articulos/articulo.entity';

export interface SugerenciaOrdenCompraDto {
  articulo_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  punto_pedido: number;
  stock_seguridad: number;
  modelo_inventario: ModeloInventario;
  cantidad_sugerida: number;
  razon_sugerencia: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  proveedor_predeterminado: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
    precio_unitario: number;
    demora_entrega: number;
  };
  costo_estimado: number;
  dias_sin_stock: number;
} 