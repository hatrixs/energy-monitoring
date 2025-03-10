import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { PrismaAreaRepository } from './repositories/prisma-area.repository';

@Module({
  providers: [
    AreasService,
    {
      provide: 'AreaRepository',
      useClass: PrismaAreaRepository,
    },
  ],
  exports: [AreasService],
})
export class AreasModule {}
