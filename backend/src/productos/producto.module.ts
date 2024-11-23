/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { Producto } from './entities/producto.entity';
import { JwtModule } from '@nestjs/jwt'; // Asegúrate de que JwtModule esté importado
import { ConfigModule, ConfigService } from '@nestjs/config';

/* eslint-disable prettier/prettier */
@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION')},
      }),
    }),
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}

