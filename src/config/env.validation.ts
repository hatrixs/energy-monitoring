import * as Joi from 'joi';

/**
 * Esquema de validación para las variables de entorno
 *
 * Este esquema define las reglas de validación para todas las variables
 * de entorno utilizadas en la aplicación. Cualquier variable no definida
 * aquí será ignorada por la aplicación.
 */
export const envValidationSchema = Joi.object({
  // Variables de base de datos
  DATABASE_URL: Joi.string()
    .required()
    .description('URL de conexión a la base de datos MongoDB'),

  // Variables de autenticación
  JWT_SECRET: Joi.string()
    .required()
    .description('Clave secreta para firmar los tokens JWT'),
  JWT_EXPIRATION: Joi.string()
    .default('24h')
    .description(
      'Tiempo de expiración de los tokens JWT (formato: 1d, 10h, etc.)',
    ),

  // Variables de servidor
  PORT: Joi.number()
    .default(3000)
    .description('Puerto en el que se ejecutará el servidor'),
});
