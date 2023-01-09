import { Column, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { User } from '../user/user.entity';
import ApiProperty from '../utils/decorator/ApiProperty';
import ApiRelation from '../utils/decorator/ApiRelation';

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

  @Column()
  userId: number;

  @UpdateDateColumn()
  @ApiProperty()
  lastModified: Date;

  @OneToOne(() => User, (user) => user.balance, { nullable: false })
  @ApiRelation()
  user: User;
}
