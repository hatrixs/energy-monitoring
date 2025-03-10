import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  @IsNotEmpty()
  workCenter: string;

  @IsString()
  @IsNotEmpty()
  sensorId: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsNumber()
  @IsPositive()
  voltage: number;

  @IsNumber()
  @IsPositive()
  current: number;
}
