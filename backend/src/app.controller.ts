/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app') // Etiqueta para Swagger
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Ruta raíz
  getHello(): string {
    return this.appService.getHello(); // Llama al servicio
  }
}
