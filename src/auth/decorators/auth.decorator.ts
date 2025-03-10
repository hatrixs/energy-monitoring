import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Decorador para proteger rutas con autenticación por JWT
 * @returns Decorador de autenticación
 */
export function Auth() {
  return applyDecorators(UseGuards(AuthGuard('jwt')));
}
