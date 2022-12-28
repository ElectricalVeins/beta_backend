import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lot])],
  controllers: [],
  providers: [],
  exports: [],
})
export class LotModule {}
