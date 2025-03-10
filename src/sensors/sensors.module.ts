import { Module } from '@nestjs/common';
import { PrismaSensorRepository } from './repositories/prisma-sensor.repository';
import { SensorsService } from './sensors.service';

@Module({
  providers: [
    SensorsService,
    {
      provide: 'SensorRepository',
      useClass: PrismaSensorRepository,
    },
  ],
  exports: [SensorsService],
})
export class SensorsModule {}
