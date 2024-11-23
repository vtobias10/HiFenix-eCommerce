/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Producto } from './entities/producto.entity';
import { RolesGuard } from '../auth/roles.guards'; 
import { Roles } from '../auth/roles.decorador';  // Asegúrate de importar el decorador

@ApiTags('productos')
@Controller('productos')
@ApiBearerAuth()  // Añadir esta línea si necesitas el token Bearer para los endpoints protegidos
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @UseGuards(RolesGuard)  // Protege este endpoint con el RolesGuard
  @Roles('admin')  // Solo accesible por usuarios con rol 'admin'
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async crear(@Body() crearProductoDto: CrearProductoDto): Promise<Producto> {
    return this.productoService.crear(crearProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida con éxito.',
  })
  async obtenerTodos(): Promise<Producto[]> {
    return this.productoService.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async obtenerPorId(@Param('id') id: number): Promise<Producto> {
    return this.productoService.obtenerPorId(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)  // Protege este endpoint con el RolesGuard
  @Roles('admin')  // Solo accesible por usuarios con rol 'admin'
  @ApiOperation({ summary: 'Editar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async actualizar(
    @Param('id') id: number,
    @Body() crearProductoDto: CrearProductoDto,
  ): Promise<Producto> {
    const productoActualizado = await this.productoService.actualizar(
      id,
      crearProductoDto,
    );

    if (!productoActualizado) {
      throw new NotFoundException('Producto no encontrado');
    }
    return productoActualizado;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)  // Protege este endpoint con el RolesGuard
  @Roles('admin')  // Solo accesible por usuarios con rol 'admin'
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async eliminar(@Param('id') id: number): Promise<void> {
    const resultado = await this.productoService.eliminar(id);
    if (!resultado) {
      throw new NotFoundException('Producto no encontrado');
    }
    return;
  }
}
