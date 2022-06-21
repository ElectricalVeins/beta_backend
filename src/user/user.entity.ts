import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, RolesEnum } from '../role/role.entity';
import { BaseModel } from '../utils/BaseModel';
import { config } from '../config/configuration-expert';

const SALT = config.get('app.security.salt');

export const enum UserStatusEnum {
  BLOCKED = 'BLOCKED',
  ONLINE = 'ONLINE', // ??? extract to separate boolean field
  ACTIVE = 'ACTIVE', // after email activation
  INACTIVE = 'INACTIVE', // before email confirmation
}

@Entity()
export class User extends BaseModel {
  readonly IGNORED_FIELDS = ['password'];

  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  login: string;

  @Column()
  password: string;

  @Index({ unique: true })
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: UserStatusEnum.INACTIVE,
  })
  status: UserStatusEnum;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  role: RolesEnum;

  @UpdateDateColumn()
  lastModified: Date;

  @CreateDateColumn()
  createDate: Date;

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
