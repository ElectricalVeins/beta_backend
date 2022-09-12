import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { config } from '../config/configuration-expert';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppExceptionsFilter } from '../utils/AppExceptionsFilter';
import { TokenModule } from '../jwt-token/jwt-token.module';
import { RefreshTokenModule } from '../token-refresh/token-refresh.module';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { CronModule } from '../cron/cron.module';
import { TierModule } from '../tier/tier.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: config.get('redis.host'),
      port: config.get('redis.port'),
    }),
    TypeOrmModule.forRoot(config.getOrmConfig()),
    ScheduleModule.forRoot(),
    TokenModule,
    RefreshTokenModule,
    RoleModule,
    UserModule,
    AuthModule,
    MailModule,
    CronModule,
    TierModule,
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
