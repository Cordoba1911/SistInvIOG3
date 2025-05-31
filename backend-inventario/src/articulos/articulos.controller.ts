import { Controller, Post, Body, Get, Param, NotFoundException, ParseIntPipe, Delete } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { ArticulosService } from './articulos.service';
import { Articulo } from './articulo.entity';

@Controller('articulos')
export class ArticulosController {
  constructor(private articulosService: ArticulosService) {}

  @Get()
  getArticulos(): Promise<Articulo[]>{
    return this.articulosService.getArticulos();
  }

@Get(':id')
async getArticulo(@Param('id', ParseIntPipe) id: number): Promise<Articulo> {
  const articulo = await this.articulosService.getArticulo(id);
  if (!articulo) {
    throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
  }
  return articulo;
}

  @Post()
  createArticulo(@Body() newArticulo: CreateArticuloDto): Promise<Articulo> {
    return this.articulosService.createArticulo(newArticulo);
  }

  @Delete(':id')
  deleteArticulo(@Param('id', ParseIntPipe) id: number){
    return this.articulosService.deleteArticulo(id);
  }
}
