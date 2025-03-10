import { Module } from '@nestjs/common';
import { PrismaWorkCenterRepository } from './repositories/prisma-work-center.repository';
import { WorkCentersService } from './work-centers.service';

@Module({
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
