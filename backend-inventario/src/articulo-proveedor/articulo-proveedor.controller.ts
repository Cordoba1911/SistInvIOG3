import { Body, Controller, Post } from '@nestjs/common';
import { ArticuloProveedorService } from './articulo-proveedor.service';
import { CreateArticuloProveedorDto } from './dto/create-articulo-proveedor.dto';

@Controller('articulo-proveedor')
export class ArticuloProveedorController {
  constructor(
    private readonly articuloProveedorService: ArticuloProveedorService,
  ) {}

  @Post()
  async createArticuloProveedor(
    @Body() createArticuloProveedorDto: CreateArticuloProveedorDto,
  ) {
    return this.articuloProveedorService.create(createArticuloProveedorDto);
  }
}
