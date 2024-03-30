import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotTag } from './lot-tag.entity';
import { LotTagService } from './lot-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([LotTag])],
  controllers: [],
  providers: [LotTagService],
  exports: [LotTagService],
})
export class LotTagModule {}
