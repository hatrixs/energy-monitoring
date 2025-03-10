import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow requests from other domains
  app.enableCors();

  // Set a global 'api' prefix for all routes (e.g., /api/users)
  app.setGlobalPrefix('api');

  // Configure global class serializer interceptor
  // This interceptor automatically transforms responses based on decorators
  // like @Exclude(), @Expose() in entities/DTOs
  // Useful for hiding sensitive properties (passwords, private data, etc.)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configure global validation pipe for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      // Removes properties that are not defined in DTOs
      whitelist: true,

      // Completely rejects requests containing properties not defined in DTOs
      // Returns 400 (Bad Request) error if additional properties are present
      forbidNonWhitelisted: true,

      // Automatically transforms input data to the type defined in DTOs
      // Example: converts "123" (string) to 123 (number) if the DTO expects a number
      transform: true,

      transformOptions: {
        // Enables implicit type conversion without requiring additional decorators
        enableImplicitConversion: true,
      },
    }),
  );

  // Start the server on the specified port or default to 3000
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
