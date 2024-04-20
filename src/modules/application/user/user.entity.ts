import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Tier } from '../tier/tier.entity';
import { Balance } from '../balance/balance.entity';
import { Bid } from '../bid/bid.entity';
import { Lot } from '../lot/lot.entity';
import { Transaction } from '../transactions/transaction.entity';
import configurationExpert from '../../../config/configuration-expert';
import { BaseModel } from '../../../utils/BaseModel';
import ApiProperty from '../../../utils/decorators/ApiProperty';
import ApiRelation from '../../../utils/decorators/ApiRelation';
import { Role } from '../role/role.entity';

const SALT = configurationExpert.get('app.security.salt');

export enum UserStatusEnum {
  BLOCKED = 'BLOCKED',
  ONLINE = 'ONLINE', // ??? extract to separate boolean field or to redis flag
  ACTIVE = 'ACTIVE', // after email activation
  INACTIVE = 'INACTIVE', // before email confirmation
}

@Entity()
export class User extends BaseModel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Index({ unique: true })
  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    default: UserStatusEnum.INACTIVE,
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;

  @ApiProperty()
  @Column({ nullable: true })
  preferredTimezone: string;

  @ApiProperty()
  @UpdateDateColumn()
  lastModified: Date;

  @ApiProperty()
  @CreateDateColumn()
  createDate: Date;

  @ApiRelation()
  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  role: Role;

  @ManyToOne(() => Tier, (tier) => tier.user, { nullable: false })
  @ApiRelation()
  tier: Tier;

  @ApiRelation()
  @OneToOne(() => Balance, (balance) => balance.user, { nullable: false })
  @JoinColumn()
  balance: Balance;

  @ApiRelation()
  @OneToMany(() => Bid, (bid) => bid.user)
  bids: Bid[];

  @ApiRelation()
  @OneToMany(() => Lot, (lot) => lot.user)
  lots: Lot[];

  @ApiRelation()
  @OneToMany(() => Transaction, (t) => t.user)
  transactions: Transaction[];

  @BeforeInsert()
  async prepareUser(): Promise<void> {
    const balance = await Balance.save({});
    this.balance = balance;
  }
}
