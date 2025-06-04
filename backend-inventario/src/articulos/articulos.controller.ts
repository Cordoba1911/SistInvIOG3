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
  HttpStatus
} from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { ArticulosService } from './articulos.service';
import { Articulo } from './articulo.entity';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Controller('articulos')
export class ArticulosController {
  constructor(private articulosService: ArticulosService) { }

  /**
   * Obtener todos los artículos activos
   */
  @Get()
  async getArticulos(): Promise<Articulo[]> {
    return this.articulosService.getArticulos();
  }

  /**
   * Obtener un artículo específico por ID
   */
  @Get(':id')
  async getArticulo(@Param('id', ParseIntPipe) id: number): Promise<Articulo> {
    return this.articulosService.getArticulo(id);
  }

  /**
   * Verificar si un artículo puede ser dado de baja
   * Devuelve información sobre impedimentos para la baja
   */
  @Get(':id/verificar-baja')
  async verificarBaja(@Param('id', ParseIntPipe) id: number): Promise<{
    puedeSerDadoDeBaja: boolean;
    impedimentos: string[];
    stockActual?: number;
    ordenesActivas?: number;
  }> {
    return this.articulosService.verificarPosibilidadBaja(id);
  }

  /**
   * Crear un nuevo artículo
   * Requiere: código, descripción, demanda, costo_almacenamiento, costo_pedido, costo_compra
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticulo(@Body() newArticulo: CreateArticuloDto): Promise<Articulo> {
    return this.articulosService.createArticulo(newArticulo);
  }

  /**
   * Actualizar un artículo existente
   * Permite actualización parcial de campos
   */
  @Patch(':id')
  async updateArticulo(
    @Param('id', ParseIntPipe) id: number, 
    @Body() articulo: UpdateArticuloDto
  ): Promise<Articulo> {
    return this.articulosService.updateArticulo(id, articulo);
  }

  /**
   * Eliminar un artículo (soft delete con validaciones)
   * Valida que no tenga stock ni órdenes de compra activas
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteArticulo(@Param('id', ParseIntPipe) id: number): Promise<{ message: string; articulo: Articulo }> {
    return this.articulosService.deleteArticulo(id);
  }
}
