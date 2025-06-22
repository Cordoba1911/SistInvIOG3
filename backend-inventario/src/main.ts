import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // Agregar prefijo global /api
  app.enableCors(); // Habilitar CORS

  // Habilitar validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma los tipos automáticamente
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
