import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ArticuloRelacionDto {
  @IsNumber()
  @IsPositive({ message: 'El ID del artículo debe ser un número positivo' })
  articulo_id: number;

  @IsNumber()
  @IsPositive({ message: 'El precio unitario debe ser un número positivo' })
  precio_unitario: number;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'La demora de entrega debe ser un número positivo' })
  demora_entrega?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Los cargos de pedido deben ser un número positivo' })
  cargos_pedido?: number;

  @IsOptional()
  proveedor_predeterminado?: boolean;
}

export class RelacionarArticulosDto {
  @IsArray({ message: 'articulos debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => ArticuloRelacionDto)
  articulos: ArticuloRelacionDto[];
}
