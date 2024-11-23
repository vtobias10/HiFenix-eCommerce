/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DetalleCompraDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsNumber()
  productoId: number;

  @ApiProperty({
    description: 'Cantidad de productos comprados',
    example: 3,
  })
  @IsNumber()
  cantidad: number;

  @ApiProperty({
    description: 'Precio unitario del producto en la moneda definida por el sistema',
    example: 50.25,
  })
  @IsNumber()
  precioUnitario: number;

  @ApiProperty({
    description: 'Subtotal calculado (cantidad * precio unitario)',
    example: 150.75,
  })
  @IsNumber()
  subtotal: number;
}
