import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Configuración del módulo JWT
 *
 * Esta función crea la configuración para el módulo JWT basada en las
 * variables de entorno. Se utiliza en la configuración asíncrona del módulo.
 *
 * @param configService Servicio de configuración inyectado
 * @returns Opciones de configuración para el módulo JWT
 */
export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.getOrThrow<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRATION', '24h'),
  },
});
