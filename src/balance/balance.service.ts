import { Injectable, Logger } from '@nestjs/common';
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

  async transferMoney(payer: number, receiver: number, amount: number, transaction: EntityManager): Promise<void> {
    const repo = transaction.getRepository(Balance);
    /*TODO: add info to transaction table*/
    const [payerBalance, receiverBalance] = await Promise.all([
      repo.findOne({ where: { user: { id: payer } } }),
      repo.findOne({ where: { user: { id: receiver } } }),
    ]);
    if (payerBalance.amount - amount < 0) {
      /*TODO: if true - decide what to do. Finish auction with another winner, finish without winner and just close Or block a user money from balance to secure logic from this flow*/
      // throw new BadRequestException('Payer doesnt have enough money');
      Logger.error('Payer doesnt have enough money', 'BalanceService');
    }
    await repo.update(payer, { amount: payerBalance.amount - amount });
    await repo.update(payer, { amount: receiverBalance.amount + amount });
  }
}
