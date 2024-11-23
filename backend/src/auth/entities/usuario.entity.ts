/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Compra } from '../../compras/entities/compra.entity'; // Asegúrate de tener la relación correcta

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'text' })
  @ApiProperty()
  nombre: string;

  @Column({ type: 'text', unique: true }) // Asegúrate de que el correo sea único
  @ApiProperty()
  correo: string;

  @Column({ type: 'text' })
  @ApiProperty()
  contrasena: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  esAdmin: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  direccion?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  telefono?: string;

  @OneToMany(() => Compra, (compra) => compra.usuario)
  @ApiProperty({ type: () => Compra, isArray: true })
  compras: Compra[];
}
