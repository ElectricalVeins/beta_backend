import { TransactionTypeEnum } from '../transaction.entity';

export class CreateTransactionDto {
  userId: number;

  amount: number;

  description: string;

  transactionType: TransactionTypeEnum;

  entityName?: string;

  entityId?: number;
}
