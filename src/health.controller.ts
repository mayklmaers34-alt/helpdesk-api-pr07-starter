import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator.js';
import { APP_INFO, type AppInfo } from './app-info.js';

@Controller('health')
export class HealthController {
  constructor(@Inject(APP_INFO) private readonly appInfo: AppInfo) {}

  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      name: this.appInfo.name,
      version: this.appInfo.version,
    };
  }
}