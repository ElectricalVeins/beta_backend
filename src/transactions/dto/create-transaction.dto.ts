import { TransactionTypeEnum } from '../transaction.entity';

export class CreateTransactionDto {
  amount: number;

  transactionType: TransactionTypeEnum;

  description: string;

  entityName: string;

  entityId: number;

  userId: number;
}
