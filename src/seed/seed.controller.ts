import { Auth } from '@/auth/decorators';
import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Auth()
  populate() {
    this.seedService.populate();
    return {
      message: 'Proceso de población iniciado',
    };
  }
}
