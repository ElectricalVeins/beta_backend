import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';

import config from '../config/configuration-expert';
import { AppExceptionsFilter } from '../utils/AppExceptionsFilter';
import { TokenModule } from './jwt-token/jwt-token.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      host: config.get('redis.host'),
      port: config.get('redis.port'),
    }),
    TypeOrmModule.forRoot(config.getOrmConfig()),
    AuthModule,
    TokenModule,
    MailModule,
    ApplicationModule,
  ],
  providers: [
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
