import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';

enum BalanceStatus {
  OK = 'OK',
  BLOCKED = 'BLOCKED',
  UNAPPROVED = 'UNAPPROVED',
}

@Entity()
export class Balance extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: BalanceStatus, default: BalanceStatus.UNAPPROVED })
  status: BalanceStatus;

  @UpdateDateColumn()
  lastModified: Date;
}
