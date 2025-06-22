import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { ArticuloProveedorService } from './articulo-proveedor.service';
import { CreateArticuloProveedorDto } from './dto/create-articulo-proveedor.dto';
import { UpdateArticuloProveedorDto } from './dto/update-articulo-proveedor.dto';

@Controller('articulo-proveedor')
export class ArticuloProveedorController {
  constructor(
    private readonly articuloProveedorService: ArticuloProveedorService,
  ) {}

  @Post()
  createArticuloProveedor(@Body() createArticuloProveedorDto: CreateArticuloProveedorDto) {
    return this.articuloProveedorService.createArticuloProveedor(
      createArticuloProveedorDto,
    );
  }

  @Patch(':id')
  updateArticuloProveedor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticuloProveedorDto,
  ) {
    return this.articuloProveedorService.updateArticuloProveedor(id, dto);
  }
}
