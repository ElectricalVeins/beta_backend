import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';
import { TransactionModule } from '../transactions/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Balance]), TransactionModule],
  controllers: [],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
