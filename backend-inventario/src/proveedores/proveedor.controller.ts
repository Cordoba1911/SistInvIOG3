import {
  Body,
  Controller,
  Get,
  Post,
  Param, 
  ParseIntPipe,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from './proveedor.entity';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { RelacionarArticulosDto } from './dto/relacionar-articulos.dto';

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

  @Get(':id/articulos')
  async getArticulosDeProveedor(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.proveedorService.getArticulosDeProveedor(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener artículos del proveedor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint para relacionar artículos con un proveedor
  @Post('relacionar/:id')
  relacionarArticulos(
    @Param('id', ParseIntPipe) proveedorId: number,
    @Body() dto: RelacionarArticulosDto,
  ) {
    return this.proveedorService.relacionarConArticulos(proveedorId, dto);
  }
}
