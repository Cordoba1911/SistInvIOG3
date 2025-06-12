import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ModeloInventario } from '../articulo.entity';

export class CreateArticuloDto {
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  codigo: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;

  @IsOptional()
  @IsInt({ message: 'La demanda debe ser un número entero' })
  @IsPositive({ message: 'La demanda debe ser mayor a 0' })
  demanda?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El costo de almacenamiento debe ser un número' })
  @IsPositive({ message: 'El costo de almacenamiento debe ser mayor a 0' })
  costo_almacenamiento?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El costo de pedido debe ser un número' })
  @IsPositive({ message: 'El costo de pedido debe ser mayor a 0' })
  costo_pedido?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El costo de compra debe ser un número' })
  @IsPositive({ message: 'El costo de compra debe ser mayor a 0' })
  costo_compra?: number;

  @IsNotEmpty({ message: 'El modelo de inventario es obligatorio' })
  @IsEnum(ModeloInventario, { message: 'El modelo de inventario debe ser "lote_fijo" o "intervalo_fijo"' })
  modelo_inventario: ModeloInventario;

  @IsOptional()
  @IsInt({ message: 'El lote óptimo debe ser un número entero' })
  @IsPositive({ message: 'El lote óptimo debe ser mayor a 0' })
  lote_optimo?: number;

  @IsOptional()
  @IsInt({ message: 'El punto de pedido debe ser un número entero' })
  @IsPositive({ message: 'El punto de pedido debe ser mayor a 0' })
  punto_pedido?: number;

  @IsOptional()
  @IsInt({ message: 'El stock de seguridad debe ser un número entero' })
  @IsPositive({ message: 'El stock de seguridad debe ser mayor a 0' })
  stock_seguridad?: number;

  @IsOptional()
  @IsInt({ message: 'El inventario máximo debe ser un número entero' })
  @IsPositive({ message: 'El inventario máximo debe ser mayor a 0' })
  inventario_maximo?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El CGI debe ser un número' })
  @IsPositive({ message: 'El CGI debe ser mayor a 0' })
  cgi?: number;

  @IsOptional()
  @IsInt({ message: 'El stock actual debe ser un número entero' })
  @IsPositive({ message: 'El stock actual debe ser mayor a 0' })
  stock_actual?: number;

  // @IsOptional()
  // @IsNumber({}, { message: 'El ID del proveedor debe ser un número' })
  // @IsPositive({ message: 'El ID del proveedor debe ser mayor a 0' })
  // proveedor_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsPositive({ message: 'El precio unitario debe ser mayor a 0' })
  precio_unitario?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La demora de entrega debe ser un número' })
  @IsPositive({ message: 'La demora de entrega debe ser mayor a 0' })
  demora_entrega?: number;

  @IsOptional()
  @IsPositive({ message: 'Los cargos de pedido debe ser mayor a 0' })
  cargos_pedido?: number;
}
