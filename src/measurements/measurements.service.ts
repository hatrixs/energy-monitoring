import { Inject, Injectable } from '@nestjs/common';
import { AreasService } from 'src/areas/areas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SensorsService } from 'src/sensors/sensors.service';
import { WorkCentersService } from 'src/work-centers/work-centers.service';
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
    private readonly workCentersService: WorkCentersService,
    private readonly areasService: AreasService,
    private readonly sensorsService: SensorsService,
  ) {}

  async create(createMeasurementDto: CreateMeasurementDto) {
    // Buscar o crear el centro de trabajo
    const workCenter = await this.workCentersService.findOrCreate(
      createMeasurementDto.workCenter,
    );

    // Buscar o crear el área
    const area = await this.areasService.findOrCreate({
      name: createMeasurementDto.area,
      workCenterId: workCenter.id,
    });

    // Buscar o crear el sensor
    const sensor = await this.sensorsService.findOrCreate({
      sensorId: createMeasurementDto.sensorId,
      areaId: area.id,
    });

    // Crear la medición
    const measurementDate = new Date(
      `${createMeasurementDto.date}T${createMeasurementDto.time}`,
    );

    return this.measurementRepository.create({
      voltage: createMeasurementDto.voltage,
      current: createMeasurementDto.current,
      date: measurementDate,
      sensorId: sensor.id,
    });
  }

  async findMany(filters?: FilterMeasurementsDto) {
    return this.measurementRepository.findMany(filters);
  }

  async getAggregatedMeasurements(
    filters: FilterMeasurementsDto,
    aggregationType: '15min' | 'hour' | 'day' | 'week'
  ) {
    return this.measurementRepository.getAggregatedMeasurements(filters, aggregationType);
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
