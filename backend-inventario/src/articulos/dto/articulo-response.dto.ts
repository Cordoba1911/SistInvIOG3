import { ProveedorResponseDto } from '../../proveedores/dto/proveedor-response.dto';
import { ModeloInventario } from '../articulo.entity';

export class ProveedorArticuloResponseDto {
  proveedor_id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  precio_unitario: number;
  demora_entrega?: number;
  cargos_pedido?: number;
  proveedor_predeterminado: boolean;
}

export class ArticuloResponseDto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  demanda?: number;
  costo_almacenamiento?: number;
  costo_pedido?: number;
  costo_compra: number;
  precio_venta?: number;
  modelo_inventario?: ModeloInventario;
  lote_optimo?: number;
  punto_pedido?: number;
  stock_seguridad?: number;
  inventario_maximo?: number;
  cgi?: number;
  stock_actual?: number;
  desviacion_estandar?: number;
  nivel_servicio?: number;
  intervalo_revision?: number;
  estado: boolean;
  fecha_baja?: Date | null;
  proveedores: ProveedorArticuloResponseDto[];
}
