import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AreasModule } from './areas/areas.module';
import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './config';
import { MeasurementsModule } from './measurements/measurements.module';
import { SensorsModule } from './sensors/sensors.module';
import { StatisticsModule } from './statistics/statistics.module';
import { WorkCentersModule } from './work-centers/work-centers.module';
import { SeedModule } from './seed/seed.module';

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
    WorkCentersModule,
    AreasModule,
    SensorsModule,
    MeasurementsModule,
    StatisticsModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
