import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { RefreshTokenModule } from '../token-refresh/token-refresh.module';

@Module({
  imports: [RefreshTokenModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
