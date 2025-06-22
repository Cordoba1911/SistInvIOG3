import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
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

  @Get('activos/lista')
  getProveedoresActivos(): Promise<Proveedor[]> {
    return this.proveedorService.getProveedoresActivos();
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

  @Delete(':id')
  bajaProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.bajaProveedor(id);
  }

  @Patch(':id/reactivar')
  reactivarProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.reactivarProveedor(id);
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
