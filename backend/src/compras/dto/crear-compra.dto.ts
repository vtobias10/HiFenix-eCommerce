/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsNumber, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleCompraDto } from '../../detalle-compra/dto/detalle-compra.dto';

export class CrearCompraDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la compra',
    example: 1,
  })
  @IsNumber()
  usuarioId: number;

  @ApiProperty({
    description: 'Fecha en la que se realizó la compra',
    example: '2024-11-05T10:30:00Z',
  })
  @IsDate()
  fechaCompra: Date;

  @ApiProperty({
    description: 'Método de pago utilizado para la compra',
    example: 'Tarjeta de crédito',
  })
  @IsString()
  metodoPago: string;

  @ApiProperty({
    description: 'Total de la compra en la moneda definida por el sistema',
    example: 150.75,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Detalles de la compra',
    type: [DetalleCompraDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleCompraDto)
  detallesCompra: DetalleCompraDto[];
}
