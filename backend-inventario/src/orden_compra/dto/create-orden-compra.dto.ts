import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOrdenCompraDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'El codigo del articulo debe ser un número' })
  @IsPositive({ message: 'El codigo del articulo debe ser mayor a 0' })
  articulo_id: number;

  @IsOptional()
  @IsNumber({}, { message: 'El proveedor debe ser un número' })
  @IsPositive({ message: 'El proveedor debe ser mayor a 0' })
  proveedor_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
  cantidad?: number;
}
