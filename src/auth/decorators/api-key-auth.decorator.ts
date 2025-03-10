import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Decorador para proteger rutas con autenticación por API Key
 * @returns Decorador de autenticación
 */
export function ApiKeyAuth() {
  return applyDecorators(UseGuards(AuthGuard('api-key')));
}
