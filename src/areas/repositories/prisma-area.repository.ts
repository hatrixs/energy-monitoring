import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  Area,
  AreaRepository,
  CreateAreaData,
} from './area-repository.interface';

@Injectable()
export class PrismaAreaRepository implements AreaRepository {
  private readonly logger = new Logger(PrismaAreaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(data: CreateAreaData): Promise<Area> {
    try {
      return await this.prisma.area.upsert({
        where: {
          name_workCenterId: {
            name: data.name,
            workCenterId: data.workCenterId,
          },
        },
        update: {},
        create: data,
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar o crear área: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
