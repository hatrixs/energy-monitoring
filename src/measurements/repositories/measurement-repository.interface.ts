import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FilterMeasurementsDto } from '../dto/filter-measurements.dto';

/**
 * Representa una medición de consumo energético
 */
export interface Measurement {
  /** Identificador único de la medición */
  id: string;
  /** Voltaje medido en Voltios (V) */
  voltage: number;
  /** Corriente medida en Amperios (A) */
  current: number;
  /** Fecha y hora de la medición */
  date: Date;
  /** Información del sensor y sus relaciones */
  sensor?: {
    id: string;
    sensorId: string;
    area?: {
      id: string;
      name: string;
      workCenter?: {
        id: string;
        name: string;
      };
    };
  };
}

export interface CreateMeasurementData {
  voltage: number;
  current: number;
  date: Date;
  sensorId: string;
}

export interface AggregatedMeasurement {
  timestamp: Date;
  voltage: number;
  current: number;
  count: number;
}

export interface CreateMeasurementWithRelationsData {
  workCenter: string;
  area: string;
  sensorId: string;
  voltage: number;
  current: number;
  date: Date;
}

export interface MeasurementRepository {
  /**
   * Crea una nueva medición en la base de datos
   * @param data Datos de la medición a crear
   * @returns La medición creada
   */
  create(data: CreateMeasurementData): Promise<Measurement>;

  /**
   * Crea una nueva medición en la base de datos junto con sus relaciones
   * @param data Datos de la medición y sus relaciones a crear
   * @returns La medición creada
   */
  createWithRelations(data: CreateMeasurementWithRelationsData): Promise<Measurement>;

  /**
   * Busca mediciones aplicando filtros y paginación
   * @param filter Filtros y parámetros de paginación
   * @returns Lista paginada de mediciones que coinciden con los filtros
   */
  findMany(
    filter?: FilterMeasurementsDto,
  ): Promise<PaginatedResponse<Measurement>>;

  /**
   * Busca una medición por su identificador
   * @param id Identificador de la medición
   * @returns La medición encontrada o null si no existe
   */
  findOne(id: string): Promise<Measurement | null>;

  /**
   * Busca mediciones de un sensor específico
   * @param sensorId Identificador del sensor
   * @param pagination Parámetros de paginación
   * @returns Lista paginada de mediciones del sensor
   */
  findBySensor(
    sensorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Measurement>>;

  /**
   * Busca mediciones de un área específica
   * @param areaId Identificador del área
   * @param pagination Parámetros de paginación
   * @returns Lista paginada de mediciones del área
   */
  findByArea(
    areaId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Measurement>>;

  /**
   * Busca mediciones de un centro de trabajo específico
   * @param workCenterId Identificador del centro de trabajo
   * @param pagination Parámetros de paginación
   * @returns Lista paginada de mediciones del centro de trabajo
   */
  findByWorkCenter(
    workCenterId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Measurement>>;
}
