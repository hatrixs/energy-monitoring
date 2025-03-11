import { Module } from '@nestjs/common';
import { PrismaStatisticsRepository } from './repositories/prisma-statistics.repository';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    {
      provide: 'StatisticsRepository',
      useClass: PrismaStatisticsRepository,
    },
  ],
  exports: [StatisticsService],
})
export class StatisticsModule {}
