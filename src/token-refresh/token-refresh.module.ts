import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './token-refresh.entity';
import { RefreshTokenService } from './token-refresh.service';
import { TokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), TokenModule],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
