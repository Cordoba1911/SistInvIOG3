import { IsNotEmpty, IsNumber, IsPositive, IsOptional, Min, Max } from 'class-validator';

export class CalculoIntervaloFijoDto {
  @IsNotEmpty({ message: 'La demanda es obligatoria' })
  @IsNumber({}, { message: 'La demanda debe ser un número' })
  @IsPositive({ message: 'La demanda debe ser mayor a 0' })
  demanda: number;

  @IsNotEmpty({ message: 'El intervalo de revisión es obligatorio' })
  @IsNumber({}, { message: 'El intervalo de revisión debe ser un número' })
  @IsPositive({ message: 'El intervalo de revisión debe ser mayor a 0' })
  intervalo_revision: number;

  @IsOptional()
  @IsNumber({}, { message: 'La demora de entrega debe ser un número' })
  @IsPositive({ message: 'La demora de entrega debe ser mayor a 0' })
  demora_entrega?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La desviación estándar debe ser un número' })
  @IsPositive({ message: 'La desviación estándar debe ser mayor a 0' })
  desviacion_estandar?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El nivel de servicio debe ser un número' })
  @Min(0.5, { message: 'El nivel de servicio debe ser al menos 0.5 (50%)' })
  @Max(0.999, { message: 'El nivel de servicio no puede ser mayor a 0.999 (99.9%)' })
  nivel_servicio?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock actual debe ser un número' })
  @IsPositive({ message: 'El stock actual debe ser mayor a 0' })
  stock_actual?: number;

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
}

export class ResultadoIntervaloFijoDto {
  stock_seguridad: number;
  inventario_maximo: number;
  cantidad_pedido: number;
  nivel_inventario_objetivo: number;
  costo_total_anual: number;
  tiempo_ciclo: number;
  demanda_durante_revision: number;
  demanda_durante_entrega: number;
  costo_almacenamiento_anual: number;
  costo_pedidos_anuales: number;
  numero_pedidos_anuales: number;
} 