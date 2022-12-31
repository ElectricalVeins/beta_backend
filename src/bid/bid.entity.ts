import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { Lot } from '../lot/lot.entity';
import { User } from '../user/user.entity';

export enum BidStatusEnum {
  ACTUAL = 'ACTUAL',
  BEAT = 'BEAT',
  WIN = 'WIN',
}

@Entity()
export class Bid extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  bid: number;

  @Column({ type: 'enum', enum: BidStatusEnum, default: BidStatusEnum.ACTUAL })
  status: BidStatusEnum;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => Lot, (lot) => lot.bids, { nullable: false })
  lot: Lot;

  @ManyToOne(() => User, (user) => user.bids, { nullable: false, eager: true })
  user: User;
}
