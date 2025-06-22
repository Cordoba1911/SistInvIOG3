import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from './proveedor.entity';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedores')
export class ProveedorController {
  constructor(private proveedorService: ProveedorService) {}

  @Get()
  getProveedores(): Promise<Proveedor[]> {
    return this.proveedorService.getProveedores();
  }

  @Get(':id')
  getProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.getProveedor(id);
  }

  @Post()
  createProveedor(@Body() newProveedor: CreateProveedorDto) {
    return this.proveedorService.createProveedor(newProveedor);
  }

  @Patch(':id')
  updateProveedor(
    @Param('id', ParseIntPipe) id: number,
    @Body() proveedor: UpdateProveedorDto,
  ) {
    return this.proveedorService.updateProveedor(id, proveedor);
  }

  @Patch(':id/baja')
  bajaProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.bajaProveedor(id);
  }
}
