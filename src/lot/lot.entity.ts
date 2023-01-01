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
import ApiProperty from '../utils/decorator/ApiProperty';
import ApiRelation from '../utils/decorator/ApiRelation';

export enum LotStatusEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DISABLED = 'DISABLED',
}

@Entity()
export class Lot extends BaseModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column({ type: 'real' })
  price: number;

  @ApiProperty()
  @Column({ type: 'real' })
  minimalPrice: number;

  @ApiProperty()
  @Column({ type: 'integer' })
  step: number;

  @ApiProperty()
  @Column({ type: 'enum', enum: LotStatusEnum, default: LotStatusEnum.OPEN })
  status: LotStatusEnum;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column()
  userId: number;

  @ApiProperty()
  @UpdateDateColumn()
  lastModified: Date;

  @ApiProperty()
  @CreateDateColumn()
  createDate: Date;

  @ApiRelation()
  @ManyToMany(() => LotTag)
  @JoinTable()
  tags?: LotTag[];

  @ApiRelation('user')
  @OneToMany(() => Bid, (bid) => bid.lot)
  bids?: Bid[];

  @ApiRelation()
  @OneToMany(() => LotPhoto, (photo) => photo.lot, { cascade: true })
  photos?: LotPhoto[];

  @ApiRelation()
  @ManyToOne(() => User, (user) => user.lots)
  user: User;
}
