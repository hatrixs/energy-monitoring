import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FilterMeasurementsDto } from '../dto/filter-measurements.dto';
import {
  Measurement,
  MeasurementRepository,
  CreateMeasurementData,
  CreateMeasurementWithRelationsData,
} from './measurement-repository.interface';

@Injectable()
export class PrismaMeasurementRepository implements MeasurementRepository {
  private readonly logger = new Logger(PrismaMeasurementRepository.name);

  private readonly measurementSelect = {
    id: true,
    voltage: true,
    current: true,
    date: true,
    sensor: {
      select: {
        id: true,
        sensorId: true,
        area: {
          select: {
            id: true,
            name: true,
            workCenter: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    },
  } as const;

  /**
   * Convierte una fecha en formato string (YYYY-MM-DD) a Date configurada al inicio del día (00:00:00)
   */
  private createStartOfDay(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  /**
   * Convierte una fecha en formato string (YYYY-MM-DD) a Date configurada al final del día (23:59:59)
   */
  private createEndOfDay(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMeasurementData): Promise<Measurement> {
    try {
      const measurement = await this.prisma.measurement.create({
        data,
      });

      return measurement;
    } catch (error) {
      this.logger.error(
        `Error al crear medición: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createWithRelations(
    data: CreateMeasurementWithRelationsData,
  ): Promise<Measurement> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Buscar o crear el centro de trabajo
        const workCenter = await tx.workCenter.upsert({
          where: { name: data.workCenter },
          update: {},
          create: { name: data.workCenter },
        });

        // Buscar o crear el área
        const area = await tx.area.upsert({
          where: {
            name_workCenterId: {
              name: data.area,
              workCenterId: workCenter.id,
            },
          },
          update: {},
          create: {
            name: data.area,
            workCenterId: workCenter.id,
          },
        });

        // Buscar o crear el sensor
        const sensor = await tx.sensor.upsert({
          where: {
            sensorId_areaId: {
              sensorId: data.sensorId,
              areaId: area.id,
            },
          },
          update: {},
          create: {
            sensorId: data.sensorId,
            areaId: area.id,
          },
        });

        // Crear la medición
        const measurement = await tx.measurement.create({
          data: {
            voltage: data.voltage,
            current: data.current,
            date: data.date,
            sensorId: sensor.id,
          },
          select: this.measurementSelect,
        });

        return measurement;
      });
    } catch (error) {
      this.logger.error(
        `Error al crear medición con relaciones: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findMany(
    filter?: FilterMeasurementsDto,
  ): Promise<PaginatedResponse<Measurement>> {
    try {
      const where: any = {};

      if (filter) {
        // Manejo de filtros de fecha
        if (filter.startDate && filter.endDate) {
          where.date = {
            gte: this.createStartOfDay(filter.startDate),
            lte: this.createEndOfDay(filter.endDate),
          };
        } else if (filter.startDate) {
          where.date = {
            gte: this.createStartOfDay(filter.startDate),
            lte: this.createEndOfDay(filter.startDate),
          };
        } else if (filter.endDate) {
          where.date = {
            lte: this.createEndOfDay(filter.endDate),
          };
        }

        if (filter.sensorId) {
          where.sensorId = filter.sensorId;
        }

        if (filter.areaId || filter.workCenterId) {
          const sensorWhere: any = {};

          if (filter.areaId) {
            sensorWhere.areaId = filter.areaId;
          }

          if (filter.workCenterId) {
            sensorWhere.area = {
              workCenterId: filter.workCenterId,
            };
          }

          where.sensor = sensorWhere;
        }
      }

      const [total, data] = await Promise.all([
        this.prisma.measurement.count({ where }),
        this.prisma.measurement.findMany({
          where,
          skip: filter?.skip || 0,
          take: filter?.limit || 10,
          select: this.measurementSelect,
        }),
      ]);

      const page = filter?.page || 1;
      const limit = filter?.limit || 10;
      const lastPage = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          page,
          lastPage,
          hasNextPage: page < lastPage,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar mediciones: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Measurement | null> {
    try {
      return await this.prisma.measurement.findUnique({
        where: { id },
        select: this.measurementSelect,
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar medición por ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findBySensor(
    sensorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Measurement>> {
    try {
      const [total, data] = await Promise.all([
        this.prisma.measurement.count({
          where: { sensorId },
        }),
        this.prisma.measurement.findMany({
          where: { sensorId },
          skip: pagination.skip,
          take: pagination.limit,
          select: this.measurementSelect,
        }),
      ]);

      const lastPage = Math.ceil(total / pagination.limit);

      return {
        data,
        meta: {
          total,
          page: pagination.page,
          lastPage,
          hasNextPage: pagination.page < lastPage,
          hasPreviousPage: pagination.page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar mediciones por sensor: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByArea(
    areaId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Measurement>> {
    try {
      const [total, data] = await Promise.all([
        this.prisma.measurement.count({
          where: {
            sensor: {
              areaId,
            },
          },
        }),
        this.prisma.measurement.findMany({
          where: {
            sensor: {
              areaId,
            },
          },
          skip: pagination.skip,
          take: pagination.limit,
          select: this.measurementSelect,
        }),
      ]);

      const lastPage = Math.ceil(total / pagination.limit);

      return {
        data,
        meta: {
          total,
          page: pagination.page,
          lastPage,
          hasNextPage: pagination.page < lastPage,
          hasPreviousPage: pagination.page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar mediciones por área: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByWorkCenter(
    workCenterId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Measurement>> {
    try {
      const [total, data] = await Promise.all([
        this.prisma.measurement.count({
          where: {
            sensor: {
              area: {
                workCenterId,
              },
            },
          },
        }),
        this.prisma.measurement.findMany({
          where: {
            sensor: {
              area: {
                workCenterId,
              },
            },
          },
          skip: pagination.skip,
          take: pagination.limit,
          select: this.measurementSelect,
        }),
      ]);

      const lastPage = Math.ceil(total / pagination.limit);

      return {
        data,
        meta: {
          total,
          page: pagination.page,
          lastPage,
          hasNextPage: pagination.page < lastPage,
          hasPreviousPage: pagination.page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar mediciones por centro de trabajo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
