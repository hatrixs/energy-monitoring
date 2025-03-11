import { StatisticsFilterDto } from '../dto/statistics-filter.dto';

export interface StatisticsRepository {
  /**
   * Calcula estadísticas energéticas aplicando filtros
   * @param filters Filtros de estadísticas
   * @returns Estadísticas energéticas detalladas
   */
  getStatistics(filters: StatisticsFilterDto): Promise<{
    voltage: {
      avg: number;
      max: number;
      min: number;
    };
    current: {
      avg: number;
      max: number;
      min: number;
    };
  }>;
}
