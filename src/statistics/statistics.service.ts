import { Inject, Injectable, Logger } from '@nestjs/common';
import { StatisticsRepository } from './repositories/statistics-repository.interface';
import { StatisticsFilterDto } from './dto/statistics-filter.dto';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(
    @Inject('StatisticsRepository')
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async getStatistics(filters: StatisticsFilterDto) {
    try {
      return this.statisticsRepository.getStatistics(filters);
    } catch (error) {
      this.logger.error(
        `Error al obtener estadísticas: ${error.message}`,
        error.stack,
      );
      throw new Error('Error al obtener estadísticas');
    }
  }
}
