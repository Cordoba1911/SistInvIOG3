import { PartialType } from '@nestjs/mapped-types';
import { CreateArticuloDto } from './create-articulo.dto';
import {
  IsNumber,
  IsString,
  IsPositive,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ModeloInventario } from '../articulo.entity';

class ProveedorArticuloDto {
  @IsNotEmpty({ message: 'El ID del proveedor es obligatorio' })
  @IsInt({ message: 'El ID del proveedor debe ser un número entero' })
  @IsPositive({ message: 'El ID del proveedor debe ser mayor a 0' })
  proveedor_id: number;

  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsPositive({ message: 'El precio unitario debe ser mayor a 0' })
  precio_unitario: number;

  @IsOptional()
  @IsInt({ message: 'La demora de entrega debe ser un número entero' })
  @Min(0, { message: 'La demora de entrega debe ser mayor o igual a 0' })
  demora_entrega?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Los cargos de pedido debe ser un número' })
  @Min(0, { message: 'Los cargos de pedido debe ser mayor o igual a 0' })
  cargos_pedido?: number;

  @IsOptional()
  @IsBoolean({ message: 'proveedor_predeterminado debe ser un valor booleano' })
  proveedor_predeterminado?: boolean;
}

export class UpdateArticuloDto extends PartialType(CreateArticuloDto) {
  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  codigo?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

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

  @IsOptional()
  @IsNumber({}, { message: 'El precio de venta debe ser un número' })
  @IsPositive({ message: 'El precio de venta debe ser mayor a 0' })
  precio_venta?: number;

  @IsOptional()
  @IsEnum(ModeloInventario, {
    message: 'El modelo de inventario debe ser "lote_fijo" o "periodo_fijo"',
  })
  modelo_inventario?: ModeloInventario;

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
  @IsNumber({}, { message: 'El nivel de servicio debe ser un número' })
  @IsPositive({ message: 'El nivel de servicio debe ser mayor a 0' })
  nivel_servicio?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La desviación estándar debe ser un número' })
  @IsPositive({ message: 'La desviación estándar debe ser mayor a 0' })
  desviacion_estandar?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El tiempo de reposición debe ser un número' })
  @IsPositive({ message: 'El tiempo de reposición debe ser mayor a 0' })
  tiempo_reposicion?: number;

  @IsOptional()
  @IsInt({ message: 'El intervalo de revisión debe ser un número entero' })
  @IsPositive({ message: 'El intervalo de revisión debe ser mayor a 0' })
  intervalo_revision?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El CGI debe ser un número' })
  @IsPositive({ message: 'El CGI debe ser mayor a 0' })
  cgi?: number;

  @IsOptional()
  @IsInt({ message: 'El stock actual debe ser un número entero' })
  @Min(0, { message: 'El stock actual debe ser mayor o igual a 0' })
  stock_actual?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del proveedor debe ser un número' })
  @IsPositive({ message: 'El ID del proveedor debe ser mayor a 0' })
  proveedor_id?: number;

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

  @IsOptional()
  @IsArray({ message: 'proveedores debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => ProveedorArticuloDto)
  proveedores?: ProveedorArticuloDto[];
}
