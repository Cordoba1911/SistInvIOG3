import { IsNotEmpty, IsNumber, IsPositive, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ModeloInventario } from '../articulo.entity';

export class CalculoCgiDto {
  @IsNotEmpty({ message: 'La demanda anual es obligatoria' })
  @IsInt({ message: 'La demanda anual debe ser un número entero' })
  @IsPositive({ message: 'La demanda anual debe ser mayor a 0' })
  demanda_anual: number;

  @IsNotEmpty({ message: 'El costo de compra es obligatorio' })
  @IsNumber({}, { message: 'El costo de compra debe ser un número' })
  @IsPositive({ message: 'El costo de compra debe ser mayor a 0' })
  costo_compra: number;

  @IsNotEmpty({ message: 'El costo de almacenamiento es obligatorio' })
  @IsNumber({}, { message: 'El costo de almacenamiento debe ser un número' })
  @IsPositive({ message: 'El costo de almacenamiento debe ser mayor a 0' })
  costo_almacenamiento: number;

  @IsNotEmpty({ message: 'El costo de pedido es obligatorio' })
  @IsNumber({}, { message: 'El costo de pedido debe ser un número' })
  @IsPositive({ message: 'El costo de pedido debe ser mayor a 0' })
  costo_pedido: number;

  @IsOptional()
  @IsEnum(ModeloInventario, { message: 'El modelo de inventario debe ser lote_fijo o periodo_fijo' })
  modelo_inventario?: ModeloInventario;

  @IsOptional()
  @IsNumber({}, { message: 'El intervalo de revisión debe ser un número' })
  @IsPositive({ message: 'El intervalo de revisión debe ser mayor a 0' })
  intervalo_revision?: number;

  @IsOptional()
  @IsInt({ message: 'El lote óptimo debe ser un número entero' })
  @IsPositive({ message: 'El lote óptimo debe ser mayor a 0' })
  lote_optimo?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock promedio debe ser un número' })
  @IsPositive({ message: 'El stock promedio debe ser mayor a 0' })
  stock_promedio?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El inventario máximo debe ser un número' })
  @IsPositive({ message: 'El inventario máximo debe ser mayor a 0' })
  inventario_maximo?: number;
}

export class ResultadoCgiDto {
  costo_total_anual: number;
  costo_pedidos_anuales: number;
  costo_almacenamiento_anual: number;
  costo_compra_anual: number;
  cgi: number;
  stock_promedio: number;
  numero_pedidos_anuales: number;
  frecuencia_pedidos_dias: number;
  modelo_utilizado: string;
  observaciones?: string;
} 