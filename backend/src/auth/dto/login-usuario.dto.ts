/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  correo: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  contrasena: string;
}
