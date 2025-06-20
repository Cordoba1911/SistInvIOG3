import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProveedorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
