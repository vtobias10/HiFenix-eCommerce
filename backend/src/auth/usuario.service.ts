/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto'; // Asegúrate de tener este DTO
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService, // Inyecta JwtService
  ) {}

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    // Verificar si el número de teléfono ya está registrado
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { telefono: crearUsuarioDto.telefono },
    });

    if (usuarioExistente) {
      throw new ConflictException('El número de teléfono ya está registrado');
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(crearUsuarioDto.contrasena, 10); // 10 es el número de rondas de salt
    const nuevoUsuario = this.usuarioRepository.create({
      ...crearUsuarioDto,
      contrasena: hashedPassword, // Guarda la contraseña encriptada
    });
    return this.usuarioRepository.save(nuevoUsuario);
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async actualizar(
    id: number,
    crearUsuarioDto: CrearUsuarioDto,
  ): Promise<Usuario> {
    const usuarioActualizado = await this.usuarioRepository.preload({
      id,
      ...crearUsuarioDto,
    });

    if (!usuarioActualizado) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.usuarioRepository.save(usuarioActualizado);
  }

  async eliminar(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.remove(usuario);
  }

  // Adaptado para incluir el rol en la respuesta
  async login(loginUsuarioDto: LoginUsuarioDto): Promise<{ token: string, rol: string }> {
    console.log('Intentando iniciar sesión con:', loginUsuarioDto); // Log de las credenciales recibidas

    const usuario = await this.usuarioRepository.findOne({
      where: { correo: loginUsuarioDto.correo },
    });

    console.log('Usuario encontrado:', usuario); // Log del usuario encontrado

    if (!usuario) {
      console.log(
        'No se encontró el usuario con el correo:',
        loginUsuarioDto.correo,
      );
      throw new NotFoundException('Credenciales incorrectas');
    }

    const contrasenaCoincide = await bcrypt.compare(
      loginUsuarioDto.contrasena,
      usuario.contrasena,
    );
    console.log('¿Contraseña coincide?', contrasenaCoincide); // Log del resultado de la comparación de contraseñas

    if (!contrasenaCoincide) {
      console.log('Contraseña incorrecta para el usuario:', usuario.correo);
      throw new NotFoundException('Credenciales incorrectas');
    }

    const payload = {
      id: usuario.id,
      rol: usuario.esAdmin ? 'admin' : 'usuario',
      correo: usuario.correo
    };
    const token = this.jwtService.sign(payload);
    console.log('Payload del token:', payload);
    console.log('Token generado:', token); // Log del token generado

    // Devolvemos el token y el rol
    return { token, rol: payload.rol };
  }
}
