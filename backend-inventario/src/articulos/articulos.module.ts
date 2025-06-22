import { Module } from '@nestjs/common';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { ArticuloProveedor } from '../articulo-proveedor/articulo-proveedor.entity';
import { Proveedor } from '../proveedores/proveedor.entity';
import { OrdenCompraModule } from '../orden_compra/orden-compra.module';
import { ProveedorModule } from '../proveedores/proveedor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articulo, ArticuloProveedor, Proveedor]),
    OrdenCompraModule,
    ProveedorModule
  ],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
