import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lot } from '../lot/lot.entity';
import { User } from '../user/user.entity';
import { BaseModel } from '../../../utils/BaseModel';
import ApiProperty from '../../../utils/decorators/ApiProperty';
import ApiRelation from '../../../utils/decorators/ApiRelation';

export enum BidStatusEnum {
  ACTUAL = 'ACTUAL',
  OUTBID = 'OUTBID',
  WIN = 'WIN',
}

@Entity()
export class Bid extends BaseModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'real' })
  bid: number;

  @ApiProperty()
  @Column({ type: 'enum', enum: BidStatusEnum, default: BidStatusEnum.ACTUAL })
  status: BidStatusEnum;

  @Column()
  userId: number;

  @ApiProperty()
  @CreateDateColumn()
  createDate: Date;

  @ApiRelation()
  @ManyToOne(() => Lot, (lot) => lot.bids, { nullable: false })
  lot: Lot;

  @ApiRelation()
  @ManyToOne(() => User, (user) => user.bids, { nullable: false })
  user: User;
}
