/* eslint-disable prettier/prettier */
// src/detalle-compra/entities/detalle-compra.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Compra } from '../../compras/entities/compra.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Expose, Exclude } from 'class-transformer';
import { ColumnNumericTransformer } from '../../common/transformers/column-numeric.transformer';

@Entity('detalles_compra')
export class DetalleCompra {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Compra, (compra) => compra.detallesCompra)
  @Exclude()
  compra: Compra;

  @ManyToOne(() => Producto)
  @Exclude()
  producto: Producto;

  @Column({ type: 'int' })
  @ApiProperty()
  cantidad: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @ApiProperty()
  precio: number; // Este es el precio unitario del producto

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @ApiProperty()
  subtotal: number;

  @Expose()
  @ApiProperty()
  get productoId(): number {
    return this.producto?.id;
  }

  @Expose()
  @ApiProperty()
  get precioUnitario(): number {
    return this.precio;
  }
}
