import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FilterMeasurementsDto } from '../dto/filter-measurements.dto';
import {
  CreateMeasurementData,
  Measurement,
  MeasurementRepository,
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

  async findMany(
    filter?: FilterMeasurementsDto,
  ): Promise<PaginatedResponse<Measurement>> {
    try {
      const where: any = {};

      if (filter) {
        if (filter.startDate && filter.endDate) {
          where.date = {
            gte: new Date(filter.startDate),
            lte: new Date(filter.endDate),
          };
        } else if (filter.startDate) {
          where.date = {
            gte: new Date(filter.startDate),
          };
        } else if (filter.endDate) {
          where.date = {
            lte: new Date(filter.endDate),
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
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          lastPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
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
      return null;
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
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          lastPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
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
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          lastPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
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
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          lastPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  }
}
