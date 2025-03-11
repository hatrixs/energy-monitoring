import { Inject, Injectable } from '@nestjs/common';
import { WorkCenterRepository } from './repositories/work-center-repository.interface';

@Injectable()
export class WorkCentersService {
  constructor(
    @Inject('WorkCenterRepository')
    private readonly workCenterRepository: WorkCenterRepository,
  ) {}

  /**
   * Busca un centro de trabajo por nombre o lo crea si no existe
   */
  async findOrCreate(name: string) {
    return this.workCenterRepository.findOrCreate(name);
  }

  /**
   * Obtiene todos los centros de trabajo con sus áreas y sensores
   */
  async findAll() {
    return this.workCenterRepository.findAll();
  }
}
