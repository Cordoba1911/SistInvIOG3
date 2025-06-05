import { ProveedorResponseDto } from '../../proveedores/dto/proveedor-response.dto';
import { ModeloInventario } from '../articulo.entity';

export class ArticuloResponseDto {
  id: number;
  codigo: number;
  descripcion: string;
  demanda?: number;
  costo_almacenamiento?: number;
  costo_pedido?: number;
  costo_compra: number;
  modelo_inventario?: ModeloInventario;
  lote_optimo?: number;
  punto_pedido?: number;
  stock_seguridad?: number;
  inventario_maximo?: number;
  cgi?: number;
  stock_actual?: number;
  estado: boolean;
  fecha_baja?: Date;
  proveedor_predeterminado_id?: number;
  proveedor_predeterminado?: ProveedorResponseDto;
} 