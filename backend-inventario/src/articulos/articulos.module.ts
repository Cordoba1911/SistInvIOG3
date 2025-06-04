import { Module } from '@nestjs/common';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { OrdenCompraModule } from '../orden_compra/orden-compra.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articulo]),
    OrdenCompraModule
  ],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
