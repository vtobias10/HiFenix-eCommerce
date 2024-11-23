/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { DetalleCompraService } from './detalle-compra.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DetalleCompraDto } from './dto/detalle-compra.dto';
import { RolesGuard } from '../auth/roles.guards';
import { Roles } from '../auth/roles.decorador';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiResponseStandard } from '../common/api-response.decorator';

@ApiTags('detalles-compra')
@Controller('detalles-compra')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DetalleCompraController {
  constructor(private readonly detalleCompraService: DetalleCompraService) {}

  @Get()
  @Roles('admin', 'usuario')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lista de detalles de compras' })
  @ApiResponseStandard('Lista de detalles de compra obtenida con éxito')
  async getAll() {
    const detalles = await this.detalleCompraService.obtenerTodos();
    if (!detalles || detalles.length === 0) {
      throw new NotFoundException('No se encontraron detalles de compra');
    }
    return detalles;
  }

  @Post()
  @Roles('admin', 'usuario')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Crea un detalle de compra' })
  @ApiResponseStandard('Detalle de compra creado con éxito')
  async create(@Body() crearDetalleCompraDto: DetalleCompraDto) {
    return await this.detalleCompraService.crear(crearDetalleCompraDto);
  }
}
