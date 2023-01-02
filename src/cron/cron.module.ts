import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { RefreshTokenModule } from '../token-refresh/token-refresh.module';
import { LotModule } from '../lot/lot.module';

@Module({
  imports: [RefreshTokenModule, LotModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
