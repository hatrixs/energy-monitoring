import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSensorData,
  Sensor,
  SensorRepository,
} from './sensor-repository.interface';

@Injectable()
export class PrismaSensorRepository implements SensorRepository {
  private readonly logger = new Logger(PrismaSensorRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findBySensorIdAndArea(
    sensorId: string,
    areaId: string,
  ): Promise<Sensor | null> {
    try {
      return await this.prisma.sensor.findFirst({
        where: {
          sensorId,
          areaId,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar sensor por ID y área: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async create(data: CreateSensorData): Promise<Sensor> {
    try {
      return await this.prisma.sensor.create({
        data,
      });
    } catch (error) {
      this.logger.error(`Error al crear sensor: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOrCreate(data: CreateSensorData): Promise<Sensor> {
    try {
      return await this.prisma.sensor.upsert({
        where: {
          sensorId_areaId: {
            sensorId: data.sensorId,
            areaId: data.areaId,
          },
        },
        update: {},
        create: data,
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar o crear sensor: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
