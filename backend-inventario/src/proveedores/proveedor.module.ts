import { Module } from '@nestjs/common';
import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { Articulo } from 'src/articulos/articulo.entity';
import { OrdenCompra } from 'src/orden_compra/orden-compra.entity';
import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proveedor,
      Articulo,
      OrdenCompra,
      ArticuloProveedor,
    ]),
  ],
  controllers: [ProveedorController],
  providers: [ProveedorService],
  exports: [ProveedorService],
})
export class ProveedorModule {}
