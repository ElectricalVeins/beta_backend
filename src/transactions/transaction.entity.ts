import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import ApiProperty from '../utils/decorator/ApiProperty';
import ApiRelation from '../utils/decorator/ApiRelation';
import { User } from '../user/user.entity';

export enum TransactionTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  BLOCKED = 'BLOCKED',
}

export enum TransactionEntityNames {
  BID = 'BID',
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
  entityName: string;

  @Column({ nullable: true })
  entityId: number;

  @ApiRelation()
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
