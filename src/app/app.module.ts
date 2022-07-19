import { CacheModule, ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config/configuration-expert';
import { TokenModule } from '../jwt-token/jwt-token.module';
import { RefreshTokenModule } from '../token-refresh/token-refresh.module';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppExceptionsFilter } from '../utils/AppExceptionsFilter';

/* TODO: update nest to v9 */

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot(config.getOrmConfig()),
    TokenModule,
    RefreshTokenModule,
    RoleModule,
    UserModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AppExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
