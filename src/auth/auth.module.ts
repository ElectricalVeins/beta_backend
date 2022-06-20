import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config/configuration-expert';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: config.get('app.jwt.secret'),
      signOptions: { expiresIn: config.get('app.jwt.timeAccess') },
    }),
    PassportModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
