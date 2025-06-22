import { IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';

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
  @IsPositive({ message: 'El nivel de servicio debe ser mayor a 0' })
  nivel_servicio?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock actual debe ser un número' })
  @IsPositive({ message: 'El stock actual debe ser mayor a 0' })
  stock_actual?: number;
}

export class ResultadoIntervaloFijoDto {
  stock_seguridad: number;
  inventario_maximo: number;
  cantidad_ordenar: number;
  costo_total_periodo: number;
  nivel_inventario_objetivo: number;
} 