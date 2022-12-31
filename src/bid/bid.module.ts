import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { LotModule } from '../lot/lot.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bid]), LotModule, BalanceModule],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService],
})
export class BidModule {}
