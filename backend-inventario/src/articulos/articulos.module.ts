import { Module } from '@nestjs/common';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo])],
  controllers: [ArticulosController],
  providers: [ArticulosService],
})
export class ArticulosModule {}
