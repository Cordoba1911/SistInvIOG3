import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticulosModule } from './articulos/articulos.module';
import { ProveedorModule } from './proveedores/proveedor.module';
import { OrdenCompraModule } from './orden_compra/orden-compra.module';
import { ArticuloProveedorModule } from './articulo-proveedor/articulo-proveedor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('USER:', config.get('DB_USERNAME'));
        return {
          type: 'mysql',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
    ArticulosModule,
    ProveedorModule,
    OrdenCompraModule,
    ArticuloProveedorModule,
  ],
})
export class AppModule {}
