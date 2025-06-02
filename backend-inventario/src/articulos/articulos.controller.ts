import { Controller, Post, Body, Get, Param, NotFoundException, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { ArticulosService } from './articulos.service';
import { Articulo } from './articulo.entity';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Controller('articulos')
export class ArticulosController {
  constructor(private articulosService: ArticulosService) { }

  @Get()
  getArticulos(): Promise<Articulo[]> {
    return this.articulosService.getArticulos();
  }

  @Get(':id')
  async getArticulo(@Param('id', ParseIntPipe) id: number){
    const articulo = await this.articulosService.getArticulo(id);
    if (!articulo) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
    }
    return articulo;
  }

  @Post()
  createArticulo(@Body() newArticulo: CreateArticuloDto){
    return this.articulosService.createArticulo(newArticulo);
  }

  @Delete(':id')
  deleteArticulo(@Param('id', ParseIntPipe) id: number) {
    return this.articulosService.deleteArticulo(id);
  }

  @Patch(':id')
  updateArticulo(@Param('id', ParseIntPipe) id: number, @Body() articulo: UpdateArticuloDto) {
    return this.articulosService.updateArticulo(id, articulo);
  }

}
