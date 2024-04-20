import { Column, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../user/user.entity';
import { BaseModel } from '../../../utils/BaseModel';
import ApiProperty from '../../../utils/decorators/ApiProperty';

enum BalanceStatus {
  OK = 'OK',
  BLOCKED = 'BLOCKED',
  UNAPPROVED = 'UNAPPROVED',
}

@Entity()
export class Balance extends BaseModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'real', default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: BalanceStatus, default: BalanceStatus.UNAPPROVED })
  @ApiProperty()
  status: BalanceStatus;

  @UpdateDateColumn()
  @ApiProperty()
  lastModified: Date;

  @OneToOne(() => User, (user) => user.balance, { nullable: false })
  user: User;
}
