import { Module } from '@nestjs/common';
import { WorkCentersController } from './work-centers.controller';
import { WorkCentersService } from './work-centers.service';
import { PrismaWorkCenterRepository } from './repositories/prisma-work-center.repository';

@Module({
  controllers: [WorkCentersController],
  providers: [
    WorkCentersService,
    {
      provide: 'WorkCenterRepository',
      useClass: PrismaWorkCenterRepository,
    },
  ],
  exports: [WorkCentersService],
})
export class WorkCentersModule {}
