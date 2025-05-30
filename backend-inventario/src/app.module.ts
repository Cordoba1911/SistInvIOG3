import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticulosModule } from './articulos/articulos.module';
import { ProveedorModule } from './proveedores/proveedor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // hace que el módulo esté disponible globalmente
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    ArticulosModule,
    ProveedorModule,
  ],
})
export class AppModule {}
