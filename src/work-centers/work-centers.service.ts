import { Inject, Injectable } from '@nestjs/common';
import {
  WorkCenter,
  WorkCenterRepository,
} from './repositories/work-center-repository.interface';

@Injectable()
export class WorkCentersService {
  constructor(
    @Inject('WorkCenterRepository')
    private readonly workCenterRepository: WorkCenterRepository,
  ) {}

  async findOrCreate(name: string): Promise<WorkCenter> {
    return this.workCenterRepository.findOrCreate(name);
  }
}
