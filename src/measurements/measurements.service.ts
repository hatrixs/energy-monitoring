import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { FilterMeasurementsDto } from './dto/filter-measurements.dto';
import { MeasurementRepository } from './repositories/measurement-repository.interface';

/**
 * Servicio que implementa la lógica de negocio para la gestión de mediciones
 * delegando las operaciones de persistencia al repositorio
 */
@Injectable()
export class MeasurementsService {
  constructor(
    @Inject('MeasurementRepository')
    private readonly measurementRepository: MeasurementRepository,
  ) {}

  async create(createMeasurementDto: CreateMeasurementDto) {
    const measurementDate = new Date(
      `${createMeasurementDto.date}T${createMeasurementDto.time}`,
    );

    return this.measurementRepository.createWithRelations({
      workCenter: createMeasurementDto.workCenter,
      area: createMeasurementDto.area,
      sensorId: createMeasurementDto.sensorId,
      voltage: createMeasurementDto.voltage,
      current: createMeasurementDto.current,
      date: measurementDate,
    });
  }

  async findMany(filters?: FilterMeasurementsDto) {
    return this.measurementRepository.findMany(filters);
  }

  async findOne(id: string) {
    return this.measurementRepository.findOne(id);
  }

  async findBySensor(sensorId: string, pagination: PaginationDto) {
    return this.measurementRepository.findBySensor(sensorId, pagination);
  }

  async findByArea(areaId: string, pagination: PaginationDto) {
    return this.measurementRepository.findByArea(areaId, pagination);
  }

  async findByWorkCenter(workCenterId: string, pagination: PaginationDto) {
    return this.measurementRepository.findByWorkCenter(
      workCenterId,
      pagination,
    );
  }
}
