import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [TokenModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
