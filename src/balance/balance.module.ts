import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Balance])],
  controllers: [],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
