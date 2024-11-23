/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API de Compras')
    .setDescription('Documentación de la API para el sistema de compras')
    .setVersion('1.0')
    .addBearerAuth() // Añade autenticación con Bearer Token
    .addTag('usuarios')
    .addTag('compras')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.SERVER_DIRR;
  await app.listen(port);
}
bootstrap();
