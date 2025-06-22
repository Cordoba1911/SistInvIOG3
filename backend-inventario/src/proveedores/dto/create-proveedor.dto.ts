import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class ArticuloProveedorDto {
  @IsNumber({}, { message: 'El ID del artículo debe ser un número' })
  @IsPositive()
  articulo_id: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  demora_entrega?: number;

  @IsNumber()
  @IsPositive()
  precio_unitario: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cargos_pedido?: number;

  @IsOptional()
  @IsBoolean()
  proveedor_predeterminado?: boolean;
}

export class CreateProveedorDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticuloProveedorDto)
  articulos?: ArticuloProveedorDto[];
}
