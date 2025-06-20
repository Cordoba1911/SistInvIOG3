import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class AjusteInventarioDto {
  @IsNotEmpty({ message: 'La nueva cantidad es obligatoria' })
  @IsNumber({}, { message: 'La nueva cantidad debe ser un número' })
  nueva_cantidad: number;

  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  motivo?: string;
}

export class ResultadoAjusteDto {
  articulo_id: number;
  codigo: string;
  nombre: string;
  stock_anterior: number;
  stock_nuevo: number;
  diferencia: number;
  motivo?: string;
  fecha_ajuste: Date;
}
