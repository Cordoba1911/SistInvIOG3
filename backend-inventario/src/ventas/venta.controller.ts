import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './venta.entity';

@Controller('ventas')
export class VentaController {
  constructor(private ventaService: VentaService) {}

  @Post()
  createVenta(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.createVenta(createVentaDto);
  }

  @Get()
  getVentas() {
    return this.ventaService.getVentas();
  }

  @Get(':id')
  getVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.getVenta(id);
  }

  @Patch(':id/cancelar')
  cancelarVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.cancelarVenta(id);
  }

  @Patch(':id/completar')
  completarVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.completarVenta(id);
  }
}
