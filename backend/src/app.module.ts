/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleCompraModule } from './detalle-compra/detalle-compra.module';
import { CompraModule } from './compras/compra.module';
import { UsuarioModule } from './auth/usuario.module';
import { DetalleCompra } from './detalle-compra/entities/detalle-compra.entity';
import { Compra } from './compras/entities/compra.entity';
import { Usuario } from './auth/entities/usuario.entity';
import { Producto } from './productos/entities/producto.entity';
import { ProductoModule } from './productos/producto.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [DetalleCompra, Compra, Usuario, Producto],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    DetalleCompraModule,
    CompraModule,
    UsuarioModule,
    ProductoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
