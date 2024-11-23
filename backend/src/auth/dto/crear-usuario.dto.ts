/* eslint-disable prettier/prettier */
// src/auth/dto/crear-usuario.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearUsuarioDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  nombre: string;

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

  @ApiProperty({
    description: 'Indica si el usuario tiene permisos de administrador',
    example: true,
  })
  esAdmin: boolean;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123, Ciudad Ficticia',
  })
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+5491123456789',
  })
  telefono?: string;
}
