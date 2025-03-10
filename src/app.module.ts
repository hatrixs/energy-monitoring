import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './config';
import { MeasurementsModule } from './measurements/measurements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MeasurementsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
