import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealthIndicator: MongooseHealthIndicator
  ) { }

  @Get()
  @HealthCheck()
  @ApiExcludeEndpoint()
  check() {
    return this.health.check([
      () =>
        this.mongooseHealthIndicator.pingCheck('MongoDB'),
    ]);
  }
}
