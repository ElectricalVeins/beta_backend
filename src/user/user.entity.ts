import {
  BeforeInsert,
  BeforeUpdate,
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
import * as bcrypt from 'bcrypt';
import { Role, RolesEnum } from '../role/role.entity';
import { BaseModel } from '../utils/BaseModel';
import config from '../config/configuration-expert';
import { RefreshToken } from '../token-refresh/token-refresh.entity';
import { Tier } from '../tier/tier.entity';
import { Balance } from '../balance/balance.entity';
import { Bid } from '../bid/bid.entity';
import { Lot } from '../lot/lot.entity';

const SALT = config.get('app.security.salt');

export enum UserStatusEnum {
  BLOCKED = 'BLOCKED',
  ONLINE = 'ONLINE', // ??? extract to separate boolean field or to redis flag
  ACTIVE = 'ACTIVE', // after email activation
  INACTIVE = 'INACTIVE', // before email confirmation
}

export async function hashPassword(): Promise<void> {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(SALT));
  }
}

@Entity()
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    default: UserStatusEnum.INACTIVE,
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;

  @Column({ nullable: true })
  preferredTimezone: string;

  @UpdateDateColumn()
  lastModified: Date;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  role: RolesEnum;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken;

  @ManyToOne(() => Tier, (tier) => tier.user, { nullable: false })
  tier: Tier;

  @OneToOne(() => Balance, { nullable: false })
  @JoinColumn()
  balance: Balance;

  @OneToMany(() => Bid, (bid) => bid.user)
  bids: Bid[];

  @OneToMany(() => Lot, (lot) => lot.user)
  lots: Lot[];

  @BeforeInsert()
  @BeforeUpdate()
  async prepareUser(): Promise<void> {
    const [balance] = await Promise.all([Balance.save({}), hashPassword.call(this)]);
    this.balance = balance;
  }

  static async checkPassword(user: User, checkPassword: string): Promise<boolean> {
    return bcrypt.compare(checkPassword, user.password);
  }
}
