import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StatisticsRepository } from './statistics-repository.interface';
import { StatisticsFilterDto } from '../dto/statistics-filter.dto';

@Injectable()
export class PrismaStatisticsRepository implements StatisticsRepository {
  private readonly logger = new Logger(PrismaStatisticsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStatistics(filters: StatisticsFilterDto) {
    try {
      const { startDate, endDate, sensorId, areaId, workCenterId } = filters;

      const whereClause = {
        ...(startDate &&
          !endDate && {
            date: {
              gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
              lt: new Date(new Date(startDate).setHours(23, 59, 59, 999)),
            },
          }),
        ...(startDate &&
          endDate && {
            date: {
              gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
              lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            },
          }),
        ...(sensorId && { sensorId }),
        ...(areaId && { sensor: { areaId } }),
        ...(workCenterId && { sensor: { area: { workCenterId } } }),
      };

      // Obtener estadísticas básicas
      const basicStats = await this.prisma.measurement.aggregate({
        where: whereClause,
        _avg: {
          voltage: true,
          current: true,
        },
        _max: {
          voltage: true,
          current: true,
        },
        _min: {
          voltage: true,
          current: true,
        },
      });

      return {
        voltage: {
          avg: basicStats._avg.voltage || 0,
          max: basicStats._max.voltage || 0,
          min: basicStats._min.voltage || 0,
        },
        current: {
          avg: basicStats._avg.current || 0,
          max: basicStats._max.current || 0,
          min: basicStats._min.current || 0,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener estadísticas: ${error.message}`,
        error.stack,
      );
      throw new Error('Error al obtener estadísticas');
    }
  }
}
