import { Controller, Post, Body } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { ArticulosService } from './articulos.service';

@Controller('articulos')
export class ArticulosController {
  constructor(private articulosService: ArticulosService) {}

  @Post()
  createArticulo(@Body() newArticulo: CreateArticuloDto) {
    return this.articulosService.createArticulo(newArticulo);
  }
}
