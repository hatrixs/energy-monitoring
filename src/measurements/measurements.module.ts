import { Module } from '@nestjs/common';
import { AreasModule } from 'src/areas/areas.module';
import { SensorsModule } from 'src/sensors/sensors.module';
import { WorkCentersModule } from 'src/work-centers/work-centers.module';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { PrismaMeasurementRepository } from './repositories/prisma-measurement.repository';

@Module({
  imports: [WorkCentersModule, AreasModule, SensorsModule],
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
