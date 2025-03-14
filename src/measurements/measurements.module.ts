import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { PrismaMeasurementRepository } from './repositories/prisma-measurement.repository';
import { MeasurementsGateway } from './measurements.gateway';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [MeasurementsController],
  providers: [
    MeasurementsService,
    MeasurementsGateway,
    {
      provide: 'MeasurementRepository',
      useClass: PrismaMeasurementRepository,
    },
  ],
  exports: [MeasurementsService],
})
export class MeasurementsModule {}
