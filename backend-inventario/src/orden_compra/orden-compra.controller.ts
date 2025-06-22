import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';

@Controller('ordenes_compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  // Crear una nueva orden
  @Post()
  create(@Body() dto: CreateOrdenCompraDto) {
    return this.ordenCompraService.createOrdenCompra(dto);
  }

  // Obtener todas las órdenes
  @Get()
  findAll() {
    return this.ordenCompraService.getOrdenesCompra();
  }

  // Obtener sugerencias inteligentes para órdenes de compra
  @Get('sugerencias')
  getSugerencias() {
    return this.ordenCompraService.getSugerenciasOrdenesCompra();
  }

  // Obtener una orden por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.getOrdenCompra(id);
  }

  // Actualizar una orden (solo si está en estado pendiente)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrdenCompraDto,
  ) {
    return this.ordenCompraService.updateOrdenCompra(id, dto);
  }

  // Cancelar una orden (solo si está en estado pendiente)
  @Patch(':id/cancelar')
  @HttpCode(200)
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.cancelarOrdenCompra(id);
  }

  // Enviar una orden (cambia estado a enviada, registra fecha_envio)
  @Patch(':id/enviar')
  @HttpCode(200)
  enviar(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.enviarOrdenCompra(id);
  }

  // Finalizar una orden (solo si ya fue enviada)
  @Patch(':id/finalizar')
  @HttpCode(200)
  finalizar(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.finalizarOrdenCompra(id);
  }
}
