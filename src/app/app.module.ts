import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { config } from '../config/configuration-expert';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppExceptionsFilter } from '../utils/AppExceptionsFilter';
import { RefreshTokenModule } from '../token-refresh/token-refresh.module';

@Module({
  imports: [TypeOrmModule.forRoot(config.getOrmConfig()), RoleModule, UserModule, AuthModule, RefreshTokenModule],
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
