import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Balance } from './balance.entity';
import { Bid } from '../bid/bid.entity';
import { TransactionService } from '../transactions/transaction.service';
import { Transaction, TransactionEntityNames, TransactionTypeEnum } from '../transactions/transaction.entity';
import { JwtPayload } from '../types';

export type AccruePayload = {
  lotId: number;
  bidId: number;
  amount: number;
  receiverId: number;
  payerId: number;
};

export type BlockedTransactionPayload = {
  lotId: number;
  bidId: number;
  amount: number;
  payerId: number;
};

export type DeclineBlockedTransactionPayload = {
  lotId: number;
  oldPayerId: number;
  amount: number;
};

@Injectable()
export class BalanceService {
  constructor(private readonly transactionService: TransactionService) {}

  async getUserBalance(user: JwtPayload): Promise<Balance> {
    return Balance.findOneOrFail({ where: { user: { id: Number(user.userid) } } });
  }

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

  async changeUserBalance(
    payload: { userId: number; amount: number },
    isIncome: boolean,
    transactionManager: EntityManager
  ): Promise<void> {
    const { userId, amount } = payload;
    const repo = transactionManager.getRepository(Balance);
    const balance = await repo.findOneBy({ user: { id: userId } });
    const newAmount = isIncome ? balance.amount + amount : balance.amount - amount;
    const { affected } = await repo.update(balance.id, { amount: newAmount });
    if (!affected) {
      Logger.warn(`Didn't found balance for user(${userId})`, 'BalanceService');
      throw new BadRequestException(`Didn't found balance for user: ${userId}`);
    }
  }

  async accrueMoneyForLot(payload: AccruePayload, transactionManager: EntityManager): Promise<Transaction> {
    const { receiverId, lotId, amount } = payload;
    await this.transactionService.confirmBlockedTransaction(payload, transactionManager);
    await this.changeUserBalance({ userId: receiverId, amount }, true, transactionManager);
    return await this.transactionService.create(
      {
        amount,
        userId: receiverId,
        description: `Add amount(${amount}) for lot(${lotId})`,
        transactionType: TransactionTypeEnum.INCOME,
        entityId: lotId,
        entityName: TransactionEntityNames.LOT,
      },
      transactionManager
    );
  }

  async blockAmountForBid(payload: BlockedTransactionPayload, transactionManager: EntityManager): Promise<Transaction> {
    const { bidId, payerId, amount, lotId } = payload;
    await this.changeUserBalance({ userId: payerId, amount }, false, transactionManager);
    return await this.transactionService.create(
      {
        amount,
        userId: payerId,
        description: `Block amount(${amount}) for bid(${bidId}) on lot(${lotId})`,
        transactionType: TransactionTypeEnum.BLOCKED,
        entityId: lotId,
        entityName: TransactionEntityNames.LOT,
      },
      transactionManager
    );
  }

  async declineTransactionAfterOutbid(
    payload: DeclineBlockedTransactionPayload,
    transactionManager: EntityManager
  ): Promise<void> {
    const { oldPayerId, amount } = payload;
    await this.transactionService.declineBlockedTransaction(payload, transactionManager);
    await this.changeUserBalance({ userId: oldPayerId, amount }, true, transactionManager);
  }
}
