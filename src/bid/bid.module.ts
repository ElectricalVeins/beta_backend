import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { LotModule } from '../lot/lot.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bid]), LotModule],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService],
})
export class BidModule {}
