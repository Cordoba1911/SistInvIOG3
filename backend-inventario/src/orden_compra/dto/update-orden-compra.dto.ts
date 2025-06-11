import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDate,
  IsInt,
} from 'class-validator';

export class UpdateOrdenCompraDto {
  @IsOptional()
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
  cantidad?: number;

  @IsOptional()
  @IsInt({ message: 'El ID del proveedor debe ser un número entero' })
  @IsPositive({ message: 'El ID del proveedor debe ser mayor a 0' })
  proveedorId?: number;
}
