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
   * Eliminar un artículo (soft delete)
   * Marca el artículo como inactivo en lugar de eliminarlo físicamente
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteArticulo(@Param('id', ParseIntPipe) id: number): Promise<Articulo> {
    return this.articulosService.deleteArticulo(id);
  }
}
