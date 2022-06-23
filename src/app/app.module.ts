import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { config } from '../config/configuration-expert';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppExceptionsFilter } from '../utils/AppExceptionsFilter';
import { TransformInterceptor } from '../utils/response-transform.interceptor';

@Module({
  imports: [TypeOrmModule.forRoot(config.getOrmConfig()), RoleModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_FILTER,
      useClass: AppExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
