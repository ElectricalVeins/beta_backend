import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Balance } from './balance.entity';
import { Bid } from '../bid/bid.entity';

@Injectable()
export class BalanceService {
  async checkUserBalance(
    userId: number,
    actualBids: Bid[],
    newBid: number,
    transaction: EntityManager
  ): Promise<boolean> {
    const blockedAmount = Number(newBid) + actualBids.reduce((acc, { bid }) => acc + Number(bid), 0);
    const userBalance = await transaction.getRepository(Balance).findOneBy({ user: { id: userId } });
    return userBalance.amount - blockedAmount >= 0;
  }
}
