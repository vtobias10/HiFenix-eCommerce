/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompraService } from './compra.service';
import { CrearCompraDto } from './dto/crear-compra.dto';
import { Compra } from './entities/compra.entity';
import { RolesGuard } from '../auth/roles.guards';
import { Roles } from '../auth/roles.decorador';
import { ApiResponseStandard } from '../common/api-response.decorator';

@ApiTags('compras')
@Controller('compras')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Get()
  @Roles('admin', 'usuario')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Obtener todas las compras' })
  @ApiResponseStandard('Lista de compras obtenida con éxito')
  async getAll() {
    const compras = await this.compraService.obtenerTodas();
    if (!compras || compras.length === 0) {
      throw new NotFoundException('No se encontraron compras');
    }
    return compras;
  }

  @Get(':id')
  @Roles('admin', 'usuario')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Ver una compra por ID' })
  @ApiResponseStandard('Compra encontrada con éxito')
  async obtenerPorId(@Param('id') id: number): Promise<Compra> {
    const compra = await this.compraService.obtenerPorId(id);
    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }
    return compra;
  }

  @Post()
  @Roles('admin', 'usuario')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Crear una nueva compra' })
  @ApiResponseStandard('Compra creada con éxito')
  async create(@Body() crearCompraDto: CrearCompraDto) {
    const nuevaCompra = await this.compraService.crear(crearCompraDto);
    return nuevaCompra;
  }
}
