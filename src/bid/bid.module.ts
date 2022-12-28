import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid])],
  controllers: [],
  providers: [],
  exports: [],
})
export class BidModule {}
