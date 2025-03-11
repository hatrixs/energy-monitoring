import { IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterMeasurementsDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  sensorId?: string;

  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsString()
  workCenterId?: string;

  @IsOptional()
  @IsEnum(['15min', 'hour', 'day', 'week'])
  aggregationType?: '15min' | 'hour' | 'day' | 'week';
}
