import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticuloProveedor } from './articulo-proveedor.entity';
import { Articulo } from '../articulos/articulo.entity';
import { Proveedor } from '../proveedores/proveedor.entity';
import { ArticuloProveedorService } from './articulo-proveedor.service';
import { ArticuloProveedorController } from './articulo-proveedor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArticuloProveedor, Articulo, Proveedor])],
  controllers: [ArticuloProveedorController],
  providers: [ArticuloProveedorService],
})
export class ArticuloProveedorModule {}
