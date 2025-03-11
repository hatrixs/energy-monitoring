import { IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * DTO para filtrar estadísticas energéticas
 */
export class StatisticsFilterDto {
  /**
   * Fecha de inicio del período
   * @example '2024-03-01T00:00:00.000Z'
   */
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /**
   * Fecha de fin del período
   * @example '2024-03-31T23:59:59.999Z'
   */
  @IsOptional()
  @IsDateString()
  endDate?: string;

  /**
   * ID del sensor (opcional)
   */
  @IsOptional()
  @IsString()
  sensorId?: string;

  /**
   * ID del área (opcional)
   */
  @IsOptional()
  @IsString()
  areaId?: string;

  /**
   * ID del centro de trabajo (opcional)
   */
  @IsOptional()
  @IsString()
  workCenterId?: string;
}
