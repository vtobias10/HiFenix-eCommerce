/* eslint-disable prettier/prettier */
import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

/**
 * Decorador para respuestas estandarizadas en Swagger
 * @param description Descripción de la operación para el endpoint
 */
export function ApiResponseStandard(description: string) {
  return applyDecorators(
    ApiOperation({ summary: description }),
    ApiResponse({
      status: 200,
      description: `${description} - Éxito`,
    }),
    ApiResponse({
      status: 400,
      description: 'Solicitud incorrecta',
    }),
    ApiResponse({
      status: 404,
      description: 'No encontrado',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    })
  );
}
