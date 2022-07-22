import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './jwt-token.service';
import { config } from '../config/configuration-expert';

@Module({
  imports: [
    JwtModule.register({
      secret: config.get('app.jwt.secret'),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
