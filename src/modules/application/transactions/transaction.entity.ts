import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/user.entity';
import { BaseModel } from '../../../utils/BaseModel';
import ApiProperty from '../../../utils/decorators/ApiProperty';
import ApiRelation from '../../../utils/decorators/ApiRelation';

export enum TransactionTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  BLOCKED = 'BLOCKED',
  DECLINED = 'DECLINED',
}

export enum TransactionEntityNames {
  BID = 'BID',
  LOT = 'LOT',
}

@Entity()
export class Transaction extends BaseModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'real' })
  amount: number;

  @ApiProperty()
  @Column({ type: 'enum', enum: TransactionTypeEnum })
  transactionType: TransactionTypeEnum;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @CreateDateColumn()
  createDate: Date;

  @Column({ nullable: true })
  @ApiProperty()
  entityName: string;

  @Column({ nullable: true })
  @ApiProperty()
  entityId: number;

  @ApiRelation()
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
