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
      return await this.prisma.workCenter.findUnique({
        where: { name },
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar centro de trabajo por nombre: ${error.message}`,
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
      return await this.prisma.workCenter.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar o crear centro de trabajo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
