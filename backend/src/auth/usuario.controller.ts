/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ApiResponseStandard } from '../common/api-response.decorator';
import { Usuario } from './entities/usuario.entity';
import { RolesGuard } from './roles.guards'; 
import { Roles } from './roles.decorador'; 

@ApiTags('usuarios')
@Controller('usuarios')
@ApiBearerAuth() // Aquí se agrega para proteger todas las rutas con el token Bearer
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Este endpoint está protegido por RolesGuard, solo accesible por admin
  @Get()
  @Roles('admin') // Solo accesible por usuarios con el rol 'admin'
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponseStandard('Lista de usuarios obtenida con éxito')
  getAll() {
    return this.usuarioService.obtenerTodos();
  }

  // Este endpoint está protegido por RolesGuard, solo accesible por admin o el propio usuario
  @Get(':id')
  @UseGuards(RolesGuard) // Protección de RolesGuard, verifica si es admin o si es el propio usuario
  @ApiOperation({ summary: 'Ver un usuario por ID' })
  @ApiResponseStandard('Usuario encontrado con éxito')
  async obtenerPorId(@Param('id') id: number, @Request() req: any): Promise<Usuario> {
    const usuario = await this.usuarioService.obtenerPorId(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  // Este endpoint no necesita protección de RolesGuard, por lo que no hay que aplicar el guard
  @Post('registro')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponseStandard('Usuario creado con éxito')
  async create(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuarioService.crear(crearUsuarioDto);
  }

  // Este endpoint no necesita protección de RolesGuard, por lo que no hay que aplicar el guard
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponseStandard('Inicio de sesión exitoso')
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuarioService.login(loginUsuarioDto);
  }
}
