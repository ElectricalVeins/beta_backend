import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Balance } from './balance.entity';
import { Bid } from '../bid/bid.entity';
import { TransactionService } from '../transactions/transaction.service';
import { Transaction, TransactionEntityNames, TransactionTypeEnum } from '../transactions/transaction.entity';
import { JwtPayload } from '../../../types';

type BalanceChangePayload = {
  userId: number;
  amount: number;
  description: string;
  transactionType: TransactionTypeEnum;
  entityId?: number;
  entityName?: TransactionEntityNames;
};

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
  constructor(private readonly dataSource: DataSource, private readonly transactionService: TransactionService) {}

  public async getUserBalance(user: JwtPayload): Promise<Balance> {
    return Balance.findOneOrFail({ where: { user: { id: Number(user.userid) } } });
  }

  public async topUpUserBalance(user: JwtPayload, amount: number): Promise<Balance> {
    return await this.dataSource.transaction('READ UNCOMMITTED', async (transaction) => {
      await this.changeUserBalance(
        {
          userId: Number(user.userid),
          amount,
          description: `Top up(${amount}) for user(${user.userid})`,
          transactionType: TransactionTypeEnum.INCOME,
        },
        true,
        transaction
      );
      return await transaction.getRepository(Balance).findOneOrFail({ where: { user: { id: Number(user.userid) } } });
    });
  }

  public async checkUserBalance(
    userId: number,
    actualBids: Bid[],
    newBid: number,
    transaction: EntityManager
  ): Promise<boolean> {
    const blockedAmount = Number(newBid) + actualBids.reduce((acc, { bid }) => acc + Number(bid), 0);
    const userBalance = await transaction.getRepository(Balance).findOneBy({ user: { id: userId } });
    return userBalance.amount - blockedAmount >= 0;
  }

  private async changeUserBalance(
    payload: BalanceChangePayload,
    isIncome: boolean,
    transactionManager: EntityManager,
    shouldCreateTransactionHistory = true
  ): Promise<Transaction> {
    const { userId, amount, transactionType, description, entityName, entityId } = payload;
    const repo = transactionManager.getRepository(Balance);
    const balance = await repo.findOneBy({ user: { id: userId } });
    const newAmount = isIncome ? balance.amount + amount : balance.amount - amount;
    const { affected } = await repo.update(balance.id, { amount: newAmount });
    if (!affected) {
      Logger.warn(`Didn't found balance for user(${userId})`, 'BalanceService');
      throw new BadRequestException(`Didn't found balance for user: ${userId}`);
    }
    if (shouldCreateTransactionHistory) {
      return await this.transactionService.create(
        {
          amount,
          userId: Number(userId),
          description,
          transactionType,
          entityId,
          entityName,
        },
        transactionManager
      );
    }
  }

  public async accrueMoneyForLot(payload: AccruePayload, transactionManager: EntityManager): Promise<Transaction> {
    const { receiverId, lotId, amount } = payload;
    await this.transactionService.confirmBlockedTransaction(payload, transactionManager);
    return await this.changeUserBalance(
      {
        userId: receiverId,
        amount,
        description: `Add amount(${amount}) for lot(${lotId})`,
        transactionType: TransactionTypeEnum.INCOME,
        entityId: lotId,
        entityName: TransactionEntityNames.LOT,
      },
      true,
      transactionManager
    );
  }

  public async blockAmountForBid(
    payload: BlockedTransactionPayload,
    transactionManager: EntityManager
  ): Promise<Transaction> {
    const { bidId, payerId, amount, lotId } = payload;
    return await this.changeUserBalance(
      {
        userId: payerId,
        amount,
        description: `Block amount(${amount}) for bid(${bidId}) on lot(${lotId})`,
        transactionType: TransactionTypeEnum.BLOCKED,
        entityId: lotId,
        entityName: TransactionEntityNames.LOT,
      },
      false,
      transactionManager
    );
  }

  public async declineTransactionAfterOutbid(
    payload: DeclineBlockedTransactionPayload,
    transactionManager: EntityManager
  ): Promise<void> {
    const { oldPayerId, amount } = payload;
    await this.transactionService.declineBlockedTransaction(payload, transactionManager);
    await this.changeUserBalance(
      {
        userId: oldPayerId,
        amount,
        description: '',
        transactionType: TransactionTypeEnum.INCOME, // useless, due to...
      },
      true,
      transactionManager,
      false // ...this flag
    );
  }
}
