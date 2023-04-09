import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-store';
import config from '../config/configuration-expert';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppExceptionsFilter } from '../utils/AppExceptionsFilter';
import { TokenModule } from '../jwt-token/jwt-token.module';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { CronModule } from '../cron/cron.module';
import { TierModule } from '../tier/tier.module';
import { BalanceModule } from '../balance/balance.module';
import { LotModule } from '../lot/lot.module';
import { LotTagModule } from '../lot-tag/lot-tag.module';
import { BidModule } from '../bid/bid.module';
import { S3Module } from '../s3/s3.module';
import { LotPhotoModule } from '../lot-photo/lot-photo.module';
import { TransactionModule } from '../transactions/transaction.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      host: config.get('redis.host'),
      port: config.get('redis.port'),
    }),
    TypeOrmModule.forRoot(config.getOrmConfig()),
    ScheduleModule.forRoot(),
    AuthModule,
    TierModule,
    UserModule,
    TokenModule,
    MailModule,
    CronModule,
    RoleModule,
    BalanceModule,
    TransactionModule,
    S3Module,
    /*Auction core modules*/
    LotTagModule,
    LotPhotoModule,
    BidModule,
    LotModule,
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
