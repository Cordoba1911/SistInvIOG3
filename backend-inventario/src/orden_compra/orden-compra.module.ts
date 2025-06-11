import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompra } from './orden-compra.entity';
import { OrdenCompraService } from './orden-compra.service';
import { OrdenCompraController } from './orden-compra.controller';
import { Articulo } from 'src/articulos/articulo.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';
import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenCompra, Articulo, Proveedor, ArticuloProveedor])],
  controllers: [OrdenCompraController],
  providers: [OrdenCompraService],
  exports: [OrdenCompraService],
})
export class OrdenCompraModule {}
