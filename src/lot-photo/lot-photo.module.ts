import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotPhoto } from './lot-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LotPhoto])],
  controllers: [],
  providers: [],
  exports: [],
})
export class LotPhotoModule {}
