import { Module } from '@nestjs/common';
import { ArticulosModule } from './articulos/articulos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    username: 'root',
    password: 'root',
    host: 'localhost',
    port: 3306,
    database: 'inventario',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false
  }), ArticulosModule],
})
export class AppModule { }
