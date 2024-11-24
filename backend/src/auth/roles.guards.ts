/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, // Inyección de JwtService
    private readonly reflector: Reflector, // Inyección de Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Obtén el token

    if (!token) {
      throw new ForbiddenException('Token no proporcionado'); // Si no se proporciona el token
    }

    try {
      const payload = this.jwtService.verify(token); // Verifica el token con JwtService
      const user = payload;

      if (!user) {
        throw new ForbiddenException('Usuario no encontrado');
      }

      // Obtener los roles requeridos desde el decorador @Roles
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      if (!roles) {
        return true; // Si no hay roles especificados, se permite el acceso
      }

      // Verificar si el usuario tiene uno de los roles permitidos
      const tieneRol = roles.some((role) => role === user.rol); // Compara con el rol del usuario en el payload

      // Si el rol es admin, puede acceder a cualquier ID
      if (user.rol === 'admin') {
        return true;
      }

      // Si el rol no es admin, solo puede acceder a su propio ID
      const userId = request.params.id; // Obtén el ID del usuario de la URL
      if (userId !== user.id) {
        throw new ForbiddenException('No tienes permisos para acceder a este recurso');
      }

      return tieneRol; // Si tiene el rol adecuado, se permite el acceso
    } catch {
      throw new ForbiddenException('Token no válido o expirado'); // Si el token no es válido o ha expirado
    }
  }
}
