import { Module } from '@nestjs/common';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { PrismaMeasurementRepository } from './repositories/prisma-measurement.repository';

@Module({
  controllers: [MeasurementsController],
  providers: [
    MeasurementsService,
    {
      provide: 'MeasurementRepository',
      useClass: PrismaMeasurementRepository,
    },
  ],
  exports: [MeasurementsService],
})
export class MeasurementsModule {}
