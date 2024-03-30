import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  @ApiOperation({ summary: 'Check application state' })
  async healthCheck(): Promise<string> {
    return 'ok';
  }
}
