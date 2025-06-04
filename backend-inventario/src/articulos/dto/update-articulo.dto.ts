import { IsOptional, IsNumber, IsString, IsPositive } from 'class-validator';

export class UpdateArticuloDto {
  @IsOptional()
  @IsNumber({}, { message: 'El código debe ser un número' })
  codigo?: number;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La demanda debe ser un número' })
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
  @IsNumber({}, { message: 'El lote optimo debe ser un número' })
  @IsPositive({ message: 'El lote optimo debe ser mayor a 0' })
  lote_optimo: number;

  @IsOptional()
  @IsNumber({}, { message: 'El punto de pedido debe ser un número' })
  @IsPositive({ message: 'El punto de pedido debe ser mayor a 0' })
  punto_pedido: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock de seguridad debe ser un número' })
  @IsPositive({ message: 'El stock de seguridad debe ser mayor a 0' })
  stock_seguridad: number;

  @IsOptional()
  @IsNumber({}, { message: 'El lote optimo debe ser un número' })
  @IsPositive({ message: 'El lote optimo debe ser mayor a 0' })
  inventario_maximo: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock actual debe ser un número' })
  stock_actual: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del proveedor debe ser un número' })
  proveedor_predeterminado_id?: number | null;
}
