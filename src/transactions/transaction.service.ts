import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EntityManager, FindManyOptions, UpdateResult } from 'typeorm';
import { Transaction, TransactionEntityNames, TransactionTypeEnum } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccruePayload, DeclineBlockedTransactionPayload } from '../balance/balance.service';
import { JwtPayload } from '../types';

/* TODO: admin routes */
@Injectable()
export class TransactionService {
  static checkUpdateResult(result: UpdateResult, lotId: number): void {
    if (!result.affected) {
      Logger.warn(`Didn't found transaction for this lot(${lotId})`, 'TransactionService');
      throw new BadRequestException(`Didn't found transaction for lot: ${lotId}`);
    }
  }

  async findAll(opts: FindManyOptions /* user: JwtPayload */): Promise<Transaction[]> {
    return await Transaction.find(opts);
  }

  async findOne(id: number, user: JwtPayload): Promise<Transaction> {
    return await Transaction.findOneByOrFail({ id, userId: Number(user.userid) });
  }

  async create(dto: CreateTransactionDto, transactionManager?: EntityManager): Promise<Transaction> {
    return await (transactionManager
      ? transactionManager.getRepository(Transaction).save(dto)
      : Transaction.save({ ...dto }));
  }

  async topUpUserBalance(desiredAmount: number, user: JwtPayload): Promise<any> {
    return {};
  }

  async confirmBlockedTransaction(payload: AccruePayload, transactionManager: EntityManager): Promise<void> {
    const { lotId, payerId, amount, bidId } = payload;
    const repo = transactionManager.getRepository(Transaction);
    /*Must be one blocked transaction for lot. Other transactions are declined*/
    const result = await repo.update(
      {
        user: { id: payerId },
        amount,
        entityId: Number(lotId),
        entityName: TransactionEntityNames.LOT,
        transactionType: TransactionTypeEnum.BLOCKED,
      },
      {
        transactionType: TransactionTypeEnum.EXPENSE,
        description: `Expense (${amount}) for bid(${bidId}) on winning lot(${lotId})`,
      }
    );
    TransactionService.checkUpdateResult(result, lotId);
  }

  async declineBlockedTransaction(
    payload: DeclineBlockedTransactionPayload,
    transactionManager: EntityManager
  ): Promise<void> {
    const { lotId, amount, oldPayerId: user } = payload;

    const result = await transactionManager
      .createQueryBuilder()
      .update(Transaction)
      .set({ transactionType: TransactionTypeEnum.DECLINED })
      .where('user = :user', { user })
      .andWhere('entityId = :entityId', { entityId: lotId })
      .andWhere('entityName = :entityName', { entityName: TransactionEntityNames.LOT })
      .andWhere('transactionType = :type', { type: TransactionTypeEnum.BLOCKED })
      .andWhere('amount = :amount', { amount })
      .execute();
    TransactionService.checkUpdateResult(result, lotId);
  }
}
