import { Controller, Get } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('token')
  async generateToken() {
    return await this.coreService.generateAccessToken();
  }

  @Get('register')
  async registerUrl() {
    return await this.coreService.registerUrl();
  }

  @Get('simulate')
  async sumulate() {
    return await this.coreService.simulateC2B();
  }
}
