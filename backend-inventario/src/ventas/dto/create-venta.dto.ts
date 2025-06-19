import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleVentaDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  articulo_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;
}

export class CreateVentaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}
