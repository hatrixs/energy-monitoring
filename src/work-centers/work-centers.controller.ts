import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { WorkCentersService } from './work-centers.service';

@Controller('work-centers')
export class WorkCentersController {
  constructor(private readonly workCentersService: WorkCentersService) {}

  @Get()
  @Auth()
  findAll() {
    return this.workCentersService.findAll();
  }
}
