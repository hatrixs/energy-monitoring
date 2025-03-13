import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiKeyAuth, Auth } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { FilterMeasurementsDto } from './dto/filter-measurements.dto';
import { MeasurementsService } from './measurements.service';

/**
 * API para la gestión de mediciones de consumo energético
 *
 * Proporciona endpoints para crear y consultar mediciones,
 * así como obtener estadísticas por sensor y área
 */
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  /**
   * Crea una nueva medición
   * @param createMeasurementDto DTO con los datos de la medición a crear
   * @returns La medición creada
   */
  @Post()
  @ApiKeyAuth()
  create(@Body() createMeasurementDto: CreateMeasurementDto) {
    return this.measurementsService.create(createMeasurementDto);
  }

  /**
   * Obtiene una lista paginada de mediciones aplicando filtros opcionales
   * @param filters Filtros y parámetros de paginación
   * @returns Lista paginada de mediciones que coinciden con los filtros
   */
  @Get()
  @Auth()
  async findMany(@Query() filters: FilterMeasurementsDto) {
    return this.measurementsService.findMany(filters);
  }

  /**
   * Busca una medición por su identificador
   * @param id Identificador de la medición
   * @returns La medición encontrada o null si no existe
   */
  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.measurementsService.findOne(id);
  }

  /**
   * Obtiene una lista paginada de mediciones de un sensor específico
   * @param sensorId Identificador del sensor
   * @param pagination Parámetros de paginación
   * @returns Lista paginada de mediciones del sensor
   */
  @Get('sensor/:sensorId')
  @Auth()
  findBySensor(
    @Param('sensorId') sensorId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.measurementsService.findBySensor(sensorId, pagination);
  }

  /**
   * Obtiene una lista paginada de mediciones de un área específica
   * @param areaId Identificador del área
   * @param pagination Parámetros de paginación
   * @returns Lista paginada de mediciones del área
   */
  @Get('area/:areaId')
  @Auth()
  findByArea(
    @Param('areaId') areaId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.measurementsService.findByArea(areaId, pagination);
  }

  /**
   * Obtiene una lista paginada de mediciones de un centro de trabajo específico
   * @param workCenterId Identificador del centro de trabajo
   * @param pagination Parámetros de paginación
   * @returns Lista paginada de mediciones del centro de trabajo
   */
  @Get('work-center/:workCenterId')
  @Auth()
  findByWorkCenter(
    @Param('workCenterId') workCenterId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.measurementsService.findByWorkCenter(workCenterId, pagination);
  }
}
