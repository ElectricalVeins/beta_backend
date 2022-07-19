import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { RefreshTokenModule } from '../token-refresh/token-refresh.module';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [TokenModule, PassportModule, RefreshTokenModule, UserModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
