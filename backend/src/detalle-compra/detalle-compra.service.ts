/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DetalleCompraDto } from './dto/detalle-compra.dto';
import { ProductoService } from '../productos/producto.service';
import { CompraService } from '../compras/compra.service';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DetalleCompraService {
  constructor(
    private readonly compraService: CompraService,
    private readonly productoService: ProductoService,
    @InjectRepository(DetalleCompra)
    private readonly detalleCompraRepository: Repository<DetalleCompra>,
  ) {}

  async obtenerTodos(): Promise<DetalleCompra[]> {
    return this.detalleCompraRepository.find();
  }

  async crear(crearDetalleCompraDto: DetalleCompraDto): Promise<DetalleCompra> {
    // Obtener el producto
    const producto = await this.productoService.obtenerPorId(
      crearDetalleCompraDto.productoId,
    );

    // Crear el detalle de compra
    const detalleCompra = new DetalleCompra();
    detalleCompra.producto = producto;
    detalleCompra.cantidad = crearDetalleCompraDto.cantidad;
    detalleCompra.precio = crearDetalleCompraDto.precioUnitario;
    detalleCompra.subtotal = crearDetalleCompraDto.subtotal;

    // Guardar el detalle de compra en la base de datos
    return this.detalleCompraRepository.save(detalleCompra);
  }
}
