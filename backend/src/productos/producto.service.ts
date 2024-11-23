/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async crear(crearProductoDto: CrearProductoDto): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(crearProductoDto);
    return this.productoRepository.save(nuevoProducto);
  }

  async obtenerTodos(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async obtenerPorId(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async actualizar(
    id: number,
    crearProductoDto: CrearProductoDto,
  ): Promise<Producto> {
    // Buscar el producto por ID
    const producto = await this.productoRepository.findOne({ where: { id } });

    // Verificar si el producto fue encontrado
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Actualizar las propiedades del producto
    // Asigna cada propiedad del DTO al producto encontrado
    Object.assign(producto, crearProductoDto);

    // Guardar el producto actualizado
    return this.productoRepository.save(producto);
  }

  async eliminar(id: number): Promise<boolean> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    await this.productoRepository.remove(producto);
    return true; // Devuelve true si la eliminación fue exitosa
  }
}
