/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { CrearCompraDto } from './dto/crear-compra.dto';
import { Usuario } from '../auth/entities/usuario.entity';
import { DetalleCompra } from '../detalle-compra/entities/detalle-compra.entity';
import { ProductoService } from '../productos/producto.service';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class CompraService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(DetalleCompra)
    private readonly detalleCompraRepository: Repository<DetalleCompra>,
    private readonly productoService: ProductoService,
  ) {}

  async obtenerTodas(): Promise<Compra[]> {
    return this.compraRepository.find({
      relations: ['usuario', 'detallesCompra', 'detallesCompra.producto'],
    });
  }

  async obtenerPorId(id: number): Promise<Compra> {
    const compra = await this.compraRepository.findOne({
      where: { id },
      relations: ['usuario', 'detallesCompra', 'detallesCompra.producto'],
    });
    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }
    return compra;
  }

  async crear(crearCompraDto: CrearCompraDto): Promise<Compra> {
    // Crear la compra
    const nuevaCompra: Compra = this.compraRepository.create({
      fechaCompra: crearCompraDto.fechaCompra,
      metodoPago: crearCompraDto.metodoPago,
      total: crearCompraDto.total,
      usuario: { id: crearCompraDto.usuarioId } as Usuario,
    });

    const compraGuardada = await this.compraRepository.save(nuevaCompra);

    const detallesCompra: DetalleCompra[] = [];

    for (const detalleDto of crearCompraDto.detallesCompra) {
      const producto = await this.productoService.obtenerPorId(
        detalleDto.productoId,
      );

      // Verificar stock disponible
      if (producto.stock < detalleDto.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ID ${producto.id}. Disponible: ${producto.stock}, solicitado: ${detalleDto.cantidad}.`,
        );
      }

      // Los precios ya son números gracias al transformer
      const precioProducto = producto.precio;
      const precioUnitarioRequest = detalleDto.precioUnitario;

      // Comparación considerando precisión decimal
      if (Math.abs(precioUnitarioRequest - precioProducto) > 0.0001) {
        throw new BadRequestException(
          `El precio unitario para el producto ID ${producto.id} no coincide con el precio actual.`,
        );
      }

      // Cálculo del subtotal
      const subtotalCalculado = precioProducto * detalleDto.cantidad;

      // Comparación del subtotal
      if (Math.abs(detalleDto.subtotal - subtotalCalculado) > 0.0001) {
        throw new BadRequestException(
          `El subtotal para el producto ID ${producto.id} es incorrecto.`,
        );
      }

      // Actualizar el stock del producto
      producto.stock -= detalleDto.cantidad;
      await this.productoService.actualizar(producto.id, producto);

      // Crear el detalle de compra
      const detalleCompra = new DetalleCompra();
      detalleCompra.compra = compraGuardada;
      detalleCompra.producto = producto;
      detalleCompra.cantidad = detalleDto.cantidad;
      detalleCompra.precio = precioProducto;
      detalleCompra.subtotal = subtotalCalculado;

      const detalleGuardado =
        await this.detalleCompraRepository.save(detalleCompra);
      detallesCompra.push(detalleGuardado);
    }

    compraGuardada.detallesCompra = detallesCompra;

    // Recalcular el total
    const totalCalculado = detallesCompra.reduce(
      (sum, detalle) => sum + detalle.subtotal,
      0,
    );

    if (Math.abs(compraGuardada.total - totalCalculado) > 0.0001) {
      throw new BadRequestException(
        'El total de la compra no coincide con el total calculado.',
      );
    }

    // Guardar cambios en la compra con el total recalculado
    compraGuardada.total = totalCalculado;
    await this.compraRepository.save(compraGuardada);

    // Retornar la compra con las relaciones cargadas
    return this.compraRepository.findOne({
      where: { id: compraGuardada.id },
      relations: ['usuario', 'detallesCompra', 'detallesCompra.producto'],
    });
  }
}
