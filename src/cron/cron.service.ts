import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenService } from '../token-refresh/token-refresh.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private refreshTokenService: RefreshTokenService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  private async deleteExpiredTokens(): Promise<void> {
    const results = await this.refreshTokenService.deleteExpiredTokens();
    this.logger.log(`${results.affected || 0} tokens was deleted`);
  }
}
