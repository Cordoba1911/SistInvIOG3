import { IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CalculoLoteFijoDto {
  @IsNotEmpty({ message: 'La demanda es obligatoria' })
  @IsNumber({}, { message: 'La demanda debe ser un número' })
  @IsPositive({ message: 'La demanda debe ser mayor a 0' })
  demanda: number;

  @IsNotEmpty({ message: 'El costo de almacenamiento es obligatorio' })
  @IsNumber({}, { message: 'El costo de almacenamiento debe ser un número' })
  @IsPositive({ message: 'El costo de almacenamiento debe ser mayor a 0' })
  costo_almacenamiento: number;

  @IsNotEmpty({ message: 'El costo de pedido es obligatorio' })
  @IsNumber({}, { message: 'El costo de pedido debe ser un número' })
  @IsPositive({ message: 'El costo de pedido debe ser mayor a 0' })
  costo_pedido: number;

  @IsNotEmpty({ message: 'El costo de compra es obligatorio' })
  @IsNumber({}, { message: 'El costo de compra debe ser un número' })
  @IsPositive({ message: 'El costo de compra debe ser mayor a 0' })
  costo_compra: number;

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
  @IsPositive({ message: 'El nivel de servicio debe ser mayor a 0' })
  nivel_servicio?: number;
}

export class ResultadoLoteFijoDto {
  lote_optimo: number;
  punto_pedido: number;
  stock_seguridad: number;
  costo_total_anual: number;
  tiempo_reposicion: number;
} 