import { Body, Controller, Post } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { ProveedorService } from './proveedor.service';

@Controller('proveedores')
export class ProveedorController {
  constructor(private proveedorService: ProveedorService) {}

  @Post()
  createProveedor(@Body() newProveedor: CreateProveedorDto) {
    return this.proveedorService.createProveedor(newProveedor);
  }
}
