import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  ParseIntPipe,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { ArticulosService } from './articulos.service';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ArticuloResponseDto } from './dto/articulo-response.dto';
import { ProveedorResponseDto } from '../proveedores/dto/proveedor-response.dto';

@Controller('articulos')
export class ArticulosController {
  constructor(private articulosService: ArticulosService) {}

  /**
   * Obtener todos los artículos activos
   */
  @Get()
  async getArticulos(): Promise<ArticuloResponseDto[]> {
    return this.articulosService.getArticulos();
  }

  /**
   * Obtener proveedores disponibles para selección
   */
  @Get('proveedores-disponibles')
  async getProveedoresDisponibles(): Promise<ProveedorResponseDto[]> {
    return this.articulosService.getProveedoresDisponibles();
  }

  /**
   * Obtener un artículo específico por ID
   */
  @Get(':id')
  async getArticulo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.getArticulo(id);
  }

  /**
   * Crear un nuevo artículo
   * Requiere: código, descripción, demanda, costo_almacenamiento, costo_pedido, costo_compra
   * Opcional: proveedor_predeterminado_id
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticulo(
    @Body() newArticulo: CreateArticuloDto,
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.createArticulo(newArticulo);
  }

  /**
   * Actualizar un artículo existente
   * Permite actualización parcial de campos incluyendo proveedor predeterminado
   */
  @Patch(':id')
  async updateArticulo(
    @Param('id', ParseIntPipe) id: number,
    @Body() articulo: UpdateArticuloDto,
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.updateArticulo(id, articulo);
  }

  /**
   * Eliminar un artículo (soft delete con validaciones)
   * Valida que no tenga stock ni órdenes de compra activas
   * Proporciona mensajes de error descriptivos en caso de impedimentos
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteArticulo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; articulo: ArticuloResponseDto }> {
    return this.articulosService.deleteArticulo(id);
  }
}
