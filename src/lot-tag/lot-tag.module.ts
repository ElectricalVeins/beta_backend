import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotTag } from './lot-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LotTag])],
  controllers: [],
  providers: [],
  exports: [],
})
export class LotTagModule {}
