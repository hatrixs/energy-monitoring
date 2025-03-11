import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { StatisticsService } from './statistics.service';
import { StatisticsFilterDto } from './dto/statistics-filter.dto';


@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * Obtiene estadísticas de voltaje y corriente aplicando filtros
   * @param filters Filtros de estadísticas
   * @returns Promedios de voltaje y corriente
   */
  @Get()
  @Auth()
  getStatistics(@Query() filters: StatisticsFilterDto) {
    return this.statisticsService.getStatistics(filters);
  }
}
