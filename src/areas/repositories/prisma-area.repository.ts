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

  async findByNameAndWorkCenter(
    name: string,
    workCenterId: string,
  ): Promise<Area | null> {
    try {
      return await this.prisma.area.findFirst({
        where: {
          name,
          workCenterId,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar área por nombre y centro de trabajo: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async create(data: CreateAreaData): Promise<Area> {
    try {
      return await this.prisma.area.create({
        data,
      });
    } catch (error) {
      this.logger.error(`Error al crear área: ${error.message}`, error.stack);
      throw error;
    }
  }

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
