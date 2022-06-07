import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { config } from '../config/configuration-expert';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot(config.getOrmConfig()), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
