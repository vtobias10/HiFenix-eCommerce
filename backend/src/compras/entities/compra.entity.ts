/* eslint-disable prettier/prettier */
// src/compras/entities/compra.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../auth/entities/usuario.entity';
import { DetalleCompra } from '../../detalle-compra/entities/detalle-compra.entity';
import { Type } from 'class-transformer';
import { ColumnNumericTransformer } from '../../common/transformers/column-numeric.transformer';

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.compras)
  @ApiProperty({ type: () => Usuario })
  @Type(() => Usuario)
  usuario: Usuario;

  @Column({ type: 'timestamp' })
  @ApiProperty()
  fechaCompra: Date;

  @Column({ type: 'text' })
  @ApiProperty()
  metodoPago: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @ApiProperty()
  total: number;

  @OneToMany(() => DetalleCompra, (detalleCompra) => detalleCompra.compra)
  @ApiProperty({ type: () => DetalleCompra, isArray: true })
  @Type(() => DetalleCompra)
  detallesCompra: DetalleCompra[];
}
