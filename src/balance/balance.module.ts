import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';
import { TransactionModule } from '../transactions/transaction.module';
import { BalanceController } from './balance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Balance]), TransactionModule],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
