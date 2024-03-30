import { Injectable, Logger } from '@nestjs/common';

/* TODO: Extract cron jobs to separate microservice */

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
}
