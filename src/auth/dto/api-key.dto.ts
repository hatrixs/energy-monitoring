import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'Nombre descriptivo de la API Key',
    example: 'Sensor Centro 1',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({
    description: 'Descripción opcional de la API Key',
    example: 'API Key para los sensores del Centro de Trabajo 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(0, 255)
  description?: string;
}
