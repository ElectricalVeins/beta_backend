import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './token-access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessToken])],
  providers: [],
  exports: [],
})
export class AccessTokenModule {}
