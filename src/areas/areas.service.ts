import { Inject, Injectable } from '@nestjs/common';
import {
  Area,
  AreaRepository,
  CreateAreaData,
} from './repositories/area-repository.interface';

@Injectable()
export class AreasService {
  constructor(
    @Inject('AreaRepository')
    private readonly areaRepository: AreaRepository,
  ) {}

  async findOrCreate(data: CreateAreaData): Promise<Area> {
    return this.areaRepository.findOrCreate(data);
  }
}
