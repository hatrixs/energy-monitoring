import { Inject, Injectable } from '@nestjs/common';
import {
  CreateSensorData,
  Sensor,
  SensorRepository,
} from './repositories/sensor-repository.interface';

@Injectable()
export class SensorsService {
  constructor(
    @Inject('SensorRepository')
    private readonly sensorRepository: SensorRepository,
  ) {}

  async findOrCreate(data: CreateSensorData): Promise<Sensor> {
    return this.sensorRepository.findOrCreate(data);
  }
}
