import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { LotTag } from '../lot-tag/lot-tag.entity';
import { Bid } from '../bid/bid.entity';
import { LotPhoto } from '../lot-photo/lot-photo.entity';
import { User } from '../user/user.entity';

export enum LotStatusEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity()
export class Lot extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'real' })
  minimalPrice: number;

  @Column({ type: 'integer' })
  step: number;

  @Column({ type: 'enum', enum: LotStatusEnum, default: LotStatusEnum.OPEN })
  status: LotStatusEnum;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @UpdateDateColumn()
  lastModified: Date;

  @CreateDateColumn()
  createDate: Date;

  @ManyToMany(() => LotTag)
  @JoinTable()
  tags?: LotTag[];

  @OneToMany(() => Bid, (bid) => bid.lot)
  bids?: Bid[];

  @OneToMany(() => LotPhoto, (photo) => photo.lot, { cascade: true })
  photos?: LotPhoto[];

  @ManyToOne(() => User, (user) => user.lots)
  user: User;
}
