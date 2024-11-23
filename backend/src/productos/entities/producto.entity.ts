/* eslint-disable prettier/prettier */
// src/productos/entities/producto.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ColumnNumericTransformer } from '../../common/transformers/column-numeric.transformer';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'text' })
  @ApiProperty()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  descripcion: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @ApiProperty()
  precio: number;

  @Column({ type: 'int' })
  @ApiProperty()
  stock: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  imagenUrl: string;
}
