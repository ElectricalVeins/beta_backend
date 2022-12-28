import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { Lot } from '../lot/lot.entity';
import { User } from '../user/user.entity';

enum BidStatus {
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

  @Column({ type: 'enum', enum: BidStatus, default: BidStatus.ACTUAL })
  status: BidStatus;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => Lot, (lot) => lot.bids, { nullable: false, lazy: true })
  lot: Promise<Lot>;

  @ManyToOne(() => User, (user) => user.bids, { nullable: false, eager: true })
  user: User;
}
