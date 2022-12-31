import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotPhoto } from './lot-photo.entity';
import { LotPhotoService } from './lot-photo.service';

@Module({
  imports: [TypeOrmModule.forFeature([LotPhoto])],
  controllers: [],
  providers: [LotPhotoService],
  exports: [LotPhotoService],
})
export class LotPhotoModule {}
