/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable() // Decorador para indicar que es un servicio inyectable
export class AppService {
  getHello(): string {
    return '¡Hola, mundo!'; // Mensaje de saludo
  }
}
