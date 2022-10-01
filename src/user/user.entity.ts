import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Role, RolesEnum } from '../role/role.entity';
import { BaseModel } from '../utils/BaseModel';
import { config } from '../config/configuration-expert';
import { RefreshToken } from '../token-refresh/token-refresh.entity';
import { Tier } from '../tier/tier.entity';

const SALT = config.get('app.security.salt');

export enum UserStatusEnum {
  BLOCKED = 'BLOCKED',
  ONLINE = 'ONLINE', // ??? extract to separate boolean field or to redis flag
  ACTIVE = 'ACTIVE', // after email activation
  INACTIVE = 'INACTIVE', // before email confirmation
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

  @Exclude()
  @ManyToOne(() => Tier, (tier) => tier.user, { nullable: false, lazy: true })
  tier: Tier;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(SALT));
    }
  }

  static async checkPassword(user: User, checkPassword: string): Promise<boolean> {
    return bcrypt.compare(checkPassword, user.password);
  }
}
