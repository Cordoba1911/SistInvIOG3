import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { Venta } from './venta.entity';
import { Articulo } from 'src/articulos/articulo.entity';
import { OrdenCompraModule } from 'src/orden_compra/orden-compra.module';
import { DetalleVenta } from './detalle-venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, Articulo, DetalleVenta]),
    OrdenCompraModule,
  ],
  controllers: [VentaController],
  providers: [VentaService],
  exports: [VentaService],
})
export class VentaModule {}
