import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { config } from '../config/configuration-expert';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.getOrmConfig()),
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
