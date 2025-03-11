import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  WorkCenter,
  WorkCenterRepository,
} from './work-center-repository.interface';

@Injectable()
export class PrismaWorkCenterRepository implements WorkCenterRepository {
  private readonly logger = new Logger(PrismaWorkCenterRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<WorkCenter | null> {
    try {
      return await this.prisma.workCenter.findFirst({ where: { name } });
    } catch (error) {
      this.logger.error(
        `Error al buscar centro de trabajo: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async create(name: string): Promise<WorkCenter> {
    try {
      return await this.prisma.workCenter.create({
        data: { name },
      });
    } catch (error) {
      this.logger.error(
        `Error al crear centro de trabajo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOrCreate(name: string): Promise<WorkCenter> {
    try {
      let workCenter = await this.findByName(name);
      if (!workCenter) {
        workCenter = await this.create(name);
      }
      return workCenter;
    } catch (error) {
      this.logger.error(
        `Error al buscar/crear centro de trabajo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<WorkCenter[]> {
    try {
      return await this.prisma.workCenter.findMany({
        include: {
          areas: {
            include: {
              sensors: {
                select: {
                  id: true,
                  sensorId: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Error al obtener centros de trabajo: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}
