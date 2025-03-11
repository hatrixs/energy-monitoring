import { MeasurementsModule } from '@/measurements/measurements.module';
import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [MeasurementsModule],
})
export class SeedModule {}
