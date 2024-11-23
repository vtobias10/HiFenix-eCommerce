/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DetalleCompraController } from './detalle-compra.controller';
import { DetalleCompraService } from './detalle-compra.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { JwtModule } from '@nestjs/jwt'; // Asegúrate de importar JwtModule
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompraModule } from '../compras/compra.module'; // Importa CompraModule
import { ProductoModule } from '../productos/producto.module'; // Importa ProductoModule aquí

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleCompra]),
    CompraModule,  // Asegúrate de que CompraModule esté importado
    ProductoModule, // Agrega ProductoModule para que ProductoService esté disponible
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION')},
      }),
    }),
  ],
  controllers: [DetalleCompraController],
  providers: [DetalleCompraService],
})
export class DetalleCompraModule {}
